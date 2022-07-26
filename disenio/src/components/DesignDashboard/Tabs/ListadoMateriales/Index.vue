<template>
  <div class="lista-materiales">
    <h1 class="no-print">Materiales</h1>

    <div v-if="!imagesLoaded" class="spinner-wrapper">
      <vue-simple-spinner message="Cargando..." size="60"></vue-simple-spinner>
    </div>

    <div v-if="imagesLoaded && !noImages" class>
      <lightbox class="draggable" :images="images" :nav="true"></lightbox>
    </div>
    <div v-if="imagesLoaded && noImages" class="spinner-wrapper m-3">
      <h3>El proyecto no posee imagenes.</h3>
    </div>
    <div v-if="flgCargandoPresupuesto">
      <vue-simple-spinner message="Cargando..." size="60"></vue-simple-spinner>
    </div>
    <div v-show="!flgCargandoPresupuesto">
      <div class="col-12 mb-3 p-100 text-left">
        <template v-if="presupuestosGuardados.length == 0">

          <button
            class="btn btn-sm btn-secondary mr-3"
            :disabled="(presupuesto.cliente.token_project == null)"
            @click="generarPedidoPresupuesto(true, false, false)"
          >Generar pedido de presupuesto</button>

        </template>
        <template v-else>
          <button
            v-if="presupuesto.estado == 0 || presupuesto.estado == 3"
            class="btn btn-sm btn-secondary mr-3"
            :disabled="(presupuesto.cliente.token_project == null)"
            @click="generarPedidoPresupuesto(true, false, false)"
          >Solicitar arreglo</button>
          <button
            v-if="presupuesto.estado == 0 || presupuesto.estado == 3"
            class="btn btn-sm btn-secondary mr-3"
            @click="generarPedidoPresupuesto(true, true, false)"
            :disabled="presupuesto.id == null"
          >Recotizacion de modelo</button>
          <button
            v-if="presupuesto.estado !== 0 && presupuesto.estado !== 3"
            class="btn btn-sm btn-secondary mr-4"
            :disabled="presupuesto.id == null || presupuesto.estado == 0 || presupuesto.estado == 3"
            @click="exportarPdf()"
          >Exportar PDF</button>
        </template>
      </div>
      <div class="col-12 flex">
        <div class="shadow" id="pdf">
          <div class="header-pdf clearfix position-relative">
            <div id="logo">
              <span id="mlplak">MLPLAK</span>
            </div>
            <span class="descripcion">{{presupuesto.cliente.mueble}}</span>
          </div>
          <main>
            <div id="details" class="clearfix text-left">
              <div id="client">
                <div class="to">Presupuesto:</div>

                <h2 id="name">{{presupuesto.cliente.name}}</h2>
                <div class="address">{{presupuesto.cliente.address}}</div>
                <div class="email">{{presupuesto.cliente.mail}}</div>
              </div>
              <div id="invoice">
                <span>Av 72 N868 e 12 y 13. La Plata</span>
                <br />
                <span>(0221) 15-617-5290</span>
                <br />
                <span>Validez del presupuesto: {{presupuesto.validezPresupuesto}}</span>
                <br />
                <span>Validez de la promoción: {{presupuesto.validezPromo}}</span>
              </div>
            </div>
            <div class="flex">
              <div
                id="1"
                class="bg-image-droppable"
                style="width: 360px;height: 250px; border: 1px solid  #a7a7a7;  background-size: cover; background-position: center;"
              ></div>
              <div class="flex" style="flex-direction: column;padding-left: 10px;">
                <div
                  id="2"
                  class="bg-image-droppable"
                  style="height: 120px; margin-bottom:10px; border: 1px solid  #a7a7a7; width: 170px;text-align: left; background-size: cover; background-position: center;"
                ></div>
                <div
                  id="3"
                  class="bg-image-droppable"
                  style="height: 120px;border: 1px solid  #a7a7a7; width: 170px;text-align: left; background-size: cover; background-position: center;"
                ></div>
              </div>

              <div class="flex" style="flex-direction: column;padding-left: 10px;">
                <div
                  id="4"
                  class="bg-image-droppable"
                  style="height: 120px; margin-bottom:10px; border: 1px solid  #a7a7a7; width: 170px;text-align: left; background-size: cover; background-position: center;"
                ></div>
                <div
                  id="5"
                  class="bg-image-droppable"
                  style="height: 120px;border: 1px solid  #a7a7a7; width: 170px;text-align: left; background-size: cover; background-position: center;"
                ></div>
              </div>
            </div>

            <table
              class="table-pdf"
              style="margin-top:20px"
              border="0"
              cellspacing="0"
              cellpadding="0"
            >
              <thead>
                <tr>
                  <th class="unit">LINEA</th>
                  <th class="desc">DESCRIPCION</th>
                  <th class="total">TOTAL</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="unit">Clasica</td>
                  <td class="desc">
                    <span v-if="presupuesto.lineaClasica.length == 0">
                      <h5>Agregue datos de linea clásica</h5>
                    </span>
                    <span v-if="presupuesto.lineaClasica.length > 0">
                      <span
                        v-for="lc in presupuesto.lineaClasica.filter(v => v.mostrar && v.nombre != '')"
                        :key="lc.id"
                      >
                        {{lc.nombre}}
                        <br />
                      </span>
                    </span>
                  </td>
                  <td class="total">
                    <span style="font-size:16px;">${{round(totalClasica)}}</span>
                  </td>
                </tr>
                <tr>
                  <td class="unit">Premium</td>
                  <td class="desc">
                    <span v-if="presupuesto.lineaPremium.length == 0">
                      <h5>Agregue datos de linea premium</h5>
                    </span>
                    <span v-if="presupuesto.lineaPremium.length > 0">
                      <span
                        v-for="lp in presupuesto.lineaPremium.filter(v => v.mostrar && v.nombre != '')"
                        :key="lp.id"
                      >
                        {{lp.nombre}}
                        <br />
                      </span>
                    </span>
                  </td>
                  <td class="total">
                    <span style="font-size:16px;">${{round(totalPremium)}}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="clearfix" style="margin-bottom: 10px;">
              <div id="client">
                <div class="to text-left">Incluye:</div>
                <h2
                  class="text-left"
                  v-if="presupuesto.piezas.length == 0"
                  id="name"
                >Agregue una condición de pago para generar el presupuesto</h2>
                <h2 id="name" v-if="presupuesto.piezas.length > 0">
                  <span
                    v-for="pieza in presupuesto.piezas.filter(v => v.mostrar && v.nombre != '')"
                    :key="pieza.id"
                  >{{pieza.nombre}}</span>
                </h2>
              </div>
              <div id="client" style="float:right">
                <div class="to text-left">Color:</div>
                <h2 class="text-left" id="name">{{presupuesto.color}}</h2>
              </div>
            </div>

            <div class="clearfix" style="margin-top: 20px">
              <div id="client">
                <div class="to text-left">Formas de pago:</div>
                <h2
                  class="text-left"
                  id="name"
                >{{ presupuesto.condicionesPago == '' ? 'Agregue una condición de pago para generar el presupuesto' : presupuesto.condicionesPago}}</h2>
              </div>
            </div>

            <div class="clearfix" style="margin-top: 20px">
              <div id="client">
                <div class="to text-left">Detalles:</div>
                <h2
                  class="text-left"
                  id="name"
                >{{presupuesto.detalles == '' ? 'Agregue un detalle para generar el presupuesto' : presupuesto.detalles}}</h2>
              </div>
            </div>

            <div v-if="message" class="clearfix" style="margin-top: 20px">
              <div id="client">
                <div class="to text-left">Mas información:</div>

                <pre class="pdf-pre" v-html="message"></pre>
                
              </div>
            </div>
            
          </main>
        </div>
        <div class="ml-5" v-if="presupuestosGuardados.length > 0">
          <span class="mb-3" v-if="indiceSeleccionado != 0">
            <b>Presupuesto seleccionado: {{indiceSeleccionado}}</b>
          </span>
          <div style="display: flex;" v-for="(pg, index) in presupuestosGuardados" :key="pg.id">
              <b-tooltip target="tooltip-target-1" triggers="hover">
                Este presupuesto esta vinculado a otro proyecto, puedes cargar el proyecto relacionado usando el boton <b>Ver Proyecto</b>
              </b-tooltip>
              <b-badge
              class="mb-3"
              :variant="pg.estado == 0 || pg.estado == 3 ? 'success':'primary'"
              style="display:block; cursor: pointer"
              >{{'Presupuesto número ' +(index + 1) +": " + pg.usuario + " / " + pg.fecha}} ({{pg.estado == 0 || pg.estado == 3 ? "Cerrado":"Abierto"}}) <b-icon v-if="Number(pg.project_id) !== Number(loadedProjectId)" id="tooltip-target-1" icon="exclamation-circle-fill"></b-icon></b-badge>
            <div style="display: flex;" v-if="Number(pg.project_id) !== Number(loadedProjectId)">
              <b-badge class="mb-3" variant="secondary" @click="cargarProyecto(pg.project_id)" style="display:block; cursor: pointer; margin-left:5px;"> Ver Proyecto </b-badge>
              <b-badge class="mb-3" v-if="pg.estado == 0 || pg.estado == 3" @click="verPdf(pg.id)" variant="secondary" style="display:block; cursor: pointer; margin-left:5px;"> Ver PDF </b-badge>
            </div>
            <div style="display: flex;" v-else-if="Number(pg.project_id) == Number(loadedProjectId) && (pg.estado == 0 || pg.estado == 3)">
              <b-badge class="mb-3" @click="verPdf(pg.id)" variant="secondary" style="display:block; cursor: pointer; margin-left:5px;"> Ver PDF </b-badge>
            </div>
          </div>
        </div>
        <div v-if="presupuestosGuardados.length == 0">
          <h4>No hay presupuestos guardados anteriormente</h4>
        </div>
      </div>

      <div class="content shadow">
        <div class="justify-center bg-lightblue align-items-center p-2">
          <b class="text-white">Datos del proyecto y seguimiento</b>
        </div>

        <div class="container">
          <div class="row mt-4">
            <div class="container">
              <hr />
            </div>
            <div class="col-12 flex justify-content-center">
              <table class="table table-bordered table-condensed shadow">
                <tbody>
                  <tr class="p-4">
                    <th>Comentario resumen</th>
                    <td class="p-1">
                      <input
                        type="text"
                        class="form-control"
                        id="staticEmail"
                        placeholder="Agregue aquí un comentario de resumen"
                        v-model="presupuesto.comentarioResumen"
                      />
                    </td>
                  </tr>
                  <tr class="p-4">
                    <th>Comentario opcional</th>
                    <td class="p-1">
                      <input
                        type="text"
                        class="form-control"
                        id="staticEmail"
                        placeholder="Agregue aquí un comentario opcional"
                        v-model="presupuesto.comentarioOpcional"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="container">
              <hr />
            </div>
            <div class="col-12 justify-content-center">
              <button style="margin:10px;" class="btn btn-primary btn-sm" @click="datos_extras_proyecto_seguimiento = !datos_extras_proyecto_seguimiento">{{datos_extras_proyecto_seguimiento ? "Ocutar":"Ver más"}}</button>
            </div>
            <div v-show="datos_extras_proyecto_seguimiento" class="col-12 justify-content-center"><!--Inicio div acordion -->
              
              <div class="container text-left">
                <h5 v-if="presupuesto.observaciones.length === 0">No hay observaciones</h5>
              </div>
              <div
                v-if="presupuesto.observaciones.length > 0"
                class="col-12 flex justify-content-center"
              >
                <table class="table table-bordered table-condensed shadow">
                  <tbody>
                    <tr class="p-4" v-for="obs in presupuesto.observaciones" :key="obs.id">
                      <th>
                        <textarea
                          type="text"
                          class="form-control"
                          id="staticEmail"
                          v-model="obs.observacion"
                          placeholder="Agregue aquí un comentario de observación"
                        />
                      </th>
                      <td class="p-1" style="vertical-align: inherit;">
                        <span>
                          <b>{{obs.usuarioLogueado }}</b>
                          {{" / " + obs.fecha}}hs
                          <span
                            class="plus pointer float-right"
                            @click="removeObservacion(obs.id)"
                          >x</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="container text-right mb-2">
                <span @click="addObservacion()" class="add-another-one">
                  <span class="plus">+</span>Agregar observación
                </span>
              </div>
              <div class="container">
                <hr />
              </div>
              <div class="container text-left">
                <div class="flex">
                  <img
                    v-if="urlImagenSeleccionadaPreview"
                    :src="urlImagenSeleccionadaPreview"
                    width="100"
                  />
                </div>
                <div v-if="currentEventImages.length > 0">
                  <div class="flex justify-content-start">
                    <div
                      class="imagen-client position-relative mr-4"
                      v-for="image in currentEventImages.filter(a=>a.remote === 0)"
                      :key="image.id"
                      style="width: 100px;height: 100px;"
                      @click="showModalImagenes(image.imagen)"
                    >
                      <img  :src="currentEventImagePath +  image.thumb" class="media-object" />
                      <span @click="eliminarImagenCliente(image.id, $event)" class="remove-button remove-image-button">x</span>
                    </div>
                  </div>
                  <div class="col-12 flex justify-content-center">
                    <table class="table table-bordered table-condensed shadow mt-2">
                      <tbody>
                        <tr 
                          class="p-4"
                          v-for="image in currentEventImages.filter(a=>a.remote === 1)"
                          :key="image.id"
                        >
                          <th>
                            <a target="_blank" :href="image.imagen" >{{image.name}}(externo)</a>
                            <span class="remove-btn" @click="eliminarImagenCliente(image.id, $event)">❌</span>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <h5 v-if="currentEventImages.length === 0">No hay imagenes del cliente adjuntas</h5>
                <div class="container text-right p-0 mb-3 mt-4">
                  <input
                    style="display: none"
                    type="file"
                    @change="onFileSelected"
                    ref="fileInputImage"
                    accept="image/jpeg, image/png"
                    multiple="multiple"
                  />
                  <b-dropdown id="dropdown-1" class="m-md-2" variant="outline-info">
                    <template #button-content>
                      <span class="plus">+</span>Agregar imagen del cliente
                    </template>
                    <b-dropdown-item @click="$refs.fileInputImage.click()" >Desde archivo</b-dropdown-item>
                    <b-dropdown-item @click="showModalUploadUrl('imagen')" >Desde url</b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>
              <div class="container">
                <hr />
              </div>
              <div class="container text-left">
                <div v-if="currentEventPdfs.length > 0">
                  <div class="col-12 flex justify-content-center">
                    <table class="table table-bordered table-condensed shadow">
                      <tbody>
                        <tr 
                          class="p-4"
                          v-for="pdf in currentEventPdfs"
                          :key="pdf.id"
                        >
                          <th>
                            <a target="_blank" :href="(pdf.remote && pdf.remote === 1) ? pdf.pdf : currentEventPdfPath+pdf.pdf"  >{{pdf.name}} {{(pdf.remote)?'(externo)':''}}</a>
                            <span class="remove-btn" @click="eliminarPdfCliente(pdf.id, $event)">❌</span>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <h5 v-if="currentEventPdfs.length === 0">No hay pdfs del cliente adjuntos</h5>
                <div class="container text-right p-0 mb-3 mt-4">
                  <input
                    style="display: none"
                    type="file"
                    @change="onFileSelected"
                    ref="fileInputPdf"
                    accept="application/pdf"
                    multiple="multiple"
                  />
                  <b-dropdown id="dropdown-1" class="m-md-2" variant="outline-info">
                    <template #button-content>
                      <span class="plus">+</span>Agregar pdf del cliente
                    </template>
                    <b-dropdown-item @click="$refs.fileInputPdf.click()" >Desde archivo</b-dropdown-item>
                    <b-dropdown-item @click="showModalUploadUrl('pdf')" >Desde url</b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>
              <div class="container">
                <hr />
              </div>
              <div class="container text-left">
                <div v-if="currentEventVideos.length > 0">
                  <div class="col-12 flex justify-content-center">
                    <table class="table table-bordered table-condensed shadow">
                      <tbody>
                        <tr 
                          class="p-4"
                          v-for="video in currentEventVideos"
                          :key="video.id"
                        >
                          <th>
                            <a target="_blank" :href="(video.remote && video.remote === 1) ? video.video : currentEventVideoPath+video.video" >{{video.name}} {{(video.remote)?'(externo)':''}}</a>
                            <span class="remove-btn" @click="eliminarVideoCliente(video.id, $event)">❌</span>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <h5 v-if="currentEventVideos.length === 0">No hay videos del cliente adjuntos</h5>
                <div class="container text-right p-0 mb-3 mt-4">
                  <input
                    style="display: none"
                    type="file"
                    @change="onFileSelected"
                    ref="fileInputVideo"
                    accept="video/mp4"
                    multiple="multiple"
                  />
                  <span  class="add-another-one">
                    
                  </span>
                  <b-dropdown id="dropdown-1" class="m-md-2" variant="outline-info">
                    <template #button-content>
                      <span class="plus">+</span>Agregar video del cliente
                    </template>
                    <b-dropdown-item @click="$refs.fileInputVideo.click()" >Desde archivo</b-dropdown-item>
                    <b-dropdown-item @click="showModalUploadUrl('video')" >Desde url</b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>

            </div><!-- Fin div acordion -->
          </div>
        </div> <!-- container -->
      </div><!-- content shadow -->
      <div class="content shadow">
        <div class="flex justify-center bg-lightblue align-items-center p-2">
          <div class="col-6">
            <b class="text-white flex justify-content-end">Datos</b>
          </div>
          <div class="col-6 text-white flex justify-content-end">
            <a class="mr-3 pointer text-white" @click="guardarPreset()">Guardar</a>
            <a class="pointer text-white" @click="openModalPreset()">Cargar preset</a>
          </div>
        </div>
        <div class="container">
          <div class="col-12 mt-3">
            <div class="row justify-content-end">
              <div class="form-group row col-6 justify-content-end">
                <div class="col-sm-7">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nombre del preset"
                    v-model="nombrePreset"
                  />
                </div>
              </div>
            </div>
            <div class="container">
              <hr />
            </div>
            <div class="row">
              <div class="col-5 p-0">
                <div class="col-12 p-0">
                  <table class="table table-bordered w-100 shadow">
                    <thead class="thead-dark">
                      <tr>
                        <th style="background: #5f5f5f" colspan="3">Clásica</th>
                      </tr>
                    </thead>
                    <tbody style="vertical-align: unset;">
                      <tr v-for="lc in presupuesto.lineaClasica" :key="lc.id">
                        <th>
                          <input
                            type="text"
                            class="form-control"
                            id="staticEmail"
                            v-model="lc.nombre"
                            placeholder="Agregue aquí un nombre"
                          />
                        </th>
                        <td
                          class="p-1"
                          style="width: 50px; vertical-align: middle;"
                          @click="lc.mostrar = !lc.mostrar"
                        >{{lc.mostrar ? 'Sí' : 'No'}}</td>
                        <td
                          class="p-1"
                          style="width: 50px; vertical-align: middle;"
                          @click="removeItemLineaClasica(lc)"
                        >
                          <button class="btn btn-danger">x</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <b
                    v-if="presupuesto.lineaClasica.length == 0"
                  >No hay datos para mostrar en linea clásica</b>
                  <div class="container text-right mt-3">
                    <span @click="addAttrClasica()" class="add-another-one">
                      <span class="plus">+</span>Agregar en linea clásica
                    </span>
                  </div>
                </div>
                <div class="col-12 p-0 mt-4">
                  <table class="table table-bordered w-100 shadow">
                    <thead class="thead-dark">
                      <tr>
                        <th style="background: #5f5f5f" colspan="3">Premium</th>
                      </tr>
                    </thead>
                    <tbody style="vertical-align: unset;">
                      <tr v-for="lp in presupuesto.lineaPremium" :key="lp.id">
                        <th>
                          <input
                            type="text"
                            class="form-control"
                            id="staticEmail"
                            v-model="lp.nombre"
                            placeholder="Agregue aquí un nombre"
                          />
                        </th>
                        <td
                          class="p-1"
                          style="width: 50px; vertical-align: middle;"
                          @click="lp.mostrar = !lp.mostrar"
                        >{{lp.mostrar ? 'Sí' : 'No'}}</td>
                        <td
                          class="p-1"
                          style="width: 50px; vertical-align: middle;"
                          @click="removeItemLineaPremium(lp)"
                        >
                          <button class="btn btn-danger">x</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <b
                    v-if="presupuesto.lineaPremium.length == 0"
                  >No hay datos para mostrar en linea premium</b>
                  <div class="container text-right mt-3 mb-3">
                    <span @click="addAttrPremium()" class="add-another-one">
                      <span class="plus">+</span>Agregar en linea premium
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-7 flex align-items-center pr-0">
                <div class="col-12">
                  <div class="form-group row text-left">
                    <label for="staticEmail" class="col-sm-5 col-form-label">
                      <b>Color:</b>
                    </label>
                    <div class="col-sm-7">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Color"
                        v-model="presupuesto.color"
                      />
                    </div>
                  </div>
                  <div class="form-group row text-left">
                    <label for="staticEmail" class="col-sm-5 col-form-label">
                      <b>Validez del presupuesto:</b>
                    </label>
                    <div class="col-sm-7">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Validez del presupuesto"
                        v-mask="'##/##/####'"
                        v-model="presupuesto.validezPresupuesto"
                      />
                    </div>
                  </div>
                  <div class="form-group row text-left">
                    <label for="staticEmail" class="col-sm-5 col-form-label">
                      <b>Validez del promoción:</b>
                    </label>
                    <div class="col-sm-7">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Validez de la promoción"
                        v-mask="'##/##/####'"
                        v-model="presupuesto.validezPromo"
                      />
                    </div>
                  </div>
                  <div class="form-group row text-left">
                    <label for="staticEmail" class="col-sm-5 col-form-label">
                      <b>Detalles:</b>
                    </label>
                    <div class="col-sm-7">
                      <textarea
                        type="text"
                        class="form-control"
                        placeholder="Detalles"
                        v-model="presupuesto.detalles"
                      />
                    </div>
                  </div>
                  <div class="form-group row text-left">
                    <label for="staticEmail" class="col-sm-5 col-form-label">
                      <b>Formas y condición de pago:</b>
                    </label>
                    <div class="col-sm-7">
                      <textarea
                        type="text"
                        class="form-control"
                        placeholder="Formas y condición de pago"
                        v-model="presupuesto.condicionesPago"
                      />
                    </div>
                  </div>
                  <div class="form-group row text-left">
                    <label for="staticEmail" class="col-sm-5 col-form-label">
                      <b>Comentario int. de ppto:</b>
                    </label>
                    <div class="col-sm-7">
                      <textarea
                        type="text"
                        class="form-control"
                        placeholder="Comentario interno de presupuesto"
                        v-model="presupuesto.comentarioInternoPresupuesto"
                      />
                    </div>
                  </div>
                  <div
                    class="form-group row text-left justify-content-end"
                    v-for="pieza in presupuesto.piezas"
                    :key="pieza.id"
                  >
                    <input class="form-control col-4" v-model="pieza.nombre" />
                    <div
                      @click="pieza.mostrar = !pieza.mostrar"
                      class="col-1 flex justify-content-center align-items-center pointer"
                    >
                      <span>{{pieza.mostrar ? 'Sí' : 'No'}}</span>
                    </div>
                    <div class="col-1">
                      <button @click="removeItemBase(pieza)" class="btn btn-sm btn-danger">x</button>
                    </div>
                  </div>

                  <div class="container text-right mt-3 mb-3">
                    <span @click="addPiezas()" class="add-another-one">
                      <span class="plus">+</span>Agregar piezas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <table class="table table-bordered nowrap no-print">
        <thead>
          <th class="header-cell text-center">Cantidad (Automatico)</th>
          <th class="header-cell text-center">Cantidad (Manual)</th>
          <th class="header-cell text-center">Nombre</th>
          <th class="header-cell text-center">Detalle</th>
          <th class="header-cell text-center">Desperdicio (en mm)</th>
          <th class="header-cell text-center">Extra 1</th>
          <th class="header-cell text-center">Extra 2</th>
          <th class="header-cell text-center">Estado</th>
        </thead>
        <tbody>
          <tr v-for="material in materialList" :key="material.nombre">
            <td>
              <span v-if="!getPlacas(material)">{{round(material.cantidad) + material.unidad}}</span>
              <span v-if="getPlacas(material)">
                {{round(getPlacas(material))}} placas
                <span
                  class="placas-count"
                >({{round(material.cantidad) + material.unidad}})</span>
              </span>
            </td>
            <td>
              <input
                class="form-input"
                v-model="material.cantidadManual"
                v-on:change="materialListChange(material)"
                type="number"
              />
            </td>
            <td class="nombre">{{ material.nombre }}</td>
            <td>
              <input
                class="form-input"
                v-model="material.detalle"
                v-on:change="materialListChange(material)"
              />
            </td>
            <td class="desperdicio">
              <input
                class="form-input"
                type="number"
                v-model="material.desperdicio"
                :disabled="!material.tapacanto"
                v-on:change="desperdicioChangeHandler(material)"
              />
            </td>
            <td>
              <input
                class="form-input"
                v-model="material.extra1"
                v-on:change="materialListChange(material)"
              />
            </td>
            <td>
              <input
                class="form-input"
                v-model="material.extra2"
                v-on:change="materialListChange(material)"
              />
            </td>
            <td class="estado">
              <select
                v-model="material.estado"
                class="form-control form-control-sm"
                v-on:change="materialListChange(material)"
              >
                <option>Ok</option>
                <option>Stock</option>
                <option>Pedido</option>
                <option>Falta</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="template-controls">
      <button class="btn btn-link btn-sm" @click="loadTemplate()">Cargar Template</button>
      <button class="btn btn-link btn-sm" @click="saveTemplate()">Guardar Template</button>
    </div>
    <div class="multiplier-container">
      <div class="pieces-count">Cantidad de piezas: {{partList.length}}</div>
      <label for="show-multiplier">Mostrar multiplicador</label>
      <input type="checkbox" id="show-multiplier" name="show-multiplier" v-model="showMultipliers" />
      <br />
      <label for="desperdicio">% de desperdicio en placas:</label>
      <input
        type="number"
        id="desperdicio"
        name="desperdicio"
        v-model="waste"
        @keyup="onWasteChange()"
        min="0"
        max="99"
        style="width: 50px"
      />
    </div>
    <div class="presupuesto flex justify-content-between">
      <!-- LINEA PREMIUM -->
      <div class="presupuesto-container">
        <!-- LINEA PREMIUM FIJO -->
        <div  style="padding: 15px;" :class="{lineaActiva:premiunActivo}">
          <div class="p-title">
            <h4>Linea Premium</h4>
            <span class="multiplier" v-if="showMultipliers">Multiplicador:</span>
            <input
              v-model="premiumMultiplier"
              v-if="showMultipliers"
              @keyup="processContactMessage()"
            />
          </div>
          <table class="premium">
            <thead class="text-left flex">
              <th class="cantidad-header">Cantidad</th>
              <th class="item-header">Item</th>
              <th class="precio-unidad-header">Precio por Unidad</th>
              <th class="precio-total-header">Total Item</th>
            </thead>
            <tbody>
              <tr v-for="item in materialList" :key="item.nombre" class="flex">
                <td class="cantidad-cell">
                  {{round(item.cantidad)}}
                  <span
                    v-if="getPlacas(item)"
                    class="placas-count"
                  >({{round(getPlacas(item))}} placas)</span>
                </td>
                <td class="service-label text-left flex" v-if="item.nombre">
                  <span>{{item.nombre}}</span>
                  <span class="dotted-line"></span>
                </td>
                <td
                  class="input-cell flex precio-unidad-cell"
                  v-if="item.nombre"
                >{{round(premiumMultiplier * item.value)}}</td>
                <td
                  class="input-cell flex precio-total-cell"
                  v-if="item.nombre"
                >{{round(item.value * item.cantidad * premiumMultiplier)}}</td>
                <td class="service-label text-left flex" v-if="!item.nombre">
                  <span>**MATERIAL SIN DEFINIR**</span>
                </td>
              </tr>
              <tr class="separation-row no-hover">
                <td colspan="4">
                  <div></div>
                </td>
              </tr>
              <tr v-for="item in servicesList" :key="item.nombre" class="flex">
                <td class="cantidad-cell flex">
                  <span class="remove-btn" @click="remove(item)">❌</span>
                  <input
                    class="custom form-input edit-count"
                    v-model="item.count"
                    v-on:change="changedPresupuesto('count', item)"
                  />
                </td>
                <td class="service-label text-left flex">
                  <span>{{item.nombre}}</span>
                  <span class="dotted-line"></span>
                </td>
                <td class="input-cell flex precio-unidad-cell precio-unidad-custom">
                  <input
                    class="custom form-input"
                    v-model="item.value"
                    v-on:change="changedPresupuesto('value', item)"
                  />
                </td>
                <td class="precio-total-cell">{{round(item.value * item.count * premiumMultiplier)}}</td>
              </tr>
              <tr class="no-hover" v-if="!adding">
                <td class="text-left">
                  <span @click="addOne()" class="add-another-one">
                    <span class="plus">+</span>Agregar otro
                  </span>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr v-if="adding" class="flex">
                <td class="adding-count">
                  <input class="form-input" v-model="newItem.count" />
                </td>
                <td class="service-label text-left adding-name-cell flex">
                  <input class="form-input" v-model="newItem.nombre" />
                  <span class="dotted-line"></span>
                </td>
                <td class="input-cell flex">
                  <input class="form-input" style="height:27px;" v-model="newItem.value" />
                </td>
                <td class="adding-total-cell">{{newItem.value * newItem.count * premiumMultiplier}}</td>
              </tr>
              <tr v-if="adding" class="flex no-hover">
                <td>
                  <span class="cancel-btn btn" @click="cancel()">❌ Cancelar</span>
                  <span class="add-btn btn" @click="add()" :class="{disabled: newItemInvalid()}">
                    <span class="plus">+</span>Agregar
                  </span>
                </td>
                <td class="input-cell flex"></td>
                <td class="input-cell flex"></td>
                <td class="input-cell flex"></td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="no-hover">
                <td class="text-right" colspan="4">
                  <span class="total-label">Total:</span>
                  <span class="value-label">${{round(getTotal(true))}}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
          <!-- {{listLineasPremium}} -->
        <template v-for="(ItemLineaPremium, index) in listLineasPremium">
          <hr :key="`Linea Premium hr ${index}`">
          <div :key="`Linea Premium div ${index}`" style="padding: 15px;" :class="{lineaActiva:ItemLineaPremium.Activo}">
            <linea-premium-agregados 
              nombrePrincipal="Linea Premium"
              :nombreLinea="ItemLineaPremium.Name"
              :activo="ItemLineaPremium.Activo"
              :eliminarLinea="i => eliminarLinea(i, 'premium')"
              :opcMaterialesSelect="opcMaterialesSelect"
              :add="add"
              :remove="remove"
              :changedPresupuesto="changedPresupuesto"
              :newItem="newItem"
              :AlternativeMaterialList="ItemLineaPremium.AlternativeMaterialList"
              :getPlacas="getPlacas"
              :round="round"
              :showMultipliers="showMultipliers"
              :index="index"
              :premiumMultiplier="ItemLineaPremium.Multiplier"
              :key="`Linea Premium componente ${index}`"
              :servicesList="servicesList"
              :materialList="materialList"
              @updateNombreLinea="val => updateNombreLinea(index, val, 'premium')"
              @updateLineaActiva="val => selectLineaActiva(index, val, 'premium')"
              @updateNewItem="val => newItem = val"
              @AlternativeMaterialListUpdate="val => actualizarMaterialList(index, val, 'premium')"
              @ServicesListUpdate="val => servicesList = val"
              @processContactMessage="processContactMessage"
              />
          </div>
        </template>
        <br>
        <div>
          <b-button @click="addLineaPremium" block variant="primary">Agregar nueva linea premium</b-button>
        </div>
        <!-- LINEA PREMIUM AGREGADOS -->
        
        
      </div>
      <!-- LINEA CLASICA -->
      <div class="presupuesto-container">
        <div  style="padding: 15px;" :class="{lineaActiva:clasicaActivo}">
          <div class="p-title">
            <h4>
              Linea Clásica
              <span @click="restart()" class="restart">Restablecer</span>
            </h4>
            <span class="multiplier" v-if="showMultipliers">Multiplicador:</span>
            <input
              v-model="classicMultiplier"
              v-if="showMultipliers"
              @keyup="processContactMessage()"
            />
          </div>

          <table class="classic">
            <thead class="text-left flex">
              <th class="cantidad-header">Cantidad</th>
              <th class="item-header">Item</th>
              <th class="precio-unidad-header">Precio por Unidad</th>
              <th class="precio-total-header">Total Item</th>
            </thead>
            <tbody>
              <tr v-for="item in materialList" :key="item.nombre" class="flex">
                <td class="cantidad-cell">
                  <input
                    style="max-width:55px;"
                    class="custom form-input"
                    v-model="alternativeMaterialList[item.nombreOriginal].cantidad"
                    v-on:change="alternativeMaterialQuantityChange(alternativeMaterialList[item.nombreOriginal])"
                  />
                  <span
                    v-if="getPlacas(alternativeMaterialList[item.nombreOriginal])"
                    class="placas-count"
                  >({{round(getPlacas(alternativeMaterialList[item.nombreOriginal]))}} placas)</span>
                </td>
                <td
                  class="service-label text-left flex"
                  v-if="alternativeMaterialList[item.nombreOriginal].nombre"
                >
                  <select
                    v-model="alternativeMaterialList[item.nombreOriginal].nombre"
                    class="presupuesto-select form-control form-control-sm"
                    v-if="alternativeMaterialList[item.nombreOriginal].tipo === 'material'"
                    v-on:change="alternativeMaterialTypeChange(alternativeMaterialList[item.nombreOriginal])"
                  >
                    <option
                      v-for="material in availableMaterials"
                      :key="material.nombreOriginal"
                      :value="material.material"
                    >{{ material.material }}</option>
                  </select>

                  <select
                    v-model="alternativeMaterialList[item.nombreOriginal].nombre"
                    class="presupuesto-select form-control form-control-sm"
                    v-if="alternativeMaterialList[item.nombreOriginal].tipo === 'herraje'"
                    v-on:change="alternativeMaterialTypeChange(alternativeMaterialList[item.nombreOriginal])"
                  >
                    <option
                      v-for="herraje in availableHerrajes"
                      :key="herraje.id"
                      :value="herraje.name"
                    >{{ herraje.name }}</option>
                  </select>

                  <select
                    v-model="alternativeMaterialList[item.nombreOriginal].nombre"
                    class="presupuesto-select form-control form-control-sm"
                    v-if="alternativeMaterialList[item.nombreOriginal].tipo === 'tapacanto'"
                    v-on:change="alternativeMaterialTypeChange(alternativeMaterialList[item.nombreOriginal])"
                  >
                    <option
                      v-for="tapacanto in availableTapacantos"
                      :key="tapacanto.id"
                      :value="tapacanto.name"
                    >{{ tapacanto.name }}</option>
                  </select>

                  <select
                    v-model="alternativeMaterialList[item.nombreOriginal].nombre"
                    class="presupuesto-select form-control form-control-sm"
                    v-if="alternativeMaterialList[item.nombreOriginal].tipo === 'metal'"
                    v-on:change="alternativeMaterialTypeChange(alternativeMaterialList[item.nombreOriginal])"
                  >
                    <option
                      v-for="metalKit in availableMetalesKit"
                      :key="metalKit.id"
                      :value="metalKit.material"
                    >{{ metalKit.material }}</option>
                  </select>
                </td>
                <td
                  class="input-cell flex precio-unidad-cell"
                  v-if="alternativeMaterialList[item.nombreOriginal].nombre"
                >{{round(classicMultiplier * alternativeMaterialList[item.nombreOriginal].value)}}</td>
                <td
                  class="input-cell flex precio-total-cell"
                  v-if="alternativeMaterialList[item.nombreOriginal].nombre"
                >{{round(alternativeMaterialList[item.nombreOriginal].value * alternativeMaterialList[item.nombreOriginal].cantidad * classicMultiplier)}}</td>
                <td
                  class="service-label text-left flex"
                  v-if="!alternativeMaterialList[item.nombreOriginal].nombre"
                >
                  <span>**MATERIAL SIN DEFINIR**</span>
                </td>
              </tr>
              <tr class="separation-row no-hover">
                <td colspan="4">
                  <div></div>
                </td>
              </tr>
              <tr v-for="item in servicesList" :key="item.nombre" class="flex">
                <td class="cantidad-cell flex">
                  <span class="remove-btn" @click="remove(item)">❌</span>
                  <input
                    class="custom form-input edit-count"
                    v-model="item.count"
                    v-on:change="changedPresupuesto('count', item)"
                  />
                </td>
                <td class="service-label text-left flex">
                  <span>{{item.nombre}}</span>
                  <span class="dotted-line"></span>
                </td>
                <td class="input-cell flex precio-unidad-cell precio-unidad-custom">
                  <input
                    class="custom form-input"
                    v-model="item.value"
                    v-on:change="changedPresupuesto('value', item)"
                  />
                </td>
                <td class="precio-total-cell">{{round(item.value * item.count * classicMultiplier)}}</td>
              </tr>
              <tr class="no-hover" v-if="!adding">
                <td class="text-left">
                  <span @click="addOne()" class="add-another-one">
                    <span class="plus">+</span>Agregar otro
                  </span>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr v-if="adding" class="flex">
                <td class="adding-count">
                  <input class="form-input" v-model="newItem.count" />
                </td>
                <td class="service-label text-left adding-name-cell flex">
                  <input class="form-input" v-model="newItem.nombre" />
                  <span class="dotted-line"></span>
                </td>
                <td class="input-cell flex">
                  <input class="form-input" style="height:27px;" v-model="newItem.value" />
                </td>
                <td class="adding-total-cell">{{newItem.value * newItem.count * classicMultiplier}}</td>
              </tr>
              <tr v-if="adding" class="flex no-hover">
                <td>
                  <span class="cancel-btn btn" @click="cancel()">❌ Cancelar</span>
                  <span class="add-btn btn" @click="add()" :class="{disabled: newItemInvalid()}">
                    <span class="plus">+</span>Agregar
                  </span>
                </td>
                <td class="input-cell flex"></td>
                <td class="input-cell flex"></td>
                <td class="input-cell flex"></td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="no-hover">
                <td class="text-right" colspan="4">
                  <span class="total-label">Total:</span>
                  <span class="value-label">${{round(getTotal(false))}}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <template v-for="(ItemLineaClasica, index) in listLineasClasica">
          <hr :key="`Linea Clasica hr ${index}`">
          <div :key="`Linea Clasica div ${index}`" style="padding: 15px;" :class="{lineaActiva:ItemLineaClasica.Activo}">
            <linea-premium-agregados
              nombrePrincipal="Linea Clasica"
              :nombreLinea="ItemLineaClasica.Name"
              :activo="ItemLineaClasica.Activo"
              :eliminarLinea="i => eliminarLinea(i, 'clasica')"
              :opcMaterialesSelect="opcMaterialesSelect"
              :add="add"
              :remove="remove"
              :changedPresupuesto="changedPresupuesto"
              :newItem="newItem"
              :AlternativeMaterialList="ItemLineaClasica.AlternativeMaterialList"
              :getPlacas="getPlacas"
              :round="round"
              :showMultipliers="showMultipliers"
              :index="index"
              :premiumMultiplier="ItemLineaClasica.Multiplier"
              :key="`Linea Clasica componente ${index}`"
              :servicesList="servicesList"
              :materialList="materialList"
              @updateNewItem="val => newItem = val"
              @updateNombreLinea="val => updateNombreLinea(index, val, 'clasica')"
              @updateLineaActiva="val => selectLineaActiva(index, val, 'clasica')"
              @AlternativeMaterialListUpdate="val => actualizarMaterialList(index, val, 'clasica')"
              @ServicesListUpdate="val => servicesList = val"
              @processContactMessage="processContactMessage"
            />
          </div>
        </template>

        <br>
        <div>
          <b-button
          @click="addLineaClasica" block variant="primary">Agregar nueva linea clasica</b-button>
        </div>
        
      </div>
    </div>
    <!-- FINANCIACION -->
    <div class="financiacion">
      <div class="financiacion-container">
        <h5>Financiacion</h5>
        <div class="financiacion-list" v-if="cuotas && cuotas.length > 0">
          <div class="financiacion-item" v-for="(cuota, index) in cuotas" :key="index">
            <span class="cancel-btn btn" @click="removeCuota(cuota)">❌</span> En
            <input
              class="input-custom"
              type="number"
              v-model="cuota.cantCuotas"
              @change="updateCuota(cuota, index)"
            /> cuota
            <span v-if="cuota.cantCuotas > 1">s</span>, con interes %
            <input
              class="input-custom"
              type="number"
              v-model="cuota.interes"
              @change="updateCuota(cuota, index)"
            />:
            <div class="details">
              Linea
              <span class="label-premium">Premium</span>
              : {{cuota.cantCuotas}} cuota
              <span v-if="cuota.cantCuotas > 1">s</span> de
              <span class="financiacion-presupuesto">${{getFinanciacion(cuota, true)}}</span>
              (total: ${{getTotalFinanciacion(cuota, true)}})
              <br />
              Linea Clasica: {{cuota.cantCuotas}} cuota
              <span v-if="cuota.cantCuotas > 1">s</span> de
              <span class="financiacion-presupuesto">${{getFinanciacion(cuota, false)}}</span>
              (total: ${{getTotalFinanciacion(cuota, false)}})
              <br />
            </div>
          </div>
        </div>
        <div v-if="!cuotas || cuotas.length === 0" class="no-financiacion">
          <span>Sin financiacion</span>
        </div>
      </div>
      <div class="add-cuota">
        <span @click="addCuota()" class="add-another-one">
          <span class="plus">+</span>Agregar cuotas
        </span>
      </div>
    </div>
    <!-- MENSAJE -->
    <div class="message">
      <div class="message-container">
        <h5>Contacto</h5>
        <div class="message-content">
          <div class="auto-update">
            <label for="actualizar-auto">Actualizar mensaje automaticamente</label>
            <input
              type="checkbox"
              name="actualizar-auto"
              id="actualizar-auto"
              v-model="autoUpdateMsg"
              @change="updateMsg()"
            />
          </div>
          <textarea class="message-text" v-model="message" ref="text" @change="textAreaChanged()"></textarea>
          <div style="display:flex">
            <button type="button" class="btn btn-sm" @click="copyToClipboard()">Copiar</button>
            <div style="flex:1"></div>
            <button class="btn btn-primary btn-sm" @click="loadMessage()">Cargar Mensaje</button>
          </div>
        </div>
      </div>
    </div>
    <div style="display:none" ref="configOptions">
      <div>
        <h3>Guardar Template</h3>
        <br />
        <form style="text-align:left">
          <div class="form-group">
            <label for="template-name">Nombre del Template</label>
            <input type="text" class="form-control" id="template-name" />
          </div>
          <div class="form-group form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="msg-default-check"
              name="msg-default-check"
            />
            <label class="form-check-label" for="msg-default-check">Default</label>
          </div>
        </form>
      </div>
    </div>

    <b-modal ref="loadTemplateModal" hide-footer title="Listado de Templates guardados">
      <div class="d-block text-center">
        <table class="table table-bordered" style="width: 100% !important;">
          <thead class="thead-light">
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(config, index) in templates" :key="index" class="hover-row">
              <td>
                <a
                  @click="templateLoad(config.id)"
                  class="config-elem config-elem-clickeable"
                >{{ config.name }}</a>
                <span v-if="+config.id === +defaultTemplateId" title="Template default">⭐️</span>
                <span
                  v-if="+config.id !== +defaultTemplateId"
                  class="make-default"
                  @click="onChangeDefaultValue(config)"
                  title="Hacer default"
                >🌟</span>
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-sm btn-danger"
                  @click="templateDelete(index)"
                >&#10006;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>

    <b-modal ref="loadPresetTemplate" hide-footer title="Listado de Presets guardados">
      <div class="d-block text-center">
        <h5 v-if="templatesPreset.length == 0">No hay presets guardados</h5>
        <table
          v-if="templatesPreset.length > 0"
          class="table table-bordered"
          style="width: 100% !important;"
        >
          <thead class="thead-light">
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="preset in templatesPreset" :key="preset.id" class="hover-row">
              <td style="vertical-align: middle">
                <a
                  @click="loadPresetTemplate(preset)"
                  class="config-elem config-elem-clickeable"
                >{{ preset.nombre }}</a>
                <span v-if="preset.predeterminado" title="Template default">⭐️</span>
                <span
                  v-if="!preset.predeterminado"
                  class="make-default"
                  @click="cambiarPredeterminadoPreset(preset)"
                  title="Hacer default"
                >🌟</span>
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-sm btn-danger m-2"
                  @click="deletePresetTemplate(preset)"
                >&#10006;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>

    <b-modal ref="loadMessageModal" size="sm" hide-footer title="Listado de Mensajes guardados">
      <div class="d-block text-center">
        <table
          class="table table-bordered"
          style="width: 500px !important; margin: 0 auto; left: 0;"
        >
          <thead class="thead-light">
            <tr>
              <th class="text-center">Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(message, index) in messages" :key="index">
              <td>
                <a
                  @click="messageLoad(message.id)"
                  class="config-elem config-elem-clickeable"
                >{{ message.name }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
    <b-modal id="modal-image" ref="modalImageClient" size="lg" hide-footer title="Zoom">
      <figure>
        <img width="100%" :src="currentEventImagePath + imgModal">  
      </figure>
    </b-modal>
    <b-modal  ref="modalUploadUrl" size="sm" :title="`Url de ${modalUploadUrl.title}`">
      <b-form @submit="guardarUrlCliente" >
        <b-form-group
          id="input-group-1"
          label="Nombre:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="formUploadUrl.nombre"
            type="text"
            placeholder="Coloque el nombre"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group 
          id="input-group-2" 
          label="Url:" 
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            v-model="formUploadUrl.url"
            placeholder="Coloque la url"
            required
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer>
        <div class="w-100">
          
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="guardarUrlCliente"
          >
            Guardar
          </b-button>
          <b-button
            variant="outline-dark"
            size="sm"
            class="float-right"
            @click="cerrarModalUploadUrl"
          >
            Cerrar
          </b-button>
        </div>
      </template>
    </b-modal>
    <div style="display:none" ref="presetBudgetModal" class="save-module-modal">
      <div>
        <h3>Guardar Preset</h3>
        <br />
        <form style="text-align:left">
          <div class="form-group">
            <label for="module-config-name">Nombre del Preset</label>
            <input
              type="text"
              v-model="nombreBudget"
              class="form-control modulo-save-name"
              id="module-config-name"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint eqeqeq: "off" */
import "vuejs-noty/dist/vuejs-noty.css";
import Vue from "vue";
import VueNoty from "vuejs-noty";
import VueSwal from "vue-swal";
import { HTTP } from '@/plugins/HTTP.js'
import { format } from "date-fns";
import VueTheMask from "vue-the-mask";
import axios from "axios";
import pdfBlob from "@/plugins/pdfBlob.js";
import LineaPremiumAgregados from "@/components/DesignDashboard/Tabs/ListadoMateriales/LineaPremiumAgregados.vue";
import { EventBus } from "@/index";
import { ModelLineaPremium } from "@/components/DesignDashboard/Tools/models/models";

Vue.use(VueNoty, {
  theme: "metroui",
});

Vue.use(VueSwal); 
Vue.use(VueTheMask);

export default {
  data() {
    return {
      datos_extras_proyecto_seguimiento:false,
      messages: [],
      templates: [],
      templatesPreset: [],
      defaultTemplateId: -1,
      placeholders: [],
      adding: false,
      newItem: {
        nombre: "",
        value: 0,
        count: 0,
      },
      imagesLoaded: false,
      noImages: true,
      images: [],
      imagesObj: [],
      imgSelected: [],
      imgModal:"",
      currentEventImagePath:"",
      nombrePreset: "",
      nombreBudget: "",
      presupuesto: {
        id: null,
        cliente: {},
        canalComunicacion: {
          fb: false,
          ig: false,
          wp: false,
          mail: false,
          local: false,
        },
        nombreRedSocialCliente: "",
        comentarioResumen: "",
        comentarioOpcional: "",
        color: "",
        lineaClasica: [],
        lineaPremium: [],
        validezPresupuesto: format(new Date(), "dd/MM/yyyy"),
        validezPromo: format(new Date(), "dd/MM/yyyy"),
        detalles: "",
        condicionesPago: "",
        comentarioInternoPresupuesto: "",
        piezas: [],
        postPresupuesto: { postTexto: "", postRespondio: "", postInterno: "" },
        retomoPresupuesto: {
          retomaTexto: "",
          retomaRespondio: "",
          retomaInterno: "",
        },
        observaciones: [],
        estado: 1,
      },
      indiceSeleccionado: 0,
      presupuestosGuardados: [],
      showMultipliers: false,
      message: "",
      originalMessage: "",
      dateToday: format(new Date(), "dd/MM/yyyy"),
      usuarioLogueado: "",
      urlImagenSeleccionadaPreview: null,
      urlPdfSeleccionadaPreview: null,
      currentEvent: "",
      currentEventImages: [],
      currentEventPdfs: [],
      currentEventVideos: [],
      flgCargandoPresupuesto: true,
      project_id: 0,
      currentfolder:'General',
      flagUserEvento:false,
      formUploadUrl: {
        nombre: '',
        url: '',
      },
      modalUploadUrl: {
        title: null,
        url: null
      }
      
    };
  },
  mounted: function () {
    setTimeout(() => {
      document.addEventListener("click", ()=>{
        this.flagUserEvento = true;
      });

      document.addEventListener("keydown", ()=>{
        this.flagUserEvento = true;
      });
    }, 500);
    this.updatePremiumMultiplier();
    
    const vuex = localStorage.getItem("vuex");
    this.project_id = localStorage.getItem("projectID");
    if (vuex) {
      const informacionProyecto = JSON.parse(vuex);

      const presupuestoStorage = localStorage.getItem("presupuesto");
      this.loadPreset(false);
      this.$watch("presupuesto", this.saveStorage, { deep: true });
      if (presupuestoStorage != null) {
        const presupuestoProjectId = localStorage.getItem("presupuesto_id");
        let presupuestoStorageParseado = JSON.parse(presupuestoStorage);

        if (
          presupuestoProjectId == localStorage.getItem("projectID") ||
          presupuestoProjectId == "null"
        ) {
          this.presupuesto = presupuestoStorageParseado;
          setTimeout(() => {
            if (localStorage.getItem("imagen1"))
              this.setDragBackground(
                document.getElementById("1"),
                localStorage.getItem("imagen1")
              );
            if (localStorage.getItem("imagen2"))
              this.setDragBackground(
                document.getElementById("2"),
                localStorage.getItem("imagen2")
              );
            if (localStorage.getItem("imagen3"))
              this.setDragBackground(
                document.getElementById("3"),
                localStorage.getItem("imagen3")
              );
            if (localStorage.getItem("imagen4")) {
              this.setDragBackground(
                document.getElementById("4"),
                localStorage.getItem("imagen4")
              );
            }
            if (localStorage.getItem("imagen5"))
              this.setDragBackground(
                document.getElementById("5"),
                localStorage.getItem("imagen5")
              );
          }, 3500);
        } else {
          localStorage.removeItem("imagen1");
          localStorage.removeItem("imagen2");
          localStorage.removeItem("imagen3");
          localStorage.removeItem("imagen4");
          localStorage.removeItem("imagen5");
          this.presupuesto.color = informacionProyecto.layout.modules[0].fondo;
        }
        // this.loadPreset(true);
      }
      this.presupuesto.cliente = informacionProyecto.info;
      this.presupuesto.comentarioResumen = informacionProyecto.info.comentarioResumenPresupuestoMaterial;

      if (presupuestoStorage == null) {
        this.presupuesto.color = informacionProyecto.layout.modules[0].fondo;
      }

      this.imagesLoaded = false;
      this.imgSelected = [].splice();

      this.traerPresupuestoAbierto(true);
      this.getImagesPresupuesto();
      this.getPdfsPresupuesto();
      this.getVideosPresupuesto();
      this.traerImagenes3D();
    }
    const self = this;

    const userStorage = localStorage.getItem("user-name");
    if (userStorage) this.usuarioLogueado = userStorage;
    HTTP.get("/api/configuracion/tipo/Placeholder/all")
      .then((result) => {
        self.placeholders = result.data.configuraciones.map((p) => ({
          value: p.values.find((v) => v.name === "value").value,
          key: p.values.find((v) => v.name === "key").value,
          description: p.values.find((v) => v.name === "description").value,
          id: p.id,
        }));
        HTTP.get(`/api/configuracion/tipo/Mensaje/all/default`).then(
          (response) => {
            const configuraciones = response.data.configuraciones;
            this.originalMessage =
              configuraciones.length > 0
                ? configuraciones[0].values.find((prop) => prop.name === "text")
                    .value
                : "";
            this.processContactMessage();
          }
        );

        if (!window.localStorage.getItem("default_template_loaded")) {
          HTTP.get(`/api/configuracion/tipo/Presupuesto/all/default`).then(
            (response) => {
              const configuraciones = response.data.configuraciones;
              if (configuraciones && configuraciones.length > 0) {
                this.cargarTemplate(response.data.configuraciones[0].values);
                this.defaultTemplateId = response.data.configuraciones[0].id;
              }
              window.localStorage.setItem("default_template_loaded", true);
            }
          );
          this.loadPreset(true)
        } else {
          const _presupuesto = this.$store.getters.getPresupuesto
          if (_presupuesto) {
            this.presupuesto = _presupuesto
          }
        }
      })
      .catch((result) => {
        this.$noty.error("¡Error al cargar etiquetas!");
      });
  },
  methods: {
    updatePremiumMultiplier(){
      for (let index = 0; index < this.listLineasPremium.length; index++) {
        this.listLineasPremium[index].Multiplier = this.premiumMultiplier;
      }

      // this.listLineasPremium[index].Activo = val;
      this.listLineasPremium = JSON.parse(JSON.stringify(this.listLineasPremium));
    },
    updateClasicaMultiplier(){
      for (let index = 0; index < this.listLineasClasica.length; index++) {
        this.listLineasClasica[index].Multiplier = this.classicMultiplier;
      }

      // this.listLineasClasica[index].Activo = val;
      this.listLineasClasica = JSON.parse(JSON.stringify(this.listLineasClasica));
    },
    selectLineaActiva(index, val, linea){
      if(linea == "premium"){
        for (let index = 0; index < this.listLineasPremium.length; index++) {
          this.listLineasPremium[index].Activo = false;
        }
  
        this.listLineasPremium[index].Activo = val;
        this.listLineasPremium = JSON.parse(JSON.stringify(this.listLineasPremium));
      }

      if(linea == "clasica"){
        for (let index = 0; index < this.listLineasClasica.length; index++) {
          this.listLineasClasica[index].Activo = false;
        }
  
        this.listLineasClasica[index].Activo = val;
        this.listLineasClasica = JSON.parse(JSON.stringify(this.listLineasClasica));
      }
      
    },
    eliminarLinea(index, linea){
      if(confirm("Deseas eliminar")){
        if(linea=="premium"){
          this.listLineasPremium.splice(index, 1);
          this.listLineasPremium = JSON.parse(JSON.stringify(this.listLineasPremium))
        }

        if(linea=="clasica"){
          this.listLineasClasica.splice(index, 1);
          this.listLineasClasica = JSON.parse(JSON.stringify(this.listLineasClasica))
        }
      }
    },
    actualizarMaterialList(index, val, linea){
      if(linea == 'premium'){
        this.listLineasPremium[index].AlternativeMaterialList = val;
        this.listLineasPremium = JSON.parse(JSON.stringify(this.listLineasPremium));
      }

      if(linea == 'clasica'){
        this.listLineasClasica[index].AlternativeMaterialList = val;
        this.listLineasClasica = JSON.parse(JSON.stringify(this.listLineasClasica));
      }
    },
    updateNombreLinea(index, val, linea){
      if(linea == "premium"){
        this.listLineasPremium[index].Name = val;
        this.listLineasPremium = JSON.parse(JSON.stringify(this.listLineasPremium));
      }

      if(linea == "clasica"){
        this.listLineasClasica[index].Name = val;
        this.listLineasClasica = JSON.parse(JSON.stringify(this.listLineasClasica));
      }
    },
    addLineaPremium(){
      var lineaPremium = new ModelLineaPremium();
      lineaPremium = Object.assign({}, lineaPremium, { Multiplier: this.premiumMultiplier});
      this.listLineasPremium.push(lineaPremium);
      this.listLineasPremium = JSON.parse(JSON.stringify(this.listLineasPremium));
    },
    addLineaClasica(){
      var lineaClasica = new ModelLineaPremium();
      lineaClasica = Object.assign({}, lineaClasica, { Multiplier: this.classicMultiplier});
      this.listLineasClasica.push(lineaClasica);
      this.listLineasClasica = JSON.parse(JSON.stringify(this.listLineasClasica));
      console.log(this.listLineasClasica);
    },
    updatePresupuestoDB(){
      // return true;
      if(!this.flagUserEvento){
        return true;
      }

      clearTimeout(this.clearTimePresupuesto);
      this.clearTimePresupuesto = setTimeout(() => {

        if(this.presupuestosGuardados.length == 0){
          return true;
        }
        
        this.flagUserEvento = false;

        if(this.presupuesto.estado == 0 || this.presupuesto.estado == 3){
          // alert("No puedes modificar un presupuesto cerrado, debes solicitar una corrección antes");
          return true;
        }

        let results = `{
          "cliente": ${JSON.stringify(this.presupuesto.cliente)},
          "canalComunicacion": ${JSON.stringify(this.presupuesto.canalComunicacion)},
          "nombreRedSocialCliente": ${JSON.stringify(this.presupuesto.nombreRedSocialCliente)},
          "comentarioResumen": ${JSON.stringify(this.presupuesto.comentarioResumen)},
          "comentarioOpcional": ${JSON.stringify(this.presupuesto.comentarioOpcional)},
          "observaciones": ${JSON.stringify(this.presupuesto.observaciones)},
          "postPresupuesto": ${JSON.stringify(this.presupuesto.postPresupuesto)},
          "retomoPresupuesto": ${JSON.stringify(this.presupuesto.retomoPresupuesto)},
          "lineaClasica": ${JSON.stringify(this.presupuesto.lineaClasica)},
          "lineaPremium": ${JSON.stringify(this.presupuesto.lineaPremium)},
          "color": ${JSON.stringify(this.presupuesto.color)},
          "validezPresupuesto": ${JSON.stringify(this.presupuesto.validezPresupuesto)},
          "validezPromo": ${JSON.stringify(this.presupuesto.validezPromo)},
          "detalles": ${JSON.stringify(this.presupuesto.detalles)},
          "condicionesPago": ${JSON.stringify(this.presupuesto.condicionesPago)},
          "comentarioInternoPresupuesto": ${JSON.stringify(this.presupuesto.comentarioInternoPresupuesto)},
          "piezas": ${JSON.stringify(this.presupuesto.piezas)},
          "precioFinalClasica": ${this.round(this.totalClasica)},
          "precioFinalPremium":  ${this.round(this.totalPremium)},
          "contacto": ${JSON.stringify(this.message)}
        }`;

        let obj = {
          id:this.presupuesto.id,
          token: this.presupuesto.cliente.token_project,
          results: results,
          estado: 1,
          imagen1: "",
          imagen2: "",
          imagen3: "",
          imagen4: "",
          imagen5: "",
          fecha: new Date(),
          usuario: localStorage.getItem("user-name"),
          project_id: this.project_id,
        };

        this.$el.querySelectorAll(".bg-image-droppable").forEach((element, index) => {
          let nombre = `imagen${index + 1}`;
          obj[nombre] = element.style.background == "" ? "" : element.style.background.slice(5, element.style.background.length).slice(0, -1);
        });
        
        HTTP.post("/api/presupuesto", obj);
        
      }, 600);

    },
    saveStorage(presupuesto) {
      localStorage.setItem("presupuesto", JSON.stringify(presupuesto));
      localStorage.setItem("presupuesto_id", localStorage.getItem("projectID"));
      this.$store.commit("setPresupuesto", presupuesto)
      this.updatePresupuestoDB();
    },
    traerPresupuestoAbierto(isAutomatic) {
      HTTP.get("api/presupuesto/" + this.presupuesto.cliente.token_project)
        .then((res) => {
          if (res.data.length > 0) {
            this.presupuestosGuardados = res.data;
            console.log(isAutomatic);
            if (isAutomatic) {
              this.cargarPresupuesto(res.data[res.data.length - 1], 1);
            }
          }
          this.flgCargandoPresupuesto = !this.flgCargandoPresupuesto;
        })
        .finally(() => {
          this.flgCargandoPresupuesto = false;
        });
    },
    cargarProyecto(id){
      EventBus.$emit("loadfrom", id);
      // this.$router.push({ name: "DesignDashboard", params: { link: id  } });
    },
    verPdf(id){
      pdfBlob.init(`${process.env.BACKEND_BASE_URL}pdf`, true);
      HTTP.get(`api/presupuesto/ver-pdf-presupuesto/${id}`)
      .then((res) => {
        if (res.data.ok) {
          const linkSource = `data:application/pdf;base64,${res.data.pdf}`;
          pdfBlob.pdfBlod(res.data.pdf);
        }
      })
      .catch((handlerErr) => {
        this.$noty.error("Error al generar PDF");
      });
    },
    exportarPdf() {
      if (this.presupuesto.color == "")
        return this.$noty.error("Falta ingresar un color del producto");
      if (this.presupuesto.lineaClasica.length == 0)
        return this.$noty.error("Falta ingresar elementos en la linea clasica");
      if (this.presupuesto.lineaPremium.length == 0)
        return this.$noty.error("Falta ingresar elementos en la linea premium");
      if (this.presupuesto.condicionesPago.length == "")
        return this.$noty.error("Falta ingresar condiciones de pago");
      if (this.presupuesto.condicionesPago.length == "")
        return this.$noty.error("Falta ingresar condiciones de pago");
      if (this.presupuesto.piezas.length == 0)
        return this.$noty.error("Falta ingresar piezas");

      this.generarPedidoPresupuesto(false, false, true, () => {
        let obj = {
          id: this.presupuesto.id,
        };

        this.$el
          .querySelectorAll(".bg-image-droppable")
          .forEach((element, index) => {
            if (element.style.background == null) {
              return this.$noty.error(
                "Faltan agregar imagenes al presupuesto para exportar el PDF"
              );
            } else {
              console.log(index + 1)
              let nombre = `imagen${index + 1}`;
              obj[nombre] = element.style.background
                .slice(5, element.style.background.length)
                .slice(0, -1);
            }
          });

            this.$noty.info("Generando PDF");
      

        HTTP.post("api/presupuesto/exportar", obj)
          .then((res) => {
            if (res.data.ok) {
              this.$noty.success("PDF generado correctamente");
              this.presupuesto.estado = 0;
              const linkSource = `data:application/pdf;base64,${res.data.pdf}`;
              const downloadLink = document.createElement("a");
              const fileName = this.presupuesto.cliente.name + ".pdf";
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
              this.traerPresupuestoAbierto(true);
            }
          })
          .catch((handlerErr) => {
            this.$noty.error("Error al generar PDF");
          });
      })
    },
    reiniciarPresupuesto() {
      this.indiceSeleccionado = 0;
      this.presupuesto = {
        id: null,
        cliente: {},
        canalComunicacion: {
          fb: false,
          ig: false,
          wp: false,
          mail: false,
          local: false,
        },
        nombreRedSocialCliente: "",
        comentarioResumen: "",
        comentarioOpcional: "",
        color: "",
        lineaClasica: [],
        lineaPremium: [],
        validezPresupuesto: format(new Date(), "dd/MM/yyyy"),
        validezPromo: format(new Date(), "dd/MM/yyyy"),
        detalles: "",
        condicionesPago: "",
        comentarioInternoPresupuesto: "",
        piezas: [],
        postPresupuesto: { postTexto: "", postRespondio: "", postInterno: "" },
        retomoPresupuesto: {
          retomaTexto: "",
          retomaRespondio: "",
          retomaInterno: "",
        },
        observaciones: [],
        estado: 1,
      };

      const informacionProyecto = JSON.parse(localStorage.getItem("vuex"));
      this.presupuesto.cliente = informacionProyecto.info;
      this.presupuesto.color = informacionProyecto.layout.modules[0].fondo;
    },
    cargarPresupuesto(presupuesto, indice) {
      this.indiceSeleccionado = indice;
      const {
        cliente,
        canalComunicacion,
        nombreRedSocialCliente,
        comentarioResumen,
        comentarioOpcional,
        observaciones,
        postPresupuesto,
        retomoPresupuesto,
        lineaClasica,
        lineaPremium,
        color,
        validezPresupuesto,
        validezPromo,
        detalles,
        condicionesPago,
        comentarioInternoPresupuesto,
        piezas,
      } = JSON.parse(presupuesto.results);

      this.presupuesto.cliente = cliente;
      this.presupuesto.canalComunicacion = canalComunicacion;
      this.presupuesto.nombreRedSocialCliente = nombreRedSocialCliente;
      this.presupuesto.comentarioResumen = comentarioResumen;
      this.presupuesto.comentarioOpcional = comentarioOpcional;
      this.presupuesto.observaciones = observaciones;
      this.presupuesto.postPresupuesto = postPresupuesto;
      this.presupuesto.retomoPresupuesto = retomoPresupuesto;
      this.presupuesto.lineaClasica = lineaClasica;
      this.presupuesto.lineaPremium = lineaPremium;
      this.presupuesto.color = color;
      this.presupuesto.validezPresupuesto = validezPresupuesto;
      this.presupuesto.validezPromo = validezPromo;
      this.presupuesto.detalles = detalles;
      this.presupuesto.condicionesPago = condicionesPago;
      this.presupuesto.comentarioInternoPresupuesto = comentarioInternoPresupuesto;
      this.presupuesto.piezas = piezas;
      this.presupuesto.id = presupuesto.id;
      this.presupuesto.estado = presupuesto.estado;

      this.$el
        .querySelectorAll(".bg-image-droppable")
        .forEach((element, index) => {
          let indice = index + 1;
          let imagen = `imagen${indice}`;
          if (presupuesto[imagen] != null) {
            let strImagen = presupuesto[imagen];
            let properties = strImagen.substring(
              strImagen.length - 31,
              strImagen.length
            );
            let width = properties.substring(0, properties.length - 9);
            width = width.substring(width.length - 5, width.length);
            strImagen = strImagen.substring(0, strImagen.length - 31);
            strImagen = strImagen.substring(0, strImagen.length - 2);
            element.style.background = `url('${strImagen}') no-repeat`;
            element.style.backgroundPosition = `center`;
            element.style.border = "0px";
            element.style.backgroundSize = width;
          }
        });
    },
    traerImagenes3D() {
      // console.log(`traerImagenes3D folder:  ${this.currentfolder} -> showAll (imagesController) *-*Tabs/ListadoMateriales/Index.vue`)
     
     HTTP.get("/api/v2/images/allFolder/" + this.presupuesto.cliente.token_project)
        .then((result) => {
          if (result && result.data) {
            const images = result.data.response.imagenes;
            this.images = images.map((i) => ({ src: i.src }));
            this.noImages = this.images.length === 0;

            setTimeout(() => {
              const draggables = this.$el.querySelectorAll(".draggable");
              const containers = this.$el.querySelectorAll(
                ".bg-image-droppable"
              );
              let image;
              let containerBg;

              draggables.forEach((draggable) => {
                draggable.addEventListener("dragstart", (e) => {
                  image = e.target.currentSrc;
                  draggable.classList.add("dragging");
                });

                draggable.addEventListener("dragend", (e) => {
                  if (containerBg != null) {
                    this.setDragBackground(containerBg.srcElement, image);
                    containerBg = null;
                  }
                });
              });

              containers.forEach((container) => {
                container.addEventListener(
                  "dragover",
                  (e) => {
                    containerBg = e;
                    e.preventDefault();
                  },
                  false
                );
              });
            }, 1000);
          }
        })
        .catch((result) => {})
        .finally(() => {
          this.imagesLoaded = true;
        });
    },
    setDragBackground(containerBg, image) {
      localStorage.setItem(`imagen${containerBg.id}`, image);
      containerBg.style.background = `url('${image}') no-repeat`;
      containerBg.style.backgroundPosition = `center`;
      let medidas = containerBg.style.width;
      medidas = medidas.substring(0, medidas.length - 2);
      if (medidas <= 300) {
        containerBg.style.backgroundSize = +medidas + "px";
      } else {
        containerBg.style.backgroundSize = +medidas + "px";
      }

      containerBg.style.border = "0px";
      this.saveStorage(this.presupuesto);
    },
    onFileSelected(event) {
      console.log("event", event)
      let ref, url, mensaje
      if(event.target.accept.includes("image")){
        ref = this.$refs.fileInputImage
        url = "images"
        mensaje = "Imagen agregada"
      }else if(event.target.accept.includes("pdf")){
        ref = this.$refs.fileInputPdf
        url = "pdfs"
        mensaje = "Pdf agregadp"
      }else if(event.target.accept.includes("mp4")){
        ref = this.$refs.fileInputVideo
        url = "videos"
        mensaje = "Video agregado"
      }else{
        console.warn("No existe ese tipo de archivo")
        return
      }
      let files = ref.files
      let filesLength = files.length
      for (var i = 0; i < filesLength; i++) {
        let file = files[i];
        let formData = new FormData();
        formData.append("file", file);
        formData.append("token", this.presupuesto.cliente.token_project);
        axios
          .post(
            process.env.BACKEND_BASE_URL + "/api/presupuestos/"+url,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
          .then((res) => {
            console.log(res)
            this.$noty.success(mensaje);
            if(url=== 'images'){
              this.getImagesPresupuesto();
            }else if(url=== 'pdfs'){
              this.getPdfsPresupuesto();
            }else if(url=== 'videos'){
              this.getVideosPresupuesto();
            }
            
          
          })
          .catch((e)=>{
            console.log({e})
            if(e.response.data.message){
              this.$noty.error(e.response.data.message)
              this.$noty.info('Debe subir el archivo a un servicio externo (google drive, mega, entre otros) y subir la url en la opción "Desde url"', {
                timeout: 15000,
              })
            }
            
            
          })
      }
      ref.value = "";
    },
    getImagesPresupuesto() {
      HTTP.get(
        `api/presupuestos/images/${this.presupuesto.cliente.token_project}`
      ).then((res) => {
        this.currentEventImagePath = res.data.path + "/";
        this.currentEventImages = [];
        res.data.imagenes.forEach((item) => {
          this.currentEventImages.push(item);
        });
      });
    },
    getPdfsPresupuesto() {
      HTTP.get(
        `api/presupuestos/pdfs/${this.presupuesto.cliente.token_project}`
      ).then((res) => {
        this.currentEventPdfPath = res.data.path + "/";
        this.currentEventPdfs = [];
        res.data.pdfs.forEach((item) => {
          console.log(item)
          this.currentEventPdfs.push(item);
        });
      });
    },
    getVideosPresupuesto() {
      HTTP.get(
        `api/presupuestos/videos/${this.presupuesto.cliente.token_project}`
      ).then((res) => {
        this.currentEventVideoPath = res.data.path + "/";
        this.currentEventVideos = [];
        res.data.videos.forEach((item) => {

          this.currentEventVideos.push(item);
        });
      });
    },
    onChangeDefaultValue(config) {
      // const template = this.messages[index]
      const defaultIndex = config.values.findIndex((v) => v.name === "default");
      if (defaultIndex !== -1) {
        config.values[defaultIndex].value = true;
      } else {
        config.values.push({ name: "default", value: true });
      }
      // quito el default previo
      HTTP.get(`/api/configuracion/tipo/Presupuesto/all/default`).then(
        (response) => {
          const configuraciones = response.data.configuraciones;
          if (configuraciones.length > 0) {
            configuraciones.forEach((m) => {
              m.values.find((v) => v.name === "default").value = false;
              HTTP.put("/api/configuracion/" + m.id, m)
                .then((result) => {})
                .catch((err) => {
                  console.log("err", err);
                });
            });
          }
          // marco el nuevo default
          HTTP.put("/api/configuracion/" + config.id, config)
            .then((result) => {
              this.$noty.success("Template default actualizado");
              this.defaultTemplateId = config.id;
            })
            .catch((result) => {
              this.$noty.error("¡Error al guardar los datos!");
            });
        }
      );
    },
    cambiarPredeterminadoPreset(template) {
      // quito el default previo
      HTTP.put(`/api/presupuestos/presets/${template.id}`).then((response) => {
        if (response.data.ok) {
          this.loadPreset(true);
          this.$noty.success("Nuevo preset predeterminado");
        }
      });
    },
    isDefaultTemplate(template) {
      return true;
    },
    replaceLineBreaksWithHTML(string) {
      return string !== undefined ? string.replace(/\n/g, "<br/>") : "";
    },

    textAreaChanged() {
      if (!this.autoUpdateMsg) {
        window.localStorage.setItem("contact_smg", this.message);
      }
    },
    updateMsg() {
      if (this.autoUpdateMsg) {
        this.processContactMessage();
        window.localStorage.removeItem("contact_smg");
      } else {
        window.localStorage.setItem("contact_smg", this.message);
      }
    },
    loadMessage() {
      let self = this;
      HTTP.get("/api/configuracion/tipo/Mensaje")
        .then((result) => {
          self.messages = result.data.configuraciones;
          self.$refs.loadMessageModal.show();
        })
        .catch((result) => {
          self.$noty.error("¡Error al cargar datos!");
        });
    },
    addAttrClasica() {
      const lineaClasica = {
        id: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(2, 10),
        nombre: "",
        mostrar: true,
      };
      this.presupuesto.lineaClasica.push(lineaClasica);
    },
    addAttrPremium() {
      const lineaPremium = {
        id: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(2, 10),
        nombre: "",
        mostrar: true,
      };
      this.presupuesto.lineaPremium.push(lineaPremium);
    },
    addPiezas() {
      const piezas = {
        id: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(2, 10),
        nombre: "",
        mostrar: true,
      };
      this.presupuesto.piezas.push(piezas);
    },
    eliminarImagenCliente(id, event) {
      let self = this;
      event.stopPropagation()
      HTTP.delete(`api/presupuestos/images/${id}`).then((res) => {
        self.$noty.success("Imagen eliminada");
        self.getImagesPresupuesto();
      });
    },
    eliminarPdfCliente(id, event) {
      let self = this;
      event.stopPropagation()
      HTTP.delete(`api/presupuestos/pdfs/${id}`).then((res) => {
        self.$noty.success("Pdf eliminado");
        self.getPdfsPresupuesto();
      });
    },
    eliminarVideoCliente(id, event) {
      let self = this;
      event.stopPropagation()
      HTTP.delete(`api/presupuestos/videos/${id}`).then((res) => {
        self.$noty.success("Video eliminado");
        self.getVideosPresupuesto();
      });
    },
    addObservacion() {
      const observacion = {
        id: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(2, 10),
        observacion: "",
        usuarioLogueado: this.usuarioLogueado,
        fecha: format(new Date(), "dd/MM/yyyy HH:mm"),
      };
      console.log(observacion);
      this.presupuesto.observaciones.push(observacion);
    },
    removeObservacion(id) {
      this.presupuesto.observaciones = this.presupuesto.observaciones.filter(
        (x) => x.id != id
      );
    },
    messageLoad(id) {
      this.$noty.info("Cargando mensaje...");
      HTTP.get(`/api/configuracion/${id}`).then((response) => {
        const message = response.data.configuracion.values;
        this.originalMessage = message.find(
          (prop) => prop.name === "text"
        ).value;
        this.processContactMessage();
        this.$refs.loadMessageModal.hide();
        this.$noty.success("¡Mensaje cargado con éxito!", this.message);
      });
    },
    copyToClipboard() {
      this.$refs.text.select();
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      this.$noty.info("Mensaje copiado al portapapeles");
    },
    getFinanciacion(cuota, isPremium) {
      const price = this.getTotal(isPremium);
      return this.round((price * (cuota.interes / 100 + 1)) / cuota.cantCuotas);
    },
    getTotalFinanciacion(cuota, isPremium) {
      const price = this.getTotal(isPremium);
      return this.round(price * (cuota.interes / 100 + 1));
    },
    restart() {
      this.alternativeMaterialList = {};
    },
    onWasteChange() {
      if (+this.waste < 0) this.waste = 0;
      if (+this.waste > 99) this.waste = 99;
    },
    getPlacas(mat) {
      const material = this.getMaterial(mat && mat.nombre);
      if (material) {
        const available = (100 - this.waste) / 100;
        const placa = (material.ancho_veta * material.largo_veta) / 1000000;
        const placaAvailable = mat.cantidad / (placa * available);
        return placaAvailable;
      }
    },
    getMaterial(materialName) {
      return this.$store.getters.getMaterialesAdd.find(
        (m) => m.material === materialName
      );
    },
    saveTemplate() {
      this.$refs.presetBudgetModal.style.display = "block";
      this.$swal({
        content: this.$refs.presetBudgetModal,
        buttons: {
          cancelar: {
            text: "Cancelar",
            value: 0,
          },
          save: {
            text: "Guardar",
            value: 1,
          },
        },
      }).then((result) => {
        // const name = document.getElementById("module-config-name").value;
        const name = this.nombreBudget;
        if (result === 1 && name) {
          const template = {
            name,
            type: "Presupuesto",
            values: [
              { name: "servicesList", value: this.servicesList },
              { name: "premiumMultiplier", value: this.premiumMultiplier },
              { name: "classicMultiplier", value: this.classicMultiplier },
              { name: "cuotas", value: this.cuotas },
              {
                name: "default",
                value: document.getElementById("msg-default-check").checked,
              },
            ],
          };

          HTTP.post("/api/configuracion", template)
            .then((result) => {
              if (result.data.success) {
                this.$noty.success("¡Datos guardados correctamente!");
              }
            })
            .catch((result) => {
              this.$noty.error("¡Error al guardar los datos!");
            });
        }
        // document.getElementById("module-config-name").value = "";
        this.nombreBudget = '';
        document.getElementById("msg-default-check").checked = false;
        this.$refs.configOptions.style.display = "none";
      });
    },
    generarPedidoPresupuesto(nuevo, guardarProyectoComo = false, exportar=false, callback = null) {
      if (this.presupuesto.cliente.name == "")
        return this.$noty.error("Falta ingresar el nombre del cliente");
      if (this.presupuesto.cliente.address == "")
        return this.$noty.error("Falta ingresar la dirección del cliente");
      if (this.presupuesto.cliente.phone == "")
        return this.$noty.error(
          "Falta ingresar el número de teléfono del cliente"
        );
      if (this.presupuesto.comentarioResumen == "")
        return this.$noty.error(
          "Falta ingresar un comentario de resumen del presupuesto"
        );

      let results = `{
        "cliente": ${JSON.stringify(this.presupuesto.cliente)},
        "canalComunicacion": ${JSON.stringify(this.presupuesto.canalComunicacion)},
        "nombreRedSocialCliente": ${JSON.stringify(this.presupuesto.nombreRedSocialCliente)},
        "comentarioResumen": ${JSON.stringify(this.presupuesto.comentarioResumen)},
        "comentarioOpcional": ${JSON.stringify(this.presupuesto.comentarioOpcional)},
        "observaciones": ${JSON.stringify(this.presupuesto.observaciones)},
        "postPresupuesto": ${JSON.stringify(this.presupuesto.postPresupuesto)},
        "retomoPresupuesto": ${JSON.stringify(this.presupuesto.retomoPresupuesto)},
        "lineaClasica": ${JSON.stringify(this.presupuesto.lineaClasica)},
        "lineaPremium": ${JSON.stringify(this.presupuesto.lineaPremium)},
        "color": ${JSON.stringify(this.presupuesto.color)},
        "validezPresupuesto": ${JSON.stringify(this.presupuesto.validezPresupuesto)},
        "validezPromo": ${JSON.stringify(this.presupuesto.validezPromo)},
        "detalles": ${JSON.stringify(this.presupuesto.detalles)},
        "condicionesPago": ${JSON.stringify(this.presupuesto.condicionesPago)},
        "comentarioInternoPresupuesto": ${JSON.stringify(this.presupuesto.comentarioInternoPresupuesto)},
        "piezas": ${JSON.stringify(this.presupuesto.piezas)},
        "precioFinalClasica": ${this.round(this.totalClasica)},
        "precioFinalPremium":  ${this.round(this.totalPremium)},
        "contacto": ${JSON.stringify(this.message)}
      }`;

      if(nuevo){
        if(this.presupuestosGuardados.length > 0){
          var presupuestoDB = this.presupuestosGuardados.find(a=>a.id == this.presupuesto.id);
  
          console.log(presupuestoDB, this.presupuesto.id);
    
          if(presupuestoDB && presupuestoDB.estado == 1){
            return this.$noty.error("No puedes crear otro presupuesto sin antes cerrar el que tienes en curso");
          }
        }
      }



      let obj = {
        id:null,
        token: this.presupuesto.cliente.token_project,
        results: results,
        estado: exportar ? 0:1,
        imagen1: "",
        imagen2: "",
        imagen3: "",
        imagen4: "",
        imagen5: "",
        fecha: new Date(),
        usuario: localStorage.getItem("user-name"),
        project_id: this.project_id,
      };

      if (!nuevo) obj.id = this.presupuesto.id;

      this.$el.querySelectorAll(".bg-image-droppable").forEach((element, index) => {
        let nombre = `imagen${index + 1}`;
        obj[nombre] = element.style.background == "" ? "" : element.style.background.slice(5, element.style.background.length).slice(0, -1);
      });

      if(guardarProyectoComo){

      var numeroPresupuesto = Object.keys(this.presupuestosGuardados).find(key => this.presupuestosGuardados[key].id === this.presupuesto.id);
      const projectName = `${this.loadedProjectName} Presupuesto ${numeroPresupuesto}`;

      if(this.$store.state.info.token_project!=""){
          if (projectName) {
            this.$noty.info("Guardando proyecto...");
          HTTP.post(`/api/proyecto-json`, {
            proyectojson_id: this.loadedProjectId,
            actual_token_project: this.$store.state.info.token_project,
            token_project: this.$store.state.info.token_project,
            nombre: projectName,
            mueble:  this.$store.state.info.mueble,
            client_name: this.$store.state.info.name,
            encargado_med: this.$store.state.info.encargadoMed,
            encargado_inst: this.$store.state.info.encargadoInst,
            address: this.$store.state.info.address,
            phone: this.$store.state.info.phone,
            comentario: this.$store.state.info.comentarioInstalacion,
            estado: this.$store.state.info.estadoProyecto,
            proyecto: JSON.stringify(localStorage.vuex),
            settings: this.$store.state.projectSettings
          })
            .then((result) => {
              console.log(result)
              if (result.data.success === true) {
                
                // localStorage.setItem('projectName', projectName)
                this.$noty.success("Proyecto guardado");
                this.$noty.info("Generando pedido de presupuesto. Por favor, aguarde.");
                obj.project_id = result.data.proyectojson_id;
                HTTP.post("/api/presupuesto", obj)
                .then((res) => {
                  if (res.data.ok) {
                    this.$noty.success("El presupuesto se generó correctamente");
                    this.traerPresupuestoAbierto(true);
                    this.$noty.success("¡Proyecto guardado con éxito!");
                    this.loadedProjectName = result.data.nombre;
                    this.loadedProjectId = result.data.proyectojson_id;
                    location.reload();
                    if (callback) {
                      callback()
                    }
                  }
                })
                .catch((handlerErr) => {
                  this.$noty.error(
                    "Error al generar el presupuesto ya que no tiene un ID asignado ."
                  );
                });
              }
            })
            .catch((result) => {
              alert(result)
              this.$noty.error("Ups, ha ocurrido un problema");
            });
        }
      }else{
        alert("Proyecto sin token");
        return true;
      }
        
      }else{
        this.$noty.info('Guardando proyecto...')
        const name = this.getProjectNameForSave()
        HTTP.post(`/api/proyecto-json`, {
          nombre: name,
          proyecto: JSON.stringify(localStorage.vuex),
          force: true
        }).then(result => {
          localStorage.setItem('projectName', name)
          this.$noty.success("Proyecto guardado");
          this.$noty.info("Generando pedido de presupuesto. Por favor, aguarde.");
          HTTP.post("/api/presupuesto", obj)
          .then((res) => {
            if (res.data.ok) {
              this.$noty.success("El presupuesto se generó correctamente");
              this.traerPresupuestoAbierto(true);
  
              if (callback) {
                callback()
              }
            }
          })
          .catch((handlerErr) => {
            this.$noty.error(
              "Error al generar el presupuesto ya que no tiene un ID asignado ."
            );
          });
        }).catch(result => {
          this.$noty.error('Ups, ha ocurrido un problema')
        });
      }

        // this.$noty.info("Generando pedido de presupuesto. Por favor, aguarde.");
        // HTTP.post("/api/presupuesto/", obj)
        // .then((res) => {
        //   if (res.data.ok) {
        //     this.$noty.success("El presupuesto se generó correctamente");
        //     this.traerPresupuestoAbierto(true);
        //   }
        // })
        // .catch((handlerErr) => {
        //   this.$noty.error(
        //     "Error al generar el presupuesto ya que no tiene un ID asignado ."
        //   );
        // });
    },
    getProjectNameForSave () {
      // const name = localStorage.getItem('projectName')
      // const delimiter = ' - v'
      // const index = name.lastIndexOf(delimiter)
      // if (index >= 0) {
        //   const versionAndDelimiter = name.substring(name.lastIndexOf(delimiter))
      //   const version = versionAndDelimiter.substring(delimiter.length)
      //   const projectName = name.substring(0, name.lastIndexOf(delimiter))
      //   return projectName + delimiter + (+version + 1)
      // } else {
        //   return name + delimiter + 2
      // }
      return localStorage.getItem('projectName')
    },    
    reabrirPresupuesto() {
      let obj = {
        id: this.presupuesto.id,
      };
      HTTP.post("/api/presupuesto/reabrir", obj).then((result) => {
        this.$noty.success("¡Se reabrió el presupuesto correctamente!");
        this.presupuesto.estado = 1;
      });
    },
    guardarPreset() {
      this.$refs.configOptions.style.display = "block";
      this.$swal({
        content: this.$refs.configOptions,
        buttons: {
          cancelar: {
            text: "Cancelar",
            value: 0,
          },
          save: {
            text: "Guardar",
            value: 1,
          },
        },
      }).then((result) => {
        if (result == 1) {
          this.presupuesto.lineaClasica = this.presupuesto.lineaClasica.filter(
            (x) => x.nombre != ""
          );
          this.presupuesto.lineaPremium = this.presupuesto.lineaPremium.filter(
            (x) => x.nombre != ""
          );
          this.presupuesto.piezas = this.presupuesto.piezas.filter(
            (x) => x.nombre != ""
          );

          if (this.presupuesto.detalles == "") {
            return this.$noty.warning(
              "Agregue un detalle para guardar el preset"
            );
          }
          if (this.presupuesto.condicionesPago == "") {
            return this.$noty.warning(
              "Agregue una condición de pago para guardar el preset"
            );
          }

          if (this.presupuesto.lineaClasica.length == 0) {
            return this.$noty.warning(
              "Agregue una elementos a la linea clásica"
            );
          }
          if (this.presupuesto.lineaPremium.length == 0) {
            return this.$noty.warning(
              "Agregue una elementos a la linea premium"
            );
          }
          if (this.presupuesto.piezas.length == 0) {
            return this.$noty.warning("Agregue una base");
          }
          if (this.nombrePreset != null && this.nombrePreset.length > 0) {
            const presupuestoPreset = {
              nombre: this.nombrePreset,
              result: `{
          "lineaClasica": ${JSON.stringify(this.presupuesto.lineaClasica)},
          "lineaPremium": ${JSON.stringify(this.presupuesto.lineaPremium)},
          "detalles": ${JSON.stringify(this.presupuesto.detalles)},
          "condicionesPago": ${JSON.stringify(
            this.presupuesto.condicionesPago
          )},
          "color": ${JSON.stringify(this.presupuesto.color)},
          "validezPresupuesto": ${JSON.stringify(
            this.presupuesto.validezPresupuesto
          )},
          "validezPromo": ${JSON.stringify(this.presupuesto.validezPromo)},
          "piezas": ${JSON.stringify(this.presupuesto.piezas)}
        }`,
            };

            HTTP.post("/api/presupuestos/presets", presupuestoPreset)
              .then((result) => {
                if (result.data.ok) {
                  this.$noty.success("¡Datos guardados correctamente!");
                  this.loadPreset(false);
                } else this.$noty.error(result.data.message);
              })
              .catch((result) => {
                this.$noty.error(result);
              });
          } else this.$noty.warning("Agregue un nombre para guardar el preset");
        }
      });
    },
    loadPreset(refresh) {
      let self = this;
      HTTP.get("/api/presupuestos/presets")
        .then((result) => {
          self.templatesPreset = result.data;
          if (refresh) {
            let predeterminado = self.templatesPreset.filter(
              (x) => x.predeterminado
            );
            if (predeterminado.length > 0) {
              this.loadPresetTemplate(predeterminado[0]);
            }
          }
        })
        .catch((result) => {
          this.$noty.error("¡Error al cargar datos!");
        });
    },
    openModalPreset() {
      if (this.templatesPreset.length > 0) {
        this.$refs.loadPresetTemplate.show();
      } else this.$noty.error("No hay presets cargados");
    },
    loadPresetTemplate(preset) {
      const {
        lineaClasica,
        lineaPremium,
        detalles,
        condicionesPago,
        color,
        validezPresupuesto,
        validezPromo,
        piezas,
      } = JSON.parse(preset.result);

      this.presupuesto.lineaClasica = lineaClasica;
      this.presupuesto.lineaPremium = lineaPremium;
      this.presupuesto.detalles = detalles;
      this.presupuesto.condicionesPago = condicionesPago;
      this.presupuesto.validezPresupuesto = validezPresupuesto;
      this.presupuesto.validezPromo = validezPromo;
      this.presupuesto.color = color;
      this.presupuesto.piezas = piezas;
      this.nombrePreset = preset.nombre;

      this.$refs.loadPresetTemplate.hide();
      this.$noty.success("¡Template cargado con éxito!");
    },
    deletePresetTemplate({ id }) {
      let self = this;
      HTTP.delete(`/api/presupuestos/presets/${id}`).then((response) => {
        if (response.data.ok) {
          self.$noty.success("¡Template eliminada con éxito!");
          self.templatesPreset = self.templatesPreset.filter(
            (template) => template.id != id
          );
        } else self.$noty.error("¡Error al eliminar el template!");
      });
    },
    loadTemplate() {
      let self = this;
      HTTP.get("/api/configuracion/tipo/Presupuesto/all")
        .then((result) => {
          self.templates = result.data.configuraciones;
          self.$refs.loadTemplateModal.show();
        })
        .catch((result) => {
          this.$noty.error("¡Error al cargar datos!");
        });
    },
    templateDelete(index) {
      const template = this.templates[index];
      let self = this;

      this.$swal("No podrá volver a acceder a dicho template", {
        title: "¿Seguro de eliminar el template?",
        icon: "warning",
        buttons: {
          cancel: "Cancelar",
          aceptar: {
            text: "Confirmar",
            value: true,
          },
        },
      }).then((value) => {
        if (value === true) {
          self.$noty.info("Eliminando template...");
          HTTP.delete(`/api/configuracion/${template.id}`).then((response) => {
            if (response.data.success) {
              self.$noty.success("¡Template eliminada con éxito!");
              self.templates.splice(index, 1);
            }
          });
        } else {
          this.close();
        }
      });
    },
    cargarTemplate(template) {
      this.removeAllFromPresupuesto();
      this.cuotas.slice().forEach((cuota, index) => {
        this.removeCuota(cuota);
      });
      template.forEach((element) => {
        if (element.name === "servicesList") {
          element.value.forEach((s) => {
            this.$store.commit("addToPresupuesto", s);
          });
        } else if (element.name === "cuotas") {
          element.value.forEach((cuota, index) => {
            this.addCuota();
            this.updateCuota(cuota, index);
          });
        } else if (element.name !== "default") {
          this[element.name] = element.value;
        }
      });
      this.servicesList = template[0].value;
    },
    templateLoad(id) {
      this.$noty.info("Cargando template...");
      HTTP.get(`/api/configuracion/${id}`).then((response) => {
        const template = response.data.configuracion.values;
        this.cargarTemplate(template);
        this.$refs.loadTemplateModal.hide();
        this.$noty.success("¡Template cargado con éxito!");
      });
    },
    removeAllFromPresupuesto() {
      this.servicesList.forEach((item) => {
        this.$store.commit("removeFromPresupuesto", item);
      });
    },
    addOne() {
      this.adding = true;
    },
    newItemInvalid() {
      return (
        !this.newItem.nombre ||
        this.newItem.value === undefined ||
        this.newItem.value === "" ||
        isNaN(this.newItem.count) ||
        isNaN(this.newItem.value)
      );
    },
    add() {
      if (this.newItemInvalid()) {
        return;
      }
      this.adding = false;
      this.$store.commit("addToPresupuesto", this.newItem);
      this.processContactMessage();
      this.newItem = {
        nombre: "",
        value: 0,
        count: 0,
      };
    },
    cancel() {
      this.adding = false;
      this.newItem = {
        nombre: "",
        value: 0,
        count: 0,
      };
    },
    remove(item) {
      this.$store.commit("removeFromPresupuesto", item);
      this.processContactMessage();
    },
    round(n, decimals = 2) {
      let negative = false;
      if (n < 0) {
        negative = true;
        n = n * -1;
      }
      var multiplicator = Math.pow(10, decimals);
      n = parseFloat((n * multiplicator).toFixed(11));
      n = (Math.round(n) / multiplicator).toFixed(decimals);
      if (negative) {
        n = (n * -1).toFixed(decimals);
      }
      return n;
    },
    materialListChange: function (material) {
      this.$store.commit("updateMaterialList", { material });
    },
    alternativeMaterialQuantityChange: function (material) {
      this.$store.commit("updateAlternativeMaterialList", { material });
    },
    alternativeMaterialTypeChange: function (material) {
      const element = this.getElement(material.nombre);
      material.value = element.precio_mt2 || element.precio_placa;
      this.$store.commit("updateAlternativeMaterialList", { material });
    },
    desperdicioChangeHandler: function (material) {
      this.$store.commit("updateMaterialListDesperdicio", { material });
    },
    changedPresupuesto(key, val) {
      this.$store.commit("updatePresupuestoProperty", { key, item: val });
      this.processContactMessage();
    },
    removeItemLineaClasica(item) {
      this.presupuesto.lineaClasica = this.presupuesto.lineaClasica.filter(
        (x) => x.id != item.id
      );
    },
    removeItemLineaPremium(item) {
      this.presupuesto.lineaPremium = this.presupuesto.lineaPremium.filter(
        (x) => x.id != item.id
      );
    },
    removeItemBase(item) {
      this.presupuesto.piezas = this.presupuesto.piezas.filter(
        (x) => x.id != item.id
      );
    },
    getElement(material) {
      const list = this.availableMaterials
        .concat(this.availableHerrajes)
        .concat(this.availableMetalesKit)
        .concat(this.availableTapacantos);
      return list.find(
        (e) =>
          e.material === material ||
          e.nombre + " - " + e.material === material ||
          e.nombre === material ||
          e.material + " - " + e.nombre === material ||
          e.material + " " + e.nombre === material
      );
    },
    getTotal(isPremium) {
      const multiplier = isPremium
        ? this.premiumMultiplier
        : this.classicMultiplier;
      const materials = isPremium
        ? this.materialList
        : this.alternativeMaterialList;
      let total = 0;

      Object.values(materials).forEach((m) => {
        if (m) {
          total += +m.value * m.cantidad;
        }
      });

      this.servicesList.forEach((s) => {
        total += +s.value * s.count;
      });

      total *= multiplier;

      return total;
    },
    addCuota() {
      const cuota = {
        cantCuotas: 1,
        interes: 0,
      };
      this.$store.commit("addCuota", cuota);
      this.processContactMessage();
    },
    updateCuota(cuota, index) {
      this.$store.commit("updateCuota", { cuota, index });
      this.processContactMessage();
    },
    removeCuota(cuota) {
      this.$store.commit("removeCuota", cuota);
      this.processContactMessage();
    },
    processContactMessage() {
      if (!this.autoUpdateMsg) {
        this.message = window.localStorage.getItem("contact_smg");
        return;
      }
      if (this.placeholders.length === 0) {
        this.message = this.originalMessage;
        return;
      }
      this.placeholders.forEach((placeholder) => {
        this.message = this.originalMessage.replace(
          new RegExp(placeholder.key, "g"),
          this[placeholder.key]
            ? this[placeholder.key](placeholder)
            : this.defaultPlaceholderFn(placeholder)
        );
      });
      this.placeholders.forEach((placeholder) => {
        this.message = this.message.replace(
          new RegExp(placeholder.key, "g"),
          this[placeholder.key]
            ? this[placeholder.key](placeholder)
            : this.defaultPlaceholderFn(placeholder)
        );
      });
      this.placeholders.forEach((placeholder) => {
        this.message = this.message.replace(
          new RegExp(placeholder.key, "g"),
          this[placeholder.key]
            ? this[placeholder.key](placeholder)
            : this.defaultPlaceholderFn(placeholder)
        );
      });
    },
    showModalImagenes(image) {
      this.$refs.modalImageClient.show()
      this.imgModal = image
    },
    showModalUploadUrl(tipo) {
      this.formUploadUrl.nombre = ''
      this.formUploadUrl.url = ''
      
      this.modalUploadUrl.title = tipo
      if(tipo === 'video'){
        this.modalUploadUrl.url = 'videos'
      } else if(tipo === 'imagen'){
        this.modalUploadUrl.url = 'images'
      } else if(tipo === 'pdf'){
        this.modalUploadUrl.url = 'pdfs'
      }
      
      this.$refs.modalUploadUrl.show()
    },
    guardarUrlCliente(){
      console.log("guardarUrlCliente")
      const { nombre, url } = this.formUploadUrl
      if(nombre.length > 0 && url.length > 0){
        let formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("url", url);
        formData.append("token", this.presupuesto.cliente.token_project);
        HTTP.post(`/api/presupuestos/${this.modalUploadUrl.url}/url`, formData)
          .then((result) => {
            if (result.status === 200) {
              if(this.modalUploadUrl.url === 'videos'){
                this.currentEventVideos.push(result.data)
              } else if(this.modalUploadUrl.url === 'images'){
                this.currentEventImages.push(result.data)
              } else if(this.modalUploadUrl.url === 'pdfs'){
                this.currentEventPdfs.push(result.data)
              }
              
              this.$noty.success(`¡Url externa de ${this.modalUploadUrl.title} subida correctamente!`)
              this.modalUploadUrl.title=null
              this.$refs.modalUploadUrl.hide()

            } else {
              
              this.$noty.error(result.data.message)
            }
            
          })
          .catch((result) => {
            console.log(result)
            this.$noty.error(result);
          });
        
      }else{
        this.$noty.error(`¡Alguno de los campos esta vacio!`)
      }
      
    },
    cerrarModalUploadUrl(){
      this.$refs.modalUploadUrl.hide()
    },
    /* Funciones para reemplazo de placeholders */
    "!precio1!"(p) {
      return "$" + this.round(this.getTotal(true));
    },
    "!precio2!"(p) {
      return "$" + this.round(this.getTotal(false));
    },
    "!firma!"(p) {
      return p.value;
    },
    "!cuotas!"(p) {
      if (!this.cuotas) {
        return "";
      } else {
        let result = `Linea Clasica\n`;
        this.cuotas.forEach((cuota) => {
          result += `     ${cuota.cantCuotas} cuotas de $${this.getFinanciacion(
            cuota,
            false
          )}                                            $${this.getTotalFinanciacion(
            cuota,
            false
          )}\n`;
        });
        result += `Linea Premium\n`;
        this.cuotas.forEach((cuota) => {
          result += `     ${cuota.cantCuotas} cuotas de $${this.getFinanciacion(
            cuota,
            true
          )}                                            $${this.getTotalFinanciacion(
            cuota,
            true
          )}\n`;
        });
        return result;
      }
    },
    "!alto!"(p) {
      return this.$store.getters.selectedModule.height + "mm";
    },
    "!ancho!"(p) {
      return this.$store.getters.selectedModule.width + "mm";
    },
    "!prof!"(p) {
      return this.$store.getters.selectedModule.z + "mm";
    },
    defaultPlaceholderFn(p) {
      return p.value;
    },
    /********************************************/
  },
  computed: {
    totalPremium(){
      var lineaPremiumActiva = this.listLineasPremium.find(a=>a.Activo==true);
      console.log(lineaPremiumActiva);
      const multiplier = this.premiumMultiplier;
      var materials = [];
      
      if(lineaPremiumActiva){
        materials = lineaPremiumActiva.AlternativeMaterialList;
      }else{
        materials = this.materialList;
      }

      let total = 0;

      Object.values(materials).forEach((m) => {
          if (m) {
          total += +m.value * m.cantidad;
          }
      });

      this.servicesList.forEach((s) => {
          total += +s.value * s.count;
      });

      total *= multiplier;

      return total;
    },
    totalClasica(){
      var lineaClasicaActiva = this.listLineasClasica.find(a=>a.Activo==true);
      const multiplier = this.classicMultiplier;
      var materials = [];
      
      if(lineaClasicaActiva){
        materials = lineaClasicaActiva.AlternativeMaterialList;
      }else{
        materials = this.alternativeMaterialList;
      }

      let total = 0;

      Object.values(materials).forEach((m) => {
          if (m) {
          total += +m.value * m.cantidad;
          }
      });

      this.servicesList.forEach((s) => {
          total += +s.value * s.count;
      });

      total *= multiplier;

      return total;
    },
    premiunActivo(){
      var lineaPremiumActiva = this.listLineasPremium.find(a=>a.Activo==true);
      if(lineaPremiumActiva){
        return false;
      }else{
        return true;
      }
    },
    clasicaActivo(){
      var lineaClasicaActiva = this.listLineasClasica.find(a=>a.Activo==true);
      if(lineaClasicaActiva){
        return false;
      }else{
        return true;
      }
    },
    listLineasPremium:{
      get(){
        return this.$store.getters.getListLineasPremium
      },
      set(value){
        console.log(value);
        this.$store.commit('setGeneralProperty', { key: 'listLineasPremium', value: JSON.stringify(value) });
      }
    },
    listLineasClasica:{
      get(){
        return this.$store.getters.getListLineasClasica
      },
      set(value){
        console.trace();
        console.log(value);
        this.$store.commit('setGeneralProperty', { key: 'listLineasClasica', value: JSON.stringify(value) });
      }
    },
    opcMaterialesSelect(){
      try {
        return {
          availableMaterials: this.availableMaterials,
          availableHerrajes: this.availableHerrajes,
          availableTapacantos: this.availableTapacantos,
          availableMetalesKit: this.availableMetalesKit
        };
      } catch (error) {
        return {
          availableMaterials:[],
          availableHerrajes:[],
          availableTapacantos:[],
          availableMetalesKit:[],
        };
      }
    },
    loadedProjectId: {
      get() {
        return localStorage.getItem("projectID") || undefined;
      },
      set(value) {
        localStorage.setItem("projectID", value);
      },
    },
    loadedProjectName: {
      get() {
        return localStorage.getItem("projectName") || undefined;
      },
      set(value) {
        localStorage.setItem("projectName", value);
      },
    },
    availableMaterials() {
      return this.$store.getters.getMaterialesAdd;
    },
    availableHerrajes() {
      return this.$store.getters.getHerrajesAdd.map((h) => {
        h.name = h.material + " " + h.nombre;
        return h;
      });
    },
    availableMetalesKit() {
      return this.$store.getters.getMetalesAdd;
    },
    availableTapacantos() {
      return this.$store.getters.getTapacantosAdd.map((tc) => {
        tc.name = tc.nombre + " - " + tc.material;
        return tc;
      });
    },
    partList() {
      return JSON.parse(JSON.stringify(this.$store.getters.getPartList));
    },
    // presupuesto: {
    //   get () {
    //     return this.$store.getters.getPresupuesto || this._presupuesto;
    //   },
    //   set (value) {
    //     this.$store.commit("setPresupuesto", value);
    //   }
    // },
    autoUpdateMsg: {
      get() {
        return this.$store.state.general.autoUpdateMsg;
      },
      set(value) {
        this.$store.commit("setGeneralProperty", {
          key: "autoUpdateMsg",
          value,
        });
      },
    },
    materialList: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters.getMaterialsList));
      },
    },
    alternativeMaterialList: {
      get() {
        let alternativeMaterials = JSON.parse(
          JSON.stringify(this.$store.getters.getAlternativeMaterialList)
        );
        let materials = JSON.parse(JSON.stringify(this.materialList));
        let that = this;
        Object.keys(this.materialList).forEach(function (material) {
          if (!alternativeMaterials[materials[material].nombreOriginal]) {
            alternativeMaterials[materials[material].nombreOriginal] =
              materials[material];
            alternativeMaterials[
              materials[material].nombreOriginal
            ].cantidad = that.round(
              alternativeMaterials[materials[material].nombreOriginal].cantidad
            );
          }
        });
        return alternativeMaterials;
      },
      set(val) {
        this.$store.commit("setAlternativeMaterialList", val);
      },
    },
    cuotas: {
      get() {
        return this.$store.getters.getCuotas;
      },
    },
    servicesList: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters.getServicesList));
      },
      set(value) {
        this._servicesList = value;
      },
    },
    classicMultiplier: {
      get() {
        return this.$store.state.general.classicMultiplier;
      },
      set(value) {
        this.$store.commit("updateMultiplier", { isPremium: false, value });
        this.updateClasicaMultiplier();
      },
    },
    waste: {
      get() {
        return this.$store.state.general.presupuestosConfig["waste"];
      },
      set(value, field) {
        this.$store.commit("updatePresupuestosConfig", {
          value,
          field: "waste",
        });
      },
    },
    premiumMultiplier: {
      get() {
        return this.$store.state.general.premiumMultiplier;
      },
      set(value) {
        this.$store.commit("updateMultiplier", { isPremium: true, value });
        this.updatePremiumMultiplier();
      },
    },
  },
  components: {
    LineaPremiumAgregados
  },
  watch: {
    materialList: function (newValue, oldValue) {
      this.processContactMessage();
      return newValue;
    },
    alternativeMaterialList: function (newValue, oldValue) {
      this.processContactMessage();
      return newValue;
    },
  },
};
</script>
<style lang="scss" scoped>
.make-default {
  visibility: hidden;
  display: inline-block;
  float: right;
  cursor: pointer;
  margin-right: 20px;
}
.hover-row:hover {
  background-color: #dee2e6;
  .make-default {
    visibility: visible;
  }
}
</style>
<style scoped>
.auto-update {
  text-align: right;
  font-size: 15px;
}
thead {
  font-size: 14px;
}
.estado select {
  width: 85px;
}
.nombre {
  padding: 0px 8px !important;
}
.nowrap {
  white-space: nowrap;
}
.content {
  margin-top: 50px;
}
table {
  width: 1300px;
  /* position: relative; */
  left: -100px;
}
.header-cell {
  width: 185px;
}
.swal-title {
  margin: 0px;
  font-size: 16px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.21);
  margin-bottom: 28px;
}
.multiplier {
  font-size: 12px;
}
.multiplier-container {
  font-size: 13px;
  /* position: relative; */
  right: 60px;
  text-align: left;
  margin-top: 50px;
}
.template-controls {
  /* position: relative; */
  right: 60px;
  text-align: left;
  margin-top: 50px;
}
.pieces-count {
  font-weight: bold;
}
.placas-count {
  font-size: 12px;
}
.adding-name-cell input {
  width: 175px !important;
  height: 27px;
  left: 75px;
  /* position: relative; */
}
.adding-count {
  /* position: relative; */
  right: 40px;
}
.cantidad-header {
  /* position: relative; */
  right: 50px;
}
.restart {
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
}
.restart:hover {
  text-decoration: underline;
}
.cantidad-cell {
  width: 150px;
  margin-right: 10px;
  left: -80px;
  /* position: relative; */
}
.adding-total-cell {
  width: 105px;
}
.item-header {
  flex: 1;
  /* position: relative; */
  left: 25px;
  margin-left: 90px;
}
.precio-unidad-header {
  /* position: relative; */
  right: 35px;
  width: 100px;
  text-align: center;
  font-size: 12px;
}
.precio-total-header {
  /* position: relative; */
  font-size: 13px;
  width: 80px;
}
.precio-unidad-cell {
  width: 90px;
}
.presupuesto {
  margin-top: 20px;
}
.presupuesto table input {
  width: 75px;
}
.presupuesto-select {
  height: 25px;
  padding: 0px 0px 0px 10px;
  font-size: 14px;
}
.presupuesto table input.custom,
.input-custom {
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  height: 19px;
}
.presupuesto table input.custom:focus,
.input-custom:focus {
  border-bottom: 1px solid #17a2b894;
}
.precio-total-cell {
  width: 90px;
  justify-content: center;
}
.presupuesto table input.edit-count {
  width: 60px;
  /* position: relative; */
  left: 15px;
}
.service-label {
  flex: 1;
  /* position: relative; */
  right: 75px;
}
.total-label {
  /* position: relative; */
  right: 160px;
}
.value-label {
  /* position: relative; */
  right: 80px;
  top: -35px;
  font-weight: 600;
  font-size: 20px;
}
.presupuesto table {
  width: 630px;
  margin: 0 auto;
}
.presupuesto-container {
  margin-top: 15px;
  margin-right: 10px;
}
.presupuesto-container .p-title {
  margin-bottom: 20px;
  text-align: left;
}
.p-title input {
  height: 20px;
  font-size: 12px;
  width: 40px;
  text-align: center;
}
.flex {
  display: flex;
}
.text-left {
  text-align: left;
}
.presupuesto table thead {
  margin-bottom: 5px;
  font-size: 17px;
}
.presupuesto table tr {
  min-width: 600px;
  height: 25px;
  transition: all 400ms ease-in-out;
}
.presupuesto table tr:hover {
  background-color: #03a9f41c;
  font-weight: bold;
}
.presupuesto table tr.no-hover:hover {
  background-color: transparent !important;
  font-weight: initial !important;
}
.presupuesto table tbody {
  font-size: 14px;
  cursor: default;
}
tfoot span {
  padding-top: 7px;
  display: inline-block;
}
.shadow {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.dotted-line {
  display: inline-block;
  border-bottom: 1px dotted #ccc;
  margin-bottom: 6px;
  flex: 1;
  margin-left: 5px;
}
.align-center {
  align-items: center;
  align-content: center;
}
.add-another-one {
  cursor: pointer;
  font-size: 16px;
}
.plus {
  font-weight: bold;
  color: #3aa051;
  font-size: 25px;
  margin-top: 2px;
  line-height: 1;
  vertical-align: bottom;
  margin-right: 5px;
}
.btn {
  font-weight: bold;
  margin-right: 5px;
}
.cancel-btn {
  padding: 0px;
}
.remove-btn {
  /* position: relative; */
  right: -15px;
  cursor: pointer;
  font-size: 10px;
  margin-top: 3px;
  margin-right: 3px;
  width: 25px;
}
.justify-evenly {
  justify-content: space-evenly;
}
.separation-row div {
  height: 5px;
  margin: 10px 80px;
  background-color: #ccc;
  border-radius: 5px;
}
.disabled {
  cursor: not-allowed;
}
.imagen-client {
  position: absolute;
  transition: transform .2s;
  cursor: pointer;
}
#modal-image figure{
  max-height: 78vh;
  overflow-y: auto;

}
.imagen-client:hover img {
  transform: scale(1.1);
}

