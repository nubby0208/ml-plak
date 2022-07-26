<template>
  <div>
    <vue-toastr ref="toastr"></vue-toastr>
    <div class="container-fluid">
      <div class="col-sm-12 text-center py-3">
        <h2>Panel de Administración de Imágenes</h2>
        <hr />
      </div>
    </div>

    <div class="container-fluid" style="">
      <div class="col-md-12 col-md-offset-1 form-horizontal row">
        <label for="filter-pieza" class="col-sm-4 control-label"
          >Filtrar Proyectos</label
        >
        <div class="col-sm-6">
          <input
            id="filter-pieza"
            class="form-control"
            type="text"
            v-model="inputFiltered"
            @keyup="onChangeFilterProject($event.target.value)"
          />
        </div>
      </div>

      <div class="col-md-12 col-md-offset-1">
        <hr />
      </div>

      <div class="col-md-12 col-md-offset-1">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th
                @click="onSortBy('nombre_completo', sortMode * -1)"
                class="th-pointer"
              >
                Proyecto
                <span
                  class="glyphicon"
                  :class="fnSortClassNombreCliente()"
                ></span>
              </th>
              <th
                @click="onSortBy('created_at', sortMode * -1)"
                class="th-pointer"
              >
                Fecha de creación
                <span class="glyphicon" :class="fnSortClassCreatedAt()"></span>
              </th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="proyectos.length > 0">
              <tr
                v-for="(proyecto, index) in proyectos"
                :key="index"
                :hidden="!proyecto.show"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>{{ proyecto.cliente.nombre_completo }}</strong>
                  {{ proyecto.proyecto }}
                </td>
                <td>{{ proyecto.created_at }}</td>
                <td>
                  <button
                    class="btn btn-primary btn-sm"
                    @click="showModalImagenes($event, proyecto)"
                  >
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="assign2Remove(proyecto,'proyecto','confirmationRemoveAll')">
                    <font-awesome-icon icon="trash"></font-awesome-icon>
                  </button>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr>
                <td colspan="4" class="text-center">
                  <strong>No existen proyectos con imágenes</strong>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="4" class="text-center">
                <nav aria-label="Page navigation">
                  <ul class="pagination">
                    <li>
                      <a
                        href="javascript:void(0)"
                        aria-label="Previous"
                        @click="pagPrev()"
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>

                    <div
                      v-for="(ind, i) in [].constructor(pagOptions.sections)"
                      :key="i"
                    >
                      <li :class="{ active: pagOptions.active === i }">
                        <a href="javascript:void(0)" @click="pagChange(i)">{{
                          i + 1
                        }}</a>
                      </li>
                    </div>

                    <li>
                      <a
                        href="javascript:void(0)"
                        aria-label="Next"
                        @click="pagNext()"
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <b-modal id="modal-proyecto-imagenes" hide-header size="lg">
      <div class="modal-header">
        <h4 class="text-left">
          Galería:
          <strong>{{
            (proyectoImagenes.proyecto.cliente
              ? proyectoImagenes.proyecto.cliente.nombre_completo
              : "") || ""
          }}</strong>
          {{
            proyectoImagenes.proyecto
              ? proyectoImagenes.proyecto.proyecto
              : "" || ""
          }}
        </h4>
        <button @click="$bvModal.hide('modal-proyecto-imagenes')"
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="container-fluid">
        <div v-if="imageShow">
          <VueSlickCarousel v-bind="settings">
            <div v-for="(imagen, i) in proyectoImagenes.imagenes" :key="i">
              <img
                :src="imagen.src"
                class="img-fluid"
                alt="Imagen de galería"
                @click="hideImage()"
              />
            </div>
            <template #prevArrow="arrowOption">
              <div class="custom-arrow">
                {{ arrowOption.currentSlide }}/{{ arrowOption.slideCount }}
              </div>
            </template>
          </VueSlickCarousel>
        </div>

        <b-container v-if="!imageShow && proyectoImagenes.imagenes">
          <div
            v-for="(imagen, i) in proyectoImagenes.imagenes"
            :key="i"
            class="flex-container"
          >
            <a class="img-thumbnail image_wrapper">
              <img
                class="image_wrapper"
                style="width: 100px; height: 100px"
                :src="imagen.src"
                :alt="'Imagen número ' + i + ' de galería'"
                @click="selectImage(i)"
              />
              <button
                title="Remover imagen"
                @click="assign2Remove(i, 'imagen','handlerRemoveOne') "
                class="btn-xs-danger remove">X
              </button>
            </a>
          </div>
        </b-container>
      </div>
      <template #modal-footer>
        <b-button variant="light" @click="$bvModal.hide('modal-proyecto-imagenes')">
          Cerrar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import adminImagesService from "../Services/adminImagesService";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueToastr from "vue-toastr";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

