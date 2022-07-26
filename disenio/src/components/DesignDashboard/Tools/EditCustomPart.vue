<template>
    <div>
        <div>
            <table>
                <tr><td colspan="4"><span class="ComponentTitle">Piezas Manuales</span></td></tr>
                <tr><td>&nbsp;</td></tr>
            </table>
        </div>
        <div class="row">
            <div class="col-9">
                <table>
                    <tr>
                        <td><label>Cantidad:</label></td>
                        <td><input type="number" class="form-control form-control-sm" v-model="currentPart.Count" disabled="disabled"></td>
                        <td><label v-bind:class="{ error: !validName() }">Nombre:</label></td>
                        <td><input @keyup="actualizar" v-bind:class="{ error: !validName() }" class="form-control form-control-sm" v-model="currentPart.Name"></td>
                    </tr>
                    <tr>
                        <td><label>L Veta:</label></td>
                        <td><input @keyup="actualizar" type="number" class="form-control form-control-sm" v-model="currentPart.LVeta"></td>
                        <td><label>A Veta:</label></td>
                        <td><input @keyup="actualizar" type="number" class="form-control form-control-sm" v-model="currentPart.AVeta"></td>
                    </tr>

                    <tr>
                        <td><label>Material:</label></td>
                        <td> 
                            <select @change="actualizar" v-model="currentPart.material" class="form-control form-control-sm">
                              <option v-for="material in availableMaterials" :key="material" :value="material">{{ material }}</option>
                            </select>
                        </td>
                        <td><label>Orientacion:</label></td>
                        <td>
                            <select @change="actualizar" v-model="currentPart.Orientacion" class="form-control form-control-sm">
                                <option :value="1">1: Vertical de corte</option>
                                <option :value="2">2: Horizontal de corte</option>
                                <option :value="3">3: Vertical de frente</option>
                                <option :value="4">4: Horizontal de frente</option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td><label>Espesor:</label></td>
                        <td><input @keyup="actualizar" class="form-control form-control-sm" v-model="currentPart.Espesor"></td>
                        <td><label>X:</label></td>
                        <td><input @keyup="actualizar" class="form-control form-control-sm" v-model="currentPart.X"></td>
                    </tr>
                    <tr>
                        <td><label>Y:</label></td>
                        <td><input @keyup="actualizar" class="form-control form-control-sm" v-model="currentPart.Y"></td>
                        <td><label>Z:</label></td>
                        <td><input @keyup="actualizar" class="form-control form-control-sm" v-model="currentPart.Z"></td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                      <td v-if="moduleCount > 1"><label>Modulo:</label></td>
                      <td v-if="moduleCount > 1">
                          <select @change="actualizar" v-model="currentModuleId" class="form-control form-control-sm">
                            <option :value="m.value" v-for="m in modules" v-bind:key="m.value">{{m.name}}</option>
                          </select>
                      </td>
                      <td><label for="girar-veta">Girar Veta:</label></td>
                      <td>
                        <input type="checkbox" v-model="currentPart.girarVeta" id="girar-veta" name="girar-veta"/>
                      </td>
                    </tr>
                    <tr><td>&nbsp;</td></tr>
              </table>
              <table>
                  <tr>
                      <td v-if="tapacantoSelet == 'izquierdo'">
                          <label>T/C Izq:
                          </label>
                      </td>
                      <td>
                      <select @change="$root.$emit('tapacantoSelectEvent', null)" v-if="tapacantoSelet == 'izquierdo'"  v-model="currentPart.tapacantos.izquierdo" class="form-control form-control-sm">
                            <option v-for="tapacanto in availableTapacantos" :key="tapacanto" :value="tapacanto">{{ tapacanto }}
                            </option>
                          </select>
                      </td>
                      <td v-if="tapacantoSelet == 'derecho'">
                          <label>T/C Der:
                          </label>
                      </td>
                      <td v-if="tapacantoSelet == 'derecho'">
                          <select @change="$root.$emit('tapacantoSelectEvent', null)" v-model="currentPart.tapacantos.derecho" class="form-control form-control-sm">
                              <option v-for="tapacanto in availableTapacantos" :key="tapacanto" :value="tapacanto">{{ tapacanto }}
                              </option>
                          </select>
                      </td>
                  </tr>
                  <tr>
                      <td v-if="tapacantoSelet == 'superior'">
                          <label>T/C Sup:
                          </label>
                      </td>
                      <td v-if="tapacantoSelet == 'superior'">
                          <select @change="$root.$emit('tapacantoSelectEvent', null)" v-model="currentPart.tapacantos.superior" class="form-control form-control-sm">
                              <option v-for="tapacanto in availableTapacantos" :key="tapacanto" :value="tapacanto">{{ tapacanto }}
                              </option>
                          </select>
                      </td>
                      <td v-if="tapacantoSelet == 'inferior'">
                          <label>T/C Inf:
                          </label>
                      </td>
                      <td v-if="tapacantoSelet == 'inferior'">
                          <select @change="$root.$emit('tapacantoSelectEvent', null)" v-model="currentPart.tapacantos.inferior" class="form-control form-control-sm">
                              <option v-for="tapacanto in availableTapacantos" :key="tapacanto" :value="tapacanto">{{ tapacanto }}
                              </option>
                          </select>
                      </td>
                  </tr>
                  <br>
              </table>
              <calco-container :id="currentPart"></calco-container>
            </div>
            <div class="pieces col-3">
                <span class="subtitle">Piezas</span>
                <div v-if="moduleCount > 1">
                  <span>Ver</span>
                  <select v-model="selectedModule">
                    <option value="-1">Todas las piezas</option>
                    <option :value="m.value"  v-for="m in modules" v-bind:key="m.value">{{m.name}}</option>
                  </select>
                </div>
                <div class="pieza" v-for="o in getPartsListFilter"  v-bind:key="o.name">
                  <span @click="deleteCustom(o)" title="Borrar pieza" class="delete-icon icon">❌</span>
                  <span @click="cloneCustom(o)" title="Clonar pieza" class="clone-icon icon">◀️</span>                  
                  <span class="pieza-name" @click="load(o)">{{o.name}}<span class="mod-label">- {{o.moduleName}}</span></span>
                  <div class="calco-overlay">
                    <calco-container ref="calco" :id="o"></calco-container>
                    <div class="calco-overlay-name">{{o.name}}</div>
                  </div>
                </div>
            </div>
            <div v-if="!validName()" style="margin: 0 auto">
              <span class="error-msg">El nombre de la pieza no puede contener comas ni puntos</span>
            </div>
            <div style="margin: 0 auto">
              <button class="btn btn-sm" @click="reset()" v-if="currentPart.Name">Limpiar para agregar nueva pieza</button>
              <button class="btn btn-primary btn-sm" @click="addCustom()" :disabled="!currentPart.Name || !validName() || !this.currentPart.LVeta || !currentPart.AVeta">{{buttonSecondaryTitle}}</button>
              <button class="btn btn-primary btn-sm" @click="addCustom(true)" :disabled="!this.currentPart.Name || !validName() || !this.currentPart.LVeta || !currentPart.AVeta">{{buttonMainTitle}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert2'
import { Part } from './models/models'

export default {
  data () {
    return {
      currentPart: new Part(),
      buttonMainTitle: 'Agregar',
      buttonSecondaryTitle: 'Guardar y agregar otro',
      selectedModule: -1,
      currentModuleId: 1,
      loadBool:false,
      tapacantoSelet:"",
      tiempoTecleado:null
    }
  },
  methods: {
    actualizar(){
      if(!(!this.currentPart.Name || !this.validName() || !this.currentPart.LVeta || !this.currentPart.AVeta)){
        this.$store.dispatch('addCustomPartAction', { piece: this.currentPart, module: this.currentModuleId }).then(b=>{
          console.log({load:this.loadBool, indice:this.getPartsList.findIndex(a=>a.id == this.loadBool), getPartsList:this.getPartsList});
          this.load(this.getPartsList[this.getPartsList.findIndex(a=>a.id == b)]);
        });
      }
    },
    validName () {
      if (!this.currentPart.Name) {
        return true
      }
      return this.currentPart.Name.indexOf(',') === -1 && this.currentPart.Name.indexOf('.') === -1
    },
    cloneCustom(pieza) {
      console.log("cloneCustom");
      this.loadBool = false;
      this.reset()
      this.currentPart = Object.assign({}, pieza)
      this.currentPart.moduleId = this.currentPart.id = undefined
      this.currentPart.Espesor = pieza.Espesor || pieza.size
      this.currentPart.girarVeta = pieza.girarVeta
      this.currentModuleId = pieza.moduleId
      delete this.currentPart.name
      delete this.currentPart.Name
    },
    deleteCustom (pieza) {
      console.log("deleteCustom");
      this.loadBool = false;
      swal({
        title: 'Seguro que desea borrar la pieza ' + pieza.name + '?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.$store.commit('deleteCustomPart', pieza.id)
          if (this.currentPart.Name === pieza.Name) {
            this.reset()
          }
        }
      })
    },
    addCustom (close) {
      console.log("addCustom");
      this.loadBool = false;
      this.$store.commit('addCustomPart', { piece: this.currentPart, module: this.currentModuleId })
      if (close) {
        this.$swal.close()
      } else {
        this.reset()
      }
    },
    load (pieza) {
      // this.reset();
      this.loadBool = true;
      this.currentPart = Object.assign({}, pieza)
      // this.currentPart = pieza
      this.$set(this.currentPart, 'Name', pieza.name);
      this.$set(this.currentPart, 'Espesor', pieza.size);
      this.buttonMainTitle = 'Guardar cambios y cerrar'
      this.buttonSecondaryTitle = 'Guardar cambios'
      this.currentModuleId = pieza.moduleId
    },
    reset () {
      console.log("reset");
      this.loadBool = false;
      this.currentPart = new Part()
      this.currentPart = Object.assign({}, this.currentPart, { Orientacion: 2, Espesor: this.EspesorGeneral, X: 0, Y: 0, Z: 0, Count: 1 })
      this.buttonSecondaryTitle = 'Guardar y agregar otro'
      this.buttonMainTitle = 'Agregar'
    },
  },
  watch: {
    availableMaterials: function (newValue, oldValue) {
      return newValue
    },
    availableTapacantos: function (newValue, oldValue) {
      return newValue
    },
    currentPart:{
      handler(){
        if(!(!this.currentPart.Name || !this.validName() || !this.currentPart.LVeta || !this.currentPart.AVeta)){
          if(!this.loadBool){
              // this.addCustom();
              // this.load(this.getPartsList[this.getPartsList.length-1]);
          }
        }
      },
      deep:true
    }
  },
  computed: {
    getPartsList () {
      if (Number(this.selectedModule) === -1) {
        return this.customParts
      }
      return this.customParts.filter((part) => part.moduleId === Number(this.selectedModule))
    },
    getPartsListFilter () {
      return this.getPartsList.sort((part, part2) => {
        return part.name.toLowerCase().localeCompare(part2.name.toLowerCase());
      })
    },
    customParts () {
      console.log(this.$store.getters.getCustomParts);
      return this.$store.getters.getCustomParts
    },
    moduleSettings () {
      return this.$store.getters.selectedModule.settings
    },
    moduleCount () {
      return this.$store.getters.moduleCount
    },
    modules () {
      let mods = []
      for (let i = 1; i < this.moduleCount + 1; i++) {
        mods.push({ value: i, name: 'Modulo ' + i })
      }
      return mods
    },
    EspesorGeneral () {
      return this.moduleSettings.EspesorGeneral
    },
    availableMaterials () {
      let materiales = []
      if (this.$store.state.general.materiales_add) {
        materiales = JSON.parse(this.$store.state.general.materiales_add).map(m => m.material)
      }
      return materiales
    },
    availableTapacantos () {
      let tapacantos = []
      if (this.$store.state.general.tapacantos_add) {
        tapacantos = JSON.parse(this.$store.state.general.tapacantos_add).map(m => m.nombre)
      }
      return tapacantos
    }
  },
  mounted () {
    this.$store.commit('clearSelectionMod', null);
    this.currentPart = Object.assign({}, this.currentPart, { Orientacion: 2, Espesor: this.EspesorGeneral, X: 0, Y: 0, Z: 0, Count: 1 })
    this.currentModuleId = this.$store.getters.selectedModule.moduleId
    this.$root.$on("tapacantoSelectEvent", (valor)=>{
      this.tapacantoSelet = valor;
    });
  }
}
</script>

<style scoped lang="scss">
.ComponentTitle {
    text-decoration: underline;
    font-weight: bold;
    font-size: 3vh;
}
table{
  margin: auto;
}
ul{
    font-size: 12px;
}
.subtitle{
    font-weight: bolder;
}

.pieza {
  display:flex;

  .calco-overlay {
    visibility: hidden;
    background: white;
    border: 1px solid #8e8e8e;
    position: absolute;
    padding: 10px;
    left: 150px;
  }

  &:hover {
    .calco-overlay {
      visibility: visible;
    }
  }
}

.pieza:hover {
  cursor: pointer;
  background-color: #7b427b75;
}

.pieza-name {
  flex: 1;
}

.mod-label {
  font-size: 10px;
  color: #ccc;
  margin-left: 5px;
}

.icon {
  float:left;
  position:relative;
  margin-left:5px;
}

.error-msg {
  margin: 0 auto;
  padding-bottom: 10px;
  color: red;
}

.error {
  border-color: red;
  color: red;
  box-shadow: none;
}

</style>
<style>
.swal2-container {
  z-index: 99999 !important;
}
</style>