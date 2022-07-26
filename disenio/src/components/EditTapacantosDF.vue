<template>
<div>
    <!--<h4>Tapacantos:</h4>-->
    <table class="table table-bordered">
        
        <tr>
            <td>Tc. Derecho</td>
            <td>
                <select id="tcIzquierdo" v-model="tcIzquierdo" class="form-control form-control-sm">
                    <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Tc. Izquierdo</td>
            <td>
                <select id="tcDerecho" v-model="tcDerecho" class="form-control form-control-sm">
                    <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Tc. Superior</td>
            <td>
                <select id="tcSuperior" v-model="tcSuperior" class="form-control form-control-sm">
                    <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Tc. Inferior</td>
            <td>
                <select id="tcInferior" v-model="tcInferior" class="form-control form-control-sm">
                    <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
                </select>
            </td>
        </tr>
    </table>
</div>
</template>

<script>
import editarTapacantoDFMixin from '@/components/EditarTapacantoDF.mixin'
export default {
  mixins: [editarTapacantoDFMixin],
}
</script>