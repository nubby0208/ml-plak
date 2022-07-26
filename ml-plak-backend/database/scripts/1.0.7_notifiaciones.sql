-- ----------------------------
-- Triger para Inserta Notificaciones de los usuarios
-- ----------------------------

DELETE FROM mk_notificaciones;


DROP TABLE IF EXISTS `mk_notificaciones_usuarios`;
CREATE TABLE `mk_notificaciones_usuarios`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `notificacion_id` int UNSIGNED NOT NULL,
  `sector_id` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int UNSIGNED NOT NULL,
  `num_vista` tinyint NOT NULL DEFAULT 0,
  `vista` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `mk_notificaciones_usuarios_notificacion_id_fk`(`notificacion_id`) USING BTREE,
  INDEX `mk_notificaciones_usuarios_usuario_id_fk`(`usuario_id`) USING BTREE,
  ADD UNIQUE INDEX `KU_notificaciones_usuarios`(`notificacion_id`, `usuario_id`),
  CONSTRAINT `mk_notificaciones_usuarios_notificacion_id_fk` FOREIGN KEY (`notificacion_id`) REFERENCES `mk_notificaciones` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `mk_notificaciones_usuarios_usuario_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;





ALTER TABLE `mk_notificaciones_usuarios` 
ADD UNIQUE INDEX `KU_notificaciones_usuarios`(`notificacion_id`, `usuario_id`);


CREATE TRIGGER `trig_notificacion_insert` AFTER INSERT ON `mk_notificaciones` FOR EACH ROW BEGIN

  INSERT INTO mk_notificaciones_usuarios  (id, notificacion_id, sector_id, usuario_id, num_vista, vista, created_at) 
  SELECT null, NEW.id, NEW.sector_id, usuarios.id, 0, 0, now() FROM usuarios WHERE activo = 1 ;

END;



CREATE VIEW view_notif_us_activas AS
SELECT n.id, n.sector_id, n.periodo_repeticion_id, n.titulo, n.contenido, n.fecha_inicio, n.fecha_fin, n.activo,
	nUs.usuario_id,n.num_repeticion, nUs.num_vista, nUs.vista
	FROM mk_notificaciones AS n
	LEFT JOIN mk_notificaciones_usuarios AS nUs
	ON nUs.notificacion_id = n.id
WHERE CURRENT_DATE BETWEEN n.fecha_inicio AND n.fecha_fin
AND n.num_repeticion >= nUs.num_vista ;