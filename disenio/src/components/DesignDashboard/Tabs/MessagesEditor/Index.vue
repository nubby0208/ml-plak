<template>
<div class="editor-section">
  <h4>Editor de Mensajes</h4>
    <!-- GLOSARIO -->
    <div class="glossary">
        <h6>Etiquetas</h6>
        <span>Las etiquetas seran reemplazadas por el valor correspondiente en el texto final. Para utilizar una etiqueta haga click en ella o escribala en el editor de texto.</span>
        <div class="filter medium-font">
            Filtrar: <input type="text" v-model="filter" v-on:keyup="filterPlaceholders()" class="form-control form-control-sm">
        </div>
        <div class="placeholders-container">
            <div v-for="(placeholder, index) in filteredPlaceholders" :key="index" class="placeholder-item">
                <span class="placeholder-key" @click="usePlaceholder(placeholder)" v-bind:title="placeholder.value">{{placeholder.key}}</span>: <span class="medium-font">{{placeholder.description}}</span>
                <span class="icon edit" @click="editPlaceholder(placeholder)">✏️</span>
                <span class="icon delete" @click="deletePlaceholder(placeholder.key)">🗑️</span>
            </div>
        </div>
        <div class="create-placeholder">
          <button class="btn btn-link btn-sm" @click="createPlaceholder()">Crear etiqueta</button>
        </div>
    </div>
    <!-- EDICION -->
    <div class="edition">
      <h6>Edicion</h6>
      <div class="edition-content">
        <div class="textarea-container">
          <textarea class="form-control form-control-sm" v-on:keyup="editionChange()" v-model="text" placeholder="Crea aca tu mensaje.">
          </textarea>
        </div>
        <div class="textarea-container">
          <textarea class="form-control form-control-sm" v-model="textPreview" placeholder="Aca se vera la vista previa. No hay texto todavia." disabled>
          </textarea>
        </div>
      </div>
      <div class="controls">
        <div class="control-left">
          <button class="btn btn-link btn-sm" @click="restartMessage()">Volver a empezar</button>
        </div>
        <div>
          <button class="btn btn-link btn-sm" @click="saveMessage()">Guardar Mensaje</button>
          <button class="btn btn-link btn-sm" @click="loadMessage()">Cargar Mensaje</button>
        </div>
      </div>
    </div>

    <!-- Mensajes -->
    <div class="messages">
      <h6>Mensajes</h6>
      <div>
        <table class="table">
          <tbody>
            <tr v-for="(message, index) in messages" :key="index">
              <td class="message-row">
                <span v-if="defaultMessageId === message.id">️️️⭐️</span><a @click="messageLoad(message.id)" class="config-elem config-elem-clickeable">{{ message.name }}</a>
              </td>
              <td class="small-td"><span class="messages-btn make-default-message-btn" @click="makeDefault(index)" title="Convertir en predeterminado">🌟</span></td>
              <td class="small-td"><span class="messages-btn delete-message-btn" @click="messageDelete(index)" title="Eliminar mensaje">🗑️</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>



  <!-- MODALES -->
  <div style="display:none" ref="configOptions">
    <div>
      <h3>Guardar Mensaje</h3>
      <br/>
      <form style="text-align:left">
        <div class="form-group">
          <label for="message-name">Nombre del Mensaje</label>
          <input type="text" class="form-control" id="message-name">
        </div>
        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="default-check">
          <label class="form-check-label" for="default-check">Default</label>
        </div>
      </form>
    </div>
  </div>

  <b-modal ref="loadMessageModal" hide-footer title="Listado de Mensajes guardados">
      <div class="d-block text-center">
        <table class="table table-bordered" style="width: 100% !important;">
          <thead class="thead-light">
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Tipo</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(message, index) in messages" :key="index">
              <td><a @click="messageLoad(message.id)" class="config-elem config-elem-clickeable">{{ message.name }}</a></td>
              <td><a class="message-elem">{{ message.type }}</a></td>
              <td><button type="button" class="btn btn-sm btn-danger" @click="messageDelete(index)">&#10006;</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  </b-modal>

  <b-modal ref="createPlaceholderModal" class="placeholder-create-modal" hide-footer title="Crear etiqueta">
    <div class="d-block placeholder-create-body">
      <p v-if="!newPlaceholder.id">Cree una etiqueta de texto</p>
      <p v-if="newPlaceholder.id">Edite una etiqueta de texto</p>
      <div>
        <div class="placeholder-create-input-container">
          <label for="placeholder">Etiqueta</label><br>
          <input class="form-control form-control-sm placeholder-create-input" type="text" id="placeholder" v-model="newPlaceholder.name">
          <span class="placeholder-preview">{{processNewPlaceholder()}}</span>
        </div>
        <div class="placeholder-create-input-container">
          <label for="placeholder">Descripcion</label><br>
          <input class="form-control form-control-sm placeholder-create-input" type="text" id="placeholder" v-model="newPlaceholder.description">
        </div>        
        <div class="placeholder-create-input-container">
          <label for="text">Valor</label>
          <textarea class="form-control form-control-sm placeholder-create-textarea" id="text" v-model="newPlaceholder.text"></textarea>
        </div>
      </div>
      <div class="placeholder-create-controls">
        <button class="btn btn-primary" @click="savePlaceholder()" :disabled="!newPlaceholderValid()">Guardar</button>
      </div>
    </div>
  </b-modal>
