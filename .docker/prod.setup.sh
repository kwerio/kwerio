#!/bin/bash

set -ex

apt-get update
apt-get upgrade -y
rm -rf /var/lib/apt/lists/*

hostname -I | awk -F "." '{ print $1"."$2"."$3".1 host.docker.internal" }' >> /etc/hosts

cd /var/www/html

groupmod --non-unique --gid $GROUP_ID www-data
usermod --non-unique --uid $USER_ID --shell /bin/bash www-data

if [ ! -d /var/www/.config ]; then
    mkdir /var/www/.config
    chown www-data:www-data /var/www/.config
fi

if [ ! -d /var/www/.npm ]; then
    mkdir /var/www/.npm
    chown www-data:www-data /var/www/.npm
fi

if [ ! -d /var/www/html/vendor ]; then
    composer install --optimize-autoloader --no-dev
    php artisan key:generate
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ ! -L public/storage ]; then
    php artisan storage:link
    chown -h www-data:www-data public/storage
fi

if [ ! -d /var/www/html/node_modules ]; then
    npm install
    rm -f public/*.js
    rm -rf public/fonts
    rm -rf public/js
    npm run prod
fi

if [ -n "$(ls -A storage/logs 2>/dev/null)" ]; then
    rm -rf storage/logs/*
fi

if [ ! -d public/i18n ]; then
    node po2json.js
fi

chmod g+s storage/logs
chmod 775 storage/logs
setfacl -d -m u::rwX,g::rwX,o::r- storage/logs || true

chown -R www-data:www-data storage
chown -R www-data:www-data /var/www/html/public

apache2-foreground