.remove-button {
  position: absolute;
  font-size: 20px;
  height: 25px;
  line-height: 1;
  width: 21px;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid transparent;
  transition: background-color .25s, border-color 5s;
}
.remove-button:hover {
  border-color: rgb(195 67 67 / 80%);
  background: rgb(195 67 67 / 50%);
  color: white;
}
.remove-image-button {
  color: white;
  right: 4px;
  top: 5px;
}
.financiacion,
.message {
  text-align: initial;
  right: 20%;
  margin-top: 20px;
  margin-bottom: 100px;
  /* position: relative; */
}
.financiacion-container,
.message-container {
  display: flex;
}
.financiacion h5,
.message h5 {
  /* position: relative; */
  width: 135px;
  margin-top: 15px;
}
.financiacion-item input {
  width: 50px;
}
.financiacion-item .cancel-btn {
  font-size: 12px;
}
.financiacion-item {
  font-size: 15px;
  padding: 15px;
  transition: all 300ms ease-in-out;
}
.financiacion-item:hover {
  background-color: #cccccc26;
}
.financiacion-item .input-custom {
  text-align: center;
}
.financiacion-item .details {
  margin-left: 45px;
}
.hold {
  border: solid 5px #ccc;
}
.fill {
  position: relative;
  height: 150px;
  width: 150px;
  top: 5px;
  left: 5px;
  cursor: pointer;
}

