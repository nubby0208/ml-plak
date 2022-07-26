<template>
  <div class="d-block text-center file-input-container">
    <div v-if="false" class="source-selector">
      <input type="radio" id="pc" :value="1" v-model="imgSrc" @change="imgSrcChanged">
      <label for="pc">Desde la PC</label>
      <input type="radio" id="internet" :value="2" v-model="imgSrc" @change="imgSrcChanged" style="margin-left:15px">
      <label for="internet">Desde Internet</label>
    </div>
    <div class="file-upload-container">
      <div v-if="imgSrc === 1">
        <input ref="file" type="file" id="file" class="file-input" @change="previewFiles" multiple>
        <div v-if="!this.isComplete()">
          <b-button variant="outline-primary" size="sm" @click="browseFiles">Explorar</b-button>
          <span class="browser-text">{{getBrowserText()}}</span>
        </div>
      </div>
      <div v-if="imgSrc === 2 && !this.isComplete()">
        <div class="add-another-row">
          <b-button  variant="outline-primary" size="sm" @click="addMore">Agregar otra</b-button>
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

        <div class="image-wrapper" v-for="(u, n) in url" :key="n">
          <img :src="u">
          <b-button @click="removeAddMore(n)" variant="outline-danger" class="delete-preview-image-button" size="sm">Eliminar</b-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientViewFileInput',
  data () {
    return {
      files: [],
      url: [],
      availableUrls: 0,
      imgSrc: 1
    }
  },
  props: {
    fileUrl: {
      type: Array,
      default: () => { return [''] }
    },
    file: {
      type: Object,
      default: () => { return {} }
    },
    limit: {
      type: Number,
      default: 1
    },
    length: {
      type: Number,
      default: 20480
    }
  },
  mounted () {
    for (let i = 0; i < this.fileUrl.length; i++) {
      if (this.fileUrl[i].length > 0) {
        this.availableUrls++
        this.url.push(this.fileUrl[i])
      }
    }
  },
  methods: {

    previewFiles (event) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > 0 && (event.target.files[i].size / 1024) > this.length) {
          this.$emit('fileErrorLength', {
            file: event.target.files[i],
            files: this.files,
            urls: this.url,
            length: this.length * 1024
          })
          return
        }
      }
      this.files = [...this.files, ...event.target.files]
      this.file.files = this.files
      this.$emit('addFile', {file: event.target.files, files: this.files, urls: this.url})
    },
    browseFiles () {
      this.$refs.file.click()
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
    addMore () {
      this.availableUrls++
    },
    removeAddMore (index) {
      let urlC = this.url[index]
      this.url.splice(index, 1)
      this.availableUrls--
      this.$emit('removedUrl', {url: urlC, urls: this.url, files: this.files})
    },
    getImageSrc (fileObj) {
      return URL.createObjectURL(fileObj)
    },
    removePreviewImage (index) {
      let file = this.files[index]
      this.files.splice(index, 1)
      this.$emit('removedFile', {file: file, files: this.files, urls: this.url})
    },

    isComplete () {
      return this.limit === -1 ? false : this.files.length + this.url.length === this.limit
    },

    imgSrcChanged () {
      this.files = [].splice()
      this.url = [].splice()
      this.availableUrls = 0
      if (this.$refs.file) {
        this.$refs.file.value = ''
      }
    }
  }
}
</script>

<style  lang="scss" scoped>

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

</style>
