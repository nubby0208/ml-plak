<template>
    <div>
        <div>
            <table>
                <tr><td colspan="4"><span class="ComponentTitle">Notas de Acción</span></td></tr>
                <tr><td>&nbsp;</td></tr>
            </table>
        </div>
        <div class="row">
            <div class="col-8 text-left">
                <table>
                    <tr>
                        <td><label v-bind:class="{ error: !validName() }">Nombre:</label></td>
                        <td><input type="text" v-bind:class="{ error: !validName() }" class="form-control form-control-sm" v-model="actionNote.name"></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                          <label>Descripción:</label>
                          <textarea class="form-control form-control-sm" v-model="actionNote.description" name="textarea" rows="5" cols="50"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Módulo:</label></td>
                        <td aling=left>
                            <select v-model="actionNote.orig_modulo_id">
                              <option value="0">Seleccionar</option>
                              <option :value="m.value"  v-for="m in mods" v-bind:key="m.value">{{m.name}}</option>
                            </select>
                        </td>
                    </tr>
              </table>
            </div>
            <div class="pieces col-4">
                <span class="subtitle">Lista de Notas</span>
                <hr>
                <div class="container text-left" v-if="actionNotes">
                  <div class="row" v-for="(note, index) in actionNotes" :key="index">
                    <div class="col-sm">
                      <span v-if="estadoProyecto != 'Exportado'" @click="deleteNote(note)" title="Borrar nota" class="delete-icon icon" style="cursor: pointer">❌</span>
                      <span v-if="estadoProyecto != 'Exportado'" @click="editNote(note)" title="Editar nota" class="edit-icon" style="cursor: pointer">✎</span>
                      <span>&nbsp;{{note.name}} - Mod.: {{(!note.orig_modulo_id)? "Todos" : note.orig_modulo_id}}</span>
                    </div>
                  </div>
                </div>
                <div class="text-left" v-else>No hay Notas disponibles...</div>
            </div><br>
            <div v-if="!validName()" style="margin: 0 auto">
              <span class="error-msg">El nombre de la nota no puede contener comas ni puntos</span>
            </div>
            <div style="margin: 0 auto">
              <button class="btn btn-secondary btn-sm" @click="reset()" v-if="actionNote.name && estadoProyecto != 'Exportado'">Agregar</button>
              <button class="btn btn-primary btn-sm" @click="saveNote()" v-if="estadoProyecto != 'Exportado'">{{buttonMainTitle}}</button>
              <button class="btn btn-danger btn-sm" @click="closeNote()">Cerrar</button>
            </div>
        </div>
        <br>
        <div class="text-left"><b>Proyecto: </b>{{loadedProjectId}} - {{loadedProjectName}} - <b>Estado del Proyecto: </b> {{estadoProyecto}}</div>
    </div>
</template>

<script>
import swal from 'sweetalert2'
import { HTTP } from "./../../../index";

