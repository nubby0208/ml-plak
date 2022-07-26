<?php
    include("insertar.php");
    $cnc = $_POST['cnc'];
    $ruto = $_POST['dato'];
    //var_dump($cnc);
    borrar($cnc,$ruto);
?>