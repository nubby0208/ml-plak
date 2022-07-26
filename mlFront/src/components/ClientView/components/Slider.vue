<template>
  <div>
    <div v-if="images.length > 0" class="Slide">
      <div class="SlideImage">
        <transition-group name="fade" tag="div">
          <div v-for="i in [currentIndex]" :key="i">
            <img v-if="currentImg.url" :src="currentImg.url"/>
          </div>
        </transition-group>
      </div>
      <div class="SlideControls">
        <a class="prev" @click="prev">&#10094;</a>
        <a class="next" @click="next">&#10095;</a>
        <a v-for="(item, i) in images" :key="i" @click="setIndex(i)" class="dot" v-bind:class="{ active: i == currentPos }" :title="item.text"></a>
        <p class="imageText" v-if="currentImg.text" >{{ currentImg.text }}</p>
      </div>
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
      currentIndex: 0,
      currentPos: 0
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
    // this.startSlide()
  },

  methods: {
    startSlide: function () {
      this.timer = setInterval(this.next, 15000)
    },

    next: function () {
      this.currentIndex += 1
      this.changeIndex()
    },

    prev: function () {
      this.currentIndex -= 1
      this.changeIndex()
    },

    changeIndex: function () {
      this.currentPos = Math.abs(this.currentIndex) % this.images.length
      this.currentIndex = this.currentPos
    },

    setIndex: function (index) {
      this.currentPos = this.currentIndex = index
    },

    defaultImage () {
      return `${process.env.BACKEND_BASE_URL}/images/templates/not_img.jpg`
    },

    initMethod () {
      this.currentIndex = 0
      this.currentPos = 0
    }
  },

  computed: {
    currentImg: function () {
      let result = this.images[this.currentPos]
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
    top: 0;
    padding: 10px;
    width: auto;
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
  }

  .SlideImage{
    min-height: 450px;
  }

  .SlideControls{
    position: relative;
    text-align:center;
    background-color: #2d2d2d;
    color: white;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 15px;
  }

  .imageText{
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    text-align: left;
  }

  .dot {
    height: 15px;
    width: 15px;
    margin: 0 2px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.6s ease;
  }

  .dot.active, .dot:hover{
    background-color: white;
  }

  @media (max-width: 540px) {
    img {
      width: 100%;
    }
    .Slide{
      max-width: 100vw;
    }
  }
</style>
