<template>
  <div class="container">
    <form v-if="sendingForm">
      <div class="row mt-5">
        <div class="w-100 d-none d-md-block"></div>
        <div class="col-6 col-sm-4">
          <input
            type="date"
            class="form-control"
            v-model="fechaEnvio"
            @change="getPlanilla(fechaEnvio)"
          />
        </div>
        <button
          type="button"
          class="btn btn-primary"
          v-show="!editar"
          :disabled="sendingButton"
          @click="printpage()"
        >
          Imprimir
        </button>
        <button
        type="button"
        class="btn btn-success"
        v-show="!editar"
        @click="editarPlanilla()">
        Editar Planilla
        </button>
        <button
        type="button"
        class="btn btn-danger"
        v-show="editar"
        @click="finalizarPlanilla()">
        Finalizar Edición
        </button>
      </div>
    </form>

    <div id="print" ref="print" class="row mt-5">
      <table style="width:800px;" border="0">
          <tr>
            <th colspan="2" align="center"><h2>Planilla de Horarios</h2></th>
          </tr>
          <tr>
            <td colspan="2" align="right"><b>ML PLAK - Mariano Hernan Álvarez - Cuit 20 28765117 2</b></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td align="left"><b>ML PLAK - La Plata AV 72 N868 e 12 y 13</b></td>
            <td align="right"><b>Fecha: {{fechaPlanilla}}</b></td>
          </tr>
      </table>
      <table style="width:800px;" border="2" cellpadding="0" cellspacing="0">
        <thead style="background-color: beige">
          <tr>
            <th>Nombre</th>
            <th>Cuit-Cuil</th>
            <th>Ingreso</th>
            <th>Salida</th>
            <th>Firma</th>
          </tr>
        </thead>
        <tbody>
          <tr class="font-weight-bold" style="height:60px;" v-for="listado in listadohorario" :key="listado.nombre">
            <td style="width:40%;">{{ listado.nombre }}</td>
            <td style="width:20%;" align="center">{{ listado.cuit_cuil }}</td>
            <td v-show="editar" align="center">
              <input
              id="inicio"
              style="text-align: center; width:50px;"
              name="inicio"
              type="text"
              v-model="listado.inicio">
            </td>
            <td v-show="editar" align="center">
              <input
              id="fin"
              style="text-align: center; width:50px;"
              name="fin"
              type="text"
              v-model="listado.fin">
            </td>
            <td v-show="!editar" align="center">
              {{listado.inicio}}
            </td>
            <td v-show="!editar" align="center">
              {{listado.fin}}
            </td>
            <td style="width:20%;"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.estados-table {
  background: white;
}
.estados-table tr,
.estados-table td {
  padding-top: 0rem;
  padding-bottom: 0rem;
}
</style>

<script>

import { HTTP } from "../../../index";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      editar: false,
      fechaEnvio:"",
      fechaPlanilla:"",
      listadohorario: [],
      sendingButton: false,
      sendingForm: true,
    };
  },
  mounted() {
    this.fechaEnvio =  this.$moment();
    this.getPlanilla(this.fechaEnvio);
  },

  methods: {
   /*download() {
      var doc = new jsPDF('l', 'pt', 'legal');
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();
      window.html2canvas = html2canvas;

       html2canvas(document.querySelector("#print")).then(canvas => {
        doc.save("planillahoraria.pdf");
      });
      /*
      doc.html(document.querySelector("#print"),{
          callback: function (pdf) {
          pdf.save("planillahoraria.pdf");
          },
          margin: 10,
          autoPaging: 'text',
          x: 1,
          y: 1,
          width: width
      });
    }*/
   editarPlanilla() {
       this.editar = true;
   },

   finalizarPlanilla() {
       this.editar = false;
   },

   download() {

        var HTML_Width = $(".print").width();
        var HTML_Height = $(".print").height();
        var top_left_margin = 15;
        var PDF_Width = HTML_Width+(top_left_margin*2);
        var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;
        var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;

        //var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt',  'legal', [PDF_Width, PDF_Height]);
        // pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);

        pdf.html(document.querySelector("#print"),{
          callback: function (pdf) {
          for (var i = 1; i <= totalPDFPages; i++) {
            pdf.addPage(PDF_Width, PDF_Height);
          }
          pdf.save("planillahoraria.pdf");
          },
          margin: 10,
          autoPaging: 'text',
          x: 1,
          y: 1,
          width: PDF_Width
      });

	 },

   printpage() {
      let printContents = document.getElementById('print').innerHTML;
      let w = window.open();
      w.document.write(printContents);
      w.document.close(); // necessary for IE >= 10
      w.focus(); // necessary for IE >= 10
		  w.print();
		  w.close();
    },

    getPlanilla(fecha) {
      this.fechaPlanilla =  this.$moment(fecha).format("DD/MM/YYYY");
      this.listadohorario = [];
      HTTP.get("/api/asistencia/planilla/" + fecha)
        .then((result) => {
          console.log(result);
          if (result.data) {
            this.listadohorario = result.data.data;
            if (this.listadohorario.lenght > 0)
              this.sendingButton = true;
            else
              this.sendingButton = false;
          } else {
            console.log("falló");
          }
        })
        .catch((result) => {
          console.log(result);
        });
    },
  },
};
</script>
