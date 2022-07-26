<template>
  <div class="page-contents" id="calendarPage">
    <vue-toastr ref="toastr"></vue-toastr>
    <notification></notification>
    <vue-easy-lightbox
      :visible="visible"
      :imgs="imgs"
      :index="index"
      @hide="handleHide"
    ></vue-easy-lightbox>
    <div class="row">
      <div class="col-md-12">
        <b-form-row style="margin-top: 10px">
          <b-col cols="4">
            <select
              class="form-control"
              name="grupo"
              @change="filtrarPorGrupo($event)"
              v-model="filtroGrupo"
              :disabled="grupos.length == 0"
            >
              <option selected value="0">Ver todos</option>
              <option v-for="grupo in grupos" :value="grupo.id" :key="grupo.id">
                {{ grupo.nombre_grupo }}
              </option>
            </select>
          </b-col>
          <b-col cols="4">
            <input
              class="form-control"
              type="month"
              id="start"
              name="start"
              :value="mesActual"
              @change="monthSelect($event)"
            />
          </b-col>
          <b-col cols="2">
            <b-button class="form-control" variant="outline-success"
            @click="abrirBusquedaCliente()"
            >Buscar x clientes...</b-button>
          </b-col>
          <b-col cols="2">
            <b-button variant="outline-primary" @click="fetchEvents()">
              <b-icon icon="arrow-repeat"></b-icon>
            </b-button>
          </b-col>
        </b-form-row>
    </div>
    <div class="row">
        <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
          <b-col cols="12">
          <table class="table table-md">
          <tr>
            <td width="100%">
              <div ref="calendar">
                <FullCalendar
                  id="calendar"
                  ref="fullCalendar"
                  :options="calendarOptions"
                />
              </div>
            </td>
          </tr>
          </table>
          </b-col>
        </b-overlay>
    </div>
    <div v-for="(item, myIndex) in itemsToShowFirst" :key="myIndex">
      <b-modal
        :ref="'#proyectoFirst-' + myIndex"
        :id="'#proyectoFirst-' + myIndex"
        hide-header
        ok-only
      >
        <table align="center">
          <tr>
            <td style="font-size: 18px; text-align: center; font-weight: bold">
              {{ item.fancyHeader }}
            </td>
          </tr>
        </table>
        <table v-if="item.hasOwnProperty('cliente')">
          <tr>
            <td colspan="2">
              <p>
                <b>Proyecto: </b>{{ item.cliente.nombre_completo }} -
                {{ item.proyecto }}
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p><b>Fecha Instalación: </b>{{ item.instalacion_fecha }}</p>
            </td>
          </tr>
          <tr>
            <td><b>Quien asistira: </b></td>
          </tr>
        </table>
        <table v-if="item.hasOwnProperty('cliente')">
          <tr style="height: 30px">
            <td style="width: 7%"><b>Progreso:</b></td>
            <td
              class="progress-bar"
              :style="{
                'background-color': colorProgreso(item.progreso_total.total),
                width: item.progreso_total.total + '%',
                'min-width': '2em',
                'border-radius': '4px',
              }"
            >
              {{ item.progreso_total.total.toFixed(2) }}%
            </td>
          </tr>
        </table>
        <table v-if="!item.hasOwnProperty('cliente')">
          <tr>
            <td colspan="2">
              <p><b>Tarea: </b>{{ item.tarea }}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p><b>Descripción: </b>{{ item.descripcion }}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p><b>Día: </b>{{ item.dia }}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p><b>Dirección: </b>{{ item.direccion }}</p>
            </td>
          </tr>
          <tr>
            <td><b>Quien asistirá: </b></td>
          </tr>
        </table>
      </b-modal>
      <b-button
        style="display: none"
        :ref="'#proyectoFirstOpen-' + myIndex"
        :id="'#proyectoFirstOpen-' + myIndex"
        @click="$bvModal.show('#proyectoFirst-' + myIndex)"
        >modal</b-button
      >
    </div>
    <div
      class="modal fade"
      id="myModalHorizontal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <b-modal
        ref="myModalHorizontal"
        id="myModalHorizontal"
        title="Detalle"
        size="lg"
        hide-footer
      >
        <form class="form-horizontal" role="form" id="eventForm">
          <div class="form-group row">
            <label class="col-sm-2 control-label" for="tarea">Tarea</label>
            <div class="col-sm-10">
              <select class="form-control" id="tarea" v-model="tarea.tarea">
                <option value="visita">Visita Local</option>
                <option value="pago">Pago</option>
                <option value="medidas">Medidas</option>
                <option value="servicio">Servicio Técnico</option>
                <option value="nota">Nota</option>
                <option value="tarea">Tarea</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 control-label" for="desc">Descripción</label>
            <div class="col-sm-10">
              <textarea
                rows="4"
                class="form-control"
                id="desc"
                v-model="tarea.desc"
              ></textarea>
            </div>
          </div>

          <!--  area imagenes -->
          <div class="form-group row">
            <label class="col-sm-2 control-label" for="desc">Imágenes</label>
            <div class="col-sm-10">
              <div class="panel panel-default">
                <div class="panel-body">
                  <div class="upload-btn-wrapper">
                    <br />
                    <file-upload
                      style="width: 100%; background-color: #edeaea"
                      :post-action="postAction"
                      :extensions="extensions"
                      :accept="accept"
                      :multiple="true"
                      :directory="directory"
                      :create-directory="createDirectory"
                      :size="size || 0"
                      :thread="thread < 1 ? 1 : thread > 5 ? 5 : thread"
                      :headers="headers"
                      :data="data"
                      :drop="drop"
                      :drop-directory="dropDirectory"
                      :add-index="addIndex"
                      v-model="files"
                      @input-filter="inputFilter"
                      @input-file="inputFile"
                      ref="upload"
                    >
                      <button
                        class="btn btn-block btn-custom"
                        :disabled="cargandoEvento"
                      >
                        Cargar imágenes
                      </button>
                    </file-upload>
                  </div>

                  <div
                    class="flex-wrap"
                    :class="cargandoEvento ? 'cargandoFotoEvento' : ''"
                  >
                    <template
                      v-if="!cargandoEvento || currentEventImages.length > 0"
                    >
                      <div
                        class="relative"
                        v-for="(image, i) in currentEventImages"
                        :key="i"
                      >
                        <img
                          :src="currentEventImagePath + image.imagen"
                          @click="
                            visualizarImagen(
                              currentEventImagePath + image.fullimage
                            )
                          "
                          class="media-object mr-1"
                        />
                        <span
                          class="fa fa-close eliminar-imagen"
                          @click="eliminarFotoEvento(image.imagen)"
                          ><b>X</b></span
                        >
                      </div>
                    </template>
                    <div
                      class="relative"
                      v-for="(item, f) in files"
                      :key="'nf' + f"
                    >
                      <img
                        imgPreview
                        :src="item.thumb"
                        :title="item ? (item.file ? item.file.name : '') : ''"
                        width="100"
                        height="100"
                        class="media-object mr-1"
                      />
                      <span
                        class="fa fa-close eliminar-imagen"
                        @click.prevent="$refs.upload.remove(item)"
                        ><b>X</b></span
                      >
                    </div>
                  </div>
                  <template v-if="cargandoEvento">
                    <div class="flex-center">
                      <span class="fa fa-refresh fa-spin fa-2x"></span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 control-label" for="nombre">Nombre</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="nombre"
                v-model="tarea.nombre"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 control-label" for="telefono"
              >Teléfono</label
            >
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="telefono"
                v-model="tarea.telefono"
              />
            </div>
          </div>
         <!-- @keydown="$event.preventDefault()" -->
          <div class="form-group row">
            <label class="col-sm-2 control-label">Dirección</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                style="margin-bottom: 10px"
                placeholder="Tipee aquí la dirección"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="off"
                id="direccion"
                v-model="tarea.direccion"
              />
              <GmapMap
                :center="{ lat: latitud, lng: longitud }"
                :zoom="27"
                :latitude="latitud"
                :longitude="longitud"
                map-type-id="terrain"
                style="width: 100%; height: 300px"
                @click="placeMarker($event)"
                :usePanning="true"
                :clickableIcons="false"
              >
                <GmapMarker
                  :clickable="true"
                  :draggable="true"
                  :latitude="latitud"
                  :longitude="longitud"
                  :markerClickable="true"
                  :position="{ lat: latitud, lng: longitud }"
                  @click="placeMarker($event)"
                />
              </GmapMap>
              <button
                class="btn btn-outline-info mt-1 pull-right"
                @click="abrirGoogleMaps()"
                :disabled="!latitud || latitud.toString() == ''"
              >
                <span class="fa fa-map"></span> Abrir Google Maps
              </button>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 control-label" for="horario">Horario</label>
            <div class="col-sm-10">
              <input
                mask="Hh:m0"
                required
                placeholder="00:00"
                class="form-control"
                id="horario"
                v-model="tarea.horario"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 control-label" for="horario">Día</label>
            <div class="col-sm-10">
              <input
                type="text"
                mask="d0-M0-0000"
                class="form-control"
                id="dia"
                v-model="tarea.dia"
              />
            </div>
          </div>
          <template v-if="rol == 'Administrador'">
            <div class="form-group row">
              <label class="col-sm-2 control-label" for="horario"
                >Quien Asistirá</label
              >
              <div class="col-sm-10">
                <multiselect
                  placeholder="Seleccionar grupos"
                  label="nombre_grupo"
                  track-by="id"
                  v-model="gruposSeleccionados"
                  :options="grupos"
                  :multiple="true"
                >
                </multiselect>
              </div>
            </div>
          </template>
          <div class="form-group row">
            <div class="col-sm-10">
              <input
                type="hidden"
                class="form-control"
                id="eventId"
                v-model="tarea.eventId"
              />
            </div>
          </div>
        </form>
        <div
          class="modal-footer"
          style="display: flex; justify-content: flex-end"
        >
          <button
            type="submit"
            id="saveEvent"
            class="btn btn-success"
            :style="{ display: btMdHorizontal.save == true ? 'block' : 'none' }"
            @click="crearEvento()"
          >
            Guardar
          </button>
          <button
            type="submit"
            id="updateEvent"
            class="btn btn-info"
            :style="{
              display: btMdHorizontal.update == true ? 'block' : 'none',
            }"
            @click="actualizarEvento()"
          >
            Actualizar
          </button>
          <button
            type="submit"
            id="deleteEvent"
            class="btn btn-danger"
            :style="{
              display: btMdHorizontal.delete == true ? 'block' : 'none',
            }"
            @click="eliminarEvento()"
          >
            Eliminar
          </button>
        </div>
      </b-modal>
    </div>
<!--------------------- Diseño Proyecto ------------------------------------->
    <div
      class="modal fade"
      id="myModalDisenoProy"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <b-modal style="z-index:1;"
        ref="myModalDisenoProy"
        id="myModalDisenoProy"
        :title="descripItem == 'proyjsonmed'? 'Proyecto en Diseño - Medición':'Proyecto en Diseño - Instalación'"
        size="lg"
        hide-footer
      >
        <form class="form-horizontal" role="form" id="eventForm">
          <div class="form-group row">
            <label class="col-sm-3 control-label" for="nombre">Estado del Proyecto</label>
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="estado"
                v-model="proyectoDiseno.estado"
                readonly
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 control-label" for="nombre">Nombre del Proyecto</label>
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="estado"
                v-model="proyectoDiseno.nombre"
                readonly
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 control-label" for="nombre">Nombre y Apellido Cliente</label>
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="cliente"
                v-model="proyectoDiseno.cliente"
                readonly
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 control-label" for="desc">Dirección</label>
            <div class="col-sm-9">
              <textarea
                rows="3"
                class="form-control"
                id="direccion"
                v-model="proyectoDiseno.direccion"
                readonly
              ></textarea>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-3 control-label" for="telefono"
              >Teléfono</label
            >
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="telefono"
                v-model="proyectoDiseno.telefono"
                readonly
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 control-label" for="mueble"
              >Mueble</label
            >
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="telefono"
                v-model="proyectoDiseno.mueble"
                readonly
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 control-label" for="desc">Comentario General</label>
            <div class="col-sm-9">
              <textarea
                rows="3"
                class="form-control"
                id="comentario"
                v-model="proyectoDiseno.comentario"
                readonly
              ></textarea>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 control-label" for="horario">Horario</label>
            <div class="col-sm-9">
              <input
                mask="Hh:m0"
                required
                placeholder="00:00"
                class="form-control"
                id="horario"
                v-model="proyectoDiseno.horario"
                readonly
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 control-label" for="horario">Día</label>
            <div class="col-sm-9">
              <input
                type="text"
                mask="d0-M0-0000"
                class="form-control"
                id="dia"
                v-model="proyectoDiseno.dia"
                readonly
              />
            </div>
          </div>
          <div v-if="descripItem == 'proyjsonmed'" class="form-group row">
            <label class="col-sm-3 control-label" for="encargado">Encargado de la Medición</label>
            <div v-if="isEditEncargadoMed==false" class="col-sm-8">
              <input
                type="text"
                class="form-control"
                id="encargado"
                v-model="proyectoDiseno.encargado_med_name"
                readonly
              />
            </div>
            <div v-if="isEditEncargadoMed==true" class="col-sm-7">
                <select v-model="proyectoDiseno.encargado_med" class="form-control form-control-sm">
                    <option :value="u.id"  v-for="u in usuarios" v-bind:key="u.id">{{u.nombre_completo}}</option>
                </select>
            </div>
            <div v-if="isEditEncargadoMed==false" class="col-sm-1">
              <button class="btn btn-sm ml-btn-sm btn-warning" @click="editEncargadoMed()" title="Editar encargado">
                <b-icon font-scale="0.8" class="white" icon="pencil-fill"></b-icon>
              </button>
            </div>
            <div v-if="isEditEncargadoMed==true" class="col-sm-2">
              <button class="btn btn-sm ml-btn-sm btn-warning" @click="updateEncargadoMed(proyectoDiseno)" title="Guardar">
                 <b-icon icon="check" class="white"></b-icon>
              </button>
              <button class="btn btn-sm ml-btn-sm btn-danger" @click="cancelEncargado()" title="Cancelar">
                 <b-icon icon="X" class="white"></b-icon>
              </button>
            </div>
          </div>
          <div v-if="descripItem == 'proyjsoninst'" class="form-group row">
            <label class="col-sm-3 control-label" for="encargado">Encargado de la Instalación</label>
            <div v-if="isEditEncargadoInst==false" class="col-sm-8">
              <input
                type="text"
                class="form-control"
                id="encargado"
                v-model="proyectoDiseno.encargado_inst_name"
                readonly
              />
            </div>
            <div v-if="isEditEncargadoInst==true" class="col-sm-7">
                <select v-model="proyectoDiseno.encargado_inst" class="form-control form-control-sm">
                    <option :value="u.id"  v-for="u in usuarios" v-bind:key="u.id">{{u.nombre_completo}}</option>
                </select>
            </div>
            <div v-if="isEditEncargadoInst==false" class="col-sm-1">
              <button class="btn btn-sm ml-btn-sm btn-warning" @click="editEncargadoInst()" title="Editar encargado">
                <b-icon font-scale="0.8" class="white" icon="pencil-fill"></b-icon>
              </button>
            </div>
            <div v-if="isEditEncargadoInst==true" class="col-sm-2">
              <button class="btn btn-sm ml-btn-sm btn-warning" @click="updateEncargadoInst(proyectoDiseno)" title="Guardar">
                 <b-icon icon="check" class="white"></b-icon>
              </button>
              <button class="btn btn-sm ml-btn-sm btn-danger" @click="cancelEncargado()" title="Cancelar">
                 <b-icon icon="X" class="white"></b-icon>
              </button>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-12">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th colspan="7" style="text-align:center">Capacidad de Producción</th>
                </tr>
                <tr>
                  <td style="text-align:center">#</td>
                  <td style="text-align:center">Item</td>
                  <td style="text-align:center">Tiempo Diseño</td>
                  <td style="text-align:center">Tiempo Producción</td>
                  <td style="text-align:center">Tiempo Medición</td>
                  <td style="text-align:center">Tiempo Instalación</td>
                  <td style="text-align:center">Coeficiente Multiplicador</td>
                </tr>
              </thead>
              <tbody>
              <template v-if="capacidadProduccionProy.length > 0">
                  <tr v-for="(item, i) in capacidadProduccionProy" :key="i">
                    <td align="center">{{ i + 1 }}</td>
                    <td align="center">{{ item.item }}</td>
                    <td align="center">{{ item.tiempo_disenio }}</td>
                    <td align="center">{{ item.tiempo_produccion }}</td>
                    <td align="center">{{ item.tiempo_medicion }}</td>
                    <td align="center">{{ item.tiempo_instalacion }}</td>
                    <td align="center">{{ item.coeficiente_multiplicador }}</td>
                  </tr>
                </template>
                 <template v-else>
                  <tr>
                    <td class="text-center" colspan="12">
                      No hay ningún elemento.
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            </div>
          </div>
        </form>
        <div
          class="modal-footer"
          style="display: flex; justify-content: flex-end"
        >
          <button
                title="Ver imágenes"
                class="btn btn-primary"
                style="min-width: 50px"
                @click="viewGallery(proyectoDiseno.token_project)"
                :disabled="!images_project || loadingPage"
              >
                <b-icon icon="image"></b-icon>
          </button>
          <button class="btn btn-success" @click="goToDesignWithProjectId()">
            Acceder al proyecto
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="cerrarDiseno()"
          >
            Cerrar
          </button>
        </div>
        <gallery-modal style="z-index:2;"
        :token_project="this.galleryTokenProject"
        :images_project="this.images_project"
        v-if="showmodal"
        @toggle-modal="ToggleModal()">
        </gallery-modal>
      </b-modal>
    </div>

