<template>
  <div>
      <b-button
        size="sm"
        style="margin-right: 5px"
        variant="primary"
        @click="mostrar"
        title="Notificaciones"
      >
        <b-icon icon="bell-fill"></b-icon>
      </b-button>
    <!-- <div class="icon" id="bell" @click="mostrar"> <img src="https://i.imgur.com/AC7dgLA.png" alt=""> </div> -->
    <div class="notifications" ref="box" id="box">
        <h2>Notificaciones - <span>{{listExportar.length}}</span></h2>
        <div v-for="(item, i) in listExportar" :key="i">
            <div v-if="item.show" @click="item.fun" class="notifications-item">
                <b-icon font-scale="3" :style="{color:item.color}" icon="box-arrow-in-up" aria-hidden="true"></b-icon>
                <div class="text">
                    <h6>{{item.titulo}}</h6>
                    <p>Proyecto: <b>{{item.data.name}} {{item.data.mueble}} ({{item.estado}})</b></p>
                </div>
                <div v-if="permisoShow" @click.stop="ocultar(item, $event)" style="display: flex; position: relative;">
                    <div class="btn-ocultar" style="margin:auto; font-size: 15pt;">
                        <b-icon @click.stop="ocultar(item, $event)" icon="eye-slash-fill"></b-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { HTTP, EventBus } from "@/index";

export default {
  name:"notificacionBar",
  data() {
    return {
      down:false
    };
  },
  computed: {
    permisoShow(){
        var userRol = localStorage.getItem("user-rol");
        return /^(sueldos)$/i.test(userRol);
    },
    listExportar(){
      return this.$store.state.exportar.listExportar.filter(a=>a.show).map((a)=>{
          var msg = "";
          var color = "black";
          if(a.estado == "Peticion"){
              msg = "realizo una peticion para exportar";
              color = "#ffc107";
          }
          
          if(a.estado == "Revisado"){
              msg = "reviso la peticion para exportar";
              color = "#20b141";
          }

          if(a.estado == "Corregir"){
              msg = " solicita que se corregia el proyecto antes de exportar";
              color = "#e26470";
          }
          
          return {
              id: a.id,
              titulo: `${a.nombre_completo} ${msg}`,
              text: `Toca para cargar el proyecto en cuestión`,
              data: a.data,
              usuarios: a.usuarios,
              show: a.show,
              estado: a.estado,
              color: color,
              fun:()=>{
                //   console.log(a);
                  this.proyectoLoad(a.proyect_id);
              }
          };
      });
    },
  },
  created() {
  },
  methods: {
    ocultar(data, e){
        e.preventDefault();
        if(confirm("Estas seguro que quieres ocultar esta notificacion")){
            HTTP.get(`/api/exportar/ocultar/${data.id}`).then(a=>{
                this.getNotificaciones();
            });
        }
    },
    getNotificaciones(){
        this.$store.dispatch("getListExportar");
    },
    setErrorsIn3d (errors) {
      this.$store.commit('setErrorsIn3d', errors)
    },
    proyectoLoad(proyecto_id, template_loaded = true) {
        this.$noty.info("Cargando datos. Por favor, espere ...", {
            timeout: 3000,
        });
        const oldVuew = localStorage.vuex;
        localStorage.vuex = {};
        HTTP.get(`/api/proyecto-json/${proyecto_id}`)
        .then((response) => {
            if (response.data.proyecto) {
                console.log(response.data.proyecto.nombre);
                this.setErrorsIn3d(undefined);
                localStorage.vuex = JSON.parse(response.data.proyecto.proyecto);
                this.loadedProjectName = response.data.proyecto.nombre;
                this.loadedProjectId = response.data.proyecto.id;
                localStorage.setItem("projectName", response.data.proyecto.nombre);
                localStorage.setItem("projectID", response.data.proyecto.id);
                localStorage.setItem("projectloaded", true);
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
      cargarProyecto(text){
          this.mostrar();
          alert(text);
      },
      mostrar(){
        this.getNotificaciones();
        if(this.down){
            this.$refs.box.style.height = '0px';
            this.$refs.box.style.display = 'none';
            this.down = false;
        }else{
            this.$refs.box.style.height = 'auto';
            this.$refs.box.style.display = 'block';
            this.down = true;
        }
      }
  },
};
</script>

<style scoped>
    nav {
    display: flex;
    align-items: center;
    background: #AB47BC;
    height: 60px;
    position: relative;
    border-bottom: 1px solid #495057
}

.icon {
    cursor: pointer;
    margin-right: 50px;
    line-height: 60px
}

.icon span {
    background: #f00;
    padding: 7px;
    border-radius: 50%;
    color: #fff;
    vertical-align: top;
    margin-left: -25px
}

.icon img {
    display: inline-block;
    width: 26px;
    margin-top: 4px
}

.icon:hover {
    display:block;
}

.logo {
    flex: 1;
    margin-left: 50px;
    color: #eee;
    font-size: 20px;
    font-family: monospace
}

.notifications {
    width: 300px;
    height: 0px;
    display:none;
    position: absolute;
    top: 63px;
    right: 62px;
    border-radius: 5px 0px 5px 5px;
    background-color: #fff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
}

.notifications h2 {
    font-size: 14px;
    padding: 10px;
    border-bottom: 1px solid #eee;
    color: #999
}

.notifications h2 span {
    color: #f00
}

.notifications-item {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 6px 9px;
    margin-bottom: 0px;
    cursor: pointer
}

.notifications-item:hover {
    background-color: #eee
}

.notifications-item img {
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 9px;
    border-radius: 50%;
    margin-top: 2px
}

.notifications-item .text h6 {
    color: #777;
    font-size: 16px;
    margin-top: 3px
}

.notifications-item .text p {
    color: #aaa;
    font-size: 12px
}

.btn-ocultar:hover{
  color: #58cd73;
}
</style>
