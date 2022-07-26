import * as THREE from 'three'
import { MlPlakDistance } from './models/MlPlakDistance'
import TextSprite from '@seregpie/three.text-sprite'


export class MlPlakDistanceController {
    constructor(options, color = "#006CAA" ) {
        this.distances = []

        //datos basicos de las distancias
        this.distanceMeasuredGroup =  new THREE.Group();
        this.distanceMeasuredGroup.name =  'distanciaMedida';

        this.fontSize = 16
        this.contadorDistance = 0
        this.textDistance = 30  // longitud de la linea entre el ancla y el sprite
        this.textColor = 'black'    
        this.currentDistance = new MlPlakDistance(color)
        this.viewer = options.viewer

        this.raycaster = new THREE.Raycaster()
        this.intersection = { // interseccion del raycast y el modelo
            intersects: false,
            point: new THREE.Vector3(),
            normal: new THREE.Vector3(),
            module: '',
            inPiece: false,
            pieceId: ''
        }

        this.initMouseHelper()

        this._MlPlakDistanceOnMouseMovePointA = this._MlPlakDistanceOnMouseMovePointA.bind(this)
        this._MlPlakDistanceOnMouseMovePointB = this._MlPlakDistanceOnMouseMovePointB.bind(this)

        this.distancesGroup = new THREE.Group()
        this.currentDistanceGroup = new THREE.Group()
        this.viewer.scene.add(this.currentDistanceGroup)
        this.viewer.scene.add(this.distancesGroup)
        this.viewer.scene.add(this.distanceMeasuredGroup)

        this.currentType = ''

        this.onMeasureUpdated = options.onMeasureUpdated


        


        this.mouse = new THREE.Vector2()

    }

    getMLPLakDistance() {
        return this.currentDistance.getIsPointBselected()
    }

