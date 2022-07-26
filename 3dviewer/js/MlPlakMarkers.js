/**
 * Contiene la administracion de los marcadores
 * de que se utilizan en el 3dViewer.
 * Autor: Gustavo Vivas 2019.
 */
class MlPlakMarkers{

	constructor(options) {
		this.Maximo_Marcadores = 80;        // máximo de marcadores que de puede colocar
        this.Distancia_Sprite_Ancla = 100;  // longitud de la linea entre el ancla y el sprite
        this.Export_Scale_factor = 0.1;

        //datos del marcador que esta por ser agregado. (esto se borra al crear el marcador)
        this.markerData = {
        	texto:"",
        	tamano:0,
        	color:""
        }


		this.viewer = options.viewer;


        this.raycaster = new THREE.Raycaster();

		this.mouse = new THREE.Vector2(); // posicion del mouse (2D)

		this.intersection = {          // interseccion del raycast y el modelo
			intersects: false,
			point: new THREE.Vector3(),
			normal: new THREE.Vector3(),
			module: ""
		};

		this.marcadores = new THREE.Group(); 	 //marcadores vista perspectiva
		this.marcadores.name = 'marcadores';
		this.marcadoresTop = new THREE.Group();  //marcadores vista Top
		this.marcadoresTop.name = 'marcadoresTop';
		this.marcadoresBottom = new THREE.Group(); //marcadores vista Bottom
		this.marcadoresBottom.name = 'marcadoresBottom';
		this.marcadoresLeft = new THREE.Group();   //marcadores vista Left
		this.marcadoresLeft.name = 'marcadoresLeft';
		this.marcadoresRight = new THREE.Group();  //marcadores vista Right
		this.marcadoresRight.name = 'marcadoresRight';
		this.marcadoresFront = new THREE.Group();  //marcadores vista front
		this.marcadoresFront.name = 'marcadoresFront';
		this.marcadoresBack = new THREE.Group();  //marcadores vista back
		this.marcadoresBack.name = 'marcadoresBack';

		this.contadorMarcadores = 0;//cuantos marcadores hay en el sistema
		this.marcadoresDraggables = new Array();
		this.marcadoresData = new Array(); //la data del marcador (de cara al usuario texto,tamano, color y etiqueta para borralo o editarlo)
		this.viewer.scene.add(this.marcadores); //agregar los marcadores a la escena (aunque la lista este vacia)
        this.viewer.scene.add(this.marcadoresTop);
        this.viewer.scene.add(this.marcadoresBottom);
        this.viewer.scene.add(this.marcadoresLeft);
        this.viewer.scene.add(this.marcadoresRight);
        this.viewer.scene.add(this.marcadoresFront);
        this.viewer.scene.add(this.marcadoresBack);

		// objetos 3D
		// el punto que se mueve con el cursor del mouse para determinar en que lugar se coloca un marcador
		//new THREE.MeshBasicMaterial({color: 0xff0000})
		this.mouseHelper = new THREE.Mesh(new THREE.BoxGeometry(5,5,5, 1, 1, 1), new THREE.MeshBasicMaterial({
	     color: 0xff0000
	    }));
	    this.mouseHelper.name = "MlPlakMarkers-MouseHelper";
		this.mouseHelper.visible=false;
		this.viewer.scene.add(this.mouseHelper);


		//

		this._MlPlakMarkersOnMouseMove = this._MlPlakMarkersOnMouseMove.bind(this);
  		this._MlPlakMarkersOnMouseUP = this._MlPlakMarkersOnMouseUP.bind(this);


  		this.dragControlsInit = false;
  		this.dragControls;
  		this._MlPlakMarkersDragStart = this._MlPlakMarkersDragStart.bind(this);
  		this._MlPlakMarkersDragEnd = this._MlPlakMarkersDragEnd.bind(this);
		this._MlPlakMarkersDragMove = this._MlPlakMarkersDragMove.bind(this);

		this.setupDragControls();


  		this._MlPlakMarkersDeleteOnMouseUP   = this._MlPlakMarkersDeleteOnMouseUP.bind(this);
  		this._MlPlakMarkersDeleteOnMouseMove = this._MlPlakMarkersDeleteOnMouseMove.bind(this);

        //lista de los objetos de los mesh a los que se les hace raycast.
		this.raycastModelMeshObjects = new Array();
		this.selectedMarker = null;
		this.selectedMarkerColor = null;

        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
		this.viewer.container.getElementsByTagName('canvas')[0].addEventListener( 'mousemove', this.onDocumentMouseMove, false );

		//---------------------------------------------------------------------------------
		//avisar que ha cambiado la cantidad de marcadores
		this.markerCountUpdated = this.markerCountUpdated.bind(this);
		this.markerCounterUpdatedCallBack = null;
    	document.addEventListener("markerCountUpdated",this.markerCountUpdated,false);


    	// callback para manejar el cambio de vista
    	// se utilizará para asignar visibilidad a gurpos de etiquetas
    	this.viewer.currentActiveViewChangedCallBack = function(e){
    		this.marcadores.visible =false;
    		this.marcadoresTop.visible = false;
    		this.marcadoresBottom.visible = false;
    		this.marcadoresLeft.visible = false;
    		this.marcadoresRight.visible = false;
    		this.marcadoresFront.visible = false;
    		this.marcadoresBack.visible = false;

    		switch(e.detail.activeView){
	    		case 'front':
	    			this.marcadoresFront.visible = true;
			        break;
		      	case 'back':
			        this.marcadoresBack.visible = true;
			        break;
	     		case 'left':
			        this.marcadoresLeft.visible = true;
			        break;
			    case 'right':
			        this.marcadoresRight.visible = true;
			        break;
			    case 'top':
			   		this.marcadoresTop.visible = true;
			        break;
			    case 'bottom':
			    	this.marcadoresBottom.visible = true;
			    	break;
	        	default:
	        		this.marcadores.visible = true;
			}
			//es necesario re-crearlos cada que cambie la cámara;
			this.setupDragControls();

    		//viewer.js linea 996
    		console.log(" MLplakMarkers - currentActiveViewChangedCallBack ",e.detail.activeView);
    	}.bind(this);

	}