<!--------------------- Estadisticas Produccion/Diseño del Proyecto ---------------------------------------->
    <div
      class="modal fade"
      id="myModalProdDisProy"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <b-modal style="z-index:1;"
        ref="myModalProdDisProy"
        id="myModalProdDisProy"
        title="Producción / Diseño del Proyecto"
        hide-footer
      >
        <form class="form-horizontal" role="form" id="eventForm">
          <div class="form-group row">
            <div class="col-sm-12">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th colspan="5" style="text-align:center">Capacidad de Producción</th>
                </tr>
                <tr>
                  <td style="text-align:center">Tipo</td>
                  <td style="text-align:center">Proyecto</td>
                  <td style="text-align:center">Hs Proy.</td>
                  <td style="text-align:center">Hs Prog.</td>
                  <td style="text-align:center">%</td>
                </tr>
              </thead>
              <tbody>
                <template v-if="medicionInstalacionEst.length > 0">
                    <tr>
                      <td colspan="5" align="center"><b>Semana del {{ medicionInstalacionEst[0].fecha1 }} al {{ medicionInstalacionEst[0].fecha2 }}</b></td>
                    </tr>
                    <tr v-for="(item, i) in medicionInstalacionEst" :key="i">
                      <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.tipo }}</td>
                      <td align="center" v-else></td>
                      <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.proyecto }}</td>
                      <td align="center" v-else><b>{{ item.proyecto }}</b></td>
                      <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.tiempo }}</td>
                      <td align="center" v-else><b>{{ item.tiempo }}</b></td>
                      <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.tiempoW }}</td>
                      <td align="center" v-else><b>{{ item.tiempoW }}</b></td>
                      <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.porcentaje }}</td>
                      <td align="center" v-else><b>{{ item.porcentaje }}</b></td>
                    </tr>
                </template>
                <template v-else>
                  <tr>
                    <td class="text-center" colspan="5">
                      No hay ningún elemento.
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            </div>
          </div>
        </form>
        <div
          class="modal-footer"
          style="display: flex; justify-content: flex-end"
        >
          <button
            type="button"
            class="btn btn-primary"
            @click="cerrarProdDisProy()"
          >
            Cerrar
          </button>
        </div>
      </b-modal>
    </div>
<!--------------------- Estadisticas Medicion/Instalacion del Proyecto ------------------------------------->
    <div
      class="modal fade"
      id="myModalMedInstProy"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <b-modal style="z-index:1;"
        ref="myModalMedInstProy"
        id="myModalMedInstProy"
        :title="descripItem == 'medinstproymed'?  'Medición del Proyecto' : 'Instalación del Proyecto'"
        hide-footer
      >
        <form class="form-horizontal" role="form" id="eventForm">
          <div class="form-group row">
            <div class="col-sm-12">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th colspan="4" style="text-align:center">Capacidad de Producción</th>
                </tr>
                <tr>
                  <td style="text-align:center">Proyecto</td>
                  <td style="text-align:center">Hs Proy.</td>
                  <td style="text-align:center">Hs Prog.</td>
                  <td style="text-align:center">%</td>
                </tr>
              </thead>
              <tbody>
                <template v-if="medicionInstalacionEst.length > 0">
                  <tr>
                      <td colspan="4" align="center"><b>Fecha: {{ medicionInstalacionEst[0].fecha }}</b></td>
                  </tr>
                  <tr v-for="(item, i) in medicionInstalacionEst" :key="i">
                    <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.proyecto }}</td>
                    <td align="center" v-else><b>{{ item.proyecto }}</b></td>
                    <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.tiempo }}</td>
                    <td align="center" v-else><b>{{ item.tiempo }}</b></td>
                    <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.tiempoD }}</td>
                    <td align="center" v-else><b>{{ item.tiempoD }}</b></td>
                    <td align="center" v-if="item.proyecto !== 'TOTAL'">{{ item.porcentaje }}</td>
                    <td align="center" v-else><b>{{ item.porcentaje }}</b></td>
                  </tr>
                </template>
                 <template v-else>
                  <tr>
                    <td class="text-center" colspan="4">
                      No hay ningún elemento.
                    </td>
                  </tr>
                </template>

              </tbody>
            </table>
            </div>
          </div>
        </form>
        <div
          class="modal-footer"
          style="display: flex; justify-content: flex-end"
        >
          <button
            type="button"
            class="btn btn-primary"
            @click="cerrarMedInstProy()"
          >
            Cerrar
          </button>
        </div>
      </b-modal>
    </div>
    </div>
    <!-- Calendar Modal ------------------------------------------------------------------------>
    <b-modal ref="Calendarmodal" id="Calendarmodal" title="Detalle" :v-model="hideclose" :no-close-on-backdrop="isfromtaller" @hide="tonormal()" size="lg" hide-footer>
      <form class="form-horizontal">
        <div class="form-group row">
          <label class="col-sm-2" for="cliente">Cliente</label>
          <div class="col-sm-4" id="clientePlace">
            {{ dataModal.clientePlace }}
          </div>
          <label class="col-sm-2" for="cliente">Fecha</label>
          <div class="col-sm-4" id="datePlace">{{ dataModal.datePlace }}</div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2" for="cliente">Hora</label>
          <div class="col-sm-4" id="hourPlace">{{ dataModal.hourPlace }}</div>
          <label class="col-sm-2" for="cliente">Tipo de trabajo</label>
          <div class="col-sm-4" id="tipoTrabajo">
            {{ dataModal.tipoTrabajo }}
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2" for="cliente">Comentario</label>
          <div class="col-sm-4" id="comment">{{ dataModal.comment }}</div>
          <label class="col-sm-2" for="cliente">Teléfono</label>
          <div class="col-sm-4" id="phone">{{ dataModal.phone }}</div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2" for="cliente">Dirección</label>
          <div class="col-sm-4" id="address">{{ dataModal.address }}</div>
          <template v-if="modalDetalleSaldo">
            <label class="col-sm-2" for="saldo">Saldo pendiente</label>
            <div class="col-sm-4" id="saldo">
              ${{modalDetalleSaldo | number:''}}
            </div>
          </template>
        </div>
        <div class="form-group row">
            <template vl-if="rol==='Administrador'">
              <label class="col-sm-2" for="cliente">Quién asistirá</label>
              <div class="col-sm-4">
                <multiselect
                  placeholder="Seleccionar grupos"
                  label="nombre_grupo"
                  track-by="id"
                  v-model="gruposSeleccionados"
                  :options="grupos"
                  :multiple="true"
                >
                </multiselect>
                <br />
              </div>
            </template>
            <label class="col-sm-2" for="observaciones">Observaciones</label>
            <div class="col-sm-4">
              <textarea
                class="form-control"
                v-model="observacionesProyecto"
                :disabled="proyectoTerminado != 0"
                name="observaciones"
                placeholder="Si no finalizó la instalación describa aquí los pasos restantes."
                rows="3"
                required
              ></textarea>
            </div>
        </div>
      </form>
      <div class="row">
        <input
          type="hidden"
          class="form-control"
          id="proyectId"
          ref="proyectId"
        />
      </div>
      <hr />
      <div class="row text-center">
        <div class="col-sm-6 col-xs-6 mt-2">
          <button class="btn btn-info" @click="goToTallerWithProkectId()">
            Acceder al proyecto
          </button>
        </div>
        <div class="col-sm-6 col-xs-6 mt-2">
          <template>
            <button
              class="btn btn-success"
              :disabled="proyectoTerminado != 0"
              @click="actualizarProyecto()"
            >
              Guardar cambios
            </button>
          </template>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-6">
          <u><b>Total</b></u>
        </div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="totalPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.totalPorcejStylebackgroundColor,
              width: dataModal.totalPorcejStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.totalPorcej }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">Stock</div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="stockPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.stockPorcejStylebackgroundColor,
              width: dataModal.stockPorcejStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.stockPorcej }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">Piezas</div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="piezasPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.piezasPorcejStylebackgroundColor,
              width: dataModal.piezasPorcejStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.piezasPorcej }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">Tapacantos</div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="tapacantosPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.tapacantosPorcejStylebackgroundColor,
              width: dataModal.tapacantosPorcejStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.tapacantosPorcej }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">Prearmado</div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="prearmadoPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.prearmadoPorcejStylebackgroundColor,
              width: dataModal.prearmadoPorcejStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.prearmadoPorcej }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">Cajones</div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="cajonesPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.porcejCajonesStylebackgroundColor,
              width: dataModal.porcejCajonesStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.porcejCajones }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">Módulos</div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="modulosPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.modulosPorcejStylebackgroundColor,
              width: dataModal.modulosPorcejStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.modulosPorcej }}
          </div>
        </div>
      </div>
       <div class="row">
        <div class="col-6">Notas de Acción</div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="actionnotesPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.actionnotesPorcejStylebackgroundColor,
              width: dataModal.actionnotesPorcejStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.actionnotesPorcej }}
          </div>
        </div>
      </div>
      <div class="row" v-if="forzarControl==1 || dataModal.totalPorcej > 99">
        <div class="col-6">Control</div>
        <div class="progress col-6" style="width: 100%; padding: 0px">
          <div
            id="controlTallerPorcej"
            class="progress-bar"
            :style="{
              'min-width': '2em',
              backgroundColor: dataModal.controlTallerPorcejStylebackgroundColor,
              width: dataModal.controlTallerPorcejStyleWidth,
            }"
            role="progressbar"
          >
            {{ dataModal.controlTallerPorcej }}
          </div>
        </div>
      </div>
      <div class="form-group row">
            <div class="col-sm-12">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th colspan="7" style="text-align:center">Capacidad de Producción</th>
                </tr>
                <tr>
                  <td style="text-align:center">#</td>
                  <td style="text-align:center">Item</td>
                  <td style="text-align:center">Tiempo Diseño</td>
                  <td style="text-align:center">Tiempo Producción</td>
                  <td style="text-align:center">Tiempo Medición</td>
                  <td style="text-align:center">Tiempo Instalación</td>
                  <td style="text-align:center">Coeficiente Multiplicador</td>
                </tr>
              </thead>
              <tbody>
              <template v-if="capacidadProduccionProy.length > 0">
                  <tr v-for="(item, i) in capacidadProduccionProy" :key="i">
                    <td align="center">{{ i + 1 }}</td>
                    <td align="center">{{ item.item }}</td>
                    <td align="center">{{ item.tiempo_disenio }}</td>
                    <td align="center">{{ item.tiempo_produccion }}</td>
                    <td align="center">{{ item.tiempo_medicion }}</td>
                    <td align="center">{{ item.tiempo_instalacion }}</td>
                    <td align="center">{{ item.coeficiente_multiplicador }}</td>
                  </tr>
                </template>
                 <template v-else>
                  <tr>
                    <td class="text-center" colspan="12">
                      No hay ningún elemento.
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            </div>
          </div>
    </b-modal>
    <!-- Modal Notas  Update    --->
    <b-modal size="lg" ref="myModalNotaUpdate" id="myModalNotaUpdate" hide-footer title="Notas sobre ésta tarea">
      <div class="overflow-auto">
        <mc-wysiwyg  v-model="tareaCalendar.detalle_descripcion" :height="400"></mc-wysiwyg>
        <div class="read-me-footer">
          <button
            type="button"
            class="btn-sm btn btn-success"
            @click="guardarNotaUpdate()"
          >
            Guardar
          </button>
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            data-dismiss="modal"
           @click="closeNotaUpdate()"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>
    <!-- ------------Busqueda por Cliente ------------------------------->
    <b-modal
        size="lg"
        id="myModalCliente"
        ref="myModalCliente"
        hide-footer
        title="Listado de Clientes"
        >
        <div class="overflow-auto">
            <div class="row col">
              <div class="col input-group input-group-sm">
                  <input
                    v-model="nombreCliente"
                    type="text"
                    class="form-control"
                  />
              </div>
              <div class="col">
                  <b-button
                      size="sm"
                      class="btn btn-filter"
                      style="margin-right: 5px"
                      @click="loadClientes()"
                    >
                  Buscar...</b-button>
              </div>
            </div>
            <hr>
            <div class="container text-left" v-if="listadoClientes">
              <b-table
              striped
              hover
              :items="listadoClientes"
              :fields="['proyecto', 'nombre_completo']"
              :per-page="pagOptions.total"
              :current-page="pagOptions.active"
              >
                <template slot="cell(proyecto)" slot-scope="data">
                  <a href="#" @click="goToTallerWithProjectIdV2(data.item.proyecto_id)">{{
                  data.item.proyecto}}</a>
                </template>
                <template slot="cell(nombre_completo)" slot-scope="data">
                  {{ data.item.nombre_completo }}
                </template>
              </b-table>
            </div>
            <div class="mt-3">
            <b-pagination
                v-model="pagOptions.active"
                :total-rows="listadoClientes.length"
                :per-page="pagOptions.total"
                aria-controls="my-table"
                align="center"
            ></b-pagination>
            </div>
        </div>
    </b-modal>
    <!-- ---------------------------------------------------------------->
  </div>
