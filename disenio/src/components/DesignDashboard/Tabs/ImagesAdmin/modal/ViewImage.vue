<template>
<div>
    <b-modal ref="view-img-modal" v-model="estadoComp" size="lg" hide-footer title="">
        <div  v-if="tipoParametro == 'string'"  class="d-block d-flex justify-content-center">
            <b-img thumbnail fluid rounded :src="dataSrcImg" alt="Image 1"></b-img>
        </div>

        <div v-if="tipoParametro == 'object'">
            <b-carousel

                v-model="slidePosition"
                id="carouselImg"                
                :interval="6000"
                controls
                indicators
                background="#ababab"
               
                style="text-shadow: 1px 1px 2px #333;"
                >

        
           
            
           
            <b-carousel-slide
                v-for="item in carouselItems" 
                :key="item.id"
                v-bind:img-src="item.src">
               
             </b-carousel-slide>
                

            <!--
                 :src="item.src"

            <b-carousel-slide
                caption="Second Slide"
                img-src="https://picsum.photos/1024/480/?image=12"
                ></b-carousel-slide>
                -->

    </b-carousel>
        </div>

    </b-modal>
</div>

</template>

<script>



export default {
     name:'MondalImg',
      props:["estadoComp", "dataSrcImg"],
    data () {
        return {  
            tipoParametro : null,
            slidePosition: 0,
            carouselItems : []
        }
    },


    mounted: function () {
    
    },

     watch: {
            // cada vez que la pregunta cambie, esta función será ejecutada
        estadoComp() {
        
            if(!this.estadoComp){
                this.$emit('close', false);
            }

            this.loadMain()
        },

        
        



    },


    methods: {
       
        loadMain(){
            // console.log(`Tipo de Parametros: ${typeof(this.dataSrcImg)}`)
            // console.log(`Parametros: ${ JSON.stringify(this.dataSrcImg)}`)
            this.slidePosition = 0
            this.tipoParametro = typeof(this.dataSrcImg)

            if(this.tipoParametro == "object"){

                const newValor = []; 
                let items  = this.dataSrcImg.items
                
                for (let i = 0; i < items.length; i++) {
                    // console.log(i)
                    items[i].id =  i
                    console.log(items[i].file)
                    newValor.push({ id: i, src:items[i].src});
               
                    // IMAGEN SELECCIONADA 
                     if(this.dataSrcImg.img == items[i].file){
                        this.slidePosition = i

                     }
                }

                this.carouselItems = newValor
                
            }


        },

        prev() {
            this.$refs.carouselImg.prev()
        },
        next() {
            this.$refs.carouselImg.next()
        },


        close(){
            alert("cerrar modal")
        }

    },
    computed: {}
  
}
</script>
<style lang="scss" scoped>

</style>
