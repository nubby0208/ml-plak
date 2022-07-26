import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ColladaExporter } from 'three/examples/jsm/exporters/ColladaExporter'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass'
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass'

import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass'
import { Pass } from 'three/examples/jsm/postprocessing/Pass'

import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import TextSprite from '@seregpie/three.text-sprite'
import { LessStencilFunc } from 'three'

import domtoimage from 'dom-to-image';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { EventBus } from "@/index";
import { CuadroCad, CirculoCad, LineaCad, RotacionCad, PosicionCad } from "@/models/models.ts";

export class Viewer {
  constructor (container, existsCanvas, payloadCamera = null, config = null, fireEvents = null) {
    this.setupRenderer()
 
    this.setupContainer(container, existsCanvas)
    this.setupCamera(payloadCamera)
    this.setupConfig(config)
    this.setupFireEvents(fireEvents)

    this.setupTransformControls()    

    this.setupGlobalAttributes()
    
    this.setupCenterPivot()
    this.setupModelsGroup()
    
    this.setupLabels()
    this.setupDimensionLabels()
    this.setupGridHelper()
    this.setupMaterials()

    this.setupLights()
    this.setupScene()
    
    this.setupComposer()
    this.setupListeners()
    this.groupCad = new THREE.Group();
    this.groupCad.name = 'viewer-cad';
    this.ctimeRender = null;
    
    //this.renderFrame()
  }

  resetearView(){
    this.renderer = null;
    this.emptyElement(this.container);
    this.container = null;
    this.camera = null;
    this.perspectiveCamera = null;
    this.centerPivot = null;
    this.labels = null;
  }