.empty {
  display: inline-block;
  height: 160px;
  width: 160px;
  margin: 10px;
  border: solid 3px salmon;
  background: white;
}

.hovered {
  background: #f4f4f4;
  border-style: dashed;
}

.no-financiacion {
  margin-top: 15px;
}
.no-financiacion span {
  margin-left: 20px;
  font-weight: bold;
  color: #646467;
}
.pointer {
  cursor: pointer;
}
.add-cuota {
  margin-left: 155px;
}
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.financiacion-presupuesto {
  font-weight: bold;
}
.label-premium {
  color: #b59903;
  font-weight: bold;
}
.message-text {
  width: 650px;
  height: 500px;
}
.justify-center {
  justify-content: center;
}
.message-content {
  margin-top: 15px;
}

.bg-lightblue {
  background: #007bff;
}
#pdf {
  position: relative;
  min-height: 29.7cm;
  width: 21cm;
  color: #555555;
  background: #ffffff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 12px;
  padding: 30px;
  overflow: hidden;
}
.header-pdf {
  padding: 10px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #aaaaaa;
}

.table-pdf {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
  margin-top: 8px;
}

.table-pdf th,
.table-pdf td {
  padding: 10px !important;
  background: #eeeeee;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

.table-pdf th {
  white-space: nowrap;
  font-weight: normal;
}

.table-pdf td {
  text-align: right;
}

.table-pdf td h3 {
  color: #57b223;
  font-size: 1em;
  font-weight: normal;
  margin: 0 0 0.2em 0;
}

.table-pdf .no {
  color: #ffffff;
  font-size: 1.4em;
  background: #57b223;
}

.table-pdf .desc {
  text-align: left;
}

.table-pdf .unit {
  background: #dddddd;
}

.table-pdf .qty {
}

.table-pdf .total {
  background: #999999;
  color: #ffffff;
}

.table-pdf td.unit,
.table-pdf td.qty,
.table-pdf td.total {
  text-align: center;
  font-size: 1em;
}

.table-pdf tbody tr:last-child td {
  border: none;
}

.p-100 {
  padding-right: 110px;
}

.table-pdf tfoot td {
  padding: 10px 20px;
  background: #ffffff;
  border-bottom: none;
  font-size: 1em;
  white-space: nowrap;
  border-top: 1px solid #aaaaaa;
}

.table-pdf tfoot tr:first-child td {
  border-top: none;
}

.table-pdf tfoot tr:last-child td {
  color: #57b223;
  font-size: 1.2em;
  border-top: 1px solid #57b223;
}

.table-pdf tfoot tr td:first-child {
  border: none;
}

#logo {
  float: left;
  position: relative;
  top: -18px;
}

