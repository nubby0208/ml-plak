
var URL_BASE = window.location.href.split('.com')[0]+'.com/server';
// var URL_BASE = 'http://staging.mlplak.com/server';
// var URL_BASE = 'http://localhost:8000';

var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();


var orientationList = {
  1 : "Vertical de corte",
  2 : "Horizontal de corte",
  3 : "Vertical de frente",
  4 : "Horizontal de frente",
};

orientationList.getKey = function(value) {
  var object = this;
  return Object.keys(object).find(key => object[key] === value);
};

var link = $('#input-list-spreadsheet').val();
var match = new RegExp("d\/(.*)\/").exec(link);

var currentGuid;

// TOOLS VARS
var viewerSection = document.getElementById('viewer');
var materials = {};

// GUI VARS
var selectedItemIndex;
var items = document.getElementsByClassName("mesh-item");
var form = document.getElementById("mesh-form");
var piecesTable = $('#table-pieces');
var modelsTable = $('#models-table');
var roomTable   = $('#room-table');
var filename;
var proyecto_name;
var cliente_name;

var appData = {
  models: {},
  textures: new Array()
};

const modelsCache = {}

// Se crea el visor 3D
var tool = ViewerTool.viewer;
tool.init(viewerSection);

//Se agregan controladores al editor
var mlPlakMarkers = new MlPlakMarkers({viewer: tool});
var mlModuleSelector = new MlPlakSelector({viewer: tool});
var mlPlakmodelEditor = new MlPlakModelEdition({viewer: tool});
var mlPlakDistanceController = new MlPlakDistanceController({viewer: tool});
const storageService = new StorageService();

/*
 * inicializa la aplicacion cuando la informacion externa fue cargada
 */
function initApp(){
  updateProgress(100);
  initPiecesTable();
  initModelsTable();
  initDistancesTable();

  loadDefaultModel(); //Creo que esto ya no se  usa
  appData['roomObjects'] = getRoomObjectsAvaliable();
  fillRoomObjectSelect( appData['roomObjects'] );
  tool.setAvaliableObjects( appData['roomObjects'] );


  //marcadores
  mlPlakMarkers.setMaxMarkers(100);
  mlPlakMarkers.markerCounterUpdatedCallBack = function(numero){
    $('#markerCount').text(numero.detail.markerCount);
  };
  $('#maxMarkers').text(mlPlakMarkers.getMaxMarkers());

  document.addEventListener('modelPositionChanged', (event) => {
    let pos = event.detail.position;
    editor.setModelEditorPosition(pos.x, pos.y, pos.z);
  });

  document.addEventListener('modelRotationChanged', (event) => {
    let pos = event.detail.rotation;
    editor.setModelEditorRotation(pos.x, pos.y, pos.z);
  });

  document.addEventListener('viewerModuleSelected', (event) => {
    editor.onModuleSelected(event.detail.data);
  });

  document.addEventListener('viewerPieceSelected', (event) => {
    editor.onPieceSelected(event.detail.data);
  });

  document.addEventListener('distanceUpdated', (event) => {
    editor.updateDistanceModel(event.detail.data);
  });

  //cambio de vista.
  document.addEventListener("MLPlakViewerActiveViewChanged",function(v){

     let nombreVistas = {
      'front':'Frontal',
      'back': 'Posterior',
      'left': 'Lateral-izquierdo',
      'right':'Lateral-derecho',
      'top': 'Superior',
      'bottom': 'Inferior',
      'perspective': 'Perspectiva'
     };
    //
     $("#viewName").text(nombreVistas[v.detail.activeView]);
     tool.hud.setCurrentCameraText(nombreVistas[v.detail.activeView]);

  },false);
}

