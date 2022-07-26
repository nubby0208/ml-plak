<template>
  <div class="interactive-picture">
    <h1>Fotos e Información de Obras</h1>
    <div class="row">
      <b-nav vertical pills class="col-md-2 col-sm-2 col-xs-2 boton-ambientes">
        <b-nav-item
          v-for="Ambiente of Ambientes"
          :key="Ambiente.codigo"
          :id="Ambiente.codigo"
          :active="(Ambiente.interno === 1)"
          @click="cambiarDeAmbiente(Ambiente.codigo)"
        >
          {{Ambiente.nombre}}
        </b-nav-item>
        <b-nav-item
          id="nuevo"
          v-on:click="cambiarDeAmbiente('nuevo')"
        >
          Agregar Ambiente
        </b-nav-item>
      </b-nav>

      <input
        @change="ImagenSeleccionada"
        id="tomar-foto"
        type="file"
        accept="image/*"
        capture="camera"
        style='display: none;'
      />

      <Visualizador
        v-if="showV"
        :ambiente="ambienteActivo"
        @agregarMensaje="guardarMensaje"
      />
      <Camara
        v-if="showcam"
        @close="showcam = false"
        @nuevaFoto="guardarAmbiente"
      />
      <CamaraMobile
        :fotoM="fotoMobile"
        v-if="showcamM"
        @close="showcamM = false"
        @nuevaFoto="guardarAmbiente"
      />
      <SubirImagen
        v-if="showFile"
        @close="showFile = false"
        @nuevaFoto="guardarAmbiente"
      />
      <SubirImagenMobile
        v-if="showFileM"
        @close="showFileM = false"
        @nuevaFoto="guardarAmbiente"
      />
      
      <div v-if="showNuevo" id="nuevo" class="col-lg-10 col-md-10 col-sm-10 col-xs-10 d-flex justify-content-center">
        <b-nav vertical pills class="col-md-10 col-sm-10 col-xs-10 boton-nuevo">
          <b-nav-item
            id="nuevo-ambiente"
            @click="seleccionNuevo('nuevo-ambiente')"
          >
            <img              
              :src="url(require('@/assets/camera.png'))"
              width="50px"
              alt=""
            ><br>
            TOMAR FOTOGRAFIA
          </b-nav-item>
          
          <label id="nuevo-ambiente-m" for="tomar-foto" class="subir btn" @click="seleccionNuevo('nuevo-ambiente-m')">
            <i class="fas fa-cloud-upload-alt"/>
            <img              
              :src="url(require('@/assets/camera.png'))"
              width="50px"
              alt=""
            ><br>
            TOMAR FOTOGRAFIA
          </label>
          
          <b-nav-item 
            id="subir-foto"
            v-on:click="seleccionNuevo('subir-foto')"
          >
            <img              
              :src="url(require('@/assets/upload.png'))"
              width="50px"
              alt=""
            >
            <br>
            SUBIR IMAGEN
          </b-nav-item>
        </b-nav>
      </div>
    </div>    
  </div>
</template>

<script>
import Vue from 'vue'
import lightbox from 'vlightbox'
import { HTTP } from '@/plugins/HTTP.js'
import VueNoty from 'vuejs-noty'
import { isMobile } from 'mobile-device-detect'
import Visualizador from './Information/Visualizador.vue'
import Camara from './Information/Camara.vue'
import CamaraMobile from './Information/CamaraMobile.vue'
import SubirImagen from './Information/SubirImagen.vue'
import SubirImagenMobile from './Information/SubirImagenMobile.vue'

Vue.use(VueNoty, {
  theme: 'metroui'
})
Vue.use(lightbox)

