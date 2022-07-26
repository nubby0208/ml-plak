/**
 * Contiene la administracion de las selecciones de los modulos y piezas
 * Autor: Lovecraft 2020.
 */

class MlPlakSelector{

	constructor(options) {

		this.viewer = options.viewer;

        this.raycaster = new THREE.Raycaster();

		this.mouse = new THREE.Vector2();

		this.intersection = {
			intersects: false,
			point: new THREE.Vector3(),
			normal: new THREE.Vector3(),
			module: ""
		};

		this.selectedModule = null;
		this.selected = null;
		this.fireObjectSelectedEvent = this.fireObjectSelectedEvent.bind(this);

	}

	selectFromClick(event, isModule = true) {

		var rect = this.viewer.container.getElementsByTagName('canvas')[0].getBoundingClientRect();
		this.mouse.x = (event.offsetX / rect.width) * 2 - 1;
		this.mouse.y = - (event.offsetY / rect.height) * 2 + 1;

		var distanciaZalcursor =  0;
		var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
		vector.unproject( this.viewer.camera );
		var dir = vector.sub( this.viewer.camera.position ).normalize();

		var distance = ( distanciaZalcursor - this.viewer.camera.position.z ) / dir.z;
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

			var p = modelIntersects[ 0 ].point;
			this.intersection.point.copy( p );

			if( !modelIntersects[ 0 ].face ){
				//marcar que NO se puede agregar punto
				return;
			}

			var processAncestor = function(ancestor){
				if( ancestor.tag && ancestor.tag.includes('Modul') ){
					//console.log('objeteo elegido: ',selected, ' pertenece al modulo ', ancestor.tag);
					this.intersection.module = ancestor.tag;
					this.selectedModule = ancestor;
					return;
				}
			}.bind(this);

			if ( typeof selected.traverseAncestors === 'function' ){
				selected.traverseAncestors ( processAncestor);
			}

			if(isModule && this.selectedModule) {
				this.selected = this.selectedModule;
				this.viewer.selectItem(this.selectedModule);
			} else {
				this.selected = selected;
				this.viewer.selectItem(selected);
			}

			if (this.selected) {
				this.fireObjectSelectedEvent();
			}
		}
	}

	fireObjectSelectedEvent(){
	  const eventType = this.selected.userData.type === 'module' ? "viewerModuleSelected" : "viewerPieceSelected";
	  console.log(eventType);
		var cce = new CustomEvent(eventType, {
			detail: {
				data: this.selected.userData
			}
		});
		document.dispatchEvent(cce);
	}

	selectById(id) {
	  this.selected = this.viewer.getObjectById( id );
	  this.viewer.selectItem(this.selected);
    if (this.selected) {
      this.fireObjectSelectedEvent();
    }
  }

  clearSelection () {
	  this.selected = null;
	  this.viewer.clearSelection();
  }
}
