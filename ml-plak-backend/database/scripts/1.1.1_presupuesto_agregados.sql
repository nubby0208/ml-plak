
-- ----------------------------
-- ALTER Table structure for mk_ayudas_categorias
-- ----------------------------

ALTER TABLE `mlplak`.`presupuesto` 
ADD COLUMN `asignado_id` int NULL AFTER `usuario_cotizando`,
ADD COLUMN `dificultad_id` int NULL AFTER `asignado_id`,
ADD COLUMN `prioridad_id` int NULL AFTER `dificultad_id`,
ADD COLUMN `seguimiento_id` int NULL AFTER `prioridad_id`,
ADD COLUMN `economia_id` int NULL AFTER `seguimiento_id`;