var options = {
  modelsTable: '#table-models',
  piecesTable: '#table-pieces',
  viewer: tool,
  viewerOptions: {
    labels     : '#input-labels',
    grid       : '#grid-check',
    rotation   : '#rotate-check',
    dimensions : '#input-dimensions',
  },
  cameraOptions : {
    view : '.camera-view-option',
  },
  pieceEditor: {
    editor : '#piece-editor',
    index  : '#piece-editor-index',
    model  : '#piece-editor input[name="model"]',
    name   : '#model-editor-model',
    width  : '#piece-editor i' +
        'nput[name="w"]',
    height : '#piece-editor input[name="h"]',
    length : '#piece-editor input[name="l"]',
    x      : '#piece-editor input[name="x"]',
    y      : '#piece-editor input[name="y"]',
    z      : '#piece-editor input[name="z"]',
    visible  : '#piece-editor input[name="visible"]',
    wireframe: '#piece-editor input[name="wireframe"]',
    color    : '#piece-editor input[name="color"]',
    texture        : '#piece-editor select[name="texture"]',
    orientation    : '#piece-editor select[name="orientation"]',
  },
  modelEditor: {
    editor : '#model-editor',
    index  : '#model-editor-index',
    model  : '#model-editor-model',
    comment      : '#model-editor input[name="comment"]',
    description      : '#model-editor input[name="description"]',
    depthMaterial      : '#model-editor input[name="depthMaterial"]',
    defaultMaterial      : '#model-editor input[name="defaultMaterial"]',
    defaultTapacantos      : '#model-editor input[name="defaultTapacantos"]',
    depth      : '#model-editor input[name="depth"]',
    width      : '#model-editor input[name="width"]',
    height      : '#model-editor input[name="height"]',
    y      : '#model-editor input[name="y"]',
    z      : '#model-editor input[name="z"]',
    x      : '#model-editor input[name="x"]',
    y      : '#model-editor input[name="y"]',
    z      : '#model-editor input[name="z"]',
    rx     : '#model-editor input[name="rx"]',
    ry     : '#model-editor input[name="ry"]',
    rz     : '#model-editor input[name="rz"]',
    visible  : '#model-editor input[name="visible"]',
  },
  markers: mlPlakMarkers,
  selector: mlModuleSelector,
  mlPlakmodelEditor,
  editPositionButton: '#edit-position-button',
  storageService,
  mlPlakDistanceController
};

var editor = new Editor(options);


$(document).ready(function(){
  initApp();
});


function loadDefaultModel(){
  /* si un modelo es especificado en la URL, entonces se carga automaticamente. */
  if (QueryString.model !== undefined){
    if (parseInt(QueryString.model) > guidList.length){
      console.log("Modelo seleccionado no valido.");
      return;
    }
    currentGuid = guidList[QueryString.model-1];
    //Descommentar para cargar por defecto un modelo

    loadModel([currentGuid]);
  }

}
/* rellena el elemento select para indicar que modelo se debe cargar al presionar el boton de cargar. */
function fillModelsGuids(){
  for (var i = 1; i <= guidList.length; i++) {
    var select = $('#model-spreadsheet');
    select.append('<option value='+guidList[i-1]+'>MOD'+(i) +'</option>');
  }
}


function updateProgress(progress){
  $("#bar-progress .progress-bar").css("width", progress+"%");
  if (progress < 100){
    $("#viewer").hide();
    $(".spinner").show();
    $("#bar-progress").show();
  }
  else{
    $("#viewer").show();
    $(".spinner").hide();
    $("#bar-progress").hide();
  }
}

/**
 * ELIMINAR ESTA FUNCION. REEMPLAZADA
 * Obtiene la lista de texturas desde el servidor.
 * se esta trayendo tola la lista de texturas y es demasiada
 * informacion para ser procesada a cada rato.
 *
 * proyecto, la version anterior cargaba TODAS las texturas,
 * pero una sola vez al inicio de la aplicacion.
 * hay que revisar el codigo de la version que esta actualmente
 * en staggin y ver como arreglar esto
 * @param {callback} callback funcion
 */
function getTextureList(callback){
  var that = this;
  $.get({
    url: URL_BASE+"/api/materiales",
    success: function(response) {
      var output = [];
      $.each(response.materiales, function(id, material){
        output.push({
          'name':  material.material,
          'texture': material.link_textura1,
          'color':   material.link_textura2
        })

      });
      if (callback){
        callback(output);
      }
    },
    error: function(response){
      console.log("error loading texture info");
      console.log(response);
    }
  });
}

/**
 *
 * @param {array} modelTextureList lista de ids de materiales a obtener
 * @param {function} callback retrollamado que se ejecuta al terminar
 */
