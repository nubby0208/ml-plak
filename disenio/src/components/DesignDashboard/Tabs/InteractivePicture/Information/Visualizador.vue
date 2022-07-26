<template>
  <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 pantalla-ambientes">
    <div class="row">
      <div class="col-md-2 col-sm-2 col-xs-2">
        <h3 class="title-notas">Notas</h3>
        <ul class="list-group col-md-12 col-sm-2 col-xs-2">
          <li v-for="info of ambiente.informacion" :key="info.informacion" class="list-group-item">{{info}}</li>
          <button class="btn btn-info" id="show-modal" @click="showModal = true">Nueva nota</button>
        </ul>
      </div>
      <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
        <p v-on:click="abrirZona"><img width="100%" :src="ambiente.imagen" alt></p>
      </div>
    </div>
    <modal v-if="showModal" @nuevoMensaje="recibirNuevoMensaje" @close="showModal = false">
      <h3 slot="header">Nota de Ambiente</h3>
    </modal>
    <Zonas :ambienteVisible="ambiente" v-if="showzone" @close="showzone = false"></Zonas>
  </div>
</template>

<script>
import Modal from './Modal.vue'
import Zonas from './Zonas.vue'

// register modal component
export default {
  name: 'Visualizador',
  components: {
    Modal,
    Zonas
  },
  props: {
    ambiente: {}
  },
  data () {
    return {
      showModal: false,
      showzone: false
    }
  },
  methods: {
    recibirNuevoMensaje (mensaje) {
      const datos = { codigoAmbiente: this.ambiente.codigo, nuevoMensaje: mensaje }
      this.$emit('agregarMensaje', datos)
    },
    abrirZona () {
      this.showzone = true
    }
  }

}
</script>

<style scoped>
.title-notas{
  color:  gray;
  margin-top: 20px;
}
#show-modal{
  margin-bottom: 20px;
}
</style>