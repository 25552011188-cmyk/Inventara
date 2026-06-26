FROM php:8.2-cli

# Install extensions
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev libzip-dev zip unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy files
COPY . .

# Copy .env.example dan fix DB connection
RUN if [ -f .env.example ]; then cp .env.example .env; fi
RUN sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/g' .env

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Setup Laravel
RUN php artisan key:generate --force
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8080

# Start server - PAKAI FORMAT INI
CMD php artisan serve --host=0.0.0.0 --port=8080