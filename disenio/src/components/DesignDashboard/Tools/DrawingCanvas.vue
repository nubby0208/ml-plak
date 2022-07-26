<template>
    <div style="overflow-x: auto;" class="drawing-canvas">
      <b-modal ref="formDibujoModal" size="lg" hide-footer title="">
        <div ref="form_dibujo">
          <div role="group">
            <label for="input-live">Eje X:</label>
            <b-form-input
              @keyup="validarEspacioDisponible"
              v-model="formulario.x"
              id="input-live"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Eje X"
              trim
            ></b-form-input>

            <!-- This will only be shown if the preceding input has an invalid state -->
            <b-form-invalid-feedback id="input-live-feedback">
              Error
            </b-form-invalid-feedback>

            <label for="input-live">Eje Y:</label>
            <b-form-input
              @keyup="validarEspacioDisponible"
              v-model="formulario.y"
              id="input-live"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Eje Y"
              trim
            ></b-form-input>

            <!-- This will only be shown if the preceding input has an invalid state -->
            <b-form-invalid-feedback id="input-live-feedback">
              Error
            </b-form-invalid-feedback>

            <label for="input-live">Alto</label>
            <b-form-input
              @keyup="validarEspacioDisponible"
              v-model="formulario.alto"
              id="input-live"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Alto"
              trim
            ></b-form-input>

            <!-- This will only be shown if the preceding input has an invalid state -->
            <b-form-invalid-feedback id="input-live-feedback">
              Error
            </b-form-invalid-feedback>

            <label for="input-live">Ancho</label>
            <b-form-input
              @keyup="validarEspacioDisponible"
              v-model="formulario.ancho"
              id="input-live"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Ancho"
              trim
            ></b-form-input>

            <!-- This will only be shown if the preceding input has an invalid state -->
            <b-form-invalid-feedback id="input-live-feedback">
              Error
            </b-form-invalid-feedback>

            <label for="input-live">Herramienta</label>
            <b-form-select v-model="formulario.herramienta" :options="optionesHerramienta"></b-form-select>

            <label for="input-live">Cantidad de pasadas</label>
            <b-form-select v-model="formulario.cantPasadas" :options="optionesCatPasadas"></b-form-select>

          </div>
          <br>
          <b-button @click="crearCuadro()" block>Crear</b-button>
        </div>
      </b-modal>
        <div v-if="isCalcoDouble" class="calco-title calco-selector">
          <select v-model="calcoSide" @change="onCaraChange()">
            <option v-bind:value="'front'">Cara Anterior</option>
            <option v-bind:value="'back'">Cara Posterior</option>
          </select>
        </div>
        <div v-if="!isCalcoDouble" class="calco-title">Cara Unica</div>
        <div class="canvas-tools">
          <b-button-group size="sm" class="tools-group">
            <b-button @click="loadLastCanvasSnapshot()">Deshacer</b-button>
            <b-button @click="selectTool('cuadrado')" :pressed="currentTool === 'cuadrado'"><b-icon icon="app" variant="success"></b-icon></b-button>
            <b-button @click="selectTool('line')" :pressed="currentTool === 'line'">Linea</b-button>
            <b-button @click="selectTool('text')" :pressed="currentTool === 'text'">Texto</b-button>
            <b-button @click="toggleGrid()" :pressed="gridEnabled">Grilla</b-button>
          </b-button-group>
          <b-button @click="openSavePanel()" variant="link" class="save-load-btn">Guardar Imagen</b-button>
          <b-button @click="openLoadPanel()" variant="link" class="save-load-btn">Cargar Imagen</b-button>
        </div>
        <div class="load-panel" v-if="loading">
          <div class="load-panel-container">
            <vue-simple-spinner v-if="loadingDrawings" message="Cargando..." size="42"></vue-simple-spinner>
            <h5 v-if="!loadingDrawings">Cargar Dibujo</h5>
            <div v-if="!loadingDrawings" class="load-panel-content">
              <div class="drawing-options">                  
                  <div v-for="(drawing, index) in savedDrawings" :key="index" class="option-wrapper" :title="drawing.name">
                    <input type="radio" v-model="selectedDrawing" :name="index" :id="index" :value="index">
                    <label :for="index">{{drawing.name}}</label>
                  </div>
              </div>              
              <div class="img-preview">
                <img v-if="selectedDrawing !== undefined" :src="getSavedDrawingContent()">
                <span v-if="selectedDrawing === undefined">Selecciona un dibujo para previsualizar</span>
              </div>
            </div>
            <div v-if="!loadingDrawings" class="save-buttons">
              <b-button size="sm" variant="outline-danger" @click="cancelLoad()">Cancelar</b-button>
              <b-button size="sm" variant="primary" @click="loadFromDatabase()" :disabled="selectedDrawing === undefined">Cargar imagen</b-button>
            </div>
          </div>
        </div>        
        <div class="save-panel" v-if="saving">
          <div class="save-panel-container">
            <h5>Guardar Dibujo</h5>
            <div class="save-panel-content">
              <label for="save-name">Nombre Dibujo</label>
              <input id="save-name" name="save-name" class="form-input" v-model="saveName" type="text" style="border: 1px solid #0000007d">
            </div>
            <div class="save-buttons">
              <b-button size="sm" variant="outline-danger" @click="cancelSave()">Cancelar</b-button>
              <b-button size="sm" variant="primary" @click="saveToDatabase()">Guardar imagen</b-button>
            </div>
          </div>
        </div>
        <div class="canvas-container">
        <div class="canvas-overlay" v-if="saving || loading"></div>
          <div style="float: left; left: 100px; position: relative; font-size: 16pt; margin-top: -3px;">{{showLado(true)}}</div>
          <div style="float: right; right: 55px; position: relative; font-size: 16pt; margin-top: -3px;">{{showLado(false)}}</div>
          <div class="measure">{{medidaSuperior(calco)}}mm ({{superiorInfo(calco)}})</div>
          <div class="canvas-left-right-measures">
            <div class="measure">
              <div style="font-size: 12px;">({{derechoInfo(calco)}})</div>
              <div>{{medidaIzquierda(calco)}}mm</div>
            </div>
            <div class="canvas-wrapper">
              <canvas ref="drawing-canvas" class="mlplak-canvas canvas" width="600" height="400">
                  Este navegador no soporta esta función. Considere actualizar el navegador o utilizar otro.
              </canvas>
              <canvas ref="grid-canvas" class="mlplak-canvas grid-canvas" :class="{ visible: gridEnabled }" width="600" height="400">
              </canvas>            
            </div>              
            <div class="measure">
              <div style="font-size: 12px;">({{izquierdoInfo(calco)}})</div>
              <div>{{medidaDerecha(calco)}}mm</div>
            </div>
          </div>
          <div class="measure">
            <div>{{medidaInferior(calco)}}mm ({{inferiorInfo(calco)}})</div>
          </div>
          <table v-if="conexioneshistorialComp.length > 0">
            <tr>
              <th>X</th>
              <th>Y</th>
              <th>Ancho</th>
              <th>Alto</th>
              <th>Cant. Pasadas</th>
              <th>Herramientas</th>
            </tr>
            <tr v-for="item in conexioneshistorialComp">
              <td>{{item.x}}</td>
              <td>{{item.y}}</td>
              <td>{{item.ancho}}</td>
              <td>{{item.alto}}</td>
              <td>{{item.cantPasadas}}</td>
              <td>{{item.herramienta}}</td>
            </tr>
        </table>
        </div>

      <div class="delete-save-options">
        <b-button size="sm" v-if="showDeleteButton()" variant="outline-danger" @click="deleteDrawing()">Eliminar de calcomania</b-button>
        <b-button size="sm" variant="primary" @click="saveDrawing()">Guardar en calcomania</b-button>
      </div>


      <!-- modal herramienta Texto -->
      <div style="visibility: hidden" ref="text-container" class="insert-text-input">
        <input id="text" v-on:keyup="onTextKeyUp" v-model="text" ref="text-input">
        <input type="number" v-model="textSize" class="text-size-input">
        <button class="btn btn-sm" @click="acceptText">Aceptar</button>
      </div>

    </div>