</div>

</template>

<script>
import 'vuejs-noty/dist/vuejs-noty.css'
// import VueNoty from 'vuejs-noty'
// import VueSwal from 'vue-swal'
import { HTTP } from '@/plugins/HTTP.js'
export default {
  data () {
    return {
      messages: [],
      filteredPlaceholders: [],
      placeholders: [],
      filter: '',
      textPreview: '',
      text: '',
      defaultMessageId: -1,
      newPlaceholder: {
        name: '',
        text: '',
        description: '',
        id: ''
      }
    }
  },
  mounted: function () {
    this.filterPlaceholders()
    const self = this
    HTTP.get('/api/configuracion/tipo/Placeholder/all').then(result => {
      self.placeholders = result.data.configuraciones.map(p => ({
        value: p.values.find(v => v.name === 'value').value,
        key: p.values.find(v => v.name === 'key').value,
        description: p.values.find(v => v.name === 'description').value,
        id: p.id
      }))
    }).catch(result => {
      this.$noty.error('¡Error al cargar etiquetas!')
    })

    HTTP.get('/api/configuracion/tipo/Mensaje/all').then(result => {
      self.messages = result.data.configuraciones
      self.messages.forEach(m => {
        const msg = m.values.find(v => v.name === 'default' && v.value)
        if (msg) {
          this.defaultMessageId = m.id
        }
      })
    }).catch(result => {
      this.$noty.error('¡Error al cargar mensajes!')
    })
  },
  methods: {
    deletePlaceholder (key) {
      const index = this.placeholders.findIndex(p => p.key === key)
      const placeholder = this.placeholders[index]
      let self = this
      this.$swal('No podrá volver a acceder a dicha etiqueta', {
        title: '¿Seguro de eliminar la etiqueta?',
        icon: 'warning',
        buttons: {
          cancel: 'Cancelar',
          aceptar: {
            text: 'Confirmar',
            value: true
          }
        }
      }).then((value) => {
        if (value === true) {
          self.$noty.info('Eliminando etiqueta...')
          HTTP.delete(`/api/configuracion/${placeholder.id}`).then((response) => {
            if (response.data.success) {
              self.$noty.success('Etiqueta eliminada con éxito!')
              const pIndex = self.placeholders.findIndex(p => p.key === key)
              self.placeholders.splice(pIndex, 1)
              self.filter = ''
              self.filterPlaceholders()
            }
          })
        }
      })
    },
    editPlaceholder (placeholder) {
      this.newPlaceholder = {
        id: placeholder.id,
        name: placeholder.key.slice(0, -1).substr(1),
        text: placeholder.value,
        description: placeholder.description
      }
      this.$refs.createPlaceholderModal.show()
    },
    newPlaceholderValid () {
      return this.newPlaceholder.name && this.newPlaceholder.text
    },
    processNewPlaceholder () {
      if (this.newPlaceholder.name) {
        return '!' + this.newPlaceholder.name.trim().replace(new RegExp(' ', 'g'), '-') + '!'
      }
      return ''
    },
    createPlaceholder () {
      let self = this
      self.$refs.createPlaceholderModal.show()
    },
    savePlaceholder () {
      const placeholder = {
        name: this.processNewPlaceholder(),
        type: 'Placeholder',
        values: [
          { name: 'key', value: this.processNewPlaceholder() },
          { name: 'value', value: this.newPlaceholder.text },
          { name: 'description', value: this.newPlaceholder.description }
        ]
      }

      if (this.newPlaceholder.id) {
        HTTP.put('/api/configuracion/' + this.newPlaceholder.id, placeholder).then(result => {
          if (result.data.success) {
            this.$noty.success('¡Datos guardados correctamente!')
          }
          const key = placeholder.name
          const pIndex = this.placeholders.findIndex(p => p.key === key)
          this.placeholders.splice(pIndex, 1)
          this.placeholders.push({
            key: this.processNewPlaceholder(),
            value: this.newPlaceholder.text,
            description: this.newPlaceholder.description
          })
          this.newPlaceholder = { name: '', text: '', description: '', id: '' }
          this.filter = ''
          this.filterPlaceholders()
          this.editionChange()
          this.$refs.createPlaceholderModal.hide()
        }).catch(result => {
          this.$noty.error('¡Error al guardar los datos!')
        })
      } else {
        HTTP.post('/api/configuracion', placeholder).then(result => {
          if (result.data.success) {
            this.$noty.success('¡Datos guardados correctamente!')
          }
          this.placeholders.push({
            key: this.processNewPlaceholder(),
            value: this.newPlaceholder.text,
            description: this.newPlaceholder.description
          })
          this.newPlaceholder = { name: '', text: '', description: '', id: '' }
          this.$refs.createPlaceholderModal.hide()
        }).catch(result => {
          this.$noty.error('¡Error al guardar los datos!')
        })
      }
    },
    restartMessage () {
      this.text = ''
      this.editionChange()
    },
    usePlaceholder ({ key }) {
      this.text += ' ' + key + ' '
      this.editionChange()
    },
    editionChange () {
      this.textPreview = this.text
      this.placeholders.forEach(placeholder => {
        this.textPreview = this.textPreview.replace(new RegExp(placeholder.key, 'g'), placeholder.value)
      })
      // Como las etiquetas pueden contener etiquetas (solo un nivel por ahora), vuelvo a reemplazar
      this.placeholders.forEach(placeholder => {
        this.textPreview = this.textPreview.replace(new RegExp(placeholder.key, 'g'), placeholder.value)
      })
    },
    filterPlaceholders () {
      this.filteredPlaceholders = []
      if (!this.filter) {
        this.filteredPlaceholders = JSON.parse(JSON.stringify(this.placeholders))
        return
      }
      this.placeholders.forEach((p) => {
        if ((p.key.indexOf(this.filter) > -1) || (p.description.indexOf(this.filter) > -1)) {
          this.filteredPlaceholders.push(p)
        }
      })
    },
    saveMessage () {
      this.$refs.configOptions.style.display = 'block'
      this.$swal({
        content: this.$refs.configOptions,
        buttons: {
          cancelar: {
            text: 'Cancelar',
            value: 0
          },
          save: {
            text: 'Guardar',
            value: 1
          }
        }
      }).then((result) => {
        const name = document.getElementById('message-name').value
        if (result === 1 && name) {
          const message = {
            name,
            type: 'Mensaje',
            values: [
              { name: 'text', value: this.text },
              { name: 'created_at', value: new Date() },
              { name: 'default', value: document.getElementById('default-check').checked }
            ]
          }
          if (document.getElementById('default-check').checked) {
            // quito el default anterior
            HTTP.get(`/api/configuracion/tipo/Mensaje/all/default`).then((response) => {
              const configuraciones = response.data.configuraciones
              this.defaultMessageId = -1
              if (configuraciones.length > 0) {
                configuraciones.forEach((m) => {
                  m.values.find(v => v.name === 'default').value = false
                  HTTP.put('/api/configuracion/' + m.id, m).then(result => {
                  }).catch(err => {
                    console.log('Error al actualizar mensaje default previo', err)
                  })
                })
              }
            })
          }
          HTTP.post('/api/configuracion', message).then(result => {
            if (result.data.success) {
              this.$noty.success('¡Datos guardados correctamente!')
            }
            this.messages.push(message)
          }).catch(result => {
            this.$noty.error('¡Error al guardar los datos!')
          })
        }
        document.getElementById('message-name').value = ''
        document.getElementById('default-check').checked = false
        this.$refs.configOptions.style.display = 'none'
      })
    },
    loadMessage () {
      let self = this
      HTTP.get('/api/configuracion/tipo/Mensaje').then(result => {
        self.messages = result.data.configuraciones
        self.$refs.loadMessageModal.show()
      }).catch(result => {
        this.$noty.error('¡Error al cargar datos!')
      })
    },
    makeDefault (index) {
      const message = this.messages[index]
      const defaultIndex = message.values.findIndex(v => v.name === 'default')
      if (defaultIndex !== -1) {
        message.values[defaultIndex].value = true
      } else {
        message.values.push({ name: 'default', value: true })
      }
      // quito el default previo
      HTTP.get(`/api/configuracion/tipo/Mensaje/all/default`).then((response) => {
        const configuraciones = response.data.configuraciones
        if (configuraciones.length > 0) {
          configuraciones.forEach((m) => {
            m.values.find(v => v.name === 'default').value = false
            HTTP.put('/api/configuracion/' + m.id, m).then(result => {
            }).catch(err => {
              console.log('Error al actualizar mensaje default previo', err)
              this.$noty.error('Error al actualizar mensaje default previo')
            })
          })
        }
        HTTP.put('/api/configuracion/' + message.id, message).then(result => {
          this.$noty.success('Mensaje default actualizado')
          this.defaultMessageId = message.id
        }).catch(result => {
          this.$noty.error('¡Error al guardar los datos!')
        })
      })
    },
    messageDelete (index) {
      const message = this.messages[index]
      let self = this

      this.$swal('No podrá volver a acceder a dicho mensaje', {
        title: '¿Seguro de eliminar el mensaje?',
        icon: 'warning',
        buttons: {
          cancel: 'Cancelar',
          aceptar: {
            text: 'Confirmar',
            value: true
          }
        }
      }).then((value) => {
        if (value === true) {
          self.$noty.info('Eliminando mensaje...')
          HTTP.delete(`/api/configuracion/${message.id}`).then((response) => {
            if (response.data.success) {
              self.$noty.success('¡Mensaje eliminado con éxito!')
              self.messages.splice(index, 1)
            }
          })
        } else {
          this.close()
        }
      })
    },
    messageLoad (id) {
      this.$noty.info('Cargando mensaje...')
      HTTP.get(`/api/configuracion/${id}`).then((response) => {
        const message = response.data.configuracion.values
        this.text = message.find(prop => prop.name === 'text').value
        this.editionChange()
        this.$refs.loadMessageModal.hide()
        this.$noty.success('¡Mensaje cargado con éxito!')
      })
    }
  },
  computed: {
  },
  watch: {
    placeholders: function (newValue, oldValue) {
      this.filter = ''
      this.filterPlaceholders()
      return newValue
    }
  }
}
</script>
<style scoped lang="scss">
.editor-section {
  margin-bottom: 20px;
}
.medium-font {
  font-size: 15px;
}
.glossary, .edition, .messages {
    margin-top: 20px;
    text-align: left;
}
.messages {
  table {
    margin-top: 20px;
    width: 670px;
  }
  tr, td {
    border: none;
  }
  tr:hover {
    background-color: #dee2e6;
    .messages-btn {
      display: inline-block;
    }
  }
  .messages-btn {
    display: none;
    cursor: pointer;
    width: 20px;
    float: right;
    margin: 0px 5px
  }
}
.small-td {
  width: 20px;
}
.filter {
  padding: 10px 0px;
}
.filter input {
  width: 180px;
  display: inline;
}
.placeholders-container {
    max-height: 250px;
    overflow-y: auto;
}
.placeholder-item {
  font-size: 12px;
  .icon {
    cursor: pointer;
    display: none;
  }
  &:hover {
    .icon {
      display: initial;
    } 
  }
}
.placeholder-key {
    font-family: 'Courier New', Courier, monospace;
    cursor: pointer;
}
.edition-content {
  display: flex;
}
.textarea-container {
  flex: 1;
}
.textarea-container textarea {
  max-width: 95%;
  resize: none;
  background-color: white;
  height: 500px;
}
.controls {
  display: flex;
  padding-right: 40px;
}
.controls .control-left {
  flex: 1;
}
.create-placeholder {
  margin-top: 15px;
}
.placeholder-create-body {
  text-align: left;
  font-size: 15px;
}
.placeholder-create-input {
  width: 200px;
  display: inline-block;
}
.placeholder-create-textarea {
  width: 400px;
  resize: none;
}
.placeholder-create-controls {
  margin-top: 20px;
  display: flex;
  flex-direction: row-reverse;
}
.placeholder-create-input-container {
  margin-top: 15px;
}
.placeholder-preview {
  color: #989696;
}
</style>
<style>
.placeholder-create-modal .modal-md {
  width: 550px;
}
</style>