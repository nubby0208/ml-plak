-------------------------------
-- Table structure for proyecto_etapas
-- ----------------------------
DROP TABLE IF EXISTS `proyecto_etapas`;
CREATE TABLE `proyecto_etapas`  (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,  
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB; 

-------------------------------
-- Table structure for error_proyecto_motivos
-- ----------------------------
DROP TABLE IF EXISTS `error_proyecto_motivos`;
CREATE TABLE `error_proyecto_motivos`  (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,  
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB; 

-------------------------------
-- Table structure for proyecto_areas
-- ----------------------------
DROP TABLE IF EXISTS `proyecto_areas`;
CREATE TABLE `proyecto_areas`  (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,  
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB; 

-- ----------------------------
-- Table structure for control_errores_proyectos
-- ----------------------------
DROP TABLE IF EXISTS `control_errores_proyecto_areas`;
CREATE TABLE `control_errores_proyecto_areas`  (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `proyecto_area_type` int(10) unsigned NOT NULL,
  `proyecto_area_id` int(10) unsigned NOT NULL,  
  `proyecto_etapa_id` int(10) unsigned NOT NULL,
  `error_proyecto_motivo_id` int(10) unsigned NOT NULL,
  `comentario` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `control_errores_proyecto_areas_proyecto_etapa_id_foreign` FOREIGN KEY (`proyecto_etapa_id`) REFERENCES `proyecto_etapas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `control_errores_proyecto_areas_proyecto_area_type_foreign` FOREIGN KEY (`proyecto_area_type`) REFERENCES `proyecto_areas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `control_errores_proyecto_areas_error_proyecto_motivo_id_foreign` FOREIGN KEY (`error_proyecto_motivo_id`) REFERENCES `error_proyecto_motivos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

INSERT INTO `proyecto_etapas` VALUES (1,'Diseño','2022-06-19 04:00:00','2022-06-19 04:00:00'),(2,'Cortes','2022-06-19 04:00:00','2022-06-19 04:00:00'),(3,'Tapacantos','2022-06-19 04:00:00','2022-06-19 04:00:00'),(4,'Prearmado','2022-06-19 04:00:00','2022-06-19 04:00:00'),(5,'Módulo','2022-06-19 04:00:00','2022-06-19 04:00:00'),(6,'Cajón','2022-06-19 04:00:00','2022-06-19 04:00:00'),(7,'Control','2022-06-19 04:00:00','2022-06-19 04:00:00'),(8,'Instalación','2022-06-19 04:00:00','2022-06-19 04:00:00');
INSERT INTO `proyecto_areas` VALUES (1,'Cortes','2022-06-19 04:00:00','2022-06-19 04:00:00'),(2,'Tapacantos','2022-06-19 04:00:00','2022-06-19 04:00:00'),(3,'Prearmado','2022-06-19 04:00:00','2022-06-19 04:00:00'),(4,'Notas de Acción','2022-06-19 04:00:00','2022-06-19 04:00:00'),(5,'Cajones','2022-06-19 04:00:00','2022-06-19 04:00:00'),(6,'Módulos','2022-06-19 04:00:00','2022-06-19 04:00:00');
INSERT INTO `error_proyecto_motivos` VALUES (1,'Estaba mal cortada la pieza.','2022-06-19 04:00:00','2022-06-19 04:00:00'),(2,'Estaba mal diseñada la pieza.','2022-06-19 04:00:00','2022-06-19 04:00:00'),(3,'Estaba dañada la pieza.','2022-06-19 04:00:00','2022-06-19 04:00:00'),(4,'Era de otro color la pieza.','2022-06-19 04:00:00','2022-06-19 04:00:00'),(5,'Estaba mal prearmada la pieza.','2022-06-19 04:00:00','2022-06-19 04:00:00'),(6,'Se dañó en el traslado la pieza.','2022-06-19 04:00:00','2022-06-19 04:00:00'),(7,'Se dañó en la instalación la pieza.','2022-06-19 04:00:00','2022-06-19 04:00:00'),(8,'Se me dañó a mi la pieza.','2022-06-19 04:00:00','2022-06-19 04:00:00');
