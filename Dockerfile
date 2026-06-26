# Kita pake CLI version, bukan Apache, biar gak ada konflik MPM
FROM php:8.2-cli

# Install dependencies yang dibutuhin Laravel (TAMBAHAN: libzip-dev & zip)
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

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy semua file project
COPY . .

# Install dependencies Laravel
RUN composer install --optimize-autoloader --no-dev

# Setup Laravel (Generate key, cache, migrate database)
RUN php artisan key:generate --force
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache
RUN php artisan migrate --force

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 8080 (Default Railway)
EXPOSE 8080

# Jalankan Laravel built-in server
CMD php artisan serve --host=0.0.0.0 --port=8080