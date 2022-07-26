<template>
<div>
  <div class="bordered-container" v-if="!withDivision()">
    <div class="flex">
      <div class="container-title not-printable"  @click="containerExpandedTapacantos = !containerExpandedTapacantos">
        <span class="container-toggler less" v-if="containerExpandedTapacantos">▲</span>
        <span class="container-toggler more" v-else>▼</span>
        Tapacantos
      </div>
    </div>
    <div class="bordered-section" :class="{'uncollapsed': !containerExpandedTapacantos}">
      <div class="flex flex-column margin-bottom-10">
        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcIzquierdo">Izquierdo</label>
          <select id="tcIzquierdo" v-model="tcIzquierdo">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcDerecho">Derecho</label>
          <select id="tcDerecho" v-model="tcDerecho">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcSuperior">Superior</label>
          <select id="tcSuperior" v-model="tcSuperior">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcInferior">Inferior</label>
          <select id="tcInferior" v-model="tcInferior">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="bordered-container" v-if="withDivision()">
    <div class="flex">
      <div class="container-title not-printable"  @click="containerExpandedTapacantosTrasero = !containerExpandedTapacantosTrasero">
        <span class="container-toggler less" v-if="containerExpandedTapacantosTrasero">▲</span>
        <span class="container-toggler more" v-else>▼</span>
        Tapacantos Trasero
      </div>
    </div>
    <div class="bordered-section" :class="{'uncollapsed': !containerExpandedTapacantosTrasero}">
      <div class="flex flex-column margin-bottom-10">
        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcIzquierdo1">Izquierdo</label>
          <select id="tcIzquierdo1" v-model="tcIzquierdo1">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcDerecho1">Derecho</label>
          <select id="tcDerecho1" v-model="tcDerecho1" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcSuperior1">Superior</label>
          <select id="tcSuperior1" v-model="tcSuperior1" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcInferior1">Inferior</label>
          <select id="tcInferior1" v-model="tcInferior1" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="bordered-container" v-if="withDivision()">
    <div class="flex">
      <div class="container-title not-printable"  @click="containerExpandedTapacantosDelantero = ! containerExpandedTapacantosDelantero">
        <span class="container-toggler less" v-if="containerExpandedTapacantosDelantero">▲</span>
        <span class="container-toggler more" v-else>▼</span>
        Tapacantos Delantero
      </div>
    </div>
    <div class="bordered-section" :class="{'uncollapsed': !containerExpandedTapacantosDelantero}">
      <div class="flex flex-column margin-bottom-10">
        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcIzquierdo2">Izquierdo</label>
          <select id="tcIzquierdo2" v-model="tcIzquierdo2" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcDerecho2">Derecho</label>
          <select id="tcDerecho2" v-model="tcDerecho2" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcSuperior2">Superior</label>
          <select id="tcSuperior2" v-model="tcSuperior2" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcInferior2">Inferior</label>
          <select id="tcInferior2" v-model="tcInferior2" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import editarTapacantoMixin from '@/components/EditarTapacanto.mixin'
export default {
  mixins: [editarTapacantoMixin],
}
</script>