    setMLPLakDistance(valor) {
        this.currentDistance.setIsPointBselected(valor)
    }
    initMouseHelper() {
        // Crea el mouse helper
        this.mouseHelper = new THREE.Group()
        this.mouseHelper.add(this._createLineHelper({ size: 4, color: this.currentDistance.color }))
        this.mouseHelper.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial({
                color: this.currentDistance.color,
                transparent: true,
                opacity: 0.5
            })
        ))

        this.mouseHelper.name = 'MlPlakMarkers-MouseHelper'
        this.mouseHelper.visible = false
        this.viewer.scene.add(this.mouseHelper)
    }

    updateColorMouseHelper(color = null) {
        this.currentDistance.color = color
        this.mouseHelper = new THREE.Group()
        this.mouseHelper.add(this._createLineHelper({ size: 4, color: color }))
        this.mouseHelper.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.5,
            })
        ))
        this.mouseHelper.name = 'MlPlakMarkers-MouseHelper'
        this.mouseHelper.visible = false
        this.viewer.scene.add(this.mouseHelper)
    }

    createPointModel(pieceId, pieceTag, position) {
        let id = null
        if (this.currentType === 'A') {
            if (this.currentDistance.pointA) {
                this.removePoint(this.currentDistance.pointA.id)
            }
            this.currentDistance.setPointA(pieceId, '', position, pieceTag)
            id = this.currentDistance.pointA.id
        } else {
            if (this.currentDistance.pointB) {
                this.removePoint(this.currentDistance.pointB.id)
            }
            this.currentDistance.setPointB(pieceId, '', position, pieceTag)
            id = this.currentDistance.pointB.id
        }

        this.connectPointwithHelper()

        // Creates the mesh sphere to anchor on the piece
        let innerSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({
            color: this.currentDistance.color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        }))

        let innerMarker = this._createLineHelper({ size: 4, color: this.currentDistance.color })

        let box = new THREE.Group()
        box.add(innerMarker)
        box.add(innerSphere)

        box.position.copy(position)
        box.userData.id = id

        return box
    }

    _MlPlakDistancesMouseUP(event) {
        if (this.intersection.inPiece) {

            let matrix = new THREE.Matrix4()
            matrix.extractRotation(this.mouseHelper.matrix)

            let m = this.createPointModel(
                this.intersection.pieceId,
                this.intersection.pieceTag,
                this.intersection.point
            )

            this.currentDistanceGroup.add(m)
            this.deactivateMouseHelperMouseMoveListener()
            this.hideMouseHelper()

            this.onMeasureUpdated({
                    type: this.currentType,
                    current: this.currentDistance,
                    distances: this.distances
                })
                // this.fireDistanceUpdatedEvent()
        }
    }

    findPointById(id) {
        let childrenLength = this.currentDistanceGroup.children.length
        for (let i = 0; i < childrenLength; i++) {
            if (this.currentDistanceGroup.children[i].userData.id === id) {
                return this.currentDistanceGroup.children[i]
            }
        }
        return false
    }

    removePoint(id) {
        var pointModel = this.findPointById(id)
        this.currentDistanceGroup.remove(pointModel)
    }

    _MlPlakDistanceOnMouseMovePointA(event) {
        event.preventDefault()

        let rect = this.viewer.renderer.domElement.getBoundingClientRect()
        this.mouse.x = (event.offsetX / rect.width) * 2 - 1
        this.mouse.y = -(event.offsetY / rect.height) * 2 + 1

        let distanciaZalcursor = 0
        let vector = new THREE.Vector3(this.viewer.mouse.x, this.viewer.mouse.y, 1)
        vector.unproject(this.viewer.camera)
        let dir = vector.sub(this.viewer.camera.position).normalize()

        let distance = (distanciaZalcursor - this.viewer.camera.position.z) / dir.z
        let pos = this.viewer.camera.position.clone().add(dir.multiplyScalar(distance))

        this.mouseHelper.position.copy(pos)

        let modelMeshObjects = []
        let viewerGroup = this.viewer.group
        let childrenLength = viewerGroup.children.length

        for (let i = 0; i < childrenLength; i++) {
            // solo si esta visible el objeto (modulo) agregar a la lista de colisiones de rayo
            if (viewerGroup.children[i].visible) {
                modelMeshObjects = modelMeshObjects.concat(
                    ...this.viewer.group.children[i].children.map(
                        d => d ? d.children.filter(e => e.type === 'Mesh') : []
                    )
                )
            }
        }

        this.raycaster.setFromCamera(this.mouse, this.viewer.camera)

        let modelIntersects = this.raycaster.intersectObjects(modelMeshObjects, true)

        if (modelIntersects.length > 0) {
            let selected = modelIntersects[0].object
            let p = modelIntersects[0].point

            this.mouseHelper.position.copy(p)
            this.intersection.point.copy(p)
            this.intersection.pieceId = selected.parent.userData.id
            this.intersection.pieceTag = selected.parent.userData.name

            if (!modelIntersects[0].face) {
                return
            }

            if (this.viewer.selectedObject.userData.id !== selected.parent.userData.id) {
                this.hideMouseHelper()
                this.intersection.inPiece = false
                this.intersection.pieceId = selected.parent.userData.id
                return
            }

            this.intersection.inPiece = true

            var n = modelIntersects[0].face.normal.clone()
            n.transformDirection(selected.matrixWorld)
            n.multiplyScalar(10)
            n.add(modelIntersects[0].point)
            this.intersection.normal.copy(modelIntersects[0].face.normal)

            this.showMouseHelper()
            this.mouseHelper.lookAt(n)
        } else {
            this.hideMouseHelper()
        }

        this.viewer.renderFrame()
    }

    _MlPlakDistanceOnMouseMovePointB(event) {
        event.preventDefault()

        let rect = this.viewer.renderer.domElement.getBoundingClientRect()
        this.mouse.x = (event.offsetX / rect.width) * 2 - 1
        this.mouse.y = -(event.offsetY / rect.height) * 2 + 1

        let distanciaZalcursor = 0
        let vector = new THREE.Vector3(this.viewer.mouse.x, this.viewer.mouse.y, 1)
        vector.unproject(this.viewer.camera)
        let dir = vector.sub(this.viewer.camera.position).normalize()

        let distance = (distanciaZalcursor - this.viewer.camera.position.z) / dir.z
        let pos = this.viewer.camera.position.clone().add(dir.multiplyScalar(distance))

        this.mouseHelper.position.copy(pos)

        let modelMeshObjects = []
        let viewerGroup = this.viewer.group
        let childrenLength = viewerGroup.children.length

        for (let i = 0; i < childrenLength; i++) {
            // solo si esta visible el objeto (modulo) agregar a la lista de colisiones de rayo
            if (viewerGroup.children[i].visible) {
                modelMeshObjects = modelMeshObjects.concat(
                    ...this.viewer.group.children[i].children.map(
                        d => d ? d.children.filter(e => e.type === 'Mesh') : []
                    )
                )
            }
        }

        this.raycaster.setFromCamera(this.mouse, this.viewer.camera)

        let modelIntersects = this.raycaster.intersectObjects(modelMeshObjects, true)

        if (modelIntersects.length > 0) {
            let selected = modelIntersects[0].object
            let p = modelIntersects[0].point

            if (this.currentDistance.isFixed()) {
                p = this.getFixedBFromA(p)
            }

            this.mouseHelper.position.copy(p)
            this.intersection.point.copy(p)
            this.intersection.pieceId = selected.parent.userData.id
            this.intersection.pieceTag = selected.parent.userData.name

            if (!modelIntersects[0].face) {
                return
            }

            var n = modelIntersects[0].face.normal.clone()

            if (this.viewer.selectedObject.userData.id !== selected.parent.userData.id) {
                this.hideMouseHelper()
                this.intersection.inPiece = false
                this.intersection.pieceId = selected.parent.userData.id
                return
            }

            this.intersection.inPiece = true

            var n = modelIntersects[0].face.normal.clone()
            n.transformDirection(selected.matrixWorld)
            n.multiplyScalar(10)
            n.add(modelIntersects[0].point)
            this.intersection.normal.copy(modelIntersects[0].face.normal)

            this.showMouseHelper()
            this.mouseHelper.lookAt(n)

            this.connectPointwithHelper()
        } else {
            this.hideMouseHelper()
        }

        this.viewer.renderFrame()
    }

    getFixedBFromA(point) {
        let fixedPoint = new THREE.Vector3()
        fixedPoint.copy(this.currentDistance.pointA.position)
        if (this.currentDistance.fixedX) {
            fixedPoint.setX(point.x)
        }
        if (this.currentDistance.fixedY) {
            fixedPoint.setY(point.y)
        }
        if (this.currentDistance.fixedZ) {
            fixedPoint.setZ(point.z)
        }
        return fixedPoint
    }

    connectPointwithHelper() {
        this.removePoint('tmpLine')
        let pos1 = this.currentDistance.pointA.position
        let pos2 = this.currentDistance.pointB ? this.currentDistance.pointA.position : this.mouseHelper.position

        var line = this._createLine(pos1, pos2)
        this.currentDistanceGroup.add(line)
    }

    activateMouseHelperMouseMoveListener(type = 'A') {
        const canvas = this.viewer.renderer.domElement;

        if (type === 'A') {
            canvas.addEventListener('mousemove', this._MlPlakDistanceOnMouseMovePointA, false)
        } else {
            canvas.addEventListener('mousemove', this._MlPlakDistanceOnMouseMovePointB, false)
        }
    }

    deactivateMouseHelperMouseMoveListener() {

        if (this.currentType === 'A') {
            this.viewer.renderer.domElement.removeEventListener('mousemove', this._MlPlakDistanceOnMouseMovePointA, false)
        } else {
            this.viewer.renderer.domElement.removeEventListener('mousemove', this._MlPlakDistanceOnMouseMovePointB, false)
        }
        this.viewer.renderFrame() 
    }

    startPointCreation(type = 'A') {
        this.currentType = type
        this.activateMouseHelperMouseMoveListener(type)
    }

    showMouseHelper() {
        this.mouseHelper.visible = true
    }

    hideMouseHelper() {
        this.mouseHelper.visible = false
    }


    // muestra u oculta los marcadores
    toggleDistanceVisibility (visible) {
        console.log(`toggleDistanceVisibility   valor: ${visible} **/3D/classes/MlPlakDistanceController.js`)
              
        if (!(visible === true || visible === false)) {
            return{}
        }
        this.distancesGroup.visible = visible

       this.viewer.renderFrame()
    }

    
    loadDistanceToViewer(data){
        console.log(`loadDistanceToViewer **/3D/classes/MlPlakDistanceController.js `)   
        
        data.forEach(item => {
           // console.log(`array of distance: ${JSON.stringify(item)} **/3D/classes/MlPlakDistanceController.js`)
           // console.log(`Distance ${JSON.stringify(item.distance)} **/3D/classes/MlPlakDistanceController.js`)
            // deberia llamar la funcion de agregar
                    
            this.reloadDistanceMesure(item)
         
           // this.distances.push(this.currentDistance)
           this.currentDistanceGroup.userData.id = item.id
           this.distancesGroup.add(this.currentDistanceGroup)
           this.clearDistance()
       
        })
        // console.log(`array of distance: ${JSON.stringify(data)}`)
        


    }



    async updateDistanceToViewer(params){
        // params.item = objeto a editar   
        // params.items =  all objeto the store   

        // /////////////////////////////////////////
        // funciona en 99 %
        this.removeAllDistances()  
        this.loadDistanceToViewer(params.items)
        // ///////////////////////////////////////////



        console.log(`updateDistanceToViewer ID *** ${JSON.stringify(params.item.id)}, INDEX: ${JSON.stringify(params.index)}  **3D/classes/MlPlakDistanceController.js`)
        console.log(`updateDistanceToViewer COORDENADAS  X: ${params.item.pEjeX}, Y ${params.item.pEjeY}, Z: ${params.item.pEjeZ}, fontSize: ${params.item.fontSize},  **3D/classes/MlPlakDistanceController.js`)

        // console.log(`Solo se debe atualizar el objeto`)

          //let distances = this.distancesGroup.children
        // console.log(`updateDistanceToViewer ${JSON.stringify(distances)} **3D/classes/MlPlakDistanceController.js` )

          /*
        distances.forEach(item =>  {      
            console.log(`updateDistanceToViewer OBJETOS CHILDREND ${JSON.stringify(item.children)}  **3D/classes/MlPlakDistanceController.js` )
        })
        */
               
        // let ObjectDistance = distances.find(item => item.userData.id === params.item.id)       
        // console.log(`updateDistanceToViewer OBJETO *** ${JSON.stringify(ObjectDistance.userData)} **3D/classes/MlPlakDistanceController.js`)
        // let ObjectSelect = this.distancesGroup.children.getObjectById(params.item.id)
        
        // let ObjectSelect =this.distancesGroup.children[params.index].userData
        // let ObjectSelect =this.distancesGroup.children[params.index].copy() 
        // console.log(`updateDistanceToViewer OBJETOS SELECT ${JSON.stringify(ObjectSelect)}  **3D/classes/MlPlakDistanceController.js` )

        // let ObjectSelect = this.findDistanceById(params.item.id) devuelve el objeto
        // console.log(`updateDistanceToViewer OBJETOS SELECT ${JSON.stringify(ObjectSelect)}  **3D/classes/MlPlakDistanceController.js` )

     
        /*
            this.currentDistanceGroup.children.forEach(item => {
            item.children.forEach(d => {
                d.material.color.set(color)
            })
        })
        */
      
        

        this.viewer.renderFrame()
         
    }


  

    addDistanceToViewer() {
        if (this.currentDistance.pointA && this.currentDistance.pointB) {

           //  console.log(`addDistanceToViewer   (partir codigo) ** /3D/classes/MlPlakDistanceController.js  ${JSON.stringify(this.currentDistance)}`)
           
           this.createDistanceMesure(this.currentDistance)
         

            // console.log(`addDistanceToViewer   currentDistance: ${JSON.stringify(this.currentDistance)} **/3D/classes/MlPlakDistanceController.js`)
            // this.distances.push(this.currentDistance)
            this.currentDistanceGroup.userData.id = this.currentDistance.id
            this.distancesGroup.add(this.currentDistanceGroup)
            this.clearDistance()
        }
    }


    getPointMiddle(pointA, pointB){

        var middle = new THREE.Vector3();
        middle.x = (pointA.x + pointB.x) / 2;
        middle.y = (pointA.y + pointB.y) / 2;
        middle.z = (pointA.z + pointB.z) / 2;
        return middle
    }

    reloadPointMiddle(x, y, z){

        var middle = new THREE.Vector3();
        middle.x = x
        middle.y = y
        middle.z = z
        return middle
    }


    createDistanceMesure(data){
        let group = new THREE.Group();
        let linea = this._createLine(data.pointA.position , data.pointB.position, data.color)

        let moduloPadre =  data.pointA.pieceId     // 24 //  left  = 26   Rigth  = 46 ; 
        // se tiene que calcular en otro sitio 
        let pointMiddle =  this.getPointMiddle(data.pointA.position , data.pointB.position)
        let position = this.scaledPosition(pointMiddle)
        // console.log(`Point Middle: ${JSON.stringify(pointMiddle)}`)
        let txt = this._createSpriteText(`${data.distance}`, this.fontSize, data.color, position)
        // let txt = this._createSpriteText("distancia : 200 ",this.fontSize, data.color, data.pointB)
        //console.log(`createDistanceMesure  grupoDestino:  ${JSON.stringify(this.viewer.currentActiveView)}`)
        
        let distanceName = "Distance-line-" + this.contadorDistance
	    group.name = distanceName
        group.userData.parentModule = moduloPadre  // no se selecciono ningun padre
        linea.name= distanceName+"-line"
        txt.name= distanceName+"-txt"

        group.add( linea );
	    group.add( txt );


        let grupoDestino = this.viewer.currentActiveView

        group.userData.viewGroup = grupoDestino 
        this.currentDistanceGroup.add(group);//lista de grupos de object3D (meshes de marcador)
    
    }



    reloadDistanceMesure(data){

        // console.log(`reloadDistanceMesure: ${JSON.stringify(data)} **//3D/classes/MlPlakDistanceController.js`)
       
        let group = new THREE.Group();
        let linea = this._createLine(data.pointA.position , data.pointB.position,  data.color)

         let pointMiddle =  this.reloadPointMiddle(data.pEjeX /10, data.pEjeY /10, data.pEjeZ /10)
        let position = this.scaledPosition(pointMiddle)
      
        // console.log(`Point Middle: ${JSON.stringify(pointMiddle)}`)
        let txt = this._createSpriteText(`${data.distance}`, data.fontSize, data.color, position)
        // let txt = this._createSpriteText("distancia : 200 ",this.fontSize, data.color, data.pointB)
        //console.log(`createDistanceMesure  grupoDestino:  ${JSON.stringify(this.viewer.currentActiveView)}`)
        let moduloPadre =  data.pointA.pieceId

        let distanceName = "Distance-line-" + this.contadorDistance
	    group.name = distanceName
        group.userData.parentModule = moduloPadre  // no se selecciono ningun padre
        linea.name= distanceName+"-line"
        txt.name= distanceName+"-txt"
        
        group.add( linea );
	    group.add( txt );

        let grupoDestino = this.viewer.currentActiveView

        group.userData.viewGroup = grupoDestino 
        this.currentDistanceGroup.add(group);//lista de grupos de object3D (meshes de marcador)
    
    }

    // _createLine(position1, position2) {
        _createLine(position1, position2, color = this.currentDistance.color ) {
            let material = new THREE.LineBasicMaterial({
                color,
                linewidth: 4,
            })
    
            let geometry = new THREE.Geometry()
    
            geometry.vertices.push(
                new THREE.Vector3(position2.x, position2.y, position2.z),
                new THREE.Vector3(position1.x, position1.y, position1.z)
            )
    
            let line = new THREE.Line(geometry, material)
            line.userData.id = 'tmpLine'
    
            return line
        }
    
        fireDistanceUpdatedEvent() {
            this.onMeasureUpdated({
                current: this.currentDistance,
                distances: this.distances
            })
        }
    
        _createSpriteText(texto, tamano, color, posicion) {
            // var markername = 'marker' + this.contadorMarcadores
   
        // console.log(`_createSpriteText variables: texto:${texto} tamaño: ${tamano} color: ${color} posicion: ${posicion} ** /classes/MlPlakDistanceController.js`)
            var spriteTexto = new TextSprite({
         fontSize: tamano,
         fillStyle: this.textColor,
         fontFamily: 'Arial, Helvetica, sans-serif',
         redrawInterval: 250,
         text: texto
       })
   
       spriteTexto.position.copy(posicion)
       spriteTexto.userData.text = texto
       spriteTexto.userData.color = color
       spriteTexto.userData.fontSize = tamano
   
       return spriteTexto
     }


    scaledPosition(position){
        let direction = new THREE.Vector3(0, 0, 1)
        return new THREE.Vector3().copy(position).addScaledVector(direction, this.textDistance)
    }     

    clearDistance() {
        this.currentDistance = new MlPlakDistance(this.currentDistance.color)
        this.viewer.scene.remove(this.currentDistanceGroup)
        this.currentDistanceGroup = new THREE.Group()
        this.viewer.scene.add(this.currentDistanceGroup)
        this.fireDistanceUpdatedEvent()
    }

    removeDistance(id) {
        this.distances = this.distances.filter((distance) => distance.id !== id)
        let distanceGroup = this.distancesGroup.children.find(distance => distance.userData.id === id)
        if (distanceGroup) {
            this.distancesGroup.remove(distanceGroup)
        }
        this.fireDistanceUpdatedEvent()
    }
    

    
    findDistanceById(id) {
        let childrenLength = this.distancesGroup.children.length

        for (let i = 0; i < childrenLength; i++) {
            if (this.distancesGroup.children[i].userData.id === id) {                

                console.log(`updateDistanceToViewer findDistanceById .: ${JSON.stringify(id)} index -> i: ${i} **3D/classes/MlPlakDistanceController.js` )
                return this.distancesGroup.children[i]
            }
        }
        return false
    }
    
    
    removeAllDistances() {
   
        let distances = this.distancesGroup.children

        //this.distancesGroup.remove(this.distancesGroup)
        // this.distancesGroup.clear()  // error 
        // distances.clear()  // error 
        // console.log(`removeAllDistances ${JSON.stringify(distances)} ` )
          
        distances.forEach(item =>  {     
            this.distancesGroup.remove(item)
 
            // this.distancesGroup.clear(item) // error
        })
        
       
       /*
        distances.forEach(item =>  {     
            this.distancesGroup.remove(item)
 
            // this.distancesGroup.clear(item) // error
        })
          
        */
    }

    changeColor(color) {
        this.currentDistance.color = color
        this.currentDistanceGroup.children.forEach(item => {
            item.children.forEach(d => {
                d.material.color.set(color)
            })
        })
    }

    updateFixed(x, y, z) {
        this.currentDistance.fixed(x, y, z)
    }

    _createLineHelper(opts) {
        let options = {... {
                color: 'red',
                size: 4
            },
            ...opts
        }

        return new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-options.size, 0, 0),
                new THREE.Vector3(options.size, 0, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, -options.size, 0),
                new THREE.Vector3(0, options.size, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, -options.size),
                new THREE.Vector3(0, 0, options.size)
            ]),
            new THREE.LineBasicMaterial({
                color: options.color,
                transparent: false,
                visible: true,
                linewidth: 3,
            })
        )
    }
}