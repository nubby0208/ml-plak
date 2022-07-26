<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="camara-body">
              <!-- zona nuevo ambiente -->
              <div id="sf-solicitud-rotar">
                <p class="alert alert-warning" role="alert">Es necesario rotar pantalla para utilizar este caracteristica
                  <br>  Por favor, confirme manualmente</p>
                <button class="btn btn-success btn-lg" v-on:click="iniciarModoMobile()">Confirmar rotacion</button>
                <button class="btn btn-danger btn-lg" @click="CerrarCamara">Cancelar </button>
              </div>
              <input id="sf-nombre" lass="form-control" v-model="nombreAmbiente" placeholder="Ingresa el Nombre">
              <div id="div-foto">
                <b-form-file 
                    @change="ImagenSeleccionada"
                    id="sf-subir-foto"
                    accept=".jpg, .png, .gif"
                    v-model="file"
                    :state="Boolean(file)"
                    placeholder="Subir Imagen"></b-form-file>
              </div>
              <img width="900px" height="506px" id="imagen-subida" ref="image" :src="imagenFile">
              <div id="sf-redimension" style="display:none">
                <img id="sf-cropper" ref="image" width="900px" height="506px" >
              </div>
              <img id="sf-finalFoto" src="" style="display:none">
              <canvas id="sf-preview" style="display:none"></canvas>
              <button id="sf-guardar-m" class="btn btn-success modal-default-button" @click="GuardarFotoM"> </button>
              <button id="sf-cancelar" class="btn btn-danger modal-default-button" @click="CerrarCamara"> </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'Modal',
  data () {
    return {
      file: {},
      imagenFile: {},
      nombreAmbiente: '',
      kamara: {
        varPantalla: {
          imagenSubida: {},
          zonaRedimension: {}
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
    console.log('modo mmm')
    window.scrollTo(0, 0)
    // codigo para capturar imagen
    this.kamara.varPantalla.imagenSubida = document.querySelector('#imagen-subida')
    this.kamara.varPantalla.zonaRedimension = document.querySelector('#sf-redimension')
    this.configurarPantallaM()
    document.querySelector('#sf-cancelar').style.top = (200) + 'px'
    document.querySelector('#sf-cancelar').style.left = (window.innerWidth / 2) + 'px'
  },
  methods: {
    iniciarModoMobile () {
      document.querySelector('#sf-solicitud-rotar').style.display = 'none'
      this.rotarVentana()
      setTimeout(() => {
        var df = document.querySelector('#div-foto')
        df.style.display = 'block'
      }, 350)
    },
    ImagenSeleccionada (event) {
      document.getElementById('div-foto').style.display = 'none'
      var este = this
      this.rotarVentana()
      document.getElementById('sf-guardar-m').style.display = 'block'
      document.getElementById('sf-cancelar').style.display = 'block'
      document.getElementById('sf-nombre').style.display = 'block'
      setTimeout(() => {
        este.configurarPantallaM()
        const reader = new FileReader()
        reader.readAsDataURL(este.file)
        reader.onload = e => {
          este.imagenFile = e.target.result
          document.getElementById('imagen-subida').style.display = 'inline'
          var image = new Image()
          image.src = e.target.result
          image.onload = function () {
            var w = image.naturalWidth
            var h = image.naturalHeight
            if (parseInt(h) > parseInt(w)) {
              document.getElementById('imagen-subida').height = window.innerHeight
              var percent = (window.innerHeight * 100 / h) * 0.01
              var newWidth = percent * w
              document.getElementById('imagen-subida').width = newWidth
            } else if (parseInt(w) >= parseInt(h)) {
              document.getElementById('imagen-subida').width = window.innerWidth
              var percent2 = (window.innerWidth * 100 / w) * 0.01
              var newHeight = percent2 * h
              document.getElementById('imagen-subida').height = newHeight
              document.getElementById('imagen-subida').style.position = 'fixed'
            }
            image = null
          }
        }
      }, 500)
    },
    CerrarCamara () {
      if (this.nuevaFoto.cierro) {
        this.$emit('close')
        this.cropper = null
      } else {
        this.nuevaFoto.cierro = true
      }
    },
    GuardarFotoM () {
      if (this.nombreAmbiente.length > 5) {
        this.$emit('close')
        this.imagenFinal = document.getElementById('imagen-subida').src
        this.$emit('nuevaFoto', {foto: this.imagenFinal, nombre: this.nombreAmbiente})
      } else {
        document.querySelector('#sf-nombre').classList.add('alert-danger')
        document.querySelector('#sf-nombre').placeholder = 'nombre obligatorio'
        setTimeout(function () {
          document.querySelector('#sf-nombre').classList.remove('alert-danger')
          document.querySelector('#sf-nombre').placeholder = 'Ingresa el Nombre'
        }, 2000)
      }
    },
    configurarPantallaM () {
      // botones
      document.getElementById('sf-guardar-m').style.top = (window.innerHeight - 50) + 'px'
      document.querySelector('#sf-cancelar').style.top = (window.innerHeight - 35) + 'px'
      document.querySelector('#sf-cancelar').style.left = (window.innerWidth / 2 + 120) + 'px'
      // solicitud
      document.querySelector('#sf-solicitud-rotar').style.width = 'auto'
      document.querySelector('#sf-solicitud-rotar').style.top = '100px'
      document.querySelector('#sf-solicitud-rotar').style.left = '10%'
      document.querySelector('#sf-solicitud-rotar').style.right = '10%'
      // pantalla modal
      document.querySelector('.modal-container').style.height = window.innerHeight + 'px'
      document.querySelector('.modal-mask').style.height = window.innerHeight + 'px'
      document.querySelector('.camara-body').style.height = window.innerHeight + 'px'
      // srcoll
      document.body.style.overflowY = 'hidden'
      document.body.style.overflowX = 'hidden'
    },
    rotarVentana () {
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
    document.body.style.overflowY = ''
    document.body.style.overflowX = ''
    screen.orientation.lock('portrait')
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
  #sf-solicitud-rotar{
    display: none;
    width: min-content;
    position: absolute;
    top: 40%;
    left: 15%;
    border-radius: 3px;
  }
  #div-foto{
      margin-top: 25%;
      width: 50%;
      transform: translate(-50%, -50%);
      margin-left: 50%;
  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7); /** pppppppppp */
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
  #imagen-subida{
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 998;
  }
  #sf-redimension{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 998;
  }
  #sf-cancelar{
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
  #sf-guardar{
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
  #sf-guardar-m{
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
  #sf-nombre{
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
  .custom-file-input:lang(en)~.custom-file-label::after {
    content: "Buscar";
    display: none !important;
  }
</style>