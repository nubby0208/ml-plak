<template>
  <div class="puerta-corrediza-diagram" :style="{ width: selectedModule.width / 4 + 'px' }">
    <div class="puerta-corrediza-diagram-container" :style="{'padding-left': diagramStart + 'px'}">
      <div v-for="(p, index) in puerta.puertas" :key="index" :id="index">
      
        <div class="door" :class="{'disabled': !puerta.puertas[index].enabled}" :style="{top: index % 2 === 1 ? '-9px' : '0px', left: ((index * puerta.cruceEntrePuertas / 4) * -1) + 'px'}">
          <div class="door-section door-tip door-start" :class="{selected: selectedTip === index}" :style="{ width: kitWidth()  / 4 + 'px' }"></div>
          <div @click="select(index)" class="door-section door-middle" :class="{selected: selected === index}" :style="{ width: (width(index) - (kitWidth() * 2)) / 4 + 'px' }"></div>
          <div class="door-section door-tip door-end" :class="{selected: selectedTip === index}" :style="{ width: kitWidth() / 4 + 'px' }"></div>
        </div>
        
        <div v-if="measures && puerta.puertas[index].enabled" class="door-label" :style="{ top: index % 2 === 1 ? '-35px' : '0px' }">
          {{ width(index) }} x {{ height }}
        </div>

        <div class="selectable-area" :class="{'area-with-measures': measures && puerta.puertas[index].enabled, 'selected': selectedArea === index}" @click="selectArea(index)" v-if="index !== 0 && puerta.puertas[index].enabled && puerta.puertas[index - 1].enabled"></div>
      </div>
    </div>
    <div class="toggler">
      <input id="toggle" type="checkbox" checked="checked" @click="toggle()" v-model="measures"/> 
      <label for="toggle">Mostrar medidas</label>
    </div>
  </div>
</template>
<script>
export default {
  props: [ 'puerta', 'separador' ],
  data () {
    return {
      selected: -1,
      selectedTip: -1,
      selectedArea: -1,
      measures: null
    }
  },
  mounted: function () {
    this.measures = JSON.parse(localStorage.getItem('showMeasuresCorrediza'))
  },
  methods: {
    toggle () {
      localStorage.setItem('showMeasuresCorrediza', !this.measures)
    },
    select (index) {
      if (index === this.selected) {
        this.selected = -1
      } else {
        this.selected = index
      }
      this.$store.commit('setHojaCorredizaSelected', { index: this.selected })
    },
    selectArea (index) {
      if (index === this.selectedArea) {
        this.selectedArea = -1
      } else {
        this.selectedArea = index
      }
      this.$store.commit('setCruceEntrePuertasSelected', { index: this.selectedArea })
    },
    kitWidth () {
      const perfiles = this.puerta.kit ? +this.puerta.kit.descuento_ancho : 0
      return perfiles
    },
    width (index) {
      if (this.puertasCount === 0) {
        return 0
      }
      const doorWidth = +Number(this.$store.getters.getPuertaCorredizaWidth(this.separador.id, index)).toFixed(2)
      return doorWidth + this.kitWidth()
    }
  },
  computed: {
    selectedModule () {
      return this.$store.state.layout.modules[this.$store.state.layout.selectedModule]
    },
    diagramStart () {
      const element = this.$store.getters.getPuertaCorredizaLeftMostSide(this.separador)
      return (this.$store.getters.getX(element.id) + element.size) / 4
    },
    height () {
      if (this.puertasCount === 0) {
        return 0
      }
      return Number(this.$store.getters.getPuertaCorredizaHeight(this.separador.id)).toFixed(2)
    },
    puertasCount () {
      return +this.puerta.cantPuertas
    }
  }
}
</script>

<style scoped>
.puerta-corrediza-diagram {
  margin: 0 auto;
}
.puerta-corrediza-diagram-container {
  margin: 0 auto;
  width: 620px;
  display: flex;
  padding-top: 25px;
  height: 60px;
}
.toggler {
  font-size: 12px;
  margin-top: 10px;
}
.door {
  position: relative;
  height: 6px;
  z-index: 5;
  display: flex;
}
.door.disabled {
  opacity: 0.3;
}
.door-section {
  height: inherit;
  display: inline-block;
}
.door-middle {
  background-color: skyblue;
  cursor: pointer;
}
.door-tip {
  position: relative;
  z-index: 15;
  background-color: #6f42c1;
}
.door-middle.selected {
  background-color: limegreen;
}
.door-label {
  position: relative;
  font-size: 12px;
}
.selectable-area {
    width: 40px;
    height: 40px;
    border: 1px solid gray;
    position: relative;
    bottom: 28px;
    right: 20px;
    z-index: 20;
    cursor: pointer;
}
.selectable-area.area-with-measures {
  bottom: 46px;
}
.selectable-area.selected {
  border-color: limegreen;
}
</style>