<template>
    <div id="app-clientView-list" class="container-fluid">
      <vue-toastr ref="toastr"></vue-toastr>
      <b-overlay :show="loadingList" opacity="0.6" spinner-variant="primary">
        <div class="row pt-2">
          <div class="col-sm-12">
            <div class="input-group">
              <input type="search" id="form1" class="form-control" placeholder="Buscar" v-model="searchText"
                      @keyup="search"/>
              <button type="button" class="btn btn-xs btn-info" @click="filter(searchText)">
                <font-awesome-icon icon="search"></font-awesome-icon>
              </button>
            </div>
          </div>        
        </div>

      <!--

        // opcion visible
        <div class="accordion" role="tablist" >
          <b-card no-body class="mb-1" v-for="(Datos, i) in listData" :key="i">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle.accordion-1 variant="info">{{Datos.titulo}}</b-button>
            </b-card-header>
            <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text><span v-html="Datos.contenido"></span></b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
      -->
      <div class="accordion" role="tablist">
          <b-card no-body class="mb-1" v-for="(Datos, i) in listData" :key="i" >
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block   v-b-toggle="'accordion-'+i"   variant="info">{{Datos.titulo}}</b-button>
            </b-card-header>
            
            <b-collapse :id="'accordion-'+i" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text><span v-html="Datos.contenido"></span></b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
          
             
        </div>
        
      </b-overlay>


      
    </div>
</template>

<script>

  import VueToastr from 'vue-toastr'
  import HelpServiceClass from '../Services/helpService'
  const HelpService = new HelpServiceClass()


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
        searchText: '',

        listData : {},
        user: '',

          text: `
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
          richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
          brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
          tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
          assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
          wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher
          vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
          synth nesciunt you probably haven't heard of them accusamus labore VHS.
        `
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
          let resp = await HelpService.getView()
          if (resp) {

            console.log(`getView data: ${JSON.stringify(resp.data)}`)
            //this.viewsPaginator = resp.data
            // this.viewsPaginator ={}
            this.listData = resp.data
            this.tempData = resp.data
            this.loadingList = false
 
          }

        }catch(e){
          this.loadingList = false
          console.log(`getView Error: ${e}`)
        }
   
      },

      search (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          this.filter(this.searchText)
        }
      },


      filter (searchText){        
        this.listData = this.tempData.filter(item =>{ 
         return (item.titulo.toLowerCase().includes(searchText.toLowerCase()) || item.desc_categoria.toLowerCase().includes(searchText.toLowerCase()) )   
        })
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