const AdminImagesService = new adminImagesService();
library.add(faPencilAlt);
library.add(faTrash);

export default {
  components: {
    FontAwesomeIcon,
    VueToastr,
    VueSlickCarousel,
  },
  data() {
    return {
      settings: {
        dots: true,
        dotsClass: "slick-dots custom-dot-class",
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      all_folders: [],
      id_folder: "",
      id_img: "",
      file_url: "",
      loader: false,
      loadingThumbnails: true,
      proyectos: [],
      proyectosBkp: [],
      proyectoImagenes: { imagenes: [], proyecto: {} },
      imageShow: "",
      proyecto2Remove: {},
      imagen2Remove: null,
      urlOrigin: "",
      posCarousel: 0,
      pagOptions: {},
      Math: "",
      sortByField: {
        icon: "glyphicon-sort-by-alphabet",
        field: "created_at",
        type: 1,
      },
      sortMode: 1,
      inputFiltered: "",
    };
  },
  async mounted() {
    this.Math = Math;
    this.urlOrigin = window.location.origin + window.location.pathname;
    this.loader = true;
    this.pagOptions = {
      total: 10,
      active: 0,
      sections: 0,
    };

    let response = await AdminImagesService.showAll();
    if (response) {
      this.proyectos = response.proyectos;
      console.log("proyectos", this.proyectos);
      this.loader = false;
      this.pagOptions.sections = Math.round(
        this.proyectos.length / this.pagOptions.total
      );

      this.proyectos.map((item, index) => {
        item.show = index < this.pagOptions.total;
      });
      this.proyectosBkp = this.proyectos;
    }
  },
  methods: {
    async removeImage() {
      let explode = this.file_url.split("/");
      let project_file = explode[1] + "|" + explode[2];
      let response = await AdminImagesService.delete_image(project_file);
      if (response) {
        if (response.result == "success") {
          this.all_folders[this.id_folder].images.splice(this.id_img, 1);
          this.$refs.toastr.s("Imagen Borrada del Servidor.");
        } else {
          this.$refs.toastr.e("La imagen No existe en el Servidor");
        }
      }
    },

    async removeAllImages() {
      let explode = this.all_folders[this.id_folder].folder.split("/");
      let project_folder = explode[0] + "|" + explode[1];
      let response = await AdminImagesService.delete_AllImages(project_folder);
      if (response) {
        if (response.result == "success") {
          this.all_folders.splice(this.id_folder, 1);
          this.$refs.toastr.s("Imagenes Borradas del Servidor.");
        } else {
          this.$refs.toastr.e("El Proyecto No existe en el Servidor");
        }
      }
    },

    /*se asignan la hacer click en la imagen que se desea eliminar*/
    AsignarValores(id_folder, id_img, file) {
      this.id_folder = id_folder;
      this.id_img = id_img;
      this.file_url = file;
    },

    handlerSwalImage(event) {
      if (event.value === true) {
        this.removeImage();
      }
    },

    handlerRemoveAllImages(event) {
      if (event.value === true) {
        this.removeAllImages();
      }
    },

    onChangeFilterProject(search) {
      search = search.toLowerCase();
      let total = 0;

      if (search.length > 0) {
        this.proyectos = this.proyectosBkp.filter((item) => {
          item.show = true;

          return (
            item.cliente.nombre_completo.toLowerCase().indexOf(search) != -1 ||
            item.proyecto.toLowerCase().indexOf(search) != -1
          );
        });

        this.pagOptions.sections = Math.round(
          this.proyectos.length / this.pagOptions.total
        );
        this.sortByVisible();
        this.proyectosToggle();
      } else {
        this.proyectos = this.proyectosBk;

        this.proyectosToggle();
        this.pagOptions.sections = Math.round(
          this.proyectos.length / this.pagOptions.total
        );
        this.sortByField.field = "created_at";
        this.sortByField.type = 1;
        this.onSortBy("created_at", 1);
      }
    },

    async showModalImagenes(event, proyecto) {
      this.imageShow = "";
      this.loadingThumbnails = true;
      this.$bvModal.show("modal-proyecto-imagenes");
      if (proyecto.token_project.length > 0) {
        let response = await AdminImagesService.getByToken(
          proyecto.token_project
        );
        if (response) {
          this.proyectoImagenes.imagenes = response.response.imagenes;
          this.proyectoImagenes.proyecto = proyecto;
          this.loadingThumbnails = false;
        }
      }
    },

    selectImage(pos) {
      this.imageShow = this.proyectoImagenes.imagenes[pos];
      this.posCarousel = pos;
    },

    hideImage() {
      this.imageShow = "";
    },

    assign2Remove(item, option, tipo) {
      if (option === "imagen") {
        this.imagen2Remove = item; // Índice de imagen en `this.proyectoImagenes`
      } else {
        this.proyecto2Remove = item; // Objecto proyecto
      }
      if (tipo=='confirmationRemoveAll'){
        this.$swal({ title: '¿Desea eliminar esta imagen?',
          text: "La imagen será borrada de manera permanente",
          type: 'question',
          buttons: true,
        })
        .then(async (result) => {
          if (result) {
            this.handlerRemoveAll(true)
          }
        });
      }
      if (tipo=='handlerRemoveOne'){
        this.$swal({ title: '¿Desea eliminar esta imagen?',
          text: "La imagen será borrada de manera permanente",
          type: 'question',
          buttons: true,
        })
        .then(async (result) => {
          if (result) {
            this.handlerRemoveOne(true)
          }
        });
      }
    },

    async handlerRemoveAll(event) {
      if (event === true) {
        let response = await AdminImagesService.deleteByProject(this.proyecto2Remove.token_project)
          if (response) {
            if (response.success) {
              this.$refs.toastr.s("¡imágenes borradas con éxito!");
              this.proyectos = this.proyectos.filter((item) => {
                return item.id !== this.proyecto2Remove.id;
              });
            } else {
              this.$refs.toastr.e("¡Error! No se eliminaron las imágenes");
            }
          };
      }
    },

    async handlerRemoveOne(event) {
      if (event === true) {
        const tokenProject = this.proyectoImagenes.proyecto.token_project;
        const filename = this.proyectoImagenes.imagenes[this.imagen2Remove].file;
        let tokenImage = filename.split("/")[2].split(".")[0];
        let response = await AdminImagesService.deleteOne(tokenProject, filename)
        if (response){
          if (response.success) {
            this.$refs.toastr.s("¡Imágen borrada con éxito!");
            this.proyectoImagenes.imagenes.splice(this.imagen2Remove, 1);
          } else {
            this.$refs.toastr.e("¡Error! No se eliminó la imágen");
          }
        }
      }
    },

    proyectosPag() {
      let indexes = [];
      const cantidad = this.proyectos.length / 10;

      for (let i = 0; i < cantidad; i++) {
        indexes.push(i);
      }

      return indexes;
    },

    pagChange(pos = 0) {
      if (pos >= 0) {
        this.pagOptions.active = pos;

        this.proyectosToggle(pos);
      }
    },

    pagNext() {
      if (this.pagOptions.active + 1 <= this.pagOptions.sections) {
        this.pagOptions.active++;
        this.proyectosToggle(this.pagOptions.active + 1);
      }
    },

    pagPrev() {
      if (this.pagOptions.active - 1 >= 0) {
        this.pagOptions.active--;
        this.proyectosToggle(this.pagOptions.active + 1);
      }
    },

    proyectosToggle(pos = 0) {
      this.proyectos.map((item, index) => {
        item.show =
          index >= pos * this.pagOptions.total &&
          index < (pos + 1) * this.pagOptions.total;
      });
    },

    onSortBy(field = "", mode = 1) {
      if (field.length > 0) {
        this.sortMode = mode;
        this.sortByField.field = field;
        this.sortByField.type = mode;

        this.proyectos.sort((a, b) => {
          let aField = "";
          let bField = "";

          if (field === "created_at") {
            aField = a.created_at.toLowerCase().trim();
            bField = b.created_at.toLowerCase().trim();
          } else if (field === "nombre_completo") {
            aField = a.cliente.nombre_completo.toLowerCase().trim();
            bField = b.cliente.nombre_completo.toLowerCase().trim();
          }

          if (aField < bField) {
            return 1 * mode;
          } else if (aField > bField) {
            return -1 * mode;
          } else {
            return 0;
          }
        });

        this.proyectosToggle();
      }
    },

    fnSortClassNombreCliente() {
      let sortClass = {
        "glyphicon-sort-by-alphabet":
          this.sortByField.field === "nombre_completo" &&
          this.sortByField.type === -1,
        "glyphicon-sort-by-alphabet-alt":
          this.sortByField.field === "nombre_completo" &&
          this.sortByField.type === 1,
      };

      return sortClass;
    },

    fnSortClassCreatedAt() {
      let sortClass = {
        "glyphicon-sort-by-order":
          this.sortByField.field === "created_at" &&
          this.sortByField.type === -1,
        "glyphicon-sort-by-order-alt":
          this.sortByField.field === "created_at" &&
          this.sortByField.type === 1,
      };

      return sortClass;
    },

    sortByVisible() {
      this.proyectos.sort((a, b) => {
        if (a.show === true) {
          return -1;
        } else {
          return 1;
        }
      });
    },
  },
};
</script>

<style>
.remove-all {
  border: 1px solid #ddd;
  cursor: pointer;
  color: red;
  margin-left: 2px;
}
.center-block {
  float: none;
}

.image_wrapper {
  position: relative;
  float: left;
  margin: 10px;
}

.image_wrapper .image {
  border: 1px solid #ccc;
  -webkit-box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.75);
}

