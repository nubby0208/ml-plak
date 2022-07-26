<template>
    <div>
        <div class="p-title">
            <div style="display:flex;">
                <h4>{{nombrePrincipal}} {{index}}</h4>
                <input type="checkbox" style="position: relative; top: 2px; height: 25px;" v-model="activoModel">
                <span style="font-size: 16pt; top: -4px; position: relative; left: 2px;" class="remove-btn" @click="eliminarLinea(index)">❌</span>
                <b-form-input v-model="nombreLinea" style="width: 222px; height: 28px; margin-left: auto;" placeholder="Nombre personalizado"></b-form-input>
            </div>
            
            <!-- <span class="multiplier" v-if="showMultipliers">Multiplicador:</span>
            <input
                v-model="premiumMultiplier"
                v-if="showMultipliers"
                @keyup="$emit('processContactMessage')"
            /> -->
        </div>
        <table class="premium">
            <!-- {{AlternativeMaterialList}} -->
            <thead class="text-left flex">
                <th class="cantidad-header">Cantidad</th>
                <th class="item-header">Item</th>
                <th class="precio-unidad-header">Precio por Unidad</th>
                <th class="precio-total-header">Total Item</th>
            </thead>
            <tbody>
                <tr v-for="item in materialList" :key="item.nombre" class="flex">
                <td class="cantidad-cell">
                    {{round(alternativeMaterialListComp[item.nombreOriginal].cantidad)}}
                    <span
                    v-if="getPlacas(alternativeMaterialListComp[item.nombreOriginal])"
                    class="placas-count"
                    >({{round(getPlacas(alternativeMaterialListComp[item.nombreOriginal]))}} placas)</span>
                </td>

                <!-- Selectores de piezas alternativas -->

                <td
                    class="service-label text-left flex"
                    v-if="alternativeMaterialListComp[item.nombreOriginal].nombre"
                >
                    <select
                    v-model="alternativeMaterialListComp[item.nombreOriginal].nombre"
                    class="presupuesto-select form-control form-control-sm"
                    v-if="alternativeMaterialListComp[item.nombreOriginal].tipo === 'material'"
                    v-on:change="alternativeMaterialTypeChange(alternativeMaterialListComp[item.nombreOriginal])"
                    >
                    <option
                        v-for="material in opcMaterialesSelect.availableMaterials"
                        :key="material.nombreOriginal"
                        :value="material.material"
                    >{{ material.material }}</option>
                    </select>

                    <select
                    v-model="alternativeMaterialListComp[item.nombreOriginal].nombre"
                    class="presupuesto-select form-control form-control-sm"
                    v-if="alternativeMaterialListComp[item.nombreOriginal].tipo === 'herraje'"
                    v-on:change="alternativeMaterialTypeChange(alternativeMaterialListComp[item.nombreOriginal])"
                    >
                    <option
                        v-for="herraje in opcMaterialesSelect.availableHerrajes"
                        :key="herraje.id"
                        :value="herraje.name"
                    >{{ herraje.name }}</option>
                    </select>

                    <select
                    v-model="alternativeMaterialListComp[item.nombreOriginal].nombre"
                    class="presupuesto-select form-control form-control-sm"
                    v-if="alternativeMaterialListComp[item.nombreOriginal].tipo === 'tapacanto'"
                    v-on:change="alternativeMaterialTypeChange(alternativeMaterialListComp[item.nombreOriginal])"
                    >
                    <option
                        v-for="tapacanto in opcMaterialesSelect.availableTapacantos"
                        :key="tapacanto.id"
                        :value="tapacanto.name"
                    >{{ tapacanto.name }}</option>
                    </select>

                    <select
                    v-model="alternativeMaterialListComp[item.nombreOriginal].nombre"
                    class="presupuesto-select form-control form-control-sm"
                    v-if="alternativeMaterialListComp[item.nombreOriginal].tipo === 'metal'"
                    v-on:change="alternativeMaterialTypeChange(alternativeMaterialListComp[item.nombreOriginal])"
                    >
                    <option
                        v-for="metalKit in opcMaterialesSelect.availableMetalesKit"
                        :key="metalKit.id"
                        :value="metalKit.material"
                    >{{ metalKit.material }}</option>
                    </select>
                </td>
                
                <!-- Selectores de piezas alternativas end -->
                
                <td
                    class="input-cell flex precio-unidad-cell"
                    v-if="alternativeMaterialListComp[item.nombreOriginal].nombre"
                >{{round(premiumMultiplier * alternativeMaterialListComp[item.nombreOriginal].value)}}</td>
                <td
                    class="input-cell flex precio-total-cell"
                    v-if="alternativeMaterialListComp[item.nombreOriginal].nombre"
                >{{round(alternativeMaterialListComp[item.nombreOriginal].value * alternativeMaterialListComp[item.nombreOriginal].cantidad * premiumMultiplier)}}</td>
                <td class="service-label text-left flex" v-if="!alternativeMaterialListComp[item.nombreOriginal].nombre">
                    <span>**MATERIAL SIN DEFINIR**</span>
                </td>
                </tr>
                <tr class="separation-row no-hover">
                <td colspan="4">
                    <div></div>
                </td>
                </tr>
                <tr v-for="item in servicesList" :key="item.nombre" class="flex">
                <td class="cantidad-cell flex">
                    <span class="remove-btn" @click="remove(item)">❌</span>
                    <input
                    class="custom form-input edit-count"
                    v-model="item.count"
                    v-on:change="changedPresupuesto('count', item)"
                    />
                </td>
                <td class="service-label text-left flex">
                    <span>{{item.nombre}}</span>
                    <span class="dotted-line"></span>
                </td>
                <td class="input-cell flex precio-unidad-cell precio-unidad-custom">
                    <input
                    class="custom form-input"
                    v-model="item.value"
                    v-on:change="changedPresupuesto('value', item)"
                    />
                </td>
                <td class="precio-total-cell">{{round(item.value * item.count * premiumMultiplier)}}</td>
                </tr>
                <tr class="no-hover" v-if="!adding">
                <td class="text-left">
                    <span @click="addOne()" class="add-another-one">
                    <span class="plus">+</span>Agregar otro
                    </span>
                </td>
                <td></td>
                <td></td>
                <td></td>
                </tr>
                <tr v-if="adding" class="flex">
                <td class="adding-count">
                    <input class="form-input" v-model="newItem.count" />
                </td>
                <td class="service-label text-left adding-name-cell flex">
                    <input class="form-input" v-model="newItem.nombre" />
                    <span class="dotted-line"></span>
                </td>
                <td class="input-cell flex">
                    <input class="form-input" style="height:27px;" v-model="newItem.value" />
                </td>
                <td class="adding-total-cell">{{newItem.value * newItem.count * premiumMultiplier}}</td>
                </tr>
                <tr v-if="adding" class="flex no-hover">
                <td>
                    <span class="cancel-btn btn" @click="cancel()">❌ Cancelar</span>
                    <span class="add-btn btn" @click="add()" :class="{disabled: newItemInvalid()}">
                    <span class="plus">+</span>Agregar
                    </span>
                </td>
                <td class="input-cell flex"></td>
                <td class="input-cell flex"></td>
                <td class="input-cell flex"></td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="no-hover">
                <td class="text-right" colspan="4">
                    <span class="total-label">Total:</span>
                    <span class="value-label">${{round(getTotal(true))}}</span>
                </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
    export default {
        props:[
            "opcMaterialesSelect",
            "materialList",
            "premiumMultiplier",
            "index",
            "servicesList",
            "showMultipliers",
            "round",
            "getPlacas",
            "AlternativeMaterialList",
            "changedPresupuesto",
            "add",
            "remove",
            "newItem",
            "eliminarLinea",
            "activo",
            "nombreLinea",
            "nombrePrincipal"
        ],
        data(){
            return {
                adding:false,
                AlternativeMaterialListLocal:this.AlternativeMaterialList,
                // activoModel: this.activo
            }
        },
        methods:{
            addOne(){
                this.adding = true;
            },
            cancel() {
                this.adding = false;
                this.newItem = {
                    nombre: "",
                    value: 0,
                    count: 0,
                };
            },
            newItemInvalid() {
                return (
                    !this.newItem.nombre ||
                    this.newItem.value === undefined ||
                    this.newItem.value === "" ||
                    isNaN(this.newItem.count) ||
                    isNaN(this.newItem.value)
                );
            },
            // changedPresupuesto(){

            // },
            // remove(item) {
                
            // },
            getTotal(isPremium) {
                const multiplier = this.premiumMultiplier;
                const materials = this.alternativeMaterialListComp;
                let total = 0;

                Object.values(materials).forEach((m) => {
                    if (m) {
                    total += +m.value * m.cantidad;
                    }
                });

                this.servicesList.forEach((s) => {
                    total += +s.value * s.count;
                });

                total *= multiplier;

                return total;
            },
            alternativeMaterialTypeChange(material){

                const element = this.getElement(material.nombre);
                material.value = element.precio_mt2 || element.precio_placa;

                if (!this.alternativeMaterialListComp[material.nombreOriginal]) {
                    this.alternativeMaterialListComp[material.nombreOriginal] = {};
                }

                this.alternativeMaterialListComp[material.nombreOriginal] = material;
                this.alternativeMaterialListComp = JSON.parse(JSON.stringify(this.alternativeMaterialListComp));
                // this.$set(this.alternativeMaterialListComp, material.nombreOriginal, material);
                // this.$emit('AlternativeMaterialListUpdate', JSON.parse(JSON.stringify(this.AlternativeMaterialList)));
            },
            getElement(material) {
                const list = this.opcMaterialesSelect.availableMaterials
                    .concat(this.opcMaterialesSelect.availableHerrajes)
                    .concat(this.opcMaterialesSelect.availableMetalesKit)
                    .concat(this.opcMaterialesSelect.availableTapacantos);
                return list.find(
                    (e) =>
                    e.material === material ||
                    e.nombre + " - " + e.material === material ||
                    e.nombre === material ||
                    e.material + " - " + e.nombre === material ||
                    e.material + " " + e.nombre === material
                );
            },
        },
        computed:{
            activoModel: {
                get(){
                    return this.activo
                },
                set(val){
                    this.$emit('updateLineaActiva', val);
                }
            },
            alternativeMaterialListComp: {
                get() {
                    let alternativeMaterials = this.AlternativeMaterialList;
                    let materials = JSON.parse(JSON.stringify(this.materialList));
                    let that = this;
                    Object.keys(this.materialList).forEach(function (material) {
                    if (!alternativeMaterials[materials[material].nombreOriginal]) {
                        alternativeMaterials[materials[material].nombreOriginal] =
                        materials[material];
                        alternativeMaterials[
                        materials[material].nombreOriginal
                        ].cantidad = that.round(
                        alternativeMaterials[materials[material].nombreOriginal].cantidad
                        );
                    }
                    });

                    // this.$emit('AlternativeMaterialListUpdate', alternativeMaterials);
                    return alternativeMaterials;
                },
                set(val) {
                    console.log(val);
                    this.$emit('AlternativeMaterialListUpdate', val);
                    // this.AlternativeMaterialList = val;
                },
            },
        },
        watch:{
            newItem(val){
                this.$emit('updateNewItem', val);
            },
            nombreLinea(val){
                this.$emit('updateNombreLinea', val);
            },
            // activoModel(val){
            //     this.$emit('updateLineaActiva', val);
            // }
        }
    }
