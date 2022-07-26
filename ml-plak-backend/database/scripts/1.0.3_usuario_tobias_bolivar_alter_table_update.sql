alter  table usuarios
add visible_en_planilla integer null after cuit_cuil;

update usuarios set visible_en_planilla=1 where 1=1;
