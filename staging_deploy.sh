#!/bin/bash

echo "Deploying staging"
echo "Deploy disenio"
cd ~
docker-compose -f docker-compose.yml up vue_mlplak_build

echo "Deploy Front"
docker-compose -f docker-compose.yml up front_vue_mlplak_build

# deploy laravel
echo "Deploy backend"
docker exec -u mlplak php_mlplak sh -c "cd /app/ &&
                                            echo '*** composer install ***' &&
                                                composer install &&
                                            echo '*** php artisan optimize ***' &&
                                                php artisan optimize &&
                                            echo '*** php artisan cache:clear ***' &&
                                                php artisan cache:clear &&
                                            echo '*** php artisan config:cache ***' &&
                                                php artisan config:cache &&
                                            echo '*** php artisan config:clear ***' &&
                                                php artisan config:clear &&
                                            echo '*** php artisan storage:link ***' &&
                                                php artisan storage:link &&
                                            echo '*** php artisan db:seed --class=ClientTemplatesSeeder  ***' &&
                                                php artisan db:seed --class=ClientTemplatesSeeder &&
                                            echo '*** composer dump-autoload ***' &&
                                                composer dump-autoload"
