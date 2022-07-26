<template>
<div>
  <div class="bordered-container" v-if="!withDivision()">
    <div class="flex flex-column margin-bottom-10">
    <div v-if="lado == 'izquierdo'" class="flex align-items-center hover-line ml-control">
        <select id="tcIzquierdo" v-model="tcIzquierdo">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>

    <div v-if="lado == 'derecho'" class="flex align-items-center hover-line ml-control">
        <select id="tcDerecho" v-model="tcDerecho">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>

    <div v-if="lado == 'superior'" class="flex align-items-center hover-line ml-control">
        <select id="tcSuperior" v-model="tcSuperior">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>

    <div v-if="lado == 'inferior'" class="flex align-items-center hover-line ml-control">
        <select id="tcInferior" v-model="tcInferior">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>
    </div>
  </div>

  <div class="bordered-container" v-if="withDivision()">
    <div class="flex flex-column margin-bottom-10">
        <div class="flex align-items-center hover-line ml-control">
            <select v-if="lado == 'izquierdoT'" id="tcIzquierdo1" v-model="tcIzquierdo1">
                <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
            </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
            <select v-if="lado == 'derechoT'" id="tcDerecho1" v-model="tcDerecho1" class="form-control form-control-sm">
                <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
            </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
            <select v-if="lado == 'superiorT'" id="tcSuperior1" v-model="tcSuperior1" class="form-control form-control-sm">
                <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
            </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
            <select v-if="lado == 'inferiorT'" id="tcInferior1" v-model="tcInferior1" class="form-control form-control-sm">
                <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
            </select>
        </div>
    </div>
  </div>

  <div class="bordered-container" v-if="withDivision()">
    <div class="flex flex-column margin-bottom-10">
    <div class="flex align-items-center hover-line ml-control">
        <select v-if="lado == 'izquierdoD'" id="tcIzquierdo2" v-model="tcIzquierdo2" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>

    <div class="flex align-items-center hover-line ml-control">
        <select v-if="lado == 'derechoD'" id="tcDerecho2" v-model="tcDerecho2" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>

    <div class="flex align-items-center hover-line ml-control">
        <select v-if="lado == 'superiorD'" id="tcSuperior2" v-model="tcSuperior2" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>

    <div class="flex align-items-center hover-line ml-control">
        <select v-if="lado == 'inferiorD'" id="tcInferior2" v-model="tcInferior2" class="form-control form-control-sm">
        <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>
    </div>
  </div>
</div>
</template>

<script>
import editarTapacantoMixin from '@/components/EditarTapacanto.mixin'

export default {
    props: [ 'lado' ],
    mixins: [editarTapacantoMixin],
    updated(){
        this.$swal.close();
    }
}
</script>
<style scoped>
    select{
        width: 100%;
        height: 50px;
    }
</style>