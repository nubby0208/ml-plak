<?php
include "api/cnc/Config.php";
function db_query($query) {
    global $db;
    $connection = mysqli_connect($db['host'],$db['username'],$db['password'],$db['db']);
    $result = mysqli_query($connection,$query);
    return $result;
}
 function insertar($form_data,$db,$base,$dato){
    
    $fields = array_keys($form_data);
    $varues = '';
    foreach($form_data as $item){
        $varues .= "('".$item."'),";      
    }
    $cadena = substr($varues, 0, -1);
    borrar($db,$base);  
    $sql = "INSERT INTO `$base` (`nombre`,`mueble`,`pieza`,`modulo`,`ar`,`id`,`cara`) VALUES ('$dato[0]','$dato[1]','$dato[2]','$dato[3]','$dato[4]','$dato[5]','$dato[6]')" ;
    $sql2 = "INSERT INTO `$db` (`gcode`) VALUES $cadena" ;
    //$sql3 = "SELECT * FROM `cnc1`";
    db_query($sql);
    db_query($sql2);
    $sql3 = "SELECT * FROM `$db`";
    $gc = [];
    $resultado = db_query($sql3);    
    if($resultado->num_rows>0){    
        while($fila=$resultado->fetch_array())  {            
            $gcode = $fila['gcode'];
            $gc[] = $gcode;
        }
    }
    $Fig = json_encode($gc);
    //var_dump($Fig);
    echo $Fig;    
}

function select_datos($field_name){
	$sql = "SELECT gcode FROM datos";
	$db=db_query($sql);
	$GLOBALS['row'] = mysqli_fetch_object($db);
	return $sql;
}

function borrar($db,$base){
    $sql = "DELETE FROM $db ";
    $sql2 = "DELETE FROM $base ";
    $n1 = db_query($sql);
    $n2 = db_query($sql2);    
    return $n1;
}
?>
