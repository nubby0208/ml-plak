<?php 
    include("insertar.php");
    $cnc = $_POST['cnc'];
    $sql3 = "SELECT * FROM `$cnc`";
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

?>
