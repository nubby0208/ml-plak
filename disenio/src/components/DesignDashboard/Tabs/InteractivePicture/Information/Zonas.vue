<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div id="modal-zona" class="modal-container">
          <div id="botonera-zona">
            <b-button-group vertical class="shadow-sm">
              <b-button
                @click="cerrarZona"
                class="btn-lg btn btn-danger"
              >
                <img
                  :src="url(require('@/assets/exit.png'))"
                  width="25px"
                  alt=""
                >
              </b-button>
              <b-button
                @click="zoomCanvas"
                class="btn-lg btn btn-light"
              >
                <img                  
                  :src="url(require('@/assets/find.png'))"
                  width="25px"
                  alt=""
                >
              </b-button>
              <b-button class="btn-lg btn btn-light">
                <img                  
                  :src="url(require('@/assets/edit.png'))"
                  width="25px"
                  alt=""
                >
              </b-button>
              <b-button 
                id="z-add" 
                @click="agregarZona"
                class="btn-lg btn btn-light">
                <img                  
                  :src="url(require('@/assets/more.png'))"
                  width="25px"
                  alt=""
                >
              </b-button>
              <b-button
                id="z-remove" 
                @click="removerZona"
                class="btn-lg btn btn-light"
              >
                <img
                  :src="url(require('@/assets/trash.png'))"
                  width="25px"
                  alt=""
                >
              </b-button>
              <b-button
                class="btn-lg btn btn-success">
                <img                  
                  :src="url(require('@/assets/sd-card.png'))"
                  width="25px"
                  alt="">
              </b-button>
            </b-button-group>
          </div>
          <canvas
            @click="clickCanvas"
            class="shadow-sm"
            id="canvas-zona"
            width="512"
            height="384"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    ambienteVisible: {}
  },
  data () {
    return {
      mensaje: '',
      imagen: '',
      size: {w: '', h: ''},
      canvas: {
        canvas: {},
        ctx: {},
        scale: 1,
        circles: [],
        informacion: [],
        areaLibre: Boolean
      },
      removerFull: false,
      agregarFull: false,
      posicionX: null,
      posicionY: null
    }
  },
  mounted: function () {
    this.sizeImage()
    this.configurarPantalla()
    this.abrirCanvas()
    // inicializacion, buscar objetos
    this.canvas.ctx.strokeStyle = 'red'
    for (var i = 0; i < 4; i++) {
      // seccion que crea circulos
      this.canvas.circles.push(this.Circle(
        Math.floor((Math.random() * (this.canvas.canvas.width - 40)) + 20),
        Math.floor((Math.random() * (this.canvas.canvas.height - 40)) + 20),
        20))
      // llena el circulo
      this.canvas.ctx.fill(this.canvas.circles[i], 'nonzero')
      this.canvas.ctx.lineWidth = 3
      this.canvas.ctx.stroke(this.canvas.circles[i], 'nonzero')
    }
  },
  methods: {
    abrirCanvas () {
      // inicializa el canvas
      var cvas = document.getElementById('canvas-zona')
      this.canvas.canvas = cvas
      this.canvas.ctx = cvas.getContext('2d')
      cvas.width = this.size.w
      cvas.height = this.size.h
      cvas.style.backgroundImage = 'url(' + this.ambienteVisible.imagen + ')'
    },
    cerrarZona () {
      this.$emit('close')
      // this.$emit('nuevoMensaje', this.mensaje)
    },
    configurarPantalla () {
      // area para configurar la pantalla visualmente, modo escritorio
      document.documentElement.style.overflowY = 'hidden'
      document.documentElement.style.overflowX = 'hidden'
      let modal = document.getElementById('modal-zona')
      modal.style.height = window.innerHeight + 'px'
    },
    sizeImage () {
      // ajusta el tamaño del canvas
      var image = document.createElement('img')
      image.src = this.ambienteVisible.imagen
      this.size.w = image.width
      this.size.h = image.height
    },
    zoomCanvas () {
      // zoom para el canvas
      var cvas = this.canvas.canvas
      if (cvas.width > (this.size.w * 2)) {
        cvas.width /= 2
        cvas.height /= 2
      } else {
        cvas.width *= 1.2
        cvas.height *= 1.2
      }
    },
    /*
      METODOS DE CANVAS
    */
    abrirObjeto (posicion) {
      var circles = this.canvas.circles
      var ctx = this.canvas.ctx
      console.log('revisando si existe objeto en el area')
      for (var i = circles.length - 1; i >= 0; --i) {
        if (ctx.isPointInPath(circles[i], posicion[0], posicion[1], 'nonzero')) {
          console.log('ocupado en:' + i)
          alert('presionado ' + circles[i].text)
          console.log(circles[i])
          this.canvas.areaLibre = false
          break
        }
      }
    },
    agregarCirculo (posicion) {
      var circles = this.canvas.circles
      var canvas = this.canvas.canvas
      var areaLibre = this.canvas.areaLibre
      var ctx = this.canvas.ctx
      console.log('agregando circulo')
      areaLibre = true
      // comprueba si el area esta ocupada
      for (var i = circles.length - 1; i >= 0; --i) {
        if (ctx.isPointInPath(circles[i], posicion[0], posicion[1], 'nonzero')) {
          console.log('ocupado en:' + i)
          areaLibre = false
          break
        }
      }
      if (areaLibre) {
        console.log('area libre encontrada')
        circles.push(this.Circle(posicion[0], posicion[1], 20))
        ctx.lineWidth = 3
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (var j = 0; j < circles.length; j++) {
          console.log('disenio de circulo')
          ctx.fill(circles[j], 'nonzero')
          ctx.stroke(circles[j], 'nonzero')
        }
      } else {
        console.log('area ocupada, no se puede agregar circulo')
      }
    },
    removerCirculo (posicion) {
      var canvas = this.canvas.canvas
      var circles = this.canvas.circles
      var ctx = this.canvas.ctx
      console.log('removiendo circulo')
      for (var i = circles.length - 1; i >= 0; --i) {
        if (ctx.isPointInPath(circles[i], posicion[0], posicion[1], 'nonzero')) {
          circles.splice(i, 1)
          console.log('circulo eliminado')
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (var j = 0; j < circles.length; j++) {
        console.log('actualizando circulos en pantalla')
        console.log('disenio de circulo')
        ctx.fill(circles[j], 'nonzero')
        ctx.stroke(circles[j], 'nonzero')
      }
    },
    corregirPosicion (e) {
      console.log('corrigiendo coordenadas')
      var r = this.canvas.canvas.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top]
    },
    Circle (x, y, radius) {
      console.log('nuevo circulo')
      var cpath = new Path2D()
      cpath.arc(x, y, radius, 0, Math.PI * 2)
      cpath.text = 'hola circulo [' + x + ',' + y + ']'
      return cpath
    },
    agregarZona (event) {
      this.agregarFull = !this.agregarFull
      this.removerFull = false
      document.querySelector('#z-remove').classList.remove('btn-info')
      // event.target.classList.toggle('btn-info')
      // $("#removerActivo").html("remover Apagado");
      if (this.agregarFull) {
        document.querySelector('#z-add').classList.toggle('btn-info')
      } else {
        document.querySelector('#z-add').classList.remove('btn-info')
      }
    },
    removerZona (event) {
      this.removerFull = !this.removerFull
      this.agregarFull = false
      document.querySelector('#z-add').classList.remove('btn-info')
      if (this.removerFull) {
        document.querySelector('#z-remove').classList.toggle('btn-info')
      } else {
        document.querySelector('#z-remove').classList.remove('btn-info')
      }
    },
    clickCanvas (event) {
      var posicion = this.corregirPosicion(event)
      console.log('imagen precionada en posicion: ' + posicion)
      // SECCION DE REMOVER
      if (this.removerFull) {
        this.removerCirculo(posicion)
      } else if (this.agregarFull) {
        this.agregarCirculo(posicion)
      } else {
        this.abrirObjeto(posicion)
      }
    }
  }
}
</script>

<style scoped>
  #botonera-zona{
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    background-origin: center;
    background-repeat: no-repeat;
    background-size: 100% auto;
  }
  #canvas-zona{   
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 998;
    background-origin: center;
    background-repeat: no-repeat;
    background-size: 100% auto;
    border-radius: 5px;
  }
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
  .btn-info{
    background-color: #007bff;
  }
</style>