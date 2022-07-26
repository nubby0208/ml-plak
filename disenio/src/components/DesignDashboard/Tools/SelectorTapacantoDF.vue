<template>
    <div>
        <select v-if="lado == 'izquierdo'" id="tcIzquierdo" v-model="tcIzquierdo" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
        <select v-if="lado == 'derecho'" id="tcDerecho" v-model="tcDerecho" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
        <select v-if="lado == 'superior'" id="tcSuperior" v-model="tcSuperior" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
        <select v-if="lado == 'inferior'" id="tcInferior" v-model="tcInferior" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
        </select>
    </div>
</template>

<script>
import editarTapacantoDFMixin from '@/components/EditarTapacantoDF.mixin'

export default {
    props: [ 'lado' ],
    mixins: [editarTapacantoDFMixin],
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