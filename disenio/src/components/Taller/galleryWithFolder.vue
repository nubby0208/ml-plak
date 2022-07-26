<template>
    <div>
        <div class="overlay">
            <div class="modal-fix mt-8">
                <div class="modal-content-fix block text-left">
                    <div class="modal-header" >
                        <div style="display:inline-flex">
                            <div @click="ToggleModal()">
                                <img width="18" src="../../assets/exit.png" alt="">
                            </div>
                            <div style="margin-left:20px;color:white">
                                Imagenes del projecto
                            </div>                            
                        </div>
                    </div>
                   <div class="gallery">   
                        
                        <div v-if="!imagesLoaded" style="position:fixed;left:50%" class="spinner-wrapper">
                            <vue-simple-spinner message="Cargando..." size="64"></vue-simple-spinner>
                        </div>
                        <div ref="lightboxContainer" class="flex mt-3">
                            <div v-if="imagesLoaded" class="block seccion-box">
                                <div  class="block text-left">
                                    <div id="title_folder" class=" title_folder">
                                        Descripcion de la carpeta
                                    </div>
                                    <div id="des_folder">
                                        {{this.des_folder}}
                                    </div>
                                </div>
                                <div  class="seccion-folder seccion-folder-active flex">
                                    <div id="General" style="width:90%">
                                        General
                                    </div>
                                    <div class="">
                                        {{this.general}}
                                    </div>
                                </div>
                                <div id="fold_container" class="block folders-container">   
                                </div>
                            </div>
                            <div v-if="imagesLoaded && !noImages" class="flex-1">
                            <!--<lightbox draggable="true"   :images="images" :nav="true"></lightbox>-->
                            <div class="vue-lightbox">
                                <ul style="padding-left:12px">
                                <li v-for="i in images" :key="i.file">
                                    <img  :id="i.file" class="img-fluid"  width="225" height="150" :src="i.src" alt="" >
                                </li>
                                </ul>
                            
                            </div>

                            </div>
                        </div>      
                            <div v-if="noImages" class="spinner-wrapper">
                                <h3>El proyecto no posee imagenes.</h3>
                            </div>
                        </div>
                </div>
            </div>
            <image-gallery ref="ImgGallery"></image-gallery> 
        </div>
        
    </div>       
                     
