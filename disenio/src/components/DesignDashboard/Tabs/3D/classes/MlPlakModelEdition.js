/**
 * Contiene el controlador de la edicion de la posicion y rotacion de los modelos
 * Autor: Lovecraft 2020.
 */

import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

export class MlPlakModelEdition {
  constructor (options) {
    this.viewer = options.viewer
    this.onObjectEdited = options.onObjectEdited

    var that = this
    this.transformControl = new TransformControls(this.viewer.camera, this.viewer.renderer.domElement)
    this.transformControl.setSpace('local')
    this.transformControl.addEventListener('dragging-changed', function (event) {
      this.viewer.controls.enabled = !event.value
      if (!event.value) {
        that.onObjectEdited({
          id: event.target.object.userData.id,
          x: event.target.object.position.x,
          y: event.target.object.position.y,
          z: event.target.object.position.z
        })
        console.log('stopping dragging model')
        this.stopDragControls()
      }
    }.bind(this))

    this.transformControl.addEventListener('objectChange', function (event) {
      if (event.target && event.target.object) {
        if (this.isDragging) {
          // no estoy seguro porque se realizan estos calculos
          const globalPos = new THREE.Vector3()
          const copy = event.target.object.position.clone()
          const localPosition = event.target.object.worldToLocal(copy)
          globalPos.x = parseInt(localPosition.x / 10.0) + parseInt(event.target.object.userData.x)
          globalPos.y = parseInt(localPosition.y / 10.0) + parseInt(event.target.object.userData.y)
          globalPos.z = parseInt(localPosition.z / 10.0) + parseInt(event.target.object.userData.z)
          // this.fireObjectEditedPositionEvent(event.target.object, globalPos)
        } else {
          const rotation = new THREE.Vector3()
          rotation.x = parseInt(event.target.object.rotation.x / Math.PI * 180.0)
          rotation.y = parseInt(event.target.object.rotation.y / Math.PI * 180.0)
          rotation.z = parseInt(event.target.object.rotation.z / Math.PI * 180.0)
          // this.fireObjectEditedRotationEvent(event.target.object, rotation)
          if (this.onObjectEdited) {
            this.onObjectEdited({
              id: event.target.object.userData.id,
              rx: parseInt(event.target.object.rotation.x / Math.PI * 180.0),
              ry: parseInt(event.target.object.rotation.y / Math.PI * 180.0),
              rz: parseInt(event.target.object.rotation.z / Math.PI * 180.0)
            })
          }
        }
      }
    }.bind(this))

    this.viewer.scene.add(this.transformControl)
    this.isDragging = false
    this.isRotating = false
  }

  setupDragControls (model) {
    this.isDragging = true
    if (this.transformControl.object) {
      this.transformControl.detach(this.transformControl.object)
    }
    model.parent = this.viewer.group
    this.transformControl.setMode('translate')
    this.transformControl.attach(model)
  }

  stopDragControls () {
    this.isDragging = false
    this.isRotating = false
    if (this.transformControl.object) {
      this.transformControl.detach(this.transformControl.object)
    }
  }

  startRotate (model) {
    this.isRotating = true
    if (this.transformControl.object) {
      this.transformControl.detach(this.transformControl.object)
    }
    model.parent = this.viewer.group
    this.transformControl.setMode('rotate')
    this.transformControl.attach(model)
  }

  fireObjectEditedPositionEvent (object, position) {
    // var cce = new CustomEvent('modelPositionChanged', {
    var cce = new CustomEvent('objectEdited', {
      detail: {
        name: object.name,
        position
      }
    })
    this.viewer.renderer.domElement.dispatchEvent(cce)
    // document.dispatchEvent(cce)
  }

  fireObjectEditedRotationEvent (object, rotation) {
    // var cce = new CustomEvent('modelRotationChanged', {
    var cce = new CustomEvent('objectEdited', {
      detail: {
        name: object.name,
        rotation
      }
    })
    this.viewer.renderer.domElement.dispatchEvent(cce)
    // document.dispatchEvent(cce)
  }

  isLocked () {
    return this.isRotating || this.isDragging
  }
}
