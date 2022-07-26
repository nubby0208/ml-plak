-- ----------------------------
-- ALTER TABLA:  
-- TABLA: proyectos_actividades
-- Trigger: 
-- VIEW: view_
-- ----------------------------

-- -----------------------------------------
-- Table structure for proyectos_actividades

DROP TABLE IF EXISTS `proyectos_actividades`;
CREATE TABLE `proyectos_actividades`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `proyecto_id` int UNSIGNED NOT NULL,
  `actividad_id` int UNSIGNED NOT NULL,
  `usuario_id` int UNSIGNED NOT NULL,
  `fecha_inicio` timestamp(0) NULL DEFAULT NULL,
  `fecha_fin` timestamp(0) NULL DEFAULT NULL,
  `tiempo` int NULL DEFAULT NULL,
  `actividad` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `observacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `proyectos_actividades_usuario_id_fk`(`usuario_id`) USING BTREE,
  INDEX `proyectos_actividades_proyecto_id_fk`(`proyecto_id`) USING BTREE,
  CONSTRAINT `proyectos_actividades_usuario_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `proyectos_actividades_proyecto_id_fk` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos_json` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;


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
