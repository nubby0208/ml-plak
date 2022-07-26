<template>
  <div
    class="panel-room row"
  >
    <div
      role="tabpanel"
      class="tab-pane"
      id="roomTab"
      ref="panel"
    >
      <div
        class="col-12"
      >
        <div
          class="form-group"
        >
          <input
            true-value="yes"
            false-value="no"
            @change="createRoom"
            id="btn-create-room"
            data-toggle='toggle'
            data-onstyle="success"
            type="checkbox"
            data-width="75%"
          />
		      <span
            class="slider"
          >
          </span>
        </div>
      </div>

      <div
        id="room-attributes"
      >
        <div
          class="row"
        >
          <div
            class="col-12"
          >
            <span
              class="help-block text-muted small-font"
            >
              <span
                class="glyphicon glyphicon-resize-horizontal"
              >
              </span>
              Medidas
            </span>
          </div>
        </div>
        <div
          class="row"
        >
          <div
            class="col-4"
          >
            <input
              @input='setW'
              ref='w'
              type="text"
              class="form-control"
              :value="4000"
          />
          </div>
          <div
            class="col-4"
          >
            <input
              @input='setH'
              ref='h'
              type="text"
              class="form-control"
              :value="2600"
            />
          </div>
          <div
            class="col-4">
            <input
              @input='setL'
              ref='l'
              type="text"
              class="form-control"
              :value="6000"
            />
          </div>
          </div>
          <br />
          <div
           class="row"
          >
          <div
           class="col-12"
          >
            <span
             class="help-block text-muted small-font"
            >
              <span
                class="glyphicon glyphicon-tint"
              >
              </span>
               Colores
            </span>
          </div>
        </div>
        <div
          class="row"
        >
          <div
            class="form-group col-4"
          >
            <label
              for="input-wall-color"
              class="control-label"
            >
              Murallas
            </label>
              <input
                id="input-wall-color"
                type="color"
                @change='setWallColor'
                ref='wall_color'
                class="form-control"
                aria-label="..."
                value="#aaaaaa"
              />
          </div>
          <div
            class="form-group col-4"
            >
              <label
                for="input-ceil-color"
                class="control-label"
              >
                Techo
              </label
              >
              <input
                id="input-ceil-color"
                ref='ceil'
                @change='setCeilColor'
                type="color"
                class="form-control"
                aria-label="..."
                value="#aaaaaa"
              />
          </div>
          <div
            class="form-group col-4"
          >
            <label
              for="input-floor-color"
              class="control-label"
            >
              Piso
            </label>
            <input
              id="input-floor-color"
              @change='setFloorColor'
              ref='floor'
              type="color"
              class="form-control"
              aria-label="..."
              value="#aaaaaa"
            />
          </div>
        </div>
		  <div class="row" style='margin-left: 42px;'>
        		<div class="row">
            	<label for="grid-check">
              		Iluminacion predefinida
            	</label>
        		</div>
        		<div class="row" style='margin-left: -64px;'>
        			 <div class="col-12">
         	 		  <button style='border: none; margin-top: 4px;' @click="setLightPreset('#Ffc500',0,.69,0,0,.06,0,.4)" class="help-block text-muted small-font">
            				Luz de acentuacion
          			  </button>
        			 </div>
        			 <div class="col-12">
         	 		  <button style='border: none; margin-top: 4px;' @click="setLightPreset('#Caff00',.4,1,.5,.4,0,0,.67)" class="help-block text-muted small-font">
            				Luz empotrada
          			  </button>
        			 </div>
        			 <div class="col-12">
         	 		  <button style='border: none; margin-top: 4px;' @click="setLightPreset('#Caff00',.5,1,1,.4,0,0,.87)" class="help-block text-muted small-font">
            				Iluminacion de pista
          			  </button>
        			 </div>
        		</div>
        </div>
		  <div class="row" style='margin-top 16px;'>
        		<div class="row" style='margin-left: 62px;'>
        				<div class="col-12">
         	 			<span class="help-block text-muted small-font">
          				<span class="glyphicon glyphicon-adjust">
          				</span>
          				<label style='margin-top 32px;' for="grid-check">Luz de sala</label>
          				</span>
        				</div>
        		</div>
        		<div class="row">
          		<div class="col-12 col-md-6">
            		<input id="input-light-enabled-a" type="checkbox" checked data-toggle="toggle" data-onstyle="primary" data-width="100%"/>
          		</div>
          		<div class="col-12 col-md-6">
              		<input id="input-light-visible-a" type="checkbox" checked data-toggle="toggle" data-onstyle="primary" data-width="100%"/>
          		</div>
          		<div class="col-12">
            		<label for="grid-check">
              			Intercepto de sombra
            		</label>
            		<input type="range" id="input-light-bias" @change='setBias' ref='bias' value="0" max="0.001" min="0" step="0.0001"/>
          		</div>
        		</div>
        		<div class="row" style='margin-left: 50px;'>
          		<div class="col-12">
            		<label for="grid-check">
              			Posicion (x,y,z)
            		</label>
          		</div>
        		</div>
        		<div class="row" style='margin-left: 12px;'>
          		<div class="col-4">
            		<input @input='setXPos' ref='x' type="text" class="form-control" :value="0" id="input-light-x"/>
          		</div>
          		<div style='margin-left: -12px;' class="col-4">
            		<input @input='setYPos' ref='y' type="text" class="form-control" :value="1" id="input-light-y"/>
          		</div>
          		<div style='margin-left: -12px;' class="col-4">
            		<input @input='setZPos' ref='z' type="text" class="form-control" :value="0" id="input-light-z"/>
          		</div>
          	</div>
        		<div class="row" style='margin-left: 50px;'>
          		<div class="col-12">
            		<label for="grid-check">
              			Objetivo (x,y,z)
            		</label>
          		</div>
        		</div>
        		<div class="row" style='margin-left: 12px;'>
          		<div class="col-4">
            		<input @input='setXTarget' ref='xhat' type="text" class="form-control" :value="0" id="input-light-xhat"/>
          		</div>
   		       <div style='margin-left: -12px;' class="col-4">
            		<input @input='setYTarget' ref='y' type="text" class="form-control" :value="1" id="input-light-yhat"/>
          		</div>
          		<div style='margin-left: -12px;' class="col-4">
            		<input @input='setZTarget' ref='z' type="text" class="form-control" :value="0" id="input-light-zhat"/>
          		</div>
          	</div>
        		<div class="row" style='margin-top: 12px'>
          		<div class="form-group col-12 col-md-6" style='margin-left: 24px; margin-right: -24px;'>
            		<label for="input-light-color" class="control-label">
              			Color
            		</label>
            		<input id="input-light-color" type="color" @change='UpdateRoom' class="form-control" aria-label="..." value="#aaaaaa"/>
          		</div>
          		<div class="form-group col-12 col-md-6">
            		<label for="input-light-intensity" class="control-label">
              			Intensidad
            		</label>
            		<input id="input-light-intense" type="range" step="0.1" min="0" max="1" class="form-control" @change='setIntensity' ref='light' aria-label="..." value="1"/>
          		</div>
        		</div>
        </div>
        <div class="row">
          <div class="col-12">
            <select class="form-control" @change='addRoomElement' id="object-editor-select">
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OBJLoader } from 'three-obj-mtl-loader'
import $ from 'jquery'

