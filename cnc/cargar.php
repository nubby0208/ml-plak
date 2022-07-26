<?php
    #ejemplode.com
    include("insertar.php");
    $archivo = file_get_contents("Perfilado.gcode"); //Guardamos archivo.txt en $archivo
    $archivo = ucfirst($archivo); //Le damos un poco de formato
    $gcode = explode("\n", $archivo);
    $gcode2 = json_decode($gcode);
    insertar($gcode);
?>
