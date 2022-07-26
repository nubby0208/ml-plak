<template>
  <div class="whole2DModule" ref="contenedorGeneralCAD" v-on:keydown="mostrarInformacionTecla" v-on:keyup.enter="DesignEventHandler()">
    <componenteMenuContextual ref="menuContextualCompoCAD" :opciones="opcionesMenuContextual" />
    <b-modal ref="formDibujoModal" size="lg" hide-footer title="">
      <div ref="form_dibujo">
        <div role="group">
          <label for="input-live">Eje X:</label>
          <b-form-input
            @click="selectTodo($event)"
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
            @click="selectTodo($event)"
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
            @click="selectTodo($event)"
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
            @click="selectTodo($event)"
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

        </div>
        <br>
        <b-button @click="crearCuadro()" block>Crear</b-button>
      </div>
    </b-modal>

    <b-modal ref="formDibujoCirculoModal" size="lg" hide-footer title="">
      <div ref="form_dibujo">
        <div role="group">
          <label for="input-live">Eje X:</label>
          <b-form-input
            @click="selectTodo($event)"
            @keyup="validarEspacioDisponible"
            v-model="formularioCirculo.x"
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
            @click="selectTodo($event)"
            @keyup="validarEspacioDisponible"
            v-model="formularioCirculo.y"
            id="input-live"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Eje Y"
            trim
          ></b-form-input>

          <!-- This will only be shown if the preceding input has an invalid state -->
          <b-form-invalid-feedback id="input-live-feedback">
            Error
          </b-form-invalid-feedback>

          <label for="input-live">Radio</label>
          <b-form-input
            @click="selectTodo($event)"
            @keyup="validarEspacioDisponible"
            v-model="formularioCirculo.radio"
            id="input-live"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Radio"
            trim
          ></b-form-input>

          <!-- This will only be shown if the preceding input has an invalid state -->
          <b-form-invalid-feedback id="input-live-feedback">
            Error
          </b-form-invalid-feedback>

        </div>
        <br>
        <b-button @click="crearCirculo()" block>Crear</b-button>
      </div>
    </b-modal>

    <b-modal ref="formDibujoLineaModal" size="lg" hide-footer title="">
      <div ref="form_dibujo">
        <div role="group">
          <label for="input-live">Eje X:</label>
          <b-form-input
            @click="selectTodo($event)"
            @keyup="validarEspacioDisponible"
            v-model="formularioLinea.x"
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
            @click="selectTodo($event)"
            @keyup="validarEspacioDisponible"
            v-model="formularioLinea.y"
            id="input-live"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Eje Y"
            trim
          ></b-form-input>

          <!-- This will only be shown if the preceding input has an invalid state -->
          <b-form-invalid-feedback id="input-live-feedback">
            Error
          </b-form-invalid-feedback>

          <label for="input-live">Angulo</label>
          <b-form-input
            @click="selectTodo($event)"
            @keyup="validarEspacioDisponible"
            v-model="formularioLinea.angulo"
            id="input-live"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Angulo"
            trim
          ></b-form-input>

          <!-- This will only be shown if the preceding input has an invalid state -->
          <b-form-invalid-feedback id="input-live-feedback">
            Error
          </b-form-invalid-feedback>
          
          <label for="input-live">Tamaño</label>
          <b-form-input
            @click="selectTodo($event)"
            @keyup="validarEspacioDisponible"
            v-model="formularioLinea.size"
            id="input-live"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Tamaño"
            trim
          ></b-form-input>

          <!-- This will only be shown if the preceding input has an invalid state -->
          <b-form-invalid-feedback id="input-live-feedback">
            Error
          </b-form-invalid-feedback>

        </div>
        <br>
        <b-button @click="crearLinea()" block>Crear</b-button>
      </div>
    </b-modal>
    
    <!-- canvas single -->
    <div class="btn-container">
      <div class="principalOptionsContainer">
        <button v-b-tooltip.hover.right title="Crear Nuevo Grupo de Lineas" class="btn btn-danger btn-block" v-on:click.prevent="CreateGroup">
          <b-icon icon="plus-square" font-scale="1.5" ></b-icon>
        </button>
        <button v-if="Dibujo.grupos.length > 0" v-b-tooltip.hover.right title="Opciones de linea" type="button" class="form-control btn-block"  v-on:click="SetTab('LineMenu')" :class="SelectedOption === 'LineMenu' ? 'active' : ''">
          <b-icon-arrow-down-up font-scale="1.5" ></b-icon-arrow-down-up>
        </button>
        <button v-if="Dibujo.grupos.length > 0" v-b-tooltip.hover.right title="Plasmar Linea" class="form-control btn-block " :class="SelectedOption === 'DesignTool' ? 'active' : ''" @click.prevent="SetTab('DesignTool')">
          <b-icon icon="pencil-square" font-scale="1.5" ></b-icon>
        </button>
        <button v-if="Dibujo.grupos.length > 0" v-b-tooltip.hover.right title="Crear Rectangulo" class="form-control btn-block " :class="SelectedOption === 'SquareTool' ? 'active' : ''" v-on:click.prevent="SetTab('SquareTool')" >
          <b-icon-square font-scale="1.5" ></b-icon-square>
        </button>
        <button v-if="Dibujo.grupos.length > 0" v-b-tooltip.hover.right title="Crear Circulo" class="form-control btn-block " :class="SelectedOption === 'CircleTool' ? 'active' : ''" v-on:click.prevent="SetTab('CircleTool')" >
          <b-icon-circle font-scale="1.5" ></b-icon-circle>
        </button>
        <button v-b-tooltip.hover.right title="Nuevo Texto" class="form-control btn-block" :class="SelectedOption === 'TextTool' ? 'active' : ''" v-on:click.prevent="SetTab('TextTool')" v-if="Dibujo.grupos.length > 0">
          <b-icon icon="textarea-t" font-scale="1.5" ></b-icon>
        </button>
        <input v-if="Dibujo.grupos.length > 0" class="form-control w-input inputTxt" type="text"  v-model="length" >
      </div>
      <div v-if="Dibujo.grupos.length > 0">
        <b-dropdown id="dropdown-1" text="Crear figura">
          <b-dropdown-item @click="selectCuadroP">Cuadro</b-dropdown-item>
          <b-dropdown-item @click="selectCirculoP">Círculo</b-dropdown-item>
          <b-dropdown-item @click="selectLineaP">Linea</b-dropdown-item>
        </b-dropdown>
      </div>
      <div v-if="Dibujo.grupos.length > 0" class="MiddleOptionsContainer">
        <div class="CoordsContainer">
          <div class="CoorsSubCont">
            <button class="form-control btn-block">X</button>
            <input class="form-control w-input inputTxt" type="text" name ="CurrentPointX" v-model="Dibujo.CurrentPointX">
          </div>
          <div class="CoorsSubCont">
            <button class="form-control btn-block">Y</button>
            <input class="form-control w-input inputTxt" type="text" name ="CurrentPointY" v-model="Dibujo.CurrentPointY">
          </div>
        </div>
        <button v-b-tooltip.hover.right title="Union Auto de Lineas" class="form-control btn-block active" id="UnionStatusButton" v-on:click="ChangeUnionStatus()">
          <b-icon icon="bounding-box-circles" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Mostrar ejes de coordenadas" class="form-control btn-block active" id="CoordinatesVisibility" v-on:click="CoordinatesVisibility()">
          <b-icon icon="eye-slash" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Fijar/Liberar Angulos" class="form-control btn-block active" id="AngleUnionStatusButton" v-on:click="ChangeAngleFixationStatus()">
          <b-icon icon="arrows-move" font-scale="1.5" ></b-icon>
        </button>
        <input class="form-control w-input inputTxt" type="text" id="lengthInput" placeholder="Length:" ref="length" 
          v-model="Dibujo.LengthSetter" 
          v-if="SelectedOption === 'DesignTool'">
        <input class="form-control w-input inputTxt" type="text" id="HeigthInput" placeholder="Heigth:" ref="Heigth" 
          v-model="Dibujo.Heigth" 
          v-if="SelectedOption =='SquareTool'">
        <input class="form-control w-input inputTxt" type="text" id="WidthInput" placeholder="Width:" ref="Width" 
          v-model="Dibujo.Width" 
          v-if="SelectedOption === 'SquareTool'">
        <input class="form-control w-input inputTxt" type="text" id="RadioInput" placeholder="Radio:" ref="Radio" 
          v-model="Dibujo.Radio" 
          v-if="SelectedOption === 'CircleTool'">
      </div> 
      <div v-if="Dibujo.grupos.length > 0" class="ProjectGestorContainer">
        <button v-b-tooltip.hover.right title="Descargar pdf" class="form-control btn-block" v-on:click="DownloadProyectPDF()">
          <b-icon icon="download" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Exportar al Servidor" class="form-control btn-block" v-on:click="ExportJPEGToServer()">
          <b-icon icon="cloud-download" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Reiniciar Dibujo" class="btn btn-block btn-danger" @click.prevent="reset">
            <b-icon icon="trash"></b-icon>
        </button>
      </div>
    </div>
    <linea-menu class="LineMenu"
      v-if="SelectedOption === 'LineMenu'"
      @SetMoveLineAssistant="SetMoveLineAssistant(...arguments)"
      @CreateGuide="CreateGuide(...arguments)"
      @CloneLine="CloneLine(...arguments)"
      @EraseLine="EraseSelectedLine()"
      @ChangeColorSelectedLine="ChangeColorSelectedLine(...arguments)"
      @InsertFisrtLineSelectedIndexInReference="InsertFisrtLineSelectedIndexInReference()"
      @EmptyReferences="EmptyReferences()"
      @InterpolatePaths="InterpolatePaths(...arguments)"
      @HideSelection="HideSelection()"
      @ShowNotVisibleItems="ShowNotVisibleItems()"
      @ChangeFontSizeOnGroup="ChangeFontSizeOnGroup(...arguments)"
    />
    <div class="CanvasAndGroupsContainer">
      <div class="GroupContainer">
        <Group  v-for="(grupo, index) in Dibujo.grupos" 
          :key="index" 
          :grupo="grupo" 
          @updateGroup="UpdateGroup(index, ...arguments)"
          @setSelectedGroup="setSelectedGroup(index)"
          @HideOrShowGroup="HideOrShowGroup(index, ...arguments)"
          @EraseGroup="EraseGroup(index)"
        />
      </div>
      <Canvas :canvas-id="'canvas-one'" ref="childCanvas" :Dibujo="Dibujo" :SelectedOption="SelectedOption"
        @hover="crearCuadro"
        @saveJSON="saveJSON()"
        @InsertLineOnArray="InsertLineOnArray(...arguments)"
        @InsertSquareOnArray="InsertSquareOnArray(...arguments)"
        @InsertTextArrayOnArray="InsertTextOnArray(...arguments)"
        @InsertCircleOnArray="InsertCircleOnArray(...arguments)"
        @UpdateLength="UpdateLegthValue(...arguments)"
        @InsertTextInObject="InsertTextInObject(...arguments)"
        @LineSelected="LineSelected()"
        @LineUnselected="LineUnselected()"
        @CircleUnSelected="CircleUnSelected()"
        @CircleSelected="CircleSelected()"
        @SquareSelected="SquareSelected()"
        @SquareUnSelected="SquareSelected()"
        @InsertGuideOnArray="InsertGuideOnArray(...arguments)"
        @focuslengthButton="focuslengthButton()"
        @ShowTextInput="ShowTextInput()"
        @crearGrupo="CreateGroup()"
      />
    </div>
  </div>
