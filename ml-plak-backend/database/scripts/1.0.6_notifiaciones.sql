-- ----------------------------
-- Table structure for mk_notificaciones
-- ----------------------------
DROP TABLE IF EXISTS `mk_notificaciones`;
CREATE TABLE `mk_notificaciones`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `sector_id` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `periodo_repeticion_id` int UNSIGNED NULL DEFAULT NULL,
  `titulo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `contenido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_repeticion` tinyint NOT NULL DEFAULT 0,
  `fecha_inicio` date NULL DEFAULT NULL,
  `fecha_fin` date NULL DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `created_us_id` int UNSIGNED NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  `updated_us_id` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;




-- ----------------------------
-- Table structure for mk_notificaciones_usuarios
-- ----------------------------
DROP TABLE IF EXISTS `mk_notificaciones_usuarios`;
CREATE TABLE `mk_notificaciones_usuarios`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `notificacion_id` int UNSIGNED NOT NULL,
  `usuario_id` int UNSIGNED NOT NULL,
  `num_vista` tinyint NOT NULL DEFAULT 0,
  `vista` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `mk_notificaciones_usuarios_notificacion_id_fk`(`notificacion_id`) USING BTREE,
  INDEX `mk_notificaciones_usuarios_usuario_id_fk`(`usuario_id`) USING BTREE,
  CONSTRAINT `mk_notificaciones_usuarios_notificacion_id_fk` FOREIGN KEY (`notificacion_id`) REFERENCES `mk_notificaciones` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `mk_notificaciones_usuarios_usuario_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

