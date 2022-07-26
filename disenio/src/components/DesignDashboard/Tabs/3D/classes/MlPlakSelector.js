/**
 * Contiene la administracion de las selecciones de los modulos y piezas
 * Autor: Lovecraft 2020.
 */

import * as THREE from 'three'

export class MlPlakSelector {
  constructor (options) {
    
    this.options = options
    this.viewer = options.viewer
    // console.log(options.onObjectSelected)
    this.onObjectSelected = options.onObjectSelected
    this.onObjectSelectedCad = options.onObjectSelectedCad

    this.raycaster = new THREE.Raycaster()

    this.mouse = new THREE.Vector2()

    this.intersection = {
      intersects: false,
      point: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      module: ''
    }

    this.selectedModule = null
    this.selected = null
    // this.fireObjectSelectedEvent = this.fireObjectSelectedEvent.bind(this)
  }

  selectFromClick (event, isModule = true) { 
    if (this.viewer.isLabelMode) {
      event.preventDefault();
      return;
    }

    let canvas = this.viewer.renderer.domElement
    // var rect = this.viewer.container.getElementsByTagName('canvas')[0].getBoundingClientRect()
    this.mouse.x = (event.offsetX / canvas.width) * 2 - 1
    this.mouse.y = -(event.offsetY / canvas.height) * 2 + 1

    this.getSelectModulePiece(isModule);
    this.getSelectGrupoCad(isModule);
    
  }

  getSelectModulePiece(isModule) {

    let modelMeshObjects = []
    let childrenLength = this.viewer.group.children.length
    let viewerGroup = this.viewer.group

    for (let i = 0; i < childrenLength; i++) {
      // solo si esta visible el objeto (modulo) agregar a la lista de colisiones de rayo
      if (viewerGroup.children[i].visible) {
        // modelMeshObjects = modelMeshObjects.concat(this.viewer.group.children[i].children)
        // modelMeshObjects.push(this.viewer.group.children[i])
        viewerGroup.children[i].children.forEach(function (d) {
          let obj = d.children.find(d => d.pieceType === 'piece').clone()
          obj.position.set(d.position.x, d.position.y, d.position.z)
          obj.originalId = d.userData.id
          obj.tag = d.tag
          modelMeshObjects.push(obj)
        })
      }
    }
    
    this.raycaster.setFromCamera(this.mouse, this.viewer.camera)
    let modelIntersects = this.raycaster.intersectObjects(modelMeshObjects, true)
    if (modelIntersects.length > 0) {
      let selected = this.viewer.getObjectById(modelIntersects[0].object.originalId)

      let p = modelIntersects[ 0 ].point
      this.intersection.point.copy(p)

      if (!modelIntersects[ 0 ].object) {
        // marcar que NO se puede agregar punto
        return
      }

      let processAncestor = function (ancestor) {
        if (ancestor.tag && ancestor.tag.includes('Modul')) {
          // console.log('objeteo elegido: ',selected, ' pertenece al modulo ', ancestor.tag);
          this.intersection.module = ancestor.tag
          this.selectedModule = ancestor
        }
      }.bind(this)

      if (typeof selected.traverseAncestors === 'function') {
        selected.traverseAncestors(processAncestor)
      }

      if (isModule && this.selectedModule) {
        this.selected = this.selectedModule
      }
      else {
        this.selected = selected
      }

      this.viewer.selectItem(this.selected)
      this.onObjectSelected(this.selected.userData, modelIntersects)
    }
    
  }

  getSelectGrupoCad(isModule) {

    let modelMeshObjects = []
    let childrenLength = this.viewer.groupCad.children.length
    let viewerGroup = this.viewer.groupCad;

    for (let i = 0; i < childrenLength; i++) {
      // solo si esta visible el objeto (modulo) agregar a la lista de colisiones de rayo
      if (viewerGroup.children[i].visible) {
        // modelMeshObjects = modelMeshObjects.concat(this.viewer.group.children[i].children)
        // modelMeshObjects.push(this.viewer.group.children[i])
        viewerGroup.children[i].children.forEach(function (d) {
          let obj = d.clone();
          obj.position.set(d.position.x, d.position.y, d.position.z)
          obj.originalId = d.userData.id
          obj.tag = d.tag
          modelMeshObjects.push(obj)
        })
      }
    }
    
    this.raycaster.setFromCamera(this.mouse, this.viewer.camera)
    let modelIntersects = this.raycaster.intersectObjects(modelMeshObjects, true)
    if (modelIntersects.length > 0) {
      let selected = this.viewer.getObjectByIdCad(modelIntersects[0].object.originalId)

      let p = modelIntersects[ 0 ].point
      this.intersection.point.copy(p)

      if (!modelIntersects[ 0 ].object) {
        // marcar que NO se puede agregar punto
        return
      }

      let processAncestor = function (ancestor) {
        if (ancestor.name && ancestor.name.includes('grupo_cad_')) {
          // console.log('objeteo elegido: ',selected, ' pertenece al modulo ', ancestor.tag);
          // this.intersection.module = ancestor.tag
          this.selectedModule = ancestor
        }
      }.bind(this)

      if (typeof selected.traverseAncestors === 'function') {
        selected.traverseAncestors(processAncestor)
      }

      if (isModule && this.selectedModule) {
        this.selected = this.selectedModule
      }
      else {
        this.selected = selected
      }

      console.log(this.selected.userData);
      this.viewer.selectItemCad(this.selected)
      this.onObjectSelectedCad(this.selected.userData, modelIntersects)
    }
    
  }

  /* genera un evento global indicando que se selecciono una pieza o modelo
   * durante la migracion hacia vuejs se pasa de generar eventos globales y se trabaja con callbacks.
  */
  fireObjectSelectedEvent () {
    const eventType = this.selected.userData.type === 'module' ? 'viewerModuleSelected' : 'viewerPieceSelected'
    let cce = new CustomEvent(eventType, {
      detail: {
        data: this.selected.userData
      }
    })
    document.dispatchEvent(cce)
  }

  selectById (id) {
    this.selectedModule = null
    this.selected = null
    this.selected = this.viewer.getObjectById(id)
    // console.log(this.selected)
    this.viewer.selectItem(this.selected)
    this.onObjectSelected(this.selected.userData)
    if (this.selected.userData.type === 'piece') {
      this.selectedModule = this.selected.parent.parent
    }

    /*
    if (this.selected) {
      this.fireObjectSelectedEvent()
    }
    */
  }

  clearSelection () {
    this.selectedModule = null
    this.selected = null
    this.viewer.clearSelection()
    this.onObjectSelected(null)
  }
}
