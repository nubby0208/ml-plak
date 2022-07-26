#Release 1.0.1 changes

<hr />

##Luis Romero [Mod. nuevo login]()

correr nuevo script sql para Staging y Produccion
este scritp generara una tabla nueva para el control de login

```
1.0.1_loginglog_luis_romero_loginlog_table.sql
```

##Tobias Bolivar [Mod. Tarea]()

correr nuevo script sql para Staging y Produccion
este scritp agregara una nueva columna para la tabla tarea

```
1.0.2_tarea_tobias_bolivar_alter_table.sql
```

##Tobias Bolivar [Mod. Usuarios]()

correr nuevo script sql para Staging y Produccion
este scritp agregara una nueva columna para la tabla usuarios
seguidamente ejecutar una actualizacion del nuevo campo

```
1.0.3_usuario_tobias_bolivar_alter_table_update.sql
```
##Tobias Bolivar [Mod. Inasistencias]()
correr nuevo script sql para Staging y Produccion
este scritp agregara 2 nuevas tablas para gestionar
la inasistencias médicas

```
1.0.4_inasistencias_tobias_bolivar_create_table
```
##Tobias Bolivar [Mod. Rango]()
correr nuevo script sql para Staging y Produccion
este scritp agregara 1 nueva tabla y 2 claves foráneas
para gestionar los rangos en lo asuarios
...
1.0.5_rangos_tobias_bolivar_create_table
...
1.0.9_usuarios_tobias_bolivar_update_table
...