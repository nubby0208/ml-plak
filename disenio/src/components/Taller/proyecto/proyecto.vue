<template>
  <div id="app-proyecto-list" class="container-fluid">
    <vue-toastr ref="toastr"></vue-toastr>

    <div class="col-sm-12 col-sm-offset-1 py-3">
      <div class="col-sm-12 text-center py-3" style="display: flex">
        <div class="panel-body">
          <div class="form-group row">
            <label class="control-label col-sm-4" for="tipo_materiales">
              Búsqueda
            </label>
            <div class="col-sm-8">
              <input
                type="text"
                name="filtro"
                id="filtro"
                class="form-control"
                v-model="filtro"
                v-on:input="onChangeFiltro"
              />
            </div>
          </div>
        </div>
      </div>
      <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
        <div class="row" style="background: white">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <th>#</th>
                <th>Proyecto</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Seña</th>
                <th>
                  <span title="Fecha de Instalación">F. Instalación</span>
                </th>
                <th>
                  <span title="Comentario de Instalación">C. Instalación</span>
                </th>
                <th>Visible</th>
                <th>Acciones</th>
              </thead>

              <tbody>
                <template v-if="proyectos">
                  <tr v-for="(proyecto, i) in proyectos" :key="i">
                    <template v-if="proyecto.show != false">
                      <td>{{ i + 1 }}</td>
                      <td>{{ proyecto.proyecto }}</td>
                      <td>{{ proyecto.cliente.nombre_completo }}</td>
                      <td>{{ proyecto.valor_total }}</td>
                      <td>{{ proyecto.senia }}</td>
                      <td>{{ proyecto.instalacion_fecha }}</td>
                      <td>{{ proyecto.instalacion_comentario }}</td>
                      <td>
                        <select
                          id="activo"
                          class="form-control"
                          v-model="proyecto.activo"
                          @change="onChangeActive($event, proyecto)"
                        >
                          <option
                            v-for="(tipo, ii) in tipos_activos"
                            :key="ii"
                            :value="tipo.value"
                          >
                            {{ tipo.name }}
                          </option>
                        </select>
                      </td>
                      <td>
                        <button
                          class="btn btn-sm btn-warning ml-2"
                          @click="edit(i)"
                        >
                          <font-awesome-icon
                            icon="pencil-alt"
                          ></font-awesome-icon>
                        </button>
                        <button
                          v-if="userRol === 'Administrador'"
                          title="Administrar Piezas Proyecto"
                          class="btn btn-sm btn-info ml-2"
                          @click="showPiezas(proyecto.id, i)"
                        >
                          <font-awesome-icon icon="cog"></font-awesome-icon>
                        </button>
                        <button
                          class="btn btn-sm btn-danger ml-2"
                          @click="del(proyecto)"
                        >
                          <font-awesome-icon icon="trash"></font-awesome-icon>
                        </button>
                      </td>
                    </template>
                  </tr>
                </template>

                <template v-else>
                  <tr>
                    <td class="text-center" colspan="9">
                      <strong>No posee proyectos registrados</strong>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <div style="display: flex">
          <b-pagination
            style="margin: auto; margin-top: 20px"
            v-model="currentPage"
            :total-rows="pageLimit"
            :per-page="1"
            @change="(page) => getAllProyectos(page, filtro)"
          ></b-pagination>
        </div>
      </b-overlay>

      <b-modal id="modal-proyecto-form" hide-header hide-footer size="lg">
        <!-- <div id="modal-proyecto-form" class="modal fade" tabindex="-1"> -->
        <div class="modal-header">
          <p class="modal-title">Proyecto</p>
          <button
            @click="$bvModal.hide('modal-proyecto-form')"
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div id="app-usuario-form" class="container-fluid">
          <div id="" class="col-sm-12">
            <form
              id="form-usuario"
              class="form-horizontal"
              action="#!"
              method="post"
            >
              <div class="form-group row">
                <label class="control-label col-sm-4" for="nombre_completo"
                  >Proyecto</label
                >
                <div class="col-sm-8">
                  <input
                    id="proyecto"
                    class="form-control"
                    name="proyecto"
                    type="text"
                    v-model="proyecto.proyecto"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label class="control-label col-sm-4" for="usuario"
                  >Valor</label
                >
                <div class="col-sm-8">
                  <input
                    id="valor"
                    class="form-control"
                    name="valor"
                    type="text"
                    v-model="proyecto.valor_total"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label class="control-label col-sm-4" for="password"
                  >Seña</label
                >
                <div class="col-sm-8">
                  <input
                    id="senia"
                    class="form-control"
                    name="senia"
                    type="text"
                    v-model="proyecto.senia"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label
                  class="control-label col-sm-4"
                  for="password_confirmation"
                  >Fecha de Instalación</label
                >
                <div class="col-sm-8">
                  <input
                    id="instalacion_fecha"
                    name="instalacion_fecha"
                    class="form-control"
                    type="text"
                    v-model="proyecto.instalacion_fecha"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label class="control-label col-sm-4" for="correo_google"
                  >Comentario de Instalación</label
                >
                <div class="col-sm-8">
                  <input
                    id="instalacion_comentario"
                    class="form-control"
                    name="instalacion_comentario"
                    type="text"
                    v-model="proyecto.instalacion_comentario"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="save()">
            Actualizar
          </button>
          <button
            type="button"
            class="btn btn-default"
            @click="$bvModal.hide('modal-proyecto-form')"
            data-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </b-modal>

      <b-modal id="modal_admin_piezas" hide-footer size="huge">
        <!-- <div class="modal-dialog" role="document" style="width: 80% !important;"> -->
        <div class="modal-header">
          <p class="modal-title">{{ change_title }}</p>
          <!-- <button  type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> -->
        </div>
        <div style="text-align: right; margin-right: 25px">
          <button
            title="Agregar Pieza"
            class="btn btn-xxl btn-success"
            @click="newPiezaFun()"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
          </button>
        </div>

        <div v-if="!show_form">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Estado</th>
                <th>Cantidad</th>
                <th>Pieza</th>
                <th>Comentario</th>
                <th>LVeta</th>
                <th>AVeta</th>
                <th>Módulo</th>
                <th>Material</th>
                <th>Espesor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pieza, id) in piezas" :key="id">
                <td>{{ id + 1 }}</td>
                <td>{{ pieza.estado.estado }}</td>
                <td>{{ pieza.cantidad }}</td>
                <td>{{ pieza.pieza }}</td>
                <td>{{ pieza.comentario }}</td>
                <td>{{ pieza.lveta }}</td>
                <td>{{ pieza.aveta }}</td>
                <td>Modulo {{ pieza.modulo.modulo }}</td>
                <td>{{ pieza.material.material }}</td>
                <td>{{ pieza.espesor }}</td>
                <td>
                  <button
                    title="Editar Pieza"
                    class="btn btn-sm btn-warning"
                    @click="editPieza(id)"
                  >
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                  </button>
                  <button
                    title="Eliminar Pieza"
                    class="btn btn-sm btn-danger"
                    @click="delPieza(id)"
                  >
                    <font-awesome-icon icon="trash"></font-awesome-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="show_form">
          <div class="panel panel-default">
            <div class="panel-heading">Formulario Piezas</div>
            <div class="panel-body">
              <div class="form-group">
                <label for="pieza" class="col-lg-2 control-label">Pieza:</label>
                <div class="col-lg-10">
                  <input
                    type="text"
                    id="pieza"
                    class="form-control"
                    v-model="newPieza.pieza"
                    placeholder="Ingrese la Pieza"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="cantidad" class="col-lg-2 control-label"
                  >Cantidad:</label
                >
                <div class="col-lg-10">
                  <input
                    type="number"
                    id="cantidad"
                    class="form-control"
                    v-model="newPieza.cantidad"
                    placeholder="Ingrese la Cantidad"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="posicion_x" class="col-lg-2 control-label"
                  >Posicion X:</label
                >
                <div class="col-lg-10">
                  <input
                    type="text"
                    id="posicion_x"
                    class="form-control"
                    v-model="newPieza.posicion_x"
                    placeholder="Ingrese la Posicion X"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="posicion_y" class="col-lg-2 control-label"
                  >Posicion Y:</label
                >
                <div class="col-lg-10">
                  <input
                    type="text"
                    id="posicion_y"
                    class="form-control"
                    v-model="newPieza.posicion_y"
                    placeholder="Ingrese la Posicion Y"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="posicion_z" class="col-lg-2 control-label"
                  >Posicion Z:</label
                >
                <div class="col-lg-10">
                  <input
                    type="text"
                    id="posicion_z"
                    class="form-control"
                    v-model="newPieza.posicion_z"
                    placeholder="Ingrese la Posicion Z"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="lvata" class="col-lg-2 control-label">Lveta:</label>
                <div class="col-lg-10">
                  <input
                    type="text"
                    id="lvata"
                    class="form-control"
                    v-model="newPieza.lveta"
                    placeholder="Ingrese el Lveta"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="lvata" class="col-lg-2 control-label">Aveta:</label>
                <div class="col-lg-10">
                  <input
                    type="text"
                    id="avata"
                    class="form-control"
                    v-model="newPieza.aveta"
                    placeholder="Ingrese el Aveta"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="espesor" class="col-lg-2 control-label"
                  >Espesor:</label
                >
                <div class="col-lg-10">
                  <input
                    type="text"
                    id="espesor"
                    class="form-control"
                    v-model="newPieza.espesor"
                    placeholder="Ingrese el Espesor"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="orientacion" class="col-lg-2 control-label"
                  >Orientacion:</label
                >
                <div class="col-lg-10">
                  <input
                    type="text"
                    id="orientacion"
                    class="form-control"
                    v-model="newPieza.orientacion"
                    placeholder="Seleccione el Modulo"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="modulo_id" class="col-lg-2 control-label"
                  >Modulo:</label
                >
                <div class="col-lg-10">
                  <select
                    id="modulo_id"
                    v-model="newPieza.modulo_id"
                    class="form-control"
                  >
                    <option
                      v-for="(modulo, i) in modulos"
                      :key="i"
                      :value="modulo.id"
                    >
                      Modulo {{ modulo.modulo }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="material_id" class="col-lg-2 control-label"
                  >Material:</label
                >
                <div class="col-lg-10">
                  <select
                    id="materiales"
                    v-model="newPieza.material_id"
                    class="form-control"
                  >
                    <option
                      v-for="(material, i) in materiales"
                      :key="i"
                      :value="material.id"
                    >
                      {{ material.material }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="estado_id" class="col-lg-2 control-label"
                  >Estado:</label
                >
                <div class="col-lg-10">
                  <select
                    id="estado_id"
                    v-model="newPieza.estado_id"
                    class="form-control"
                  >
                    <option
                      v-for="(estado, i) in estados"
                      :key="i"
                      :value="estado.id"
                    >
                      {{ estado.estado }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="show_form && newPieza.id"
            type="button"
            class="btn btn-success"
            @click="updatePieza()"
          >
            Actualizar
          </button>
          <button
            v-if="show_form && !newPieza.id"
            type="button"
            class="btn btn-success"
            @click="savePieza()"
          >
            Guardar
          </button>
          <button
            type="button"
            class="btn btn-default"
            @click="show_form = false"
          >
            Volver
          </button>
          <button
            type="button"
            class="btn btn-default"
            @click="$bvModal.hide('modal_admin_piezas')"
            data-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import proyectosService from "../Services/proyectosService";
import piezaService from "../Services/piezaService";
import materialService from "../Services/materialService";
import estadoService from "../Services/estadoService";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueToastr from "vue-toastr";

const ProyectoService = new proyectosService();
const MaterialService = new materialService();
const EstadoService = new estadoService();
const PiezasService = new piezaService();

library.add(faPencilAlt);
library.add(faTrash);
library.add(faPlus);
library.add(faCog);

export default {
  components: {
    FontAwesomeIcon,
    VueToastr,
  },
  data() {
    return {
      currentPage: 1,
      pageLimit: 1,
      adminPiezasComponent: "",
      proyectos: [],
      tipos_activos: "",
      titulo_modal_edit_piezas: "",
      filtro: "",
      proyecto: {
        id: 0,
        proyecto: "",
        senia: "",
        valor_total: "",
        instalacion_fecha: "",
        instalacion_comentario: "",
      },
      userRol: "",

      ///admin - piezas
      proyectoInfo: {},
      piezas: [],
      materiales: [],
      estados: [],
      modulos: [],
      show_form: false,
      newPieza: {},
      pieza_id: 0,
      change_title: "",
      loadingPage: true,
    };
  },
  async mounted() {
    this.userRol = localStorage.getItem("user-rol");
    this.titulo_modal_edit_piezas = "Administrar Piezas del Proyecto";

    this.tipos_activos = [
      { name: "Sí", value: 1 },
      { name: "No", value: 0 },
      { name: "Automático", value: null },
    ];

    /// admin-piezas
    this.change_title = "Piezas del Proyecto";
    this.InitModel();
    let response = await MaterialService.getAllRaw();
    if (response) {
      this.materiales = response.materiales;
    }
    let resEstado = await EstadoService.getAll();
    if (resEstado) {
      console.log("resEstado---->", resEstado);
      this.estados = resEstado.estados;
    }

    this.getAllProyectos();
  },
  methods: {
    getProyecto() {
      return this.proyecto;
    },
    async getAllProyectos(page = 1, search) {
      this.loadingPage = true;
      let result = await ProyectoService.allProjects(page, search);

      this.proyectos = result.proyectos.data;
      this.proyectos.map((item) => {
        item.show = true;
      });

      this.pageLimit = result.proyectos.last_page;
      this.loadingPage = false;
    },
    async save() {
      let reqData = this.proyecto;
      console.log(reqData);
      if (this.proyecto.hasOwnProperty("id") && this.proyecto.id > 0) {
        this.$refs.toastr.i("Actualizando proyecto...");

        let response = await ProyectoService.update(reqData);
        if (response) {
          if (response.status == true) {
            this.$refs.toastr.s("¡Proyecto actualizado con éxito!");
            this.$bvModal.hide("modal-proyecto-form");
          } else if (response.status == false)
            this.$refs.toastr.e("¡Error al actualizar proyecto!");
        }
      }
    },
    setProyecto(proyecto) {
      this.proyecto = proyecto;
    },
    async edit(index) {
      console.log("ln238--->", index);
      this.setProyecto(this.proyectos[index]);
      this.$bvModal.show("modal-proyecto-form");
      // _$('#modal-proyecto-form').modal('show');
    },

    showPiezas(proyecto_id, index) {
      this.setProyecto(this.proyectos[index]);
      this.infoProject(proyecto_id);
      this.$bvModal.show("modal_admin_piezas");
    },

    async del(proyecto) {
      this.$swal({
        title: `¿Desea eliminar el proyecto: ${proyecto.proyecto}?`,
        text: "No podrá ser recuperado",
        type: "question",
        buttons: true,
      }).then(async (selected) => {
        if (selected) {
          try {
            this.$refs.toastr.i("Eliminando proyecto...");
            let response = await ProyectoService.delete(proyecto.id); 
            console.log("response-->", response);
            if (response) {
              if (response.status == true) {
                let index = 0;
                for (let i = 0; i < this.proyectos.length; i++)
                  if (this.proyectos[i].id === proyecto.id) {
                    index = i;
                    break;
                  }
                this.proyectos.splice(index, 1);
                this.$refs.toastr.s("¡Proyecto eliminado con éxito!");
              }
            }
          } catch (error) {
            try {
              let response2 = await ProyectoService.desactivar(proyecto.id);
              if (response2.status == true) {
                this.$refs.toastr.s("¡Proyecto desactivado con éxito!");
                this.onChangeFiltro()
              } 
            } catch (error) {
                this.$refs.toastr.e("Error: El Proyecto no puede eliminarse ni desactivarse: " + error);
            } 
          }  
        }
      });
    },

    /////////////////

    async onChangeActive(activo, proyecto) {
      console.log(activo.target.value);
      let reqData = {
        activo: activo.target.value,
        id: proyecto.id,
      };
      console.log("onchangeactive---->", reqData);
      this.$refs.toastr.i("Actualizando estado de proyecto...");

      let response = await ProyectoService.update(reqData);
      if (response) {
        if (response.status == true)
          this.$refs.toastr.s("¡Proyecto actualizado con éxito!");
        else if (response.status == false)
          this.$refs.toastr.e("¡Error al actualizar proyecto!");
      }
    },

    setTituloModalEditPiezas(titulo) {
      this.titulo_modal_edit_piezas = titulo;
    },

    onChangeFiltro() {
      this.currentPage = 1;
      if (this.filtro.length > 0) {
        this.getAllProyectos(this.currentPage, this.filtro);
      }
      if (this.filtro === "" || this.filtro === null) {
        this.getAllProyectos(this.currentPage);
      }
    },

    ////////////////////////////funciones admin piezas
    setShowForm(status) {
      this.show_form = status;
      this.change_title =
        "Piezas del Proyecto " +
        this.proyectoInfo.cliente.nombre_completo +
        " - " +
        this.proyectoInfo.proyecto;
    },
    async infoProject(proyecto_id) {
      this.show_form = false;
      let self = this;
      if (proyecto_id > 0) {
        let response = await ProyectoService.getByIdAllP(proyecto_id);
        if (response) {
          this.proyectoInfo = response.proyecto;
          console.log("proyectos---------->", this.proyectoInfo);
          this.modulos = response.proyecto.modulos;
          self.change_title =
            "Piezas del Proyecto " +
            this.proyectoInfo.cliente.nombre_completo +
            " - " +
            this.proyectoInfo.proyecto;
          self.piezas = [];
          for (let i = 0; i < this.proyectoInfo.modulos.length; i++) {
            let piezas = this.proyectoInfo.modulos[i]["piezas"];
            self.piezas = self.piezas.concat(piezas);
          }
        } //end this.proyectoService
      } //end if
    },

    newPiezaFun() {
      this.show_form = true;
      this.InitModel();
      this.change_title = "Agregar Nueva Pieza";
    },

    async savePieza() {
      let self = this;
      let response = await PiezasService.create(this.newPieza);
      if (response) {
        self.newPieza = response.pieza;
        this.show_form = false;
        this.InitModel();
        this.$refs.toastr.s("Pieza Guardada...");
      } else {
        let errors = JSON.parse(response._body);
        for (let key in errors) {
          this.$refs.toastr.e(errors[key]);
        }
      }
    },
    editPieza(index) {
      this.show_form = true;
      this.newPieza = this.piezas[index];

      this.change_title = "Editando la Pieza " + this.newPieza.pieza;
    },
    delPieza(index) {
      let pieza = this.piezas[index];
      this.$swal({
        title:
          "Confirma Eliminar La Pieza" +
          pieza.pieza +
          " del Proyecto " +
          this.proyectoInfo.cliente.nombre_completo +
          " - " +
          this.proyectoInfo.proyecto,
        text: "La Pieza Sera Borrada de manera Permanente",
        type: "question",
        showCancelButton: true,
      }).then(async (result) => {
        if (result.value) {
          let response = await PiezasService.delete(pieza.id);
          if (response) {
            this.piezas.splice(index, 1);
            this.$refs.toastr.i("Pieza Borrada...");
          }
        }
      });
    },

    async updatePieza() {
      let response = await PiezasService.update(this.newPieza);
      if (response) {
        console.log(response);
        this.$refs.toastr.s("Pieza Actualizada...");
      }
    },
    InitModel() {
      this.newPieza = {
        pieza: "",
        modulo_id: "",
        cantidad: "",
        posicion_x: "",
        posicion_y: "",
        posicion_z: "",
        lveta: "",
        aveta: "",
        espesor: "",
        orientacion: "",
        proyecto_id: "",
        material_id: "",
        estado_id: "",
        prearmado_estado_id: "",
      };
    },
  },
};
</script>

<style>
.modal .modal-huge {
  max-width: 1000px;
  width: 1000px;
}
</style>
