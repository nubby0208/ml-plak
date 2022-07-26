<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="camara-body">
              <!-- zona nuevo ambiente -->
              <select name="listaDeDispositivos" id="ClistaDeDispositivos" style="display:none"></select>
              <input id="texto-nombre" lass="form-control" v-model="nombreAmbiente" placeholder="Ingresa el Nombre">
              <button id="boton-tomar" class="btn btn-light" v-on:click="tomarFoto()"> </button>
              <button id="boton-cancelar" class="btn btn-danger modal-default-button" @click="CerrarCamara"> </button>
              <button id="boton-confirmar" class="btn btn-warning" v-on:click="confirmarFoto()"> </button>
              <button id="boton-guardar" class="btn btn-success modal-default-button" @click="GuardarFoto"> </button>
              <video muted="muted" id="Cvideo"></video>
              <canvas id="Ccanvas"> </canvas> 
              <div id="Cestado"></div>
              <div id="Czona-redimension" style="display:none">
                <img id="Cimage-cropper" ref="image" >
              </div>
              <img id="finalFoto" src="" style="display:none">
              <canvas id="preview" style="display:none"></canvas>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Cropper from 'cropperjs'

export default {
  name: 'Modal',
  data () {
    return {
      nombreAmbiente: '',
      kamara: {
        soporteCamara: {},
        camarasUsuario: {},
        varPantalla: {
          video: {},
          canvas: {},
          estado: {},
          listaDeDispositivos: {},
          zonaRedimension: {}
        }
      },
      nuevaFoto: {
        imagen: '',
        cierro: true
      },
      imagenFinal: '',
      cropper: {}
    }
  },
  mounted: function () {
    // 2222
    // codigo para capturar imagen
    this.kamara.varPantalla.zonaRedimension = document.querySelector('#Czona-redimension')
    this.kamara.soporteCamara = () => !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia)
    this.kamara.camarasUsuario = (...argumentos) => (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, argumentos)
    this.kamara.varPantalla.video = document.querySelector('#Cvideo')
    this.kamara.varPantalla.canvas = document.querySelector('#Ccanvas')
    this.kamara.varPantalla.estado = document.querySelector('#Cestado')
    this.kamara.varPantalla.listaDeDispositivos = document.querySelector('#ClistaDeDispositivos')
    this.obtenerDispositivos = () => navigator.mediaDevices.enumerateDevices()
    this.nuevoAmbiente()
    this.configurarPantalla()
  },
  methods: {
    CerrarCamara () {
      if (this.nuevaFoto.cierro) {
        this.$emit('close')
        document.documentElement.style.overflowY = ''
        document.documentElement.style.overflowX = ''
        this.cropper = null
        document.body.style.webkitTransform = 'rotate(0deg)'
      } else {
        this.kamara.varPantalla.canvas.style.display = 'none'
        this.nuevaFoto.cierro = true
      }
    },
    GuardarFoto () {
      if (this.nombreAmbiente.length > 5) {
        document.documentElement.style.overflowY = ''
        document.documentElement.style.overflowX = ''
        this.cropper = null
        this.$emit('close')
        this.imagenFinal = document.getElementById('finalFoto').src
        this.$emit('nuevaFoto', {foto: this.imagenFinal, nombre: this.nombreAmbiente})
      } else {
        document.querySelector('#texto-nombre').classList.add('alert-danger')
        document.querySelector('#texto-nombre').placeholder = 'nombre obligatorio'
        setTimeout(function () {
          document.querySelector('#texto-nombre').classList.remove('alert-danger')
          document.querySelector('#texto-nombre').placeholder = 'Ingresa el Nombre'
        }, 2000)
      }
    },
    nuevoAmbiente () {
      var kam = this.kamara.varPantalla
      if (!this.kamara.soporteCamara()) {
        alert('Lo siento. Tu navegador no soporta esta característica')
        kam.estado.innerHTML = 'Parece que tu navegador no soporta esta característica. Intenta actualizarlo.'
        return
      }
      let stream
      this.obtenerDispositivos()
        .then(dispositivos => {
          const dispositivosDeVideo = []
          dispositivos.forEach(function (dispositivo) {
            const tipo = dispositivo.kind
            if (tipo === 'videoinput') {
              dispositivosDeVideo.push(dispositivo)
            }
          })
          if (dispositivosDeVideo.length > 0) {
            mostrarStream(dispositivosDeVideo[0].deviceId)
          }
        })
      const mostrarStream = idDeDispositivo => {
        this.kamara.camarasUsuario({
          video: {
            deviceId: idDeDispositivo
          }
        },
        (streamObtenido) => {
          this.llenarSelectConDispositivosDisponibles()
          kam.listaDeDispositivos.onchange = () => {
            if (stream) {
              stream.getTracks().forEach(function (track) { track.stop() })
            }
            mostrarStream(kam.listaDeDispositivos.value)
          }
          stream = streamObtenido
          kam.video.srcObject = stream
          kam.video.play()
          setTimeout(() => {
            var videoC = this.kamara.varPantalla.video
            videoC.style.marginTop = ((window.innerHeight - videoC.videoHeight) / 2) + 'px'
            if (window.innerHeight < videoC.videoHeight) {
              videoC.style.marginTop = 0
              videoC.height = window.innerHeight
            }
          }, 560)
          kam.listaDeDispositivos.style = 'inline'
        },
        () => {
          kam.estado.innerHTML = 'No se puede acceder a la cámara, o no diste permiso.'
        })
      }
      // nuevoAmbiente
    },
    tomarFoto () {
      // Pausar reproducción
      var kam = this.kamara.varPantalla
      kam.video.pause()
      // Obtener contexto del canvas y dibujar sobre él
      let contexto = kam.canvas.getContext('2d')
      kam.canvas.width = kam.video.videoWidth
      kam.canvas.height = kam.video.videoHeight
      contexto.drawImage(kam.video, 0, 0, kam.canvas.width, kam.canvas.height)
      this.nuevaFoto.imagen = kam.canvas.toDataURL() // Esta es la foto, en base 64
      kam.canvas.style.display = ''
      var tomarFoto = document.getElementById('boton-confirmar')
      tomarFoto.style.display = 'inline'
      this.nuevaFoto.cierro = false
      // Reanudar reproducción
      kam.video.play()
      // tomarFoto
    },
    confirmarFoto () {
      // ordenar pantalla para mostrar editor
      var kam = this.kamara.varPantalla
      kam.video.srcObject.getTracks().forEach(track => track.stop())
      kam.zonaRedimension.style.display = null
      kam.zonaRedimension.style.backgroundImage = 'url(\'' + this.nuevaFoto.imagen + '\')'
      kam.zonaRedimension.style.backgroundSize = kam.canvas.width + 'px' + kam.canvas.height + 'px'
      // ordenar pantalla para mostrar editor
      this.nuevaFoto.cierro = true
      var btnGuardar = document.getElementById('boton-guardar')
      var btnConfirmar = document.getElementById('boton-confirmar')
      var textoNombre = document.getElementById('texto-nombre')
      btnGuardar.style.display = 'inline'
      btnConfirmar.style.display = 'none'
      textoNombre.style.display = 'inline'
      this.usarCropper()
      // abrir editor
    },
    usarCropper () {
      const image = document.getElementById('Cimage-cropper')
      image.src = this.nuevaFoto.imagen
      this.cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        zoomable: false,
        scalable: false,
        crop (event) {
          const canvas = this.cropper.getCroppedCanvas()
          document.getElementById('finalFoto').src = canvas.toDataURL('image/png')
        }
      })
    },
    llenarSelectConDispositivosDisponibles () {
      this.limpiarSelect()
      this.obtenerDispositivos()
        .then(dispositivos => {
          const dispositivosDeVideo = []
          dispositivos.forEach(dispositivo => {
            const tipo = dispositivo.kind
            if (tipo === 'videoinput') {
              dispositivosDeVideo.push(dispositivo)
            }
          })
          if (dispositivosDeVideo.length > 0) {
            dispositivosDeVideo.forEach(dispositivo => {
              const option = document.createElement('option')
              option.value = dispositivo.deviceId
              option.text = dispositivo.label
              this.kamara.varPantalla.listaDeDispositivos.appendChild(option)
            })
          }
        })
    },
    limpiarSelect () { // camara
      for (let x = this.kamara.varPantalla.listaDeDispositivos.options.length - 1; x >= 0; x--) {
        this.kamara.varPantalla.listaDeDispositivos.remove(x)
      }
    },
    obtenerDispositivos () { // camara
      return navigator.mediaDevices.enumerateDevices()
    },
    configurarPantalla () {
      document.documentElement.style.overflowY = 'hidden'
      document.documentElement.style.overflowX = 'hidden'
      var modal = document.querySelector('.modal-container')
      modal.style.height = window.innerHeight + 'px'
      modal = document.querySelector('.camara-body')
      modal.style.height = window.innerHeight + 'px'
      var boton = document.querySelector('#boton-tomar')
      boton.style.top = (window.innerHeight - 50) + 'px'
      var guardar = document.querySelector('#boton-guardar')
      guardar.style.top = (window.innerHeight - 50) + 'px'
      var cancelar = document.querySelector('#boton-cancelar')
      cancelar.style.top = (window.innerHeight - 35) + 'px'
      cancelar.style.left = (window.innerWidth / 2 + 100) + 'px'
      var confirmar = document.querySelector('#boton-confirmar')
      confirmar.style.top = (window.innerHeight - 35) + 'px'
      confirmar.style.left = (window.innerWidth / 2 - 100) + 'px'
    }
  },
  beforeDestroy: function () {
    // usar para eliminar objetos de peso
  }
}
</script>

