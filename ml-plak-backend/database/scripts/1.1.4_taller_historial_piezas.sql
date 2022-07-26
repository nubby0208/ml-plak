-- ----------------------------
-- ALTER TABLA:  piezas, tapacantos
-- TABLA: piezas_historiales
-- Trigger tabla piezas:  trig_piezas_historial_piezas_insert, trig_piezas_historial_piezas_update
-- Trigger tabla tapacantos:  trig_tapacantos_historial_piezas_insert, trig_tapacantos_historial_piezas_update
-- VIEW: view_historial_piezas
-- ----------------------------

ALTER TABLE `piezas` 
ADD COLUMN `usuario_id` int NULL DEFAULT NULL AFTER `tapacantos_estado_id`;


ALTER TABLE `tapacantos` 
ADD COLUMN `usuario_id` int NULL AFTER `material_id`;



-- ----------------------------
-- Table structure for piezas_historiales
-- ----------------------------
DROP TABLE IF EXISTS `piezas_historiales`;
CREATE TABLE `piezas_historiales`  (
  `pieza_id` int UNSIGNED NOT NULL,
  `estado_id` int UNSIGNED NOT NULL,
  `etapa_id` int NULL DEFAULT NULL COMMENT '(1:Cortes, 2:Tapacantos, 3:Prearmados)',
  `usuario_id` int NULL DEFAULT NULL,
  `comentario` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  INDEX `pieza_id_historial_FK`(`pieza_id`) USING BTREE,
  INDEX `estado_id_historial_FK`(`estado_id`) USING BTREE,
  CONSTRAINT `estado_id_historial_FK` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `pieza_id_historial_FK` FOREIGN KEY (`pieza_id`) REFERENCES `piezas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;





DROP TRIGGER IF EXISTS `trig_piezas_historial_piezas_insert`;
delimiter ;;
CREATE TRIGGER `trig_piezas_historial_piezas_insert` AFTER INSERT ON `piezas` FOR EACH ROW 

 
    INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, comentario, created_at) 
    VALUES (NEW.id, NEW.estado_id, 1, NEW.usuario_id, NEW.comentario, now() )  

;;


 DROP TRIGGER IF EXISTS `trig_piezas_historial_piezas_update`;
delimiter ;;

CREATE TRIGGER `trig_piezas_historial_piezas_update` AFTER UPDATE ON `piezas` FOR EACH ROW 

    IF (NEW.estado_id = OLD.estado_id) THEN
      -- PREARMADO = 3
        INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, created_at) 
        VALUES (NEW.id, NEW.prearmado_estado_id, 3,  NEW.usuario_id, now() ) ;

    

    ELSE     
      -- CORTE  = 1
      INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, created_at) 
        VALUES (NEW.id, NEW.estado_id, 1, NEW.usuario_id, now() ) ;

    END IF
			
  ;;

DROP TRIGGER IF EXISTS `trig_tapacantos_historial_piezas_insert`;
delimiter ;;
  CREATE TRIGGER `trig_tapacantos_historial_piezas_insert` AFTER INSERT ON `tapacantos` FOR EACH ROW 
      INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, created_at) 
      VALUES (NEW.pieza_id, NEW.estado_id, 2, NEW.usuario_id, now() )
;;

DROP TRIGGER IF EXISTS `trig_tapacantos_historial_piezas_update`;

delimiter ;;
  CREATE TRIGGER `trig_tapacantos_historial_piezas_update` AFTER UPDATE ON `tapacantos` FOR EACH ROW 

    INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, created_at) 
    VALUES (NEW.pieza_id, NEW.estado_id, 2, NEW.usuario_id, now() ) 
;;



-- VIEW  DE PIEZAS

CREATE VIEW view_historial_piezas AS
SELECT hist.*, piez.id_aux, 
 CASE etapa_id
    WHEN 1 THEN 'Cortes'
    WHEN 2 THEN 'Tapacantos'
    WHEN 3 THEN 'Prearmado'
    ELSE 'UNDEFINED'
  END AS etapa,
	us.usuario,
	us.nombre_completo,	
piez.pieza, est.estado             
FROM `piezas_historiales` AS hist
INNER JOIN piezas piez ON piez.id = hist.pieza_id
INNER JOIN estados est ON est.id = hist.estado_id
INNER JOIN  usuarios us ON us.id = hist.usuario_id;