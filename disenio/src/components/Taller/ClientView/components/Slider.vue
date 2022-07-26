<template>
  <div>
    <div v-if="images.length > 0" class="Slide">
      <transition-group name="fade" tag="div">
        <div v-for="i in [currentIndex]" :key="i">
          <img v-if="currentImg.url" :src="currentImg.url"/>
          <p class="imageText" v-if="currentImg.text" >{{ currentImg.text }}</p>
        </div>
      </transition-group>
      <a class="prev" @click="prev" href="#">&#10094;</a>
      <a class="next" @click="next" href="#">&#10095;</a>
    </div>
    <div v-else class="Slide">
      <img :src="defaultImage()"/>
    </div>
  </div>
</template>


<script>
    export default {
      name: 'Slider',
      data () {
        return {
          timer: null,
          currentIndex: 0
        }
      },

      props: {
        images: {
          type: Array,
          default: () => {
            return [
              {
                url: 'https://cdn.pixabay.com/photo/2015/12/12/15/24/amsterdam-1089646_1280.jpg',
                text: 'Texto de esplicacion de la imagen que se muestra arriba.'
              },
              {
                url: 'https://cdn.pixabay.com/photo/2016/02/17/23/03/usa-1206240_1280.jpg',
                text: 'Texto de esplicacion de la imagen que se muestra arriba. Texto de esplicacion de la imagen que se muestra arriba.'
              },
              {
                url: 'https://cdn.pixabay.com/photo/2015/05/15/14/27/eiffel-tower-768501_1280.jpg',
                text: 'Texto de esplicacion de la imagen que se muestra arriba. Texto de esplicacion de la imagen que se muestra arriba. Texto de esplicacion de la imagen que se muestra arriba.'
              },
              {
                url: 'https://cdn.pixabay.com/photo/2016/12/04/19/30/berlin-cathedral-1882397_1280.jpg',
                text: null
              }
            ]
          }
        }
      },

      mounted: function () {
        this.startSlide()
      },

      methods: {
        startSlide: function () {
          this.timer = setInterval(this.next, 15000)
        },

        next: function () {
          this.currentIndex += 1
        },

        prev: function () {
          this.currentIndex -= 1
        },

        defaultImage (){
          return `${process.env.BACKEND_BASE_URL}/images/templates/not_img.jpg`
        }
      },

      computed: {
        currentImg: function () {
          let result = this.images[Math.abs(this.currentIndex) % this.images.length]
          if (!result.url) result.url = this.defaultImage()
          return result
        }
      }
    }
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 3.9s ease;
    overflow: hidden;
    visibility: visible;
    position: absolute;
    width:100%;
    opacity: 1;
  }

  .fade-enter,
  .fade-leave-to {
    visibility: hidden;
    width:100%;
    opacity: 0;
  }

  img {
    height: 450px;
    width: 450px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .prev, .next {
    cursor: pointer;
    position: absolute;
    top: 40%;
    width: auto;
    padding: 16px;
    color: white;
    font-weight: bold;
    font-size: 18px;
    transition: 0.7s ease;
    border-radius: 0 4px 4px 0;
    text-decoration: none;
    user-select: none;
  }

  .next {
    right: 0;
  }

  .prev {
    left: 0;
  }

  .prev:hover, .next:hover {
    background-color: rgba(0,0,0,0.9);
  }

  .Slide{
    position: relative;
    width: 450px;
    min-height: 600px;
  }

  .imageText{
    padding: 10px;
    background-color: #2d2d2d;
    color: white;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
</style>
