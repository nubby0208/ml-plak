<template>
  <div>
    <div class="acciones">

      <b-button
        size="sm"
        style="margin-right: 5px"
        variant="primary"
        @click="newProject"
        v-b-tooltip.hover
        title="Nuevo Proyecto"
      >
        <b-icon icon="file-plus"></b-icon>
      </b-button>
      <b-button
        size="sm"
        class="btn"
        style="margin-right: 5px"
        @click="$emit('open-projectlist-modal')"
        v-b-tooltip.hover
        title="Cargar"
      >
        <b-icon icon="folder-symlink"></b-icon>
      </b-button>
      <b-button
        size="sm"
        class="btn"
        style="margin-right: 5px"
        @click="save"
        v-b-tooltip.hover
        title="Guardar"
      >
        <b-icon icon="folder"></b-icon>
      </b-button>
      <b-button
        size="sm"
        class="btn save-as-button"
        style="margin-right: 5px"
        @click="saveAs"
        v-b-tooltip.hover
        title="Guardar como"
      >
        <b-iconstack font-scale="1">
          <b-icon stacked icon="folder" class="folder-icon"></b-icon>
          <b-icon stacked icon="fonts" scale="0.5" class="fonts-icon"></b-icon>
        </b-iconstack>
      </b-button>
      <b-button
        size="sm"
        variant="danger"
        @click="borrarModulos"
        v-b-tooltip.hover
        title="Borrar Módulos"
      >
        <b-icon icon="trash"></b-icon>
      </b-button>
      <b-button
        size="sm"
        v-if="!readMeObj"
        class="logout-btn mr-3"
        @click="$emit('open-readme-modal')"
        v-b-tooltip.hover
        title="Escribir nota"
      >
        <b-icon icon="file-text"></b-icon>
      </b-button>
      <b-button
        size="sm"
        v-if="readMeObj"
        variant="success"
        class="logout-btn"
        @click="$emit('open-readme-modal')"
        v-b-tooltip.hover
        title="Ver nota"
      >
      <b-icon icon="file-text"></b-icon>
      </b-button>


      <b-button
        size="sm"
        class="btn"
        style="margin-right: 5px"
        @click="closeProyect"
        v-b-tooltip.hover
        title="Cerrar Proyecto"      >
        <b-icon icon="lock"></b-icon>
      </b-button>



      <b-button
        size="sm"
        v-if="!in3d"
        class="logout-btn mr-3"
        @click="$router.push('/3d')"
      >
        <span>3D</span>
      </b-button>
      <b-button
        v-else
        variant="success"
        class="logout-btn mr-3"
        @click="$router.push('/disenio')"
      >
        <span>Diseño</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import { HTTP, EventBus } from "@/index";
import swal from "sweetalert2";

