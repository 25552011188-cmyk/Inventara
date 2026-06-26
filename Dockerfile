FROM php:8.2-apache

# Install PHP extensions dan dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo_mysql \
        zip \
        opcache \
        intl

# AGRESIF: Hapus semua MPM modules yang konflik
RUN rm -f /etc/apache2/mods-enabled/mpm_event.* \
    && rm -f /etc/apache2/mods-enabled/mpm_worker.* \
    && rm -f /etc/apache2/mods-enabled/mpm_itk.* \
    && a2enmod mpm_prefork rewrite

WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

# Install composer dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions untuk Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Generate app key dan optimize Laravel
RUN php artisan key:generate --force || true
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Configure Apache document root ke folder public Laravel
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf && \
    sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80

# Set PORT environment variable buat Railway
ENV PORT=80

CMD ["apache2-foreground"]