function getModelTexturesFromAPI(modelTextureList,callback){
   // cuales texturas ya estan cargadas?
   // sacarlas de la lista si ya estan cargadas.
   // esto usa nombres de texturas. debe usar ids
   var modelTextureListToLoad = modelTextureList.filter(t => !!t); // filtro los elementos vacios

   //por que hay dos listas con los mismos datos?
   //editor.loadedTextures; y appData.textures;
   // solo se consultara una de ellas.
    //modelTextureList

    appData.textures.forEach(element => {
      const index = modelTextureListToLoad.indexOf(element.name)
      if (index > -1) {
        modelTextureListToLoad.splice(index, 1);
        console.log('textura removida: ', element.name);
      }
    });

    if(modelTextureListToLoad.length == 0){
      // nada que leer.
      return;
    }

  var dat = "";
  for(var i =0; i< modelTextureListToLoad.length;  i ++){
    dat += 'names['+ i +']=' + modelTextureListToLoad[i];
    if(i != modelTextureListToLoad.length - 1){
      dat +='&';
    }
  }
  //console.log(dat);

  $.get({
    url: URL_BASE+"/api/materiales/lista/",
    data: dat,
    success: function(response) {
      var output = [];
      $.each(response.materiales, function(id, material){
        output.push({
          'name':  material.material,
          'texture': material.link_textura1,
          'color':   material.link_textura2
        })

      });
      if (callback){
        callback(output);
      }
    },
    error: function(response){
      console.log("error loading texture info");
      console.log(response);
    }
  });
}

/*
* 7 MAR 2019
* Gustavo Vivas.
* Trabajo en progreso.
* el llamado a esta función esta comentado.
*
* 27 FEB 2019
* obtiene las texturas disponibles
* modelTextures: las textures que tiene el modelo
* actualmente es llamada cada 10 segundos para el mismo trabajo
*/
function loadModelTextures(modelTexturesToLoad){

  // getTextureList carga TODAS las texturas del servidor y eso pesa
  // aproximadamente 25 megas (en mi caso tarda casi 15 minutos en cargar)
  // hay que reemplazar la fuhcion que carga los materiales en el backend
  // para que reciba una lista de los nombres de las texturas a cargar ya que
  // NO se pasa el id de las texturas cuando se carga el modelo.
  // al solo cargar las texturas necesarias se reduce el tiempo de carga del sistema
  // facilitando el trabajo. Importante: la funcion original tiene un callback
  // mantenerlo.
  // Otra opcion es crear un nuevo endpoint que reciba un alista de nombres
  // unicos de materiales a cargar y que devuelva solo esos.

  getModelTexturesFromAPI(modelTexturesToLoad,function(texturesList){
    editor.loadedTextures = texturesList;
    appData.textures = texturesList;
    tool.loadTextures(texturesList); //viewer.js
  });

}


// carga la información desde una hoja especifica (guid) del spreadsheet
function loadModel(modelsToLoad){
  updateProgress(0);

  var modelsLoaded = Array(modelsToLoad.length);
  modelsLoaded.fill(false);

  var rows = modelsTable.find('tbody').children();
  for (var i = 0; i < modelsToLoad.length; i++) {
    var guid = modelsToLoad[i];

  }
}