</template>
<script>
import { HTTP } from '@/plugins/HTTP.js'
import ImageGallery from "./image-gallery.vue";
export default {
    props:[
    'images_project',
    'token_project'
    ],
    data(){
        return{
            imagesLoaded:false,
            images:[],
            noImages:false,    
            des_folders:[],
            currentfold:"General",
            general:0,
            des_folder:'Carpeta General, contiene todas las images del proyecto',
            imgSelected:[],            
        }
    },
    mounted:function(){
        //this.loadgallery();
          this.modalload()
         //document.getElementsByClassName('overlay').item(0).addEventListener('click',this.ToggleModal)
         this.loadFolders()

         const handler = (e) => {
      if (e.target.tagName === 'IMG') {
        //e.target.classList.toggle('img-selected')

        //const targetSrc = e.target.src // image source
        //const element =document.getElementById(e.target.id)
        //alert(element.getAttribute('data-size').split('x'))
        //var size = element.getAttribute('data-size').split('x')
        this.images.forEach(element => {
            const targetSrc = element.src
            const imgX =  element.w
            const imgY = element.h

            var size = []
            size.push(imgX);
            size.push(imgY);
            var item = {
                src: targetSrc,
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            }
            this.imgSelected.push(item)
        });
            this.loadgallery()
        /*if(window.innerWidth>700){
            var x =  (window.innerWidth > 0) ? window.innerWidth : screen.width;
            var y =  (window.innerHeight > 0) ? window.innerHeight : screen.height;
        }else{
            var x =  (window.innerWidth > 0) ? window.innerWidth+300: screen.width+300;
            var y =  (window.innerHeight > 0) ? window.innerHeight : screen.height;
        }*/
        
        //var x =   window.innerWidth;
        //var y =   window.innerHeight;
        

        
        
      }
    }

    const container = this.$refs.lightboxContainer
    if (container.addEventListener) {
      container.addEventListener('click', handler, false)
    } else if (container.attachEvent) {
      container.attachEvent('onclick', handler)
    }
    },
    components: {
        ImageGallery
    },
    methods:{
        ToggleModal(){
            this.$emit('toggle-modal');
        },
        loadgallery(){
            this.$refs.ImgGallery.openGallery(this.imgSelected);
            this.imgSelected=[]
        },
        modalload(){
            
            if(this.images_project.length>0){
                this.imagesLoaded=true
                this.images= this.images_project
                this.general= this.images_project.length
            }else{
                this.noImages=true;
            }

        },
        loadFolders(){
        var folder_des = {}
        HTTP.post('/api/v2/images/loadfolder', {token:this.token_project}
        ).then(result => {
            console.log('respuesta: ', result.data.folders)
            const container = document.getElementById('fold_container')
            container.innerHTML = "";
            var des = ""
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
               des = {name:folder.folder_name,value:folder.folder_des}
                this.des_folders.push(des)
            }
            
        }).catch(result => {
            console.log('respuesta: ', result)
        }).finally(() => {
            this.refreshfolders()
        })
        },
        refreshfolders(){
            
            const dropbox = document.getElementsByClassName('seccion-folder')
            console.log(dropbox.length)
            for (let i = 0; i < dropbox.length; i++) {            
                dropbox.item(i).addEventListener('click',this.changefolder)
            }
            const folders = document.getElementsByClassName('seccion-folder')
                //console.log(dropbox.length)
                for (let i = 0; i < folders.length; i++) {
                    folders.item(i).classList.remove('seccion-folder-active')
                }
                const active = document.getElementById(this.currentfold)
                active.parentElement.classList.add('seccion-folder-active')
                
            },
        changefolder(event){
            //alert(event.target.id)
            this.currentfold = event.target.id
            if(this.currentfold!='General'){
                for(let des of this.des_folders){

                    if(this.currentfold==des.name)
                    console.log(this.currentfold+" | "+des.value)
                    this.des_folder=des.value
                }
            }else{
                this.des_folder='Carpeta General, contiene todas las images del proyecto'
            }
            this.loadImages()
        },
        loadImages () {
      // carga la galeria
      this.imagesLoaded = false
      this.imgSelected = [].splice()
      
      HTTP.get('/api/v2/images/' + this.token_project+'/'+this.currentfold, {}
      ).then(result => {
        if (result && result.data) {
          const images = result.data.response.imagenes
          //this.imagesObj = [...result.data.response.imagenes]
          this.images = images
          //this.noImages = this.images.length === 0
          //this.general = result.data.response.files.length
        }
        console.log('Imagenes galeria: ', result)
      }).catch(result => {
        console.log('Imagenes galeria error: ', result)
      }).finally(() => {
        this.imagesLoaded = true
        this.loadFolders()
      })
    },
    }
    
}
</script>
<style>
.overlay{
    position: fixed;
    top:0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y:auto;
}

.modal-fix{
    width:100% !important;
    margin: auto;
    box-shadow: 1px 2px 2px 1px rgba(150,150,150,0.12);
    border-radius: 8px;
    background-color: white;
    }

.modal-header{
    width: 100%;
    height: 45px;
    padding: 10px;
    background-color: rgb(63, 174, 211);
    color: rgb(33, 95, 175);
    border-radius: 8px;
}

.modal-content-fix{
    width: 100%;
    height: auto;
    padding: 25px;
    background: white;
}

.seccion-box{
  width:35%;
  height: auto;
  border: 1px solid rgb(194, 194, 194);
  text-align: left;
}

.seccion-folder{
  width: 100%;
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
  height: 156px;
  &:hover {
    border-color: rgba(3, 169, 244, 0.2);
  }

  &.img-selected {
    border-color: #03a9f4;
  }
}

@media screen and (max-width: 500px) {
    .flex{
        display: block  !important;
    }
    .seccion-box{
        width: 100% !important;
    }
    .vue-lightbox{
        margin-left: 0;
        display: block;
    }
}
</style>