	//muesra u oculta el mouseHelper mesh
    showMouseHelper(){
    	this.mouseHelper.visible = true;
    }

    //oculta el mouseHelper mesh
    hideMouseHelper(){
    	this.mouseHelper.visible = false;
    }

    //agrega el mouseHelper a la escena
    addMouseHelperToScene(){
    	this.viewer.scene.add(this.mouseHelper);
    }

    //remueve el mouseHelper de la escena
    removeMouseHelperFromScene(){
    	this.viewer.scene.remove(this.mouseHelper);
    }

    //activar evento mouseMove para mover el marcador
    activateMouseHelperMouseMoveListener(){
    	document.addEventListener("mousemove",  this._MlPlakMarkersOnMouseMove , false);
    }

    //desactivar evento mouseMove para mover el marcador
    deactivateMouseHelperMouseMoveListener(){
    	document.removeEventListener("mousemove",  this._MlPlakMarkersOnMouseMove, false);
    }

    _MlPlakMarkersOnMouseMove(event){
    	 event.preventDefault();

    	 //mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;

	  	  //mover el helper con el movimiento del mouse
	  	  var distanciaZalcursor =  0;// //distancia
		  var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
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

		  this.raycaster.setFromCamera(this.mouse, this.viewer.camera);

		  var modelIntersects = this.raycaster.intersectObjects(modelMeshObjects,true);


		  if (modelIntersects.length > 0) {
		    var selected = modelIntersects[0].object;
//Mark: Aqui es cuando se prepara la data para crear el marcador
		    var p = modelIntersects[ 0 ].point;
			this.mouseHelper.position.copy( p );
			this.intersection.point.copy( p );

			//algunos elementos de los modelos devuelven que alguna cara es NULL
			// en este caso, no se de permitir agregar un punto
			if( !modelIntersects[ 0 ].face ){
				//marcar que NO se puede agregar punto
				return;
			}

			var processAncestor = function(ancestor){
				if( ancestor.tag && ancestor.tag.includes('Modulo') ){
					//console.log('objeteo elegido: ',selected, ' pertenece al modulo ', ancestor.tag);
					this.intersection.module = ancestor.tag;
					return;
				}
			}.bind(this);

			if ( typeof selected.traverseAncestors === 'function' ){
				selected.traverseAncestors ( processAncestor);
				// debe salirse ya que esta colisionando con algo que NO es un Object3D
				// si tal cosa es posible.
				//return;
			}


		    var n = modelIntersects[ 0 ].face.normal.clone();
			n.transformDirection( selected.matrixWorld );
			n.multiplyScalar( 10 );
			n.add( modelIntersects[ 0 ].point );
			this.intersection.normal.copy( modelIntersects[ 0 ].face.normal );

			this.mouseHelper.lookAt( n );

		    //---------
		  }

	}


	/**
	* Crea el ancla de un marcador, es el mesh que va "pegado"
	* al modelo.
	*
	*
	*/
	_crearAnclaMarcador(posicion_ancla){
	   var marcador = new THREE.Mesh(new THREE.BoxGeometry(3,3,3, 1, 1, 1), new THREE.MeshBasicMaterial({
	     color: 0x00bbff
	    }));

	    marcador.position.copy( posicion_ancla );
	    return marcador;
	}

