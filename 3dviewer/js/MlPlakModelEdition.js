/**
 * Contiene el controlador de la edicion de la posicion y rotacion de los modelos
 * Autor: Lovecraft 2020.
 */

class MlPlakModelEdition{
	constructor(options) {

		this.viewer = options.viewer;

    this.transformControl = new THREE.TransformControls( this.viewer.camera, this.viewer.renderer.domElement );
    this.transformControl.setSpace('local');
    this.transformControl.addEventListener( 'dragging-changed', function ( event ) {
      this.viewer.controls.enabled = ! event.value;
      if(! event.value) {
        console.log('stopping dragging model');
        // this.stopDragControls();
      }
    }.bind(this));

    this.transformControl.addEventListener( 'objectChange', function (event) {
      if (event.target && event.target.object) {
        if (this.isDragging) {
          const globalPos =  new THREE.Vector3();
          const copy = event.target.object.position.clone();
          const localPosition = event.target.object.worldToLocal(copy);
          globalPos.x = parseInt(localPosition.x / 10.0) + parseInt(event.target.object.userData._x);
          globalPos.y = parseInt(localPosition.y / 10.0) + parseInt(event.target.object.userData._y);
          globalPos.z = parseInt(localPosition.z / 10.0) + parseInt(event.target.object.userData._z);
          this.fireObjectEditedPositionEvent(globalPos);
        } else {
          const rotation = new THREE.Vector3();
          rotation.x = parseInt(event.target.object.rotation.x / Math.PI * 180.0)
          rotation.y = parseInt(event.target.object.rotation.y / Math.PI * 180.0)
          rotation.z = parseInt(event.target.object.rotation.z / Math.PI * 180.0)
          this.fireObjectEditedRotationEvent(rotation);
        }
      }
    }.bind(this) );

    this.viewer.scene.add( this.transformControl );
    this.isDragging = false
    this.isRotating = false
  }

	setupDragControls(model) {
	  this.isDragging = true;
    if(this.transformControl.object ) {
      this.transformControl.detach( this.transformControl.object );
    }
	  model.parent = this.viewer.group;
    this.transformControl.setMode('translate');
    this.transformControl.attach( model );
  }

  stopDragControls() {
    this.isDragging = false;
    this.isRotating = false;
    if(this.transformControl.object ) {
      this.transformControl.detach( this.transformControl.object );
    }
  }

  startRotate(model) {
    this.isRotating = true;
    if(this.transformControl.object ) {
      this.transformControl.detach( this.transformControl.object );
    }
    model.parent = this.viewer.group;
    this.transformControl.setMode('rotate');
    this.transformControl.attach( model );
  }

  fireObjectEditedPositionEvent(position){
    var cce = new CustomEvent("modelPositionChanged", {
      detail: {
        position
      }
    });
    document.dispatchEvent(cce);
  }

  fireObjectEditedRotationEvent(rotation){
    var cce = new CustomEvent("modelRotationChanged", {
      detail: {
        rotation
      }
    });
    document.dispatchEvent(cce);
  }

  isLocked() {
	  return this.isRotating || this.isDragging;
  }

}
