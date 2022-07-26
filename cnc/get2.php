<?php 
    include("insertar.php");
    $datos = $_POST['dato'];
    $sql3 = "SELECT * FROM `$datos`";
    $gc = [];
    $resultado = db_query($sql3);    
    if($resultado->num_rows>0){
    while($fila=$resultado->fetch_array())  {
        $nombre = $fila['nombre'];
        $gc[] = $nombre;
        $mueble = $fila['mueble'];
        $gc[] = $mueble;
        $pieza = $fila['pieza'];
        $gc[] = $pieza;
        $modulo = $fila['modulo'];
        $gc[] = $modulo;
        $ar = $fila['ar'];
        $gc[] = $ar;
        $id = $fila['id'];
        $gc[] = $id;
        $cara = $fila['cara'];
        $gc[] = $cara;
      }
    }
    $Fig = json_encode($gc);
    //var_dump($Fig);
    echo $Fig;

?>
