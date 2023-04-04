# Refer to github to follow this deployment script: https://gist.github.com/BenSampo/aa5f72584df79f679a7e603ace517c14

# Turn on maintenance mode
$PHP_PATH artisan down || true

# Pull the latest changes from the git repository
# git reset --hard
# git clean -df
git pull origin $BRANCH

# Install/update composer dependecies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Restart FPM
( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service $PHP_FPM reload ) 9>/tmp/fpmlock

# Run database migrations
$PHP_PATH artisan migrate --force

# Clear caches
$PHP_PATH artisan cache:clear

# Clear expired password reset tokens
$PHP_PATH artisan auth:clear-resets

# Clear and cache routes
$PHP_PATH artisan route:cache

# Clear and cache config
$PHP_PATH artisan config:cache

# Clear and cache views
$PHP_PATH artisan view:cache

# Install node modules
# npm ci

# Build assets using Laravel Mix
# npm run production

# Turn off maintenance mode
$PHP_PATH artisan up
