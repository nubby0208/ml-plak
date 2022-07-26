<template>
    <div class="OptionsContainerDouble">
      <div class="optionsContainer">
        <button v-b-tooltip.hover.right title="Mover Lineas" type="button" class="form-control btn-block OptionsButton" :class="selectedSubOption === 'MoveLineAssistant' ? 'active' : ''"
          v-on:click="MoveLine()" >
          <b-icon-hand-index font-scale="1.5" ></b-icon-hand-index>
        </button>
        <button v-b-tooltip.hover.right title="Crear Guia A partir de 1 linea" type="button" class="form-control btn-block OptionsButton" v-on:click="ShowToolsMenu()" :class="selectedSubOption === 'GuideAssistant' ? 'active' : ''" >
          <b-icon icon="Three-dots" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Clonar 1 linea" type="button" class="form-control btn-block OptionsButton" v-on:click="ShowClonningTools()" :class="selectedSubOption === 'CloneAssistant' ? 'active' : ''" >
          <b-icon icon="files" font-scale="1.5" ></b-icon>
        </button>
        <input v-b-tooltip.hover.right title="Cambiar Color" class="form-control color-select OptionsButton" type='color' v-model="LineColor" v-on:change="ChangeLineColor()"/>
        <button v-b-tooltip.hover.right title="Borrar Linea" type="button" class="form-control btn-block OptionsButton" v-on:click="EraseLine()">
          <b-icon icon="x-circle" font-scale="1.5" ></b-icon>
        </button>
        <!--
          Este codigo era usado para crear lineas interpoladas entre otras dos seleccionadas pero esta temporalmente inactivo
          button class="form-control btn-block OptionsButton" v-b-tooltip.hover.right title="Crear Guias interpoladas" v-on:click="InterpolatePaths(true, interpolationFactor)">
          <b-icon icon="Three-dots" font-scale="1.5" ></b-icon>
        </button>
        <button class="form-control btn-block OptionsButton" v-b-tooltip.hover.right title="Crear Lineas interpoladas" v-on:click="InterpolatePaths(false, interpolationFactor)">          
          <b-icon icon="Justify" font-scale="1.5" ></b-icon>
        </button>
        <select v-b-tooltip.hover.right title="Seleccionar cantidad de espacios a dividir" class="form-control OptionsButton" id="FactorSelector" name="InterpolationDistance" v-model="interpolationFactor">
          <option value="0.5">1/2</option>
          <option value="0.25">1/4</option>
          <option value="0.125">1/8</option>
          <option value="0.0625">1/16</option>
        </select-->
        <button v-b-tooltip.hover.right title="Ocultar Items Seleccionados" class="form-control btn-block OptionsButton" v-on:click="HideSelection()">
          <b-icon icon="eye-slash" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Mostrar Items ocultados" class="form-control btn-block OptionsButton" v-on:click="ShowNotVisibleItems()">
          <b-icon icon="eye" font-scale="1.5" ></b-icon>
        </button>
        <select name="TextFontSelect" id="TextFont" class="form-control btn-block OptionsButton" v-b-tooltip.hover.right title="Tamaño de fuente del grupo activo" v-on:change="ChangeFontSizeOnGroup()" v-model="FontSize">
          <option value="10">10</option>
          <option value="12">20</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="30">30</option>
          <option value="35">35</option>
          <option value="40">40</option>
          <option value="45">45</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="80">80</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>
      </div>
      <div class="ExtraoptionsContainer" v-if="ShowGuideTools === true">
        <button v-b-tooltip.hover.right title="Izquierda" type="button" class="form-control btn-block" v-on:click="CreateGuide(-1)">
          <b-icon icon="arrow-bar-left" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Derecha" type="button" class="form-control btn-block" v-on:click="CreateGuide(1)">
          <b-icon icon="arrow-bar-right" font-scale="1.5" ></b-icon>
        </button>
        <input class="form-control inputTxt" type="text" name="DistanceClone" v-model="GuideDistance" >
      </div>
      <div class="ExtraoptionsContainer" v-if="ShowCloneTools === true">
        <button v-b-tooltip.hover.right title="Izquierda" type="button" class="form-control btn-block" v-on:click="CloneLine(-1)">
          <b-icon icon="arrow-bar-left" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Derecha" type="button" class="form-control btn-block" v-on:click="CloneLine(1)">
          <b-icon icon="arrow-bar-right" font-scale="1.5" ></b-icon>
        </button>
        <input class="form-control inputTxt" type="text" name="DistanceClone" v-model="GuideDistance" >
      </div>
    </div>
