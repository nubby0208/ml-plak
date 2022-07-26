<template>
  <div class="text-left" v-if="this.object">
    <h5
      class="mt-3"
    >
    {{ this.object.name }}</h5>
    <hr>
    <div class="row">
      <div class="col-12">
        <strong>
          <font-awesome-icon icon="arrows-alt" /> Posición
        </strong>
      </div>
      <div class="col-12 d-flex flex-row justify-content-between">
        <div class="ml-0 mr-1">
          <input
            @change="$store.commit('setPosicionGrupoCad', {index:object.indexGrupo, posicion:{x:$event.target.value}});"
              class="form-control"
              type="text"
              :value="parseInt(object.posicion.x)"
          />
        </div>
        <div class="mx-1">
          <input
            class="form-control"
            type="text"
            @change="$store.commit('setPosicionGrupoCad', {index:object.indexGrupo, posicion:{y:$event.target.value}});"
            :value="parseInt(object.posicion.y)"
          />
        </div>
        <div class="mx-1">
          <input
            class="form-control"
            type="text"
            @change="$store.commit('setPosicionGrupoCad', {index:object.indexGrupo, posicion:{z:$event.target.value}});"
            :value="parseInt(object.posicion.z)"
          />

        </div>
      </div>
    </div>

    <div class="row mt-1">
      <div class="col-3 text-center">
        <label for="">
          X
        </label>
      </div>
      <div class="col-3 text-center">
        <label for="">
          Y
        </label>
      </div>
      <div class="col-3 text-center">
        <label for="">
          Z
        </label>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <strong>
          <font-awesome-icon icon="sync-alt"/>
           Rotación
        </strong>
      </div>
      <div class="col-12 d-flex flex-row justify-content-between">
        <div class="ml-0 mr-1">
          <input
            class="form-control"
            type="text"
            @change="$store.commit('setRotacionGrupoCad', {index:object.indexGrupo, rotacion:{x:$event.target.value}});"
            :value="parseInt(object.rotacion.x)"
          />
        </div>
        <div class="mx-1">
          <input
            class="form-control"
            type="text"
            @change="$store.commit('setRotacionGrupoCad', {index:object.indexGrupo, rotacion:{y:$event.target.value}});"
            :value="parseInt(object.rotacion.y)"
          />
        </div>
        <div class="mx-1">
          <input
            class="form-control"
            type="text"
            @change="$store.commit('setRotacionGrupoCad', {index:object.indexGrupo, rotacion:{z:$event.target.value}});"
            :value="parseInt(object.rotacion.z)"
          />
        </div>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col-3 text-center">
        <label for="">
          X
        </label>
      </div>
      <div class="col-3 text-center">
        <label for="">
          Y
        </label>
      </div>
      <div class="col-3 text-center">
        <label for="">
          Z
        </label>
      </div>
    </div>
    <!-- <div class="row mt-3">
      <div class="col-12">
        <strong style="user-select: none">
          Detalles
        </strong>
      </div>
      <div class="col-12">
        <b-row class="pt-2">
          <b-col class="text-size" cols="12">

            <div> Alto: {{selectedGrupoCad.height}}mm </div>
            <div> Ancho: {{selectedGrupoCad.width}}mm </div>
            <div> Profundidad: {{selectedGrupoCad.z}}mm </div>
            
          </b-col>
          <b-col cols="12">
            
          </b-col>
        </b-row>
      </div>
    </div> -->
  </div>
</template>

<script>
import { EventBus } from '../../utils/event-bus'

export default {
  name: 'Module',
  data () {
    return {
      dragging: false,
      rotating: false,

      material: null,
      tapacanto: null,
      materialFondo: null,

      moveWithTraslationAxe: false,
      moveWithRotationAxe: false,
    }
  },
  props:{
    object: {
      type: Object,
      default: null,
    },
  },
  computed: {
  },
  methods: {
  },
  watch: {
    
  }
}
</script>

<style scoped>
.no-border{
  border: 0px;
}

.text-size{
  font-size: 11pt;
}

</style>
