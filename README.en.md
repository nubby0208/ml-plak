Configure the .env file with the local database configuration and create database ml_plak
---------------Inside ml-plak-backend folder
-Use the composer update command, verify that it is effective and there are no errors of having updated compose on the computer.
-Use the php artisan migrate command. or You could load sql file.
-vendor\laravel\framework\src\Illuminate\Database\Query\Builder.php in line 1229 delete operator parameter

















ML Plak
They are a set of applications that automate custom-designed furniture cut management, as well as task management, assistance and communication of users who interact with these applications.



Step by step installation (Updated) backend and front
==================================================== ===========================

- Clone the repository
- Go to folder cd ml-plak-backend by console
- Open the composer.json file on line 8, put the version of php you are using
- Use the composer update command, verify that it is effective and there are no errors of having updated compose on the computer
- Check installed node version must be 9+
- Go to the design folder
- Execute the npm install command, verify that there are no errors, if there are errors, install angular on the computer, then go to the root of the project “cd..” and execute npm install again, once finished go back to “cd disenio ” and running npm install again should no longer cause errors
- For the database, download a backup of the app and mount the .sql in the local database (verify that the lighter installation dump is not enabled)
- Go back to the ml-plak-backend folder and open the file routes/api.php on line 28 modify $tokenStatus = 2 => $tokenStatus = 1
- Configure the .env file with the local database configuration
- Go back to the design folder in the config/dev.env.js path, correctly configure the backend url should be http://localhost:8000/
- go to the folder ml-plak-backend/vendor you should already have it if you don't have it go to step 4, once you have it enter the path vendor\laravel\framework\src\Illuminate\Database\Query\Builder.php in line 1229 delete operator parameter
- Then start the backend with php artisan server and in the design folder start the front with npm run start
- To create a user you can do it with a seeder Modify the seed UserTablaSeeder with your user and run it
- Verify login and system functions

==================================================== =====================================



**This guide is for front and backend, if your work area is only backend you must point your backend url to the staging servers**

http://staging.mlplak.com/


Start up

/**
*
* ** DEPRACATED IS NOT NECESSARY **
* unless work needs to be done in this area
*
Workshop
It is an app designed in Angular.io (v4) located in the root of the repository (/), for its execution in development the following must be done:

Install packages/dependencies: npm install
Recommended Node version: 9+
Server execution: npm run start, generating a test server through the default address: http://localhost:4200
The environment variables for development are located in src/environments/environment.ts, by default the URL for the backend (API) is: http://localhost:8000/api, default location of the Laravel test server.

 
==================================================== ===========================
 

Install Run the 2D and 3D Designer with the Staging server
It is an app developed through Vue.js and Vuex, it is located in the design folder, for its execution in development the following must be done:

Recommended Node version: 9.11.0


It is possible to run Design using the Staging endpoints, in this way it will not be necessary to have the backend running locally. For this, the following command must be run: npm run dev-stage.
All changes made to projects in this way (saving modules, saving projects, etc) will be reflected in http://staging.mlplak.com/disenio/#/DesignCenter. In the same way, modules, projects, etc. that have been created in the Staging environment can be loaded.
Projects that are exported will be accessible in Taller at http://staging.mlplak.com/#/taller.
Finally, if you want to synchronize the project with 3DViewer, you can do it as follows:

Access http://staging.mlplak.com/3dviewer/

/**
*
* **Omit unless necessary**
*
Open the Developer Tools and go to the Network tab
Copy the project token that is being used and that can be seen in the all_parts endpoint request (ex: de0f72e9313ebd378f1b047704e98058)
In Disenio, paste the token into src\constants.js, STAGING_PROJECT_TOKEN. Important: In production, the value of STAGING_PROJECT_TOKEN must always be null. Do not commit STAGING_PROJECT_TOKEN with a value other than null.

After having carried out these steps, the changes made in Design can be seen in 3D.
To get a new token, create a new project from http://staging.mlplak.com/disenio/#/DesignCenter

Backend (API) additional information

It is the API used by ML-Plak apps, it is developed through the PHP framework: Laravel and is located in the ml-plak-backend folder, for its execution in development the following must be done:

Install packages/dependencies: composer install

Server execution: php artisan serve, generating a test server through the default address: http://localhost:8000
# design

> Design Center

## Requirements

``` Be warned!: if there is a syntax error after installing dependencies without any errors it traces back due to bugs while parsing characters to the default server configuration, so you should delete those '///' dashes if you see the error
nodejs=12.5.0 ###Older and newer versions have deprecated features and separate syntax.

PHP Server: see instructions for a correct configuration at ml-plak-backend README file
```

## Build Setup

``` try
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

- BACKEND REQUIREMENTS:
- Go to line 8 of the composer json file and change the php version to the one used by default in the system to avoid errors in the tree configuration
 
- ENVIRONMENT CONFIGURATION
- In .env the necessary variables are housed to properly migrate the database, this means that the data found in this file must be
match those used to make connections to the database. Once the application database is imported, the variables that are critical
for installation on a local machine are the variables with 'DB'. These can be changed to the values ​​used to import the database. Once done
that is not necessary to use artisan again.
- Installation of packages/dependencies: `composer install`
- Server execution: `php artisan serve`, generating a test server through the default address: `http://localhost:8000`

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue- loader).


## CNC server

In case of using the CNC server located in the `cnc` folder, it is necessary to configure the connection to its database, the configuration file is located in `cnc/api/cnc/Config.php`

```php
<?php

$db = [
'host' => 'localhost',
'username' => 'root',
'password' => 'pass',
'db' => 'database' //Change to your database name
];
```

You can run using the command `php -S 0.0.0.0:8081` if you change the port check the port used for `localhost` in design in your respective environment







