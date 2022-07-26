alter  table ml_plak.usuarios
add afip integer null DEFAULT 0;

update ml_plak.usuarios set afip=0 where 1=1;