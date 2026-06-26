FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN if [ -f .env.example ]; then cp .env.example .env; fi

RUN composer install --optimize-autoloader --no-dev

RUN php artisan key:generate --force

# Setup environment
RUN php artisan config:clear
RUN php artisan cache:clear
RUN php artisan route:clear

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8080

# Tambahin output biar kita tau aplikasi start
CMD php artisan serve --host=0.0.0.0 --port=8080 --verbose