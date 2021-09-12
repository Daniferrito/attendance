Aplicación para pasar lista

[Instrucciones de usu](/INSTRUCCIONES.md)
# Desarrollo
Para desarrollar este proyecto es necesario instalar [node](https://nodejs.org/en/download/current/) (preferiblemente la versión "Current") y [yarn](https://yarnpkg.com/getting-started/install)

La primera vez que se vaya a trabajar con el proyecto, será necesario instalar las dependencias con:
### `yarn install`
## Ejecución local

Para ejecutar localmente el proyecto, simplemente es necesario ejecutar

### `yarn start`
Esto compilará el código y lo servirá de forma local en el navegador. Actualizará la aplicación desplegada automaticamente cada vez que se realize un cambio en el código

## Despliege a Firebase
~~~
Los dos primeros pasos solo es necesario realizarlos la primera vez
~~~

Para desplegar a Firebase, primero será necesario instalar las herramientas de Firebase con
### `npm i -g firebase-tools`

Después será necesario loguearse con la cuenta de firebase:
### `firebase login`

Finalmente, simplemente subir los cambios con
### `yarn run publish`