<style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    display: table;
    transition: opacity .3s ease;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .modal-container {
    position: fixed;
    width: 100%;
    background-color: #383838;
    top: 0;
    left: 0;
    font-family: Helvetica, Arial, sans-serif;
  }
  .modal-default-button {
    float: right;
  }
 
  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  #foto{
    width:640px;
    height:480px;
  }
  #zona-redimension{
      width:640px;
      height:480px;
  }
  #botonera-camara{
    position: absolute;
    z-index: 999;
    background-color: bisque;
    width: 200px;
  }
  #Ccanvas{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 998;
  }
  #Czona-redimension{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 998;
  }
  #Cvideo{
    transition: 0.5s;
  }
  #boton-tomar{
    width: 80px;
    height: 80px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNjAgNjAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYwIDYwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIGNsYXNzPSIiPjxnPjxnPgoJPHBhdGggZD0iTTMwLDIwLjVjLTYuNjE3LDAtMTIsNS4zODMtMTIsMTJzNS4zODMsMTIsMTIsMTJzMTItNS4zODMsMTItMTJTMzYuNjE3LDIwLjUsMzAsMjAuNXoiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiIHN0eWxlPSJmaWxsOiNFQjdEMTYiPjwvcGF0aD4KCTxwYXRoIGQ9Ik01NS4yMDEsMTUuNWgtOC41MjRsLTQtMTBIMTcuMzIzbC00LDEwSDEydi01SDZ2NUg0Ljc5OUMyLjE1MiwxNS41LDAsMTcuNjUyLDAsMjAuMjk5djI5LjM2OCAgIEMwLDUyLjMzMiwyLjE2OCw1NC41LDQuODMzLDU0LjVoNTAuMzM0YzIuNjY1LDAsNC44MzMtMi4xNjgsNC44MzMtNC44MzNWMjAuMjk5QzYwLDE3LjY1Miw1Ny44NDgsMTUuNSw1NS4yMDEsMTUuNXogTTEwLDE1LjVIOHYtMyAgIGgyVjE1LjV6IE0zMCw1MC41Yy05LjkyNSwwLTE4LTguMDc1LTE4LTE4czguMDc1LTE4LDE4LTE4czE4LDguMDc1LDE4LDE4UzM5LjkyNSw1MC41LDMwLDUwLjV6IE01MiwyNy41Yy0yLjIwNiwwLTQtMS43OTQtNC00ICAgczEuNzk0LTQsNC00czQsMS43OTQsNCw0UzU0LjIwNiwyNy41LDUyLDI3LjV6IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIiBzdHlsZT0iZmlsbDojRUI3RDE2Ij48L3BhdGg+CjwvZz48L2c+IDwvc3ZnPg==);
    background-size: 55px 55px;
    background-repeat: no-repeat;
    background-position: 12px 9px;
    background-color: black;
    border-radius: 50px;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
  #boton-cancelar{
    width: 50px;
    height: 50px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBjbGFzcz0iIj48Zz48Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yNTcsMEMxMTYuMzksMCwwLDExNC4zOSwwLDI1NXMxMTYuMzksMjU3LDI1NywyNTdzMjU1LTExNi4zOSwyNTUtMjU3UzM5Ny42MSwwLDI1NywweiBNMzgzLjIyLDMzOC43OSAgICBjMTEuNywxMS43LDExLjcsMzAuNzMsMCw0Mi40NGMtMTEuNjEsMTEuNi0zMC42NCwxMS43OS00Mi40NCwwTDI1NywyOTcuNDJsLTg1Ljc5LDgzLjgyYy0xMS43LDExLjctMzAuNzMsMTEuNy00Mi40NCwwICAgIGMtMTEuNy0xMS43LTExLjctMzAuNzMsMC00Mi40NGw4My44LTgzLjhsLTgzLjgtODMuOGMtMTEuNy0xMS43MS0xMS43LTMwLjc0LDAtNDIuNDRjMTEuNzEtMTEuNywzMC43NC0xMS43LDQyLjQ0LDBMMjU3LDIxMi41OCAgICBsODMuNzgtODMuODJjMTEuNjgtMTEuNjgsMzAuNzEtMTEuNzIsNDIuNDQsMGMxMS43LDExLjcsMTEuNywzMC43MywwLDQyLjQ0bC04My44LDgzLjhMMzgzLjIyLDMzOC43OXoiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0MxMjAyMCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiPjwvcGF0aD4KCTwvZz4KPC9nPjwvZz4gPC9zdmc+);
    background-size: 50px 50px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: gainsboro;
    border-radius: 50px;
    position: absolute;
    top: 100%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
  #boton-confirmar{
    width: 50px;
    height: 50px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNjcuMjgzIDY3LjI4MyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjcuMjgzIDY3LjI4MzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBjbGFzcz0iIj48Zz48Zz4KCTxwYXRoIGQ9Ik0zMy42NDEsMGMtMTguNDgsMC0zMy42LDE1LjEzOS0zMy42LDMzLjY0MXMxNS4xMiwzMy42NDEsMzMuNiwzMy42NDFzMzMuNi0xNS4xMzksMzMuNi0zMy42NDFTNTIuMTIxLDAsMzMuNjQxLDB6ICAgIE0zMy42NDEsNTguODcyYy0xMy44NiwwLTI1LjItMTEuMzU0LTI1LjItMjUuMjMxUzE5Ljc4MSw4LjQxLDMzLjY0MSw4LjQxczI1LjIsMTEuMzU0LDI1LjIsMjUuMjMxUzQ3LjUwMSw1OC44NzIsMzMuNjQxLDU4Ljg3MnoiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6IzA4N0YwNSIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiPjwvcGF0aD4KCTxwYXRoIGQ9Ik00My4zMDEsMjIuMjg3bC0xMy44NiwxMy44NzdsLTUuODgtNS44ODdjLTEuNjgtMS42ODItNC4yLTEuNjgyLTUuODgsMHMtMS42OCw0LjIwNSwwLDUuODg3bDguODIsOC44MzEgICBjMC44NCwwLjg0MSwxLjY4LDEuMjYyLDIuOTQsMS4yNjJzMi4xLTAuNDIxLDIuOTQtMS4yNjJsMTYuOC0xNi44MjFjMS42OC0xLjY4MiwxLjY4LTQuMjA1LDAtNS44ODcgICBDNDcuNTAxLDIwLjYwNSw0NC45ODEsMjAuNjA1LDQzLjMwMSwyMi4yODd6IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiMwODdGMDUiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIj48L3BhdGg+CjwvZz48L2c+IDwvc3ZnPg==);
    background-size: 50px 50px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: gainsboro;
    border-radius: 50px;
    position: absolute;
    top: 100%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    display: none;
  }
  #boton-guardar{
    width: 80px;
    height: 80px;
    background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggc3R5bGU9ImZpbGw6IzU0QzlFQjsiIGQ9Ik00OTMuMjY4LDUxMkgxOC43MzJDOC4zODcsNTEyLDAsNTAzLjYxMywwLDQ5My4yNjhWMTguNzMyQzAsOC4zODcsOC4zODcsMCwxOC43MzIsMGgzNTUuOTAyICBjNC45NjksMCw5LjczMywxLjk3MywxMy4yNDUsNS40ODZMNTA2LjUxMywxMjQuMTJjMy41MTQsMy41MTQsNS40ODcsOC4yNzgsNS40ODcsMTMuMjQ2djM1NS45MDIgIEM1MTIsNTAzLjYxMyw1MDMuNjEzLDUxMiw0OTMuMjY4LDUxMnoiLz4KPHBhdGggc3R5bGU9ImZpbGw6IzFCQjNGOTsiIGQ9Ik01MDYuNTEzLDEyNC4xMkwzODcuODc5LDUuNDg2QzM4NC4zNjcsMS45NzMsMzc5LjYwMywwLDM3NC42MzQsMEgyNTZ2NTEyaDIzNy4yNjggIGMxMC4zNDUsMCwxOC43MzItOC4zODcsMTguNzMyLTE4LjczMlYxMzcuMzY2QzUxMiwxMzIuMzk4LDUxMC4wMjcsMTI3LjYzNCw1MDYuNTEzLDEyNC4xMnoiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojODREQkZGOyIgZD0iTTQzNy45MTQsNTEySDc0LjA4NlYyOTguMjA0YzAtMTAuMzQ1LDguMzg3LTE4LjczMiwxOC43MzItMTguNzMyaDMyNi4zNjQgICBjMTAuMzQ1LDAsMTguNzMyLDguMzg3LDE4LjczMiwxOC43MzJWNTEyeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6Izg0REJGRjsiIGQ9Ik0xMzcuMzY2LDE4NS43NWgyMzcuMjY4YzEwLjM0NSwwLDE4LjczMi04LjM4NywxOC43MzItMTguNzMyVjEwLjk3M2wtNS40ODctNS40ODcgICBDMzg0LjM2NywxLjk3MywzNzkuNjAzLDAsMzc0LjYzNCwwaC0yNTZ2MTY3LjAxOEMxMTguNjM0LDE3Ny4zNjMsMTI3LjAyMSwxODUuNzUsMTM3LjM2NiwxODUuNzV6Ii8+CjwvZz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNTRDOUVCOyIgZD0iTTQzNy45MTQsMjk4LjIwNGMwLTEwLjM0NS04LjM4Ny0xOC43MzItMTguNzMyLTE4LjczMkgyNTZWNTEyaDE4MS45MTRWMjk4LjIwNHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NEM5RUI7IiBkPSJNMzg3Ljg3OSw1LjQ4NkMzODQuMzY3LDEuOTczLDM3OS42MDMsMCwzNzQuNjM0LDBIMjU2djE4NS43NWgxMTguNjM0ICAgYzEwLjM0NSwwLDE4LjczMi04LjM4NywxOC43MzItMTguNzMyVjEwLjk3M0wzODcuODc5LDUuNDg2eiIvPgo8L2c+CjxwYXRoIHN0eWxlPSJmaWxsOiMxQkIzRjk7IiBkPSJNMzA5LjUxNCwxMzAuNzM1Yy0xMC4zNDUsMC0xOC43MzItOC4zODctMTguNzMyLTE4LjczMlY3My43NDdjMC0xMC4zNDUsOC4zODctMTguNzMyLDE4LjczMi0xOC43MzIgIGMxMC4zNDUsMCwxOC43MzIsOC4zODcsMTguNzMyLDE4LjczMnYzOC4yNTZDMzI4LjI0NiwxMjIuMzQ5LDMxOS44NTksMTMwLjczNSwzMDkuNTE0LDEzMC43MzV6Ii8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=);
    background-size: 45px 45px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: gainsboro;
    border-color: none;
    border-radius: 50px;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    display: none;
  }
  #texto-nombre{
    width: 200px;
    height: 30px;
    position: absolute;
    top: 30px;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 9999;
    border-radius: 3px;
    text-align: center;
    display: none;
  }
  #ClistaDeDispositivos{
    width: 150px;
    height: 30px;
    position: absolute;
    top: 30px;
    left: 15%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 9999;
    border-radius: 3px;
  }
</style>