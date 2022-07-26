<?php
include "Config.php";
include "utils.php";

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, HEAD, OPTIONS, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, authorization');
// header('P3P: CP="IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA"');
if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
  header("HTTP/1.1 204 No Content");
  exit;
}
$dbConn =  connect($db);
/*
  listar todos los posts o solo uno
 */
if ($_SERVER['REQUEST_METHOD'] == 'GET'){
    if (isset($_GET['cnc']))
    {
      $cnc = $_GET['cnc'];
      //Mostrar un post
      $sql = $dbConn->prepare("SELECT * FROM cnc$cnc");
      $sql->execute();
      $sql->setFetchMode(PDO::FETCH_ASSOC);
      header("HTTP/1.1 200 OK");
      echo json_encode( $sql->fetchAll() );
      exit();
	  }
    else {
      //Mostrar lista de post
      $sql = $dbConn->prepare("SELECT * FROM cnc1");
      $sql->execute();
      $sql->setFetchMode(PDO::FETCH_ASSOC);
      header("HTTP/1.1 200 OK");
      echo json_encode( $sql->fetchAll()  );
      exit();
	}
}

// Crear un nuevo post Kilo323132
if ($_SERVER['REQUEST_METHOD'] == 'POST'){

  $url_components = parse_url($_SERVER['REQUEST_URI']);
  parse_str($url_components['query'], $params);
  $cnc = $params['cnc'];
    $input = $_POST;
    $nuevo = $_POST; 
    if(count($input)<=0 ){
      $entityBody = file_get_contents('php://input');
      //$nuevo =  json_decode($entityBody);
      $nuevo2 =  json_decode($entityBody);
      $nuevo = json_decode(json_encode($nuevo2), true);
    }
    $form = explode("\n", $nuevo['gcode']);
    $varues = ''; 

    //var_dump($nuevo2);
    //var_dump($nuevo); 
    //var_dump(json_decode($nuevo),true);
    //var_dump($nuevo);
    foreach($form as $item){
      //var_dump($item);
      if($item!=""){
        $varues .= "('".trim($item)."'),";      
      } 
    }
    $nombre = $nuevo['nombre'];
    $mueble = $nuevo['mueble'];
    $pieza = $nuevo['pieza'];
    $modulo = $nuevo['modulo']; 
    $ar = $nuevo['ar'];
    $id = $nuevo['id'];
    $cara = $nuevo['cara'];
    $cadena = substr($varues, 0, -1);
    $sql1 = $dbConn->prepare("DELETE FROM cnc$cnc");
    $sql4 = $dbConn->prepare("DELETE FROM datos$cnc");
    $sql1->execute();
    $sql4->execute();
    $sql = "INSERT INTO cnc$cnc (gcode) VALUES $cadena";
    $sql3 = $dbConn->prepare("INSERT INTO `datos$cnc` (`nombre`,`mueble`,`pieza`,`modulo`,`ar`,`id`,`cara`) VALUES ('$nombre','$mueble','$pieza','$modulo','$ar','$id','$cara')");
    $sql3->execute();
    $statement = $dbConn->prepare($sql);
    bindAllValues($statement, $input);
    $statement->execute();
    $sql2 = $dbConn->prepare("SELECT * FROM cnc$cnc");
    $sql5 = $dbConn->prepare("SELECT * FROM datos$cnc");
    $sql2->execute();
    $sql2->setFetchMode(PDO::FETCH_ASSOC);
    $sql5->execute();
    $sql5->setFetchMode(PDO::FETCH_ASSOC);
    header("HTTP/1.1 200 OK");
    // echo("POST enviado con exito\n");
    // echo json_encode( $sql2->fetchAll());
    echo json_encode( $sql5->fetchAll());
    exit();
}

//Borrar
if ($_SERVER['REQUEST_METHOD'] == 'DELETE'){
	$id = $_GET['id'];
  $statement = $dbConn->prepare("DELETE FROM posts where id=:id");
  $statement->bindValue(':id', $id);
  $statement->execute();
	header("HTTP/1.1 200 OK");
	exit();
}

//Actualizar
if ($_SERVER['REQUEST_METHOD'] == 'PUT'){
    $input = $_GET;
    $postId = $input['id'];
    $fields = getParams($input);

    $sql = "
          UPDATE posts
          SET $fields
          WHERE id='$postId'
           ";

    $statement = $dbConn->prepare($sql);
    bindAllValues($statement, $input);

    $statement->execute();
    header("HTTP/1.1 200 OK");
    exit();
}


//En caso de que ninguna de las opciones anteriores se haya ejecutado
header("HTTP/1.1 400 Bad Request");

?>