// carga la información desde una hoja especifica (guid) del spreadsheet
function loadModelfromAPi(username){
    var modelTextures = new Array(); //texturas usadas en este modelo
    // busca datos extras de los modulos en vuex para ser agregados a los datos de la api
    let modelsVuex = storageService.getModelsFromVuex();

    var self = this;

    $.ajax({
      type: 'GET',
      url: URL_BASE + '/api/3dviewer/all_parts/'+username,
      crossDomain: true,
      success: function(response) {
        //response = JSON.parse(response);
        //var len = response.feed.entry.length;
        var parsedData = [];
        var materiales = [];
        var models = [];
        var rx = 0;
        var ry = 0;
        var rz = 0;
        var data = response;
        var pieceData = {};
        var model = {};
        var models = {};

        $.each(data.modulos, function(modulo_tag, piezas){
          rx = piezas[0].rotacion_x;
          ry = piezas[0].rotacion_y;
          rz = piezas[0].rotacion_z;
          proyecto_name = piezas[0].proyecto_name;
          parsedData = [];
          pieceData = {};
          for (var j = 0; j < piezas.length; j++) {
            var obj = piezas[j];
            if (obj.length == 0) continue;
            materiales.push(obj.material_name);
            pieceData = {
                index: parsedData.length,
                visible: (obj.visible === 1 ? true : false),
                wireframe:  true,
                name: obj.pieza,
                material: obj.material_name,
                l: parseFloat(obj.lveta),
                w: parseFloat(obj.aveta),
                h: parseFloat(obj.espesor),
                orientation: parseInt(obj.orientacion),
                color: obj.color || '0xF5F5F5',
                texture: obj.textura,
                y: parseFloat(obj.posicion_y),
                x: parseFloat(obj.posicion_x),
                z: parseFloat(obj.posicion_z),
                pattern: {
                  frontWidth : parseFloat(""),
                },
                model: modulo_tag, //"MOD "+ (j + 1),
                modulo_id: obj.modulo_id
            }
            if (pieceData.w == 0 || pieceData.h == 0 || pieceData.l == 0){
              log('danger', 'Pieza "'+pieceData.name + '" del modelo MOD'+modulo_tag+' presenta datos no validos. Se omite.');
              continue;
            }

            //console.log('objeto piezas', pieceData)
            if (isPieceValid(pieceData)){
              parsedData.push(pieceData);
              modelTextures.push(pieceData.material);
              // NOTA: lo ideal es que pieceData.material sea el id del material y no el nombre
              // por ahora se programara con el nombre
            }
          } //end for

          // persistir seleccio de vision y solo
          // (esto es en la interfaz, selector de piezas)
          var isModelVisibleSelected = true;
          var isModelOnlySelected = false;
          if(appData.models[modulo_tag]){
            isModelVisibleSelected = appData.models[modulo_tag].visible;
            isModelOnlySelected = appData.models[modulo_tag].only;
          }

          // Necesita ser actualizado si no aparece el modelo anteriormente o es distinto al que existe
          const needsUpdate = (!modelsCache[pieceData.modulo_id] || JSON.stringify(modelsCache[pieceData.modulo_id]) !== JSON.stringify(piezas));
          modelsCache[pieceData.modulo_id] = piezas;

          model = Object.assign({
            pieces:parsedData,
            guid: modulo_tag,
            tag: modulo_tag,
            x:0, y:0, z:0,
            rx: rx, ry: ry,rz: rz,
            visible:isModelVisibleSelected,
            only:isModelOnlySelected,
            needsUpdate
          }, modelsVuex[pieceData.modulo_id]);

          //editor.appendModel(model)
          appData.models[model.tag] = model;
          appData.models[model.tag].pieces = parsedData;
          models[model.tag] = model;
          models[model.tag].pieces = parsedData;
        })//end each
        let uniqueTextures = [ new Set(modelTextures)];
        if(model.needsUpdate) {
          loadModelTextures( Array.from([...uniqueTextures ][0]));
        }
        editor.appendModels(models)
        models = {};

      },

      error: function(response){
        console.log("error loading model");
        console.log(response);
      }
    });

}

function isPieceValid(d){
  if (isNaN(d.orientation) || isNaN(d.x) || isNaN(d.y) || isNaN(d.z) || d.visible == false ){
    return false;
  }
  return true;
}

// Agrega un modelo a la tabla de modelos
function updateModelsTable(){
  var models = []
  for (var tag in appData.models) {
    models.push(appData.models[tag]);
  }
  $('#table-models').bootstrapTable('load', models);
}

// actualiza los atributos del modelo en el visor con los datos obtenidos de la tabla
function updateModel(evt){
  var row = $(evt.target.parentElement.parentElement).children();
  newData = {};
  newData.tag = $(row[0]).html();
  newData.x = parseInt($(row[1]).find('input').val());
  newData.y = parseInt($(row[2]).find('input').val());
  newData.z = parseInt($(row[3]).find('input').val());
  newData.rx = parseInt($(row[4]).find('input').val());
  newData.ry = parseInt($(row[5]).find('input').val());
  newData.rz = parseInt($(row[6]).find('input').val());
  newData.visible = $(row[7]).find('input').is(':checked');
  tool.updateModel(newData);
}

function updateRoomElement(evt){
  var search = $(evt.target).parentsUntil('tbody');
  var row = $(search[search.length-1]);
  var tds = row.children();

  newData = {};
  newData.tag = row.attr('tag');
  newData.objectName = $(tds[0]).html();
  newData.x = parseInt($(tds[1]).find('input').val());
  newData.y = parseInt($(tds[2]).find('input').val());
  newData.z = parseInt($(tds[3]).find('input').val());
  newData.rx = parseInt($(tds[4]).find('input').val());
  newData.ry = parseInt($(tds[5]).find('input').val());
  newData.rz = parseInt($(tds[6]).find('input').val());
  newData.visible = $(tds[7]).find('input').is(':checked');
  tool.updateRoomElement(newData);
}

