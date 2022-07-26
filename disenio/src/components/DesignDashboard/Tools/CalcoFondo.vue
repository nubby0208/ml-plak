<template>
  <div class="container-calco">
    <div class="container-calco calco-fondo">
      <table class="table table-bordered table-calco">
        <tbody>
          <tr>
            <td rowspan="2" class="short-1"></td>
            <td colspan="6" class="text-center short-6">{{calco.AVeta}}</td>
            <td rowspan="2" class="short-1"></td>
          </tr>
          <tr>
            <td colspan="5" class="short-5">{{ calco.generalName }}</td>
            <td colspan="1" class="short-1">{{ calco.moduleName }}</td>
          </tr>
          <tr>
            <td rowspan="9" class="short-1">{{calco.LVeta}}</td>
            <td colspan="5" class="short-5">{{ calco.generalMueble }}</td>
            <td class="short-1"></td>
            <td rowspan="9" class="short-1">{{calco.LVeta}}</td>
          </tr>
          <tr>
            <td colspan="1" class="short-2">{{ calco.separator.Name || calco.separator.name}}</td>
            <td colspan="5" class="short-3">{{ calco.extra }}</td>
          </tr>
          <tr>
              <td colspan="6" class="grey">
                  {{ calco.material }}
              </td>
          </tr>
          <tr>
            <td colspan="6" class="text-center short-6">{{calco.AVeta}}</td>
          </tr>
          <tr class="calco-custom-drawing-sketch" v-if="calco.separator.drawing">
            <td colspan="8" style="height:200px">
              <img :src="calco.separator.drawing.front" width="300" height="200" />
            </td>
          </tr>
          <tr v-if="getConexionesDrawing(calcoInfo).length > 0">
            <td class="short-1">X</td>
            <td class="short-1">Y</td>
            <td class="short-1">Alto</td>
            <td class="short-1">Ancho</td>
            <td class="short-1" colspan="2">Herramienta</td>
            <td class="short-1" colspan="2">Cant. C</td>
          </tr>
          <tr v-for="(c, index) in getConexionesDrawing(calcoInfo)" :key="index">
            <td class="short-1">{{ c.x | round }}</td>
            <td class="short-1">{{ c.y | round }}</td>
            <td class="short-1">{{ c.alto | round }}</td>
            <td class="short-1">{{ c.ancho  | round }}</td>
            <td class="short-1" colspan="2">{{ c.herramienta }}</td>
            <td class="short-1" colspan="2">{{ c.cantPasadas | round }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    calco () {
      return this.$store.getters.getCalcoInfo(this.id)
    }
  },
  methods: {
    getConexionesDrawing(calco){
      try {
        return calco.conexionesDrawingCurrent ? calco.conexionesDrawingCurrent:[];
      } catch (error) {
        return []
      }
    },
  }
}
</script>

<style scoped>
td {
  font-size: 11px;
}
.short-1 {
  width: 50px;
}
.short-2 {
  width: 100px;
}
.short-4 {
  width: 200px;
}
.short-6 {
  width: 300px;
}
.table-calco {
  width: 285px;
  font-size: 13px;
  margin-right: 5px;
}
.green {
  background-color: lightgreen;
}
.grey {
  background-color: lightgray;
}
.container-calco {
  display: inline-block;
  vertical-align: top;
}

@media print {
  .short-1 {
    min-width: 60px !important;
    max-width: 70px !important;
  }

  td,
  td div {
    font-size: 18px !important;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
  }
}
</style>