</template>

<script>
import Canvas from './Design2D/Canvas.vue'
import Group from './Design2D/GroupDiv.vue'
import LineaMenu from './Design2D/Line.vue'
import swal from "sweetalert2"
import componenteMenuContextual from '@/components/componenteMenuContextual.vue'

export default {
  name: 'DesignCAD',
  data: () => ({
    formulario:{
      x:0,
      y:0,
      alto:0,
      ancho:0,
    },
    formularioCirculo:{
      x:0,
      y:0,
      radio:0,
    },
    formularioLinea:{
      x:0,
      y:0,
      angulo:0,
      size:0,
    },
    Dibujo: {
      Nombre_Dibujo: null,
      // Todos los Grupos que contienen un array de lineas
      grupos: [],
      // Asistentes
      UnionAssitant: true,
      FixedAngles: true,
      // Variable que da un valor de length fijo
      LengthSetter: '',
      // Esta da el Width SOLO para los rectangulos
      Width: '',
      Heigth: '',
      // Esta es solo para los circulos 
      Radio: '',
      // Estos boleaanos definen la seleccion en lineas o guias
      LineSelected: false,
      GuideSelected: false,
      CircleSelected: false,
      SquareSelected: false,
      // Todos los textos externos a los grupos
      Texts: [],
      SelectedLinesReference: [],
      //  Variables para los asistentes
      MoveLineAssitant: false,
      CurrentPointX: 0,
      CurrentPointy: 0,
    },
    // Variable ReadOnly para Ver el length actual que se esta dibujando
    length: '',
    // Input para insertar un texto externo
    Text: '',
    FontSize: 10,
    //variable for selected button
    SelectedOption: null,
    moverLiezo: false
  }),
  methods: {
    _moverCanvas(){
      this.moverLiezo = !this.moverLiezo;
    },
    selectTodo(e){
      console.log(e.currentTarget);
      e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
    },
    mostrarInformacionTecla(e){
      this.$root.$emit('moverCanvas', {e:e.keyCode, v:1});
    },
    crearCuadro(){
      this.$root.$emit('crearCuadro', this.formulario);
      this.$refs.formDibujoModal.hide();
      this.formulario = {
        x:0,
        y:0,
        alto:0,
        ancho:0,
      };
    },
    crearCirculo(){
      this.$root.$emit('crearCirculo', this.formularioCirculo);
      this.$refs.formDibujoCirculoModal.hide();
      this.formularioCirculo = {
        x:0,
        y:0,
        radio:0,
      };
    },
    crearLinea(){
      this.$root.$emit('crearLinea', this.formularioLinea);
      this.$refs.formDibujoLineaModal.hide();
      this.formularioLinea = {
        x:0,
        y:0,
        angulo:0,
        size:0,
      };
    },
    selectCuadroP(){
      this.SetTab('CustomSquareTools');
      this.$refs.formDibujoModal.show();
    },
    selectCirculoP(){
      this.SetTab('CustomCirculeTools');
      this.$refs.formDibujoCirculoModal.show();
    },
    selectLineaP(){
      this.SetTab('CustomLineaTools');
      this.$refs.formDibujoLineaModal.show();
    },
    validarEspacioDisponible(){

    },
    // Reset the whole projet to 0
    reset () {
      this.$refs.childCanvas.reset()
      this.Dibujo = {
        Nombre_Dibujo: null,
        // Todos los Grupos que contienen un array de lineas
        grupos: [],
        // Asistentes
        UnionAssitant: true,
        FixedAngles: true,
        // Variable que da un valor de length fijo
        LengthSetter: '',
        LineSelected: false,
        GuideSelected: false,
        // Todos los textos externos a los grupos
        Texts: [],
        SelectedLinesReference: [],
        //  Variables para los asistentes
        MoveLineAssitant: false
      }
      // Variable ReadOnly para Ver el length actual que se esta dibujando
      this.length = ''
      // Input para insertar un texto externo
      this.Text = ''
      this.FontSize = 10
    },
    CoordinatesVisibility(){
      this.$refs.childCanvas.HideOrShowCoordinateAxis()
    },
    ChangeFontSizeOnGroup(NewFontSize){
      this.Dibujo.grupos.forEach(grupo => {
        if(grupo.selected === true){
          grupo.texts.forEach(text => {
            text.fontSize = NewFontSize
          });
        }
      });
      this.$refs.childCanvas.FontSize = NewFontSize
      this.$store.commit('SetDesignObject', JSON.stringify(this.Dibujo))
      this.focuslengthButton()
    },
    ShowTextInput(){
      let self = this
      let input = swal.fire({
          title: 'Asistente de textos',
          text: 'Do you want to continue',
          html:
            '<label id="Label1">Ingrese un tamaño de fuente</label>'+
            '<input id="swal-input1" class="swal2-input" placeholder="12">' +
            '<label id="Label2" =>Ingrese el texto</label>'+
            '<input id="swal-input2" class="swal2-input" placeholder="Escribe un texto aca">',
          focusConfirm: false,
          preConfirm: () => {
              this.FontSize = document.getElementById('swal-input1').value,
              this.Text = document.getElementById('swal-input2').value
              this.$refs.childCanvas.InsertText(this.Text, this.FontSize)
          }
        })
      this.focuslengthButton()
    },
    DesignEventHandler(){
      if(this.SelectedOption == "DesignTool"){
        this.$refs.childCanvas.design()
      }else if(this.SelectedOption =="CircleTool"){
        this.$refs.childCanvas.DesignCircle()
      }else{
        this.$refs.childCanvas.DesignSquare()
      }
      this.focuslengthButton()
    },
    focuslengthButton(){
      if(document.getElementById('lengthInput')){
        let button = document.getElementById('lengthInput')
        this.Dibujo.LengthSetter = ""
        button.select()
      }else if(document.getElementById('HeigthInput')){
        let button = document.getElementById('HeigthInput')
        this.Dibujo.LengthSetter = ""
        button.select()
      }else if(document.getElementById('RadioInput')){
        let button = document.getElementById('RadioInput')
        this.Dibujo.LengthSetter = ""
        button.select()
      }
    },
    InsertGuideOnArray (Guide, GuideData) {
      this.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
          grupo.PaperGuides.push(Guide)
          if (GuideData !== null) {
            GuideData.GuideIndex = grupo.PaperGuides.length - 1
            grupo.Guides.push(GuideData)
          }
        }
      })
      this.focuslengthButton()
    },
    EmptyReferences () {
      this.Dibujo.SelectedLinesReference = []
      this.focuslengthButton()
    },
    InsertFisrtLineSelectedIndexInReference () {
      let self = this
      this.Dibujo.grupos.forEach(grupo => {
        self.getIndexOfSelection(grupo.PaperGuides, true)
        self.getIndexOfSelection(grupo.PaperGroups, false)
      })
    },
    getIndexOfSelection (array, isGuide) {
      let self = this
      array.forEach(function (item, index) {
        if (item.selected === true) {
          let ReferenceObject = {
            SelectionIndex: index,
            isGuide: isGuide
          }
          self.Dibujo.SelectedLinesReference.push(ReferenceObject)
        }
      })
    },
    GetSelectedItemsForInterpolation (array, SelectionIndex) {
      let ArrayToReturn = []
      array.forEach(function (item, index) {
        if (item.selected === true && index !== SelectionIndex) {
          ArrayToReturn.push(item)
        } else if (item.selected === true && index === SelectionIndex) {
          ArrayToReturn.push(item)
        }
      })
      return ArrayToReturn
    },
    InterpolatePaths (isGuide, factor) {
      let PathsArray = []
      let self = this
      this.Dibujo.grupos.forEach(grupo => {
        if (self.Dibujo.SelectedLinesReference[0].isGuide === true) {
          PathsArray = self.GetSelectedItemsForInterpolation(grupo.PaperGuides, self.Dibujo.SelectedLinesReference[0].SelectionIndex)
        } else {
          PathsArray = self.GetSelectedItemsForInterpolation(grupo.PaperGroups, self.Dibujo.SelectedLinesReference[0].SelectionIndex)
        }
      })
      this.$refs.childCanvas.InterpolatePaths(PathsArray, isGuide, factor)
    },
    ExportJPEGToServer () {
      this.$refs.childCanvas.ExportJPEGToServer()
    },
    DownloadProyectPDF () {
      this.$refs.childCanvas.DownloadProyectPDF()
    },
    EraseGroup (index) {
      this.Dibujo.grupos[index].PaperGroups.forEach(linea => {
        linea.remove()
      })
      this.Dibujo.grupos[index].PaperSquares.forEach(Square => {
        Square.remove()
      });
      this.Dibujo.grupos[index].PaperCircles.forEach(Circle => {
        Circle.remove()
      });
      this.Dibujo.grupos[index].PaperCircles = []
      this.Dibujo.grupos[index].PaperSquares = []
      this.Dibujo.grupos[index].PaperGroups = []
      this.Dibujo.grupos[index].texts = []
      this.Dibujo.grupos[index].Circles = []
      this.Dibujo.grupos[index].Squares = []
      this.Dibujo.grupos[index].lineas = []
      this.Dibujo.grupos.splice(index, 1)
      this.UpdateStorage()
    },
    // Call the function to create guides
    CreateGuide (GuideDistance, factor) {
      this.$refs.childCanvas.CreateGuide(GuideDistance, factor)
    },
    ////// Setters
    SetVisibillityOnArray (array, visibility) {
      array.forEach(item => {
        if (item.selected === true) {
          item.visible = visibility
          item.selected = visibility
        } else if (item.visible === false && visibility === true) {
          item.visible = visibility
        }
      })
    },
    // Unselect all groups
    SetAlllGroupsToFalse () {
      this.Dibujo.grupos.forEach(grupo => {
        grupo.selected = false
      })
    },
    //  Unselect all Lines
    UnselectAllLines(){
      this.$refs.childCanvas.UnselectAllLines()
    },
    // Set Group to work on
    setSelectedGroup (index) {
      this.SetAlllGroupsToFalse()
      this.Dibujo.grupos[index].selected = true
    },
    ToogleActiveClass(elementId){
      var element = document.getElementById(elementId);
      element.classList.toggle(active);
    },
    SetTab(Tab){
      this.SelectedOption = Tab
      if(Tab === "LineMenu" || Tab === "TextTool"){
        this.$refs.childCanvas.removeTool()
        this.$refs.childCanvas.SetOtherOptionsTool()
      }
      this.$refs.childCanvas.RemoveTemporalPaths()
      this.SetMoveLineAssistant(Tab)
      this.focuslengthButton()
    },
    // Gives the user the ability to move lines with the mose by setting the assistant to true or false
    SetMoveLineAssistant (Tab) {
      if (Tab === "MoveLineAssistant") {
        this.Dibujo.MoveLineAssitant = true
      } else {
        this.Dibujo.MoveLineAssitant = false
      }
      this.focuslengthButton()
    },
    ChangeColorSelectedLine (color) {
      this.$refs.childCanvas.ChangeColorSelectedLine(color)
      this.focuslengthButton()
    },
    CloneLine (GuideDistance, factor) {
      this.$refs.childCanvas.CloneLine(GuideDistance, factor)
      this.focuslengthButton()
    },
    EraseSelectedLine () {
      this.$refs.childCanvas.EraseSelectedLine()
      this.focuslengthButton()
    },
    InsertText () {
      this.$refs.childCanvas.InsertText(this.Text, this.FontSize)
    },
    // Creates and instace of a group and inserts it in the array of groups
    CreateGroup (value) {
      let Grupo = {
        name: '',
        color: '#000000',
        selected: true,
        lineas: [],
        PaperGroups: [],
        PaperGuides: [],
        Guides: [],
        Circles: [],
        Squares: [],
        PaperCircles: [],
        PaperSquares: [],
        texts: [],
        SquareTexts: []
      }
      // Unsellect all groups to set only last group created to be selected
      this.SetAlllGroupsToFalse()
      // console.log(this.Dibujo.grupos.length);
      Grupo.name = `Grupo ${this.Dibujo.grupos.length+1}`;
      this.Dibujo.grupos.push(Grupo)
    },
    // Controls the visibility of lines and texts of a group
    HideOrShowGroup (index, Vissibility) {
      this.Dibujo.grupos[index].PaperGroups.forEach(linea => {
        linea.visible = Vissibility
      })
      this.Dibujo.grupos[index].texts.forEach(texto => {
        texto.visible = Vissibility
      })
      this.Dibujo.grupos[index].PaperSquares.forEach(Square => {
        Square.visible = Vissibility
      });
      this.Dibujo.grupos[index].PaperCircles.forEach(Circle => {
        Circle.visible = Vissibility
      });
    },
    HideSelection () {
      let self = this
      this.Dibujo.grupos.forEach(grupo => {
        self.SetVisibillityOnArray(grupo.PaperGroups, false)
        self.SetVisibillityOnArray(grupo.PaperGuides, false)
        self.SetVisibillityOnArray(grupo.PaperSquares, false)
        self.SetVisibillityOnArray(grupo.PaperCircles, false)
        self.SetVisibillityOnArray(grupo.texts, false)
      })
    },
    ShowNotVisibleItems () {
      let self = this
      this.Dibujo.grupos.forEach(grupo => {
        self.SetVisibillityOnArray(grupo.PaperGroups, true)
        self.SetVisibillityOnArray(grupo.PaperGuides, true)
        self.SetVisibillityOnArray(grupo.PaperSquares, true)
        self.SetVisibillityOnArray(grupo.PaperCircles, true)
        self.SetVisibillityOnArray(grupo.texts, true)
      })
    },
    // Checks if there is a line Selected in the design
    LineSelected () {
      this.Dibujo.LineSelected = true
    },
    LineUnselected () {
      this.Dibujo.LineSelected = false
    },
    // Same For Circles
    CircleSelected () {
      this.Dibujo.CircleSelected = true
    },
    CircleUnSelected () {
      this.Dibujo.CircleSelected = false
    },
    // Same for squares
    SquareSelected () {
      this.Dibujo.SquareSelected = true
    },
    SquareUnSelected () {
      this.Dibujo.SquareSelected = false
    },
    // Insert new Created text into the array of texts (independent of lines)
    InsertTextInObject (PointText) {
      this.Dibujo.Texts.push(PointText)
      this.UpdateStorage()
    },
    // controls the state of the Union Asistant
    ChangeUnionStatus () {
      this.Dibujo.UnionAssitant = !this.Dibujo.UnionAssitant
      if (this.Dibujo.UnionAssitant === true) {
        let button = document.getElementById('UnionStatusButton')
        button.classList.add('active')
      } else {
        let button = document.getElementById('UnionStatusButton')
        button.classList.remove('active')
      }
    },
    ChangeAngleFixationStatus () {
      this.Dibujo.FixedAngles = !this.Dibujo.FixedAngles
      if (this.Dibujo.FixedAngles === true) {
        let button = document.getElementById('AngleUnionStatusButton')
        button.classList.add('active')
      } else {
        let button = document.getElementById('AngleUnionStatusButton')
        button.classList.remove('active')
      }
    },
    UpdateGroup (index, grupo) {
      this.Dibujo.grupos[index] = grupo
      grupo.PaperGroups.forEach(linea => {
        linea.children[1].strokeColor = grupo.color
      })
      grupo.Squares.forEach(Square => {
        Square.color = grupo.color
      });
      grupo.Circles.forEach(Circle => {
        Circle.color = grupo.color
      });
      grupo.PaperSquares.forEach(Square => {
        Square.strokeColor = grupo.color
      });
      this.Dibujo.Texts.forEach(Text => {
        Text.strokeColor = grupo.color
      });
      grupo.lineas.forEach(linea => {
        linea.color = linea.color
      });
      grupo.PaperCircles.forEach(Circle => {
        Circle.strokeColor = grupo.color
      });
      this.UpdateStorage()
      this.focuslengthButton()
    },
    UpdateStorage (){
      this.$store.commit('SetDesignObject', JSON.stringify(this.Dibujo))
    },
    UpdateLegthValue (length) {
      this.length = Math.floor(length)
      this.focuslengthButton()
    },
    // Estas 3 funciones guardan los objetos en el json
    InsertLineOnArray (PaperGroup, LineData) {
      this.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
          grupo.PaperGroups.push(PaperGroup)
          if (LineData !== null) {
            LineData.PathGroupIndex = grupo.lineas.length
            grupo.lineas.push(LineData)
          }
        }
      })
    },
    InsertCircleOnArray (CirclePath, CircleData) {
      this.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
          if(CircleData != null){
            grupo.Circles.push(CircleData)
          }
          grupo.PaperCircles.push(CirclePath)
        }
      })
      this.UpdateStorage()
    },
    InsertSquareOnArray (SquarePath, SquareData) {
      this.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
          if(SquareData != null){
            grupo.Squares.push(SquareData)
          }
          grupo.PaperSquares.push(SquarePath)
        }
      })
      this.UpdateStorage()
    },
    InsertTextOnArray (Text) {
      this.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
            grupo.SquareTexts.push(Text)
        }
      })
      this.UpdateStorage()
    },
  },
  beforeMount () {
    if (this.$store.state.layout.DesignObject !== null) {
      if (this.$store.state.layout.DesignObject !== '') {
        this.Dibujo = JSON.parse(this.$store.state.layout.DesignObject)
        this.Dibujo.SelectedLinesReference = []
        this.Dibujo.LineSelected = false
        this.Dibujo.GuideSelected = false
      }
    }
  },
  mounted(){
    this.focuslengthButton()
    console.log(this.$refs.childCanvas.$el);
    this.$refs.childCanvas.$el.addEventListener('contextmenu', (event)=>{
      event.preventDefault();
      this.$refs.menuContextualCompoCAD.offset.x = -65;
      this.$refs.menuContextualCompoCAD.offset.y = -55;
      this.$refs.menuContextualCompoCAD.showMenu(event);
    }, false);

  
    document.onclick = (data)=>{
      if(this.moverLiezo){
        this.SelectedOption = "";
        this.$root.$emit('moverCanvasMouse', true);
      }else{
        this.$root.$emit('moverCanvasMouse', false);
      }
    }

    // this.$refs.contenedorGeneralCAD.$el.onclick = function(data){
    

  },
  computed:{
    opcionesMenuContextual(){
      return [
        {
          text:this.moverLiezo ? "Dejar de mover":"Mover lienzo",
          func:this._moverCanvas,
          show:true,
          menu: "", //establece los menus separados por | agrege aqui el tipo de menu pára que se muestre esta opcion dependiendo lo que envie en el evento showMenuContextual
          class:"",
          icon:"textarea"
        }
      ];
    }
  },
  components: {
    Canvas,
    Group,
    LineaMenu,
    componenteMenuContextual
  }
}
</script>

