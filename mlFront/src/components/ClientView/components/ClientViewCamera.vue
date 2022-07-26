<template>
  <div class="camera-box">
    <div style="display: flex; justify-content: center;">
      <img style="height: 25px;" v-if="isCameraOpen"
           src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png"
           class="button-img camera-shoot" @click="capture"/>

      <div class="camera-button" v-if="this.limit > this.files.length">
        <button type="button" class="button is-rounded cam-button"
                style="margin-left: 40%; background-color: white; border: 0px;border-radius: 50%; padding: 10px; margin-bottom: 5px;"
                @click="toggleCamera">

          <span v-if="!isCameraOpen"><img style="width: 50px;" class="button-img"
                                          src="@/assets/camera.png" alt=""></span>

          <span v-else><img style="height: 25px;" class="button-img"
                            src="https://img.icons8.com/material-outlined/50/000000/cancel.png"></span>
        </button>
      </div>

    </div>

    <div class="d-flex justify-content-center">
      <div v-if="isCameraOpen" class="camera-canvas">
        <video ref="camera" width="90%" autoplay></video>
<!--        <video ref="camera" :width="canvasWidth" :height="canvasHeight" autoplay></video>-->
        <canvas v-show="false" id="photoTaken" ref="canvas" :width="canvasWidth"
                :height="canvasHeight"></canvas>
      </div>
    </div>

    <div class="previews">
      <div class="image-wrapper d-flex justify-content-start" v-for="(file, n) in files" :key="file.name">
        <img :src="getImageSrc(file)">
        <b-button @click="removePreviewImage(n)" variant="outline-danger" class="delete-preview-image-button" size="sm">Eliminar</b-button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientViewCamera',
  data () {
    return {
      isCameraOpen: false,
      canvasHeight: 800,
      canvasWidth: 800,
      files: []
    }
  },
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  methods: {
    toggleCamera () {
      if (this.isCameraOpen) {
        this.isCameraOpen = false
        this.stopCameraStream()
      } else if (this.limit > this.files.length) {
        this.isCameraOpen = true
        this.startCameraStream()
      }
    },
    startCameraStream () {
      const constraints = (window.constraints = {
        audio: false,
        video: true
      })
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.$refs.camera.srcObject = stream
        }).catch(error => {
          alert('El navegador no soporta la camara o tiene algun error.' + error)
        })
    },

    stopCameraStream () {
      let tracks = this.$refs.camera.srcObject.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
    },

    capture () {
      const FLASH_TIMEOUT = 50
      let self = this
      setTimeout(() => {
        const context = self.$refs.canvas.getContext('2d')
        context.drawImage(self.$refs.camera, 0, 0, self.canvasWidth, self.canvasHeight)
        const dataUrl = self.$refs.canvas.toDataURL('image/jpeg')
          .replace('image/jpeg', 'image/octet-stream')
        // self.addToPhotoGallery(dataUrl)
        self.uploadPhoto(dataUrl)
        self.isCameraOpen = false
        self.stopCameraStream()
      }, FLASH_TIMEOUT)
    },

    uploadPhoto (dataURL) {
      let uniquePictureName = this.generateCapturePhotoName()
      let capturedPhotoFile = this.dataURLtoFile(dataURL, uniquePictureName + '.jpg')
      this.files.unshift(capturedPhotoFile)
      this.$emit('addFile', {file: capturedPhotoFile, files: this.files})
    },

    generateCapturePhotoName () {
      return Math.random().toString(36).substring(2, 15)
    },

    dataURLtoFile (dataURL, filename) {
      let arr = dataURL.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {type: mime})
    },

    getImageSrc (fileObj) {
      return URL.createObjectURL(fileObj)
    },

    removePreviewImage (index) {
      let file = this.files[index]
      this.files.splice(index, 1)
      this.$emit('removedFile', {file: file, files: this.files})
    }
  }
}
</script>

<style lang="scss"  scoped>
  .camera-box {
    padding: 2px;
    width: 90%;
    min-height: 300px;
  }
  .camera-canvas{
    max-width: 400px;
  }

  .previews {
    display: flex;
    flex-wrap: wrap;

    img {
      margin: 20px;
      max-width: 300px;
    }
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
    max-height: 2rem;
    top: 40%;
  }

  @media (max-width: 720px) {
    .camera-canvas{
      max-width: 90%;
    }
  }
</style>
