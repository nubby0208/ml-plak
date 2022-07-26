@servers(['deployer' => 'deploy-production@93.188.167.214'])

@setup
    $project = "ml-plak";
    $repository = 'git@gitlab.com:hernanrocha93/' . $project . '.git';
    $releases_dir = '/var/www/production/releases/source';
    $app_dir = '/var/www/production/server';
	$dir_3dviewer = '/var/www/production/frontend/3dviewer';
	$dir_disenio2d = '/var/www/production/frontend/disenio2d';
	$dir_cnc = '/var/www/production/server/cnc';
    # $app_dir = '~/' . $project . '/' . $mode;

    $release_date = date('YmdHis');
    $new_release_dir = $releases_dir .'/'. $release_date;

    $cnc_config_path = '/var/www/production/server/cnc_config.php';

    $docker_app_dir = $app_dir;
    $docker_new_release_dir = $new_release_dir . '/ml-plak-backend';
    $docker_new_3dviwer = $new_release_dir . '/3dviewer';
    $docker_new_disenio2d = $new_release_dir . '/Design_2D';
    $docker_new_cnc = $new_release_dir . '/cnc';
@endsetup

@story('deploy')
    clone_repository
    run_composer
    update_symlinks
@endstory

@task('clone_repository', [ 'on' => ['deployer'] ])
    echo 'Cloning repository'
    [ -d {{ $releases_dir }} ] || mkdir -p {{ $releases_dir }}
    git clone --branch production --depth 1 {{ $repository }} {{ $new_release_dir }}
    # chmod a+rx {{ $new_release_dir }}
@endtask

@task('run_composer', [ 'on' => ['deployer'] ])
    echo "Run composer on workspace"
    cd {{ $docker_new_release_dir }}
    composer update --prefer-dist -o
    php artisan optimize
    #php artisan route:cache
    php artisan cache:clear
    php artisan config:cache
    php artisan config:clear
    php artisan storage:link
    echo 'Run ClientTemplatesSeeder'
    php artisan db:seed --class=ClientTemplatesSeeder
    composer dump-autoload
@endtask

@task('update_symlinks', [ 'on' => ['deployer'] ])
	echo "Linking storage directory"
	rm -rf {{ $docker_new_release_dir }}/storage
	ln -nfs {{ $docker_app_dir }}/storage {{ $docker_new_release_dir }}/storage    
	# ln -nfs {{ $docker_app_dir }}/storage/app/public {{ $docker_new_release_dir }}/public/storage

	echo 'Linking .env file'
	ln -nfs {{ $docker_app_dir }}/.env {{ $docker_new_release_dir }}/.env

	echo 'Set permission to cookie.txt'
	setfacl -m u:nginx:rwx {{ $docker_new_release_dir}}/app/Http/Controllers/cookie.txt

	echo 'Linking current release'
	ln -nfs {{ $docker_new_release_dir }} {{ $docker_app_dir }}/current

	echo 'Linking new folder 3dviewer'
	ln -nfs {{ $docker_new_3dviwer }} {{ $dir_3dviewer }}

	echo 'Linking new folder disenio2d'
	ln -nfs {{ $docker_new_disenio2d }} {{ $dir_disenio2d }}

	echo 'Linking new folder cnc'
	ln -nfs {{ $docker_new_cnc }} {{ $dir_cnc }}

    echo 'Linking new config'
    /bin/cp --force {{ $cnc_config_path }} {{ $dir_cnc }}/api/cnc/Config.php
@endtask

@task('migrate', [ 'on' => ['deployer'] ])
    php artisan migrate --force
@endtask
