MLPlak
Son un conjunto de aplicaciones que automatizan las gestiones de cortes de muebles diseñados a medida, además de administración de tareas, asistencia y comunicación de los usuarios que interactúan con dichas aplicaciones.



Paso a paso de la instalación (Actualizado) backend y front
============================================================================

-   Clonar el repositorio 
- 	Ir a la carpeta cd ml-plak-backend por consola 
- 	Abrir el archivo composer.json en la línea 8 colocar la versión de php que estas usando
- 	Usar el comando composer update, verificar que sea efectivo y no haya errores de haber actualizar componer en el equipo 
- 	Verificar la versión de node instalada debe ser 9+
- 	Ir a la carpeta disenio 
- 	Ejecutar el comando npm install, verificar que no hayan errores, de haber errores instalar angular en el equipo, luego ir a la raíz del proyecto “cd..” y ejecutar nuevamente npm install, una vez termine ir de nuevo a “cd disenio” y ejecutar nuevamente npm install ya no deberían hacer errores 
- 	Para la base de datos bajar un respaldo del app y montar el .sql en la base de datos local (verificar que no esté habilidad el dump de instalación mas ligero)
- 	Regresar al a carpeta ml-plak-backend y abirir el archivo routes/api.php  en la línea 28 modificar $tokenStatus = 2 => $tokenStatus = 1 
-   Configurar el archivo .env con la configuración de la base de datos local
- 	Regresar a la carpeta diseño en al ruta config/dev.env.js, configurar correctamente el url del backend debería ser http://localhost:8000/
- 	ir a la carpeta ml-plak-backend/vendor ya la deberías tener de no tenerla ir al paso 4, una ves la tengas ingresar a la ruta vendor\laravel\framework\src\Illuminate\Database\Query\Builder.php en la línea 1229 eliminar el parámetro operador 
- 	Luego iniciar el backend con php artisan server y en la carpeta diseño iniciar el front con npm run start 
- 	Para crear un usuario podés hacerlo con un seeder Modificar el seed UsuarioTablaSeeder con tu usuario y correrlo
- 	Verificar login y funciones del sistema

====================================================================================



**Esta guía es para front y backend, si tu área de trabajo es solo backend debes apuntar tu backend url a los servidores de staging **

http://staging.mlplak.com/


Puesta en marcha

/**
*
* ** DEPRACADO NO ES NECESARIO **
*	salvo que se debe realizar un trabajo en esta area
*
Taller
Es una app diseñada en Angular.io (v4) ubicada en la raíz del repositorio (/), para su ejecución en desarrollo se debe realizar lo siguiente:

Instalación de paquetes/dependencias: npm install
Versión de Node recomendada: 9+
Ejecución de servidor: npm run start, generando un servidor de pruebas a través de la dirección por defecto: http://localhost:4200
Las variables de entorno para desarrollo están ubicadas en src/environments/environment.ts, por defecto la URL para el backend (API) es: http://localhost:8000/api, localización por defecto de servidor de pruebas de Laravel.

 
============================================================================
  

Instalar Correr el Diseñador 2D y 3D con el servidor Staging
Es una app desarrollado a través de Vue.js y Vuex, se encuentra ubicada en la carpeta disenio, para su ejecución en desarrollo se debe realizar lo siguiente:

Versión de Node recomendada: 9.11.0


Es posible correr Diseño utilizando los endpoints de Staging, de esta manera no será necesario tener corriendo el backend localmente. Para esto se debe correr el siguiente comando: npm run dev-stage.
Todos los cambios que se realicen en proyectos de este modo (guardar módulos, guardar proyectos, etc) se verán reflejados en http://staging.mlplak.com/disenio/#/DesignCenter. De la misma manera, se podrán cargar módulos, proyectos, etc que hayan sido creados en el ambiente de Staging.
Los proyectos que se exporten serán accesibles en Taller en http://staging.mlplak.com/#/taller.
Por último, si se desea sincronizar el proyecto con 3DViewer, se podrá hacer de la siguiente manera:

Acceder a http://staging.mlplak.com/3dviewer/

/**
*
* **Omitir salvo que sea necesario**
*
Abrir las Developer Tools y dirigirse a la pestaña de Network
Copiar el token de proyecto que se está utilizando y que se puede ver en el request del endpoint all_parts (ej: de0f72e9313ebd378f1b047704e98058)
En Disenio, pegar el token en src\constants.js, STAGING_PROJECT_TOKEN. Importante: En producción, el valor de STAGING_PROJECT_TOKEN siempre debe ser null. No commitear STAGING_PROJECT_TOKEN con otro valor que no sea null.

Luego de haber realizado estos pasos, los cambios que se realicen en Diseño, se podrán ver en el 3D.
Para conseguir un nuevo token, crear un nuevo proyecto desde http://staging.mlplak.com/disenio/#/DesignCenter

Backend (API) información adicional 

Es la API utilizada por las apps ML-Plak, es desarrollado a través del framework de PHP: Laravel y se encuentra alojado en la carpeta ml-plak-backend,  para su ejecución en desarrollo se debe realizar lo siguiente:

Instalación de paquetes/dependencias: composer install

Ejecución de servidor: php artisan serve, generando un servidor de pruebas a través de la dirección por defecto: http://localhost:8000
# disenio

> Centro de Diseño

## Requirements

``` Be warned!: if there is a syntax error after installing dependencies without any errors it traces back due to bugs while parsing characters to the default server configuration, so you should delete those '///' dashes if you see the error
nodejs=12.5.0 ###Versiones anteriores y mas recientes tienen funcionalidades en desuso y sintaxis aparte.

PHP Server: see instructions for a correct configuration at ml-plak-backend README file
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

 - REQUISITOS DE BACKEND:
  - Ir a la linea 8 del archivo composer json y cambiar la version de php por la utilizada por defecto en el sistema para evitar errores en la configuracion del arbol
 
 - CONFIGURACION DEL ENTORNO 
  - En .env se alojan las variables necesarias para migrar apropiadamente la base de datos, esto quiere decir que los datos que se encuentran en este archivo deben 
  coincidir con los utilizados para realizar las conexiones en la base de datos. Una vez importado la base de datos de la aplicacion, las variables que son criticas
  para la instalacion en una maquina local son las variables con 'DB'. Estas se pueden cambiar por los valores utilizados para importar la base de datos. Una vez hecho 
  eso no es necesario utilizar artisan de vuelta.
 - Instalación de paquetes/dependencias: `composer install`
  - Ejecución de servidor: `php artisan serve`, generando un servidor de pruebas a través de la dirección por defecto: `http://localhost:8000`

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Servidor CNC

En caso de usar el servidor CNC ubicado en la carpeta `cnc`, es necesario configurar la conexión a su base de datos, el archivo de configuración se encuentra en `cnc/api/cnc/Config.php`

``` php
<?php

$db = [
    'host' => 'localhost',
    'username' => 'root',
    'password' => 'pass',
    'db' => 'database' //Cambiar al nombre de tu base de datos
];
```

Puede correr usando el comando `php -S 0.0.0.0:8081` si cambia el puerto verifique el puerto utilizado para `localhost` en disenio en su respectivo entorno