	/**
   *
   * crea un sprite con un texto establecido
   *  texto: el texto a mostrar
   *  color: cadena de color css (#000000)
   *  tamano: el tamano de la fuente en pixeles
   *  posicion: Vector3 con la posicion en que se
   *            colcará el sprite
   */
   _crearSpriteTexto(texto,tamano,color,posicion){

		 var markername = "marker" + this.contadorMarcadores;
		 var spriteTexto = new THREE.TextSprite({
			textSize: tamano,
			redrawInterval: 250,
			material: {
				color: color,
				fog: true,
			},
			texture: {
				text: texto,
				fontFamily: 'Arial, Helvetica, sans-serif'
			},
		});

		spriteTexto.position.copy(posicion);
		spriteTexto.userData.text = texto;
		spriteTexto.userData.color = color;
		spriteTexto.userData.fontSize = tamano;

		return spriteTexto;
	}

	/**
	* crea la linea que une el ancla al sprite de texto
	*/
	_crearLineaMarcador(position_1, position_2){

	    var material = new THREE.LineBasicMaterial({
		  color: 0x0000ff
		});

		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( position_2.x,position_2.y,position_2.z ),
			new THREE.Vector3( position_1.x,position_1.y,position_1.z )
		);

		var line = new THREE.Line( geometry, material );