</script>
<style scoped>

.auto-update {
  text-align: right;
  font-size: 15px;
}
thead {
  font-size: 14px;
}
.estado select {
  width: 85px;
}
.nombre {
  padding: 0px 8px !important;
}
.nowrap {
  white-space: nowrap;
}
.content {
  margin-top: 50px;
}
table {
  width: 1300px;
  /* position: relative; */
  left: -100px;
}
.header-cell {
  width: 185px;
}
.swal-title {
  margin: 0px;
  font-size: 16px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.21);
  margin-bottom: 28px;
}
.multiplier {
  font-size: 12px;
}
.multiplier-container {
  font-size: 13px;
  /* position: relative; */
  right: 60px;
  text-align: left;
  margin-top: 50px;
}
.template-controls {
  /* position: relative; */
  right: 60px;
  text-align: left;
  margin-top: 50px;
}
.pieces-count {
  font-weight: bold;
}
.placas-count {
  font-size: 12px;
}
.adding-name-cell input {
  width: 175px !important;
  height: 27px;
  left: 75px;
  /* position: relative; */
}
.adding-count {
  /* position: relative; */
  right: 40px;
}
.cantidad-header {
  /* position: relative; */
  right: 50px;
}
.restart {
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
}
.restart:hover {
  text-decoration: underline;
}

