-- ----------------------------
-- ALTER TABLA:  
-- TABLA: taller_historiales
-- Trigger: 
-- VIEW: view_historial_talleres
-- ----------------------------

-- ----------------------------
-- Table structure for taller_historiales
-- ----------------------------
DROP TABLE IF EXISTS `taller_historiales`;
CREATE TABLE `taller_historiales`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado_id` int UNSIGNED NOT NULL COMMENT ' Evento Aplicado a el historial',
  `etapa_id` int NULL DEFAULT NULL COMMENT '(6: Nota de acciones, 7:Cajones, 8:Modulos, 9:Control)',
  `usuario_id` int NULL DEFAULT NULL,
  `campo_id` int UNSIGNED NOT NULL,
  `desc_campo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `comentario` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `estado_id_taller_historial_FK`(`estado_id`) USING BTREE,
  CONSTRAINT `estado_id_taller_historial_FK` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;


-- VIEW  DE HISTORIAL TALLER



DROP VIEW IF EXISTS `view_historial_taller`;
CREATE VIEW view_historial_taller AS
SELECT hist.id, hist.estado_id, hist.etapa_id, hist.usuario_id, 
	     hist.campo_id, hist.desc_campo,  hist.comentario,
        hist.created_at,
       us.usuario, us.nombre_completo, est.estado,
  CASE etapa_id
    WHEN 2 THEN 'Stock'
    WHEN 6 THEN 'Nota de acción'
    WHEN 7 THEN 'Cajones'
    WHEN 8 THEN 'Módulos'
		WHEN 9 THEN 'Control'
    ELSE 'UNDEFINED'
  END AS etapa
 
FROM taller_historiales hist
INNER JOIN estados est ON est.id = hist.estado_id
INNER JOIN  usuarios us ON us.id = hist.usuario_id; 







/*
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

*/



/*
SELECT hist.id, hist.estado_id, hist.usuario_id, hist.campo_id, hist.desc_campo, hist.created_at,
us.usuario,
us.nombre_completo,	
est.estado
from taller_historiales hist
INNER JOIN estados est ON est.id = hist.estado_id
INNER JOIN  usuarios us ON us.id = hist.usuario_id 
*/