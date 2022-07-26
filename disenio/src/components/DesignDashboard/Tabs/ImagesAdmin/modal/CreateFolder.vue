<template>
    <div>
        <div  class="overlay">
            <div class="modal-fix mt-8">
                <div class="modal-header flex">
                    <div style="width:90%;color:white;" class="text-left">
                        Crear nueva carpeta
                    </div>
                    <div>
                        <div @click.prevent="ToggleModal()">
                            <img width="18" src="../../../../../assets/exit.png" alt="">
                        </div>    
                    </div>
                </div>
                <div class="modal-content-fix block text-left">
                    <div class="block ">
                        <label  for="name" >
                            Nombre de la carpeta
                        </label>
                        <input v-model="namefolder"  name="name" id="name" type="text" class="form-control input-md" />
                    </div>
                    <div class="block">
                        <label for="des">
                            Descripcion de la carpeta
                        </label>
                        <textarea v-model="des" name="des" id="des" cols="10" rows="15" class="form-control"></textarea>
                    </div>
                     <div class="block mt-3">
                        <div class="text-center">
                            <button @click.prevent="MakeFolder()" class="btn btn-success">
                                Crear carpeta
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>        
</template>
<script>
export default {
    data(){
        return{
            namefolder:"",
            des:""
        }
    },
    methods:{
        MakeFolder(){
            this.$emit('create-folder',this.namefolder,this.des);
        },
        ToggleModal(){
            this.$emit('toggle-modal');
        }
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
    width:50%;
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
</style>