  emptyElement(elem) {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
  }
  setupRenderer () {
    this.renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true})
    this.renderer.antialias = true
    // this.renderer.setPixelRatio( window.devicePixelRatio )

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // this.renderer.shadowMapSoft = true
    this.renderer.autoClear = true
  }

  setupContainer (container, existsCanvas) {
    this.container = container

    if (existsCanvas) {
      this.renderer.setSize(container.offsetWidth, container.offsetHeight)
    }
    else {
      this.renderer.setSize(container.offsetWidth, container.offsetHeight-2)
    }
    
    this.clearPreviousCanvas(this.container)
    this.container.appendChild(this.renderer.domElement)
  }

  setupCamera (payloadCamera) {
    let canvas = this.container.getElementsByTagName('canvas')[0]

    this.scaleFactor = 0.1
    this.camera = new THREE.PerspectiveCamera(75, this.container.offsetWidth / this.container.offsetHeight, 1, 10000)
    
    this.camera.name = 'perspective-camera'    

    // Set camera position
    this.camera.position.y = 6000 * this.scaleFactor
    this.camera.position.z = 6000 * this.scaleFactor

    this.perspectiveCamera = this.camera

    // If exists, set existing camera position
    if (payloadCamera && payloadCamera.position) {
      this.camera = payloadCamera
      this.camera.aspect = canvas.clientWidth/canvas.clientHeight;
    } 
    
    this.camera.updateProjectionMatrix();
  }

  setupCenterPivot () {
    this.centerPivot = new THREE.Object3D()
    this.centerPivot.matrixAutoUpdate = false
    this.centerPivot.name = 'center-pivot'
    
  }

  setupModelsGroup () {
    this.group = new THREE.Group()
    // this.group.castShadow = true
    // this.group.receiveShadow = true
    this.group.name = 'viewer-modelos'
    this.group.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor)
  }

  setupLabels () {
    this.labels = new THREE.Group()
    this.labels.name = 'viewer-labels'
  }

  setupDimensionLabels () {
    this.dimensionLabels = new THREE.Group()
    this.dimensionLabels.name = 'viewer-dimlabels'    
  }

  setupGridHelper () {
    this.gridHelper = new THREE.GridHelper(
      2000, // Size
      20, // Divisions
      0xcc2299, // Center line color
      0x888888, // Grid color
    )
    this.gridHelper.name = 'viewer-grid'
    this.gridHelper.visible = this.config.showGrid
  }

  setupMaterials () {
    this.materials = {
      'wood': new THREE.MeshPhongMaterial(
        {
          color: 0xffffff,
          side: THREE.FrontSide,
          shading: THREE.FlatShading,
          vertexColors: THREE.NoColors,
          reflectivity: 0.8
        }
      ),
      'wireframe': new THREE.LineBasicMaterial(
        {color: 0x000000, linewidth: 1}
      ),
      'grid': new THREE.LineBasicMaterial(
        {transparent: true, color: 0x000000, linewidth: 1, opacity: 0.2}
      )
    }
  }

  setupConfig (config) {
    this.config = {
      enablePieces: true,
      enableWireframe: true,
      enableTextures: true,
      enableLights: true,
      otherPassType: 'SAOPass',
      renderPassType: 'RenderPass',
      showGrid: false,
    }      

    if (config) {
      this.config = config
    }
  }

  setupFireEvents (fireEvents) {
    if (fireEvents) {
      this.clearLabelState = fireEvents.clearLabelState
    }
  }

  setupTransformControls() {
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement)
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value
      if(!event.value){
        // console.log(this.selectedObject.rotation._y/(Math.PI/180));
        if(this.transformControls.getMode() == "rotate"){
          
          console.log(event.target.object);
          // console.log({
          //   x:THREE.Math.radToDeg(event.target.object.rotation._x),
          //   y:THREE.Math.radToDeg(event.target.object.rotation._y),
          //   z:THREE.Math.radToDeg(event.target.object.rotation._z),
          // });
          
            this.setAllAxisFN({key:"rx", valor:THREE.Math.radToDeg(event.target.object.rotation._x)});
            this.setAllAxisFN({key:"ry", valor:THREE.Math.radToDeg(event.target.object.rotation._y)});
            this.setAllAxisFN({key:"rz", valor:THREE.Math.radToDeg(event.target.object.rotation._z)});

          if(typeof this.toggleRotate == "function") this.toggleRotate();
        }else if(this.transformControls.getMode() == "translate"){
          this.setAllAxisFN({key:"x", valor:Number(this.selectedObject.userData.x)+Number(this.selectedObject.position.x)});
          this.setAllAxisFN({key:"y", valor:Number(this.selectedObject.userData.y)+Number(this.selectedObject.position.y)});
          this.setAllAxisFN({key:"z", valor:Number(this.selectedObject.userData.z)+Number(this.selectedObject.position.z)});
          if(typeof this.toggleTranslacion == "function") this.toggleTranslacion();
        }
        console.log('dragging-changed', this.selectedObject);
      }
    })

    this.transformControls.addEventListener('objectChange', (event) => {
      console.log({
        x:event.target.object.quaternion.x,
        y:event.target.object.quaternion.y,
        z:event.target.object.quaternion.z,
      });
      this.renderFrame()
    })
  }

  setupGlobalAttributes() {
    this.isLabelMode = false
    this.pieceScale = 1

    this.textures = {}
    
    this.textureSize = {
      width: 1830,
      height: 2600
    }

    this.Export_Scale_factor = 0.01 // DAE EXPORT SCALE
    this.scaleOnExport = false

    // Almacena que tipo de vista esta activa: (perspective, front, back, left, right)
    this.currentActiveView = 'perspective'
    this.orthographicCamera = null
    this.editorModelsList = null // lista actual de modelos segun el editor.
  }

  setupLights () {
    this.lights = new THREE.Group()
    this.lights.name = 'viewer-lights'

    let mainLight = new THREE.AmbientLight(0xFFFFFF, 1) 
    
    // light
    mainLight.position.set(0, 500, 1000 );
    mainLight.name = 'main-light2'
    
    // this.lights.add(mainLight)
    this.lights.add(mainLight)
  }

  setupScene () {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf2f2f2)

    this.centerPivot.add(this.camera)
    this.scene.add(this.centerPivot)
    this.scene.add(this.group)
    this.scene.add(this.labels)
    
    if(this.config.enableLights){
      this.scene.add(this.lights)
    }

    this.scene.add(this.dimensionLabels)
    this.scene.add(this.gridHelper)
  }

  setupComposer () {       
    this.composer = new EffectComposer(this.renderer)
    
    this.setRenderPass()
    this.setShaderPass()
    
    this.composer.addPass(this.getSelectedItemsOutlinePass())
  }

  setupListeners () {
    const render = () => {
      this.renderFrame();
    }
    
    this.mouse = new THREE.Vector2()
    const canvas = this.container.getElementsByTagName('canvas')[0];    

    this.controls = new OrbitControls(this.camera,canvas);
    this.controls.screenSpacePanning = true;

    this.controls.addEventListener('change', render);

    /*
    this.controls.addEventListener('change', render);
    canvas.addEventListener('mousemove', render);
    */
  }

  renderFrame () {
    this.composer.render()
    this.composer.reset()
  }

  setRenderPass () {
    let renderPass = null

    if (this.config.renderPassType === 'SSAARenderPass') {
      renderPass = new SSAARenderPass(this.scene, this.camera)
      renderPass.unbiased = false;
      renderPass.sampleLevel = 2;
    }
    else if (this.config.renderPassType === 'TAARenderPass') {
      renderPass = new TAARenderPass(this.scene, this.camera)
    }
    else {
      renderPass = new RenderPass(this.scene, this.camera)
    }

    this.composer.addPass(renderPass)
  }
 
  setShaderPass () {
    let shaderPass = null

    if (this.config.shaderPassType === 'SAOPass') {
      shaderPass = new SAOPass(
        this.scene,
        this.camera,
        true
      )
			shaderPass.params.saoIntensity = 0.00012
			shaderPass.params.saoBlurStdDev = 8

      this.composer.addPass(shaderPass)
    }
  }
  
  getSelectedItemsOutlinePass () {
    
    let outlinePass =  new OutlinePass(
      new THREE.Vector2(
        this.container.offsetWidth,
        this.container.offsetHeight
      ),
      this.scene,
      this.camera,
      this.selectedObject
    )

    this.outlinePass = outlinePass

    outlinePass.edgeStrength = 3
    outlinePass.edgeThickness = 3
    outlinePass.edgeGlow = 3;
    outlinePass.visibleEdgeColor = new THREE.Color( 0xcc2299 );
    outlinePass.hiddenEdgeColor = new THREE.Color( 0x000000 );

    return outlinePass
  }


  cubeDr(a, x, y, z) {
    let cubeGeo = new THREE.BoxGeometry(a, a, a);
    let cubeMat = new THREE.MeshPhongMaterial({
        color: 0xfff000 * Math.random()
    });
    let cube = new THREE.Mesh(cubeGeo, cubeMat);
    
    cube.position.set(x, y, z);
    cube.castShadow = true;

    return cube;
  }

  /*
  * Load textures necesary to use on the pieces.
  * parameters :
  *    textures : array of texture's filenames
  */
  loadTextures (textures) {
    if (this.config.enableTextures) {
      let loader = new THREE.TextureLoader()
      let textureLength = textures.length;
      
      for (let i = 0; i < textureLength; i++) {
        if (textures[i].texture !== undefined && textures[i].texture.length > 1) {
          let texture = loader.load(
            textures[i].texture,
  
            // onLoad callback
            () => {
              this.renderFrame();              
            },
          
            // onProgress callback currently not supported
            undefined,
          
            // onError callback
            ( err ) => {
              console.error( 'An error happened.', err );
            }
          )
  
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
  
          this.textures[textures[i].name] = {
            'texture': texture,
            'color': ''
          }

          texture.onUpdate = function(){
            texture = null;
          };
        } else {
          let color = textures[i].color ? textures[i].color.replace('#', '0x') : '0xFFFFFF'
          this.textures[textures[i].name] = {
            'texture': '',
            'color': color
          }
        }
      }
  
      this.refreshTextures()
    }
  }

  refreshTextures () {
    this.group.children.forEach(m => {
      m.children.forEach(pieceMesh => {
        let data = pieceMesh.userData
        if (
          data.material &&
          this.textures[data.material] &&
          this.textures[data.material].texture &&
          pieceMesh.children[0]
        ) {
          pieceMesh.children[0].material.map = this.textures[data.material].texture
          pieceMesh.children[0].material.needsUpdate = true
        }
      })
    })
  }

  addLight (x, y, z) {
    let light = new THREE.PointLight(0xffffff, 1)
    light.position.set(x, y, z)
    this.lights.add(light)

    return light
  }

  createModels (data) {
    this.scene.remove(this.group)
    this.group = new THREE.Group()
    this.scene.add(this.group)
    this.data = data
    let dataLength = data.length;

    for (let i = 0; i < dataLength; i++) {
      const model = this.createModel(data[i])
      this.group.add(model)
    }
  }

  findModelByTag (tag) {
    let childrenLength = this.group.children.length; 
    for (let i = 0; i < childrenLength; i++) {
      if (this.group.children[i].tag === tag) {
        return this.group.children[i]
      }
    }
    return false
  }

  removeModel (id) {
    let model = this.findById(id)
    if (model) {
      this.group.remove(model)
    }
  }

  addModel (data) { // then create the model and add it to the scene
    let model = this.createModel(data)
    this.group.add(model)
    return model
  }

  renderCad(data, store) {
    try {
      if(data.length < 1){
        return true;
      }
      this.clearGroupCad();
  
      
      if(!store.state.layout.showCad3d){
        store.state.layout.showCad3d = false;
        return true;
      }
      
      data = JSON.parse(data);

      data.grupos.forEach((grupo, index) => {

        let groupCad = new THREE.Group()
        groupCad.name = `grupo_cad_${index}`;
        groupCad.userData.id = `grupo_cad_${index}`;
        var rotacion = new RotacionCad(grupo.rotacion);
        var posicion = new PosicionCad(grupo.posicion);
        groupCad.position.set(parseInt(posicion.x*0.1), parseInt(posicion.y*0.1), parseInt(posicion.z*0.1));

        groupCad.rotation.set(THREE.Math.degToRad(rotacion.x), THREE.Math.degToRad(rotacion.y), THREE.Math.degToRad(rotacion.z));
        
        if(grupo.show3d === false){
          return true;
        }
  
        if(grupo.lineas.length > 0){
          grupo.lineas.forEach((linea, indexLinea) => {
            if(linea.show3d === false){
              return true;
            }
            
            try {
              linea.name = `cad_linea_${index}_${indexLinea}`;
              linea.id = `cad_linea_${index}_${indexLinea}`;

              var dibujarLineaCad = this.dibujarLineaCad(
                {
                  x:this.convertir(linea.PointStart[1]), 
                  y:this.convertir((linea.PointStart[2]*-1)),
                },
                {
                  x:this.convertir(linea.PointEnd[1]), 
                  y:this.convertir((linea.PointEnd[2]*-1)),
                },
                undefined,
                linea
              );
              
              groupCad.add(dibujarLineaCad);
            } catch (error) {
              
            }
            
          });

        }

        if(grupo.Circles.length > 0){
          grupo.Circles.forEach((Circles, indexCircles) => {
            
            if(Circles.show3d === false){
              return true;
            }
            
            try {
              Circles.name = `cad_circulo_${index}_${indexCircles}`;
              Circles.id = `cad_circulo_${index}_${indexCircles}`;
              
              var crearCirculoCad = this.crearCirculoCad(this.convertir(Circles.radio), this.convertir(Circles.center[0]), this.convertir(Circles.center[1]*-1), 1, Circles.color, Circles);
              groupCad.add(crearCirculoCad);
            } catch (error) {
              console.log(error);
              
            }
            
          });
          
        }
  
        if(grupo.Squares.length > 0){
          
          grupo.Squares.forEach((cuadros, indexCuadro) => {
            
            if(cuadros.show3d === false){
              return true;
            }

            // let groupCuadroCad = new THREE.Group()
            // groupCuadroCad.tag = "cad_cuadro";
            
            var bootomX = (cuadros.BottomRight[0]);
            var bootomY = (cuadros.BottomRight[1]*-1);
            var topX = (cuadros.topLeft[0]);
            var topY = (cuadros.topLeft[1]*-1);
    
            const v1 = new THREE.Vector2(topX, topY);
            const v2 = new THREE.Vector2(bootomX, bootomY);
            var alto = topY-bootomY;
            var ancho = bootomX-topX;
            
    
            const size = new THREE.Vector2();
            size.addVectors(v1, v2);

            // groupCuadroCad.name = `cad_cuadro_${index}_${indexCuadro}`;
            cuadros.name = `cad_cuadro_${index}_${indexCuadro}`;
            cuadros.id = `cad_cuadro_${index}_${indexCuadro}`;
            var cuadroPieza = this.dibujarCuadroCad(this.convertir(ancho), this.convertir(alto), 1, this.convertir(bootomX-ancho), this.convertir(bootomY), -1, cuadros.color, cuadros);
            // groupCuadroCad.add(cuadroPieza);
            groupCad.add(cuadroPieza);      
          });

        }
        
        // this.groupCad.rotation.set();
        this.groupCad.add(groupCad);
      });
      
      console.log(this.groupCad);
      this.scene.add(this.groupCad);
    } catch (error) {
      console.error(error);
    }
  }

  convertir(valor){
    return (valor*0.1);
  }

  rotateCad(group, rotacion){
    var axisX = new THREE.Vector3(1, 0, 0);
    var axisY = new THREE.Vector3(0, 1, 0);
    var axisZ = new THREE.Vector3(0, 0, 1);

    var quatX = new THREE.Quaternion();
    var quatY = new THREE.Quaternion();
    var quatZ = new THREE.Quaternion();

    quatX.setFromAxisAngle(axisX, THREE.Math.degToRad(rotacion.x));
    quatY.setFromAxisAngle(axisY, THREE.Math.degToRad(rotacion.y));
    quatZ.setFromAxisAngle(axisZ, THREE.Math.degToRad(rotacion.z));
    
    quatY.multiply(quatX);
    quatZ.multiply(quatY);
    group.quaternion.copy(quatZ);
  }
  
  dibujarCuadroCad(sizeX, sizeY, width, x=0, y=0, z=0, color=0x0099ff, cuadros){

    var userData = {
      id:cuadros.id,
      cad_data:cuadros,
      dimesiones: new CuadroCad({
        x:x,
        y:y,
        z:z,
        alto:sizeX/0.1,
        ancho:sizeY/0.1,
      })
    };

    var frameGeom = this.createCuadro(sizeX, sizeY, width);
    frameGeom.translate(x, y, z);
    
    var frame = new THREE.Mesh(frameGeom, new THREE.MeshBasicMaterial({color: color}));
    frame.name = cuadros.id;
    frame.userData = userData;
    // console.log(frame);

    return frame;
  }

  dibujarLineaCad(PInicial, PFinal, color=0x0099ff, data){
    return this.createLineCad(
      {
        x:PInicial.x,
        y:PInicial.y,
        z:0,
      },
      {
        x:PFinal.x,
        y:PFinal.y,
        z:0,
      },
      color,
      data
    );
  }

  createLineCad (s, d, color, data) {

    var userData = {
      id:data.id,
      cad_data:data,
      dimesiones: new LineaCad({
      })
    };
    
    const material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 3,
      linecap: 'round',
      linejoin:  'round'
    });
    // material.depthFunc(10);
    let geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(s.x, s.y, s.z))
    geometry.vertices.push(new THREE.Vector3(d.x, d.y, d.z))
    let line = new THREE.Line(geometry, material)
    line.name = data.name;
    line.userData = userData;
    return line;
  }

  crearCirculoCad(radio, x=0, y=0, z=0, color, data){
    
    var userData = {
      id:data.id,
      cad_data:data,
      dimesiones: new CirculoCad({
        x:x,
        y:y,
        z:z,
        radio:radio,
      })
    };

    console.log(data);
    
    var radius = radio,
    segments = 64,
    material = new THREE.LineBasicMaterial( {color: color} ),
    geometry = new THREE.CircleGeometry( radius, segments );
    geometry.translate(x, y, z);

    // Remove center vertex
    geometry.vertices.shift();

    // Non closed circle with one open segment:
    // new THREE.LineLoop( geometry, material )
    let line = new THREE.Line( geometry, material )
    line.name = data.name;
    line.userData = userData;

    // To get a closed circle use LineLoop instead (see also @jackrugile his comment):
    
    return line;
    
  }

  createCuadro(sizeX, sizeY, width){
    let shape = new THREE.Shape([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(sizeX, 0),
			new THREE.Vector2(sizeX, sizeY),
			new THREE.Vector2(0, sizeY)
		]);

		let hole = new THREE.Path([
			new THREE.Vector2(width, width),
			new THREE.Vector2(width, sizeY - width),
			new THREE.Vector2(sizeX - width, sizeY - width),
			new THREE.Vector2(sizeX - width, width)
		]);
		shape.holes.push(hole);

    const extrudeSettings = { depth: 1, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 0, bevelThickness: 1 };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

		// let geometry = new THREE.ShapeGeometry(shape);
		return geometry
  }

  createModel (data) {    
    let group = new THREE.Group()
    group.tag = data.tag
    group.name = data.tag // asignado como nombre tambien

    // clean and remodeling group user data
    let userData = Object.keys(data)
    let filteredDataWithoutFunctions = userData.filter(k => typeof data[k] !== 'function')
    const reducer = (acc, current) => Object.assign(acc, {[current]: data[current]})

    group.userData =  filteredDataWithoutFunctions.reduce(reducer, {})
    group.userData.type = 'module'
    group.castShadow = true
    group.position.set(parseInt(data.x), parseInt(data.y), parseInt(data.z))

    // Creating meshes
    data.pieces.forEach((piece) => {
      group.add(this.createPiece(piece))
    })

    group.originalMatrix = group.matrix
    this.createModelLabel(group) // MARK: desactivado por pruebas de exportacion 5-FEB-2019 VGA

    if (this.selectedObject && group.userData.id === this.selectedObject.userData.id) {      
      this.selectItem(group)
    }
    
    return group
  }

  rotate (r) {
    this.centerPivot.rotation.y += r
  }

  createPiece (data) {    
    let piece = new THREE.Group()
    let geometry = new THREE.BoxGeometry(1, 1, 1)    
    let dimensions = this.adjustDimensions(data)
    this.setTextureToGeometry(geometry, dimensions, this.textureSize)    
    
    piece.tag = data.name
    piece.position.x = data.x + dimensions.w / 2
    piece.position.y = data.y + dimensions.h / 2
    piece.position.z = data.z + dimensions.l / 2
    piece.scale.x = dimensions.w * this.pieceScale
    piece.scale.y = dimensions.h * this.pieceScale
    piece.scale.z = dimensions.l * this.pieceScale

    piece.userData = Object
      .keys(data)
      .filter(
        k => typeof data[k] !== 'function'
      ).reduce(
        (obj2, key) => Object.assign(
          obj2,
          {
            [key]: data[key]
          }
        ),
        {}
      )
    // Adding Meshes
    if (this.config.enablePieces) {
      let pieceMesh = new THREE.Mesh(
        geometry,
        // new THREE.MeshBasicMaterial()
        // new THREE.MeshPhongMaterial()
        new THREE.MeshStandardMaterial()
      )
      pieceMesh.tag = data.name
      pieceMesh.pieceType = 'piece'    
      pieceMesh.material.color.setHex(0xffffff)   

      // pieceMesh.renderOrder = 10
      pieceMesh.receiveShadow = false
      pieceMesh.castShadow = false

      piece.add(pieceMesh)
    }

    // // Selecting Object
    // if (this.selectedObject && piece.userData.id === this.selectedObject.userData.id) {
    //   this.selectItem(pieceMesh)
    // }
    
    if (this.config.enableWireframe) {
      let wireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial(
          {
            color: 0x000000,
            linewidth: 1
          }
        )
      )
      piece.add(wireframe)
    }
    
    return piece
  }

  updatePiece (data) {
    let model = this.findModelByTag(data.model)
    if (!model) { return }

    const pieceMesh = model.children[data.index * 2]
    const pieceWireframe = model.children[data.index * 2 + 1]

    pieceMesh.visible = data.visible
    pieceWireframe.visible = data.visible && data.wireframe
  }

  updateMLPlackPiece (data) {
    let piece = this.findById(data.id)

    // console.log(piece)

    if (piece === undefined) {
      // console.log(`updateMLPlackPiece: Piece ${data.id} not found.`)
      return
    }

    // console.log(`updateMLPlackPiece: Piece ${data.id} found`)

    let dimensions = this.adjustDimensions(data)
    piece.visible = data.visible

    piece.position.x = parseFloat(data.x) + dimensions.w / 2
    piece.position.y = parseFloat(data.y) + dimensions.h / 2
    piece.position.z = parseFloat(data.z) + dimensions.l / 2

    piece.scale.x = dimensions.w
    piece.scale.y = dimensions.h
    piece.scale.z = dimensions.l
  }

  updateMLPlackModel (d) {
    let model = this.findById(d.id)

    if (model === undefined) {
      // console.log(`updateMLPlackModel: Model ${d.id} not found. Creating it now`)
      model = this.addModel(d)
    }

    // console.log(d)

    model.visible = d.visible

    // under review, not sure if necessary because doesn´t update outter files
    d.pieces.forEach(function (p) {
      this.updateMLPlackPiece(p)
    }.bind(this))
    model.children.forEach((e) => { e.visible = d.visible })


    model.position.set(
      0,
      0,
      0,
    )

    this.rotateModel(model, d)
  }

  clearGroup () {
    while ( this.group.children.length > 0) { 
      this.group.remove(this.group.children[0]); 
    }
  }
  clearGroupCad () {
    while ( this.groupCad.children.length > 0) { 
      this.groupCad.remove(this.groupCad.children[0]); 
    }
  }

  loadAllModulesForRender (modules) {
    this.clearGroup()

    const normalizedNewVal = Object.values(modules)
    normalizedNewVal.forEach( (model) => {
      this.updateMLPlackModel(model)
      
      model.pieces.forEach((piece) => {
        this.updateMLPlackPiece(piece)
      })
    })
  }

  /* TODO: deprecated.
     replaced with updateMLPlackModel function
  */
  updateModel (d) {
    let model
    let childrenLength = this.group.children.length 
    for (let i = 0; i < childrenLength; i++) {
      if (this.group.children[i].id === d.id) {
        model = this.group.children[i]
      }
    }

    if (model === undefined) {
      return
    }

    model.visible = d.visible

    this.rotateModel(model, d)
    model.updateMatrixWorld()

    const offset = new THREE.Vector3(d.x, d.y, d.z)
    let quaternion = new THREE.Quaternion()
    quaternion.copy(model.quaternion)
    offset.applyQuaternion(quaternion)
    model.position.copy(offset)

    this.updateModelLabel(model)
  }

  updateModelVisibility (d) {
    let model
    let childrenLength = this.group.children.length
    for (let i = 0; i < childrenLength; i++) {
      if (this.group.children[i].tag === d.tag) { model = this.group.children[i] }
    }
    if (model === undefined) {
      return
    }
    model.visible = d.visible
    this.updateModelLabel(model)
  }

  rotateModel (group, data) { // group.rotation.set(data.rx * Math.PI/180, data.ry * Math.PI/180, data.rz * Math.PI/180);

    console.log(group.userData);
    // group.position.set(group.userData.x*0.1, group.userData.y*0.1, group.userData.z*0.1);
    // group.rotation.set(data.rx * Math.PI/180, data.ry * Math.PI/180, data.rz * Math.PI/180);
    // return true;
    // Declare angles
    // var angleX = data.rx;
    // var angleY = data.ry;
    // var angleZ = data.rz;

    // // Declare X and Y axes
    // var axisX = new THREE.Vector3(1, 0, 0);
    // var axisY = new THREE.Vector3(0, 1, 0);
    // var axisZ = new THREE.Vector3(0, 0, 1);

    // // Init quaternions that will rotate along each axis
    // var quatX = new THREE.Quaternion();
    // var quatY = new THREE.Quaternion();
    // var quatZ = new THREE.Quaternion();

    // // Set quaternions from each axis (in radians)...
    // quatX.setFromAxisAngle(axisX, THREE.Math.degToRad(angleX));
    // quatY.setFromAxisAngle(axisY, THREE.Math.degToRad(angleY));
    // quatZ.setFromAxisAngle(axisZ, THREE.Math.degToRad(angleZ));
    // // console.log(THREE.Math.radToDeg(quatX), THREE.Math.radToDeg(quatY), THREE.Math.radToDeg(quatX));
    // console.log(quatX, quatY, quatX);
    // // ...then multiply them to get final rotation
    // quatY.multiply(quatX);
    // quatZ.multiply(quatY);

    // // Apply multiplied rotation to your mesh
    // group.quaternion.copy(quatZ);
    
    group.matrix = group.originalMatrix
    // group.rotation.set(data.rx * Math.PI/180, data.ry * Math.PI/180, data.rz * Math.PI/180);
    this.rotateAroundWorldAxis(group, new THREE.Vector3(1, 0, 0), data.rx * Math.PI / 180)
    this.rotateAroundWorldAxis(group, new THREE.Vector3(0, 1, 0), data.ry * Math.PI / 180)
    this.rotateAroundWorldAxis(group, new THREE.Vector3(0, 0, 1), data.rz * Math.PI / 180)
  }

  setEdgeColor (v) {
    //console.log('setEdgeColor', v)
    this.materials['wireframe'].color.setHex(v)
  }

  /**
   * Remarks a 3D object
   */
  selectItem (selected) {    
    if (!selected) { return }

    selected.wireframe = true
    this.selectedObject = selected
    this.outlinePass.selectedObjects = [selected]

    // this.transformControls.attach(selected)
    // this.scene.add(this.transformControls)
  }

  selectItemCad (selected) {    
    if (!selected) { return }

    this.selectedObject = selected
    this.outlinePass.selectedObjects = [selected]

    // this.transformControls.attach(selected)
    // this.scene.add(this.transformControls)
  }

  activateAxis(type) {
    if (!this.transformControls) return

    switch (type) {
        case "R":
          this.transformControls.setMode('rotate');
          break;
        case "T":
          this.transformControls.setMode('translate');
          break;
      }
  }

  prepareTransformControlsToScene() {
    this.scene.remove(this.transformControls)
    // console.log(this.selectedObject.rotation._y/(Math.PI/180), this.selectedObject.rotation, (Math.PI/180));
    this.transformControls.position.x = this.selectedObject.userData.x*0.1;
    this.transformControls.position.y = this.selectedObject.userData.y*0.1;
    this.transformControls.position.z = this.selectedObject.userData.z*0.1;

    var data = this.selectedObject.userData;
    // this.transformControls.rotation.set(0, 0, 0);
    // this.transformControls.showY = false;
    // this.transformControls.showZ = false;
    this.transformControls.setSpace("local");
    // this.transformControls.setRotationSnap(90);

    console.log(this.selectedObject);
    this.transformControls.attach(this.selectedObject)
    console.log(this.selectedObject.userData.x);
    this.scene.add(this.transformControls)
  }

  removeTransformControls() {
    this.transformControls.detach()
  }

  updateTransformControlsStatus(data) {
    this.setAllAxisFN = data.setAllAxisFN;
    this.toggleTranslacion = data.toggleTranslacion;
    this.toggleRotate = data.toggleRotate;
    if (!data.traslationStatus && !data.rotationStatus) {
      this.removeTransformControls()
    }
    else {
      if (data.traslationStatus) {
        this.showTransformControls('T')
      }
      else if (data.rotationStatus) {
        this.showTransformControls('R')
      }
    }

    this.renderFrame()
  }

  showTransformControls(type) {
    this.prepareTransformControlsToScene()

    switch (type) {
        case "R":
          this.transformControls.setMode('rotate');
          break;
        case "T":
          this.transformControls.setMode('translate');
          break;
    }

    this.renderFrame()
  }

  getModuleByName(moduleName) {
    return this;
  }

  selectItemById (id) {
    let selected = this.findById(id)
    if (!selected) { return }
    selected.wireframe = true
    this.selectedObject = selected
    this.outlinePass.selectedObjects = [selected]
  }

  toggleRotation (rotate) {
    this.autoRotate = rotate
  }

  createLine (s, d) {
    let geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(s.x, s.y, s.z))
    geometry.vertices.push(new THREE.Vector3(d.x, d.y, d.z))
    let line = new THREE.Line(geometry, this.materials['grid'])
    this.scene.add(line)
    return line
  }
  
  createOrigin () {
    this.createLine({
      x: 0,
      y: 0,
      z: 0
    }, {
      x: 10,
      y: 0,
      z: 0
    })
    this.createLine({
      x: 0,
      y: 0,
      z: 0
    }, {
      x: 0,
      y: 3,
      z: 0
    })
    this.createLine({
      x: 0,
      y: 0,
      z: 0
    }, {
      x: 0,
      y: 0,
      z: 3
    })
  }

  toggleGrid (show) {
    this.gridHelper.visible = show
  }

  // create obj file with the meshes
  exportToObj (filename, callback) {
    let exporter = new OBJExporter()

    let result = exporter.parse(this.group)
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result))
    element.setAttribute('download', filename + '.obj')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    callback()
  }

  exportToObjDAE (filename, callback) {
    if (this.scaleOnExport) {
      this.scaleModelDae(this.Export_Scale_factor)
    }

    // el nombre de archivo puede estar vacio o no existir.
    // var nombreArchivo = 'archivoDae_' + shading + '_' + materialType + '.dae'
    let nombreArchivo = 'archivoDae.dae'
    if (!(!filename || filename.length === 0)) {
      nombreArchivo = filename
    }

    // var shading
    // esta variable DEBE ser GLOBAL si no se necesit hay que elimnar
    // esta variable y todo lo relacionado a la misma

    let exportGroup = this.group.clone()

    if (this.room) {
      exportGroup.add(this.room.mesh.clone())
    }

    let exporter = new ColladaExporter()

    let result = exporter.parse(exportGroup)
    exportGroup = null
    if (this.scaleOnExport) {
      this.scaleModelDae(100)
    }

    /*
    var materialType = 'Phong'
    if (shading === 'wireframe') {
      materialType = 'Constant'
    }

    if (shading === 'smooth') {
      materialType = 'Lambert'
    }
    */
    let that = this
    this.saveString(result.data, nombreArchivo)
    result.textures.forEach(tex => {
      that.saveArrayBuffer(tex.data, `${
        tex.name
      }.${
        tex.ext
      }`)
    })
  }

  exportToGLTF (callbackWithResult) { // Instantiate a exporter
    let exporter = new GLTFExporter()
    let options = {}

    // Parse the input and generate the glTF output
    exporter.parse(this.scene, function (gltf) { // console.log( gltf );
      if (callbackWithResult && typeof callbackWithResult === 'function') {
        callbackWithResult(JSON.stringify(gltf))
      }
    }, options)
  }

  loadGLTF (resourceUrl) {
    let loader = new GLTFLoader()
    loader.load(
      // resource URL
      resourceUrl,
      // called when the resource is loaded
      function (gltf) { // console.log(gltf);
        this.scene.remove(this.centerPivot)
        this.scene.remove(this.lights)
        this.scene.remove(this.labels)
        this.scene.remove(this.dimensionLabels)
        this.scene.background = new THREE.Color(0xf2f2f2)

        this.centerPivot = gltf.scene.getObjectByName('center-pivot')
        // this.group  =  gltf.scene.getObjectByName('viewer-modelos');
        this.labels = gltf.scene.getObjectByName('viewer-labels')
        this.lights = gltf.scene.getObjectByName('viewer-lights')
        this.dimensionLabels = gltf.scene.getObjectByName('viewer-dimlabels')
        // this.perspectiveCamera = this.centerPivot.getObjectByName('perspective-camera')
        // this.camera = this.perspectiveCamera

        // TODO: Restaurar la vista de perspectiva las variables y todo

        this.scene.add(this.centerPivot.add(this.camera))
        // this.scene.add(this.group)
        this.scene.add(this.labels)
        this.scene.add(this.lights)

        // esto es a veces borrado de la escena.
        if (this.dimensionLabels && (typeof this.dimensionLabels !== 'undefined')) {
          this.scene.add(this.dimensionLabels)
        }

        // this.createGrid()
        // this.render()

        // recrear la luz y los controles como si fuera la primera vez
        this.controls.dispose()
        console.log("loadGLTF: new OrbitControls")
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.screenSpacePanning = true

        this.mainLight = new THREE.AmbientLight(0xffffff)
        this.mainLight.name = 'main-light'
        this.lights.add(this.mainLight)
        // gltf.asset // Object
      }.bind(this),
      // called while loading is progressing
      function (xhr) { // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function (error) {
        console.log('An error happened', error)
      }
    )
  }

  testExportObj () {
    let exporter = new OBJExporter()
    //console.log('testExportObj')
    return exporter.parse(this.scene)
  }

  testLoadObj (resourceUrl) {
    let tempViewerScene = this.scene
    let object

    let lmodel = function () {
      tempViewerScene.children = object.children
    }

    let manager = new THREE.LoadingManager(lmodel)
    manager.onProgress = function (item, loaded, total) { // console.log( item, loaded, total );
    }

    let afterlLoading = function (obj) {
      object = obj
      // console.log(object);
    }

    let loader = new OBJLoader(manager)
    loader.load(resourceUrl, afterlLoading, function () { // progress
    }, function () { // error
    })
  }

  togglePiecesVisibility (v) {
    let childrenLength = this.group.children.length;
    for (let i = 0; i < childrenLength; i++) {
      let model = this.group.children[i]
      let modelChildrenLength = model.children.length;
      for (let j = 0; j < modelChildrenLength; j++) {
        if (model.children[j].pieceType === 'piece') {
          model.children[j].visible = v
        }
      }
    }
  }

  /*
   * Genera un link para descargar una imagen de la vista actual del visor
   */
  async exportImage (filename) {
    const img = await this.getCurrentImage()
    let tmpLink = document.createElement('a')
    tmpLink.setAttribute('href', img)
    tmpLink.setAttribute('download', filename + '.jpeg')
    tmpLink.style.display = 'none'
    document.body.appendChild(tmpLink)
    tmpLink.click()
    document.body.removeChild(tmpLink)
  }

  /*
   * Retorna la imagen correspondiente a la vista actual del visor 3d.
   */
  async getCurrentImage () {
    let viewerImg
    await domtoimage.toPng(document.getElementById('viewer-details'))
      .then((dataUrl) => {
        viewerImg = dataUrl
      });    
    
    let tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = this.container.offsetWidth
    tmpCanvas.height = this.container.offsetHeight
    this.container.appendChild(tmpCanvas)
    let ctx = tmpCanvas.getContext('2d')

    return new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0)
        let outputImg = tmpCanvas.toDataURL('image/jpeg')
        this.container.removeChild(tmpCanvas)
        resolve(outputImg)
      })
      image.addEventListener('error', err => reject(err))
      image.src = viewerImg
    })
  };

  updateRoomElement (data) {
    if (this.room) {
      this.room.updateObject(data)
    }
  }

  removeRoomElement (data) {
    if (this.room) {
      this.room.removeObject(data.tag)
    }
  }

  // Rotate an object around an arbitrary axis in world space
  rotateAroundWorldAxis (object, axis, radians) {
    let rotWorldMatrix = new THREE.Matrix4()
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians)
    rotWorldMatrix.multiply(object.matrix) // pre-multiply
    object.matrix = rotWorldMatrix
    object.rotation.setFromRotationMatrix(object.matrix)
  }

  /*
     * Search which textures must be loaded to create the pieces
     * parameters :
     *    data: pieces data
     * return
     *    toLoad: array of textures to load
     */
  extractTextures (data) {
    let toLoad = []
    let piecesLength = data.pieces.length;

    for (let i = 0; i < piecesLength; i++) {
      if (data.pieces[i].texture !== undefined && toLoad.indexOf(data.pieces[i].texture) === -1) { // should be a valid texture and must be not previously added to the lightIntensity
        toLoad.push(data.pieces[i].texture)
      }
    }
    return toLoad
  }

  /* Dibuja texto sobre los modelos para identificarlos. */
  createModelLabel (model) {
    let box = new THREE.Box3().setFromObject(model)
    let center = new THREE.Vector3()
    box.getCenter(center)
    let position = new THREE.Vector3(center.x * this.scaleFactor, model.position.y + (box.max.y + 500) * this.scaleFactor, center.z * this.scaleFactor)
    let label = this.createLabel({
      text: model.tag,
      redrawInterval: 1000,
      size: 50,
      position: position,
      visible: false
    })

    this.labels.add(label)
    model.label = label
  }

  /* muestra / oculta los nombres sobre los modelos */
  showLabels (show) {
    let childrenLength = this.group.children.length;
    for (let i = 0; i < childrenLength; i++) {
      this.group.children[i].label.visible = show
    }
  }

  /* actualiza el label de un modelo especifico */
  updateModelLabel (model) {
    let label = model.label
    let box = new THREE.Box3().setFromObject(model)
    let center = box.getCenter()
    // let size = box.getSize()
    label.position.set(center.x, box.max.y + 500 * this.scaleFactor, center.z)
  }

  showDimensions (show, m) {
    this.scene.remove(this.dimensionLabels)
    this.dimensionLabels = new THREE.Group()
    this.scene.add(this.dimensionLabels)
    if (!show) { // console.log("Ocultar dimensiones.");
      return
    }
    if (m == null) {
      alert('Debe seleccionar un modelo.')
      return
    }

    let model = this.findModelByTag(m.tag)
    // let modelBox = new THREE.Box3().setFromObject(model)
    // let modelCenter = modelBox.getCenter()
    // let modelSize = modelBox.getSize()

    let childrenLength = model.children.length;

    for (let i = 0; i < childrenLength; i++) {
      let piece = model.children[i]
      if (piece.pieceType === 'wireframe') { continue }

      let box = new THREE.Box3().setFromObject(piece)
      let center = box.getCenter()
      // let size = box.getSize()

      let position = new THREE.Vector3(center.x, box.max.y + 4, box.max.z)

      let label = this.createLabel({
        text: piece.userData.pattern.frontWidth,
        size: 8,
        redrawInterval: 0,
        position: position,
        visible: true
      })
      this.dimensionLabels.add(label)
    }
  }

  getPatternImg (m) {
    if (m == null) {
      alert('Debe seleccionar un modelo.')
      return
    }
    let model = this.findModelByTag(m.tag)
    let tmpLabels = new THREE.Group()
    this.scene.add(tmpLabels)

    let modelBox = new THREE.Box3().setFromObject(model)
    let modelCenter = modelBox.getCenter()
    let modelSize = modelBox.getSize()

    let childrenLength = model.children.length;

    for (let i = 0; i < childrenLength; i++) {
      let piece = model.children[i]
      if (piece.pieceType === 'wireframe') { continue }

      let box = new THREE.Box3().setFromObject(piece)
      let center = box.getCenter()
      // let size = box.getSize()

      let position = new THREE.Vector3(center.x, box.max.y + 4, box.max.z)

      let label = this.createLabel({
        text: piece.userData.pattern.frontWidth,
        size: 8,
        redrawInterval: 0,
        position: position,
        visible: true
      })

      tmpLabels.add(label)
    }

    let aspectRatio = this.container.offsetWidth / this.container.offsetHeight
    let height = 0
    let width = 0
    if (modelSize.z > modelSize.y) {
      width = modelSize.z * 1.2
      height = width / aspectRatio
    } else {
      height = modelSize.y * 1.2
      width = height * aspectRatio
    }

    let newCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, modelSize.z)
    this.scene.add(newCamera)

    newCamera.position.set(modelCenter.x, modelCenter.y, modelBox.max.z)
    newCamera.lookAt(modelCenter)

    this.renderer.render(this.scene, newCamera)

    this.exportIMG(model.tag)

    this.scene.remove(newCamera)
    this.scene.remove(tmpLabels)
  }

  getSelectedObject () {
    return this.selectedObject
  }

  clearSelection() {    
    this.outlinePass.selectedObjects = []
    this.selectedObject = null
    
    this.removeTransformControls()    
  }

  clearOrthographicCamera () {
    this.scene.remove(this.camera)
    this.camera = this.perspectiveCamera
    this.setupComposer()
  }

  cameraOrthographic (view) {
    this.cameraEnableOrthographicCamera()
    this.currentActiveView = view
    this.setCameraPosition()
    this.fireMarkerCountUpdatedEvent()
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
  cameraCreateOrthographicViewCamera () {
    let newCamera = new THREE.OrthographicCamera(this.container.offsetWidth / -2, this.container.offsetWidth / 2, this.container.offsetHeight / 2, this.container.offsetHeight / -2, 100, 100000)

    newCamera.up = new THREE.Vector3(0, 1, 0)
    this.controls.dispose()

    console.log("cameraCreateOrthographicViewCamera: new OrbitControls")

    this.controls = new OrbitControls(newCamera, this.renderer.domElement)
    this.controls.enableRotate = false
    this.controls.keyPanSpeed = 200
    this.controls.screenSpacePanning = true
    this.maxPolarAngle = 0
    this.minPolarAngle = 0

    return newCamera
  }

  // ---------------------------------------------------------------
  // camara ortografica, se crea una sola vez y se reutiliza
  // se crea sobre el modelo y mora hacia "abajo" en el eje Y
  cameraEnableOrthographicCamera () {
    // justo antes de activar la camara se rotan todos los modelos a 0
    // hay que usar la funcion interna que los rota.
    /*
    var rotationZeroData = JSON.parse(JSON.stringify(this.editorModelsList))
    Object.keys(rotationZeroData).forEach((key, idx) => { // console.log( rotationZeroData[key] ) ;
      rotationZeroData[key].rx = 0
      rotationZeroData[key].ry = 0
      rotationZeroData[key].rz = 0

      // this.updateModel(rotationZeroData[key]);
    })
    */

    this.orthographicCamera = this.cameraCreateOrthographicViewCamera()
    // var helper = new THREE.CameraHelper(this.orthographicCamera)
    this.camera = this.orthographicCamera
    this.scene.add(this.camera)
    // this.scene.add(helper)

    this.controls.dispose() // remove listeners
    
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableRotate = false
    this.controls.screenSpacePanning = true

    const render = () => {
      this.renderFrame();
    }

    this.controls.addEventListener('change', render)

    this.setupComposer()
  }

  cameraUserView () {
    // console.log("entra a cameraUserView")

    const render = () => {
      this.renderFrame();
    }

    this.currentActiveView = 'perspective'
    this.camera = this.perspectiveCamera

    this.camera.zoom = 3

    this.camera.updateProjectionMatrix()
    this.controls.dispose() // remove listeners
    
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.screenSpacePanning = true

    this.controls.addEventListener('change', render)

    this.fireMarkerCountUpdatedEvent()

  }

  // ---------------------------------------------------------------
  // aplica una rotación al modelo por vez
  // utilizando el tipo de vista activa  this.currentActiveView
  //
  setCameraPosition () {
    // var groupbbox = new THREE.Box3().setFromObject(this.group)
    // 2 aplicar la nueva rotacion
    switch (this.currentActiveView) {
      case 'front':
        this.camera.translateOnAxis(new THREE.Vector3(0, 0, 1), 1000)
        this.camera.lookAt(new THREE.Vector3())
        break
      case 'back':
        this.camera.translateOnAxis(new THREE.Vector3(0, 0, 1), -1000)
        break
      case 'left':
        this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), -1000)
        break
      case 'right':
        this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), 1000)
        break
      case 'top':
        this.camera.translateOnAxis(new THREE.Vector3(0, 1, 0), 1000)
        break
      case 'bottom':
        this.camera.translateOnAxis(new THREE.Vector3(0, 1, 0), -1000)
        break
      case 'perspective':
        // no hace nada el modelo esta en posicion
        break
      default:
        console.log('Viewver.js: no puedo rotar modelo.', this.currentActiveView, ' No es un tipo de vista válido')
    }
    this.camera.lookAt(new THREE.Vector3())
  }


  // --------------------------------------------------
  // disparador de evento de cambio de cámara
  // --------------------------------------------------
  fireMarkerCountUpdatedEvent () {
    let cce = new CustomEvent('MLPlakViewerActiveViewChanged', {
      detail: {
        activeView: this.currentActiveView
      }
    })
    // usar el contenedor para lanzar el evento.
    document.dispatchEvent(cce)
  }

  showOnlyWireframe (model) {
    // var model = this.findModelByTag(model.tag)
    if (!model) { return }

      let childrenLength = model.children.length;

    for (let i = 0; i < childrenLength; i++) {
      if (model.children[i].pieceType === 'wireframe') { model.children[i].visible = true } else { model.children[i].visible = false }
    }
  }

  testExport () {
    // var exporter = new OBJExporter();
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
  storeEditorModelsList (modelsList) {
    this.editorModelsList = modelsList
  }

  /**
     * Gets object in viewer given userData defined id from the scene
     * @param id
     * @returns {Viewer.getObjectById|*}
     */
  getObjectById (id) {
    let found = this.findById(id)
    return found
  }

  
  getObjectByIdCad (id) {
    let found = this.findByIdCad(id)
    return found
  }

  findById (id) {
    return this.findChildById(this.scene, id)
  }

  findByIdCad (id) {
    return this.findChildByIdCad(this.scene, id)
  }

  /**
     * Obtains object by a string id defined in userData in a recursive way
     * @param object
     * @param id
     * @returns {Viewer.getObjectById|undefined|*}
     */
  findChildById (object, id) {
    if (object.userData.id === id) {
      return object
    }

    let childrenLength = object.children.length;

    for (let i = 0, l = childrenLength; i < l; i++) {
      let objectChild = this.findChildById(object.children[i], id)
      if (objectChild !== undefined) {
        return objectChild
      }
    }
    return undefined
  }

  findChildByIdCad (object, id) {
    if (object.userData.id === id) {
      return object
    }

    let childrenLength = object.children.length;

    for (let i = 0, l = childrenLength; i < l; i++) {
      let objectChild = this.findChildByIdCad(object.children[i], id)
      if (objectChild !== undefined) {
        return objectChild
      }
    }
    return undefined
  }

  // onDocumentMouseMove (event) {
  //   // event.preventDefault()
  //   console.log('moving canvas')
  //   // corregido problema del offset
    
  //   var rect = this.container.getElementsByTagName('canvas')[0].getBoundingClientRect()
  //   this.mouse.x = (event.offsetX / rect.width) * 2 - 1
  //   this.mouse.y = -(event.offsetY / rect.height) * 2 + 1
    
  // }

  adjustDimensions (data) {
    let newDimensions = {}
    let position
    // rotate position Vector3
    if (data.orientation === 1) {
      position = new THREE.Vector3(data.h, data.l, data.w)
    } else if (data.orientation === 2) {
      position = new THREE.Vector3(data.l, data.h, data.w)
    } else if (data.orientation === 3) {
      position = new THREE.Vector3(data.l, data.w, data.h)
    } else if (data.orientation === 4) {
      position = new THREE.Vector3(data.w, data.l, data.h)
    } else {
      position = new THREE.Vector3(data.w, data.h, data.l)
    }

    newDimensions.w = Math.abs(position.x)
    newDimensions.h = Math.abs(position.y)
    newDimensions.l = Math.abs(position.z)
    return newDimensions
  }

  /* Crea un sprite */
  createLabel (params) {
    let sprite = new TextSprite({
      textSize: params.size,
      redrawInterval: params.redrawInterval,
      texture: {
        text: params.text,
        fontFamily: params.font || 'Arial, Helvetica, sans-serif'
      },
      material: {
        color: 0x000000
      }
    })
    sprite.visible = params.visible
    sprite.position.copy(params.position)
    return sprite
  }

  setTextureToGeometry (geometry, dimensions, textureSize) {
    geometry.faceVertexUvs[0][8][0].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][8][2].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][9][2].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][8][2].x = dimensions.w / textureSize.width
    geometry.faceVertexUvs[0][9][1].x = dimensions.w / textureSize.width
    geometry.faceVertexUvs[0][9][2].x = dimensions.w / textureSize.width

    geometry.faceVertexUvs[0][10][0].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][10][2].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][10][2].x = dimensions.w / textureSize.width
    geometry.faceVertexUvs[0][11][2].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][11][1].x = dimensions.w / textureSize.width
    geometry.faceVertexUvs[0][11][2].x = dimensions.w / textureSize.width

    geometry.faceVertexUvs[0][4][0].y = dimensions.l / textureSize.height
    geometry.faceVertexUvs[0][4][2].y = dimensions.l / textureSize.height
    geometry.faceVertexUvs[0][4][2].x = dimensions.w / textureSize.width
    geometry.faceVertexUvs[0][5][2].y = dimensions.l / textureSize.height
    geometry.faceVertexUvs[0][5][1].x = dimensions.w / textureSize.width
    geometry.faceVertexUvs[0][5][2].x = dimensions.w / textureSize.width

    geometry.faceVertexUvs[0][6][0].y = dimensions.l / textureSize.height
    geometry.faceVertexUvs[0][6][2].y = dimensions.l / textureSize.height
    geometry.faceVertexUvs[0][6][2].x = dimensions.w / textureSize.width
    geometry.faceVertexUvs[0][7][2].y = dimensions.l / textureSize.height
    geometry.faceVertexUvs[0][7][1].x = dimensions.w / textureSize.width
    geometry.faceVertexUvs[0][7][2].x = dimensions.w / textureSize.width

    geometry.faceVertexUvs[0][0][0].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][0][2].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][0][2].x = dimensions.l / textureSize.width
    geometry.faceVertexUvs[0][1][2].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][1][1].x = dimensions.l / textureSize.width
    geometry.faceVertexUvs[0][1][2].x = dimensions.l / textureSize.width

    geometry.faceVertexUvs[0][2][0].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][2][2].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][2][2].x = dimensions.l / textureSize.width
    geometry.faceVertexUvs[0][3][2].y = dimensions.h / textureSize.height
    geometry.faceVertexUvs[0][3][1].x = dimensions.l / textureSize.width
    geometry.faceVertexUvs[0][3][2].x = dimensions.l / textureSize.width
  }

  saveString (text, filename) {
    this.save(new Blob([ text ], { type: 'text/plain' }), filename)
  }

  save (blob, filename) {
    // link para descargar el archivo dae.
    // está fuera de las funciones. se crea al llegar a este punto
    let daelink = document.createElement('a')
    daelink.style.display = 'none'
    document.body.appendChild(daelink)

    daelink.href = URL.createObjectURL(blob)
    daelink.download = filename || 'data.json'
    daelink.click()

    // URL.revokeObjectURL( url ); breaks Firefox...
  }

  saveArrayBuffer (buffer, filename) {
    this.save(new Blob([ buffer ], { type: 'application/octet-stream' }), filename)
  }

  // escala los modelos y la habitacion  a el valor establecidoen:
  // Export_Scale_factor
  // G.V
  scaleModelDae (value) {
    if (!this.scaleOnExport) {
      return
    }

    this.group.scale.multiplyScalar(value)
    this.group.position.multiplyScalar(value)

    if (this.room) {
      this.room.scene.scale.multiplyScalar(value)
    }
  }

  clearPreviousCanvas (container) {
    const previousCanvas = container.getElementsByTagName('canvas')
    if (previousCanvas[0]) {
      container.removeChild(previousCanvas[0])
    }
  }

  render () {
    this.composer.render()
  }

  resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  changeCameraType(typeCamera) {

    const width = this.container.offsetWidth
    const height = this.container.offsetHeight

    switch (typeCamera) {
      case 'front':
        this.camera = new THREE.OrthographicCamera(
          width / - 2,
          width / 2,
          height / 2,
          height / - 2,
          1,
          1000
        );

        this.camera.updateProjectionMatrix();

        this.renderFrame()

        break;
      case 'back':
        console.log("camara ortografica back")
        break;
      case 'left':
        console.log("camara ortografica left")
        break;
      case 'right':
        console.log("camara ortografica right")
        break;
      case 'top':
        console.log("camara ortografica top")
        break;
      case 'bottom':
        console.log("camara ortografica bottom")
        break;
      case 'perspective':
        console.log("camara perspectiva")
        break;
    }

  }
}

export function getRenderPassOptions () {
  return [
    'Default',
    'SSAARenderPass',
    'TAARenderPass',
  ]
}

export function getShaderPassOptions () {
  return [
    'Ninguno',
    'SAOPass',
  ]
}