	    return line;
	}


	/**
	 * crea un THREE.Group que contiene los tres elementos de un marcador
	 * ancla, linea y sprite.
	 * lo agrega a una lista de marcadores y solo los sprites son agregados a la lista
	 * de objetos draggables.
	 *
	 * - texto: el texto que mostrará el sprite.
	 * - tamanoFuente: tamano de la fuente del sprite.
	 * - color: color de la fuente.
	 * - posicion_texto: posicion 3d del sprite.
	 * - posicion_ancla: posicion 3d del ancla.
	 *
	 * - moduloPadre: el módulo al que fue anclado este marcador.
	 *
	 * - grupoDestino: en que lista de marcadores se agregara este marcador,
	 *                 si el parametro esta ausente o es undefined el marcador se
	 *                 creará en la lista correspondiente a la vista activa en el viewer.
	 *
	 * - nombreGrupoMarcador: este parametro asigna un nombre al grupo de marcadores
	 *                        el nombre es utilizado para la selección, eliminado y
	 *                        movimiento de los marcadores y debe tener la nomenclatura
	 *                        'Marcador-#-{text, ancla, linea}'.
	 *                        Esta parametro es utilizado para volver  a crear los marcadores
	 *                        cuando se carga la informacion de la base de datos.
	 *                        debe ser omitido cuando se crean los marcadores desde la interfaz.
	 */
	_crearMarcador(texto,tamanoFuente,color,posicion_texto,posicion_ancla,moduloPadre,grupoDestino,nombreGrupoMarcador){
		var group = new THREE.Group();

		var linea = this._crearLineaMarcador(posicion_texto,posicion_ancla);
		var ancla = this._crearAnclaMarcador(posicion_ancla);
		var txt = this._crearSpriteTexto(texto,tamanoFuente,color,posicion_texto);

		var marcadorNombre; // = "Marcador-" + this.contadorMarcadores;

		if( typeof nombreGrupoMarcador === 'undefined'){
			marcadorNombre = "Marcador-" + this.contadorMarcadores;
		}else{
			marcadorNombre = nombreGrupoMarcador;
		}


		group.name = marcadorNombre;
		group.userData.parentModule = moduloPadre;
		linea.name = marcadorNombre + "-linea";
	    ancla.name = marcadorNombre + "-ancla";
	    txt.name = marcadorNombre + "-text";

		group.add( linea );
		group.add( ancla );
		//MARK: HERE
	    group.add( txt );


		// grupo destino se usa en caso de restaurar desde la base de datos.
		if ( typeof grupoDestino == 'undefined' ){
			// dependiendo de la vista activa en viewer
			// sera donde se almacenara el marcador
			// esto es para poder ocultar los marcadores segun que vista este activa
			grupoDestino = this.viewer.currentActiveView;

			
		}


		alert(`GRupo destin ${grupoDestino}`)
		let grupoDestino = 'left';
        switch(grupoDestino){
			case 'front':
				group.userData.viewGroup = 'front';
    			this.marcadoresFront.add(group);
		        break;
			  case 'back':
			    group.userData.viewGroup = 'back';
		        this.marcadoresBack.add(group);
		        break;
			 case 'left':
			    group.userData.viewGroup = 'left';
		        this.marcadoresLeft.add(group);
		        break;
			case 'right':
			    group.userData.viewGroup = 'right';
		        this.marcadoresRight.add(group);
		        break;
			case 'top':
			    group.userData.viewGroup = 'top';
		   		this.marcadoresTop.add(group);
		        break;
			case 'bottom':
			    group.userData.viewGroup = 'bottom';
		    	this.marcadoresBottom.add(group);
		    	break;
			default:
			    group.userData.viewGroup = 'perspective';
        		this.marcadores.add(group);//lista de grupos de object3D (meshes de marcador)
        }

		this.addDataMarcador(texto,tamanoFuente,color,txt.name);
		this.contadorMarcadores++;

		//agregar objetos a la lista de dragables
		//
		//this.marcadoresDraggables.push( linea );
		//this.marcadoresDraggables.push( ancla );
	    this.marcadoresDraggables.push( txt );
		//return group;

	}


	activateMouseHelperMouseClickListener(){
    	document.addEventListener("mouseup", this._MlPlakMarkersOnMouseUP , false);
    }

    //activar evento mouseMove para mover el marcador
    deactivateMouseHelperMouseClickListener(){
    	document.removeEventListener("mouseup",  this._MlPlakMarkersOnMouseUP , false);
    }

	//--------------- MOUSE UP

  _MlPlakMarkersOnMouseUP(event) {

    //crear marcadores si no se ha llegado al maximo permitido
    if (this.Maximo_Marcadores === this.contadorMarcadores) {
      console.log("Máximo de marcadores permitidos: ", this.Maximo_Marcadores);

      // esconder el "cursor" pero esto debe manejarse en un observador
      // del array de marcadores. para que se active y desactive automágicamente
      //this.mouseHelper.visible=false;

      return true;
    }

    //
    //buscar la normal del vector del ancla
    // ----
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(this.mouseHelper.matrix);
    var direction = new THREE.Vector3(0, 0, 1);

    //correccion: ajuste en la direccion par el caso en que se este agregando
    //            marcador en vista 'top'
    if (this.viewer.currentActiveView === 'top') {
      direction = new THREE.Vector3(1, 0, 0);
    }
    direction = direction.applyMatrix4(matrix);


    var distance = this.Distancia_Sprite_Ancla;
    var posicion_texto = new THREE.Vector3().copy(this.intersection.point).addScaledVector(direction, distance);

    var m = this._crearMarcador(this.markerData.texto, this.markerData.tamano, this.markerData.color, posicion_texto, this.intersection.point, this.intersection.module);

    //this.viewer.scene.add(m);
    this.markerData = {texto: "", tamano: 0, color: ""};

    //desactivar los eventos de mousemove  y de click porque ya se coloco el marcador
    //y ocultar el helper
    this.dragControls.deactivate();
    this.deactivateMouseHelperMouseMoveListener();
    this.deactivateMouseHelperMouseClickListener();
    this.hideMouseHelper();
    this.fireMarkerCountUpdatedEvent();
  }


	//----------------   DRAG
	// inicializa los dragControls. Notece que se hace necesario
	// re-crearlos cuando se cambie la vista del usuario
	// inician desactivados
  setupDragControls(){
		if(this.dragControls){
			this.dragControls.deactivate();
		}

		this.dragControls =  new THREE.DragControls( this.marcadoresDraggables, this.viewer.camera, this.viewer.renderer.domElement );
    	this.dragControls.addEventListener("dragstart", this._MlPlakMarkersDragStart);
		this.dragControls.addEventListener("dragend", this._MlPlakMarkersDragEnd);
		this.dragControls.addEventListener("mousemove", this._MlPlakMarkersDragMove);
		this.dragControls.deactivate();
	}
	activateMouseHelperDrag(){
		this.dragControls.activate();
	}


    deactivateMouseHelperDrag(){
    	this.dragControls.deactivate();
    }

	_MlPlakMarkersDragStart (event){
		this.viewer.controls.enabled = false;
	}

	_MlPlakMarkersDragEnd (event){

	    var grupoMarcador = event.object.parent;

	    var nombreGrupo = "Marcador-"+grupoMarcador.name.split("-")[1];

	    //linea ancla
	    var lineaMarcador = grupoMarcador.getObjectByName(nombreGrupo+"-linea");

        //actualizar la linea.

        lineaMarcador.geometry.vertices[1]= event.object.position;
        lineaMarcador.geometry.verticesNeedUpdate =true;

		viewer.controls.enabled = true;

		this.dragControls.deactivate();
	}

	_MlPlakMarkersDragMove (event){
		//remover
	}



	//---

   //---
	/**
	 * funcion para facilitar la creacion de los marcadores
	 * es el punto de entrada del proceso.
	 * al llamar esta funcion se activan los eventos mousemove, mouseclick
	 * y la logica que permite crear un marcador
	 *
	 */
	 beginMarkerCreationProcess(texto,tamanoFuente,color){


	 	this.markerData = {
        	texto:texto,
        	tamano:tamanoFuente,
        	color:color
        }

	      this.activateMouseHelperMouseMoveListener();
	      this.activateMouseHelperMouseClickListener();
	      this.showMouseHelper();

	 }

     // Borrado: -----------------------------------------------

	/**
	* elimina un marcador
	* utliza raycast para seleccionarlo y borrarlo
	*
	*/
	beginMArkerDetetionProcess(){

	 	  this.activateMouseHelperDeleteMouseMoveListener()
	      this.activateMouseHelperDeleteMouseClickListener();
	      this.showMouseHelper();
	}

	activateMouseHelperDeleteMouseClickListener(){
    	document.addEventListener("mouseup", this._MlPlakMarkersDeleteOnMouseUP , false);
    }


    deactivateMouseHelperDeleteClickListener(){
    	document.removeEventListener("mouseup",  this._MlPlakMarkersDeleteOnMouseUP , false);
    }

    activateMouseHelperDeleteMouseMoveListener(){
    	document.addEventListener("mousemove", this._MlPlakMarkersDeleteOnMouseMove , false);
    }

    deactivateMouseHelperDeleteMouseMoveListener(){
    	document.removeEventListener("mousemove",  this._MlPlakMarkersDeleteOnMouseMove , false);
    }

	//--------------- MOUSE UP

	_MlPlakMarkersDeleteOnMouseUP(event) {


	  if(0 === this.contadorMarcadores){
	  	//no hay
	  	this.deactivateMouseHelperDeleteMouseMoveListener();
      	this.deactivateMouseHelperDeleteClickListener();
      	this.hideMouseHelper();
      	return;
	  }

      this.raycaster.setFromCamera(this.mouse, this.viewer.camera);


	   var modelIntersects = this.raycaster.intersectObjects(this.marcadoresDraggables,true);

		if (modelIntersects.length > 0) {
		   var selected = modelIntersects[0].object;

		    var grupoMarcador = selected.parent;

		    var nombreGrupo = "Marcador-"+grupoMarcador.name.split("-")[1];


		    switch(this.viewer.currentActiveView){
	    		case 'front':
	    			this.marcadoresFront.remove(grupoMarcador);
			        break;
		      	case 'back':
			        this.marcadoresBack.remove(grupoMarcador);
			        break;
	     		case 'left':
			        this.marcadoresLeft.remove(grupoMarcador);
			        break;
			    case 'right':
			        this.marcadoresRight.remove(grupoMarcador);
			        break;
			    case 'top':
			   		this.marcadoresTop.remove(grupoMarcador);
			        break;
			    case 'bottom':
			    	this.marcadoresBottom.remove(grupoMarcador);
			    	break;
	        	default:
	        		this.marcadores.remove(grupoMarcador);

        	}





		    // en la lista de dragables solo se guarda el sprite con el texto
		    var nombreSpriteTexto = nombreGrupo + "-text";

		    this.marcadoresDraggables =  this.marcadoresDraggables.filter(function(value, index, arr){
			    return value.name != nombreSpriteTexto;
			});
			this.contadorMarcadores--;
			this.removeDataMarcador(nombreSpriteTexto);

		}

	    this.deactivateMouseHelperDeleteMouseMoveListener();
	    this.deactivateMouseHelperDeleteClickListener();
	    this.hideMouseHelper();
	    this.fireMarkerCountUpdatedEvent();
	}


	_MlPlakMarkersDeleteOnMouseMove(event){
		 event.preventDefault();

	  	  //mover el helper con el movimiento del mouse
	  	  var distanciaZalcursor =  0.1;//0.1; //distancia del mesh al puntero del mouse
		  var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, distanciaZalcursor);
		  vector.unproject( this.viewer.camera );
		  var dir = vector.sub( this.viewer.camera.position ).normalize();

		  var distance = ( distanciaZalcursor - this.viewer.camera.position.z ) / dir.z;
		  var pos = this.viewer.camera.position.clone().add( dir.multiplyScalar( distance ) );
		  this.mouseHelper.position.copy(pos);

		  this.raycaster.setFromCamera(this.mouse, this.viewer.camera);

		  var modelIntersects = this.raycaster.intersectObjects(this.marcadoresDraggables,true);


		  if ( this.selectedMarker ) {


				this.selectedMarker.material.color.copy( this.selectedMarkerColor );
				this.selectedMarker = null;
				this.selectedMarkerColor = null;

			}

		  if (modelIntersects.length > 0) {
			var res = modelIntersects.filter( function ( res ) {
					return res && res.object;
				} )[ 0 ];

			if ( res && res.object ) {
				this.selectedMarker = res.object;
				this.selectedMarkerColor = res.object.material.color.clone();
				this.selectedMarker.material.color.add(-255); // mejorar esto ( es el color de "seleccion")
			}

		  }
	}



    //--------------------------

    //manejo de data del marcador

    addDataMarcador(texto,tamanoFuente,color,id){
    	this.marcadoresData.push({
        	texto:texto,
        	tamano:tamanoFuente,
        	color:color,
        	id:id
        });
    }

    removeDataMarcador(id){
    	this.marcadoresData =  this.marcadoresData.filter(function(value, index, arr){
			    return value.id != id;
		});
		//console.log("borrada data marcador: ",this.marcadoresData);
    }


    /**
    * los marcadores se guardan en la escena (this.viewer.scene), para evitar
    * que se mezclen con los datos a exportar de los modelos en uso.
    * la siguiente funcion permite moverlos al grupo de trabajo (this.viewer.group) para
    * que sean exportados.
    * los objetos TODOS estan DENTRO del elemento:
    * this.group.children[0]
    * aparentemente no le gustan los sprites
    */
    moveMarkersToWorkGroup(){
    	//TODO ?

    }

    //---

    //mantener actualizada la posicion x,y del mouse
    onDocumentMouseMove( event ) {
		event.preventDefault();

        //corregido problema del offset
 		var rect = this.viewer.container.getElementsByTagName('canvas')[0].getBoundingClientRect();
		this.mouse.x = (event.offsetX / rect.width) * 2 - 1;
		this.mouse.y = - (event.offsetY / rect.height) * 2 + 1;
	}

	//-------------------------------------------------
    //obtener el máximo de marcadores permitidos
    //-------------------------------------------------
    getMaxMarkers(){
    	return this.Maximo_Marcadores;
    }

    setMaxMarkers(value){
    	var v = 10
    	if(value && parseInt(value,10) && value > 0){
    		v = value;
    	}
    	this.Maximo_Marcadores = v;
    }

    //-------------------------------------------------
    //event handler para contador de marcadores
    //-------------------------------------------------
    markerCountUpdated(e){
    	if (this.markerCounterUpdatedCallBack && typeof this.markerCounterUpdatedCallBack === 'function') {
        	this.markerCounterUpdatedCallBack(e);
    	}

    }


    //disparador de evento
    fireMarkerCountUpdatedEvent(){

		var cce = new CustomEvent("markerCountUpdated", {
			detail: {
				markerCount: this.contadorMarcadores
			}
		});
		//usar el contenedor para lanzar el evento.
		document.dispatchEvent(cce);
    }

    // muestra u oculta los marcadores
    toggleMarkerVisibility(b){
    	console.log("MlPlakMarkers.toggleMarkerVisibility:",b);
    	if(! ( b === true || b === false) ){
    		return;
    	}
    	this.marcadores.visible = b;
    }

	//------------------------------------------------------------
	// Exportacion de marcadores
	//

	// funcion: prepareMarkersGroupJson
	// Crea un objeto javascript utilizando la lista de marcadores que se ha pasado
	// como parámetro.
	// se debe usar exportMarkers para crear la información de exportación.
	// No se puede usar para procesar marcadores creados por el 3dViewer.
	// parámetros:
	// markerGroup ( Object3D type:Group ): el grupo de marcadores a procesar
	// retorno: un objeto que contiene el nombre de grupo que fue procesado
	//          y una lista de los marcadores de ese grupo
	// Nota:
	//      Solo se almacena la siguiente información de los marcadores:
	//       - Del sprite de texto: ubicación, texto, color y tamaño de fuente.
	//       - del ancla: la posición.
	//       - de la línea: la línea NO se guarda pues basta con la posición de los otros
	//                      dos elementos para crearla.
	//
	// Autor: Gustavo Vivas.

	prepareMarkersGroupJson(markerGroup){

		// guardar:
		// nombre del grupo para poder reensamblarlo
		// sprite texto: texto,tamano,color,posicion
		// marcador.position
		// la linea usa la posicion del texto y la posicion del ancla para ser creada.
		// no hace falta guardarlo.
		// Idea: en la funcion crear marcador se puede crear un parametro adicional
		// que reciba el nombre del grupo, y se reemplaza con el valor que ya esta alli
		// de este modo no hay que crear un a funcion nueva.
		var tempGroup = {};
		tempGroup.groupName = markerGroup.name;
		tempGroup.children = [];

		markerGroup.children.forEach(group => {
			if ( (typeof group.type != 'undefined') && group.type ==='Group' ) {
				console.log('-- marcadores a guardar ----');
				console.log(group);
				console.log('-- ////// ----');
				var markerData = {};
				markerData.markerName = group.name;
				markerData.userData = group.userData;
				markerData.sprite = {};
				markerData.sprite.name = group.children[2].name;
				markerData.sprite.position = group.children[2].position;
				markerData.sprite.text = group.children[2].userData.text;
				markerData.sprite.color = group.children[2].userData.color;
				markerData.sprite.fontSize = group.children[2].userData.fontSize;
				markerData.anchor = {};
				markerData.anchor.name = group.children[1].name;
				markerData.anchor.position = group.children[1].position;
				tempGroup.children.push(markerData);

				console.log('-------- marker data ---------');
				console.log(markerData);
				console.log('-------- marker data ---------');
			}
		});
		return  tempGroup ;
		//console.log('-------- marker group data ---------');
		//console.log(tempGroup);
		//console.log('-------- marker group data ---------');

	}

	// crea la informacion de exportacion de todas las listas de marcadores
	// utilizadas por MlPLakMarkers
	exportMarkers(){
		var markersData = {};
		markersData.perspective = this.prepareMarkersGroupJson(this.marcadores);
		markersData.top = this.prepareMarkersGroupJson(this.marcadoresTop);
		markersData.bottom = this.prepareMarkersGroupJson(this.marcadoresBottom);
		markersData.right = this.prepareMarkersGroupJson(this.marcadoresRight);
		markersData.left = this.prepareMarkersGroupJson(this.marcadoresLeft);
		markersData.back = this.prepareMarkersGroupJson(this.marcadoresBack);
		markersData.front = this.prepareMarkersGroupJson(this.marcadoresFront);

		return markersData;
	}

	// -------------------------------------------------------------------
	// remueve los marcadores de la escena del viewer asignado.
	// esto es de utilidad durante la exportacion ya que los sprites y las
	// lineas con las que se crean los marcadores NO son compatibles con GLTF
	// y detienen el proceso de esportación.
	detachMarkers(){
		// y se procesan aparte. ver: MlPlakMarkers.exportMarkers() y
		//                            app.js -> appSaveCurentUserProjectScene
		this.viewer.scene.remove(this.viewer.scene.getObjectByName('marcadores'));
		this.viewer.scene.remove(this.viewer.scene.getObjectByName('marcadoresTop'));
		this.viewer.scene.remove(this.viewer.scene.getObjectByName('marcadoresBottom'));
		this.viewer.scene.remove(this.viewer.scene.getObjectByName('marcadoresLeft'));
		this.viewer.scene.remove(this.viewer.scene.getObjectByName('marcadoresRight'));
		this.viewer.scene.remove(this.viewer.scene.getObjectByName('marcadoresFront'));
		this.viewer.scene.remove(this.viewer.scene.getObjectByName('marcadoresBack'));
	}

	// -------------------------------------------------------------------
	// reasigna los marcadores al viewer asignado.
	//
	attachMarkers(){
		this.viewer.scene.add(this.marcadores);
        this.viewer.scene.add(this.marcadoresTop);
        this.viewer.scene.add(this.marcadoresBottom);
        this.viewer.scene.add(this.marcadoresLeft);
        this.viewer.scene.add(this.marcadoresRight);
        this.viewer.scene.add(this.marcadoresFront);
		this.viewer.scene.add(this.marcadoresBack);
		this.marcadoresTop.visible = false;
		this.marcadoresBottom.visible = false;
		this.marcadoresLeft.visible = false;
		this.marcadoresRight.visible = false;
		this.marcadoresFront.visible = false;
		this.marcadoresBack.visible = false;
	}

	// -------------------------------------------------------------------
	// recibe un objeto que debe contener el nombre del grupo de marcadores a
	// restaurar y un Array con los datos necesarios para restaurar cada marcador
	// estos datos son: datos de la etiqueta de texto y datos del ancla, la linea
	// se crea a partir de la posicion de esos dos elementos.
	//

	restoreMarkersGroupFromData(markersGroupObj,destinyList){
		var name = markersGroupObj.markerName;
		var markersData = markersGroupObj.children;

		//console.log(name, ' ---- ',markersData);

		//if(name === 'marcadores'){}
		markersData.forEach(m => {
			this._crearMarcador(
				m.sprite.text,
				m.sprite.fontSize,
				m.sprite.color,
				m.sprite.position,
				m.anchor.position,
				m.userData.parentModule,
				destinyList,
				name);
		});
	}

	// -------------------------------------------------------------------
	// Vuelve a crear los marcadores utilizando la información contenida en un objeto
	// que ha sido cargado de la base de datos. ver: - app.js: appLoadCurrentUserProjectScene
	//
	restoreMarkersFromData(dataObj){
		this.restoreMarkersGroupFromData(dataObj.perspective,'perspective');
		this.restoreMarkersGroupFromData(dataObj.top,'top');
		this.restoreMarkersGroupFromData(dataObj.bottom,'bottom');
		this.restoreMarkersGroupFromData(dataObj.left,'left');
		this.restoreMarkersGroupFromData(dataObj.right,'right');
		this.restoreMarkersGroupFromData(dataObj.front,'front');
		this.restoreMarkersGroupFromData(dataObj.back,'back');

		this.attachMarkers();
		this.setupDragControls();

	}

	// los modulos tienen una propiedad "tag"
	// que es el nombre del modulo que se utiliza para todo
	// - Nota: esa informacion debería estar en user data o en la propiedad name del Object3d -
	getMarkersByModuleTag(modelTag){
		var result = new Array();

		this.marcadores.children.forEach(element => {
			if(element.userData && element.userData.parentModule === modelTag){
				result.push(element);
			}
		});
		return result;
	}

	transformMarkersByModule(moduleTag){

		// de esta forma es removido de marcadores y agregado a modelo3d
		//viewer.group.children[0].add(mlPlakMarkers.marcadores.children[0]);

		console.log('transformando marcadores');

		var markersArray = this.getMarkersByModuleTag(moduleTag);
		var tempModulo3D = this.viewer.group.getObjectByName(moduleTag);
		var markerParentList;

		markersArray.forEach( element => {
			 //buscar la lista padre de este objeto:
			 switch(element.userData.viewGroup){
	    		case 'front':
					markerParentList = this.marcadoresFront;
			        break;
		      	case 'back':
				    markerParentList = this.marcadoresBack;
			        break;
	     		case 'left':
				    markerParentList = this.marcadoresLeft;
			        break;
			    case 'right':
				    markerParentList = this.marcadoresRight;
			        break;
			    case 'top':
				    markerParentList = this.marcadoresTop;
			        break;
			    case 'bottom':
				    markerParentList = this.marcadoresBottom;
			    	break;
	        	default:
				    markerParentList = this.marcadores;
        	}

			element.updateMatrixWorld();
			THREE.SceneUtils.detach(element,markerParentList,this.viewer.scene);

			tempModulo3D.updateMatrixWorld();
			THREE.SceneUtils.attach(element,this.viewer.scene,tempModulo3D);

			//console.log('Padre de marcador es modelo3d?:', element.parent === module3D );
		});

		//console.log('modulo: ', module3D);
		//console.log('Marcadores a rotar con modulo: ', markersArray);

		//return module3D;
	}

	returnMarkersByModule(moduleTag){
		var tempModulo3D = this.viewer.group.getObjectByName(moduleTag);
		var markersArray = new Array();

		tempModulo3D.children.forEach(element => {
			if( element.name.includes('Marcador') ){
				markersArray.push(element); //referencia
			}
		});
        console.log('Marcadores a devolver a su vista: ', markersArray);
		//mover a la lista que corresponde
		// THREE se encarga de sacarlo de un objeto 3d y pasarlo a otro
		// ya que por definicion cada objeto solo puede tener un padre
		markersArray.forEach(element=>{

			element.updateMatrixWorld();
			THREE.SceneUtils.detach(element,tempModulo3D,this.viewer.scene);

			var markerParentList;
			//buscar la lista padre de este objeto:
			switch(element.userData.viewGroup){
	    		case 'front':
					markerParentList = this.marcadoresFront;
			        break;
		      	case 'back':
				    markerParentList = this.marcadoresBack;
			        break;
	     		case 'left':
				    markerParentList = this.marcadoresLeft;
			        break;
			    case 'right':
				    markerParentList = this.marcadoresRight;
			        break;
			    case 'top':
				    markerParentList = this.marcadoresTop;
			        break;
			    case 'bottom':
				    markerParentList = this.marcadoresBottom;
			    	break;
	        	default:
				    markerParentList = this.marcadores;
			}

			markerParentList.updateMatrixWorld();
			THREE.SceneUtils.attach(element,this.viewer.scene,markerParentList);

		});


	}

	/*
	* asigna la propiedad visible de los amrcadores relacionados al modelo
	* pasado como referencia
	*/
	toggleMarkersVisibilityByModel(model){
		var markerArray = this.getMarkersByModuleTag(model.tag);
		markerArray.forEach(element => {
			element.visible = model.visible;
		});

	}

}//--
