-- ----------------------------
-- Table structure for mk_ayudas_categorias
-- ----------------------------
DROP TABLE IF EXISTS `mk_ayudas_categorias`;
CREATE TABLE `mk_ayudas_categorias`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `desc_categoria` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  `activo` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `KU_mk_ayudas_categorias`(`desc_categoria`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;



-- ----------------------------
-- Table structure for mk_ayudas
-- ----------------------------
DROP TABLE IF EXISTS `mk_ayudas`;
CREATE TABLE `mk_ayudas`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoria_id` int UNSIGNED NOT NULL,
  `titulo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contenido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruta_archivo` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ruta_img` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `created_us_id` int NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  `updeated_us_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `KU_mk_ayudas`(`titulo`, `categoria_id`) USING BTREE,
  INDEX `mk_ayudas_categoria_id_fk`(`categoria_id`) USING BTREE,
  CONSTRAINT `mk_ayudas_categoria_id_fk` FOREIGN KEY (`categoria_id`) REFERENCES `mk_ayudas_categorias` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;
