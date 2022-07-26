
<?php
include("insertar.php");
$directorio = 'archivos/';

//var_dump($data);

$subir_archivo = $directorio.basename($_FILES['subir_archivo']['name']);
$dd = $_POST['cnc'];
$base = $_POST['dato'];
$dato = json_decode($_POST['datos']);
//$nombre = $_POST['nombre'];
if (move_uploaded_file($_FILES['subir_archivo']['tmp_name'], $subir_archivo)) {
        $archivo = file_get_contents($subir_archivo); //Guardamos archivo.txt en $archivo
        $archivo = ucfirst($archivo); //Le damos un poco de formato
        $gcode = explode("\n", $archivo);
        $gcode2 = json_decode($gcode);   
        insertar($gcode,$dd,$base,$dato);
    }
    unlink($subir_archivo);
   // header("Refresh:0; url=/"); 
?>






