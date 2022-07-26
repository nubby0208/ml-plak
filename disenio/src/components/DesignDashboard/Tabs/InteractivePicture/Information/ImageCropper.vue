<template>
  <div>
    <div class="image-container">
        <img ref="image" :src="src">
    </div>
    <img :src="destination" class="image-preview">
  </div>
</template>

<script>
import Cropper from 'cropperjs'
export default {
  name: 'ImageCropper',
  props: {
    src: String
  },
  data () {
    return {
      cropper: {},
      destination: {},
      image: {}
    }
  },
  mounted () {
    this.image = this.$refs.image
    this.cropper = new Cropper(this.image, {
      aspectRatio: 16 / 9,
      zoomable: false,
      scalable: false,
      crop: () => {
        const canvas = this.cropper.getCroppedCanvas()
        this.destination = canvas.toDataURL('image/png')
      }
    })
  }
}
</script>
<style scoped>
.image-container{
  float: left;
}
.image-preview{
  width: 448px;
  height: 346px;
  float: left;
  margin-left: 10px;
}
</style>>