/* extrae los datos del editor de piezas y lo envia al visor 3d para actualizar la pieza */
function updatePiece(){
  if ( $("#piece-editor-model").html().length <=0 ){
    return false;
  }
  var newData = getPieceEditorData();
  updatePieceOnList(newData);
  tool.updatePiece(newData);
}

function updatePieceOnList(data){
  $('table[data-model="'+data.model+'"]').bootstrapTable('updateRow', data.index, data);
}


/* obtiene la informacion completa de la textura segun su nombre */
function getTextureByName(name){
  for (var i = 0; i < appData.textures.length; i++) {
    if (appData.textures[i].name == name) {
      return appData.textures[i];
    }
  }
}

/* generate a random string id for room elements*/
function stringGen(len){
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}


/* rellena las opcion del elemento select en el editor habitacion */
function fillRoomObjectSelect(data){
  var element = $('#object-editor-select');
  for (var i = 0; i < data.length; i++) {
    element.append('<option data-index="'+i+'" value="'+data[i].name+'"> ' + data[i].name  + '</option>');
  }
}

function initPiecesTable(){
  return $('#table-pieces').bootstrapTable({
    onClickRow: onPiecesRowClick,
    classes: 'table table-no-bordered table-hover ',

    uniqueId: 'index',
    columns: [{
        field: 'index',
        title: '#',
        visible: false,
        formatter: function(value, row, index){
          return value + 1;
        }
    }, {
        field: 'name',
        title: 'Nombre'
    }, {
        field: 'visible',
        title: '<span class="glyphicon glyphicon-eye-open"></span>',
        formatter: function(value){
          if (value)
            return '<span class="glyphicon-visible glyphicon glyphicon-eye-open"></span>';
          return '<span class="text-muted glyphicon-visible glyphicon glyphicon-eye-close"></span>';
        }
    }],
  });
}

function initDistancesTable(){
  return $('#table-distances').bootstrapTable({
    classes: 'table table-no-bordered table-hover',
    uniqueId: 'id',
    onClickRow: onDistanceClick,
    columns: [{
      field: 'id',
      title: '#',
      visible: false,
    },{
      field: 'color',
      title: 'Color',
      formatter: function(value){
        return '<div style="background: ' + value + '; width: 20px; height: 20px;"></div>';
      }
    }, {
      field: 'piece',
      title: 'Pieza'
    }, {
      field: 'distance',
      title: 'Distancia',
    },{
      field: 'remove',
      title: '',
      formatter: function(value){
        return '<span class="glyphicon-visible glyphicon glyphicon-remove"></span>';
      }
    }]
  });
}

/*
* inicializa la tabla que lista los modelos
*/
function initModelsTable(){
  return $('#table-models').bootstrapTable({
    onClickRow: onModelsRowClick,
    classes: 'table table-no-bordered table-hover',
    uniqueId: 'guid',
    sortName: 'tag',
    columns: [{
        field: 'guid',
        title: '#',
        visible: false,
    }, {
        field: 'tag',
        title: 'Nombre'
    }, {
        field: 'visible',
        title: '<span class="glyphicon glyphicon-eye-open"></span>',
        formatter: function(value){
          if (value)
            return '<span class="glyphicon-visible glyphicon glyphicon-eye-open"></span>';
          return '<span class="text-muted glyphicon-visible glyphicon glyphicon-eye-close"></span>';
        }
    },{
      field: 'only',
      title: 'Sólo',
      formatter: function(value){
        if (value)
          return '<span class="glyphicon-visible glyphicon glyphicon-check"></span>';
        return '<span class="text-muted glyphicon-visible glyphicon glyphicon-unchecked"></span>';
      }
    }],
  });
}

function onPiecesRowClick(piece, element, field){
  // si el click fue sobre el boton de visibilidad
  if (field == 'visible'){
    piece.visible = !piece.visible;
    editor.updatePiece(piece);
    editor.updatePieceVisibility(piece);
    editor.selectPiece(piece);
  }
  else
    editor.selectPiece(piece);
}

function onDistanceClick(model, element, cell) {
  if(cell === 'remove') {
    editor.removeDistance(model.id);
  }
}

