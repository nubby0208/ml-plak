<template>
<div class="images-admin">
    <folder-modal v-if="show" @toggle-modal="ToggleModal()" @create-folder="MakeFolder"></folder-modal>
    <viewImgModal :estadoComp="estadoComp" :dataSrcImg="dataImage"
                    @close="closeComp"></viewImgModal>

    <h1>Imágenes</h1>
    <div class="gallery">
      <div class="upload-button-container" >
        <div class="first-btn">
          <b-button size="sm" variant="outline-primary" @click="openUploadModal()">Agregar imagenes</b-button>
          <b-button size="sm" variant="link" @click="loadImages()" :disabled="!imagesLoaded">Actualizar galeria</b-button>
        </div>
        <div class="second-btn">
          <b-button size="sm" variant="danger" @click="deleteImages()">Eliminar</b-button>
        </div>

      </div>

      <div ref="lightboxContainer" class="flex mt-2   modulo_scroll">
        <div v-if="!imagesLoaded" style="position:fixed;left:50%;top:0" class="spinner-wrapper">
          <vue-simple-spinner message="Cargando..." size="64"></vue-simple-spinner>
        </div>
        <div v-if="imagesLoaded" class="block seccion-box pl-2 modulo_scroll">
          <div style="height:45px" class="flex box-seccion-menu">
              <div style="width:90%">
                 Organizador de imagenes 
              </div>
              <div style="cursor:pointer;" @click.prevent="ToggleModal()">
                <img width="18" src="../../../../assets/plus.png" alt="">
              </div>
              <div style="cursor:pointer;" class="ml-2" @click.prevent="DeleteFolder()">
                <img width="18" src="../../../../assets/delete.png"  alt="">
              </div>
          </div>
          <div  class="seccion-folder seccion-folder-active flex">

              <div id="General" style="width:80%">
                General
              </div>
                          
              <div class="">
                 {{this.general}}
              </div>
            
          </div>
            <!-- Carpetas de imagenes   -->  
          <div id="fold_container" class="block folders-container">
          </div>

           
        </div>
        <div v-if="imagesLoaded" class="flex-1">
        
          <!-- lista de imagenes  -->
          
          <div class="vue-lightbox modulo_scroll">
            <ul>
               <li :v-if="!noImages" v-for="i in images" :key="i.file" style="cursor:pointer;" class="mb-4">
                
                <div class="container">
                  <div class="row">
                    <div class="col align-self-start px-0 ">
                      <img draggable="true" :id="i.file" @click="viewImg(i)" @dragstart="dragstart" @dragover.stop width="250" height="150" :src="i.src" alt="">
                    </div>
                   
                    <div class="col align-self-end col-auto px-0">
                          <b-button  size="sm" variant="bg-danger" class="mb-2" @click="selectImg(i)" >
                            <b-icon v-if="!i.selected" icon="trash" aria-label="Trash" variant="secondary" ></b-icon>
                            <b-icon v-else  icon="trash" aria-label="Trash" variant="danger" ></b-icon>
                          </b-button>
                    </div>
                  </div>
                </div>
               
              
               </li>
              <div v-if="noImages" class="spinner-wrapper">
                <h3>El proyecto no posee imagenes.</h3>
              </div>

              <div v-if="test">
                  <pre>images : {{images}} </pre>
              </div>
            </ul>

          </div>

        </div>
      </div>

    </div>
    <div class="block text-left">
      <div id="title_folder" class=" title_folder">
         Descripcion de la carpeta
      </div>
      <div id="des_folder">
        {{this.des_folder}}
      </div>
    </div>



    <b-modal ref="uploadModal" hide-footer title="Agregar imagenes" @change="uploadModalChanged">
      <div class="d-block text-center">
          <div class="source-selector">
            <input type="radio" id="pc" :value="1" v-model="imgSrc" @change="imgSrcChanged">
            <label for="pc">Desde la PC</label>
            <input type="radio" id="internet" :value="2" v-model="imgSrc" @change="imgSrcChanged" style="margin-left:15px">
            <label for="internet">Desde Internet</label>
          </div>
         <div class="file-upload-container">
          <div v-if="imgSrc === 1">
            <input ref="file" type="file" id="file" class="file-input" @change="previewFiles" multiple>
            <b-button variant="outline-primary" size="sm" @click="browseFiles">Explorar</b-button>
            <span class="browser-text">{{getBrowserText()}}</span>
          </div>
          <div v-if="imgSrc === 2">
            <div class="add-another-row">
              <b-button variant="outline-primary" size="sm" @click="addMore">Agregar otra</b-button>
            </div>
            <div v-for="(n, i) in availableUrls" class="url-row" :key="i">
              <label for="url">URL:</label>
              <input v-model="url[n]" name="url" id="url" type="text" class="form-control form-control-sm">
              <b-button :class="{invisible: n === 1}" @click="removeAddMore(n)" variant="outline-danger" class="delete-add-more-button" size="sm">Eliminar</b-button>
            </div>
          </div>
          <div class="previews">
            <div class="image-wrapper" v-for="(file, n) in files" :key="file.name">
              <img :src="getImageSrc(file)">
              <b-button @click="removePreviewImage(n)" variant="outline-danger" class="delete-preview-image-button" size="sm">Eliminar</b-button>
            </div>
            <img class="url-preview-image" v-for="u in url" :src="u" :key="u">
          </div>
        </div>
      </div>
        <div class="w-100">
          <b-button variant="primary" size="sm" class="float-right" @click="confirmUpload()">Agregar</b-button>
          <b-button variant="link" size="sm" class="float-right" @click="closeUploadModal()" style="margin-right: 10px">Cancelar</b-button>
        </div>
    </b-modal>
