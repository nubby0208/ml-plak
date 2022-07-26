<template>
    <div class="bhoechie-tab-menu-disenio no-print">
        <div class="list-group">
            <a
                v-b-tooltip.hover.right
                title="General"
                href="#"
                class="list-group-item-disenio text-center"
                :class="currentTab === 'general' ? 'active' : ''"
                @click.prevent="$emit('select-tab', 'general')"
            >
                <b-icon
                    class="disenio-icon"
                    icon="person"
                    font-scale="1.5"
                />
            </a>
            <a
                v-b-tooltip.hover.right
                title="Módulo"
                href="#"
                class="list-group-item-disenio text-center"
                :class="currentTab === 'modulo' ? 'active' : ''"
                @click.prevent="$emit('select-tab', 'modulo')"
            >
                <b-icon
                  class="disenio-icon"
                  icon="bounding-box"
                  font-scale="1.5"
                />
            </a>

            <a
                v-b-tooltip.hover.right
                title="3D"
                href="#"
                class="list-group-item-disenio text-center"
                :class="currentTab === '3d' ? 'active' : ''"
                @click.prevent="$emit('select-tab', '3d')"
            >
                <b-icon
                  class="disenio-icon"
                  icon="box"
                  font-scale="1.5"
                />
            </a>

            <a
                v-b-tooltip.hover.right
                title="Ambiente de Instalación" 
                href="#" 
                class="list-group-item-disenio text-center"
                :class="currentTab === 'ambiente' ? 'active' : ''"
                @click.prevent="$emit('select-tab','ambiente')"
                v-if="roomEditorEnabled"
            >
                <b-icon
                  class="disenio-icon"
                  icon="house"
                  font-scale="1.5"
                />
            </a>

            <a
                v-b-tooltip.hover.right 
                title="Mensajes" 
                href="#" 
                class="list-group-item-disenio text-center" 
                :class="currentTab === 'mensajes' ? 'active' : ''"
                @click.prevent="$emit('select-tab','mensajes')"
            >
                <b-icon
                  class="disenio-icon"
                  icon="chat-square-dots"
                  font-scale="1.5"
                />
            </a>

            <a
                v-b-tooltip.hover.right 
                title="Centro de Disenio CAD"
                class="list-group-item-disenio text-center"
                :class="currentTab === 'cad' ? 'active' : ''"
                @click.prevent="$emit('select-tab','cad')"
                :href="disenio2dUrl"
            >
                <b-icon
                  class="disenio-icon"
                  icon="pencil-square"
                  font-scale="1.5"
                />
            </a>

            <a
                v-b-tooltip.hover.right
                title="Exportar"
                href="#"
                class="list-group-item-disenio text-center"
                :class="currentTab === 'export' ? 'active' : ''"
                @click.prevent="$emit('select-tab', 'export')"
            >
                <b-icon
                    class="disenio-icon"
                    icon="arrow-up-square"
                    font-scale="1.5"
                />
            </a>

            <a
                v-b-tooltip.hover.right
                title="Materiales"
                href="#"
                class="list-group-item-disenio text-center"
                @click.prevent="$emit('select-tab', 'materiales')"
                :class="currentTab === 'materiales' ? 'active' : ''"
            >
                <b-icon
                    class="disenio-icon"
                    icon="receipt"
                    font-scale="1.5"
                />
            </a>
            <a
                v-b-tooltip.hover.right
                title="Administrador de Imágenes"
                href="#"
                class="list-group-item-disenio text-center"
                @click.prevent="$emit('select-tab', 'imagenes')"
                :class="currentTab === 'imagenes' ? 'active' : ''"
            >
                <b-icon
                    class="disenio-icon"
                    icon="images"
                    font-scale="1.5"
                />
            </a>
            <a
                v-b-tooltip.hover.right
                title="Fotos e Información de Obras"
                href="#"
                class="list-group-item-disenio text-center"
                @click.prevent="$emit('select-tab', 'interactivePictures')"
                :class="currentTab === 'interactivePictures' ? 'active' : ''"
            >
                <b-icon
                    class="disenio-icon"
                    icon="building"
                    font-scale="1.5"
                />
            </a>
            <a
                v-b-tooltip.hover.right
                title="Sistema"
                href="#"
                class="list-group-item-disenio text-center"
                @click.prevent="$emit('select-tab', 'sistema')"
                :class="currentTab === 'sistema' ? 'active' : ''"
            >
                <b-icon
                    class="disenio-icon"
                    icon="gear"
                    font-scale="1.5"
                />
            </a> 
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default {
    name: 'DesignToolbar',

    props: {
        currentTab: String,
        roomEditorEnabled: Boolean,
        disenio2dUrl: String,
    },
}
</script>

<style scoped lang="scss">
/*  bhoechie tab */
div.bhoechie-tab-menu-disenio{
  padding-right: 0;
  padding-left: 0;
  padding-bottom: 0;
}
.disenio-icon{
   color : gray; 
}
.disenio-icon:hover{
    color: rgb(94, 94, 94);
}
.list-group-item-disenio{
    background-color: white;
    border: 1px solid rgba(0,0,0,.125);
    margin: 10px;
    padding: 8px;
    border-radius: 3px!important;
    -webkit-box-shadow: 0 1px 5px #f3f3f3;
    box-shadow: 0 1px 5px #dbdbdb;
}
div.bhoechie-tab-menu-disenio div.list-group{
  margin-bottom: 0;
}
div.bhoechie-tab-menu-disenio div.list-group a svg {
  position: relative;
  top: 2px;
}
div.bhoechie-tab-menu-disenio div.list-group>a{
  margin-bottom: 0;
}
div.bhoechie-tab-menu-disenio div.list-group>a .glyphicon,
div.bhoechie-tab-menu-disenio div.list-group>a .fa {
  color: #8b8a8d !important;
}
div.bhoechie-tab-menu-disenio div.list-group>a:first-child{
  border-top-right-radius: 0;
  -moz-border-top-right-radius: 0;
}
div.bhoechie-tab-menu-disenio div.list-group>a:last-child{
  border-bottom-right-radius: 0;
  -moz-border-bottom-right-radius: 0;
}
div.bhoechie-tab-menu-disenio div.list-group>a.active:after{
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  left:55px;
  border-style: solid;
  border-width: 13px 0 13px 13px;
  border-color: transparent transparent transparent rgb(187, 183, 183);
}
</style>