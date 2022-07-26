<template>
    <div>
      <div class='w-input'>
        <input type='radio' v-b-tooltip.hover.right title="Seleccionar Grupo" class='form-check-input' name='GroupSelect' v-on:click="SelectGroup()" checked>
        <input v-b-tooltip.hover.right title="Nombrar Grupo" class='form-control w-input' v-model="grupo.name" placeholder="Nombre" v-on:change="UpdateGroup()">
      </div>
      <div class='ActionsContainer'  v-if="grupo.selected===true">
        <input v-b-tooltip.hover.right title="Cambiar Color de TODAS las lineas del grupo" class='form-control btn btn-secondary ActionBtn' type='color' v-model="grupo.color" v-on:change="UpdateGroup()">
        <button v-b-tooltip.hover.right title="Mostrar/Ocultar Lineas" class="form-control btn btn-secondary ActionBtn" v-on:click="HideOrShow()">
          <b-icon  v-if="Vissibility===true" icon="eye-slash" font-scale="1.5" ></b-icon>
          <b-icon  v-if="Vissibility===false" icon="eye" font-scale="1.5" ></b-icon>
        </button>
        <button v-b-tooltip.hover.right title="Borrar Grupo" class="form-control btn btn-secondary ActionBtn" v-on:click="EraseGroup()"><b-icon icon="x-circle" font-scale="1.5" ></b-icon></button>
      </div>
    </div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'Grupo',
  props: ['grupo'],
  data: () => ({
    Vissibility: true
  }),
  methods: {
    SelectGroup () {
      this.$emit('setSelectedGroup')
    },
    UpdateGroup () {
      this.$emit('updateGroup', this.$props.grupo)
    },
    EraseGroup () {
      this.$emit('EraseGroup')
    },
    HideOrShow () {
      if (this.Vissibility === true) {
        this.Vissibility = false
      } else {
        this.Vissibility = true
      }
      this.$emit('HideOrShowGroup', this.Vissibility)
    }
  }
})
</script>

<style scoped>
.w-input {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.ActionsContainer{
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}
.ActionsContainer input, button{ 
  width: 50% !important;
}
.ActionBtn{
  width: 50%;
}
</style>