</div>
</template>

<script>
import { HTTP } from '@/plugins/HTTP.js'
import Vue from 'vue'
import lightbox from 'vlightbox'
import VueNoty from 'vuejs-noty'
import FolderModal from './modal/CreateFolder'
import viewImgModal from './modal/ViewImage'


Vue.use(VueNoty, {
  theme: 'metroui'
})
Vue.use(lightbox)

export default {
  data () {
    return {
      test:false,
      imagesLoaded: false,
      noImages: true,
      images: [],
      imagesObj: [],
      files: [],
      imgSrc: 1,
      url: [],
      availableUrls: 1,
      imgSelected: [],
      imgSelectedNew: [],
      show:false,
      general:0,
      currentfold:"General",
      des_folder:"Carpeta General, contiene todas las images del proyecto",
      des_folders:[],


      estadoComp:false,
      dataImage: ""
    }
  },
  components:{
    FolderModal,
    viewImgModal
  },
  mounted: function () {
    this.loadImages()
    // evento seleccion de imagenes
    const handler = (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('img-selected')
        const targetSrc = e.target.src // image source
        if (e.target.classList.contains('img-selected')) {
          this.imgSelected.push(targetSrc)
        } else {
          this.imgSelected.splice(this.imgSelected.findIndex(src => src === targetSrc), 1)
        }
      }
    }

    const container = this.$refs.lightboxContainer
    if (container.addEventListener) {
      container.addEventListener('click', handler, false)
    } else if (container.attachEvent) {
      container.attachEvent('onclick', handler)
    }
  },
  methods: {

    selectImg(img){
      // console.log(`selectImg  img: ${JSON.stringify(img.selected)} **ImagesAdmin/Index.vue`)
      
      this.images.forEach((item ,index) => 
      {        
       
        if (item.file === img.file){
          //  console.log(`selectImg  item: ${JSON.stringify(item.file)} , selected: ${JSON.stringify(item.selected)} ,  index: ${JSON.stringify(index)} **ImagesAdmin/Index.vue`)
          // console.log(`entro file index: ${index}`)
          this.images[index].selected =! this.images[index].selected        
        }
 
      });
    
    },


    

    deleteImages () {
      // console.log(`deleteImages`)

      if(this.images.find(element => element.selected === true) == undefined){

          this.$noty.warning('Debe de seleccionar una o más imagenes para eliminar')

      }else{

          let images = []        
          this.images.forEach(item => {
            if(item.selected === true){
              images.push(item.file)
            }            
          })
          var current = this.currentfold
          HTTP.delete(`/api/v2/images`, { data: { images },current:current }).then((response) => {
            if (response.data.success) {
              this.$noty.success('Imagenes eliminadas con exito')
              this.loadImages()
            }
          }).catch(res => {
            this.$noty.error('Error al eliminar las imagenes')
          })


      }
  



      /*
      const images = []
      this.imgSelected.forEach(imageSrc => {
        images.push(this.imagesObj.find(i => i.src === imageSrc).file)
      })
      var current = this.currentfold
      HTTP.delete(`/api/v2/images`, { data: { images },current:current }).then((response) => {
        if (response.data.success) {
          this.$noty.success('Imagenes eliminadas con exito')
          this.loadImages()
        }
      }).catch(res => {
        this.$noty.error('Error al eliminar las imagenes')
      })
      */
    },

    deleteImagesDragDrop  (img) {
      console.log(`deleteImages  SRC: ${img}`)

      const images = []
      // images.push(this.imagesObj.find(i => i.src === imageSrc).file)
      images.push(img)
      var current = this.currentfold
      //console.log(this.currentfold)

      HTTP.delete(`/api/v2/images`, { data: { images },current:current }).then((response) => {
        if (response.data.success) {
          this.$noty.success('Imagenes eliminadas con exito')
          this.loadImages()
          this.loadFolders()
        }
      }).catch(res => {
        this.$noty.error('Error al eliminar las imagenes')
      })

      
    },

    loadImages () {
      // carga la galeria
      this.imagesLoaded = false
      this.imgSelected = [].splice()

      HTTP.get('/api/v2/images/' + this.projectToken+'/'+this.currentfold, {}
      ).then(result => {
        if (result && result.data) {
          const images = result.data.response.imagenes
          //this.imagesObj = [...result.data.response.imagenes]
          // console.log("debe existir el objeto para poderlo editar")
          images.map(i=>i.selected=false)
          this.imagesObj = [...images]
          this.images = images
          this.noImages = this.images.length === 0
          this.general = result.data.response.imagenes.length
        }
       //  console.log('Imagenes galeria: ', result)
      }).catch(result => {
        console.log('Imagenes galeria error: ', result)
      }).finally(() => {
        this.imagesLoaded = true
        this.loadFolders()
      })
    },
    loadFolders(){
      var folder_des = {}
      this.des_folders = []
      HTTP.post('/api/v2/images/loadfolder', {token:this.projectToken}
      ).then(result => {
        // console.log('loadFolder respuesta: ', result.data.folders)
        const container = document.getElementById('fold_container')
        container.innerHTML = "";
         for (let folder of result.data.folders){
            var content = '<div  class="seccion-folder flex mt-2">'+
                    '<div id="'+folder.folder_name+'" style="width:90%">'+
                      folder.folder_name+
                    '</div>'+
                    '<div class="flex-1">'+
                      folder.files+
                    '</div>'+
                '</div>'
              container.innerHTML += content
            folder_des =
              {name:folder.folder_name,
              value:folder.folder_des}

           //console.log(this.des_folders);
            this.des_folders.push(folder_des)
         }

      }).catch(result => {
        console.log('respuesta: ', result)
      }).finally(() => {
        this.refreshfolders()
      })
    },
    MakeFolder(name,des){
      HTTP.post('/api/v2/images/folder', {name:name,des:des,token:this.projectToken}
      ).then(result => {
        console.log('Nuevo Folder: ', result)
        this.$noty.success('Carpeta creada con exito')
        this.show=false
        const container = document.getElementById('fold_container')
        var content = '<div  class="seccion-folder flex mt-2">'+
                    '<div id="'+folder.folder_name+'" style="width:90%">'+
                      folder.folder_name++
                    '</div>'+
                    '<div class="flex-1">'+
                      '0'+
                    '</div>'+
                '</div>'
        container.innerHTML += content
      }).catch(result => {
        console.log('Imagenes galeria error: ', result)
      }).finally(() => {
        this.loadFolders()
      })
    },
    refreshfolders(){

      const dropbox = document.getElementsByClassName('seccion-folder')
      console.log(dropbox.length)
      for (let i = 0; i < dropbox.length; i++) {
        //dropbox.item(i).addEventListener('dragstart',this.dragstart)
        dropbox.item(i).addEventListener('dragover',this.dragover)
        dropbox.item(i).addEventListener('drop',this.dragdrop)
        dropbox.item(i).addEventListener('click',this.changefolder)
        dropbox.item(i).addEventListener('dragleave',this.dragleave)
      }
       const folders = document.getElementsByClassName('seccion-folder')
          //console.log(dropbox.length)
          for (let i = 0; i < folders.length; i++) {
            folders.item(i).classList.remove('seccion-folder-active')
          }
          var active = document.getElementById(this.currentfold)
          active.parentElement.classList.add('seccion-folder-active')
      //this.loadFolders()
    },
    dragstart(event){
      console.log(event.target.id)
      event.dataTransfer.setData("Text", event.target.id);

    },
    dragover(event){
      event.preventDefault();
      console.log("is upon us")
      
      document.getElementById(event.target.id).style.backgroundColor= "#5999ff"
    },
    dragleave(event){
      document.getElementById(event.target.id).style.backgroundColor= "aliceblue"
    },
    dragdrop(event){
      event.preventDefault();

    
      console.log(event.target.id)
       console.log(`target`)
     console.log(event.target)
      var destino = event.target.id
      var src = event.dataTransfer.getData("Text")
      HTTP.post('/api/v2/images/setfolder', {destino:destino,src:src,token:this.projectToken}
      ).then(result => {
        console.log(`dragdrop ${result}`)
        this.deleteImagesDragDrop(src)
      }).finally(() => {
        
        this.loadFolders()
      })

    },
    changefolder(event){
      console.log(`changefolder ${event.target.id} **/Tabs/ImagesAdmin/Index.vue`)
      this.currentfold = event.target.id
      if(this.currentfold!='General'){
           for(let des of this.des_folders){
             //alert(this.currentfold+' '+des.name)
             if(this.currentfold==des.name)
              this.des_folder=des.value
           }
      }else{
        this.des_folder='Carpeta General, contiene todas las images del proyecto'
      }
      this.loadImages()
    },


    
    getRemoteImage (url, callback) {
      const corsProxy = 'https://cors-anywhere.herokuapp.com/'
      let xhr = new XMLHttpRequest()
      xhr.onload = function () {
        let reader = new FileReader()
        reader.onloadend = function () {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', corsProxy + url)
      xhr.responseType = 'blob'
      xhr.send()
    },
    convertToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    async uploadImages () {
      if (this.imgSrc === 1) {
        // imagenes desde la pc
        for (let i of this.files) {
          this.imagesLoaded = false
          setTimeout(() => {}, 1000) // delay
          Promise.all([
            HTTP.post('/api/v2/images', {
              base64: await this.convertToBase64(i),
              project_name: this.projectToken
            })
          ])
            .then(result => {
              this.$noty.success('Las imagenes se han subido con exito')
            }).catch(result => {
              this.$noty.error('Error al subir una o mas imagenes')
            }).finally(() => {
              this.loadImages()
            })
        }
      } else {
        // imagenes de internet
        this.url.forEach(url => {
          this.getRemoteImage(url, (dataUrl) => {
            this.imagesLoaded = false
            HTTP.post('/api/v2/images', {
              base64: dataUrl,
              project_name: this.projectToken
            }).then(result => {
            }).finally(() => {
              this.loadImages()
            })
          })
        })
      }
    },

  viewImg(imgSelected){
    // alert(`Selecciono la siguiente Imagen ${ImgSrc}`)

    this.dataImage = {img:imgSelected.file, items:this.images }
    this.estadoComp = true

  },

   closeComp(){
      this.estadoComp=false    

  },

    getBrowserText () {
      if (!this.files || this.files.length === 0) {
        return 'No hay archivos seleccionados'
      }

      if (this.files.length === 1) {
        return this.files[0].name
      }

      return this.files.length + ' archivos seleccionados'
    },
    browseFiles () {
      this.$refs.file.click()
    },
    removePreviewImage (index) { 
      console.log(index)
      this.files.splice(index, 1)
    },
    async confirmUpload () {
      await this.uploadImages()
      this.closeUploadModal()
    },
    uploadModalChanged () {
      this.imgSrcChanged()
    },
    addMore () {
      this.availableUrls++
    },
    removeAddMore (index) {
      if (index === 1) {
        return
      }
      this.url.splice(index, 1)
      this.availableUrls--
    },
    imgSrcChanged () {
      this.files = [].splice()
      this.url = [].splice()
      this.availableUrls = 1
      if (this.$refs.file) {
        this.$refs.file.value = ''
      }
    },
    openUploadModal () {
      this.$refs.uploadModal.show()
    },
    closeUploadModal () {
      this.$refs.uploadModal.hide()
      this.imgSrcChanged()
    },
    previewFiles (event) {
      this.files = [...this.files, ...event.target.files]
    },
    getImageSrc (fileObj) {
      return URL.createObjectURL(fileObj)
    },
    ToggleModal(){
      this.show= !this.show;
    },
    DeleteFolder(){
      swal({
        title: "¿Desea eliminar la carpeta?"+this.currentfold,
        text: "Las imagenes segurian estando en la carpeta General.",
        type: "question",
        buttons: {
            cancel: true,
            confirm: "Eliminar",
          },
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.dismiss === "overlay") {
          return;
        }
        if (result) {
           HTTP.post('/api/v2/images/deletefolder', {token:this.projectToken,folder:this.currentfold}
            ).then(result => {
              console.log(result)
            }).finally(() => {
              this.loadFolders()
            })
        } else {
          alert('no')
          return;
        }
      });

    }
  },
  computed: {
    projectToken () {
      let info = this.$store.state.info
      return info.token_project
    }
  }
}
</script>
<style lang="scss" scoped>
.file-input {
  display: none;
}
.image-wrapper {
  img {
    transition: 0.6s;
  }

  &:hover {
    img {
      opacity: 0.2;
    }

    .delete-preview-image-button {
      opacity: 1;
    }
  }

}
.delete-preview-image-button {
  position: relative;
  right: 50%;
  opacity: 0;
  transition: 0.6s;
}
.invisible {
  opacity: 0;
}
.delete-add-more-button {
  margin: 0px 20px;
}
.url-row {
  display: flex;
  align-items: baseline;
}
.add-another-row {
  margin: 20px 0px;
}
.title-modal {
  margin-bottom: 20px;
  display: block;
  font-weight: 700;
}
.upload-button-container {
  text-align: left;
  display: flex;

  .first-btn {
    flex: 1;
  }

  .second-btn {
    margin-right: 40px;
  }
}
.file-upload-container {
  text-align: left;
  margin: 20px 0px;

  label {
    margin-right: 20px;
  }
}
.previews {
  display: flex;
  flex-wrap: wrap;

  img {
    margin: 20px;
    max-width: 300px;
  }
}
.spinner-wrapper {
  margin-top: 10%;
}



 .modulo_scroll{
      height: 65vh; /* 60vh */
      overflow-y: scroll;
  }

  .modulo_scroll::-webkit-scrollbar {
      width: 8px;     /* Tamaño del scroll en vertical */
      height: 8px;    /* Tamaño del scroll en horizontal */
    }

     .modulo_scroll::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    .modulo_scroll::-webkit-scrollbar-thumb:hover {
      background: #b3b3b3;
      box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    }

    .modulo_scroll::-webkit-scrollbar-thumb:active {
      background-color: #999999;
    }

</style>
<style lang="scss">
.vue-lightbox ul {
  max-width: 1075px !important;
}
.vue-lightbox ul li {
  transition: 0.4s;
  margin-left: 8px;
  border: 3px solid transparent;
  list-style: none;
  display: inline-block;
  padding: 0 !important;
  height: 156px;
  &:hover {
    border-color: rgba(0, 157, 230, 0.2);
  }

  &.img-selected {
    border-color: #03a9f4;
  }
}

.seccion-box{
  width:35%;
  height: auto;
  border: 1px solid rgb(194, 194, 194);
  text-align: left;
}

.seccion-folder{
  width: 96%;
  height: 45px;
  padding: 0px;
  border:#ccd5dd;
  background-color: aliceblue;
  color:#4e8abe;
  font-weight: 700;
  z-index: 100;
}
.seccion-folder-active{
  transform: scale(1.03);
  box-shadow: 1px 3px 3px 1px gray;
}
.box-seccion-menu{
  padding: 10px;
}
.title_folder{
  font-size: 16px;
  text-decoration: underline;
  color: #03a9f4;

}
.flex{
  display: flex;
}
</style>