.cantidad-cell {
  width: 150px;
  margin-right: 10px;
  left: -80px;
  /* position: relative; */
}
.adding-total-cell {
  width: 105px;
}
.item-header {
  flex: 1;
  /* position: relative; */
  left: 25px;
  margin-left: 90px;
}
.precio-unidad-header {
  /* position: relative; */
  right: 35px;
  width: 100px;
  text-align: center;
  font-size: 12px;
}
.precio-total-header {
  /* position: relative; */
  font-size: 13px;
  width: 80px;
}
.precio-unidad-cell {
  width: 90px;
}
.presupuesto {
  margin-top: 20px;
}
.presupuesto table input {
  width: 75px;
}
.presupuesto-select {
  height: 25px;
  padding: 0px 0px 0px 10px;
  font-size: 14px;
}
.presupuesto table input.custom,
.input-custom {
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  height: 19px;
}
.presupuesto table input.custom:focus,
.input-custom:focus {
  border-bottom: 1px solid #17a2b894;
}
.precio-total-cell {
  width: 90px;
  justify-content: center;
}
.presupuesto table input.edit-count {
  width: 60px;
  /* position: relative; */
  left: 15px;
}
.service-label {
  flex: 1;
  /* position: relative; */
  right: 75px;
}
.total-label {
  /* position: relative; */
  right: 160px;
}
.value-label {
  /* position: relative; */
  right: 80px;
  top: -35px;
  font-weight: 600;
  font-size: 20px;
}
.presupuesto table {
  width: 630px;
  margin: 0 auto;
}
.presupuesto-container {
  margin-top: 15px;
  margin-right: 10px;
}
.presupuesto-container .p-title {
  margin-bottom: 20px;
  text-align: left;
}
.p-title input {
  height: 20px;
  font-size: 12px;
  width: 40px;
  text-align: center;
}
.flex {
  display: flex;
}
.text-left {
  text-align: left;
}
.presupuesto table thead {
  margin-bottom: 5px;
  font-size: 17px;
}
.presupuesto table tr {
  min-width: 600px;
  height: 25px;
  transition: all 400ms ease-in-out;
}
.presupuesto table tr:hover {
  background-color: #03a9f41c;
  font-weight: bold;
}
.presupuesto table tr.no-hover:hover {
  background-color: transparent !important;
  font-weight: initial !important;
}
.presupuesto table tbody {
  font-size: 14px;
  cursor: default;
}
tfoot span {
  padding-top: 7px;
  display: inline-block;
}
.shadow {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.dotted-line {
  display: inline-block;
  border-bottom: 1px dotted #ccc;
  margin-bottom: 6px;
  flex: 1;
  margin-left: 5px;
}
.align-center {
  align-items: center;
  align-content: center;
}
.add-another-one {
  cursor: pointer;
  font-size: 16px;
}
.plus {
  font-weight: bold;
  color: #3aa051;
  font-size: 25px;
  margin-top: 2px;
  line-height: 1;
  vertical-align: bottom;
  margin-right: 5px;
}
.btn {
  font-weight: bold;
  margin-right: 5px;
}
.cancel-btn {
  padding: 0px;
}
.remove-btn {
  /* position: relative; */
  right: -15px;
  cursor: pointer;
  font-size: 10px;
  margin-top: 3px;
  margin-right: 3px;
  width: 25px;
}
.justify-evenly {
  justify-content: space-evenly;
}
.separation-row div {
  height: 5px;
  margin: 10px 80px;
  background-color: #ccc;
  border-radius: 5px;
}
.disabled {
  cursor: not-allowed;
}
.imagen-client {
  position: absolute;
  transition: transform .2s;
  cursor: pointer;
}
#modal-image figure{
  max-height: 78vh;
  overflow-y: auto;

}
.imagen-client:hover img {
  transform: scale(1.1);
}

