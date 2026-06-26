FROM php:8.2-cli

# Install system dependencies (DITAMBAHIN libicu-dev)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libicu-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl

# Clean up apt cache biar image lebih kecil
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy semua file project
COPY . .

# Copy .env.example dan fix DB connection ke mysql
RUN if [ -f .env.example ]; then cp .env.example .env; fi
RUN sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/g' .env

# Install dependencies Laravel
RUN composer install --optimize-autoloader --no-dev

# Generate APP_KEY
RUN php artisan key:generate --force

# Fix permissions storage
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8080

# Jalankan Laravel built-in server
CMD php artisan serve --host=0.0.0.0 --port=8080