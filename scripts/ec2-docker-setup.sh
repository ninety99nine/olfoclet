#!/bin/bash
# One-time EC2 bootstrap for Telcoflo V1 (Ubuntu). Installs Docker + Compose +
# AWS CLI and prepares the app directory. Idempotent — the deploy workflow only
# runs it when docker/aws are missing. Modeled on the V2 setup.
set -e

DEPLOY_USER="${SUDO_USER:-${USER:-ubuntu}}"
APP_PATH="${APP_PATH:-/var/www/telcoflo-v1}"

if ! command -v docker >/dev/null 2>&1; then
  echo "=== Installing Docker Engine + Compose plugin ==="
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg unzip
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --batch --yes --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  echo "=== Docker already installed — skipping ==="
fi

echo "=== Adding $DEPLOY_USER to docker group ==="
sudo usermod -aG docker "$DEPLOY_USER" 2>/dev/null || true

if ! command -v aws >/dev/null 2>&1; then
  echo "=== Installing AWS CLI v2 (for ECR login) ==="
  ARCH=$(uname -m); [ "$ARCH" = "aarch64" ] && AWSARCH=aarch64 || AWSARCH=x86_64
  curl -sS "https://awscli.amazonaws.com/awscli-exe-linux-${AWSARCH}.zip" -o /tmp/awscliv2.zip
  (cd /tmp && unzip -q awscliv2.zip && sudo ./aws/install && rm -rf aws awscliv2.zip)
fi

echo "=== Preparing app directory: $APP_PATH ==="
sudo mkdir -p "$APP_PATH"
sudo chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_PATH"

cat <<'NOTE'

=== Bootstrap complete ===

ECR access: the deploy workflow logs in with the CI IAM user's key on every run
(aws ecr get-login-password | docker login), so no instance role is strictly
required. For a role-based setup instead, attach AmazonEC2ContainerRegistryReadOnly
to this instance and the workflow login still works.

Open inbound port 80 (and 443 if you add TLS) in the EC2 security group.
Next deploy to `main` will pull the image and bring the stack up.
NOTE
