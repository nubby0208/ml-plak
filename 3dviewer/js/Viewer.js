var ViewerTool = {};

class Viewer {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf2f2f2 );
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true,
    });
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.autoClear = false;

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.gridHelper = null;
    this.meshes = [];
    this.models = [];
    this.centerPivot = new THREE.Object3D();
    this.centerPivot.name = 'center-pivot';

    this.group           = new THREE.Group();
    this.labels          = new THREE.Group();
    this.dimensionLabels = new THREE.Group();
    this.lights          = new THREE.Group();
    this.group.castShadow = true;
    this.group.receiveShadow = true;
    this.scaleFactor = 0.1;
    this.perspectiveCamera = null;
    this.labels.name= 'viewer-labels'
    this.dimensionLabels.name = 'viewer-dimlabels';
    this.lights.name = 'viewer-lights';
    this.group.name = 'viewer-modelos';
    this.group.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);

    this.autoRotate = false;
    this.fixCamera = false;
    this.pieceScale = 1;
    this.textures = {};
    this.roomObjects = [];
    this.textureSize = {width: 1830, height:2600}
    this.materials = {
      'wood' : new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        side: THREE.FrontSide,
        shading: THREE.FlatShading,
        vertexColors: THREE.NoColors,
        reflectivity: .8,
      }),
      'wireframe' : new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 1,
      }),
      'grid' : new THREE.LineBasicMaterial({
        transparent: true,
        color: 0x000000,
        linewidth: 1,
        opacity: 0.2
      })
    };
    this.Export_Scale_factor = 0.01; //DAE EXPORT SCALE
    this.scaleOnExport=false;
    var self = this;

    // almacena que tipo de vista esta activa
    // - perspective
    // - front
    // - back
    // - left
    // - right
    this.currentActiveView = "perspective";
    this.orthographicCamera = null;
    this.modelRotation = 0;                 // current model rotation
    this.editorModelsList = null;           // lista actual de modelos segun el editor.

    this.hud;
  }

  init(container, textures, roomObjects){

    this.container = container;
    this.renderer.setSize( container.offsetWidth, container.offsetHeight );
    this.container.appendChild( this.renderer.domElement );
    this.camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 1, 10000 );
    this.camera.name = "perspective-camera";
    this.perspectiveCamera = this.camera;

    // Set camera position
    this.camera.position.y = 6000 * this.scaleFactor;
    this.camera.position.z = 8000 * this.scaleFactor;
    //this.camera.rotation.x = -0.4;
    // Object by which the camera ratates around
    this.centerPivot.add( this.camera )
    this.scene.add( this.centerPivot );
    this.scene.add( this.group );
    this.scene.add( this.labels );
    this.scene.add( this.lights );
    this.scene.add( this.dimensionLabels );
    this.createGrid();

    //inicializar hud
    this.hud = new MLPlakViewerHud(container.offsetWidth, container.offsetHeight);

    this.setupComposer();

    render();

    this.room = null;
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.screenSpacePanning = true;
    this.mainLight = new THREE.AmbientLight( 0xffffff ); // soft white light
    this.scene.add( this.mainLight );

    //Importante: camara ortogonal si inicializa luego de que el modelo es cargado

    //---------------------------------------------------------------------------------
    // avisar que ha cambiado la camara activa
    // Nota: esto SOLO esta siendo utilizado por MLPlackMarkers
    this.currentActiveViewChanged = this.currentActiveViewChanged.bind(this);
    this.currentActiveViewChangedCallBack = null;
    document.addEventListener("MLPlakViewerActiveViewChanged",this.currentActiveViewChanged,false);

    this.mouse = new THREE.Vector2();
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.container.getElementsByTagName('canvas')[0].addEventListener( 'mousemove', this.onDocumentMouseMove, false );
  }

    setupComposer () {
    var pixelRatio = this.renderer.getPixelRatio();
    var container = this.container;
    this.composer = new THREE.EffectComposer( this.renderer );
    this.composer.setSize(container.offsetWidth, container.offsetHeight);

    // this.renderPass = new THREE.RenderPass( this.scene, this.camera );
    // this.composer.addPass( this.renderPass );

    // var smaaPass = new THREE.SMAAPass( container.offsetWidth * pixelRatio, container.offsetHeight * pixelRatio);
    // this.composer.addPass( smaaPass );

    var ssaaRenderPass = new THREE.SSAARenderPass( this.scene, this.camera );
    ssaaRenderPass.unbiased = true;
    // ssaaRenderPass.sampleLevel = 1;
    this.composer.addPass( ssaaRenderPass );

    this.outlinePass = new THREE.OutlinePass( new THREE.Vector2( container.offsetWidth, container.offsetHeight) , this.scene, this.camera );
    this.outlinePass.edgeStrength = Number( 10 );
    this.outlinePass.edgeGlow = Number( 0.5);
    this.outlinePass.edgeThickness = Number( 2 );
    this.outlinePass.visibleEdgeColor.set( "#202087" );
    this.outlinePass.hiddenEdgeColor.set( "#0f480c" );
    this.composer.addPass( this.outlinePass );

    var onLoad = function ( texture ) {
      this.outlinePass.patternTexture = texture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      this.outlinePass.usePatternTexture = true;
    }.bind(this);
    var loader = new THREE.TextureLoader();
    loader.load( 'textures/tri_pattern.jpg', onLoad );

    var fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
    this.composer.addPass(fxaaPass);

    this.selectItem(this.selectedObject);
  }

  setLightIntensity(value){
    this.mainLight.intensity = value;
  }
  /*
   * Load textures necesary to use on the pieces.
   * parameters :
   *    textures : array of texture's filenames
   */
  loadTextures(textures){
    //console.log('aqui se cargan las texturas', textures);
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
    for (var i = 0; i < textures.length; i++) {
      if( textures[i].texture != undefined && textures[i].texture.length > 1)
      {
        var texture = loader.load( textures[i].texture );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.textures[textures[i].name] = { 'texture': texture, 'color': '' };
      }else{
        var color =  textures[i].color ?  textures[i].color.replace("#", "0x") : "0xFFFFFF";
        this.textures[textures[i].name] = { 'texture': '', 'color': color };
      }
    }
    this.refreshTextures();
  }

  setAvaliableObjects(objects){
    this.objects = objects;
  }

  removeRoom(){
    if(!this.room){
      return;
    }
    this.lights.remove(this.room.light);
    this.scene.remove(this.room.getMesh());
  }

  addRoom(){
    this.lights.add(this.room.light);
    this.scene.add(this.room.getMesh());
  }

  destroyRoom(){
    if (this.room){
      this.lights.remove(this.room.light);
      this.scene.remove(this.room.getMesh());
      this.room = null;
    }
  }

  //parametros:
  // showAfterCreate: mostrar la habitacion luego de realizar la creacion.
  //                  esto es utilizado cuando se cargan los parametros de creacion
  //                  desde la base de datos. la habitacion NO se mostrara de modo predeterminado
  //                  Cuando es creado desde la interfaz, si lo hace.
  //
  createRoom(w,h,l, options,showAfterCreate){

    /*
    * si la habitacion ya fue creada. simplemente se agrega o remueve
     * se la escena principal.
     * nota: room.scene es un objeto THREE.Group, y actua como el
     * contenedor base de room, por esto se utiliza para determinar pertenencia
     */
    if (this.room){
      if(this.room.scene.parent === this.scene){
        this.removeRoom();
      }else{
        this.addRoom();
      }
      return;
    }
    //no hay habitacion, crearla.
    this.room = new Room(w, h, l, options);
    this.room.avaliableObjects = this.objects;
    if( showAfterCreate ){ this.scene.add(this.room.getMesh()); }
    this.room.light = this.addLight( w*this.scaleFactor*0.9, h*this.scaleFactor*0.9, l*this.scaleFactor*0.9 );
    return this.room;
  }

  updateRoom(data){
    if(data.hasOwnProperty('dimension')){
      this.room.setSize(data.dimension);
    }
    if(data.hasOwnProperty('color')){
      this.room.setColors(data.color);
      this.room.setLight(data.light);
    }
  }

  addLight(x,y,z){
    var light = new THREE.PointLight(0xffffff, 1);
    light.position.set(x, y, z);
    this.lights.add(light);
    return light;
  }

  createModels(data){

    this.scene.remove(this.group);
    this.group = new THREE.Group();
    this.scene.add( this.group );
    this.data = data;
    for (var i = 0; i < data.length; i++) {
      var model = this.createModel(data[i]);
      this.group.add(model);
    }
  }

  findModelByTag(tag){
    for (var i = 0; i < this.group.children.length; i++) {

      if (this.group.children[i].tag == tag) {
        return this.group.children[i];
      }
    }
    return false;
  }

  removeModel(tag){
    var model = this.findModelByTag(tag);
    if (model){
      this.group.remove(model);
    }
  }

  addModel(data){
    // then create the model and add it to the scene
    var model = this.createModel(data);
    this.group.add(model);
  }

  createModel(data){
    var group = new THREE.Group();
    group.tag = data.tag;
    group.name = data.tag; //asignado como nombre tambien
    group.userData = data; //la variable grupo.tag no se exporta.
    group.userData.type = 'module';
    group.userData.id = data.tag;
    group.castShadow = true;

    // Creating meshes
    for (var i = 0; i < data.pieces.length; i++) {
      var result = this.createPiece(data.pieces[i]);
      result.piece.dataIndex     = i;
      result.wireframe.dataIndex = i;

      // se asigna un mayor render order al wireframe, de tal forma que se dibuje
      // incluse cuando se superponga.
      result.piece.renderOrder = 1;
      result.wireframe.renderOrder = 10;
      
      group.add(result.piece);
      group.add(result.wireframe);
    };

    group.originalMatrix = group.matrix;
    this.createModelLabel(group); //MARK: desactivado por pruebas de exportacion 5-FEB-2019 VGA

    if(this.selectedObject && group.userData.id == this.selectedObject.userData.id) {
      this.selectItem(group);
    }

    return group;
  }

  replaceModelData(group, data) {
    group.userData = data; //la variable grupo.tag no se exporta.
    group.userData.type = 'module';
    group.userData.id = data.tag;
    group.castShadow = true;
    // Creating meshes
    group.children = [];
    for (var i = 0; i < data.pieces.length; i++) {
      var result = this.createPiece(data.pieces[i]);
      result.piece.dataIndex     = i;
      result.wireframe.dataIndex = i;

      group.add(result.piece);
      group.add(result.wireframe);
    };
    if(this.selectedObject && group.userData.id == this.selectedObject.userData.id) {
      this.selectItem(group);
    }
  }

  rotate(r){
    this.centerPivot.rotation.y += r;
  }

  refreshTextures() {
    this.group.children.forEach(m => {
      m.children.forEach(pieceMesh => {
        let data = pieceMesh.userData;
        if (data.material &&  this.textures[data.material] && this.textures[data.material].texture ){
          pieceMesh.material.map = this.textures[data.material].texture;
          pieceMesh.material.needsUpdate = true;
        }

      });
    })
  }

  createPiece(data){

    var dimensions = adjustDimensions(data);
    var geometry = new THREE.BoxGeometry( dimensions.w, dimensions.h, dimensions.l );

    setTextureToGeometry(geometry, dimensions, this.textureSize);

    var pieceMesh = new THREE.Mesh(geometry, this.materials['wood'].clone());

    pieceMesh.castShadow = true;
    pieceMesh.receiveShadow = true;
    var edges = new THREE.EdgesGeometry( geometry );
    var wireframe = new THREE.LineSegments( edges, this.materials['wireframe']) ;

    if (data.material &&  this.textures[data.material] && this.textures[data.material].texture ){
      pieceMesh.material.map = this.textures[data.material].texture;
    }
    else{
      var color = ( data.material &&this.textures[data.material] && this.textures[data.material].color.length ) ? this.textures[data.material].color : data.color;
      pieceMesh.material.color.setHex( color );
    }

    wireframe.visible = data.wireframe;

    pieceMesh.position.x = data.x + dimensions.w/2;
    pieceMesh.position.y = data.y + dimensions.h/2;
    pieceMesh.position.z = data.z + dimensions.l/2;
    pieceMesh.scale.set(this.pieceScale,this.pieceScale,this.pieceScale);

    wireframe.position.x = data.x + dimensions.w/2;
    wireframe.position.y = data.y + dimensions.h/2;
    wireframe.position.z = data.z + dimensions.l/2;

    pieceMesh.tag = data.name;

    pieceMesh.userData = data;
    pieceMesh.userData.id = data.model + data.name;
    pieceMesh.userData.type = 'piece';

    pieceMesh.pieceType = 'piece';
    wireframe.pieceType = 'wireframe';

    if(this.selectedObject && pieceMesh.userData.id == this.selectedObject.userData.id) {
      this.selectItem(pieceMesh);
    }

    return {piece : pieceMesh, wireframe: wireframe};
  }

  updatePiece(data){
    var model  = this.findModelByTag(data.model);
    if (!model) return;
    const pieceMesh = model.children[data.index * 2];
    const pieceWireframe = model.children[data.index * 2 + 1];

    pieceMesh.visible       = data.visible;
    pieceWireframe.visible   = data.visible && data.wireframe;
  }

  updateModel(d){
    var model;
    for (var i = 0; i < this.group.children.length; i++) {
      if (this.group.children[i].tag == d.tag)
        model = this.group.children[i]
    }

    if (model == undefined){
      return;
    }

    model.visible = d.visible;

    this.rotateModel(model, d);
    model.updateMatrixWorld();

    const offset =  new THREE.Vector3(d.x, d.y, d.z);
    var quaternion = new THREE.Quaternion();
    quaternion.copy( model.quaternion );
    offset.applyQuaternion( quaternion );
    model.position.copy( offset );

    this.updateModelLabel(model);

  }

  updateModelVisibility(d){
    var model;
    for (var i = 0; i < this.group.children.length; i++) {
      if (this.group.children[i].tag == d.tag)
        model = this.group.children[i]
    }
    if (model == undefined){
      return;
    }
    model.visible = d.visible;
    this.updateModelLabel(model);
  }

  rotateModel(group, data){

    // group.rotation.set(data.rx * Math.PI/180, data.ry * Math.PI/180, data.rz * Math.PI/180);
    group.matrix = group.originalMatrix;
    this.rotateAroundWorldAxis(group, new THREE.Vector3(1,0,0), data.rx * Math.PI/180);
    this.rotateAroundWorldAxis(group, new THREE.Vector3(0,1,0), data.ry * Math.PI/180);
    this.rotateAroundWorldAxis(group, new THREE.Vector3(0,0,1), data.rz * Math.PI/180);
  }

  setLineWidth(v){
  }

  setPieceScale(v){
    this.pieceScale = v;
    for (var i = 0; i < this.meshes.length; i++) {
      this.meshes[i].scale.set(this.pieceScale,this.pieceScale,this.pieceScale);
    }
  }

  setEdgeColor(v){
    this.materials['wireframe'].color.setHex(v);
  }

  selectItem(selected) {
    if (!selected) return;
    selected.wireframe = true;
    this.selectedObject = selected;
    this.outlinePass.selectedObjects = [selected];
  }

  selectItemById(id) {
    if (!selected) return;
    selected.wireframe = true;
    this.selectedObject = selected;
    this.outlinePass.selectedObjects = [selected];
  }

  createGrid(){
    this.gridHelper = new THREE.GridHelper( 2000, 20 );
    this.gridHelper.visible = false;
    this.scene.add( this.gridHelper );
  }

  toggleRotation(rotate){
    this.autoRotate = rotate;
  }

  createLine(s, d){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(s.x, s.y, s.z));
    geometry.vertices.push(new THREE.Vector3(d.x, d.y, d.z));
    var line = new THREE.Line(geometry, this.materials['grid']);
    this.scene.add(line);
    return line
  }

  createOrigin(){
    this.createLine({x:0,y:0,z:0}, {x:10,y:0,z:0});
    this.createLine({x:0,y:0,z:0}, {x:0,y:3,z:0});
    this.createLine({x:0,y:0,z:0}, {x:0,y:0,z:3});
  }

  toggleGrid(show){
    this.gridHelper.visible=show;
  }

  // create obj file with the meshes
  exportToObj(filename, callback){
    var exporter = new THREE.OBJExporter();

		var result = exporter.parse(this.group);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
    element.setAttribute('download', filename + '.obj');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    callback();
  }

  exportToObjDAE(filename, callback){


    if(viewer.scaleOnExport){
      scaleModelDae(viewer.Export_Scale_factor);
    }

    //el nombre de archivo puede estar vacio o no existir.
    var nombreArchivo = 'archivoDae_' + shading + "_" + material_type + '.dae';
    if(! ( !filename || 0 === filename.length ) ){
       nombreArchivo = filename;
    }

    var shading; //esta variable DEBE ser GLOBAL si no se necesit hay que elimnar
    // esta variable y todo lo relacionado a la misma

    var exportGroup =  this.group.clone();

    if(viewer.room){
      exportGroup.add(viewer.room.mesh.clone());
    }

    var exporter = new THREE.ColladaExporter();

    var result = exporter.parse( exportGroup );
    exportGroup = null;
    if(viewer.scaleOnExport){
      scaleModelDae(100);
    }

    var material_type = "Phong";
    if ( shading === "wireframe" ) {
      material_type = "Constant"
    }

    if ( shading === "smooth" ) {
      material_type = "Lambert"
    }

    saveString( result.data,  nombreArchivo);
    result.textures.forEach( tex => {
      saveArrayBuffer( tex.data, `${ tex.name }.${ tex.ext }` );
    });


  }

  exportToGLTF( callbackWithResult ) {

    // Instantiate a exporter
    var exporter = new THREE.GLTFExporter();
    var options = {};

    // Parse the input and generate the glTF output
    exporter.parse( this.scene, function ( gltf ) {
      //console.log( gltf );
      if (callbackWithResult && typeof callbackWithResult === 'function') {
        callbackWithResult(JSON.stringify( gltf));
      }
    }, options );

  }

  loadGLTF(resourceUrl){
    var loader = new THREE.GLTFLoader();

    loader.load(

      // resource URL
      resourceUrl,

      // called when the resource is loaded
      function ( gltf ) {
        //console.log(gltf);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xf2f2f2 );


        this.centerPivot =  gltf.scene.getObjectByName('center-pivot');
        //this.group  =  gltf.scene.getObjectByName('viewer-modelos');
        this.labels =  gltf.scene.getObjectByName('viewer-labels');
        this.lights =  gltf.scene.getObjectByName('viewer-lights');
        this.dimensionLabels =  gltf.scene.getObjectByName('viewer-dimlabels');
        this.perspectiveCamera =  this.centerPivot.getObjectByName('perspective-camera');
        this.camera = this.perspectiveCamera;

        //TODO: Restaurar la vista de perspectiva las variables y todo

        this.scene.add(this.centerPivot.add(this.camera));
        this.scene.add( this.group );
        this.scene.add(this.labels);
        this.scene.add(this.lights);

        //esto es a veces borrado de la escena.
        if( this.dimensionLabels && (typeof this.dimensionLabels != 'undefined' )){
          this.scene.add(this.dimensionLabels);
        }

        this.createGrid();
        render();

        //recrear la luz y los controles como si fuera la primera vez
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.screenSpacePanning = true;
        this.mainLight = new THREE.AmbientLight( 0xffffff );
        this.scene.add( this.mainLight );

        gltf.asset; // Object
      }.bind(this),
      // called while loading is progressing
      function ( xhr ) {

        //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.log( 'An error happened',error );

      }
    );
  }

  testExportObj(){
    var exporter = new THREE.OBJExporter();
		return exporter.parse(this.scene);
  }

  testLoadObj(resourceUrl){
    var tempViewerScene = this.scene;
    var object;


    var lmodel = function() {
      tempViewerScene.children = object.children;
    }

    var manager = new THREE.LoadingManager( lmodel );
    manager.onProgress = function ( item, loaded, total ) {
      //console.log( item, loaded, total );
    };

    var afterlLoading =  function(obj){
        object = obj;
        //console.log(object);
    };

    var loader = new THREE.OBJLoader( manager );
        loader.load( resourceUrl,
          afterlLoading,
          function(){
          //progress
        }, function(){
          //error
        } );
  }

  togglePiecesVisibility(v){
    for (var i = 0; i < this.group.children.length; i++) {
      var model = this.group.children[i];
      for (var j = 0; j < model.children.length; j++) {
        if (model.children[j].pieceType == 'piece'){
          model.children[j].visible = v;
        }
      }
    }
  }

  exportIMG(filename){
    var img = this.renderer.domElement.toDataURL('image/jpeg');
    var result = document.createElement('a');
    result.setAttribute('href',  img);
    result.setAttribute('download', filename + '.jpeg') ;
    result.style.display = 'none';
    document.body.appendChild(result);
    result.click();
    document.body.removeChild(result);
    return img;
  }

  getCurrentIMG(){
    return this.renderer.domElement.toDataURL('image/jpeg');
  }

  //TODO: revisar si esto se llama desde alguna parte.
  /*
  getCurrentGIF(callback){
    var steps = 8;
    var exporter = new GIF({
      workers: 2,
      quality: 10,
      workerScript: 'js/gif.worker.js'
    });
    this.centerPivot.rotation.y = 0;
    for (var i = 0; i < steps; i++) {
      var element = document.createElement('img');
      this.rotate( i == 0 ? 0 : (45 * Math.PI / 180));
    	viewer.renderer.render( this.scene, this.camera );
      element.src = this.renderer.domElement.toDataURL('image/jpeg');
      exporter.addFrame(element);
    }

    exporter.on('finished', function(blob) {
      if (callback) {
        callback(blob);
      }
    });
    exporter.render();
  }*/

  updateRoomElement(data){
    if (this.room){
      this.room.updateObject(data);
    }
  }

  removeRoomElement(data){
    if (this.room) {
      this.room.removeObject(data.tag);
    }
  }

  // Rotate an object around an arbitrary axis in world space
  rotateAroundWorldAxis(object, axis, radians) {
      var rotWorldMatrix = new THREE.Matrix4();
      rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
      rotWorldMatrix.multiply(object.matrix);        // pre-multiply
      object.matrix = rotWorldMatrix;
      object.rotation.setFromRotationMatrix(object.matrix)
  }

  /*
   * Search which textures must be loaded to create the pieces
   * parameters :
   *    data: pieces data
   * return
   *    toLoad: array of textures to load
   */
  extractTextures(data){
    var toLoad = []
    for (var i = 0; i < data.pieces.length; i++) {
      if (data.pieces[i].texture != undefined && toLoad.indexOf(data.pieces[i].texture) == -1){
          // should be a valid texture and must be not previously added to the lightIntensity
          toLoad.push(data.pieces[i].texture)
      }
    }
    return toLoad
  }

  /* Dibuja texto sobre los modelos para identificarlos. */
  createModelLabel(model){
    let box = new THREE.Box3().setFromObject( model );
    let center = box.getCenter();
    var position = new THREE.Vector3(
      center.x * this.scaleFactor,
      model.position.y + (box.max.y + 500) * this.scaleFactor,
      center.z * this.scaleFactor
    );
    var label = createLabel({
      text: model.tag,
      redrawInterval : 1000,
      size: 50,
      position: position,
      visible: false,
    });

    this.labels.add(label);
    model.label = label;
  }

  /* muestra / oculta los nombres sobre los modelos */
  showLabels(show){
    for (var i = 0; i < this.group.children.length; i++) {
      this.group.children[i].label.visible = show;
    }
  }

  /* actualiza el label de un modelo especifico */
  updateModelLabel(model){
    let label = model.label;
    let box = new THREE.Box3().setFromObject( model );
    let center = box.getCenter();
    let size = box.getSize();
    label.position.set(
      center.x,
      box.max.y + 500 * this.scaleFactor,
      center.z
    );
  }

  showDimensions(show, model){
    this.scene.remove(this.dimensionLabels);
    this.dimensionLabels = new THREE.Group();
    this.scene.add(this.dimensionLabels);
    if (!show){
      //console.log("Ocultar dimensiones.");
      return;
    }
    if (model == null) {
      alert("Debe seleccionar un modelo.");
      return;
    }

    var model  = this.findModelByTag(model.tag);
    let modelBox    = new THREE.Box3().setFromObject( model );
    let modelCenter = modelBox.getCenter();
    let modelSize   = modelBox.getSize();

    for (var i = 0; i < model.children.length; i++) {
      var piece = model.children[i];
      if (piece.pieceType == "wireframe") continue;

      let box    = new THREE.Box3().setFromObject( piece );
      let center = box.getCenter();
      let size   = box.getSize();

      let position = new THREE.Vector3(
        center.x,
        box.max.y + 4,
        box.max.z
      );

      var label = createLabel({
        text: piece.userData.pattern.frontWidth,
        size: 8,
        redrawInterval : 0,
        position: position,
        visible: true,
      });
      this.dimensionLabels.add(label);
    }
  }

  getPatternImg(model){
    if (model == null) {
      alert("Debe seleccionar un modelo.");
      return;
    }
    var model  = this.findModelByTag(model.tag);
    var tmpLabels = new THREE.Group();
    this.scene.add(tmpLabels);

    let modelBox    = new THREE.Box3().setFromObject( model );
    let modelCenter = modelBox.getCenter();
    let modelSize   = modelBox.getSize();

    for (var i = 0; i < model.children.length; i++) {
      var piece = model.children[i];
      if (piece.pieceType == "wireframe") continue;

      let box    = new THREE.Box3().setFromObject( piece );
      let center = box.getCenter();
      let size   = box.getSize();

      let position = new THREE.Vector3(
        center.x,
        box.max.y + 4,
        box.max.z
      );

      var label = createLabel({
        text: piece.userData.pattern.frontWidth,
        size: 8,
        redrawInterval : 0,
        position: position,
        visible: true,
      });

      tmpLabels.add(label);
    }

    var aspectRatio = this.container.offsetWidth / this.container.offsetHeight;
    var height, width = 0;
    if (modelSize.z > modelSize.y){
      width  = modelSize.z * 1.2;
      height = width / aspectRatio;
    }
    else{
      height = modelSize.y * 1.2;
      width  = height * aspectRatio;
    }

    var newCamera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, modelSize.z );
    this.scene.add(newCamera);

    newCamera.position.set(modelCenter.x, modelCenter.y, modelBox.max.z);
    newCamera.lookAt(modelCenter)

    this.renderer.render( this.scene, newCamera );

    this.exportIMG( model.tag );

    this.scene.remove(newCamera);
    this.scene.remove(tmpLabels);
  }

  getSelectedObject(){
    return this.selectedObject;
  }

  clearSelection() {
    this.outlinePass.selectedObjects = [];
    this.selectedObject = null;
  }

  clearOrthographicCamera(){
    this.scene.remove(this.camera);
    this.camera = this.perspectiveCamera;
    this.setupComposer();
  }

  cameraOrthographic(view){
    this.cameraEnableOrthographicCamera();
    this.currentActiveView = view;
    this.setCameraPosition();
    this.fireMarkerCountUpdatedEvent();
  }

  // --------------------------------------------------------------------------
  // crea una nueva camera para una vista ortogonal
  // parámetros:
  // model: el modelo.
  // ejeDeTraslacion: Vecto Normalizado de eje en que se móvera la cámara
  // Distancia la distancia del modelo a la cámara
  //
  // Nota: éste método reasigna el valor de la variable this.controls
  // pues se establecen propiedades para sólo permitir panning ,dollying y zoom.
  // --------------------------------------------------------------------------
  cameraCreateOrthographicViewCamera(){
    var newCamera = new THREE.OrthographicCamera(this.container.offsetWidth / -2, this.container.offsetWidth / 2, this.container.offsetHeight / 2, this.container.offsetHeight / -2, 100, 100000);

    newCamera.up = new THREE.Vector3(0, 1, 0);
    this.controls.dispose();
    this.controls = new THREE.OrbitControls( newCamera, this.renderer.domElement );
    this.controls.enableRotate = false;
    this.controls.keyPanSpeed = 200;
    this.controls.screenSpacePanning = true;
    this.maxPolarAngle=0;
    this.minPolarAngle=0;

    return newCamera;

  }

  //---------------------------------------------------------------
  // camara ortografica, se crea una sola vez y se reutiliza
  // se crea sobre el modelo y mora hacia "abajo" en el eje Y
  cameraEnableOrthographicCamera(){

    // justo antes de activar la camara se rotan todos los modelos a 0
    // hay que usar la funcion interna que los rota.
    var rotationZeroData = JSON.parse( JSON.stringify( this.editorModelsList) );
    Object.keys(rotationZeroData).forEach((key, idx) => {
        //console.log( rotationZeroData[key] ) ;
        rotationZeroData[key].rx = 0;
        rotationZeroData[key].ry = 0;
        rotationZeroData[key].rz = 0;

        //this.updateModel(rotationZeroData[key]);
    });


    this.orthographicCamera = this.cameraCreateOrthographicViewCamera();
    //var helper = new THREE.CameraHelper( this.orthographicCamera );
    this.camera = this.orthographicCamera;
    this.scene.add(this.camera);
    //this.scene.add(helper);

    this.setupComposer();

  }

  cameraUserView(){
    // aca hay que restaurar las transformaciones de los modelos
    // usar la funcion updadeModel usando los valores guardados en
    // this.editorModelsList;
    Object.keys(this.editorModelsList).forEach((key, idx) => {
      this.updateModel(this.editorModelsList[key]);
  });

    this.currentActiveView = "perspective";

    this.camera = this.perspectiveCamera;
    this.perspectiveCamera.updateProjectionMatrix();
    this.controls.dispose();//remove listeners
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.screenSpacePanning = true;
    this.fireMarkerCountUpdatedEvent();
  }

  //---------------------------------------------------------------
  // aplica una rotación al modelo por vez
  // utilizando el tipo de vista activa  this.currentActiveView
  //
  setCameraPosition(){
    var groupbbox = new THREE.Box3().setFromObject(this.group);
    //2 aplicar la nueva rotacion
    switch(this.currentActiveView){
      case 'front':
        this.camera.translateOnAxis(new THREE.Vector3(0, 0, 1), 1000);
        this.camera.lookAt(new THREE.Vector3( ));
        break;
      case 'back':
        this.camera.translateOnAxis(new THREE.Vector3(0, 0, 1), -1000);
        break;
      case 'left':
        this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), -1000);
        break;
      case 'right':
        this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), 1000);
        break;
      case 'top':
        this.camera.translateOnAxis(new THREE.Vector3(0, 1, 0), 1000);
        break;
      case 'bottom':
        this.camera.translateOnAxis(new THREE.Vector3(0, 1, 0), -1000);
        break;
      case 'perspective':
        // no hace nada el modelo esta en posicion
        break;
      default:
        console.log('Viewver.js: no puedo rotar modelo.', this.currentActiveView ,' No es un tipo de vista válido');
    }
    this.camera.lookAt(new THREE.Vector3( ));
  }

  //--------------------------------------------------------------
  // manejador de evento para cambio de vista actual
  // llama al callback asignado currentActiveViewChangedCallBack.
  //--------------------------------------------------------------
   currentActiveViewChanged(e){

      if (this.currentActiveViewChangedCallBack && typeof this.currentActiveViewChangedCallBack === 'function') {
          this.currentActiveViewChangedCallBack(e);
      }

    }
  // --------------------------------------------------
  // disparador de evento de cambio de cámara
  // --------------------------------------------------
  fireMarkerCountUpdatedEvent(){

    var cce = new CustomEvent("MLPlakViewerActiveViewChanged", {
      detail: {
        activeView: this.currentActiveView
      }
    });
    //usar el contenedor para lanzar el evento.
    document.dispatchEvent(cce);
  }


  showOnlyWireframe(model){
    var model  = this.findModelByTag(model.tag);
    if (!model) return;
    for (var i = 0; i < model.children.length; i++) {
      if (model.children[i].pieceType == "wireframe")
        model.children[i].visible = true;
      else
        model.children[i].visible = false;
    }
  }

  testExport(){
    //var exporter = new THREE.OBJExporter();
    // return  exporter.parse(this.scene);
  }

  /*
  *  Almacena los valores actuales de los modelos
  *  tal como los tiene el editor.
  *  el propósito es mantenerlos a mano para
  *  restaurar estos valores cuando se use la vista ortogonal.
  *  (durante el usao de la vista ortogonal TODOS los modelos serán,
  *   rotados a 0);
  */
  storeEditorModelsList(modelsList){
    this.editorModelsList = modelsList;
  }

  /**
   * Gets object in viewer given userData defined id from the scene
   * @param id
   * @returns {Viewer.getObjectById|*}
   */
  getObjectById(id) {
    let found = this.findChildById(this.scene, id);
    return found;
  }

  /**
   * Obtains object by a string id defined in userData in a recursive way
   * @param object
   * @param id
   * @returns {Viewer.getObjectById|undefined|*}
   */
  findChildById = function findById( object, id ) {
    if ( object.userData[ 'id' ] === id ) return object;
    for ( var i = 0, l = object.children.length; i < l; i ++ ) {
      var objectChild = findById( object.children[ i ], id );
      if ( objectChild !== undefined ) {
        return objectChild;
      }
    }
    return undefined;
  }

  onDocumentMouseMove( event ) {
    event.preventDefault();
    //corregido problema del offset
    var rect = this.container.getElementsByTagName('canvas')[0].getBoundingClientRect();
    this.mouse.x = (event.offsetX / rect.width) * 2 - 1;
    this.mouse.y = - (event.offsetY / rect.height) * 2 + 1;
  }

}//------------------------ //

