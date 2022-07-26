<template>
  <div class="text-left calco-simple">
    <table class="table table-bordered table-calco">
      <tbody>
        <tr>
          <td rowspan="2" class="short-1"></td>
          <td colspan="6" class="text-center short-6 grey">490 Melamina</td>
          <td rowspan="2" class="short-1"></td>
        </tr>
        <tr>
          <td colspan="4" class="short-2">Judith</td>
          <td colspan="2" class="short-4">Mod 1</td>
        </tr>
        <tr>
          <td rowspan="9" class="short-1 grey">2000 Melamina</td>
          <td colspan="4" class="short-4">Interior</td>
          <td class="short-1">AR</td>
          <td class="short-1">NO</td>
          <td rowspan="9" class="short-1">2000</td>
        </tr>
        <tr>
          <td colspan="4" class="short-4">Lateral izquierdo</td>
          <td class="short-1">1</td>
          <td class="short-1"></td>
        </tr>
        <tr>
          <td colspan="6">-</td>
        </tr>
        <tr>
          <td colspan="6">-</td>
        </tr>
        <tr>
          <td colspan="6">-</td>
        </tr>
        <tr>
          <td colspan="6">Modulo cajones y cubos</td>
        </tr>
        <tr>
          <td colspan="6">-</td>
        </tr>
        <tr>
          <td colspan="6">-</td>
        </tr>
        <tr>
          <td colspan="6">-</td>
        </tr>
        <tr>
          <td rowspan="2" class="short-1"></td>
          <td class="short-1">Cara</td>
          <td class="short-1 green">bue_</td>
          <td colspan="4" class="short-4"></td>
          <td rowspan="2" class="short-1"></td>
        </tr>
        <tr>
          <td colspan="6" class="text-center short-6 grey">490 Melamina</td>
        </tr>
        <tr>
          <td colspan="8"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
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
  width: 400px;
  font-size: 13px;
}
.green {
    background-color: lightgreen;
}
.grey {
    background-color: lightgray;
}

@media print
{    
  .short-1 {
    min-width: 60px !important;
    max-width: 70px !important;
  }

  td, td div {
    font-size: 18px !important;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
}
</style>
