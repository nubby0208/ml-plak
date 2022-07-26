alter  table ml_plak.piezas
add va_suelta integer null DEFAULT 0;
alter  table ml_plak.piezas
add control_estado_id integer null DEFAULT 9;
alter  table ml_plak.piezas
add suelta_estado_id integer null DEFAULT 9;

update ml_plak.piezas set suelta_estado_id=9 where 1=1;
update ml_plak.piezas set control_estado_id=9 where 1=1;
update ml_plak.piezas set va_suelta=0 where 1=1;


alter  table ml_plak.modulos
add control_estado_id integer null DEFAULT 9;
alter  table ml_plak.modulos
add piezas_sueltas integer null DEFAULT 0;
alter  table ml_plak.modulos
add piezas_sueltas_controladas integer null DEFAULT 0;

update ml_plak.modulos set control_estado_id=9 where 1=1;
update ml_plak.modulos set piezas_sueltas=0 where 1=1;
update ml_plak.modulos set piezas_sueltas_controladas=0 where 1=1;