</template>
<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'linea',
  props: ['Dibujo', 'SelectedOption'],
  data: () => ({
    GuideDistance: 0,
    ShowGuideTools: false,
    ShowCloneTools: false,
    LineColor: '',
    interpolationFactor: 1 / 2,
    selectedSubOption: null,
    FontSize: null
  }),
  methods: {
    EraseLine () {
      this.$emit('EraseLine')
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    },
    ChangeFontSizeOnGroup(){
      this.$emit("ChangeFontSizeOnGroup", this.FontSize)
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    },
    HideSelection () {
      this.selectedSubOption = 'HideAssistant'
      this.$emit('HideSelection')
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    },
    ShowNotVisibleItems () {
      this.selectedSubOption = 'ShowAssistant'
      this.$emit('ShowNotVisibleItems')
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    },
    ShowToolsMenu () {
      this.selectedSubOption = 'GuideAssistant'
      this.ShowCloneTools = false
      this.ShowGuideTools = true
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    },
    InterpolatePaths (isGuide, factor) {
      this.$emit('InterpolatePaths', isGuide, factor)
    },
    ShowClonningTools () {
      this.selectedSubOption = 'CloneAssistant'
      this.ShowGuideTools = false
      this.ShowCloneTools = true
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    },
    ChangeLineColor () {
      this.selectedSubOption = 'ColorAssistant'
      this.$emit('ChangeColorSelectedLine', this.LineColor)
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    },
    CloneLine (factor) {
      this.GuideDistance = parseInt(this.GuideDistance, 10)
      this.$emit('CloneLine', this.GuideDistance, factor)
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    },
    MoveLine () {
      this.selectedSubOption = 'MoveLineAssistant'
      this.$emit('SetMoveLineAssistant', 'MoveLineAssistant')
    },
    CreateGuide (factor) {
      this.GuideDistance = parseInt(this.GuideDistance, 10)
      this.$emit('CreateGuide', this.GuideDistance, factor)
      this.$emit('SetMoveLineAssistant', this.selectedSubOption)
    }
  },
  mounted () {
    this.$emit('InsertFisrtLineSelectedIndexInReference')
  },
  beforeDestroy () {
    this.$emit('EmptyReferences')
  }
})
</script>

<style scoped>
.OptionsContainerDouble{
  display: flex;
  width: 100%;
  flex-grow: column;
}
.optionsContainer{
  display: flex;
  justify-content: flex-start;
  width: 100%;
  flex-flow: row;
}
.OptionsButton{
  max-width: 5%;
  margin: 0;
}
.color-select {
  width: 100%;
  padding: .375rem .75rem !important;
}
.ExtraoptionsContainer{
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0;
}
.ExtraoptionsContainer button{
  display: flex;
  width: 10%;
  margin: 0;
}
.ExtraoptionsContainer input{
  display: flex;
  width: 10%;
  margin: 0;
}
#FactorSelector {
  padding: 0;
  color: #000;
}
.form-control btn-block {
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.125);
  color: #007bff;
}
.active {
  background-color: #007bff;
  border: 1px solid rgba(0,0,0,.125);
  color: #fff !important;
}
.form-control{
  color: #007bff;
}
.inputTxt {
  color: #000;
}
</style>