var viewer = new Viewer();
ViewerTool.viewer = viewer;

function render(){

  viewer.composer.render();
  // viewer.renderer.render( viewer.scene, viewer.camera );

  viewer.hud.render(viewer.renderer);

  requestAnimationFrame( render );

  if (viewer.autoRotate){
    viewer.centerPivot.rotation.y += 0.01;
  }
}

function adjustDimensions(data){
  newDimensions = {}
  var position;
  // rotate position Vector3
  if (data.orientation == 1){
    position = new THREE.Vector3(data.h, data.l, data.w);
  }
  else if (data.orientation == 2){
    position = new THREE.Vector3(data.l, data.h, data.w);
  }
  else if (data.orientation == 3){
    position = new THREE.Vector3(data.l, data.w, data.h);
  }
  else if (data.orientation == 4){
    position = new THREE.Vector3(data.w, data.l, data.h);
  }
  else{
    position = new THREE.Vector3(data.w, data.h, data.l);
  }

  newDimensions.w = Math.abs(position.x);
  newDimensions.h = Math.abs(position.y);
  newDimensions.l = Math.abs(position.z);
  return newDimensions;
}

/* Crea un sprite */
function createLabel(params){
  let sprite = new THREE.TextSprite({
    textSize: params.size,
    redrawInterval: params.redrawInterval,
    texture: {
      text: params.text,
      fontFamily: params.font || 'Arial, Helvetica, sans-serif',
    },
    material: {
      color: 0x000000,
    },
  });
  sprite.visible = params.visible;
  sprite.position.copy(params.position);
  return sprite;
}