#logo img {
  height: 70px;
}

#company {
  float: right;
  text-align: right;
  position: relative;
}

#details {
  margin-bottom: 30px;
}

#client {
  padding-left: 6px;
  border-left: 6px solid #d5212e;
  float: left;
}

#client .to {
  color: #777777;
}

h2#name {
  font-size: 1.2em;
  font-weight: normal;
  margin: 0;
}

#invoice {
  float: right;
  text-align: right;
}

#invoice h1 {
  color: #d5212e;
  font-size: 2.2em;
  line-height: 1em;
  font-weight: normal;
  margin: 0 0 10px 0;
}

#invoice .date {
  font-size: 0.9em;
  color: #777777;
}

#thanks {
  font-size: 1.7em;
  margin-bottom: 50px;
}

#notices {
  padding-left: 6px;
  border-left: 6px solid #d5212e;
}

#notices .notice {
  font-size: 1em;
}

footer {
  color: #777777;
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 0;
  border-top: 1px solid #aaaaaa;
  padding: 8px 0;
  text-align: center;
}

#mlplak {
  font-size: 48px;
  font-weight: bold;
}

#block {
  display: block;
}

.descripcion {
  font-size: 18px;
  position: absolute;
  right: 0;
  bottom: 5px;
}
</style>
<style>
.modal-sm {
  width: 700px !important;
}
</style>
<style lang="scss">
.lightbox-overlay .holder .nav span {
  color: black;
}
.lightbox-overlay {
  z-index: 1;
}
.vue-lightbox ul {
  max-width: none !important;
}
.vue-lightbox ul li {
  cursor: pointer;
  transition: 0.4s;
  padding: 20px !important;
  border: 3px solid transparent;

  &:hover {
    border-color: rgba(3, 169, 244, 0.2);
  }

  &.img-selected {
    border-color: #03a9f4;
  }
}
.pdf-pre {
  margin-top: 15px;
  text-align: left;
  font-family: segoe ui;
  font-size: 12px;
  white-space: pre-wrap
}

#dropdown-1 button:hover span.plus {
    color: #1bff00;
}

.lineaActiva{
  background: #6c757d3b;
  border: 1px #9ba0a4 solid;
  border-radius: 5px;
}
</style>