function onModelsRowClick(model, element, cell){
  // si el click fue sobre el boton de visibilidad
  if (cell == 'visible'){
    model.visible = !model.visible;
    editor.updateModel(model, { visible: model.visible});
    editor.updateModelsVisibility();
  }else if(cell == 'only'){
    model.only = !model.only;
    editor.updateModel(model, { only: model.only});
    editor.updateModelsVisibility();
  }else{
    editor.selectModel(model);
  }
}

function getRoomObjectsAvaliable(){
  return [
    {
      "name" : "simple_door",
      "filename" : "basic_door.obj"
    },
    {
      "name" : "basic_window",
      "filename" : "basic_window.obj"
    }
  ];
}

function log(type, message){
  var type = type || 'default';
  $('#console').append('<p class="text-'+type+'">'+message+'</p>');
}


/*
* carga la scena almacenada del proyecto actual
*/
function appLoadCurrentUserProjectScene(){
  var resourceUrl = URL_BASE + '/api/3dviewer/scene/' + window.localStorage.getItem('projectID');
  tool.loadGLTF(URL_BASE + '/api/3dviewer/scene/' + window.localStorage.getItem('projectID'));


  //cargar los marcadores
  var markersUrl = URL_BASE + '/api/3dviewer/markers/' + window.localStorage.getItem('projectID');

  $.ajax({
    type: 'GET',
    url: markersUrl,
    crossDomain: true,
    success: function(response) {
      var mdata = JSON.parse(response);
      //console.log(mdata);
      mlPlakMarkers.restoreMarkersFromData(mdata);

    },
    error: function(response){

      console.log("error loading markers");
      console.log(response);
    }
  });

  //cargar la informacion del editor
  var editorURL = URL_BASE + '/api/3dviewer/editor/' + window.localStorage.getItem('projectID');

  $.ajax({
    type: 'GET',
    url: editorURL,
    crossDomain: true,
    success: function(response) {
      var edata = JSON.parse(response);
       editor.restoreEditorData(edata);
    },
    error: function(response){

      console.log("error loading markers");
      console.log(response);
    }
  });

  //$('#btn-create-room').change();
  //$("#btn-create-room").attr("checked", "checked"); // sets checked
  //$("#btn-create-room").trigger('click');           // fires event then 'unchecks'
  //$("#btn-create-room").attr("checked", "checked"); // rechecks
}

function appSaveCurentUserProjectScene(){

  //remover marcadores para permitir la exportacion
  mlPlakMarkers.detachMarkers();

  tool.exportToGLTF(function(glftContent){

    var editorExportedData = JSON.stringify( editor.exportEditorData() );
    var markersData = JSON.stringify( mlPlakMarkers.exportMarkers() );

    var executeAfterGLTFParsing =  function(gltf){

      var d = { project_id: window.localStorage.getItem('projectID'),
                markers: markersData,
                editorData: editorExportedData,
              scene:  gltf };

      $.ajax({
        type: 'POST',
        url: URL_BASE + '/api/3dviewer/scene/create',
        crossDomain: true,
        data: d,
        success: function(response) {
          mlPlakMarkers.attachMarkers();
          return  response;//JSON.parse(response);
        },
        error: function(response){
          mlPlakMarkers.attachMarkers();
          console.log("error saving scene");
          console.log(response);
        }
      });


    }

    tool.exportToGLTF(executeAfterGLTFParsing);



  });
}

/**
 * Sube una imagen capturada desde el canvas que despliega el 3d
 * al servidor.
 *
 * @param {*} filename
 * @param {*} proyecto_name
 * @param {*} img
 */
function uploadImageServer(filename, proyecto_name, img)
{
    $.ajax({
      type: 'POST',
      url: URL_BASE+'/api/v2/images',
      crossDomain: true,
      cache: false,
      beforeSend: function( xhr ) {

      },
      data: {
        filename: filename,
        base64: img,
        project_name: proyecto_name
      },
    }).done( function( html ) {


    }).error( function(response){
              //debugger;
              console.log("Error saving images");
              console.log(response);
    });

}

var loadFromDesignCenterInterval;

function activateLiveData(yesno){
  if(yesno){
    loadFromDesignCenterInterval = setInterval( function(){
      var pData = JSON.parse(window.localStorage.getItem('vuex'));
      window.localStorage.setItem('token_project', pData.info.token_project);
      if(!editor.mlPlakmodelEditor.isLocked()) {
        loadModelfromAPi( window.localStorage.getItem('token_project') );
      }
    } , 3500);
  }else{
    clearInterval(loadFromDesignCenterInterval);
  };

}
