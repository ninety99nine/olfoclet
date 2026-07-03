# syntax=docker/dockerfile:1
#
# Telcoflo V1 — production-grade multi-stage image (nginx + php-fpm live in
# separate containers; this image is the php-fpm application runtime and also
# ships the built public/ assets that the nginx container serves via a shared
# volume). See docker/README.md and docs/EXECUTION_PLAN.md Phase 7.

# ---------------------------------------------------------------------------
# Stage 1 — Frontend assets (Laravel Mix / webpack, Node 20)
# ---------------------------------------------------------------------------
FROM node:20-bookworm-slim AS assets

WORKDIR /app

# Install JS deps against the lockfile first (better layer caching).
COPY package.json package-lock.json ./
RUN npm ci

# Build the production bundles (public/js, public/css, public/mix-manifest.json).
COPY . .
RUN npm run prod

# ---------------------------------------------------------------------------
# Stage 2 — PHP dependencies (Composer, no dev, optimised autoloader)
# ---------------------------------------------------------------------------
FROM composer:2 AS vendor

WORKDIR /app

# Install PHP deps against the lockfile without running scripts (no artisan yet).
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --optimize-autoloader \
        --no-interaction \
        --no-scripts \
        --prefer-dist

# ---------------------------------------------------------------------------
# Stage 3 — Runtime (php:8.2-fpm on Debian bookworm)
# ---------------------------------------------------------------------------
FROM php:8.2-fpm-bookworm AS runtime

# System libraries required by the PHP extensions below.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libicu-dev \
        libzip-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libonig-dev \
        libxml2-dev \
        zlib1g-dev \
        default-mysql-client \
        git \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        mbstring \
        xml \
        intl \
        bcmath \
        zip \
        gd \
        opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Tuned PHP config (OPcache per report §7.1, FPM pool per §7.2). The pool config
# REPLACES the image's default www.conf (a second file would define a duplicate
# [www] pool and FPM would refuse to start).
COPY docker/php/opcache.ini   /usr/local/etc/php/conf.d/zz-opcache.ini
COPY docker/php/php.ini        /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php/www.conf       /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/html

# Application source (respecting .dockerignore), then the built artefacts from
# the earlier stages layered on top.
COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public ./public

# Entrypoint: waits for the DB, migrates, caches config/routes, etc.
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Run as the non-root www-data user; make the writable paths owned by it.
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

USER www-data

EXPOSE 9000

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
