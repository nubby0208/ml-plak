ALTER TABLE ml_plak.usuarios 
ADD fecha_ingreso date NULL AFTER nombre_completo;

ALTER TABLE ml_plak.rangos 
ADD suma_no_remunerativa decimal (8,2) NULL AFTER valor;

ALTER TABLE ml_plak.configuraciones_mensuales 
ADD jubilacion float (8,2) NULL AFTER status,
ADD innslp float (8,2) NULL AFTER jubilacion,
ADD obra_social float (8,2) NULL AFTER innslp,
ADD sindicato float (8,2) NULL AFTER obra_social,
ADD seguro_vida float (8,2) NULL AFTER sindicato,
ADD asignacion_extraordinaria float (8,2) NULL AFTER seguro_vida;

ALTER TABLE ml_plak.configuraciones_mensuales 
ADD suma_no_remunerativa decimal (8,2) NULL AFTER asignacion_extraordinaria;

ALTER TABLE ml_plak.configuraciones_mensuales 
ADD remu_plus_mes INT NULL AFTER valor_plus_mes,
ADD remu_descuento INT NULL AFTER descuento;

update ml_plak.configuraciones_mensuales set remu_plus_mes=1, remu_descuento=1 where 1=1;

DROP TABLE IF EXISTS ml_plak.`recibo_salarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE ml_plak.`recibo_salarios` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `mes` int(10) NOT NULL,
  `anio` int(10) NOT NULL,
  `dias_laborables` int(10) DEFAULT NULL,
  `dias_laborados` int(10) DEFAULT NULL,
  `horas_trabajadas_reales` float(8,2) NOT NULL DEFAULT '0.00',
  `faltas_justificadas` float(8,2) NOT NULL DEFAULT '0.00',
  `faltas_injustificadas` float(8,2) NOT NULL DEFAULT '0.00',
  `horas_debidas` float(8,2) NOT NULL DEFAULT '0.00',
  `horas_trabajadas` float(8,2) NOT NULL DEFAULT '0.00',
  `horas_extras` float(8,2) NOT NULL DEFAULT '0.00',
  `horas_sabado_ingles` float(8,2) NOT NULL DEFAULT '0.00',
  `horas_feriadas` float(8,2) NOT NULL DEFAULT '0.00',
  `valor_hora` float(8,2) NOT NULL DEFAULT '0.00',
  `valor_suma_no_remunerativa` float(8,2) NOT NULL DEFAULT '0.00',
  `valor_asignacion_extraordinaria` float(8,2) NOT NULL DEFAULT '0.00',
  `valor_hora_sabado_ingles` float(8,2) NOT NULL DEFAULT '0.00',
  `hora_x_falta_justificadas` float(8,2) NOT NULL DEFAULT '0.00',
  `hora_x_falta_injustificadas` float(8,2) NOT NULL DEFAULT '0.00',
  `hora_mas_falta_justificadas` float(8,2) NOT NULL DEFAULT '0.00',
  `valor_hora_extra` float(8,2) NOT NULL DEFAULT '0.00',
  `antiguedad` float(8,2) NOT NULL DEFAULT '0.00',
  `valor_descuento` float(8,2) NOT NULL DEFAULT '0.00',
  `presentismo` float(8,2) NOT NULL DEFAULT '0.00',
  `valor_jubilacion` float(8,2) NOT NULL DEFAULT '0.00', 
  `valor_innslp` float(8,2) NOT NULL DEFAULT '0.00',  
  `valor_obra_social` float(8,2) NOT NULL DEFAULT '0.00', 
  `valor_sindicato` float(8,2) NOT NULL DEFAULT '0.00',
  `valor_seguro_vida` float(8,2) NOT NULL DEFAULT '0.00', 
  `valor_plus_mes` float(8,2) NOT NULL DEFAULT '0.00',
  `subtotal_descuento` float(8,2) NOT NULL DEFAULT '0.00',
  `subtotal_remunerativo` float(8,2) NOT NULL DEFAULT '0.00',
  `subtotal_noremunerativo` float(8,2) NOT NULL DEFAULT '0.00',
  `total` float(8,2) NOT NULL DEFAULT '0.00',
  `status` int(10) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