export default {
  name: 'InteractivePicture',
  components: {
    Visualizador,
    Camara,
    CamaraMobile,
    SubirImagen,
    SubirImagenMobile
  },
  props: {
    modoMobile: Boolean
  },
  data () {
    return {
      Ambientes: [],
      ambienteActivo: {},
      showcam: false,
      showcamM: false,
      showFile: false,
      showFileM: false,
      showNuevo: false,
      showV: true,
      esMobile: isMobile,
      fotoMobile: {}
    }
  },
  mounted: function () {
    HTTP.post('/api/ambientes/obtener', {
      token: this.projectToken
    }).then(async (result) => {
      let resp = result.data.response
      if (resp.status === 1) {
        var projecto = resp.ambientes
        this.Ambientes = projecto.ambiente
        this.ambienteActivo = projecto.ambiente[0]
      } else {
        console.log(resp.message)
      }
    }).catch(result => {
      this.$noty.error('¡Error al exportar los ambientes!')
      console.log('error:', result.data.response)
    })
    // this.revisarDispositivo()
  },
  methods: {
    revisarDispositivo () {
      if (this.esMobile) {
        document.querySelector('#nuevo-ambiente').style.display = 'none'
        document.querySelector('#nuevo-ambiente-m').style.display = 'inline'
        console.log('is mobile')
      } else {
        document.querySelector('#nuevo-ambiente').style.display = 'inline'
        document.querySelector('#nuevo-ambiente-m').style.display = 'none'
      }
    },
    cambiarDeAmbiente (value) {
      var listabotones = document.getElementsByClassName('boton-ambientes')[0].children
      for (var i = 0; i < listabotones.length; i++) {
        var boton = document.getElementById(listabotones[i].id).children[0]
        boton.classList.remove('active')
        if ((value + '') === (listabotones[i].id + '')) {
          boton.classList.add('active')
          if (value === 'nuevo') {
            this.showNuevo = true
            this.showV = false
            // var este = this
            setTimeout(() => {
              this.revisarDispositivo()
            }, 50)
            break
          } else {
            this.ambienteActivo = this.Ambientes[i]
            this.showV = true
            this.showNuevo = false
          }
        }
      }
    },
    seleccionNuevo (value) {
      console.log('seleccion nuevo')
      var listabotones = document.getElementsByClassName('boton-nuevo')[0].children
      for (var i = 0; i < listabotones.length; i++) {
        if ((value + '') === (listabotones[i].id + '')) {
          if (value === 'nuevo-ambiente') {
            this.showcam = true
            console.log('nuevo-ambiente')
            break
          } if (value === 'nuevo-ambiente-m') {
            console.log('nuevo-ambiente-m')
            // this.showcamM = true
            break
          } else if (value === 'subir-foto') {
            if (this.esMobile) {
              console.log('subir-foto-m')
              this.showFileM = true
              break
            } else {
              console.log('subir-foto')
              this.showFile = true
              break
            }
          } else {
            this.ambienteActivo = this.Ambientes[i]
            this.showcam = false
            this.showcamM = false
          }
        }
      }
    },
    async ImagenSeleccionada (event) {
      this.showcamM = true
      // this.modoLandscape()
      console.log('ImagenSeleccionada onchange ON')
      var este = this
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = e => {
        var este2 = este
        // ahora se recupera el base64
        var image = new Image()
        image.src = e.target.result
        image.onload = function () {
          image.width = image.naturalWidth
          image.height = image.naturalHeight
          var k = este2.resizeM(image)
          if (k !== false) {
            // console.log('imagen redimensionada')
            este2.fotoMobile = k
          } else {
            alert('problem - please attempt to upload again')
          }
        }
      }
    },
    guardarMensaje (datos) {
      HTTP.post('/api/ambientes/informacion', {
        token: this.projectToken,
        informacion: datos.nuevoMensaje,
        ambiente: datos.codigoAmbiente
      }).then(async (result) => {
        let resp = result.data.response
        if (resp.status === 1) {
          this.$noty.success('¡Información guardada correctamente!')
          var ambientes = this.Ambientes
          for (var i = 0; i < ambientes.length; i++) {
            if (datos.codigoAmbiente === ambientes[i].codigo) {
              // console.log(ambientes[i])
              ambientes[i].informacion.push(datos.nuevoMensaje)
            }
          }
        } else {
          console.log(resp.message)
        }
      }).catch(result => {
        this.$noty.error('¡Error al guardar la información del ambiente!')
        console.log('error:', result.data.response)
      })
    },
    async guardarAmbiente (datos) {
      this.$noty.info('Enviando Ambiente al servidor!')
      let data = new FormData()
      // let file = event.target.files[0]// para enviar imagenes como archivo
      // data.append('file', file)
      data.append('token', this.projectToken)
      data.append('nombre', datos.nombre)
      data.append('foto', datos.foto)
      let config = {
        header: { 'Content-Type': 'multipart/form-data' }
      }
      HTTP.post('/api/ambientes/nuevo', data, config).then(result => {
        this.$noty.success('Ambiente exportado correctamente!')
        // this.$noty.success('Guardando proyecto ...')
        var interno = this.Ambientes.length + 1
        var ambiente = {
          nombre: datos.nombre,
          imagen: datos.foto,
          codigo: interno + '-' + this.projectToken + '.png',
          interno: interno,
          informacion: []
        }
        this.Ambientes.push(ambiente)
      }).catch(result => {
        this.$noty.error('Error al guardar el Ambiente.')
      })
    },
    resizeM (img) {
      var maxWidth = 1500
      var maxHeight = 1500
      var ratio = 1
      var canvas = document.createElement('canvas')
      canvas.style.display = 'none'
      document.body.appendChild(canvas)
      var canvasCopy = document.createElement('canvas')
      canvasCopy.style.display = 'none'
      document.body.appendChild(canvasCopy)
      var ctx = canvas.getContext('2d')
      var copyContext = canvasCopy.getContext('2d')
      if (img.width > maxWidth) {
        ratio = maxWidth / img.width
      } else if (img.height > maxHeight) {
        ratio = maxHeight / img.height
      }
      canvasCopy.width = img.width
      canvasCopy.height = img.height
      try {
        copyContext.drawImage(img, 0, 0)
      } catch (e) {
        alert('ocurrio un problema al ajustar la imagen')
        return ''
      }
      canvas.height = img.width * ratio
      canvas.width = img.height * ratio
      ctx.rotate(-90 * Math.PI / 180)
      ctx.drawImage(canvasCopy, -canvas.height, 0, canvas.height, canvas.width)
      // sin rotar
      // canvas.width = img.width * ratio
      // canvas.height = img.height * ratio
      // ctx.drawImage(canvasCopy, 0, 0, canvas.width, canvas.height)
      var dataURL = canvas.toDataURL('image/png')
      document.body.removeChild(canvas)
      document.body.removeChild(canvasCopy)
      return {url: dataURL, w: canvas.width, h: canvas.height}
    },
    modoLandscape () {
      if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen()
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        }
      }
      screen.orientation.lock('landscape')
    },
    modoPortrait () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      screen.orientation.lock('portrait')
    }
  },
  computed: {
    projectToken () {
      let info = this.$store.state.info
      return info.token_project
    }
  }
}
</script>
<style lang="scss" scoped>
.unshow {
  display: none;
}
.subir{
    padding: 5px 10px;
    background: #fff;
    color:#007bff;
    border:0px solid #fff;
}
 
.subir:hover{
    color:#fff;
    background: #007bff;
}
#nuevo-ambiente-m{
  display: none;
}
#nuevo-ambiente{
  display: none;
}
#subir-foto{
  margin-top: 10px;
}
</style>