.remove-button {
  position: absolute;
  font-size: 20px;
  height: 25px;
  line-height: 1;
  width: 21px;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid transparent;
  transition: background-color .25s, border-color 5s;
}
.remove-button:hover {
  border-color: rgb(195 67 67 / 80%);
  background: rgb(195 67 67 / 50%);
  color: white;
}
.remove-image-button {
  color: white;
  right: 4px;
  top: 5px;
}
.financiacion,
.message {
  text-align: initial;
  right: 20%;
  margin-top: 20px;
  margin-bottom: 100px;
  /* position: relative; */
}
.financiacion-container,
.message-container {
  display: flex;
}
.financiacion h5,
.message h5 {
  /* position: relative; */
  width: 135px;
  margin-top: 15px;
}
.financiacion-item input {
  width: 50px;
}
.financiacion-item .cancel-btn {
  font-size: 12px;
}
.financiacion-item {
  font-size: 15px;
  padding: 15px;
  transition: all 300ms ease-in-out;
}
.financiacion-item:hover {
  background-color: #cccccc26;
}
.financiacion-item .input-custom {
  text-align: center;
}
.financiacion-item .details {
  margin-left: 45px;
}
.hold {
  border: solid 5px #ccc;
}
.fill {
  position: relative;
  height: 150px;
  width: 150px;
  top: 5px;
  left: 5px;
  cursor: pointer;
}

