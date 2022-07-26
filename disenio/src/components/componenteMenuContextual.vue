<template>
    <div>
        <menu v-if="show && opcionesComp.filter(a=>a.show).length > 0" class="menu show-menu" :style="{left:x.left, top:x.top}">
            <div v-show="opc.show" v-for="(opc, i) in opcionesComp" :key="i">
                
                <li v-if="opc.hasOwnProperty('sub')" class="menu-item submenu">
                    <button type="button" @click="opc.func" class="menu-btn"> <b-icon :rotate="opc.rotate" :icon="opc.icon"></b-icon> <span class="menu-text">{{opc.text}}</span> </button>
                    <menu class="menu">
                        <li v-for="(sub, index) in opc.sub" :key="index" class="menu-item">
                            <button type="button" @click="sub.func" class="menu-btn"> <b-icon :rotate="sub.rotate" :icon="sub.icon"></b-icon> <span class="menu-text">{{sub.text}}</span> </button>
                        </li>
                    </menu>
                </li>
                <li v-else class="menu-item">
                    <button type="button" @click="opc.func" class="menu-btn"><b-icon :rotate="opc.rotate" :icon="opc.icon"></b-icon> <span class="menu-text">{{opc.text}}</span></button>
                </li>

            </div>
        </menu>
    </div>
</template>
<script>
import Vue from 'vue'
import { EventBus } from "@/index";
import menuContextualMixins from '@/components/menuContextualMixins.mixin'

export default {
    name:"componenteMenuContextual",
    props: ["opciones"],
    mixins: [menuContextualMixins],
    methods:{
        showMenu2(even){
            alert();
            this.showMenu(even);
        }
    },
    computed:{
      opcionesComp(){
        return this.opciones;
      }
    }
}
</script>

<style>
.menu {
  position: absolute;
  width: 200px;
  padding: 2px;
  margin: 0;
  border: 1px solid #bbb;
  background: #eee;
  background: -webkit-linear-gradient(to bottom, #fff 0%, #e5e5e5 100px, #e5e5e5 100%);
  background: linear-gradient(to bottom, #fff 0%, #e5e5e5 100px, #e5e5e5 100%);
  z-index: 100;
  border-radius: 3px;
  box-shadow: 1px 1px 4px rgba(0,0,0,.2);
  opacity: 0;
  -webkit-transform: translate(0, 15px) scale(.95);
  transform: translate(0, 15px) scale(.95);
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  pointer-events: none;
}

.menu-item {
  display: block;
  position: relative;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.menu-btn {
  background: none;
  line-height: normal;
  overflow: visible;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  display: block;
  width: 100%;
  color: #444;
  font-family: 'Roboto', sans-serif;
  font-size: 12pt;
  text-align: left;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 8px;
  border-radius: 3px;
}
 .menu-btn::-moz-focus-inner, .menu-btn::-moz-focus-inner {
 border: 0;
 padding: 0;
}

.menu-text { margin-left: 10px; }

.menu-btn .fa {
  position: absolute;
  left: 8px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

.menu-item:hover > .menu-btn {
  color: #fff;
  outline: none;
  background-color: #2E3940;
  background: -webkit-linear-gradient(to bottom, #5D6D79, #2E3940);
  background: linear-gradient(to bottom, #5D6D79, #2E3940);
  border: 1px solid #2E3940;
}

.menu-item.disabled {
  opacity: .5;
  pointer-events: none;
}

.menu-item.disabled .menu-btn { cursor: default; }

.menu-separator {
  display: block;
  margin: 7px 5px;
  height: 1px;
  border-bottom: 1px solid #fff;
  background-color: #aaa;
}

.menu-item.submenu::after {
  content: "";
  position: absolute;
  right: 6px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: #808080;
}

.menu-item.submenu:hover::after { border-left-color: #fff; }

.menu .menu {
  top: 4px;
  left: 99%;
}

.show-menu, .menu-item:hover > .menu {
  opacity: 1;
  -webkit-transform: translate(0, 0) scale(1);
  transform: translate(0, 0) scale(1);
  pointer-events: auto;
}

.menu-item:hover > .menu {
  -webkit-transition-delay: 100ms;
  transition-delay: 300ms;
}

.tooltip {
    z-index: 2147483647 !important;
}

</style>