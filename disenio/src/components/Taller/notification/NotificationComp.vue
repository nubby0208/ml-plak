<template>
    <div id="app-clientView-list" class="container-fluid">




      <b-modal id="modal-show" hide-footer size="lg" header-class="my-class">
        <template #modal-title>
         {{title}} Notificaciones ( {{user.nombre_completo}})
        </template>


            <b-card :header="Datos.titulo"  v-for="(Datos, i) in listData" :key="i" title="" class="mb-2" >
              <b-card-text>
                <span v-html="Datos.contenido"></span>
                <!--{{Datos.contenido}} -->
              </b-card-text>
            </b-card>



      </b-modal>

      
    </div>
</template>

<script>

  import VueToastr from 'vue-toastr'
 
  import NotificactionServiceClass from '../Services/notificationService'

  const NotificationService = new NotificactionServiceClass()


  export default {
    components: {
      VueToastr
    },
    data () {
      return {

        loadingList: false,
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        
        title: null,
        test:false,

        listData : {},
        user: '',

        listSectores:[
          {id: "/design-dashboard", descripcion:"Vista de Diseño"},
          {id: "/notification", descripcion:"Test de Notificación"},          
          {id: "/taller", descripcion:"Taller"},
          {id: "/presupuestos", descripcion:"Presupuestos"},
          {id: "/compras", descripcion:"Compras"},
           {id: "/calendar", descripcion:"Calendario"},
          {id: "/tareacalendar", descripcion:"Tareas"},
          {id: "/asistencia", descripcion:"Asistencia"},
          {id: "/MiProduccion", descripcion:"Mi Producción"},
          {id: "/produccion", descripcion:"Informacion de Producción"},
          {id: "/estados", descripcion:"Estados"},
          {id: "/Lasistencia", descripcion:"Mi Sueldo"}
        ],
        
      }

    },
    mounted () {

      this.loadMain()

    },
    methods: {
      loadMain(){
        this.limpForm()
        this.getView()

      },


      async getView () {
        try{

          this.loadingList = true
          if ((this.store) && (this.store !== undefined)) {
            console.log(JSON.stringify(this.store))
          }
           let usuario_id = localStorage.getItem("user-id") 
          //  this.user = localStorage.getItem("user-name")
 
          let resp = await NotificationService.getNotUsuario(usuario_id, this.$route.path)
           
          if (resp) {
            // getNotUsuario
            // console.log(`LOCAL STORE: ${JSON.stringify(localStorage)}`)
            console.log(`getView data: ${JSON.stringify(resp.data)}`)
            this.listData = resp.data
            this.user = resp.user[0]
            this.loadingList = false
            if(resp.data.length > 0){
                this.$bvModal.show('modal-show')
            }
          }


        }catch(e){
          this.loadingList = false
          console.log(`getView Error: ${e}`)
        }
   
      },


      limpForm(){
        this.listData = {}
      }


    }
  }
</script>

<style scoped>
 .my-class { 
  background: black;
  color: rgb(138, 83, 83);
}

.my-second-class > .modal-dialog > .modal-content > .modal-header {
  background: black;
  color: rgb(153, 60, 60);
}
</style>