export default {
  data () {
    return {
      actionNote: {
         name: '',
         description: '',
         orig_modulo_id: 0,
         token_project: '',
         created_by:'',
         created_at:'',
         updated_at:'',
      },
      mods: [],
      buttonMainTitle: 'Guardar y Agregar',
      buttonSecondaryTitle: '',
      selectedModule: 0,
      currentModuleId: 1,
      updateIndex: 0,
      actionNotes: [],
      actionNoteObj: undefined
    }
  },
  methods: {
    validName () {
      if (!this.actionNote.name) {
        return true
      }
      return this.actionNote.name.indexOf(',') === -1 && this.actionNote.name.indexOf('.') === -1
    },
    getUserAuthenticated()
    {
     const userAuthenticated =
        localStorage.getItem("token") &&
        localStorage.getItem("user-name") &&
        localStorage.getItem("user-id") &&
        localStorage.getItem("user-rol");

      if (userAuthenticated) {
        return localStorage.getItem("user-name");
      }
    },
    loadNotes () {
      HTTP.get("/api/action_notes/allOrig/" + this.$store.state.info.token_project)
      .then((result) => {
          if (result.data.success) {
            console.log(result.data)
            this.actionNotes = result.data.actionnotes
          }
        })
       .catch((result) => {
          alert("¡Error al cargar datos!");
       });
    },
    deleteNote (note) {
      swal({
        title: 'Seguro que desea borrar la nota ' + note.name + '?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
          if (result.value) {
            //Eliminar de la DB
              console.log("Eliminando en Db");
              HTTP.delete(`/api/action_notes/${note.id}`).then(
                (response) => {
                  if (response.data.success) {
                    alert("Nota eliminada con éxito!");
                    this.loadNotes();
                  }
                });
            }
          //---------------------------------------------
        });
    },
    saveNote () {
      //this.$store.commit('addCustomPart', { piece: this.currentPart, module: this.currentModuleId })

      if (this.updateIndex==0) { //Agregar Nuevas Notas
        let note = {
          name: this.actionNote.name,
          description: this.actionNote.description,
          orig_modulo_id: this.actionNote.orig_modulo_id,
          token_project: this.$store.state.info.token_project,
          created_by: this.getUserAuthenticated(),
          updated_by: this.getUserAuthenticated()
        }
        HTTP.post("/api/action_notes", note)
          .then((result) => {
            if (result.data.success) {
              alert("¡Notas guardadas correctamente!");
              this.loadNotes()
              this.reset();
            }
          })
          .catch((result) => {
            console.log(result)
            alert("¡Error al guardar los datos!");
          });
      }
      else {
        let note = {
          name: this.actionNote.name,
          description: this.actionNote.description,
          orig_modulo_id: this.actionNote.orig_modulo_id,
          token_project: this.$store.state.info.token_project,
          updated_by: this.getUserAuthenticated(),
          exported: 0
        }
        HTTP.put("/api/action_notes/" + this.updateIndex, note)
        .then((result) => {
          if (result.data.success) {
            alert("¡Notas actualizadas correctamente!");
            this.loadNotes()
            this.updateIndex=0
            this.reset();
            console.log("result", result, note);
          }
        })
        .catch((err) => {
          alert("Error al guardar las notas");
          });
        }
    },
    closeNote(){
      this.$swal.close()
    },
    editNote (note) {
      this.updateIndex = note.id
      this.actionNote.name = note.name
      this.actionNote.description = note.description
      this.actionNote.orig_modulo_id = note.orig_modulo_id
      this.buttonMainTitle = 'Guardar Cambios'
      this.buttonSecondaryTitle = 'Guardar Cambios'
    },
    reset () {
      this.actionNote.name =''
      this.actionNote.description = ''
      this.actionNote.orig_modulo_id = 0
      this.buttonSecondaryTitle = ''
      this.buttonMainTitle = 'Guardar y Agregar'
      this.updateIndex = 0
    },
  },
  computed: {
    loadedProjectId: {
      get() {
        return localStorage.getItem("projectID") || undefined;
      },
      set(value) {
        localStorage.setItem("projectID", value);
      },
    },
    loadedProjectName: {
      get() {
        return localStorage.getItem("projectName") || undefined;
      },
      set(value) {
        localStorage.setItem("projectName", value);
      },
    },
    estadoProyecto: {
       get() {
          return this.$store.state.info.estadoProyecto;
       },
       set(value) {
         this.$store.commit('setGeneralInfo', { key: 'estadoProyecto', value: value })
       },
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
  },
  mounted () {
    //this.currentPart = Object.assign({}, this.currentPart, { Orientacion: 2, Espesor: this.EspesorGeneral, X: 0, Y: 0, Z: 0, Count: 1 })
    this.currentModuleId = this.$store.getters.selectedModule.moduleId
    this.mods = this.modules
    this.loadNotes ()
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

.edit-icon {
  display: inline-block;
  transform: rotateZ(90deg);
}

.swal2-container {
  z-index: 99999 !important;
}
</style>
