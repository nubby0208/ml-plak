/**
 * Contiene el controlador de la creacion de distancias en el visor 3d
 * Autor: Lovecraft 2020.
 */

class MlPlakDistanceController{
	constructor(options) {
	  this.distances = [];
	  this.currentDistance = new MlPlakDistance();
		this.viewer = options.viewer;

    this.raycaster = new THREE.Raycaster();
    this.intersection = {          // interseccion del raycast y el modelo
      intersects: false,
      point: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      module: "",
      inPiece: false,
      pieceId: ""
    };


    this.mouseHelper = new THREE.Group();
    this.mouseHelper.add(this._createLineHelper({size: 4, color: this.currentDistance.color}));
    this.mouseHelper.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({
      color: this.currentDistance.color,
      transparent:true, 
      opacity:0.4,
    })));

    this.mouseHelper.name = "MlPlakMarkers-MouseHelper";
    this.mouseHelper.visible=false;
    this.viewer.scene.add(this.mouseHelper);

    this._MlPlakDistanceOnMouseMovePointA = this._MlPlakDistanceOnMouseMovePointA.bind(this);
    this._MlPlakDistanceOnMouseMovePointB = this._MlPlakDistanceOnMouseMovePointB.bind(this);

    this.distancesGroup = new THREE.Group();
    this.currentDistanceGroup = new THREE.Group();
    this.viewer.scene.add(this.currentDistanceGroup);
    this.viewer.scene.add(this.distancesGroup);

    this.currentType = "";
  }

  createPointModel(pieceId, position){
	  let id;
	  if (this.currentType === "A") {
	    if( this.currentDistance.pointA) {
	      this.removePoint(this.currentDistance.pointA.id);
      }
	    this.currentDistance.setPointA(pieceId, "",position);
      id = this.currentDistance.pointA.id;
    } else {
      if( this.currentDistance.pointB) {
        this.removePoint(this.currentDistance.pointB.id);
      }
      this.currentDistance.setPointB(pieceId, "", position);
      id = this.currentDistance.pointB.id;
    }
    this.connectPointwithHelper();

    
    var innerSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({
      color: this.currentDistance.color,
      transparent:true, 
      opacity:0.4,
      side: THREE.DoubleSide
    }));

    var innerMarker = this._createLineHelper({size:4, color: this.currentDistance.color});

    var box = new THREE.Group();
    box.add(innerMarker);
    box.add(innerSphere);

    box.position.copy( position );
    box.userData.id = id;

    return box;
  }

  _MlPlakDistancesMouseUP(event) {
	  if(this.intersection.inPiece) {
      var matrix = new THREE.Matrix4();
      matrix.extractRotation(this.mouseHelper.matrix);
      var m = this.createPointModel(this.intersection.pieceId, this.intersection.point);
      this.currentDistanceGroup.add(m);
      this.deactivateMouseHelperMouseMoveListener();
      this.hideMouseHelper();

      this.fireDistanceUpdatedEvent();
    }
  }

  findPointById(id){
    for (var i = 0; i < this.currentDistanceGroup.children.length; i++) {
      if (this.currentDistanceGroup.children[i].userData.id == id) {
        return this.currentDistanceGroup.children[i];
      }
    }
    return false;
  }

  removePoint(id) {
	  var pointModel = this.findPointById(id);
	  this.currentDistanceGroup.remove(pointModel);
  }

  _MlPlakDistanceOnMouseMovePointA(event){
    event.preventDefault();

    var distanciaZalcursor =  0;
    var vector = new THREE.Vector3(this.viewer.mouse.x, this.viewer.mouse.y, 1);
    vector.unproject( this.viewer.camera );
    var dir = vector.sub( this.viewer.camera.position ).normalize();
    var distance = ( distanciaZalcursor - this.viewer.camera.position.z ) / dir.z;
    var pos = this.viewer.camera.position.clone().add( dir.multiplyScalar( distance ) );
    this.mouseHelper.position.copy(pos);

    //obtener los objetos del modelo:
    var modelMeshObjects = new Array();

    for (var i=0; i < this.viewer.group.children.length; i++){
      //solo si esta visible el objeto (modulo) agregar a la lista de colisiones de rayo
      if(this.viewer.group.children[i].visible){
        modelMeshObjects = modelMeshObjects.concat( this.viewer.group.children[i].children );
      }
    }

    this.raycaster.setFromCamera(this.viewer.mouse, this.viewer.camera);

    var modelIntersects = this.raycaster.intersectObjects(modelMeshObjects,true);

    if (modelIntersects.length > 0) {
      var selected = modelIntersects[0].object;
      var p = modelIntersects[ 0 ].point;
      this.mouseHelper.position.copy( p );
      this.intersection.point.copy( p );

      if( !modelIntersects[ 0 ].face ){
        return;
      }


      if(this.viewer.selectedObject.userData.id !== selected.userData.id) {
        this.hideMouseHelper();
        this.intersection.inPiece = false;
        this.intersection.pieceId = selected.userData.id;
        return;
      }
      this.intersection.inPiece = true;
      
      var n = modelIntersects[ 0 ].face.normal.clone();
      n.transformDirection( selected.matrixWorld );
      n.multiplyScalar( 10 );
      n.add( modelIntersects[ 0 ].point );
      this.intersection.normal.copy( modelIntersects[ 0 ].face.normal );

      this.showMouseHelper();
      this.mouseHelper.lookAt( n );
    } else {
      this.hideMouseHelper();
    }
  }

  _MlPlakDistanceOnMouseMovePointB(event){
    event.preventDefault();

    var distanciaZalcursor =  0;
    var vector = new THREE.Vector3(this.viewer.mouse.x, this.viewer.mouse.y, 1);
    vector.unproject( this.viewer.camera );
    var dir = vector.sub( this.viewer.camera.position ).normalize();
    var distance = ( distanciaZalcursor - this.viewer.camera.position.z ) / dir.z;
    var pos = this.viewer.camera.position.clone().add( dir.multiplyScalar( distance ) );
    this.mouseHelper.position.copy(pos);

    //obtener los objetos del modelo:
    var modelMeshObjects = new Array();

    for (var i=0; i < this.viewer.group.children.length; i++){
      //solo si esta visible el objeto (modulo) agregar a la lista de colisiones de rayo
      if(this.viewer.group.children[i].visible){
        modelMeshObjects = modelMeshObjects.concat( this.viewer.group.children[i].children );
      }
    }

    this.raycaster.setFromCamera(this.viewer.mouse, this.viewer.camera);

    var modelIntersects = this.raycaster.intersectObjects(modelMeshObjects,true);

    if (modelIntersects.length > 0) {
      var selected = modelIntersects[0].object;
      let p = modelIntersects[ 0 ].point;
      if(this.currentDistance.isFixed()) {
        p = this.getFixedBFromA(p);
      }
      this.mouseHelper.position.copy( p );
      this.intersection.point.copy( p );
      this.intersection.pieceId = selected.userData.id;

      if( !modelIntersects[ 0 ].face ){
        return;
      }

      var n = modelIntersects[ 0 ].face.normal.clone();
      n.transformDirection( selected.matrixWorld );
      n.multiplyScalar( 100 );
      n.add( modelIntersects[ 0 ].point );
      this.intersection.normal.copy( modelIntersects[ 0 ].face.normal );

      this.showMouseHelper();
      this.mouseHelper.lookAt( n );

      this.connectPointwithHelper();

    }
  }

  getFixedBFromA(point) {
	  let fixedPoint = new THREE.Vector3();
	  fixedPoint.copy(this.currentDistance.pointA.position);
	  if(this.currentDistance.fixedX) {
      fixedPoint.setX(point.x);
    }
    if(this.currentDistance.fixedY) {
      fixedPoint.setY(point.y);
    }
    if(this.currentDistance.fixedZ) {
      fixedPoint.setZ(point.z);
    }
    return fixedPoint;
  }

  connectPointwithHelper() {
    this.removePoint("tmpLine");
    let pos1 = this.currentDistance.pointA.position;
    let pos2 = this.currentDistance.pointB ? this.currentDistance.pointA.position : this.mouseHelper.position;
    
    var line = this._createLine(pos1, pos2);
    this.currentDistanceGroup.add(line);
  }

  activateMouseHelperMouseMoveListener(type = "A"){
	  if(type === "A") {
      document.addEventListener("mousemove",  this._MlPlakDistanceOnMouseMovePointA , false);
    } else {
      document.addEventListener("mousemove",  this._MlPlakDistanceOnMouseMovePointB , false);
    }
  }

  deactivateMouseHelperMouseMoveListener(){
	  if(this.currentType === "A") {
      document.removeEventListener("mousemove",  this._MlPlakDistanceOnMouseMovePointA, false);
    } else {
      document.removeEventListener("mousemove",  this._MlPlakDistanceOnMouseMovePointB, false);
    }
  }

  startPointCreation(type = "A"){
	  this.currentType = type;
    this.activateMouseHelperMouseMoveListener(type);
  }

  showMouseHelper(){
    this.mouseHelper.visible = true;
  }

  hideMouseHelper(){
    this.mouseHelper.visible = false;
  }

  _createLine(position_1, position_2){
    var material = new THREE.LineBasicMaterial({
      color: this.currentDistance.color
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( position_2.x,position_2.y,position_2.z ),
      new THREE.Vector3( position_1.x,position_1.y,position_1.z )
    );
    var line = new THREE.Line( geometry, material );
    line.userData.id = "tmpLine";

    return line;
  }

  fireDistanceUpdatedEvent(){
    const eventType = "distanceUpdated";
    var cce = new CustomEvent(eventType, {
      detail: {
        data: {
          current: this.currentDistance,
          distances: this.distances
        }
      }
    });
    document.dispatchEvent(cce);
  }

  addDistanceToViewer() {
	  if(this.currentDistance.pointA && this.currentDistance.pointB) {
      this.distances.push(this.currentDistance);
      this.currentDistanceGroup.userData.id = this.currentDistance.id;
      this.distancesGroup.add(this.currentDistanceGroup);
      this.clearDistance();
    }
  }

  clearDistance() {
	  this.currentDistance = new MlPlakDistance();
	  this.viewer.scene.remove(this.currentDistanceGroup);
    this.currentDistanceGroup = new THREE.Group();
    this.viewer.scene.add(this.currentDistanceGroup);
	  this.fireDistanceUpdatedEvent();
  }

  removeDistance(id) {
    this.distances = this.distances.filter((distance) => distance.id !== id);
    let distanceGroup = this.distancesGroup.children.find(distance => distance.userData.id === id);
    if(distanceGroup) {
      this.distancesGroup.remove(distanceGroup);
    }
    this.fireDistanceUpdatedEvent();
  }

  changeColor(color) {
	  this.currentDistance.color = color;
	  this.currentDistanceGroup.children.forEach(item => {
	    item.material.color.set(color);
    });
  }

  updateFixed(x, y, z) {
	  this.currentDistance.fixed(x, y, z);
  }

  _createLineHelper(opts){
    let options = {...{
      color: 'red',
      size: 4,
    }, ...opts};
    
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3( - options.size, 0, 0 ),
        new THREE.Vector3(   options.size, 0, 0 ),
        new THREE.Vector3(  0, 0, 0 ),
        new THREE.Vector3( 0, - options.size, 0 ),
        new THREE.Vector3( 0, options.size, 0 ),
        new THREE.Vector3(  0, 0, 0 ),
        new THREE.Vector3( 0, 0, - options.size ),
        new THREE.Vector3( 0, 0, options.size ),
      ]),
      new THREE.LineBasicMaterial({
        color: options.color,
        transparent: false,
        visible: true,
      })
    );
  }
}