.empty {
  display: inline-block;
  height: 160px;
  width: 160px;
  margin: 10px;
  border: solid 3px salmon;
  background: white;
}

.hovered {
  background: #f4f4f4;
  border-style: dashed;
}

.no-financiacion {
  margin-top: 15px;
}
.no-financiacion span {
  margin-left: 20px;
  font-weight: bold;
  color: #646467;
}
.pointer {
  cursor: pointer;
}
.add-cuota {
  margin-left: 155px;
}
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.financiacion-presupuesto {
  font-weight: bold;
}
.label-premium {
  color: #b59903;
  font-weight: bold;
}
.message-text {
  width: 650px;
  height: 500px;
}
.justify-center {
  justify-content: center;
}
.message-content {
  margin-top: 15px;
}

.bg-lightblue {
  background: #007bff;
}
#pdf {
  position: relative;
  min-height: 29.7cm;
  width: 21cm;
  color: #555555;
  background: #ffffff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 12px;
  padding: 30px;
  overflow: hidden;
}
.header-pdf {
  padding: 10px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #aaaaaa;
}

.table-pdf {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
  margin-top: 8px;
}

.table-pdf th,
.table-pdf td {
  padding: 10px !important;
  background: #eeeeee;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

.table-pdf th {
  white-space: nowrap;
  font-weight: normal;
}

.table-pdf td {
  text-align: right;
}

.table-pdf td h3 {
  color: #57b223;
  font-size: 1em;
  font-weight: normal;
  margin: 0 0 0.2em 0;
}

.table-pdf .no {
  color: #ffffff;
  font-size: 1.4em;
  background: #57b223;
}

.table-pdf .desc {
  text-align: left;
}

.table-pdf .unit {
  background: #dddddd;
}

.table-pdf .qty {
}

.table-pdf .total {
  background: #999999;
  color: #ffffff;
}

.table-pdf td.unit,
.table-pdf td.qty,
.table-pdf td.total {
  text-align: center;
  font-size: 1em;
}

.table-pdf tbody tr:last-child td {
  border: none;
}

.p-100 {
  padding-right: 110px;
}

.table-pdf tfoot td {
  padding: 10px 20px;
  background: #ffffff;
  border-bottom: none;
  font-size: 1em;
  white-space: nowrap;
  border-top: 1px solid #aaaaaa;
}

.table-pdf tfoot tr:first-child td {
  border-top: none;
}

.table-pdf tfoot tr:last-child td {
  color: #57b223;
  font-size: 1.2em;
  border-top: 1px solid #57b223;
}

.table-pdf tfoot tr td:first-child {
  border: none;
}
</style>