</template>

<script>
import { HTTP } from '@/plugins/HTTP.js'
import CalcoDouble from '@/components/DesignDashboard/Tools/CalcoDouble'
import calcosDetalles from '@/components/calcosDetalles.mixin.js'
import Vue from 'vue'

export default {
  props: [ 'calco', 'property' , "calcoSideProps"],
  mixins: [calcosDetalles],
  data () {
    return {
      formulario:{
        id:null,
        x:null,
        y:null,
        alto:null,
        ancho:null,
        herramienta:"FRESA 6MM",
        cantPasadas:4
      },
      piezaRealCanvas:{
        x:0,
        y:0,
        alto:0,
        ancho:0,
      },
      herramientas:[],
      optionesHerramienta:[],
      currentTool: '',
      currentToolData: undefined,
      lastClick: undefined,
      canvasHistory: [],
      conexioneshistorial: [],
      text: '',
      gridEnabled: false,
      baseSketchType: undefined,
      calcoSide: 'front',
      textSize: 22,
      saving: false,
      loading: false,
      loadingDrawings: true,
      saveName: undefined,
      savedDrawings: [],
      selectedDrawing: undefined
    }
  },
  mounted () {

    if(typeof this.calcoSideProps !== "undefined"){
      this.calcoSide = `${this.calcoSideProps}`;
    }
    
    if (!this.calco) {
      return
    }
    this.init()
    this.logger('calco', this.calco)
    this.getConexionesConfig();
  },
  methods: {
    showLado(lado){
      if(this.calcoSide == "front"){
        return lado ? "Fo":"Fre";
      }else{
        return lado ? "Fre":"Fo";
      }
    },
    getConexionesConfig() {
      this.herramientas.length = 0;
      HTTP.get("/api/configuracion/tipo/ConexionesConfig/all")
        .then(({ data }) => {
          if (!data.error && data.configuraciones) {
            data.configuraciones.forEach((config) => {
              const object = this.buildFromJson(config.values);
              object.id = config.id;

              if (object.tipo === "herramienta") {
                this.herramientas.push(object);
              }
            });
          }
          this.optionesHerramienta = [
            { text: "", value: null },
            ...this.herramientas.map((h) => h.nombre),
          ];
        })
        .catch((result) => {
          this.$noty.error(
            "¡Error al cargar la configuracion de las conexiones!"
          );
        });
    },
    buildFromJson(values) {
      const obj = {};
      values.forEach((value) => {
        obj[value.name] = value.value;
      });
      return obj;
    },
    getSavedDrawingContent (drawing) {
      console.log('drawing', drawing)
      return this.savedDrawings[this.selectedDrawing].values.find(val => val.name === 'content').value
    },
    validarEspacioDisponible(){

      // console.log(this.formulario, this.piezaRealCanvas);
      // console.log(this.formulario);
      console.log(this.formulario, this.piezaRealCanvas, this.medidaSuperior(this.calco), this.medidaIzquierda(this.calco));
      var x = (this.formulario.x/this.medidaSuperior(this.calco))*this.piezaRealCanvas.x;
      var y = (this.formulario.y/this.medidaIzquierda(this.calco))*this.piezaRealCanvas.y;
      var ancho = (this.formulario.ancho/this.medidaIzquierda(this.calco))*this.piezaRealCanvas.ancho;
      var alto = (this.formulario.alto/this.medidaSuperior(this.calco))*this.piezaRealCanvas.alto;
      
      var totalAncho = (Number(this.piezaRealCanvas.x)+this.piezaRealCanvas.ancho)-this.piezaRealCanvas.x;
      var totalAnchoNew = (Number(x)+Number(ancho));

      var totalAlto = (Number(this.piezaRealCanvas.y)+this.piezaRealCanvas.alto);
      
      var anchoTotalDibujoReal = Number(this.piezaRealCanvas.y)+this.piezaRealCanvas.alto;
      var ejeY = anchoTotalDibujoReal-(Number(y));

      var totalAltoNew = (ejeY+Number(alto));

      if(x > 0){
        if((totalAnchoNew > totalAncho) && ancho > 0){
          this.formulario.x = x-(totalAnchoNew-totalAncho);
        }else if(totalAnchoNew > totalAncho){
          // this.formulario.x = `${this.formulario.x}`.slice(0, -1);
          this.formulario.x = this.medidaSuperior(this.calco);
        }
      }else{
        this.formulario.x = 0;
      }
    
      // console.log(totalAltoNew, totalAlto);
      // // return true;
      // if(this.formulario.y >= 0){
      //   if((totalAltoNew > totalAlto) && this.formulario.alto > 0){
      //     this.formulario.y = Number(this.formulario.y)+Number(this.formulario.alto);
      //   }else if(totalAltoNew < 0){
      //     // this.formulario.x = `${this.formulario.x}`.slice(0, -1);
      //     this.formulario.y = totalAlto;
      //   }
      // }else{
      //   this.formulario.y = 0;
      // }
      
    },
    openSavePanel () {
      this.saving = true
    },
    openLoadPanel () {
      this.loading = true
      this.loadingDrawings = true
      HTTP.get('/api/configuracion/tipo/Dibujo/all').then(result => {
        console.log('dibujos', result)
        if (result && result.data) {
          this.savedDrawings = result.data.configuraciones
        }
      }).catch(result => {
        this.$noty.error('¡Error al cargar datos!')
        this.cancelLoad()
      }).finally(() => {
        this.loadingDrawings = false
      })
    },
    cancelLoad () {
      this.loading = false
    },
    cancelSave () {
      this.saving = false
    },
    saveToDatabase () {
      const drawing = {
        name: this.saveName,
        type: 'Dibujo',
        values: [
          { name: 'content', value: this.canvas.toDataURL() },
          { name: 'created_at', value: new Date() }
        ]
      }
      HTTP.post('/api/configuracion', drawing).then(result => {
        if (result.data.success) {
          this.$noty.success('¡Datos guardados correctamente!')
          this.saveName = undefined
          this.saving = false
        }
      }).catch(result => {
        this.$noty.error('¡Error al guardar los datos!')
      })
    },
    loadFromDatabase () {
      const selected = this.savedDrawings[this.selectedDrawing]
      const content = selected.values.find(val => val.name === 'content')
      this.resetCanvas()
      this.loadBase64Image(content.value)
      this.cancelLoad()
    },
    init () {
      // asigno eventos al canvas
      this.canvas.addEventListener('mousedown', (e) => {
        this.saveCursorPosition(e)
        this.userClicked()
      })

      this.drawGrid()
      const value = localStorage.getItem('grid-enabled')
      this.gridEnabled = value && +value === 1

      if (this.property && this.calco.separator[this.property].drawing) {
        this.baseSketch();
        this.loadCurrentCaraImage()
      } else if ((this.calco && this.calco.separator && this.calco.separator.drawing) && ((this.calco.separator.drawing.front || this.calco.separator.drawing.back))) {
        // la calco ya tiene dibujo, solo debo cargarlo
        this.baseSketch();
        this.loadCurrentCaraImage()
      } else {
        // dibujo la pieza
        this.drawBaseSketch()
      }
    },
    onCaraChange () {
      this.loadCurrentCaraImage()
    },
    loadCurrentCaraImage () {
      this.conexioneshistorial = [];
      this.resetCanvas()
      const drawing = this.property ? this.calco.separator[this.property] && this.calco.separator[this.property].drawing : this.calco.separator.drawing
      const conexionesDrawing = this.property ? this.calco.separator[this.property] && this.calco.separator[this.property].conexionesDrawing : this.calco.separator.conexionesDrawing
      if (this.calcoSide === 'front' && drawing && drawing.front) {
        this.loadBase64Image(drawing.front)
        if (this.calcoSide === 'front' && conexionesDrawing && conexionesDrawing.front) {
          console.log(conexionesDrawing.front);
          this.conexioneshistorial = conexionesDrawing.front;
        }
        return
      }
      

      if (this.calcoSide === 'back' && conexionesDrawing && conexionesDrawing.back) {
        this.conexioneshistorial = conexionesDrawing.back;
        if (this.calcoSide === 'back' && drawing && drawing.back) {
          this.loadBase64Image(drawing.back)
        }
        return
      }
      this.drawBaseSketch()
    },
    toggleGrid () {
      this.gridEnabled = !this.gridEnabled
      localStorage.setItem('grid-enabled', this.gridEnabled ? 1 : 0)
    },
    loadBase64Image (imgSrc) {
      // cargo la imagen de una calco
      let image = new Image()
      let that = this
      image.onload = function () {
        that.canvasContext.drawImage(image, 0, 0)
      }
      image.src = imgSrc
    },
    userClicked () {
      if (this.currentTool === 'line') {
        this.drawLine()
      }
      if (this.currentTool === 'text') {
        this.insertText()
      }
    },
    insertText () {
      const input = this.$refs['text-container']
      const canvasPos = this.canvas.getBoundingClientRect()
      input.style = `visibility:visible; top: ${canvasPos.y - 137 + this.lastClick.y - 15}px; right:${canvasPos.x + 230 - this.lastClick.x}px`
      this.setFocus('text-input')
    },
    setFocus (ref) {
      let that = this
      setTimeout(function () {
        that.$refs[ref].focus()
      }, 0)
    },
    acceptText () {
      if (this.text) {
        // guardo una imagen actual del canvas para poder deshacer el texto
        this.createCanvasSnapshot()
        this.canvasContext.fillStyle = 'black'
        this.canvasContext.font = this.textSize + 'px Arial'
        this.canvasContext.fillText(this.text, this.lastClick.x, this.lastClick.y)
        this.text = ''
      }
      const input = this.$refs['text-container']
      input.style = 'visibility:hidden'
    },
    onTextKeyUp (e) {
      if (e.keyCode === 13) {
        this.acceptText()
      }
    },
    resetCanvas () {
      // vacio el canvas
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.conexioneshistorial = [];
    },
    drawBaseSketch () {
      // dibujo la forma basica de la pieza
      this.canvasContext.strokeStyle = 'black'
      this.canvasContext.beginPath()

      if (this.medidaSuperior(this.calco) < this.medidaIzquierda(this.calco)) {
        // rectangulo vertical
        this.baseSketch();
        this.canvasContext.rect(this.piezaRealCanvas.x, this.piezaRealCanvas.y, this.piezaRealCanvas.ancho, this.piezaRealCanvas.alto)
        this.baseSketchType = 'rectangulo-vertical'
        this.logger('rectangulo vertical')
      } else if (this.medidaSuperior(this.calco) === this.medidaIzquierda(this.calco)) {
        // cuadrado
        this.baseSketch();
        this.canvasContext.rect(this.piezaRealCanvas.x, this.piezaRealCanvas.y, this.piezaRealCanvas.ancho, this.piezaRealCanvas.alto)
        this.baseSketchType = 'cuadrado'
        this.logger('cuadrado')
      } else {
        // rectangulo horizontal
        this.baseSketch();
        this.canvasContext.rect(this.piezaRealCanvas.x, this.piezaRealCanvas.y, this.piezaRealCanvas.ancho, this.piezaRealCanvas.alto)
        this.baseSketchType = 'rectangulo-horizontal'
        this.logger('rectangulo horizontal')
      }
      this.canvasContext.stroke()
    },
    baseSketch () {
      if (this.medidaSuperior(this.calco) < this.medidaIzquierda(this.calco)) {
        // rectangulo vertical
        this.piezaRealCanvas = {x:160, y:35, ancho:270, alto:325};
      } else if (this.medidaSuperior(this.calco) === this.medidaIzquierda(this.calco)) {
        this.piezaRealCanvas = {x:150, y:60, ancho:270, alto:325};
      } else {
        // rectangulo horizontal
        this.piezaRealCanvas = {x:100, y:60, ancho:400, alto:290};
      }
    },
    drawLine () {
      if (!this.currentToolData) {
        // guardo una imagen actual del canvas para poder deshacer la linea
        this.createCanvasSnapshot()
        // primer click con la herramienta linea
        this.currentToolData = {}
        this.currentToolData.initialPoint = this.lastClick
        // guardo el estado del canvas para poder borrar el punto inicial
        this.currentToolData.savedCanvas = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height)
        this.canvasContext.fillStyle = 'red'
        this.canvasContext.fillRect(this.lastClick.x - 2, this.lastClick.y - 2, 4, 4)
      } else {
        // segundo click
        const initialPoint = this.currentToolData.initialPoint

        // borro el punto inicial
        this.canvasContext.putImageData(this.currentToolData.savedCanvas, 0, 0)

        // dibujo la linea
        this.canvasContext.beginPath()
        this.canvasContext.fillStyle = 'black'
        this.canvasContext.moveTo(initialPoint.x, initialPoint.y)
        this.canvasContext.lineTo(this.lastClick.x, this.lastClick.y)
        this.canvasContext.stroke()

        // borro la informacion actual
        this.currentToolData = undefined
      }
    },
    drawGrid () {
      this.logger('Dibujando grilla...')
      let bw = this.canvas.width
      let bh = this.canvas.height
      let gridSize = 4

      let context = this.gridCanvasContext
      for (let x = 0; x <= bw; x += gridSize) {
        context.moveTo(0.5 + x, 0)
        context.lineTo(0.5 + x, bh)
      }

      for (let x = 0; x <= bh; x += gridSize) {
        context.moveTo(0, 0.5 + x)
        context.lineTo(bw, 0.5 + x)
      }
      context.strokeStyle = '#ccc'
      context.stroke()
    },
    loadLastCanvasSnapshot () {
      if (this.canvasHistory.length > 0) {
        this.canvasContext.putImageData(this.canvasHistory.pop(), 0, 0)
      }
      if (this.conexioneshistorial.length > 0) {
        this.conexioneshistorial.pop();
      }
    },
    createCanvasSnapshot () {
      this.canvasHistory.push(this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height))
      const form = $.extend({}, this.formulario);
      if(this.formulario.id){
        this.conexioneshistorial.push(form);
      }
      this.formulario.id = null;
    },
    crearCuadro(){
      this.formulario.id = this.uuidv4();
      var x = (this.formulario.x/this.medidaSuperior(this.calco))*this.piezaRealCanvas.ancho;
      var y = (this.formulario.y/this.medidaIzquierda(this.calco))*this.piezaRealCanvas.alto;
      var ancho = (this.formulario.ancho/this.medidaSuperior(this.calco))*this.piezaRealCanvas.ancho;
      var alto = (this.formulario.alto/this.medidaIzquierda(this.calco))*this.piezaRealCanvas.alto;

      console.log({x:x, y:y, alto:alto, ancho:ancho});

      var anchoTotalDibujoReal = Number(this.piezaRealCanvas.y)+this.piezaRealCanvas.alto;
      var ejeY = anchoTotalDibujoReal-(Number(y))-Number(alto);
      console.log(ejeY);
      var ejeX = Number(x)+this.piezaRealCanvas.x;

      this.$refs.formDibujoModal.hide();
      this.createCanvasSnapshot();
      this.currentToolData = {};
      
      // this.currentToolData.initialPoint = this.lastClick
      // this.currentToolData.savedCanvas = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
      // this.canvasContext.beginPath();
      // this.canvasContext.fillStyle = "#FFBD16";
      // console.log(this.formulario.x+160, this.formulario.y+35, this.formulario.alto, this.formulario.ancho);

      var totalAlto = (Number(this.piezaRealCanvas.y)+this.piezaRealCanvas.alto);
      
      var totalAltoNew = (ejeY+Number(alto));
      if(y >= 0){
        if((totalAltoNew > totalAlto) && alto > 0){
          // this.formulario.y = Number(this.formulario.y)+Number(this.formulario.alto);
        }else if(totalAltoNew < 0){
        }
      }
      
      this.canvasContext.strokeRect(ejeX, ejeY, ancho, alto);
      // this.canvasContext.putImageData(this.currentToolData.savedCanvas, 0, 0);
      this.currentToolData = undefined;
      
    },
    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    selectTool (tool) {
      if (tool === this.currentTool) {
        this.currentTool = undefined
        this.acceptText()
        return
      }

      if(tool == "cuadrado"){
        // let bw = this.canvas.width
        // let bh = this.canvas.height
        // let gridSize = 4

        // let context = this.gridCanvasContext
        // for (let x = 0; x <= bw; x += gridSize) {
        //   context.moveTo(0.5 + x, 0)
        //   context.lineTo(0.5 + x, bh)
        // }

        // for (let x = 0; x <= bh; x += gridSize) {
        //   context.moveTo(0, 0.5 + x)
        //   context.lineTo(bw, 0.5 + x)
        // }
        // context.strokeStyle = '#ccc'
        // context.stroke()
        this.$refs.formDibujoModal.show();
        // this.$refs.form_dibujo.style.display = "";

      }
      
      this.currentTool = tool
      this.logger('Selected tool:', tool)
    },
    deleteDrawing () {
      this.$store.commit('deleteDrawing', { id: this.calco.separator.id || this.calco.separator._Id, side: this.calcoSide, name: this.calco.separator.Name, conexionesDrawing: this.conexioneshistorialComp, property: this.property })
      this.resetCanvas()
      this.drawBaseSketch()
    },
    saveDrawing () {
      // clono el canvas para guardarme una version mas chica de lo que se dibujo
      const canvas2 = document.createElement('canvas')
      const canvas2Context = canvas2.getContext('2d')
      canvas2.width = this.canvas.width
      canvas2.height = this.canvas.height
      canvas2Context.drawImage(this.canvas, 0, 0)
      canvas2Context.scale(0.5, 0.5)
      this.$store.commit('saveDrawing', { id: this.calco.separator.id || this.calco.separator._Id, drawing: canvas2.toDataURL(), conexionesDrawing: this.conexioneshistorialComp, side: this.calcoSide, name: this.calco.separator.Name, property: this.property })
    },
    showDeleteButton () {
      if (!this.calco || !this.calco.separator) {
        return false
      }

      if (this.property) {
        return !!(this.calco.separator[this.property] && this.calco.separator[this.property].drawing && this.calco.separator[this.property].drawing[this.calcoSide])
      }

      if (this.calco.separator.drawing) {
        return !!this.calco.separator.drawing[this.calcoSide]
      }
      return false
    },
    logger (msg, obj) {
      if (this.staging) {
        console.log('*** MLPlak Canvas: ' + msg, obj || '')
      }
    },
    saveCursorPosition (event) {
      const rect = this.canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      this.logger('Mouse position:', {x, y})
      this.lastClick = {x, y}
    }
  },
  computed: {
    conexioneshistorialComp:{
      get(){
        return this.conexioneshistorial.filter(a=>a.id);
      },
      set(valor){
        this.conexioneshistorial = valor;
      }
    },
    optionesHerramienta222(){
      return [
        { value: null, text: 'Please select an option' },
        { value: 'a', text: 'This is First option' },
        { value: 'b', text: 'Selected Option' },
        { value: { C: '3PO' }, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
      ];
    },
    optionesCatPasadas(){
      var cantPasadas = [];
      for (let index = 1; index <= 10; index++) {
        cantPasadas.push({ value: index, text: `${index}`});
      }
      return cantPasadas;
    },
    isCalcoDouble () {
      const separator = this.calco.separator
      return (separator && ((separator.conexionesBefore && separator.conexionesBefore.length > 0) || (separator.conexionesAfter && separator.conexionesAfter.length > 0)))
    },
    gridCanvas () {
      return this.$refs['grid-canvas']
    },
    gridCanvasContext () {
      return this.gridCanvas.getContext('2d')
    },
    canvas () {
      return this.$refs['drawing-canvas']
    },
    canvasContext () {
      return this.canvas.getContext('2d')
    },
    staging () {
      return process.env.NODE_ENV === 'development-stage'
    }
  }
  
}
</script>
<style lang="scss" scoped>
  .canvas {
    border:1px solid #d3d3d3;
  }
  .canvas-tools {
    padding: 10px 0px;
  }
  .insert-text-input {
    position: absolute;
    z-index: 10;
  }
  #text {
    background: white;
  }
  .canvas-left-right-measures {
    display: flex;
    align-items: center;
  }
  .delete-save-options {
    margin-top: 10px;
  }
  .measure {
    margin: 0px 5px;
  }
  .canvas-container, .canvas-wrapper {
    margin: 0 auto;
  }
  .drawing-canvas {
    display: flex;
    flex-direction: column;
  }
  .canvas-wrapper {
    position: relative;
    width: 600px;
    height: 400px;
  }
  .mlplak-canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
  .grid-canvas {
    z-index: 0;
    visibility: hidden;
  }
  .grid-canvas.visible {
    visibility: visible;
  }
  .canvas {
    z-index: 1;
  }
  .calco-title {
    width: 300px;
    text-align: left;
    font-size: 16px;
  }
  .text-size-input {
    width: 40px;
    opacity: 0.5;

    &:hover, &:focus {
      opacity: 1;
    }
  }
  .hidden {
    display: none;
  }
  .save-load-btn {
    font-size: 12px;
  }
  .tools-group {
    margin-right: 10px;
  }
  .save-buttons button {
    font-size: 12px;
  }
  .save-panel, .load-panel {
    position: absolute;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    left: 0;
    top: 120px;
    z-index: 100;
  }
  .save-panel-container, .load-panel-container {
    width: 450px;
    background: white;
    display: block;
    margin: 0 auto;
    padding: 20px;
  }
  .save-panel-content, .load-panel-content {
    margin: 50px;
  }
  .load-panel-content {
    display: flex;
  }
  .drawing-options {
    text-align: left;
    flex: 1;
    max-height: 210px;
    overflow-y: auto;
  }
  .option-wrapper {
    display: flex;

    input {
      margin-right: 2px;
    }
    label {
      max-width: 110px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      bottom: 3px;
      font-size: 15px;
      cursor: pointer;
    }
  }
  .canvas-overlay {
    height: 540px;
    width: 710px;
    background: #4a4a4a;
    display: block;
    position: absolute;
    z-index: 90;
    opacity: 0.5;
    top: 70px;
  }
  .save-buttons {
    text-align: right;
  }
  .img-preview, .img-preview img {
    height: 200px;
    width: 200px;
    min-height: 200px;
    min-width: 200px;
  }
  .img-preview {
    display: flex;
    align-items: center;
  }
  table, td, th {
    border: 1px solid black;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
</style>