-- TEST SELECT id, id_aux, pieza, estado_id, tapacantos_estado_id,  prearmado_estado_id, usuario_id,  created_at, updated_at, modulo_id
-- FROM piezas WHERE id = 6325 
-- NEW.prearmado_estado_id IS NOT NULL )


        DROP TRIGGER IF EXISTS `trig_tapacantos_historial_piezas_insert`;
        DROP TRIGGER IF EXISTS `trig_tapacantos_historial_piezas_update`;
        DROP TRIGGER IF EXISTS `trig_piezas_historial_piezas_insert`;
	DROP TRIGGER IF EXISTS `trig_piezas_historial_piezas_update`;


        ALTER TABLE `mlplak`.`piezas_historiales` 
                ADD COLUMN `id` int NOT NULL AUTO_INCREMENT FIRST,
                ADD PRIMARY KEY (`id`);




/*
delimiter ;;
CREATE TRIGGER `trig_piezas_historial_piezas_insert` AFTER INSERT ON `piezas` FOR EACH ROW 

 
    INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, created_at) 
    VALUES (NEW.id, NEW.estado_id, 1, NEW.usuario_id,  now() )  

;;



delimiter ;;

CREATE TRIGGER `trig_piezas_historial_piezas_update` BEFORE UPDATE ON `piezas` FOR EACH ROW 

BEGIN

-- CORTE = 1
IF (NEW.estado_id != OLD.estado_id) THEN
        INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, created_at) 
        VALUES (NEW.id, NEW.estado_id, 1,  NEW.usuario_id, now() ) ;       
END IF;

-- TAPACANTO = 2
IF (NEW.tapacantos_estado_id != OLD.tapacantos_estado_id)  THEN
        INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, created_at) 
        VALUES (NEW.id, NEW.tapacantos_estado_id, 2,  NEW.usuario_id, now() ) ;
       
END IF;

-- PREARMADO = 3
IF (NEW.prearmado_estado_id != OLD.prearmado_estado_id) THEN   
        INSERT INTO piezas_historiales  (pieza_id, estado_id, etapa_id, usuario_id, created_at) 
        VALUES (NEW.id, NEW.prearmado_estado_id, 3,  NEW.usuario_id, now() ) ;       
END IF;


END
;;

*/