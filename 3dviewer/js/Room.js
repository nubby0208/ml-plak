class Room {
  constructor(w, h, l, params) {
    this.options = params;
    this.avaliableObjects = [];
    this.scene = new THREE.Group();
    this.scaleFactor = 0.1;
    this.scene.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    this.objects = [];

    this.materials = {
      'wall': new THREE.MeshPhongMaterial( {
        color: this.options.wallColor || 0xaaaaaa,
        side: THREE.BackSide,
        shading: THREE.FlatShading
      }),
      'ceil': new THREE.MeshPhongMaterial( {
        color: this.options.ceilColor || 0x666666,
        side: THREE.BackSide,
        shading: THREE.FlatShading
      }),
      'floor': new THREE.MeshPhongMaterial( {
        color: this.options.floorColor || 0x666666,
        side: THREE.BackSide,
        shading: THREE.FlatShading
      }),
      'editorBox' : new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 2,
      }),
    }


    var geometry  = new THREE.BoxGeometry( 1,1,1 );
    this.mesh = new THREE.Mesh(geometry, [
      this.materials['wall'],
      this.materials['wall'],
      this.materials['ceil'],
      this.materials['floor'],
      this.materials['wall'],
      this.materials['wall']
    ]);
    this.mesh.receiveShadow = true;

    this.mesh.scale.x = w
    this.mesh.scale.y = h
    this.mesh.scale.z = l
    this.mesh.translateX(w/2);
    this.mesh.translateY(h/2);
    this.mesh.translateZ(l/2);

    this.scene.add(this.mesh)
    this.loadTextures();
  }



  /* public method
   * find a start the update or laod a new object
   */
  updateObject(data){
    var obj = findObjectByTag(this.objects, data.tag);
    // if is already loaded, just update
    if (obj){
      this.updateData(obj, data);
    }
    else{
      // create object
      this.loadObject(data);
    }
  }

  removeObject(tag){
    var obj = findObjectByTag(this.objects, tag);
    var index = this.objects.indexOf(obj);
    this.scene.remove(obj);
    this.objects.slice(index,1);
  }

  /* private method
   * update data from the loaded object
   */
  updateData(obj, data){
    obj.position.set(data.x, data.y, data.z);
    obj.rotation.set(0,0,0);
    obj.rotateX(data.rx * Math.PI / 180);
    obj.rotateY(data.ry * Math.PI / 180);
    obj.rotateZ(data.rz * Math.PI / 180);
    obj.tag = data.tag;
    obj.visible = data.visible;
  }

  loadObject(data){
    var search = this.avaliableObjects.filter(function(obj){
        return obj.name == data.objectName;
      }
    );
    if (search.length == 0){
      return
    }
    var newObject = search[0];
    var loader = new THREE.OBJLoader();
    var that = this;
		loader.load( 'assets/' + newObject.filename , function ( object ) {
      that.scene.add(object);
      that.objects.push(object);
      that.updateData(object, data);
    });
  }



  loadWindow(){
    var loader = new THREE.OBJLoader( );
    var that = this;
		loader.load( 'assets/basic_window.obj', function ( object ) {
      that.scene.add(object)
      object.scale.x = object.scale.x/10
      object.scale.y = object.scale.y/10
      object.scale.z = object.scale.z/10

    })
  }


  setSize(data){
    this.mesh.position.set(0,0,0)
    this.mesh.scale.x = data.width ;
    this.mesh.scale.y = data.height;
    this.mesh.scale.z = data.length;
    this.mesh.position.set( data.width/2, data.height/2, data.length/2 );
  }

  setColors(data){
    this.materials['wall'].color.setHex(data.wall)
    this.materials['ceil'].color.setHex(data.ceil)
    this.materials['floor'].color.setHex(data.floor)
  }


  loadTextures(textureName){
    var wallTextureName = "beige-pattern.png"
    var ceilTextureName = "basic-white-tile.jpg"
    // load a texture, set wrap mode to repeat
    var texture = new THREE.TextureLoader().load( "assets/" + wallTextureName );
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set( 4, 4 );
    this.materials['wall'].map = texture;
    return texture
  }

  getMesh(){
    return this.scene;
  }

  updateMaterials(){
    for (var i = 0; i < this.mesh.material.length; i++) {
      this.mesh.material[i]
      if (i == 2){ // 3 is the face index of the ceil
        this.mesh.material[i] = this.ceilMaterial;
      }
      else if (i == 3){ // 3 is the face index of the floor
        this.mesh.material[i] = this.floorMaterial;
      }
      else{ // others indexes are walls
        this.mesh.material[i] = this.wallMaterial;
      }
      this.mesh.material[i].map.needsUpdate = true;
    }
  }


  setLight(data){
    this.light.intensity = data.intensity;
    this.light.color.setHex(data.color);
  }
}


function findObjectByTag(list, tag){
  for (var i = 0; i < list.length; i++) {
    if (list[i].tag == tag) {
      return list[i];
    }
  }
  return false;
}

// change the scale of the data
function correctData(data){
  for (var key in data) {
    if (typeof(data[key]) == 'number') {
      data[key] /= 1000;
    }
  }
  return data;
}

// Rotate an object around an arbitrary axis in world space
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}
