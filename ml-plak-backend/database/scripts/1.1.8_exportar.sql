ALTER TABLE `exportar`
	ADD COLUMN `mostrar` ENUM('1','0') NULL DEFAULT '1' AFTER `estado`;