function setTextureToGeometry(geometry, dimensions, textureSize){
  geometry.faceVertexUvs[0][8][0].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][8][2].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][9][2].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][8][2].x = dimensions.w / textureSize.width;
  geometry.faceVertexUvs[0][9][1].x = dimensions.w / textureSize.width;
  geometry.faceVertexUvs[0][9][2].x = dimensions.w / textureSize.width;

  geometry.faceVertexUvs[0][10][0].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][10][2].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][10][2].x = dimensions.w / textureSize.width;
  geometry.faceVertexUvs[0][11][2].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][11][1].x = dimensions.w / textureSize.width;
  geometry.faceVertexUvs[0][11][2].x = dimensions.w / textureSize.width;

  geometry.faceVertexUvs[0][4][0].y = dimensions.l / textureSize.height;
  geometry.faceVertexUvs[0][4][2].y = dimensions.l / textureSize.height;
  geometry.faceVertexUvs[0][4][2].x = dimensions.w / textureSize.width;
  geometry.faceVertexUvs[0][5][2].y = dimensions.l / textureSize.height;
  geometry.faceVertexUvs[0][5][1].x = dimensions.w / textureSize.width;
  geometry.faceVertexUvs[0][5][2].x = dimensions.w / textureSize.width;

  geometry.faceVertexUvs[0][6][0].y = dimensions.l / textureSize.height;
  geometry.faceVertexUvs[0][6][2].y = dimensions.l / textureSize.height;
  geometry.faceVertexUvs[0][6][2].x = dimensions.w / textureSize.width;
  geometry.faceVertexUvs[0][7][2].y = dimensions.l / textureSize.height;
  geometry.faceVertexUvs[0][7][1].x = dimensions.w / textureSize.width;
  geometry.faceVertexUvs[0][7][2].x = dimensions.w / textureSize.width;

  geometry.faceVertexUvs[0][0][0].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][0][2].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][0][2].x = dimensions.l / textureSize.width;
  geometry.faceVertexUvs[0][1][2].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][1][1].x = dimensions.l / textureSize.width;
  geometry.faceVertexUvs[0][1][2].x = dimensions.l / textureSize.width;

  geometry.faceVertexUvs[0][2][0].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][2][2].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][2][2].x = dimensions.l / textureSize.width;
  geometry.faceVertexUvs[0][3][2].y = dimensions.h / textureSize.height;
  geometry.faceVertexUvs[0][3][1].x = dimensions.l / textureSize.width;
  geometry.faceVertexUvs[0][3][2].x = dimensions.l / textureSize.width;
}

function saveString( text, filename ) {

  save( new Blob( [ text ], { type: 'text/plain' } ), filename );

}
function save( blob, filename ) {

  daelink.href = URL.createObjectURL( blob );
  daelink.download = filename || 'data.json';
  daelink.click();

  // URL.revokeObjectURL( url ); breaks Firefox...

}
function saveArrayBuffer( buffer, filename ) {
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}


// escala los modelos y la habitacion  a el valor establecidoen:
// Export_Scale_factor
// G.V
function scaleModelDae(scale_value){

    if(!this.scaleOnExport){
        return;
    }


     viewer.group.scale.multiplyScalar(scale_value );
     viewer.group.position.multiplyScalar(scale_value );

    if(viewer.room){
      viewer.room.scene.scale.multiplyScalar(scale_value);
    }

}

//link para descargar el archivo dae.
//está fuera de las funciones. se crea al llegar a este punto
var daelink = document.createElement( 'a' );
daelink.style.display = 'none';
document.body.appendChild( daelink );
