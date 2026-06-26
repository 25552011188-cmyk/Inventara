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

# Copy .env.example ke .env
RUN if [ -f .env.example ]; then cp .env.example .env; fi

# PENTING: Override DB_CONNECTION jadi mysql (biar nggak nyoba pake SQLite)
RUN sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/g' .env

# Install composer dependencies
RUN composer install --optimize-autoloader --no-dev

# Generate APP_KEY (aman, nggak butuh database)
RUN php artisan key:generate --force

# Fix permissions
RUN chmod -R 777 storage bootstrap/cache
RUN chown -R www-data:www-data /var/www/html

EXPOSE 8080
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]