/* Definimos el formato de las imagenes */
.image_wrapper .add,
.image_wrapper .remove {
  position: absolute;
  top: 0px;
  opacity: 0;
  transition: opacity 0.5s linear;
  -webkit-transition: opacity 0.5s linear;
  cursor: pointer;
  border: 0px;
  width: 32px;
  height: 32px;
}

/* Mostramos el icono al pasar por encima de la imagen con una transicion */
.image_wrapper:hover .add,
.image_wrapper:hover .remove {
  transition: opacity 0.5s linear;
  -webkit-transition: opacity 0.5s linear;
  opacity: 0.8;
}

/* Posicionamos los botones en la posicion izquierda y derecha */
.image_wrapper .add {
  left: 0px;
}

.image_wrapper .remove {
  right: 0px;
  color: red;
}

.image-show .image-hide {
  right: 25%;
  color: white;
}

#modal-proyecto-imagenes .modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.col-image {
  height: 128px !important;
}

@media (max-width: 768px) {
  .col-image {
    height: 160px;
  }
}

.loading-area {
  float: left;
  /*position: absolute;*/
  height: 200px;
  width: 90%;
  z-index: 9;
  /*background: rgba(0,0,0,0.3);*/
}

.loading-area div {
  position: absolute;
  left: 50%;
  top: 10%;
  margin-top: 9%;
}

.loading-area div img {
  position: relative;
  left: -50%;
}

.carousel-indicators li {
  border: 1px solid #000;
}

.th-pointer {
  cursor: pointer;
}

.slick-next::before {
  color: black;
}

.slick-prev::before {
  color: black;
}
</style>