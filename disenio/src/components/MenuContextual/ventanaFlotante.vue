<template>
    <div v-show="showVentanaComp">
            <div :style="{'top':top, 'left':left, 'max-width': max_width, 'max-height': max_height, 'overflow-x': 'auto'}" ref="mydiv" id="mydiv">
                <div ref="mydivheader" id="mydivheader">
                  
                  <div>{{titulo}}</div>
                  <b-icon class="bg-danger" @click="cerrarVentanas" color="danger" variant="light" icon="x" style="width: 35px; height: 25px; margin-left:auto; cursor:pointer;"></b-icon>
                  <!-- @click="cerrarVentanas" -->
                </div>
                <div id="moduleIndex" :style="{zoom:zoom}" ref="contenidoVentana">
                    <div></div>
                </div>
            </div>
        </div>
</template>
<script>

export default {
    name:"ventanaFlotante",
    props: {
      showVentana: {
        type: Boolean,
        default: false
      },
      max_width: {
        type: String,
        default: "700px"
      },
      titulo: {
        type: String,
        default: ""
      },
      zoom: {
        type: String,
        default: "1"
      },
      top: {
        type: String,
        default: "100px"
      },
      left: {
        type: String,
        default: "initial"
      },
      max_height: {
        type: String,
        default: "700px"
      },
    },
    data(){
        return {
            elmnt:null,
            pos1:null,
            pos2:null,
            pos3:null,
            pos4:null
        }
    },
    mounted(){
        this.dragElement(this.$refs.mydiv);
    },
    methods:{
        cerrarVentanas(){
          this.$emit("close");
        },
        dragElement(elmnt) {
            this.elmnt = elmnt;
            this.pos1 = 0;
            this.pos2 = 0;
            this.pos3 = 0;
            this.pos4 = 0;
            this.$refs.mydivheader.onmousedown = this.dragMouseDown;
        },
        dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            this.pos3 = e.clientX;
            this.pos4 = e.clientY;
            document.onmouseup = this.closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = this.elementDrag;
        },
        elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            this.pos1 = this.pos3 - e.clientX;
            this.pos2 = this.pos4 - e.clientY;
            this.pos3 = e.clientX;
            this.pos4 = e.clientY;
            // set the element's new position:
            this.elmnt.style.top = (this.elmnt.offsetTop - this.pos2) + "px";
            this.elmnt.style.left = (this.elmnt.offsetLeft - this.pos1) + "px";
        },
        closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },
    computed:{
      showVentanaComp(){
        return this.showVentana;
      }
    }
}
</script>
<style scoped>
    #mydiv {
    position: absolute;
    z-index: 9;
    background-color: #f1f1f1;
    border: 1px solid #d3d3d3;
    text-align: center;
    }

    #mydivheader {
      padding: 10px;
      cursor: move;
      z-index: 10;
      background-color: #98a5af;
      color: #fff;
      display: flex;
    }

    .mydivheader {
    padding: 10px;
    cursor: pointer;
    z-index: 10;
    background-color: #eeeeee;
    color: #98a5af;
    }
</style>

<style lang="scss">
/** Utilizar id del componente porque se rompe la UI si se pone scoped
 * Al mismo tiempo no tiene que afectar todo el sitio, porque se rompe taller */

@mixin personalized-scroll {
  &::-webkit-scrollbar {
    width: 2px;     /* Tamaño del scroll en vertical */
    height: 2px;    /* Tamaño del scroll en horizontal */
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #b3b3b3;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #999999;
  }
}

#moduleIndex .bordered-container .bordered-section {
    border: 1px solid #ccc;
    padding: 5px;
    padding-top: 13px;
}

#moduleIndex #view-panel {
  height: 91vh;
  overflow-y: scroll;
  @include personalized-scroll;
}
#moduleIndex #edit-panel {
  font-size: 12px;
  h4 {
    font-size: 18px;
  }
  & .edit-module{
    height: 54vh;
    overflow-y: scroll;
    @include personalized-scroll;
  }
  & > .bordered-container:first-child {
    & > div:first-child{
      position: absolute;
      & > div {
        top: -15px;
      }
    }
  }
}

#moduleIndex .modal-body {
  max-height: calc(100vh - 130px);
  overflow-y: auto;
}

#moduleIndex .modal-dialog {
  max-width: 1200px !important;
}