export default {
  components: {},
  props: ['readMeObj'],
  data() {
    return {
      readMe: undefined,
      errorsIn3d: false,
      displayableUsername: "",
      proyectos: [],
      callback:"",
      modulo: "Diseño",
    };
  },
  computed: {
    in3d() {
      return this.$route.name === "3dviewer";
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
    cm() {
      const today = new Date();
      return (
        today.getMonth() === 11 &&
        (today.getDate() === 24 || today.getDate() === 25)
      );
    },
    status3d() {
      return this.$store.state.layout.errorsIn3d;
    },
  },
  created() {
    const creating = localStorage.getItem("creating-project");
    var vuex = JSON.parse(localStorage.getItem('vuex'))
        var  project_token =vuex.info.token_project

    if (creating === "1") {
      let that = this;
       this.callback = function () {
        // cargo el proyecto recien guardado
        HTTP.get(`/api/proyecto-json/last`)
          .then((result) => {
            const proyectos = result.data.proyectos;
            const nombreProyecto = localStorage.getItem(
              "creating-project-name"
            );
            const proyectoId =
              proyectos.nombre === nombreProyecto
                ? proyectos.id
                : proyectos.find((p) => p.nombre === nombreProyecto).id;
            localStorage.removeItem("creating-project-name");
            localStorage.removeItem("creating-project");
            that.proyectoLoad({ id: proyectoId }, false);
          })
          .catch((err) => {
            alert(err +" creating")
            that.$noty.error("Error al cargar proyecto nuevo");
            console.log("err", err);
          });
      };
      if(project_token==""){
          this.regenerate_token()

        }

      return;
    }
  },
  methods: {
    borrarModulos() {
      swal({
        title: "¿Estás seguro de que deseás borrar todos los módulos?",
        text: "Esto eliminará las piezas de cada módulo.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si",
      }).then((result) => {
        if (result.value) {
          this.$store.commit("resetAll");
        }
      });
    },
    regenerate_token(){
      let data = {
          info: this.$store.state.info,
          rotacion: this.$store.getters.getModulesRotacion,
          moduleInfo: this.$store.getters.getModuleInfo,
          parts: JSON.parse(JSON.stringify(this.$store.getters.getPartList)),
          id_cliente: 21,
          id_proyecto: 18,
        };
        HTTP.post(`/api/3dviewer/save_parts`, {
          data: data,
        }).then(async (result) => {
            let resp = result.data.response;
            console.log("new token:", resp.token_project);
            this.$store.commit("setGeneralInfo", {
              key: "token_project",
              value: resp.token_project,
            });
            this.$store.state.info.token_project = resp.token_project;
            this.save(this.callback);
        })

    },
    proyectoLoad(proyecto, template_loaded = true) {
      this.$noty.info("Cargando datos. Por favor, espere ...", {
        timeout: 3000,
      });
      const oldVuew = localStorage.vuex;
      localStorage.vuex = {};
      HTTP.get(`/api/proyecto-json/${proyecto.id}`)
        .then((response) => {
          if (response.data.proyecto) {
            this.setErrorsIn3d(undefined);
            localStorage.vuex = JSON.parse(response.data.proyecto.proyecto);
            this.loadedProjectName = response.data.proyecto.nombre;
            this.loadedProjectId = response.data.proyecto.id;
            localStorage.setItem(
              "projectCreatedAt",
              response.data.proyecto.created_at
            );
            if (template_loaded) {
              window.localStorage.setItem("default_template_loaded", true);
            }
            location.reload();
          }
        })
        .catch((response) => {
          alert(response + "proyectoLoad")
          this.$noty.error("No se pudo cargar el proyecto");
          localStorage.vuew = oldVuew;
        });
    },
    getProjectNameForSave(name) {
      const delimiter = " - v";
      const index = name.lastIndexOf(delimiter);
      if (index >= 0) {
        const versionAndDelimiter = name.substring(name.lastIndexOf(delimiter));
        const version = versionAndDelimiter.substring(delimiter.length);
        const projectName = name.substring(0, name.lastIndexOf(delimiter));
        return projectName + delimiter + (+version + 1);
      } else {
        return name + delimiter + 2;
      }
    },
    async save(cb) {
      let result = {};
      const savingProjectName = localStorage.getItem("creating-project-name");

      if (!this.loadedProjectName && !savingProjectName) {
        result = await swal({
          title: "Guardar",
          input: "text",
          inputPlaceholder: "Nombre del proyecto",
        });
      }
      const projectName = savingProjectName
        ? savingProjectName
        : result.value || this.getProjectNameForSave(this.loadedProjectName);

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
                this.$noty.success("¡Proyecto guardado con éxito!");
                this.loadedProjectName = result.data.nombre;
                this.loadedProjectId = result.data.proyectojson_id;
                if (cb && typeof cb === "function") {
                  cb();
                } else {
                  location.reload();
                }
              }
            })
            .catch((result) => {
              alert(result)
              this.$noty.error("Ups, ha ocurrido un problema");
            });
        }
      }
    },
    async saveAs(name) {
      let self = this;
      var info = this.$store.state.info;
      let actual_token_project = info.token_project;
      let result = await swal({
        title: "Guardar como",
        input: "text",
        inputPlaceholder: "Nombre del proyecto",
      });
      const projectName = result.value;
      if (projectName) {
        this.$noty.info("Guardando proyecto...");
        info.token_project = null;

        let data = {
          info: {
            ...info,
            senia: 0,
            total: 0,
            pagos: [],
            items: [],
            seniaDescripcion: undefined,
            totalDescripcion: undefined,
            saldo: 0,
          },
          rotacion: this.$store.getters.getModulesRotacion,
          moduleInfo: this.$store.getters.getModuleInfo,
          parts: JSON.parse(JSON.stringify(this.$store.getters.getPartList)),
          id_cliente: 21,
          id_proyecto: 18,
        };
        HTTP.post(`/api/3dviewer/save_parts`, {
          data: data,
        })
          .then(async (result) => {
            this.errorsIn3d = false;
            let resp = result.data.response;
            console.log("new token:", resp.token_project);
            self.$store.commit("setGeneralInfo", {
              key: "token_project",
              value: resp.token_project,
            });
            self.$store.commit("setGeneralInfo", { key: "pagos", value: [] });
            self.$store.commit("setGeneralInfo", { key: "senia", value: 0 });
            self.$store.commit("setGeneralInfo", { key: "total", value: [] });
            self.$store.commit("setGeneralInfo", { key: "items", value: [] });
            self.$store.commit("setGeneralInfo", {
              key: "totalDescripcion",
              value: "",
            });
            self.$store.commit("setGeneralInfo", {
              key: "seniaDescripcion",
              value: "",
            });
            self.$store.commit("setGeneralInfo", { key: "saldo", value: 0 });
            this.$store.state.info.token_project = resp.token_project;
            this.setErrorsIn3d(undefined);
            HTTP.post(`/api/proyecto-json`, {
              proyectojson_id: this.loadedProjectId,
              actual_token_project: actual_token_project,
              token_project: resp.token_project,
              mueble:  this.$store.state.info.mueble,
              client_name: this.$store.state.info.name,
              encargado_med: this.$store.state.info.encargadoMed,
              encargado_inst: this.$store.state.info.encargadoInst,
              nombre: projectName,
              address: this.$store.state.info.address,
              phone: this.$store.state.info.phone,
              comentario: this.$store.state.info.comentarioInstalacion,
              estado: this.$store.state.info.estadoProyecto,
              proyecto: JSON.stringify(localStorage.vuex),
              settings: this.$store.state.projectSettings
            })
              .then((result) => {
                if (result.data.success === true) {
                  this.$noty.success("¡Proyecto guardado con éxito!");
                  this.loadedProjectName = projectName;
				          this.loadedProjectId = result.data.proyectojson_id;
                  location.reload();
                }
              })
              .catch((result) => {
                this.$noty.error("Ups, ha ocurrido un problema");
              });
          })
          .catch((result) => {
            if (!this.errorsIn3d) {
              this.errorsIn3d = true;
              this.setErrorsIn3d(result);
            }
          });
      }
    },
    setErrorsIn3d(errors) {
      this.$store.commit("setErrorsIn3d", errors);
    },
    reloadAndReset(){

        const modulo = localStorage.getItem("modulo");
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("user-name");
        const id = localStorage.getItem("user-id");
        const rol = localStorage.getItem("user-rol");
        const usuario = localStorage.getItem("usuario");
        const jwtToken = localStorage.getItem("jwt-token");
        const creatingProject = localStorage.getItem("creating-project");
        const creatingProjectName = localStorage.getItem("creating-project-name");

        localStorage.clear();

        if (creatingProject!= null)
        localStorage.setItem("creating-project", creatingProject);
        if (creatingProjectName!= null)
        localStorage.setItem("creating-project-name", creatingProjectName);
        if (modulo!= null)
        localStorage.setItem("modulo", modulo);
        if (token!= null)
        localStorage.setItem("token", token);
        if (name!= null)
        localStorage.setItem("user-name", name);
        if (id!= null)
        localStorage.setItem("user-id", id);
        if (rol!= null)
        localStorage.setItem("user-rol", rol);
        if (usuario!= null)
        localStorage.setItem("usuario", usuario);
        if (jwtToken!= null)
        localStorage.setItem("jwt-token", jwtToken);

        location.reload();
        //this.setErrorsIn3d(undefined);
    },
    newProject() {
      let self = this;
      //let reloadAndReset = function (proyectoNombre)
      swal({
        title: "¿Desea guardar el proyecto actual?",
        text: "La información que no sea guardada se perderá.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si",
      }).then(async (result) => {
        if (result.dismiss === "overlay") {
          return;
        }

        if (result.value) {
          //self.$store.commit("resetAll");
          /**
           * se inserta funcion para eliminar info de carpetas no se usa localstorage para agilizar el proceso
           */

          await this.save(this.reloadAndReset);
        } else {
          result = await swal({
            title: "Nuevo Proyecto",
            input: "text",
            inputPlaceholder: "Nombre del proyecto",
          });

          this.checkprojectname(result.value)
        }
      });
    },
    checkprojectname(name){
       HTTP.post(`/api/proyecto-json/checkname`, {
              project : name
            }).then(result => {
              if(!result.data.exist){
                   const projectName = name || "Proyecto " + Math.floor(Math.random() * 5000) + 1;
                  localStorage.setItem("creating-project", 1);
                  localStorage.setItem("creating-project-name", projectName);
                  this.$store.commit("resetAll");
                  localStorage.vuex = {}
                  this.reloadAndReset();
                 }else{
                    this.$noty.info("Ya existe un proyecto con ese nombre.", {
                      timeout: 3000,
                    });
                 }
            }).catch(result => {
              console.log(result)
            })
    },

    closeProyect(){

       swal({
        title: "¿Los cambiós no guardados se perderán. ?",
        text: "Desea Continuar.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si",
      }).then((result) => {
       
        if (result.value) {

          // localStorage.clear()
          // localStorage.removeItem("creating-project")
          // localStorage.removeItem("creating-project-name");
          // localStorage.removeItem("modulo");
          
          localStorage.removeItem("creating-project");
          localStorage.removeItem("creating-project-name");
          localStorage.removeItem('projectID')
          localStorage.removeItem('projectloaded')
          localStorage.removeItem('vuex')

          // localStorage.setItem("creating-project", null);
          // localStorage.setItem("creating-project-name", null);
          // localStorage.setItem('projectID', null)
          // localStorage.setItem('projectloaded',false)
          // localStorage.setItem('vuex',null)



        // localStorage.removeItem("creating-project")
          // localStorage.removeItem("creating-project-name");
          // localStorage.removeItem("modulo");

           //  localStorage.setItem("modulo", modulo);
          // this.$store.commit("resetAll");
            
          this.$router.push('/design-start')

          /*
          setInterval(function () { 
            window.location.reload() 
           }, 1000)
          
          */         
          // window.location.reload()
          // this.$router.push('/design-start')
            /*
             setInterval(function () { window.location.reload() }, 2000)
               */
        
            // this.$store.commit("resetAll");
        } 
      });

    },

  },
};
</script>

<style scoped>
.acciones {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
</style>