class Room {
  constructor (w, h, l, params) {
    this.options = params
    this.avaliableObjects = []
    //TODO: compatibility_check === scene != room_group
    this.scene = new THREE.Group()
    this.scaleFactor = 0.1
    this.scene.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor)
    this.objects = []

    this.materials = {
      'wall': new THREE.MeshPhongMaterial({
        color: this.options.wallColor || 0xaaaaaa,
        side: THREE.BackSide,
        shading: THREE.FlatShading
      }),
      'ceil': new THREE.MeshPhongMaterial({
        color: this.options.ceilColor || 0x666666,
        side: THREE.BackSide,
        shading: THREE.FlatShading
      }),
      'floor': new THREE.MeshPhongMaterial({
        color: this.options.floorColor || 0x666666,
        side: THREE.BackSide,
        shading: THREE.FlatShading
      }),
      'editorBox': new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 2
      })
    }

    var geometry = new THREE.BoxGeometry(1, 1, 1)
    this.mesh = new THREE.Mesh(geometry, [
      this.materials['wall'],
      this.materials['wall'],
      this.materials['ceil'],
      this.materials['floor'],
      this.materials['wall'],
      this.materials['wall']
    ])
    this.mesh.receiveShadow = true
    this.mesh.scale.x = w
    this.mesh.scale.y = h
    this.mesh.scale.z = l
    this.mesh.translateX(w / 2)
    this.mesh.translateY(h / 2)
    this.mesh.translateZ(l / 2)
    this.scene.add(this.mesh)
    this.loadTextures()
  }

  setSize (data) {
    this.mesh.position.set(0, 0, 0)
    this.mesh.scale.x = data.width
    this.mesh.scale.y = data.height
    this.mesh.scale.z = data.length
    this.mesh.position.set(data.width / 2, data.height / 2, data.length / 2)
  }

  setColors (data) {
    this.materials['wall'].color.setHex(data.wall)
    this.materials['ceil'].color.setHex(data.ceil)
    this.materials['floor'].color.setHex(data.floor)
  }

  loadTextures (textureName) {
    var wallTextureName = 'beige-pattern.png'
    // var ceilTextureName = 'basic-white-tile.jpg'
    // load a texture, set wrap mode to repeat
    var texture = new THREE.TextureLoader().load('static/assets/' + wallTextureName)
    texture.wrapS = THREE.MirroredRepeatWrapping
    texture.wrapT = THREE.MirroredRepeatWrapping
    texture.repeat.set(4, 4)
    this.materials['wall'].map = texture
    return texture
  }

  getMesh () {
    return this.scene
  }

  updateMaterials () {
    let meshMaterialsLength = this.mesh.material.length

    for (let i = 0; i < meshMaterialsLength; i++) {
      if (i === 2) {
        this.mesh.material[i] = this.ceilMaterial
      }
      else if (i === 3) {
        this.mesh.material[i] = this.floorMaterial
      }
      else {
        this.mesh.material[i] = this.wallMaterial
      }
      this.mesh.material[i].map.needsUpdate = true
    }
  }

  setIntensity (event) {
    this.light.intensity = $('#input-light-intense').val()
  }

  setColor (data) {
    //console.info(data)
    this.light.color.setHex(data)
  }

  setLight (data) {
    this.light.intensity = data.intensity
    this.light.color.setHex(data.color)
  }
}