#moduleIndex .modulo-actions-row {
  display: flex;
  position: relative;
  left: -15px;
  width: 100%;
}
#moduleIndex .modulo-actions-row button {
  height: 30px;
  margin: 0px 2px;
  font-size: 12px;
}
#moduleIndex .modulo-selector {
  margin-right: 10px;
}
#moduleIndex .flex {
  display: flex;
}
#moduleIndex .flex-1 {
  flex: 1;
}
#moduleIndex .align-items-center {
  align-items: center;
}
#moduleIndex .modulo-actions-label {
  font-size: 20px;
}
#moduleIndex.margin-right-10 {
  margin-right: 10px;
}
#moduleIndex.margin-right-20 {
  margin-right: 20px;
}
#moduleIndex.margin-top-10 {
  margin-top: 10px;
}
#moduleIndex .label-10 {
  font-size: 10px;
}
#moduleIndex .comment-description {
  width: 85px;
  display: inline-block;
}
#moduleIndex .btn.ml-plak-btn,
#moduleIndex
  .btn:not(.btn-outline-secondary):not(.btn-primary):not(.btn-success):not(.btn-info):not(.btn-danger):not(.btn-link):not(.btn-outline-primary):not(.btn-secondary):not(.btn-outline-danger) {
  background-color: rgb(239, 239, 239);
}
#moduleIndex .no-modules {
  font-size: 22px;
  margin-top: 10%;
  display: block;
}
#moduleIndex .project-url-container {
  max-width: 500px;

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
#moduleIndex .project-url {
  font-size: 12px;
  color: #ccc;
}
#moduleIndex .downloadable-image {
  background-color: white;
}
#moduleIndex .downloadable-hidden {
  display: none;
}
#moduleIndex .downloadable-details-list {
  background-color: white;
  text-align: left;
  padding: 15px 0px;
}
#moduleIndex .modal-module-creation-modal {
  width: 500px;
}
#moduleIndex .main-msg {
  font-weight: bold;
}
#moduleIndex .note-msg {
  font-size: 14px;
}
#moduleIndex .buttons {
  margin: 20px;
}
#moduleIndex .buttons button:last-child {
  margin-left: 10px;
}
#moduleIndex .hidden {
  visibility: none;
}
/*#moduleIndex .main-options {
  display: flex;
}*/
#moduleIndex .layers h6 {
  font-weight: bold;
  margin: 0px;
}
#moduleIndex .layer-list {
  list-style: none;
  padding: 0px;
  margin: 0px;
  gap:10px;
  display:flex;
}
#moduleIndex .layer-label {
  margin: 0px;
}
#moduleIndex label {
  margin-bottom: 0px;
}
#moduleIndex .layer-chevron {
  font-size: 20px;
  cursor: pointer;
}
#moduleIndex .layer-selected {
  color: #17a2b8;
  font-weight: bold;
}
#moduleIndex .layer-panel {
  display: flex;
}
#moduleIndex .layer-info {
  padding-left: 10px;
  padding-top: 5px;
  margin-left: 5px;
  padding-top: 5px;
  border-left: 1px solid;
  padding-left: 5px;
  border-color: #17a2b8;
  max-height: 90px;
  overflow-y: auto;
  width: 235px;
}
#moduleIndex .all-width {
  width: 100%;
}
#moduleIndex .load-save-container {
  font-size: 10pt;
}
#moduleIndex .diagram {
  /*padding-top: 30px;*/
  background-color: white;
}
#moduleIndex .diagram > table {
  margin: 0 auto;
}
#moduleIndex td {
  margin: 0;
  padding: 0 !important;
  /*border: 0 !important;*/
}
#moduleIndex .f1-step {
  position: relative;
  float: left;
  width: 25%;
  padding: 0 5px;
}

#moduleIndex .fancy-container {
  position: relative;
}

#moduleIndex .fancy {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;

  font-weight: bold;
}
#moduleIndex .swal-modal {
  width: 800px !important;
}
#moduleIndex .modal-header {
  background-color: inherit;
  color: inherit;
}
#moduleIndex .search-check {
  text-align: left;
  font-size: 14px;
  padding: 5px 0px;
}

@media print {
  #moduleIndex .not-printable {
    display: none;
  }

  #moduleIndex .right-bar {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    align-items: center;
  }
}

#moduleIndex .bordered-container {
  #moduleIndex .bordered-section {
    border: 1px solid #ccc;
    padding: 5px;
    padding-top: 13px;

    #moduleIndex &.uncollapsed {
      height: 0px;
      overflow: hidden;
      padding: 0;
    }
  }

  #moduleIndex .container-title {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    left: 25px;
    font-size: 19px;
    padding: 0px 10px;
    background: white;
    cursor: pointer;
    position: relative;
    top: 13px;
    cursor: pointer;

    #moduleIndex .container-toggler {
      font-size: 10px;
      position: relative;
      bottom: 3px;
    }
  }
}

.swal-modal{
    width:850px !important;
}
</style>