</template>

<script>
import { HTTP } from "../../../index";
import grupoService from "./../Services/grupoService";
import tareaService from "./../Services/tareaService";
import proyectoService from "./../Services/proyectosService";
import feriadoService from "./../Services/feriadoService";
import moduloService from "./../Services/moduloService";
import ImageGallery from "./../image-gallery.vue";
import GalleryModal from './../galleryWithFolder';
import { McWysiwyg } from "@mycure/vue-wysiwyg";

// import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"

// import 'fullcalendar/dist/fullcalendar.css'

import { h } from "preact";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const VueUploadComponent = require("vue-upload-component");
Vue.component("file-upload", VueUploadComponent);

import VueToastr from "vue-toastr";
import * as VueGoogleMaps from "gmap-vue";
import Lightbox from "vue-easy-lightbox";
import Multiselect from "vue-multiselect";

import FileUpload from "vue-upload-component";
import swal from "sweetalert2";

const ModuloService = new moduloService();
// Init plugin

import Vue from "vue";

Vue.use(Lightbox);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDWPO4BYBh5HieRmN_radXJcNBZQL3tv_Q",
    libraries: "places",
    installComponents: true,
  },
});

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  addDays,
  subDays,
} from "vue-date-fns";
import { timeout } from "rxjs/operators";
//import { ProyectoService } from 'app/services/proyecto.service'
const GrupoService = new grupoService();
const TareaService = new tareaService();
const ProyectoService = new proyectoService();
const FeriadoService = new feriadoService();
export default {
  components: {
    FullCalendar,
    VueToastr,
    FileUpload,
    Multiselect,
    GalleryModal,
    ImageGallery,
    McWysiwyg,
  },
  data() {
    return {
      pagOptions: {
        total: 15,
        active: 1,
        sections: 0,
      },
      forzarControl: 0,
      controlTaller: 0,
      usuarios:[],
      listadoClientes:[],
      nombreCliente:"",
      isEditEncargadoMed: false,
      isEditEncargadoInst: false,
      loadingPage: true,
      loadingOff: 0,
      fechaMes: "",
      instalaciones: [],
      proyDisenos: [],
      disenoProyDetail: [],
      capacidadProduccionProy: [],
      medicionInstalacionEst:[],
      images_project: [],
      //file uploader options
      files: [],
      extensions: "jpg,jpeg,png",
      accept: "image/png,image/jpeg",
      minSize: 1024,
      size: 1024 * 1024 * 10,
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      createDirectory: false,
      addIndex: false,
      thread: 3,
      name: "file",
      postAction: `http://staging.mlplak.com/server/api/eventimage`,
      headers: {},
      data: {
        id: this.idEvento,
      },
      autoCompress: 1024 * 1024,
      uploadAuto: false,
      isOption: false,
      addData: {
        show: false,
        name: "",
        type: "",
        content: "",
      },
      editFile: {
        show: false,
        name: "",
      },
      idArchivo: 0,

      ////////////////////
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        headerToolbar: {
          left: "prev next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        views: {
          timeGridWeek: {
            type: "timeGridWeek",
            buttonText: "S",
          },
          dayGridMonth: {
            type: "dayGridMonth",
            buttonText: "M",
          },
          timeGridDay: {
            type: "timeGridDay",
            buttonText: "D",
          },
        },
        initialView: "dayGridMonth",
        // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        //firstDay: 0,
        //eventOrderStrict: true,
        height: "auto", //Mosca eliminar quizas
        eventOrder: "start,title",
        expandRows: true,
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        locale: esLocale,
        events: [],
        select: this.nuevoEvento,
        eventClick: this.detalleCalendario,
        datesSet: this.changeM,
        dayRender: function (date, cell) {
          var today = new Date();
          alert(date.format("DD"));
          if(date.format("DD") == today.getDate()){
            cell.css("background-color", "red");
          }
        },
        viewRender : function (view, element) { alert("View: ",view.start); console.log('new date range start : ', view.start, 'new date range end : ',view.end); },
        eventContent: function (eventInfo) {
          return { html: eventInfo.event.extendedProps.customHtml };
        },
        // eventsSet: this.handleEvents
        /* you can update a remote database when these fire:
              eventAdd:
              eventChange:
              eventRemove:
              */
      },
      fechaC: null,
      refresh: "",
      view: "month",
      tarea: {},
      viewDate: new Date(),
      locale: "es",
      events: [],
      eventsAux: [],
      proyectos: [],
      clients: [],
      sheets: [],
      sheetId: 0,
      logged: false,
      items: [],
      // users;
      itemsToShowFirst: [],
      itemsToShowFirstFinal: [],
      isFirst: true,
      myCarrouselPositionFirst: 0,
      // server: environment.API_URL;
      fileToUpload: null,
      // form: FormGroup;
      error: "",
      userId: 166,
      uploadResponse: { status: "", message: "", filePath: "" },
      currentEventImages: [],
      currentEventImagePath: "",
      rol: "",
      modalDetalleSaldo: "",

      tareaPersonal: {
        realizado: false,
        descripcion: "",
        usuario_id: null,
        grupo_id: null,
      },

      tareaCalendar: {
        id: null,
        detalle_descripcion: "",
      },

      proyectoDiseno: {
        id: 0,
        estado: "",
        nombre: "",
        cliente: "",
        direccion: "",
        telefono: "",
        mueble: "",
        comentario: "",
        horario: "",
        dia: "",
        encargado_inst: "",
        encargado_med: "",
        encargado_inst_name: "",
        encargado_med_name: "",
        token_project:""
      },
      pDiseno: {},
      tipoItem: "",
      descripItem: "",
      weekStartsOn: 1, //number = DAYS_OF_WEEK.MONDAY;

      gruposSeleccionados: [],
      observacionesProyecto: "",
      eventoSeleccionado: "",
      grupos: [],
      tareas: [],
      cargandoCalendario: false,
      proyectoTerminado: false,
      filtroGrupo: 0,
      idTraidoTaller: null,

      uploader: "",

      latitud: 0,
      longitud: 0,
      direccion: "",
      geoCoder: "",

      searchElementRef: "",

      idEvento: "",
      cargandoEvento: false,
      circleRadius: 5000,
      // proyectoService: '',
      ref: "",
      router: "",
      formBuilder: "",

      showDate: new Date(),
      myItems: [],
      lTareas: [],
      lAgenda: [],
      isShow: false,
      title: "",
      titulo: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_fin: "",
      tipo: 0,
      botonModal: "",
      evento_id: 0,
      cKey: 0,
      itemsTest: [],
      dataUsers: [],
      dataEvents: [],
      dataModal: { clientePlace: "" },
      multiple: "true",
      tarea: {
        tarea: "",
        desc: "",
        nombre: "",
        telefono: "",
        direccion: "",
        horario: "",
        dia: "",
        eventId: 0,
      },
      dateStart: new Date(),
      btMdHorizontal: {
        update: false,
        save: false,
        delete: false,
      },
      imgs: "",
      visible: false,
      index: 0,
      mesActual: "",
      canCancel: true,
      useSlot: false,
      loader: "spinner",
      color: "#007bff",
      bgColor: "#ffffff",
      height: 128,
      width: 128,
      timeout: 3000, //ms
      showmodal:false,
      galleryTokenProject: "",
      metadata_proyecto:null,
      token_proyect:null,
      isfromtaller:false,
      option:"",
      hideclose:""

    };
  },
  mounted() {
    if (localStorage.getItem("forzar-control") !== null) {
      this.forzarControl = localStorage.getItem("forzar-control")
    }
    this.listadoClientes = [];
    this.getUsuarios();
    let that = this;
    this.fechaC = new Date();
    document
      .getElementsByClassName("fc-prev-button")[0]
      .addEventListener("click", function () {
        let calendarApi = that.$refs.fullCalendar.getApi();
        let date = that.$moment(calendarApi.getDate()).format("YYYY-MM-DD");
        this.fechaC = date;
        let tmp = date.substr(0, 4) + "-" + date.substr(5, 2) + "-15";
        that.setShowDate(tmp);
      });
    document
      .getElementsByClassName("fc-next-button")[0]
      .addEventListener("click", function () {
        let calendarApi = that.$refs.fullCalendar.getApi();
        let date = that.$moment(calendarApi.getDate()).format("YYYY-MM-DD");
        this.fechaC = date;
        let tmp = date.substr(0, 4) + "-" + date.substr(5, 2) + "-15";
        that.setShowDate(tmp);
      });
    document
      .getElementsByClassName("fc-today-button")[0]
      .addEventListener("click", function () {
        let calendarApi = that.$refs.fullCalendar.getApi();
        let date = that.$moment(calendarApi.getDate()).format("YYYY-MM-DD");
        this.fechaC = date;
        let tmp = date.substr(0, 4) + "-" + date.substr(5, 2) + "-15";
        that.setShowDate(tmp);
      });
    let date = that.$moment();
    that.changeMonth(date);
    this.uploader = {
      url: `${this.server}/eventimage`,
      autoUpload: false,
      allowedMimeType: ["image/png", "image/jpeg"],
    };

    if (this.$route.params.id) {
      this.idTraidoTaller = this.$route.params.id;
      const inst_fecha = this.$moment(this.$route.params.instfecha).format(
                  "YYYY-MM-DD"
                )
      let targedate = new Date(inst_fecha)
      this.isfromtaller=true;
      this.hideclose="hide-header-close"
       let calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.gotoDate(targedate);
      this.setShowDate(targedate)
    }

    this.rol = JSON.parse(localStorage.getItem("usuario")).rol;
    this.fetchEvents();
    let calendarEl = document.getElementById("calendar");
    console.log("calendar!!!!!!!!!!!!!!!!", calendarEl);
  },

  methods: {
    async getControl(proyectoId) {
      let data = await ModuloService.getControlByProy(proyectoId);
      if (data ==undefined || data ==null) {
        this.controlTaller = 0.00
        return
      }
      if (data) {
        if (data.control != null) {
          this.controlTaller = parseFloat(data.control).toFixed(2)
        }
      }
    },

    loadClientes() {
       HTTP.get("/api/clientes/listadoProy/" + this.nombreCliente)
        .then((result) => {
          if (result.data != null) {
            this.listadoClientes = result.data.clientes;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    abrirBusquedaCliente() {
      this.nombreCliente = "";
      this.listadoClientes = [];
      this.$bvModal.show("myModalCliente");
    },

    cerrarBusquedaCliente() {
      this.$bvModal.hide("myModalCliente");
    },

    guardarNotaUpdate() {
      let result = HTTP.put("/api/tareas/nota/" + this.tareaCalendar.id, this.tareaCalendar);
      if (result) {
        this.$refs.toastr.s("Nota actualizada.");
        this.fetchEvents();
        this.closeNotaUpdate();
      }
      else
      {
        this.$refs.toastr.e("ERROR: Verifique los datos por favor.");
      }
    },
    closeNotaUpdate() {
      this.tareaCalendar.id = 0
      this.tareaCalendar.detalle_descripcion = ""
      this.$refs.myModalNotaUpdate.hide();
    },
    async loadProyDisenoEncargado()
    {
        this.pDiseno = await HTTP.get(`/api/proyecto-json/showdetail/${this.proyectoDiseno.token_project}`);
        this.pDiseno = this.pDiseno.data.proyecto;
        if  (this.pDiseno !== null) {
          this.proyectoDiseno.encargado_inst = this.pDiseno.encargado_inst;
          this.proyectoDiseno.encargado_inst_name = this.pDiseno.encargado_inst_name;
          this.proyectoDiseno.encargado_med = this.pDiseno.encargado_med;
          this.proyectoDiseno.encargado_med_name = this.pDiseno.encargado_med_name;
        }
    },
    editEncargadoMed()
    {
      this.isEditEncargadoMed = true
    },
    editEncargadoInst()
    {
      this.isEditEncargadoInst = true
    },
    updateEncargadoMed(diseno)
    {
      HTTP.put(`/api/proyecto-json/encargadomed`, {
		      id: diseno.id,
          encargado_med: diseno.encargado_med
        })
        .then((result) => {
               this.$refs.toastr.s("¡Proyecto actualizado con éxito!");
               this.loadProyDisenoEncargado();
               this.fetchEvents();
        })
        .catch((result) => {
            this.$refs.toastr.e("Ups, ha ocurrido un problema");
        });
      this.isEditEncargadoMed = false
    },
    updateEncargadoInst(diseno)
    {
      HTTP.put(`/api/proyecto-json/encargadoinst`, {
		      id: diseno.id,
          encargado_inst: diseno.encargado_inst
        })
        .then((result) => {
               this.$refs.toastr.s("¡Proyecto actualizado con éxito!");
               this.loadProyDisenoEncargado();
               this.fetchEvents();
        })
        .catch((result) => {
            this.$refs.toastr.e("Ups, ha ocurrido un problema");
        })
      this.isEditEncargadoInst = false
    },
    cancelEncargado()
    {
      this.isEditEncargadoMed = false
      this.isEditEncargadoInst = false
    },
    getUsuarios() {
      //this.loadingPage = true;
      HTTP.get("/api/usuario/listActiveUsers")
        .then((result) => {
          if ((result.data) && (result.data.usuarios)) {
            this.usuarios = result.data.usuarios;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeM(info) {
      let calendarApi = this.$refs.fullCalendar.getApi();
      let date = this.$moment(calendarApi.getDate()).format("YYYY-MM-DD");
     // this.changeMonth(date);
    },
    changeMonth(date) {
      date = this.$moment(date).format("YYYY-MM");

    },
    tonormal(){
      this.isfromtaller=false
    },
    oncancel() {},
    async viewGallery(token_project) {
      console.log("Cargando Imagenes del proyecto: ", token_project);
      this.$refs.toastr.s("Cargando imágenes. Espere por favor...");
      this.galleryTokenProject = token_project;
      this.images_project = [];
      try {
          let resImg = await ProyectoService.getImagesProject(token_project,'General');
          if (resImg != undefined)
              this.images_project = await resImg.response.imagenes;
      } catch (error) {
          console.log("Error Cargando Imagenes del proyecto: ", error);
      }
      this.showmodal = !this.showmodal
    },
    ToggleModal(){
       this.galleryTokenProject = ""
       this.showmodal = !this.showmodal
    },
    async eliminarEvento() {
      let id = document.getElementById("eventForm")["eventId"].value;
      console.log("eliminar evento", id);
      let res = await HTTP.delete(`/api/event/` + id);
      if (res) {
        this.$refs.toastr.s("Evento eliminado");
        this.$bvModal.hide("myModalHorizontal");
        this.fetchEvents();
        console.log("this.dataUsers------------>", this.dataUsers);
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
        // Automatic compression
        if (
          newFile.file &&
          newFile.type.substr(0, 6) === "image/" &&
          this.autoCompress > 0 &&
          this.autoCompress < newFile.size
        ) {
          newFile.error = "compressing";
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512,
          });
          imageCompressor
            .compress(newFile.file)
            .then((file) => {
              this.$refs.upload.update(newFile, {
                error: "",
                file,
                size: file.size,
                type: file.type,
              });
            })
            .catch((err) => {
              this.$refs.upload.update(newFile, {
                error: err.message || "compress",
              });
            });
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
        }
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
            this.$refs.upload.update(newFile, { error: "size" });
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
        }
        if (newFile.error && !oldFile.error) {
          // error
        }
        if (newFile.success && !oldFile.success) {
          // success
        }
      }
      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }
      // Automatically activate upload
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
    },
    alert(message) {
      alert(message);
    },
    onEditFileShow(file) {
      this.editFile = { ...file, show: true };
      this.$refs.upload.update(file, { error: "edit" });
    },
    onEditorFile() {
      if (!this.$refs.upload.features.html5) {
        this.alert("Your browser does not support");
        this.editFile.show = false;
        return;
      }
      let data = {
        name: this.editFile.name,
      };
      if (this.editFile.cropper) {
        let binStr = atob(
          this.editFile.cropper
            .getCroppedCanvas()
            .toDataURL(this.editFile.type)
            .split(",")[1]
        );
        let arr = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        data.file = new File([arr], data.name, { type: this.editFile.type });
        data.size = data.file.size;
      }
      this.$refs.upload.update(this.editFile.id, data);
      this.editFile.error = "";
      this.editFile.show = false;
    },
    // add folder
    onAddFolder() {
      if (!this.$refs.upload.features.directory) {
        this.alert("Your browser does not support");
        return;
      }
      let input = document.createElement("input");
      input.style =
        "background: rgba(255, 255, 255, 0);overflow: hidden;position: fixed;width: 1px;height: 1px;z-index: -1;opacity: 0;";
      input.type = "file";
      input.setAttribute("allowdirs", true);
      input.setAttribute("directory", true);
      input.setAttribute("webkitdirectory", true);
      input.multiple = true;
      document.querySelector("body").appendChild(input);
      input.click();
      input.onchange = (e) => {
        this.$refs.upload.addInputFile(input).then(function () {
          document.querySelector("body").removeChild(input);
        });
      };
    },
    onAddData() {
      this.addData.show = false;
      if (!this.$refs.upload.features.html5) {
        this.alert("Your browser does not support");
        return;
      }
      let file = new window.File([this.addData.content], this.addData.name, {
        type: this.addData.type,
      });
      this.$refs.upload.add(file);
    },

    ////////////////////////////
    async crearEvento() {
      let that = this;
      let form = document.getElementById("eventForm");
      console.log(form);
      let day = form["dia"].value.substring(0, 2);

      let month = form["dia"].value.substring(3, 5);
      let year = form["dia"].value.substring(6);
      let gruposTmp = [];
      for await (let item of this.gruposSeleccionados) {
        gruposTmp.push(item.id);
      }

      let assistants = gruposTmp.toString();

      let obj = {
        tarea: this.tarea.tarea,
        descripcion: this.tarea.desc,
        nombre: this.tarea.nombre,
        telefono: this.tarea.telefono,
        direccion: this.tarea.direccion === "" ? "." : this.tarea.direccion,
        hora_inicio: this.tarea.horario,
        dia: this.$moment(year + "-" + month + "-" + day).format("YYYY-MM-DD"),
        grupos: assistants,
        latitud: this.latitud,
        longitud: this.longitud,
      };

      if (
        obj.tarea == "" ||
        obj.descripcion == "" ||
        obj.nombre == "" ||
        obj.telefono == "" ||
        obj.hora_inicio == "" ||
        obj.direccion == "" ||
        obj.dia == ""
      ) {
        console.log(obj);
        that.$refs.toastr.i("Faltan completar datos");
      } else {
        console.log(obj);
        let dataRes = await HTTP.post(`/api/event`, obj);
        if (dataRes) {
          let res = dataRes.data;
          //that.cargandoEvento = true;
          // $.ajax({
          //     url: `${environment.API_URL}/event`,
          //     type: "POST",
          //     data: obj
          // }).done(function (response) {

          that.$refs.toastr.s("Evento creado");
          // let hora = this.$moment(obj.dia).add("00", 'seconds')
          //     .add("00", 'minutes')
          //     .add("00", "hours").toString();
          let hora = this.$moment(obj.dia).format("YYYY-MM-DD hh:mm:ss");
          res.dia = hora;
          console.log("seguimiento...............", res);
          console.log("seguimiento...............", hora);
          this.fetchEvents();

          if (that.files.length > 0) {
            let idEvento = res.id;
            for await (let item of that.files) {
              item.data.id = idEvento;
              that.postAction = `http://staging.mlplak.com/server/api/eventimage`;
              that.$refs.upload.active = true;
              let result = await that.$refs.upload.update(item, {
                active: true,
              });
              console.log("item---->", item);
              that.archivo++;
            }
            setTimeout(async () => {
              for await (let element of that.$refs.upload.files) {
                console.log(element.name, " ", element.success);
                that.$refs.toastr.s(`${element.name} subido correctamente`);
              }
              this.files = [];
            }, 2000);
          }
          this.$bvModal.hide("myModalHorizontal");
        }
      }
    },
    handleEventClick(clickInfo) {
      console.log(clickInfo);
    },
    monthSelect($event) {
      let calendarApi = this.$refs.fullCalendar.getApi();
      let date = this.$moment(calendarApi.getDate()).format('YYYY-MM-DD');
      let tmp =
        $event.target.value.substr(0, 4) +
        "-" +
        $event.target.value.substr(5, 2) +
        "-15";
      console.log(tmp);
      let d = new Date(tmp);

      calendarApi.gotoDate(d);
      this.setShowDate(d);
    },
    async cargarImagenesEvento(id) {
      this.cargandoEvento = true;
      let dataImagenes = await HTTP.get(`/api/eventimage/thumbs/${id}`);
      dataImagenes = dataImagenes.data;
      console.log("imagenes!!!!!!!!!!", dataImagenes);
      if (dataImagenes) {
        this.currentEventImagePath = dataImagenes.path + "/";
        console.log("currentEventImagePath--", this.currentEventImagePath);
        this.currentEventImages = [];
        dataImagenes.imagenes.forEach((item, index) => {
          this.currentEventImages.push(item);
        });
        this.cargandoEvento = false;
      }
    },
    async actualizarEvento() {
      let that = this;
      let form = document.getElementById("eventForm");
      let day = this.tarea.dia.substring(0, 2);
      let month = this.tarea.dia.substring(3, 5);
      let year = this.tarea.dia.substring(6);
      let gruposTmp = [];
      for await (let item of this.gruposSeleccionados) {
        gruposTmp.push(item.id);
      }

      let obj = {
        tarea: this.tarea.tarea,
        descripcion: this.tarea.desc,
        nombre: this.tarea.nombre,
        telefono: this.tarea.telefono,
        direccion: this.tarea.direccion,
        hora_inicio: this.tarea.horario,
        dia: this.$moment(year + "-" + month + "-" + day).format("YYYY-MM-DD"),
        grupos: gruposTmp.toString(),
        assistants: null,
        latitud: this.latitud,
        longitud: this.longitud,
      };

      if (
        obj.tarea == "" ||
        obj.descripcion == "" ||
        obj.nombre == "" ||
        obj.telefono == "" ||
        obj.hora_inicio == "" ||
        obj.direccion == "" ||
        obj.dia == ""
      )
        this._toastr.info("Faltan completar datos");
      else {
        let dataRes = await HTTP.patch(
          `/api/event/` + form["eventId"].value,
          obj
        );
        if (dataRes) {
          if (that.files.length > 0) {
            //that.cargandoEvento = true;
            that.idEvento = form["eventId"].value;
            that.idArchivo = 0;
            for await (let item of that.files) {
              // that.files.forEach(item => {
              item.data.id = that.idEvento;
              that.postAction = `http://staging.mlplak.com/server/api/eventimage`;
              that.$refs.upload.active = true;
              let result = await that.$refs.upload.update(item, {
                active: true,
              });
              console.log("item---->", item);
              that.archivo++;
            }
            setTimeout(async () => {
              for await (let element of that.$refs.upload.files) {
                console.log(element.name, " ", element.success);
                that.$refs.toastr.s(`${element.name} subido correctamente`);
              }
              this.$bvModal.hide("myModalHorizontal");
              this.files = [];
            }, 2000);
          } else {
            // let evento = that.events.filter(x => x.meta.id == form["eventId"].value && x.meta.hasOwnProperty('tarea'));
            let evento = that.dataEvents.filter(
              (x) => x.id == form["eventId"].value
            );
            let idt = that.dataEvents.findIndex(
              (x) => (x.id = form["eventId"].value)
            );
            // console.log('index', indiceDataevents)
            console.log("evento else--------------->", evento);
            console.log(obj);
            this.dataEvents[idt].id = form["eventId"].value;
            this.dataEvents[idt].tarea = obj.tarea;
            this.dataEvents[idt].descripcion = obj.descripcion;
            this.dataEvents[idt].nombre = obj.nombre;
            this.dataEvents[idt].telefono = obj.telefono;
            this.dataEvents[idt].direccion = obj.direccion;
            this.dataEvents[idt].hora_inicio = obj.hora_inicio;
            this.dataEvents[idt].dia = obj.dia;
            this.dataEvents[idt].assistants = obj.assistants;
            this.dataEvents[idt].grupos = gruposTmp;
            this.$bvModal.hide("myModalHorizontal");

            // $('#myModalHorizontal').modal('hide');
          }
        }
      }
      //  this.traerCalendario();
    },
    async actualizarProyecto() {
      let that = this;
      let grupos = []; //(this.gruposSeleccionados == null) ? null : this.gruposSeleccionados.toString();
      //
      if (this.gruposSeleccionados === null) {
        grupos = null;
      } else {
        for await (let item of this.gruposSeleccionados) {
          grupos.push(item.id);
        }
      }
      grupos = grupos.toString();
      let obj = {
        grupos,
        observaciones: this.observacionesProyecto,
      };
      console.log(obj);
      let theId = this.dataModal["projectId"]; //that.proyectId// (document.getElementById("proyectId"));
      console.log(theId);
      let result = await HTTP.patch(`/api/proyectos/` + theId, obj);
      if (result) {
        that.gruposSeleccionados = "";

        console.log(result);
        let res = result.data;
        res.grupos = grupos.split(",").map(Number);
        console.log(res);
        that.eventoSeleccionado = res;
        let indiceProyecto = this.dataUsers.findIndex((x) => x.id === theId);
        this.dataUsers[indiceProyecto].grupos = res.grupos;
        this.dataUsers[indiceProyecto].observaciones = res.observaciones;
        //that.refresh.next();
        //});
      }
      //$('#Calendarmodal').modal('hide');
      this.$bvModal.hide("Calendarmodal");

      //  this.getevents();
      //this.getevents();
    },

    goToDesignWithProjectId() {
      //alert(this.pDiseno.id);
     /* this.$bvModal.hide("myModalDisenoProy");
      //--------------------------------------
      const oldVuew = localStorage.vuex;
      localStorage.vuex = {};
      //alert(this.pDiseno.id);
      HTTP.get(`/api/proyecto-json/${this.pDiseno.id}`)
        .then((response) => {
          if (response.data.proyecto) {
            swal({
                title: '¿Desea cargar este proyecto?',
                text: 'Se perderán los cambios no guardados',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
              }).then((result) => {
                console.log(result)
                if (result.value == true) {
                    localStorage.vuex = JSON.parse(response.data.proyecto.proyecto);
                    localStorage.setItem("projectName", response.data.proyecto.nombre);
                    localStorage.setItem("projectID", response.data.proyecto.id);
                    localStorage.setItem("projectCreatedAt",response.data.proyecto.created_at);
                    this.$store.state.info.token_project = response.data.proyecto.token_project;
                    this.$store.state.info.mueble = response.data.proyecto.mueble;
                    this.$store.state.info.name = response.data.proyecto.client_name;
                    this.$store.state.info.address = response.data.proyecto.address;
                    this.$store.state.info.phone = response.data.proyecto.phone;
                    this.$store.state.info.comentarioInstalacion = response.data.proyecto.comentario;
                    this.$store.state.info.estadoProyecto = response.data.proyecto.estado;
                    this.$router.push("/design-dashboard");
                    //this.$router.push({ name: "DesignDashboard", params: { link: id  } });
                    //location.reload();
                }
              });
          }
        })
        .catch((response) => {
          alert("No se pudo cargar el proyecto");
          localStorage.vuew = oldVuew;
        });
      //--------------------------------------*/

      /**
       * Nueva programacion solicitada por mariano
       *
       */

        this.redirectoken = this.$store.getters.tokenize(this.pDiseno.id)
        this.$router.push({ name: "DesignDashboard", params: { link: this.redirectoken  } });

    },
    goToTallerWithProkectId() {
      //let projectId = this.dataModal.projectId //this.$refs.proyectId.value // document.getElementById("proyectId").value;
      //console.log('pjt',this.dataModal.projectId)

      localStorage.setItem("currentProject", this.dataModal.projectId);

      this.$bvModal.hide("Calendarmodal");

       //$("#Calendarmodal").modal("hide");

      //this.router.navigateByUrl('/taller');
      this.$router.push("/taller");

       //nueva Modificacion solicitada por Mariano

       //this.redirectoken = this.$store.getters.tokenize(this.dataModal.projectId)
      //this.$router.push({ name: "DesignDashboard", params: { link: this.redirectoken  } });
    },
    goToTallerWithProjectIdV2(idProyecto){
      localStorage.setItem("currentProject", idProyecto);
      this.$bvModal.hide("myModalCliente");
      this.$router.push("/taller");
    },
    placeMarker($event) {
      console.log("placemarker", $event);
      let coords = JSON.parse(JSON.stringify($event.latLng.toJSON(), null, 2));

      console.log("placemarker", coords.lat);

      this.latitud = coords.lat;
      this.longitud = coords.lng;
      this.obtenerDireccion(coords.lat, coords.lng);
      this.verificarDireccion(coords.lat, coords.lng);
    },
    verificarDireccion(latitud, longitud) {
      let geoCoder = new google.maps.Geocoder();
      if (geoCoder) {
        geoCoder.geocode(
          { location: { lat: latitud, lng: longitud } },
          (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                let form = document.getElementById("eventForm");
                form["direccion"].value = results[0].formatted_address;
              }
            }
          }
        );
      }
    },
    obtenerDireccion(latitud, longitud) {
      let geoCoder = new google.maps.Geocoder();
      if (geoCoder) {
        geoCoder.geocode(
          { location: { lat: latitud, lng: longitud } },
          (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                this.direccion = results[0].formatted_address;
              }
            }
          }
        );
      }
    },
    parseCajaInfo(response) {
      //console.log('la respuesta', response.data)
      const cajaInfoMeta = response.data.metadata.find((m) => m.key === "caja") || {
        value: 0,
      };
      return cajaInfoMeta.value;
    },
    cerrarDiseno() {
      this.$bvModal.hide("myModalDisenoProy");
    },
    cerrarMedInstProy() {
      this.$bvModal.hide("myModalMedInstProy");
    },
    cerrarProdDisProy() {
      this.$bvModal.hide("myModalProdDisProy");
    },
    async detalleCalendario(item) {
      //alert(item.event.id.toString());
      console.log(item)
      this.tipoItem='';
      this.descripItem="";
      let proyToken="";
      if(!this.isfromtaller){
        item = item.event;
      }
      //alert(item.id.toString());
      this.btMdHorizontal.update = false;
      this.btMdHorizontal.save = true;
      this.btMdHorizontal.delete = false;

      console.log("Item_id: ",item.id);
      this.modalDetalleSaldo = null;
      let detalle = {};

      if (item.id.toString().includes("tarea")) {
        this.tipoItem="tarea";
        let id = item.id.substr(6, item.id.length + 1);
        for await (let itemTmp of this.dataEvents) {
          if (itemTmp.id == id) {
            detalle = itemTmp;
          }
        }
      }

      if (item.id.toString().includes("proyjson")) {
        this.tipoItem="proyectojson";
        if (item.id.toString().includes("proyjsonmed")) {
           this.descripItem = item.id.substr(0, 11);
           proyToken = item.id.substr(12, item.id.length - 21);
        }
        else {
           this.descripItem = item.id.substr(0, 12);
           proyToken = item.id.substr(13, item.id.length - 22);
        }
      }

      if (item.id.toString().includes("medinstproy"))
        this.tipoItem="medinstproy";

      if (item.id.toString().includes("proddisproy"))
        this.tipoItem="proddisproy";

      if (item.id.toString().includes("taskcalendar"))
          this.tipoItem="taskcalendar";

      if ((item.id.toString().includes("proyjson") === false) && (item.id.toString().includes("tarea") ===false) && (item.id.toString().includes("medinstproy") === false) && (item.id.toString().includes("proddisproy") === false) && (this.tipoItem !=="taskcalendar"))
      {
        this.tipoItem="proyecto";
        for await (let itemTmp of this.dataUsers) {
          if (itemTmp.id == item.id) {
            detalle = itemTmp;
          }
        }
        //alert("Id: " + item.id)
        this.getControl(item.id)
        this.modalDetalleSaldo = this.parseCajaInfo(await ProyectoService.getProyectoMetadata(detalle.id)).saldo;
        this.capacidadProduccionProy=[];
        HTTP.get("/api/capacidad_produccion/proyecto/" + item.id)
          .then((result) => {
            if (result.data != null) {
              this.capacidadProduccionProy = result.data.data;
            }
        })
        .catch((error) => {
          console.log(error);
        });

      }

      if ((this.tipoItem!=="proyectojson") && (this.tipoItem!=="medinstproy") && (this.tipoItem!=="proddisproy") && (this.tipoItem!=="taskcalendar")) {
        this.gruposSeleccionados = [];
        this.proyectoTerminado = detalle.finalizado;

        if (detalle.grupos === null) {
          this.gruposSeleccionados = [];
        } else {
          for await (let item2 of detalle.grupos) {
            for await (let it of this.grupos) {
              if (it.id === item2) this.gruposSeleccionados.push(it);
            }
          }
        }
      }

      if (this.tipoItem==="taskcalendar") {
        this.tareaCalendar.id =  item.id.substr(12,item.id.length-12);
        //alert(this.tareaCalendar.id);
        this.tareaCalendar.detalle_descripcion = "";
        let tareaC = null;
        HTTP.get("/api/tareas/show/" + this.tareaCalendar.id)
          .then((result) => {
            if (result.data != null) {
              tareaC = result.data.data;
              this.tareaCalendar.detalle_descripcion = tareaC.detalle_descripcion;
              this.$bvModal.show("myModalNotaUpdate");
            }
        })
        .catch((error) => {
          console.log(error);
        });
      }

      if (this.tipoItem==="proyectojson") {
        this.capacidadProduccionProy=[];
        HTTP.get("/api/capacidad_produccion/proyectojson/" + proyToken)
          .then((result) => {
            if (result.data != null) {
              this.capacidadProduccionProy = result.data.data;
            }
        })
        .catch((error) => {
          console.log(error);
        });

        this.proyectoDiseno.id = 0;
        this.proyectoDiseno.estado = "";
        this.proyectoDiseno.nombre = "";
        this.proyectoDiseno.cliente = "";
        this.proyectoDiseno.direccion = "";
        this.proyectoDiseno.telefono = "";
        this.proyectoDiseno.mueble = "";
        this.proyectoDiseno.comentario = "";
        this.proyectoDiseno.horario = "";
        this.proyectoDiseno.dia = "";
        this.proyectoDiseno.encargado_inst = "";
        this.proyectoDiseno.encargado_inst_name = "";
        this.proyectoDiseno.encargado_med = "";
        this.proyectoDiseno.encargado_med_name = "";
        this.proyectoDiseno.token_project = "";
        this.pDiseno = await HTTP.get(`/api/proyecto-json/showdetail/${proyToken}`);
        this.pDiseno = this.pDiseno.data.proyecto;
        if  (this.pDiseno !== null) {
          this.proyectoDiseno.id = this.pDiseno.id;
          this.proyectoDiseno.nombre = this.pDiseno.nombre;
          this.proyectoDiseno.mueble = this.pDiseno.mueble;
          this.proyectoDiseno.cliente = this.pDiseno.client_name;
          this.proyectoDiseno.direccion = this.pDiseno.address;
          this.proyectoDiseno.telefono = this.pDiseno.phone;
          this.proyectoDiseno.comentario = this.pDiseno.comentario;
          this.proyectoDiseno.estado = this.pDiseno.estado;
          this.proyectoDiseno.encargado_inst = this.pDiseno.encargado_inst;
          this.proyectoDiseno.encargado_inst_name = this.pDiseno.encargado_inst_name;
          this.proyectoDiseno.encargado_med = this.pDiseno.encargado_med;
          this.proyectoDiseno.encargado_med_name = this.pDiseno.encargado_med_name;
          this.proyectoDiseno.horario = item.id.substr(item.id.length - 8,8);
          this.proyectoDiseno.dia = this.$moment(item.start).format("DD-MM-YYYY");
          this.proyectoDiseno.token_project = proyToken;
        }
        //alert(this.$moment(item.meta).format('YYYY-MM-DD HH:mm:ss'));
        //alert( proyToken );
        //alert(this.descripItem);
        //alert (this.pDiseno.encargado_inst_name)
        this.$bvModal.show("myModalDisenoProy");
      }

      //Cargar estadisticas MedInstProyInst
      let fechaC;
      if (item.id.toString().includes("medinstproyinst")) {
        this.descripItem="medinstproyinst";
        this.medicionInstalacionEst = [];
        fechaC = this.$moment(item.start).format("YYYY-MM-DD");
        HTTP.get("/api/medicion_instalacion/yearmonthdetail/" + fechaC + "/1")
          .then((result) => {
            if (result.data != null) {
              this.medicionInstalacionEst = result.data.data;
            }
        })
        .catch((error) => {
          console.log(error);
        });

        this.$bvModal.show("myModalMedInstProy");
      }

      if (item.id.toString().includes("medinstproymed")) {
        this.descripItem="medinstproymed";
        this.medicionInstalacionEst = [];
        fechaC = this.$moment(item.start).format("YYYY-MM-DD");
        HTTP.get("/api/medicion_instalacion/yearmonthdetail/" + fechaC + "/0")
          .then((result) => {
            if (result.data != null) {
              this.medicionInstalacionEst = result.data.data;
            }
        })
        .catch((error) => {
          console.log(error);
        });

        this.$bvModal.show("myModalMedInstProy");
      }

      if (item.id.toString().includes("proddisproy")) {
        this.descripItem="proddisproy";
        this.medicionInstalacionEst = [];
        fechaC = this.$moment(item.start).format("YYYY-MM-DD");
        HTTP.get("/api/medicion_instalacion/yearmonthweekdetail/" + fechaC)
          .then((result) => {
            if (result.data != null) {
              this.medicionInstalacionEst = result.data.data;
              this.medicionInstalacionEst.sort(function (a, b) {
                  if (a.tipo > b.tipo) {
                    return -1;
                  }
                  if (a.tipo < b.tipo) {
                    return 1;
                  }
                  // names must be equal
                  return 0;
              });
            }
        })
        .catch((error) => {
          console.log(error);
        });

        this.$bvModal.show("myModalProdDisProy");
      }

      //-------------------------------------

      if  (this.tipoItem==="tarea") {
      //if (detalle.hasOwnProperty("tarea")) {
        this.$bvModal.show("myModalHorizontal");

        this.btMdHorizontal.update = true;

        if (this.rol == "Administrador") this.btMdHorizontal.delete = true;
        this.btMdHorizontal.save = false;

        this.currentEventImages = [];

        this.gruposSeleccionados = [];
        if (detalle.grupos === null) {
          this.gruposSeleccionados = [];
        } else {
          for await (let item of detalle.grupos) {
            for await (let it of this.grupos) {
              if (it.id === item) this.gruposSeleccionados.push(it);
            }
          }
        }
        console.log("gruposeleccionados----------->", this.gruposSeleccionados);
        if (detalle.latitud != "") {
          this.latitud = +detalle.latitud;
          this.longitud = +detalle.longitud;
          console.log(this.latitud);
          this.obtenerDireccion(+detalle.latitud, +detalle.longitud);
        }

        this.tarea.tarea = detalle.tarea;
        this.tarea.desc = detalle.descripcion;
        this.tarea.nombre = detalle.nombre;
        this.tarea.telefono = detalle.telefono;
        this.tarea.direccion = detalle.direccion;
        this.tarea.horario = detalle.hora_inicio;
        this.tarea.dia = this.$moment(detalle.dia).format("DD-MM-YYYY");
        this.tarea.eventId = detalle.id;
        //pendiente
        this.cargarImagenesEvento(detalle.id);
      }
      if  (this.tipoItem==="proyecto") {
        let title = `${detalle.cliente.nombre_completo} - ${detalle.proyecto}`;
        this.dataModal["projectId"] = detalle.id;
        this.observacionesProyecto =
          detalle.observaciones === null ? "" : detalle.observaciones;
        let porcejPiezas = detalle.progreso_total.porcentaje_piezas.toFixed(2);
        let porcejStock = detalle.progreso_total.porcentaje_stock.toFixed(2);
        let porcejTapacantos = detalle.progreso_total.porcentaje_tapacantos.toFixed(2);
        let porcejPrearmado = detalle.progreso_total.porcentaje_prearmados.toFixed(2);
        let porcejModulos = detalle.progreso_total.porcentaje_modulos.toFixed(2);
        let porcejCajones = detalle.progreso_total.porcentaje_cajones.toFixed(2);
        let porcejActionNotes = detalle.progreso_total.porcentaje_actionnotes.toFixed(2);
        let total = detalle.progreso_total.total.toFixed(2);

        // document.getElementById("clientePlace").innerHTML = `<b>${title}</b>`;
        this.dataModal["clientePlace"] = title;
        // this.$refs.clientePlace.v-html(`<b>${title}</b>`);
        // document.getElementById("datePlace").innerHTML = moment(detalle.instalacion_fecha).format("DD-MM-YYYY");
        this.dataModal["datePlace"] = this.$moment(
          item.start
        ).format("DD-MM-YYYY");
        // document.getElementById("hourPlace").innerHTML = `${moment(detalle.instalacion_fecha).format("hh:mm")}hs`;
        this.dataModal["hourPlace"] = `${this.$moment(
          item.start
        ).format("hh:mm")}hs`;
        // document.getElementById("tipoTrabajo").innerHTML = detalle.proyecto;
        this.dataModal["tipoTrabajo"] = detalle.proyecto;
        // document.getElementById("comment").innerHTML = detalle.instalacion_comentario;
        this.dataModal["comment"] = detalle.instalacion_comentario;
        // document.getElementById("phone").innerHTML = detalle.cliente.telefono;
        this.dataModal["phone"] = detalle.cliente.telefono;
        // document.getElementById("address").innerHTML = detalle.cliente.direccion;
        this.dataModal["address"] = detalle.cliente.direccion;
        // document.getElementById("piezasPorcej").innerHTML = porcejPiezas + "%";
        this.dataModal["piezasPorcej"] = porcejPiezas + "%";
        this.dataModal["piezasPorcejStyleWidth"] = porcejPiezas + "%";
        // document.getElementById("piezasPorcej").style.width = porcejPiezas + "%";
        //console.log(this.dataModal)
        if (parseFloat(porcejPiezas) > 1 && parseFloat(porcejPiezas) < 70)
          this.dataModal["piezasPorcejStylebackgroundColor"] = "#9E9E1F";
        // document.getElementById("piezasPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejPiezas) > 70 &&
          parseFloat(porcejPiezas) < 100
        )
          this.dataModal["piezasPorcejStylebackgroundColor"] = "#CFCF26";
        // document.getElementById("piezasPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejPiezas) > 99)
          this.dataModal["piezasPorcejStylebackgroundColor"] = "#05A730";
        // document.getElementById("piezasPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["piezasPorcejStylebackgroundColor"] = "#337ab7";
        // document.getElementById("piezasPorcej").style.backgroundColor = '#337ab7';

        // document.getElementById("tapacantosPorcej").innerHTML = porcejTapacantos + "%";
        // document.getElementById("tapacantosPorcej").style.width = porcejTapacantos + "%";
        this.dataModal["tapacantosPorcej"] = porcejTapacantos + "%";
        this.dataModal["tapacantosPorcejStyleWidth"] = porcejTapacantos + "%";
        if (
          parseFloat(porcejTapacantos) > 1 &&
          parseFloat(porcejTapacantos) < 70
        )
          this.dataModal["tapacantosPorcejStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("tapacantosPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejTapacantos) > 70 &&
          parseFloat(porcejTapacantos) < 100
        )
          this.dataModal["tapacantosPorcejStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("tapacantosPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejTapacantos) > 99)
          this.dataModal["tapacantosPorcejStylebackgroundColor"] = "#05A730";
        //     document.getElementById("tapacantosPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["tapacantosPorcejStylebackgroundColor"] = "#337ab7";
        //     document.getElementById("tapacantosPorcej").style.backgroundColor = '#337ab7';

        // document.getElementById("prearmadoPorcej").innerHTML = porcejPrearmado + "%";
        // document.getElementById("prearmadoPorcej").style.width = porcejPrearmado + "%";
        this.dataModal["prearmadoPorcej"] = porcejPrearmado + "%";
        this.dataModal["prearmadoPorcejStyleWidth"] = porcejPrearmado + "%";
        if (parseFloat(porcejPrearmado) > 1 && parseFloat(porcejPrearmado) < 70)
          this.dataModal["prearmadoPorcejStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("prearmadoPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejPrearmado) > 70 &&
          parseFloat(porcejPrearmado) < 100
        )
          this.dataModal["prearmadoPorcejStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("prearmadoPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejPrearmado) > 99)
          this.dataModal["prearmadoPorcejStylebackgroundColor"] = "#05A730";
        //     document.getElementById("prearmadoPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["prearmadoPorcejStylebackgroundColor"] = "#337ab7";
        //     document.getElementById("prearmadoPorcej").style.backgroundColor = '#337ab7';

        this.dataModal["porcejCajones"] = porcejCajones + "%";
        this.dataModal["porcejCajonesStyleWidth"] = porcejCajones + "%";

        // document.getElementById("cajonesPorcej").innerHTML = porcejCajones + "%";
        // document.getElementById("cajonesPorcej").style.width = porcejCajones + "%";

        if (parseFloat(porcejCajones) > 1 && parseFloat(porcejCajones) < 70)
          this.dataModal["porcejCajonesStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("cajonesPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejCajones) > 70 &&
          parseFloat(porcejCajones) < 100
        )
          this.dataModal["porcejCajonesStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("cajonesPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejCajones) > 99)
          this.dataModal["porcejCajonesStylebackgroundColor"] = "#05A730";
        //     document.getElementById("cajonesPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["porcejCajonesStylebackgroundColor"] = "#337ab7";
        //     document.getElementById("cajonesPorcej").style.backgroundColor = '#337ab7';

        this.dataModal["modulosPorcej"] = porcejModulos + "%";
        this.dataModal["modulosPorcejStyleWidth"] = porcejModulos + "%";
        // document.getElementById("modulosPorcej").innerHTML = porcejModulos + "%";
        // document.getElementById("modulosPorcej").style.width = porcejModulos + "%";

        if (parseFloat(porcejModulos) > 1 && parseFloat(porcejModulos) < 70)
          this.dataModal["modulosPorcejStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("modulosPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejModulos) > 70 &&
          parseFloat(porcejModulos) < 100
        )
          this.dataModal["modulosPorcejStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("modulosPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejModulos) > 99)
          this.dataModal["modulosPorcejStylebackgroundColor"] = "#05A730";
        //     document.getElementById("modulosPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["modulosPorcejStylebackgroundColor"] = "#337ab7";

        //     document.getElementById("modulosPorcej").style.backgroundColor = '#337ab7';

        this.dataModal["totalPorcej"] = total + "%";
        this.dataModal["totalPorcejStyleWidth"] = total + "%";

        // document.getElementById("totalPorcej").innerHTML = "<u><b>" + total + "%</b></u>";
        // document.getElementById("totalPorcej").style.width = total + "%";

        if (parseFloat(total) > 1 && parseFloat(total) < 70)
          // document.getElementById("totalPorcej").style.backgroundColor = '#9E9E1F';
          this.dataModal["totalPorcejStylebackgroundColor"] = "#9E9E1F";
        else if (parseFloat(total) > 70 && parseFloat(total) < 100)
          this.dataModal["totalPorcejStylebackgroundColor"] = "#CFCF26";
        // document.getElementById("totalPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(total) > 99)
          this.dataModal["totalPorcejStylebackgroundColor"] = "#05A730";
        // document.getElementById("totalPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["totalPorcejStylebackgroundColor"] = "#337ab7";
        // document.getElementById("totalPorcej").style.backgroundColor = '#337ab7';

        // document.getElementById("stockPorcej").innerHTML = porcejStock + "%";
        // document.getElementById("stockPorcej").style.width = porcejStock + "%";
        this.dataModal["stockPorcej"] = porcejStock + "%";
        this.dataModal["stockPorcejStyleWidth"] = porcejStock + "%";
        if (parseFloat(porcejStock) > 1 && parseFloat(porcejStock) < 70)
          this.dataModal["stockPorcejStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("stockPorcej").style.backgroundColor = '#9E9E1F';
        else if (parseFloat(porcejStock) > 70 && parseFloat(porcejStock) < 100)
          this.dataModal["stockPorcejStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("stockPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejStock) > 99)
          this.dataModal["stockPorcejStylebackgroundColor"] = "#05A730";
        //     document.getElementById("stockPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["stockPorcejStylebackgroundColor"] = "#337ab7";
        //     document.getElementById("stockPorcej").style.backgroundColor = '#337ab7';

        //Action Notes
        this.dataModal["actionnotesPorcej"] = porcejActionNotes + "%";
        this.dataModal["actionnotesPorcejStyleWidth"] = porcejActionNotes + "%";
        if (parseFloat(porcejActionNotes) > 1 && parseFloat(porcejActionNotes) < 70)
          this.dataModal["actionnotesPorcejStylebackgroundColor"] = "#9E9E1F";
        else if (
          parseFloat(porcejActionNotes) > 70 &&
          parseFloat(porcejActionNotes) < 100
        )
          this.dataModal["actionnotesPorcejStylebackgroundColor"] = "#CFCF26";
        else if (parseFloat(porcejActionNotes) > 99)
          this.dataModal["actionnotesPorcejStylebackgroundColor"] = "#05A730";
        else this.dataModal["actionnotesPorcejStylebackgroundColor"] = "#337ab7";
        //-------------------------------------------------------------------------------
        //Control Proyecto Taller
        this.dataModal["controlTallerPorcej"] = this.controlTaller + "%";
        this.dataModal["controlTallerPorcejStyleWidth"] = this.controlTaller  + "%";
        if (parseFloat(this.controlTaller) > 1 && parseFloat(this.controlTaller) < 70)
          this.dataModal["controlTallerPorcejStylebackgroundColor"] = "#9E9E1F";
        else if (
          parseFloat(this.controlTaller) > 70 &&
          parseFloat(this.controlTaller) < 100
        )
          this.dataModal["controlTallerPorcejStylebackgroundColor"] = "#CFCF26";
        else if (parseFloat(this.controlTaller) > 99)
          this.dataModal["controlTallerPorcejStylebackgroundColor"] = "#05A730";
        else this.dataModal["controlTallerPorcejStylebackgroundColor"] = "#337ab7";
        //--------------------------------------
        this.$bvModal.show("Calendarmodal");
      }
    },
    abrirGoogleMaps() {
      window.open(
        ` https://www.google.com/maps/?q=${this.latitud},${this.longitud}`
      );
    },
    removeFromQueue() {},
    async eliminarFotoEvento(imagen) {
      let eventId = document.getElementById("eventId").value;
      let dataResponse = await HTTP.delete(`/api/eventimage/${imagen}`);
      if (dataResponse) {
        this.cargarImagenesEvento(eventId);
      }
    },
    visualizarImagen(imagen) {
      // this._lightBox.open([{ src: imagen, thumb: imagen }], 0)
      this.imgs = [{ src: imagen, title: "" }];
      this.index = 1; // index of imgList
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    },

    filtrarPorGrupo($event) {
      let event = $event.target.value;
      console.log(event);
      let eventos = [];
      if (this.eventsAux.length == 0)
        // this.eventsAux = [...this.events];
        this.eventsAux = [...this.calendarOptions.events];

      console.log("this.eventsAux.length", this.eventsAux);
      if (event != 0) {
        this.eventsAux.forEach((element) => {
          if (element.meta.grupos != null) {
            let filtrosEncontrados = element.meta.grupos.find(
              (number) => number == +event
            );
            if (filtrosEncontrados != undefined) eventos.push(element);
          }
        });
      }

      if (eventos.length > 0)
        // this.events = eventos;
        this.calendarOptions.events = eventos;
      else {
        if (event != 0)
          this.$refs.toastr.i("No hay proyectos/eventos a cargo del grupo"); //this.$toastr.info("No hay proyectos/eventos a cargo del grupo");
        // this.events = this.eventsAux;
        this.calendarOptions.events = this.eventsAux;
      }
    },
    colorProgreso(progreso) {
      const cantidad = parseInt(progreso);
      if (cantidad == 0) return "#337ab7";
      else if (cantidad < 60) return "#dadc02";
      else if (cantidad < 100) return "#f4f566";
      else if (cantidad == 100) return "#5cb85c";
    },

    showpagesFirst(hide, show) {
      console.log("show----->", show);
      console.log("itemsToShowFirstFinal--->", this.itemsToShowFirst);
      let count = 0;
      let exists = true;
      console.log("asas", "#proyectoFirst-" + count);
      console.log("asas", this.$refs["#proyectoFirst-" + count.toString()]);
      while (exists) {
        if (document.getElementById("proyectoFirst-" + count.toString())) {
          //Vacio
          } else {
          exists = false;
        }
        count++;
      }
      console.log("exists", exists);
      console.log(this.$refs["#proyectoFirst-" + show]);
      // if ( document.getElementById("#proyectoFirst-" + show)) {
      if (this.$refs["#proyectoFirst-" + show]) {
        console.log(
          "exists proyectoFirst",
          this.$refs["#proyectoFirst-" + show]
        );
        // document.getElementById("#proyectoFirst-" + show).style.display = 'block';
        // this.$refs['#proyectoFirst-' + count].style.display="block";
        let paras = document.getElementsByClassName("modal-backdrop fade in"); //as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < paras.length; i++) {
          paras[i].style.display = "none";
        }
        console.log("click en proyectoFirst");
        document.getElementById("#proyectoFirstOpen-" + show).click();
        // this.$refs['#proyectoFirstOpen-' + show].$el.click();
        this.myCarrouselPositionFirst = show;
      } else {
        if (this.itemsToShowFirst.length > 0) {
          console.log(
            "this.itemsToShowFirstFinal.length",
            this.itemsToShowFirst.length
          );
          this.showpagesFirst(-1, this.itemsToShowFirst.length - 1);
          this.myCarrouselPositionFirst = this.itemsToShowFirst.length - 1;
          let paras = document.getElementsByClassName("modal-backdrop fade in"); //as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < paras.length; i++) {
            paras[i].style.display = "none";
          }
        }
      }
    },
    getInstDisenoAll(proyectoID) {
      this.instalaciones = [];
      HTTP.get("/api/medicion_instalacion/inst/" + proyectoID)
        .then((result) => {
          if (result.data != null) {
            this.instalaciones = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async traerProyectos(inicio, fin) {
      console.log("estoy en traer proyectos*******************");
      let dataUsers = await HTTP.get(`/api/proyectos/dates/${inicio}/${fin}/${this.forzarControl}`);
      dataUsers = dataUsers.data;
      console.log("result proyectos", dataUsers);
      if (dataUsers.proyectos) {
        // this._http.get(`${this.server}/proyectos/dates/${inicio}/${fin}`).subscribe(
        //   (dataUsers: any) => {
        let dataRes = dataUsers.proyectos.length || 0;
        console.log("dataRes---------->", dataRes);
        // if (dataRes > 0) {
        if (dataRes) {
          this.dataUsers = dataUsers.proyectos;
          this.calendarOptions.events = this.calendarOptions.events.concat(dataUsers.proyevent);
          dataUsers.proyectos.forEach(async (element, index) => {
            let total = element.progreso_total.total;
            let stockPorcentaje = element.progreso_total.porcentaje_stock;
            let stockClass = "";

            let arrayGrupos = [];

            if (element.grupos != null) {
              if (element.grupos.length != 0) {
                let arr = element.grupos.split(",");
                arr.forEach((id) => {
                  arrayGrupos.push(+id);
                });
              }
              element.grupos = arrayGrupos;
            }

            this.cKey++;
            // console.log('ver evento', this.events)
            // this.eventsAux = this.events;
            this.eventsAux = this.calendarOptions.events;

            if (this.idTraidoTaller == null) {
              console.log("estoy en idraidotaller null");
              // let actualDate = moment().format('YYYY-MM-DD');
              let actualDate = this.$moment().format("YYYY-MM-DD");
              let fecha_corta = this.$moment(element.instalacion_fecha).format(
                "YYYY-MM-DD"
              ); //moment(element.instalacion_fecha).format("YYYY-MM-DD");
              console.log(fecha_corta);
              if (
                ((element.grupos == "" ||
                  element.grupos == null ||
                  element.grupos == "null") &&
                  (actualDate == fecha_corta ||
                    this.$moment(actualDate)
                      .add(1, "days")
                      .format("YYYY-MM-DD") == fecha_corta)) ||
                this.$moment(actualDate).add(2, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(3, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(4, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(5, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(6, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(7, "days").format("YYYY-MM-DD") ==
                  fecha_corta
              ) {
                let day = this.$moment(element.fecha_corta)
                  .locale("es")
                  .format("dddd");
                element.horaOriginal = this.$moment(
                  element.instalacion_fecha
                ).format("h:mm");
                element.fancyHeader =
                  day.charAt(0).toUpperCase() +
                  day.slice(1) +
                  " - " +
                  element.horaOriginal +
                  "hs";

                this.itemsToShowFirst.push(element);
              }

              if (this.isFirst) {
                console.log("estoy en isfirst");
                let dataOrdered = Array();

                for (let z = 0; z < this.itemsToShowFirst.length; z++) {
                  if (!dataOrdered[this.itemsToShowFirst[z].fecha_corta]) {
                    dataOrdered[this.itemsToShowFirst[z].fecha_corta] = Array();
                  }
                  dataOrdered[this.itemsToShowFirst[z].fecha_corta].push(
                    this.itemsToShowFirst[z]
                  );
                }
                let dataOrderedDates = Array();
                let myCount = 0;

                for (let key in dataOrdered) {
                  if (Object.keys(dataOrderedDates).length == 0) {
                    dataOrderedDates[myCount] = key;
                    myCount++;
                  } else {
                    let thisDate = new Date(key);
                    for (let i = 0; i < dataOrderedDates.length; i++) {
                      let dateToAnalyze = new Date(dataOrderedDates[i]);
                      if (thisDate < dateToAnalyze) {
                        let myLength = dataOrderedDates.length;
                        for (let j = myLength - 1; j >= i; j--) {
                          dataOrderedDates[j + 1] = dataOrderedDates[j];
                        }
                        dataOrderedDates[i] = key;
                        break;
                      }
                      if (
                        thisDate > dateToAnalyze &&
                        !dataOrderedDates[i + 1]
                      ) {
                        dataOrderedDates[i + 1] = key;
                        break;
                      }
                    }
                    myCount++;
                  }
                }
                let count = 0;

                for (let i = 0; i < dataOrderedDates.length; i++) {
                  for (let key in dataOrdered) {
                    if (key == dataOrderedDates[i]) {
                      for (let j = 0; j < dataOrdered[key].length; j++) {
                        this.itemsToShowFirstFinal[count] = dataOrdered[key][j];
                        count++;
                      }
                    }
                  }
                }
                console.log(
                  "itemsToShowFirstFinal---------------",
                  this.itemsToShowFirst
                );

                //document.getElementById("#proyectoFirstOpen-0").click();

                console.log(
                  "this.myCarrouselPositionFirst--------",
                  this.myCarrouselPositionFirst
                );
               /* setTimeout(() => {
                  if (this.isFirst) {
                    this.isFirst = false;
                    this.showpagesFirst(-1, this.myCarrouselPositionFirst);
                  }
                }, 1000);*/
              }
            }
          });
          this.dataUsers.forEach(data =>{
            console.log('listado de eventos:',data.id)
                  if(data.id == this.idTraidoTaller){
                    console.log('Encontro coincidencia')
                   this.detalleCalendario(data)
                  }
              })
        }
      }
      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },
    async agregarEventoCalendario(data) {
      console.log("en agregareventocalendario$$$$$$$$$$$$$$$$", data);
      let stockClass = "";
      if (data.tarea == "visita") stockClass = "red";
      else if (data.tarea == "pago") stockClass = "orange";
      else if (data.tarea == "medidas") stockClass = "grey";
      else if (data.tarea == "servicio") stockClass = "black";
      else if (data.tarea == "nota") stockClass = "white";
      else if (data.tarea == "tarea") stockClass = "violet";

      let arrayGrupos = [];

      if (data.grupos != null) {
        let arr = data.grupos.split(",");
        arr.forEach((id) => {
          arrayGrupos.push(+id);
        });
      }
      data.grupos = arrayGrupos;
      // title: data.tarea + " - " + data.hora_inicio+'HS',
      this.calendarOptions.events.push({
        id: "tarea-" + data.id,
        title: "",
        start: this.$moment(data.dia).format("YYYY-MM-DD HH:MM:SS"),
        end: this.$moment(data.dia).format("YYYY-MM-DD HH:MM:SS"),
        classNames: ["stockClass", "eventTBackg"],
        backgroundColor: stockClass,
        meta: data,
        customHtml: `<div align ="left"><table"><tr style="vertical-align:middle;">
        <td style="width:100%" style="vertical-align:middle;"><div class="container" style="padding:0px !important;"><div class="row">
        <div class="col-sm-7"><span style="white-space:normal; width:100%; display:block !important;word-wrap:break-word !important; font-size:9px;">${
        data.tarea + " - " + data.hora_inicio
        }HS</span></div><div class="col-sm" style="display: flex; !important; text-align: right !important; vertical-align:middle !important;">
        <div class="fc-daygrid-event-dot" style="white-space:normal;border-color: transparent" style="margin-left:3px; display: inline-block !important"></div>
        <div class="fc-daygrid-event-dot" style="white-space:normal;border-color: ${stockClass}" style="margin-left:3px; display: inline-block !important"></div>
        </div></td>
        </tr></table></div>`,
      });
    },
    async traerEventos(inicio, fin) {
      //this._ngxUiService.start();
      this.loadingOff = 0;
      this.events = [];
      this.calendarOptions.events = [];
      //this.cargandoCalendario = true;
      //this._http.get(`${environment.API_URL}/event/dates/${inicio}/${fin}`).subscribe(
      let dataUsers = await HTTP.get(`/api/event/dates/${inicio}/${fin}`);
      dataUsers = dataUsers.data;
      console.log(
        "result00$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
        dataUsers
      );
      if (dataUsers.events.length > 0) {
        console.log("datauser length>0");
        dataUsers.events = dataUsers.events.sort(
          (a, b) => b.hora_inicio - a.hora_inicio
        );
        dataUsers.events.forEach((element, index) => {
          console.log("foreach events", element);
          this.dataEvents.push(element);
          this.agregarEventoCalendario(element);
          if (this.idTraidoTaller == null) {
            let actualDate = this.$moment().format("YYYY/MM/DD");
            let fecha_corta = this.$moment(element.instalacion_fecha).format(
              "YYYY/MM/DD"
            );
            if (
              (element.grupos == "" || element.grupos == null) &&
              (actualDate == fecha_corta ||
                this.$moment(actualDate).add(1, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(2, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(3, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(4, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(5, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(6, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(7, "days").format("YYYY/MM/DD") ==
                  fecha_corta)
            ) {
              console.log("if final---", element.dia);
              element.dia_original = element.dia;
              element.horaOriginal = element.hora_inicio;
              // let day = this.$moment(element.fecha_corta).lang("es").format("dddd");
              let day = this.$moment(element.fecha_corta)
                .locale("es")
                .format("dddd");
              element.fancyHeader =
                day.charAt(0).toUpperCase() +
                day.slice(1) +
                " - " +
                element.horaOriginal +
                "hs";
              console.log("ln1770");
              this.itemsToShowFirst.push(element);
            }
          }
        });
      }

      this.traerProyectos(inicio, fin); //Proceso=1
      this.agregarCapacidadCalendarioV2(); //Proceso=2
      this.agregarCapacidadCalendario(); //Proceso=3
      this.traerProyectosDiseno(inicio, fin); //Proceso=4
      this.traerProyectosDisenoMed(inicio,fin); //Proceso=5
      this.agregarFeriadosCalendario(inicio, fin); //Proceso=6
      this.traerTareas(); //Proceso=7

    },

    async getAllFeriados(inicio, fin) {
            let data = await FeriadoService.getDate(inicio, fin)

            if (data){
                let feriados = data.feriados.sort(function (a, b) {
                    if (a.fecha < b.fecha)
                        return -1;
                    if (a.fecha > b.fecha)
                        return 1;
                    return 0;
                });
                return feriados;
            }
           return null;
    },
    async agregarFeriadosCalendario(inicio, fin) {
      console.log("Estoy en Feriado Calendario");
      let feriados = [];
      feriados = await this.getAllFeriados(inicio, fin);
      //let dataUsers = await HTTP.get(`/api/proyectos/dates/${inicio}/${fin}`);
      feriados.forEach((holyday,index) =>{
        console.log("Ciclo for en Feriado Calendario");
          this.calendarOptions.events.push({
                  title: "AAAAAA",
                  start: this.$moment(holyday.fecha + " 00:10:00").format('YYYY-MM-DD HH:mm'),
                  end: this.$moment(holyday.fecha + " 00:00:00").format('YYYY-MM-DD HH:mm'),
                  allDay: true,
                  color: "red",
                  eventBorderColor: "red",
                  backgroundColor: "red",
                  customHtml: `<span style="color: red; white-space:normal; width:100%; display:block !important;word-wrap:break-word !important; font-size:10px;margin-right:2px">-</span>`,
                });
      });
      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async traerTareas() {
      var userid = localStorage.getItem('user-id');
      let datos = await HTTP.get(`/api/tareas/list_calendar/${userid}`);
      datos = datos.data.data;

      this.calendarOptions.events = this.calendarOptions.events.concat(datos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async agregarCapacidadCalendario() {
      let fecha=this.mesActual;
      console.log("Estoy en Capacidad Calendario");
      let datos = await HTTP.get(`/api/medicion_instalacion/yearmonth/${fecha}`);
      datos = datos.data.data;

      this.calendarOptions.events = this.calendarOptions.events.concat(datos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async agregarCapacidadCalendarioV2() {
      let fecha=this.mesActual;
      console.log("Estoy en Capacidad Calendario");
      let datos = await HTTP.get(`/api/medicion_instalacion/yearmonthweek/${fecha}`);
      datos = datos.data.data;

      this.calendarOptions.events = this.calendarOptions.events.concat(datos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async traerProyectosDiseno(inicio, fin) {
      console.log("Estoy en Proyectos Diseño");
      try {
              this.proyDisenos = await HTTP.get(`/api/medicion_instalacion/instdate/${inicio}/${fin}`);
              this.proyDisenos =  this.proyDisenos.data.data;
      }
      catch (error) {
        console.log("Error: ", error);
        this.proyDisenos = [];
      }
      console.log("Proyectos Diseño: ", this.proyDisenos);

      this.calendarOptions.events = this.calendarOptions.events.concat(this.proyDisenos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async traerProyectosDisenoMed(inicio, fin) {
      console.log("Estoy en Proyectos Diseño Med");
      try {
              this.proyDisenos = await HTTP.get(`/api/medicion_instalacion/meddate/${inicio}/${fin}`);
              this.proyDisenos =  this.proyDisenos.data.data;
      }
      catch (error) {
        console.log("Error: ", error);
        this.proyDisenos = [];
      }
      console.log("Proyectos Diseño: ", this.proyDisenos);

      this.calendarOptions.events = this.calendarOptions.events.concat(this.proyDisenos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async fetchEvents() {
      this.loadingPage = true;

      this.filtroGrupo = 0;
      let currIni = new Date(this.dateStart); // get current date
      let currFin = new Date(this.dateStart); // get current date
      let monthd = new Date(this.dateStart);
      let ini = new Date(currIni.getFullYear(), currIni.getMonth(), 1);
      let lt = new Date(currFin.getFullYear(), currFin.getMonth() + 1, 0);

      monthd = this.$moment(monthd.setDate(monthd.getDate())).format("YYYY-MM");

      let first = this.$moment(ini.setDate(ini.getDate() - 8)).format(
        "YYYY-MM-DD"
      );
      let last = this.$moment(lt.setDate(lt.getDate() + 8)).format(
        "YYYY-MM-DD"
      );
      let inicio = first; // this.$moment(first).format("YYYY-MM-DD")
      let fin = last; // this.$moment(last).format("YYYY-MM-DD")

      this.mesActual = monthd;

      //reiniciar vectores
      console.log(inicio);
      console.log(fin);
      this.isFirst = true;
      this.dataEvents = [];
      this.itemsToShowFirst = [];

      await this.traerEventos(inicio, fin);
    },
    setShowDate(d) {
      this.showDate = d;
      this.dateStart = d;
      this.fetchEvents();
    },
    clickEvent() {},
    ubicacionActual() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitud = position.coords.latitude;
          this.longitud = position.coords.longitude;
          this.obtenerDireccion(this.latitud, this.longitud);
        });
      }
    },
    nuevoEvento(d) {
      console.log("Nuevo Evento: ", d);
      // document.getElementById("openMod").click();
      this.$bvModal.show("myModalHorizontal");

      // this.uploader.clearQueue();
      this.currentEventImages = [];
      // document.getElementById("openMod").click();
      // document.getElementById("updateEvent").style.display = "none";
      // document.getElementById("deleteEvent").style.display = "none";
      // document.getElementById("saveEvent").style.display = "block";

      //document.getElementById("updateEvent").style.display = "block";
      this.btMdHorizontal.update = false;
      this.btMdHorizontal.delete = false;
      this.btMdHorizontal.save = true;

      this.ubicacionActual();
      setTimeout(() => {
        this.verificarDireccion(+this.latitud, +this.longitud);
      }, 250);

      let form = document.getElementById("eventForm");

      this.tarea.tarea = "";
      this.tarea.desc = "";
      this.tarea.nombre = "";
      this.tarea.telefono = "";
      this.tarea.horario = this.$moment().format("HH:mm");
      this.tarea.dia = this.$moment(d.startStr).format("DD-MM-YYYY");
      this.gruposSeleccionados = [];
    },
  },
};
</script>

<style lang="scss">
/* body {
    margin: 40px 10px;
    padding: 0;
    font-family: "Lucida Grande",Helvetica,Arial,Verdana,sans-serif;
    font-size: 14px;
} */

/** No ocultar eventos del calendario */
#calendar .fc-daygrid-day-bottom {
  display: none;
}
#calendar .fc-daygrid-day-events {
  position: initial;
  overflow: auto;
}
#calendar .fc-daygrid-event-harness {
  visibility: visible !important;
  position: initial;
  margin-bottom: 5px;
}
.fc-liquid-hack td {
  height: 100px; /** Con esto se ajusta a la cant de eventos. No se por qué. */
}
.fc-scrollgrid-section-header .fc-scroller {
  overflow: hidden !important; /** No mostrar scroll en header de dias */
}
/** */
/** Ocultar selector de modo de vista del calendario */
#calendar .fc-header-toolbar .fc-toolbar-chunk:nth-child(3) {
  display: none;
}
/** */
/** Ajustar header para responsive */
@media only screen and (max-width: 374px) {
  #calendar .fc-header-toolbar {
    display: block;
  }
  #calendar .fc-header-toolbar .fc-toolbar-chunk:nth-child(2) {
    text-align: center;
    margin-top: 10px;
  }
  #calendar .fc-header-toolbar .fc-toolbar-chunk:nth-child(1) {
    display: flex;
  }
  #calendar .fc-header-toolbar .fc-toolbar-chunk .fc-today-button {
    margin: auto !important;
    margin-right: 0px !important;
  }
}
/** */

.calendario-detalle {
  margin: 2px;
  padding: 2px 5px;
  color: white !important;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
}

.ml-1 {
  margin-left: 10px !important;
}

.cargandoFotoEvento {
  filter: blur(4px);
  width: 100%;
  height: 100%;
}

.justify-center {
  justify-content: center;
}

.text-warning {
  color: orangered;
}

.position-check {
  font-size: 14px;
  position: relative;
  top: 1px;
}

.position-bolitas {
  position: relative;
  top: 2px;
  right: 2px;
}

.responsive-text {
  width: 150px;
  overflow: hidden;
}

.evento-responsive {
  overflow: hidden;
}

.wrap {
  flex-wrap: wrap;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

.flex-center {
  display: flex !important;
  justify-content: center !important;
}

@media only screen and (max-width: 374px) {
  .responsive-text {
    width: 20px !important;
  }

  .evento-responsive {
    width: 20px !important;
  }
  .position-bolitas {
    top: 0px !important;
  }

  .cal-day-badge {
    margin-left: 4px;
    font-size: 9px;
  }
  .cal-month-view .cal-day-cell.cal-today .cal-day-number {
    font-size: 1.2em;
    margin-right: 8px;
  }
  .cal-day-number {
    font-size: 1.2em !important;
    margin-right: 8px;
  }

  .calendario-detalle {
    font-size: 9px;
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 374px) and (max-width: 375px) {
  .responsive-text {
    width: 33px !important;
  }

  .evento-responsive {
    width: 33px !important;
  }
  .position-bolitas {
    top: 0px !important;
  }

  .cal-day-badge {
    margin-left: 4px;
    font-size: 9px;
  }
  .cal-month-view .cal-day-cell.cal-today .cal-day-number {
    font-size: 1.2em;
    margin-right: 8px;
  }
  .cal-day-number {
    font-size: 1.2em !important;
    margin-right: 8px;
  }

  .calendario-detalle {
    font-size: 9px;
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 377px) and (max-width: 414px) {
  .responsive-text {
    width: 35px !important;
  }

  .evento-responsive {
    width: 35px !important;
  }
  .position-bolitas {
    top: 0px !important;
  }

  .cal-day-badge {
    margin-left: 4px;
    font-size: 9px;
  }
  .cal-month-view .cal-day-cell.cal-today .cal-day-number {
    font-size: 1.2em;
    margin-right: 8px;
  }
  .cal-day-number {
    font-size: 1.2em !important;
    margin-right: 8px;
  }

  .calendario-detalle {
    font-size: 9px;
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 415px) and (max-width: 768px) {
  .position-bolitas {
    top: 0px !important;
  }

  .cal-day-badge {
    margin-left: 4px;
    font-size: 9px;
  }
  .cal-month-view .cal-day-cell.cal-today .cal-day-number {
    font-size: 1.2em;
    margin-right: 8px;
  }
  .cal-day-number {
    font-size: 1.2em !important;
    margin-right: 8px;
  }

  .calendario-detalle {
    font-size: 9px;
    display: flex;
    flex-direction: column;
  }

  .responsive-text {
    width: 45px !important;
  }
  .responsive-text {
    width: 45px !important;
  }
}

@media (min-width: 769px) and (max-width: 1025px) {
  .responsive-text {
    width: 75px !important;
  }

  .evento-responsive {
    width: 75px !important;
  }
}

@media (min-width: 1281px) and (max-width: 1440px) {
  .responsive-text {
    width: 110px !important;
  }

  .evento-responsive {
    width: 110px !important;
  }
}

@media (min-width: 1026px) and (max-width: 1280px) {
  .responsive-text {
    width: 90px !important;
  }

  .evento-responsive {
    width: 90px !important;
  }
}

@media (min-width: 1281px) and (max-width: 1680px) {
  .responsive-text {
    width: 110px !important;
  }

  .evento-responsive {
    width: 110px !important;
  }
}

.proyecto-finalizado {
  background: #006103;
  font-weight: bold;
  color: white;
}

.upload-btn-wrapper input[type="file"] {
  font-size: 40px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

agm-map {
  height: 200px;
}

.flex {
  display: flex;
}

.relative {
  position: relative;
}

.mr-1 {
  margin-right: 10px;
}

.mt-1 {
  margin-top: 10px;
}

.eliminar-imagen {
  position: absolute;
  top: 5px;
  right: 15px;
  font-size: 18px;
  background: #efefef;
  border-radius: 15px;
  cursor: pointer;
  padding: 2px;
}

.con-observaciones {
  background: #ca860b;
  color: white;
}

#calendarPage textarea {
  resize: none;
}

#calendarPage .evento {
  background: grey !important;
}

#calendarPage .proyecto {
  background: lightgrey;
  color: black !important;
}

#calendarPage .red {
  color: red;
  border-color: black;
}
#calendarPage .orange {
  color: orange;
  border-color: black;
}
#calendarPage .grey {
  color: #cccccc;
  border-color: black;
}
#calendarPage .black {
  color: black;
  border-color: white;
}
#calendarPage .white {
  color: white;
  border-color: black;
}

#calendarPage .violet {
  color: violet;
  border-color: black;
}

#calendar {
  /*max-width: 900px;*/
  margin: 0 auto;
  text-transform: uppercase;

  /* font-size: 11px;*/
}

#div-calendar {
  padding-top: 2em;
  padding-bottom: 2em;
}

.fc-title {
  font-size: 11px !important;
}

::ng-deep .fc-unthemed td.fc-today {
  background-color: #36f4bd;
}

::ng-deep .fc-today .fc-day-number {
  font-weight: bold !important;
  font-size: 18px !important;
}

#calendarPage .modal-body .row {
  margin-left: 0px;
  margin-right: 0px;
}

/* Clases utilizadas para definir progreso de proyecto: /deep/ .progress-[color-proyecto]-[color-stock] */
/* /deep/ .progress-start-* */
/*
/deep/ .progress-start-start {
    background: linear-gradient(90deg, #9E9E1F 25%, #9E9E1F 25%);
}

/deep/ .progress-start-middle {
    background: linear-gradient(90deg, #9E9E1F 25%, #CFCF26 25%);
}

/deep/ .progress-start-complete {
    background: linear-gradient(90deg, #9E9E1F 25%, #05A730 25%);
}

/deep/ .progress-start-default {
    background: linear-gradient(90deg, #9E9E1F 25%, #337ab7 25%);
}

/* /deep/ .progress-middle-* */

/*
/deep/ .progress-middle-start {
    background: linear-gradient(90deg, #CFCF26 25%, #9E9E1F 25%);
}

/deep/ .progress-middle-middle {
    background: linear-gradient(90deg, #CFCF26 25%, #CFCF26 25%);
}

/deep/ .progress-middle-complete {
    background: linear-gradient(90deg, #CFCF26 25%, #05A730 25%);
}

/deep/ .progress-middle-default {
    background: linear-gradient(90deg, #CFCF26 25%, #337ab7 25%);
}

/* /deep/ .progress-complete-* */
/*
/deep/ .progress-complete-start {
    background: linear-gradient(90deg, #05A730 25%, #9E9E1F 25%);
}

/deep/ .progress-complete-middle {
    background: linear-gradient(90deg, #05A730 25%, #CFCF26 25%);
}

/deep/ .progress-complete-complete {
    background: linear-gradient(90deg, #05A730 25%, #05A730 25%);
}

/deep/ .progress-complete-default {
    background: linear-gradient(90deg, #05A730 25%, #337ab7 25%);
}


/* /deep/ .progress-default-* */
/* /deep/ .progress-default-start {
    background: linear-gradient(90deg, #337ab7 25%, #9E9E1F 25%);
}

/deep/ .progress-default-middle {
    background: linear-gradient(90deg, #337ab7 25%, #CFCF26 25%);
}

/deep/ .progress-default-complete {
    background: linear-gradient(90deg, #337ab7 25%, #05A730 25%);
}

/deep/ .progress-default-default {
    background: linear-gradient(90deg, #337ab7 25%, #337ab7 25%);
}*/

#calendarPage .proyecto {
  background: #adadad;
}

.cal-day-number {
  font-weight: bold;
}

.cal-day-number:hover {
  text-decoration: underline;
}

#calendarPage .red-cell {
  background-color: red !important;
}
#calendarPage .blue-cell {
  background-color: blue !important;
}

/* .cv-event{
     font-size: 11px !important;
    overflow: hidden !important;
    word-wrap: break-word;
    height: 40px !important;
} */

.cv-event {
  /* width: 150px !important; */
  font-size: 12px !important;
  /* overflow: hidden; */
}

/* #app {
	display: flex;
	flex-direction: row;
	font-family: Calibri, sans-serif;
	width: 95vw;
	min-width: 30rem;
	max-width: 100rem;
	min-height: 40rem;
	margin-left: auto;
	margin-right: auto;
} */
.calendar-controls {
  margin-right: 1rem;
  min-width: 14rem;
  max-width: 14rem;
}
.calendar-parent {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: 80vh;
  background-color: white;
}
/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
  min-height: 6rem;
}
/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */
/* Add some styling for items tagged with the "birthday" class */
.theme-default .cv-item.birthday {
  background-color: #e0f0e0;
  border-color: #d7e7d7;
}
.theme-default .cv-item.birthday::before {
  content: "\1F382"; /* Birthday cake */
  margin-right: 0.5em;
}
/* The following classes style the classes computed in myDateClasses and passed to the component's dateClasses prop. */
.theme-default .cv-day.ides {
  background-color: #ffe0e0;
}
.ides .cv-day-number::before {
  content: "\271D";
}
.theme-default .cv-day.do-you-remember.the-21st .cv-day-number::after {
  content: "\1F30D\1F32C\1F525";
}

.fc-col-header-cell-cushion {
  color: black !important;
}
.fc-day-today {
  background-color: #e8fde7 !important;
}
.fc-event-time {
  display: none !important;
}
// .fc-daygrid-event-dot-width{ 5px}
.fc-daygrid-day-events {
  // background-color:gray !important
}
.eventBackg {
  background-color: #c5c5c5 !important;
  color: black !important;
}
.eventTBackg {
  background-color: #7e7e7e !important;
  color: white !important;
}
.fc-daygrid-dot-event .fc-event-title {
  font-weight: normal !important;
}
.fc-daygrid-event-dot {
  margin: 0 1px !important; //Modificado de 0 a 1px por Tobias
  height: 2px !important; //Agregado por Tobias
  width: 2px !important; //Agregado por Tobias
}
.fc-bgevent {
  opacity: 1 !important;
}

@media only screen and (max-width: 800px) {
  .fc-button-group {
    display: block !important;
  }
  .fc-button-primary {
    min-width: 50px !important;
    margin: 5px !important;
  }
  .fc-toolbar {
    margin-left: 0 auto !important;
    margin-right: 0 auto !important;
  }
  .fc-daygrid-day {
    height: 70px !important;
  }

  #calendar {
    height: 1000px !important;
  }
}
.modal-header {
  background-color:#FFFFFF !important;
}

#circulo {
  width: 12px;
  height: 12px;
  border-radius: 110px;
}
</style>
