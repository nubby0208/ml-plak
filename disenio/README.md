# disenio

> Centro de Diseño

## Requirements



``` Be warned!: if there is a syntax error after installing dependencies without any errors it traces back due to bugs while parsing characters to the default server configuration, so you should delete those '///' dashes if you see the error
nodejs=12.x ###other versions create syntax errors

PHP Server: see instructions for a correct configuration at ml-plak-backend README file
```

## Development Setup (running at localhost)

``` bash
# install dependencies
npm install

#config server path
In the project go to 'mlplak/src/environments/' path and change 'environment.ts' file:

   Comment line 11:
   //API_URL: 'http://ml-plak3.test:75/api',

   Uncomment line 12:
   API_URL: 'http://staging.mlplak.com/server/api',

# serve with hot reload at localhost:8080
npm run dev-stage

```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
