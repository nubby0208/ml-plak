<template>
  <div class="mlPlak-background d-flex" :style="{ backgroundImage: 'url(' + image + ')' }">
    <div class="container align-self-center">
      <div class="row">
        <div class="col-12">
          <h1 class="text-center">ML PLAK</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">MUEBLES DE DISEÑO</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h3 class="text-center">Soluciones en Melamina y Tecnología.</h3>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'MlPlakIndex',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      image: 'static/mlplak_background.jpg'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mlPlak-background{
  background-position-x: center;
  background-size: cover;
  height: auto;
  left: 0;
  min-height: 100%;
  min-width: 100%;
  position: absolute;
  top: 0;
  width: auto;
  color: white;
}
.mlPlak-background h1{
  font-weight: 900;
  font-size: 7em;
}
.mlPlak-background h2{
  font-weight: 500;
  font-size: 42px;
}
.mlPlak-background h3{
  font-weight: 300;
}
</style>
