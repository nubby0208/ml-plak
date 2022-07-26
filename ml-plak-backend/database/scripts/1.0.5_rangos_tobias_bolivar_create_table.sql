CREATE TABLE ml_plak.rangos (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nombre varchar(50) NOT NULL,
valor decimal (8,2) not null,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE ml_plak.usuarios 
ADD rango_id int NULL AFTER cuit_cuil;

ALTER TABLE ml_plak.usuarios
ADD CONSTRAINT `usuarios_rango_id`
FOREIGN KEY(rango_id)  REFERENCES rangos (id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE ml_plak.configuraciones_mensuales 
ADD rango_id int NULL AFTER usuario_id;

update ml_plak.configuraciones_mensuales set rango_id = 0 where rango_id is null;