<style scoped>
.CoordsContainer{
  display: flex;
  flex-flow: row;
  width: 25%;
}
.CoorsSubCont{
  display: flex;
  flex-direction: row;
  width: 50%;
}
.CoorsSubCont button{
  display: flex;
  width: 25% !important;
}
.CoorsSubCont input{
  display: flex;
  width: 75% !important;
}
.GroupContainer{
  display: flex;
  flex-flow: column;
}
.CanvasAndGroupsContainer{
  display: flex;
  flex-flow: row;
}
.UnionAssitantContainer{
  display: flex;
  flex-direction: row;
}
.AngleAssitantContainer{
  display: flex;
  flex-direction: row;
}
.btn-container{
  display: flex;
  justify-items: flex-start;
  flex-flow: row;
  width: 100%;
}
#canvas-one{
  width: 80%;
}
.whole2DModule{
  display: flex;
  flex-flow: column;
  justify-items: flex-start;
}
.fontSizeSelectButton {
  display: flex;
  flex-direction: row;
}
.FontSize {
  width: 20%;
}
.LineMenu {
  width: 100%;
}
.form-control btn-block {
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.125);
  color: #007bff;
}
.active {
  background-color: #007bff !important;
  border: 1px solid rgba(0,0,0,.125) !important;
  color: #fff !important;
}
.form-control{
  color: #007bff;
}
.inputTxt {
  color: #000;
}
.principalOptionsContainer{
  display: flex;
  justify-items: flex-start;
  width: 25%;
}
.principalOptionsContainer button{
  width: 10%;
  height: 100%;
  margin: 0;
}
.MiddleOptionsContainer{
  display: flex;
  justify-content: center;
  width: 50%;
}
.MiddleOptionsContainer button{
  width: 10%;
  height: 100%;
  margin: 0;
}
.MiddleOptionsContainer input{
  width: 10%;
  height: 100%;
  margin: 0;
}
.ProjectGestorContainer{
  display: flex;
  justify-content: flex-end;
  width: 25%;
}
.ProjectGestorContainer button{
  width: 10%;
  height: 100%;
  margin: 0;
}
</style>
