
<?php 
    include("insertar.php");
    $gcode = json_decode($_POST['gcode']);
    $cnc = $_POST['cnc'];
    $base = $_POST['dato'];
    $dato = json_decode($_POST['datos']);
    insertar($gcode,$cnc,$base,$dato);
?>