function findObjectByTag (list, tag) {
  let listLength = list.length
  for (var i = 0; i < listLength; i++) {
    if (list[i].tag === tag) {
      return list[i]
    }
  }
  return false
}

export default {
  name: 'PanelRoom',
  data: function () {
    return {
      w: null,
      h: null,
      l: null,
      x: null,
      y: null,
      z: null,
      xhat: null,
      yhat: null,
      zhat: null,
      params: {},
      mesh: null,
      light: null,
      lights: {},
      toggle: 'yes'
    }
  },
  constructor () {
  },
  computed: {
    view: {
      set (value) {
        this.$store.commit('setViewerEditor', value)
      },
      get () {
        return this.$store.state.viewer3d.viewerEditor
      }
    }
  },
  components: {
  },
  created () {
  },
  mounted: function () {
    this.$on('w', (event) => {
      this.setW(event.target.value)
    })
    this.$on('h', (event) => {
      this.setH(event.target.value)
    })
    this.$on('l', (event) => {
      this.setL(event.target.value)
    })
    this.$on('light', (event) => {
      this.setLight(event.target.value)
    })
    this.$on('bias', (event) => {
      this.setBias(event.target.value)
    })
    this.$on('wall_color', (event) => {
      this.setWallColor(event.target.value)
    })
    this.$on('ceil', (event) => {
      this.setCeilColor(event.target.value)
    })
    this.$on('floor', (event) => {
      this.setFloorColor(event.target.value)
    })
    this.$on('main_light', (event) => {
      this.setMainLight(event.target.value)
    })
    this.$on('xset', (event) => {
      this.setXPos(event.target.value)
    })
    this.$on('yset', (event) => {
      this.setYPos(event.target.value)
    })
    this.$on('zset', (event) => {
      this.setZPos(event.target.value)
    })
    this.$on('xhatset', (event) => {
      this.setXTarget(event.target.value)
    })
    this.$on('yhatset', (event) => {
      this.setYTarget(event.target.value)
    })
    this.$on('zhatset', (event) => {
      this.setZTarget(event.target.value)
    })
  },
  methods: {
    setW (v) {
      this.w = v
      this.updateRoom({'dimension': {'width': this.w, 'height': this.h, 'length': this.l}})
    },

    setH (v) {
      this.h = v
      this.updateRoom({'dimension': {'width': this.w, 'height': this.h, 'length': this.l}})
    },

    setL (v) {
      this.l = v
      this.updateRoom({'dimension': {'width': this.w, 'height': this.h, 'length': this.l}})
    },

    setLightPreset (hex,x,y,z,xhat,yhat,zhat,intensity) {
      //use data on view
      try{
      	if (typeof(this.viewer.room.scene === 'undefined')){
				this.createRoom()
      	}
      	this.viewer.scene.children[19].intensity = intensity
      	this.viewer.scene.children[19].color.setHex(hex)
      	this.viewer.scene.children[19].position.set(x,y,z)
      	this.viewer.scene.children[19].target.position.set(xhat,yhat,zhat)
      	//store data for view update (should update-first for better rasterization)
      	this.updateRoom({'color': {'light': hex, 'intensity': this.viewer.scene.children[19].intensity}})
      	this.updateRoom({'coordinates': {'x': this.w, 'y': this.h, 'z': this.l, 'xhat': this.xhat, 'yhat': this.yhat, 'zhat': this.zhat}})
      	this.viewer.renderFrame()
      }
      catch(error){
      	alert('Necesita crear una habitacion para poder cargar las luces')
      }
    },

  setIntensity (data) {
    this.viewer.scene.children[19].intensity=$('#input-light-intense').val()
    //explicit render
    this.viewer.renderFrame()
  },

  setColor (data) {
    //console.info('Data',data)
    this.viewer.scene.children[19].color.setHex(data)
  },

  setLight (data) {
    this.viewer.scene.children[19].intensity = $('#input-light-intense').val()
    this.viewer.scene.children[19].color.setHex($('#input-light-intense').val())
  },

    setXPos (v) {
      this.x = v
      this.updateRoom({'coordinates': {'x': $('#input-light-x').val(), 'y': $('#input-light-y').val(), 'z': $('#input-light-x').val(), 'xhat': $('#input-light-xhat').val(), 'yhat': $('#input-light-yhat').val(), 'zhat': $('#input-light-zhat').val()}})
    },

    setYPos (v) {
      this.y = v
      this.updateRoom({'coordinates': {'x': $('#input-light-x').val(), 'y': $('#input-light-y').val(), 'z': $('#input-light-x').val(), 'xhat': $('#input-light-xhat').val(), 'yhat': $('#input-light-yhat').val(), 'zhat': $('#input-light-zhat').val()}})
    },

    setZPos (v) {
      this.z = v
      this.updateRoom({'coordinates': {'x': $('#input-light-x').val(), 'y': $('#input-light-y').val(), 'z': $('#input-light-x').val(), 'xhat': $('#input-light-xhat').val(), 'yhat': $('#input-light-yhat').val(), 'zhat': $('#input-light-zhat').val()}})
    },

    setXTarget (v) {
      this.xhat = v
      this.updateRoom({'coordinates': {'x': $('#input-light-x').val(), 'y': $('#input-light-y').val(), 'z': $('#input-light-x').val(), 'xhat': $('#input-light-xhat').val(), 'yhat': $('#input-light-yhat').val(), 'zhat': $('#input-light-zhat').val()}})
    },

    setYTarget (v) {
      this.yhat = v
      this.updateRoom({'coordinates': {'x': $('#input-light-x').val(), 'y': $('#input-light-y').val(), 'z': $('#input-light-x').val(), 'xhat': $('#input-light-xhat').val(), 'yhat': $('#input-light-yhat').val(), 'zhat': $('#input-light-zhat').val()}})
    },

    setZTarget (v) {
      this.zhat = v
      this.updateRoom({'coordinates': {'x': $('#input-light-x').val(), 'y': $('#input-light-y').val(), 'z': $('#input-light-x').val(), 'xhat': $('#input-light-xhat').val(), 'yhat': $('#input-light-yhat').val(), 'zhat': $('#input-light-zhat').val()}})
    },

    setBias (evt) {
      this.viewer.scene.children[19].shadow.bias = evt.target.value
      this.updateRoom(evt)
    },

    setWallColor (v) {
      v = v.target.value
      this.viewer.room.options.wallColor = v
      v = {'color': v}
      this.updateRoom(v)
    },

    setCeilColor (v) {
      v = v.target.value
      this.viewer.room.options.ceilColor = v
      this.updateRoom(v)
    },

    setFloorColor (v) {
      v = v.target.value
      this.viewer.room.options.floorColor = v
      this.updateRoom(v)
    },

    setMainLight (v) {
      v = v.target.value
      this.viewer.room.options.wallColor = v
      this.updateRoom(v)
    },

    getRoomObjectsAvaliable () {
      return [
        {
          'name': 'simple_door',
          'filename': 'basic_door.obj'
        },
        {
          'name': 'basic_window',
          'filename': 'basic_window.obj'
        }
      ]
    },

    fillRoomObjectSelect (data) {
      let element = $('#object-editor-select')
      let dataLength = data.length

      for (let i = 0; i < dataLength; i++) {
        element.append('<option data-index="' + i + '" value="' + data[i].name + '"> ' + data[i].name + '</option>')
      }
    },

    addRoomElement (v) {
      var roomTable = $('#room-table')
      var template = roomTable.find('.row-template')[0]
      var newRow = $(template).clone()
      newRow.attr('tag', this.stringGen(10))
      newRow.removeClass('row-template')
      newRow.show()
      var typeInput = newRow.children('td:first')
      typeInput.html(v.target.value)
      roomTable.append(newRow)
      $('#room-table tbody tr:last td:nth-child(2) input').trigger('change')
      this.viewer.renderFrame()
    },

    stringGen (len) {
      var text = ''
      var charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < len; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length))
      }
      return text
    },

    removeObject (tag) {
      var obj = findObjectByTag(this.viewer.room.objects, tag)
      var index = this.viewer.room.objects.indexOf(obj)
      this.scene.remove(obj)
      this.viewer.room.objects.slice(index, 1)
    },

    addRoom () {
      console.info('Adding new room')
      //this.viewer.scene.children[19] = this.viewer.room.light
      //this.viewer.scene.children[0] = this.viewer.room.getMesh()
    },

    addLight (x, y, z, xhat, yhat, zhat) {
      var light = new THREE.DirectionalLight(0xffffff, 1)
      //dar la posicion de la luz
      light.position.set(x, y, z)
      //this.view.lights.add(light)
      //ubicar la luz desde su origen
      light.target.position.set(xhat,yhat,zhat)
      return light
    },

    updateRoom (data) {
      this.viewer = this.$store.state.viewer3d.viewer
      if (data.hasOwnProperty('dimension')) {
        console.info('Rendering dimension')
        this.viewer.room.setSize(data.dimension)
      }
      else if (data.hasOwnProperty('color')) {
        try{
        	this.viewer.room.setColors(data.color)
        }
        catch(error){
        		this.createRoom()
        		this.viewer.room.setColors(data.color)
        }
      }
      else if (data.hasOwnProperty('coordinates')) {
        this.viewer.scene.children[19].position.set($('#input-light-x').val(), $('#input-light-y').val(), $('#input-light-z').val())
        this.viewer.scene.children[19].target.position.set($('#input-light-xhat').val(), $('#input-light-yhat').val(), $('#input-light-zhat').val())
      }
      this.viewer.renderFrame()
    },

    removeRoom () {
      if (!this.viewer.room) {
        return
      }
      this.viewer.scene.children[19].remove(this.viewer.scene.lights)
      this.viewer.scene.children[19].remove(this.viewer.room.getMesh())
    },

    UpdateRoom () {
      var wc = $('#input-wall-color').val()
      var fc = $('#input-floor-color').val()
      var cc = $('#input-ceil-color').val()
      var lightColor = $('#input-light-color').val()
      var lightIntensity = $('#input-light-intense').val()
      this.updateRoom({
        color: {
          wall: wc.replace('#', '0x'),
          floor: fc.replace('#', '0x'),
          ceil: cc.replace('#', '0x')
        },
        light: {
          color: lightColor.replace('#', '0x'),
          intensity: lightIntensity
        }
      })
    },

    createRoom () {
      //Viewer is taken from methods and committed before updates
      this.viewer = this.$store.state.viewer3d.viewer
      //this.$store.commit('setViewer', this.viewer)
      if (this.toggle === 'yes') {
        if (typeof(this.viewer.room) !== 'undefined') {
          try{
          	if (this.viewer.scene.parent === this.viewer.room.scene) {
            	this.removeRoom()
          	}
          	else {
          		if (typeof(this.viewer.scene) === 'undefined'){
          			 console.info('Undefined scene')
          		}
          		else{
          			 //this.addRoom()
          			 return
          		}
          	}
          }
          catch (error){
          	console.info('ERROR:',error)
          	return
          }
        }
        else{
        		this.w, this.h, this.l = this.w * this.scaleFactor * 0.9, this.h * this.scaleFactor * 0.9, this.l * this.scaleFactor * 0.9
        		this.viewer.room = new Room(this.w, this.h, this.l, this.params)
        		this.viewer.room.avaliableObjects = this.viewer.room.objects
        		if (this.showAfterCreate) {
          		this.$set(this.viewer.room.scene,'panel',this.viewer.room.getMesh())
        		}
        		let light = this.addLight($('#input-light-x').val(), $('#input-light-y').val(), $('#input-light-z').val(), $('#input-light-xhat').val(), $('#input-light-yhat').val(), $('#input-light-zhat').val())
        		this.viewer.scene.add(light)
        		let room_mesh = this.viewer.room.getMesh()
        		this.viewer.scene.add(room_mesh)
        		//order is 19
        		//console.info('Scene children', this.viewer.scene.children[19])
        		this.light = this.viewer.scene.children[19]
        		$('#input-main-light').val(0.5)
        		$('#input-main-light').trigger('change')
        		this.fillRoomObjectSelect(this.getRoomObjectsAvaliable())
        }
      }
      else {
        this.removeRoom()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.panel-room {
  /* PANELS */
  .panel{
    border-radius: 1px;
  }

  .form-control{
    border-radius: 1px;
  }


  /* Large desktop */
  @media (min-width: 1200px) {
      .row-central{
        height: 80vh;
      }

      .panel-top{
        height: 10vh;
        margin-bottom: 1vh;
      }

      .panel-central{
        height: 90vh;
        overflow-y: auto;
      }

      .panel-viewer{
        height: 90vh;
        border-radius: 0px;
      }

  }

  .form-group{margin-bottom:1rem}

  .panel-viewer .panel-body{
    padding: 2px;
  }

  #viewer{
    height: 100%;
  }


  #console{
    max-height: 30vh;
    overflow-y: auto;
  }

  #piece-editor-index{
    display: none;
  }

  .color-box {
    width: 100%;
    min-height: 20px;
    border: 1px solid rgba(0, 0, 0, .2);
  }

  body, html, .container-fluid {
      height: 100%;
  }

  .col-hidden {
    display: none;
  }

  input {display: block; padding: 0; margin: 0; border: 0; width: 100%;}
  td {margin: 0; padding: 0;}

  .info {
    position: absolute;
    top: 10px;
    width: 100%;
    text-align: center;
    z-index: 100;
    display:block;
    font-size: 24px;
    color: black;
  }

  #toolbar{
    position: absolute;
  }



  .fixed-panel{
    height: 80vh;
  }

  #piece-editor .input-group{
    width: 100%;
  }

  .bootstrap-table .fixed-table-container {
    height: 30vh;
    overflow-y: auto;
  }

  #viewer-tools{
    position: absolute;
    right: 0;
    opacity: 0.8;
  }

  .gi-2x{font-size: 2em;}
  .gi-3x{font-size: 3em;}
  .gi-4x{font-size: 4em;}
  .gi-5x{font-size: 5em;}


  .glyphicon-visible:hover{
    cursor: pointer; cursor: hand;
    -webkit-transition: all 200ms ease-in;
    -webkit-transform: scale(1.2);
    -ms-transition: all 200ms ease-in;
    -ms-transform: scale(1.2);
    -moz-transition: all 200ms ease-in;
    -moz-transform: scale(1.2);
    transition: all 200ms ease-in;
    transform: scale(1.2);
  }

  /*3dviewer hud*/
  div#currentView{
    position: absolute;
    font-size:110%;
    right: 20px;
    top: 10px;
    color:rgba(0,0,0,0.5);
  }

  .spinner {
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    width: 50px;
    height: 40px;
    text-align: center;
    font-size: 10px;
    position:absolute;
  }

  .spinner > div {
    background-color: #333;
    height: 100%;
    width: 6px;
    display: inline-block;
    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .spinner .rect3 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  .spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @-webkit-keyframes sk-stretchdelay {
    0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
    20% { -webkit-transform: scaleY(1.0) }
  }

  @keyframes sk-stretchdelay {
    0%, 40%, 100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }  20% {
      transform: scaleY(1.0);
      -webkit-transform: scaleY(1.0);
    }
  }

  .text-left{text-align:left!important}
}

