<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="camara-body">
              <!-- zona nuevo ambiente -->
              <div id="solicitud-rotar">
                <p class="alert alert-warning" role="alert">Es necesario rotar pantalla para utilizar este caracteristica
                  <br>  Por favor, confirme manualmente</p>
                <button class="btn btn-success btn-lg" v-on:click="iniciarModoMobile()">Confirmar rotacion</button>
                <button class="btn btn-danger btn-lg" @click="CerrarCamara">Cancelar </button>
              </div>
              <select name="listaDeDispositivos" id="ClistaDeDispositivos" style="display:none"></select>
              <input id="texto-nombre" lass="form-control" v-model="nombreAmbiente" placeholder="Ingresa el Nombre">
              <button id="boton-cancelar" class="btn btn-danger modal-default-button" @click="CerrarCamara"> </button>
              <button id="boton-guardar" class="btn btn-success modal-default-button" @click="GuardarFoto"> </button>
              <img id="finalFoto" src="" style="display:none">
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'Modal',
  props: {
    fotoM: {}
  },
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
          listaDeDispositivos: {}
        }
      },
      nuevaFoto: {
        imagen: '',
        cierro: true
      },
      imagenFinal: ''
    }
  },
  mounted: function () {
    // console.log('camara movil, montado')
    document.documentElement.style.overflowY = 'hidden'
    document.documentElement.style.overflowX = 'hidden'
    document.querySelector('#solicitud-rotar').style.display = 'inline'
    window.scrollTo(0, 0)
  },
  methods: {
    iniciarModoMobile () {
      // console.log('modo movil iniciado')
      this.rotarVentana()
      var este = this
      setTimeout(() => {
        document.getElementById('finalFoto').src = este.fotoM.url
        este.configurarPantallaM()
      }, 350)
    },
    CerrarCamara () {
      if (this.nuevaFoto.cierro) {
        this.$emit('close')
        document.body.style.webkitTransform = 'rotate(0deg)'
      } else {
        this.kamara.varPantalla.canvas.style.display = 'none'
        this.nuevaFoto.cierro = true
      }
    },
    GuardarFoto () {
      if (this.nombreAmbiente.length > 5) {
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
    configurarPantallaM () {
      // ocultar solicitud
      document.querySelector('#solicitud-rotar').style.display = 'none'
      document.querySelector('#solicitud-rotar').width = document.innerWidth
      document.querySelector('#solicitud-rotar').height = document.innerHeight
      // mostrar fotografia
      document.getElementById('finalFoto').style.display = null
      // configurar modal
      document.querySelector('.modal-container').style.height = window.innerHeight + 'px'
      document.querySelector('.camara-body').style.height = window.innerHeight + 'px'
      // botones
      var guardar = document.querySelector('#boton-guardar')
      guardar.style.display = 'inline'
      guardar.style.top = (window.innerHeight - 50) + 'px'
      var cancelar = document.querySelector('#boton-cancelar')
      cancelar.style.display = 'inline'
      cancelar.style.top = (window.innerHeight - 35) + 'px'
      cancelar.style.left = (window.innerWidth / 2 + 100) + 'px'
      var textoNombre = document.getElementById('texto-nombre')
      textoNombre.style.display = 'inline'
    },
    rotarVentana () {
      // console.log('rotar pantalla movil camara')
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
    }
  },
  beforeDestroy: function () {
    // console.log('Destroy: opcion camara movil')
    // recuperar scroll
    document.documentElement.style.overflowY = ''
    document.documentElement.style.overflowX = ''
    // volver a modo vertical
    screen.orientation.lock('portrait')
    // saliendo de pantalla completa
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
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
    /*
    background-color: rgba(0, 0, 0, .8);
    */
    background-color: blue;
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
    /*
    background-color: #383838;
    */
    background-color: blue;
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
  #solicitud-rotar{
    display: none;
    height: 30px;
    position: absolute;
    margin-top: 50px;
    left: 15%;
    right: 15%;
    z-index: 9999;
    border-radius: 3px;
  }
</style>