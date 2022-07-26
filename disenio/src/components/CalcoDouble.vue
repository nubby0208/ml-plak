<template>
  <div class="container-calco padding text-left calco-doble">
    <div v-for="(calcoInfo, index) in calcoList" class="container-calco" v-bind:class="{'division': calcoInfo.separator.division > 0, 'riel': calcoInfo.separator.elementType === 'riel', 'puerta-corrediza': calcoInfo.separator.elementType === 'puerta-corrediza'}" :data-id="calcoInfo.separator.id" :key="index">
      <table v-if="calcoInfo.separator && !calcoInfo.separator.virtual" class="table table-bordered table-calco nowrap" >
        <tbody>
          <tr>
            <td rowspan="2" style="text-align: center; font-size: 16px; color:#848b92;" class="short-1">{{getCaraBackFront(index, "I", calcoInfo)}}</td>
            <td colspan="6" @click="selectTapacantoLado(index, calcoInfo, 'superior')" class="text-center short-6">
              <div @click="$root.$emit('tapacantoSelectEvent', 'superior')" :class="{ grey: superior(calcoInfo) }">
                {{ medidaSuperior(calcoInfo) | round }} {{ superiorInfo(calcoInfo)}}
              </div>
            </td>
            <td rowspan="2" style="text-align: center; font-size: 16px; color:#848b92;" class="short-1">{{getCaraBackFront(index, "D", calcoInfo)}}</td>
          </tr>
          <tr>
            <td colspan="4" class="short-4">{{ calcoInfo.generalName }}</td>
            <td colspan="2" class="short-2">{{ calcoInfo.moduleName }}</td>
          </tr>
          <tr>
            <td rowspan="9" class="short-1 tapacanto">
              <div @click="$root.$emit('tapacantoSelectEvent', 'derecho')" :class="{ grey: derecho(calcoInfo) }">
                {{ medidaIzquierda(calcoInfo) | round }} {{ derechoInfo(calcoInfo) }}
              </div>
            </td>
            <td colspan="4" class="short-4">{{ calcoInfo.generalMueble }}</td>
            <td class="short-1">AR</td>
            <td class="short-1">{{ calcoInfo.moduleArmado }}</td>
            <td rowspan="9" class="short-1 tapacanto">
              <div @click="$root.$emit('tapacantoSelectEvent', 'izquierdo')" :class="{ grey: izquierdo(calcoInfo) }">
                {{ medidaDerecha(calcoInfo) | round }} {{ izquierdoInfo(calcoInfo) }}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="short-4">{{ calcoInfo.separator.name }}  <span v-if="calcoInfo.separator.lPartId"> en L</span></td>
            <td class="short-1">{{ calcoInfo.separator.id }}</td>
            <td class="short-1"></td>
          </tr>
          <tr>
            <td colspan="6" class="text-right">{{getCorredera(calcoInfo)}}</td>
          </tr>
          <tr>
            <td colspan="6">{{getOrientacionManija(calcoInfo)}}</td>
          </tr>
          <tr>
            <td colspan="6">{{getInfoApertura(calcoInfo)}}</td>
          </tr>
          <tr>            
            <td colspan="6">{{getComentario(calcoInfo)}}</td>
          </tr>
          <tr>
            <td colspan="6">{{ calcoInfo.moduleDescripcion }}</td>
          </tr>
          <tr>
            <td colspan="6">{{ calcoInfo.moduleComentario }}</td>
          </tr>
          <tr>
            <td colspan="6" v-if="(!calcoInfo.separator.cajon && !calcoInfo.separator.riel && !calcoInfo.separator.puerta && !calcoInfo.separator.dobleFondo) || calcoInfo.separator.elementType === 'separador'">{{ calcoInfo.separator.material | filled }}</td>
            <td colspan="6" v-if="calcoInfo.separator.cajon">{{getCajonMaterial(calcoInfo)}}</td>
            <td colspan="6" v-if="calcoInfo.separator.riel" :class="{ grey: !!calcoInfo.extra }">{{calcoInfo.extra}}</td>
            <td colspan="6" v-if="calcoInfo.separator.puerta && calcoInfo.separator.elementType !== 'separador'" :class="{ grey: !!calcoInfo.extra }">{{calcoInfo.separator.puerta.material}}</td>
            <td colspan="6" v-else-if="calcoInfo.separator.dobleFondo">{{ calcoInfo.separator.dobleFondo.material}}</td>
          </tr>
          <tr>
            <td rowspan="2" class="short-1"></td>
            <td class="short-1">Cara</td>
            <td class="short-1"><div class="green">bue</div></td>
            <td colspan="4" class="short-4">
              <div class="frente-desplazado" v-if="isFrenteDesplazado(calcoInfo.separator)">
                <span>Frente desplazado:</span>
                <ul>
                  <li v-if="calcoInfo.separator.extraAbajo > 0">Abajo {{calcoInfo.separator.extraAbajo}}mm</li>
                  <li v-if="calcoInfo.separator.extraDerecha > 0">Derecha {{calcoInfo.separator.extraDerecha}}mm</li>
                  <li v-if="calcoInfo.separator.extraIzquierda > 0">Izquierda {{calcoInfo.separator.extraIzquierda}}mm</li>
                </ul>
              </div>
            </td>
            <td rowspan="2" class="short-1"></td>
          </tr>
          <tr>
            <td colspan="6" class="text-center short-6">
              <div @click="$root.$emit('tapacantoSelectEvent', 'inferior')" :class="{ grey: inferior(calcoInfo) }">
                {{ medidaInferior(calcoInfo) | round }} {{ inferiorInfo(calcoInfo) }}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="8"></td>
          </tr>        
          <tr class="calco-puerta-sketch" v-if="(calcoInfo.separator.elementType === 'puerta' || calcoInfo.separator.elementType === 'puerta-custom') && (!isCorrediza(calcoInfo))">
            <td colspan="8" style="height:140px">
              UBICACION BISAGRAS
              <div class="door-sketch" :style="{ 'flex-direction': bisagraUbicacion === 'Inferior' || bisagraUbicacion === 'Superior' ? 'row' : 'column'  }">
                <div style="display: flex;" :style="{ 'flex-direction': bisagraUbicacion === 'Inferior' || bisagraUbicacion === 'Superior' ? '' : 'column-reverse'  }" :class="calcoInfo.separator && calcoInfo.separator.puerta.bisagraUbicacion">
                  <div class="bisagra" v-for="(bisagra, index) in calcoInfo.separator.puerta.cantidadBisagras" :key="index" :style="getBisagraStyle(index, calcoInfo.separator)">
                    <span class="bisagra-position" :class="{ 'odd': index % 2 === 1, 'even': index % 2 === 0}">{{getBisagraPosicion(calcoInfo, index)}}</span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="calcoInfo.modulo && calcoInfo.modulo.isTypeL" class="calco-l-sketch">
            <td colspan="8" style="height:140px">
              MODULO L
              <div class="module-sketch">
                <div class="module-part regular upper left" v-bind:class="[calcoInfo.modulo.LType]"><span v-if="calcoInfo.modulo.LType === 'izquierdo'">{{upperMeasure(calcoInfo)}}</span></div>
                <div class="module-part slim upper"></div>
                <div class="module-part regular upper right" v-bind:class="[calcoInfo.modulo.LType]"><span v-if="calcoInfo.modulo.LType === 'derecho'">{{upperMeasure(calcoInfo)}}</span></div>
                <div class="module-part regular down left"><span>{{downLeftMeasure(calcoInfo)}}</span></div>
                <div class="module-part slim down"><span>{{downMeasure(calcoInfo)}}</span></div>
                <div class="module-part regular down right"  v-bind:class="[calcoInfo.modulo.LType]"><span>{{downRightMeasure(calcoInfo)}}</span></div>
              </div>
            </td>
          </tr>
          <tr v-if="calcoInfo.separator.conexionesBefore && calcoInfo.separator.conexionesBefore.length > 0 ||
            calcoInfo.separator.conexionesAfter && calcoInfo.separator.conexionesAfter.length > 0">
            <td class="short-1">Alt 1</td>
            <td class="short-1">Alt 2</td>
            <td class="short-1">Tipo</td>
            <td class="short-1">Prf 1</td>
            <td class="short-1">Prf 2</td>
            <td class="short-1">Prf 3</td>
            <td colspan="2" class="short-2">Ext</td>
          </tr>
          <tr v-else>
            <!-- TODO: Borrar esto (actualmente si no esta modifica el ancho de la tabla) -->
            <td class="short-1"></td>
            <td class="short-1"></td>
            <td class="short-1"></td>
            <td class="short-1"></td>
            <td class="short-1"></td>
            <td class="short-1"></td>
            <td colspan="2" class="short-2"></td>
          <tr>
          </tr>
          <tr v-for="(c, index) in getConexiones(calcoInfo.separator.conexionesBefore, false)" :key="c.nombre">
            <td class="short-1 alt1">{{ c.altura1 | round }}</td>
            <td class="short-1 alt2">{{ c.altura2 | round }}</td>
            <td class="short-1 tipo" :data-tipo="c.tipo2">{{ c.tipo }}</td>
            <td class="short-1 prof1">{{ c.prof1 | round }}</td>
            <td class="short-1 prof2">{{ c.prof2  | round }}</td>
            <td class="short-1 prof3">{{ c.prof3 | round }}</td>
            <td colspan="2" class="short-2 separator-name" :data-id="c.separator.id">{{ c.nombre }}</td>
          </tr>
          
          <tr v-for="(c, index) in getConexiones(calcoInfo.separator.conexionesAfter, true)" :key="c.nombre">
            <td class="short-1 alt1">{{ c.altura1 | round }}</td>
            <td class="short-1 alt2">{{ c.altura2 | round }}</td>
            <td class="short-1 tipo" :data-tipo="c.tipo2">{{ c.tipo }}</td>
            <td class="short-1 prof1">{{ c.prof1 | round }}</td>
            <td class="short-1 prof2">{{ c.prof2  | round }}</td>
            <td class="short-1 prof3">{{ c.prof3 | round }}</td>
            <td colspan="2" class="short-2 separator-name" :data-id="c.separator.id">{{ c.nombre }}</td>
          </tr>
          <tr class="calco-custom-drawing-sketch" v-if="calcoInfo.drawing && calcoInfo.separator.elementType !== 'puerta' && calcoInfo.separator.elementType !== 'puerta-custom' && calcoInfo.separator.elementType !== 'puerta-corrediza'">
            <td colspan="8" style="height:200px">
              <img :src="calcoInfo.drawing" width="300" height="200" />
            </td>
          </tr>
          <tr v-if="getConexionesDrawing(calcoInfo).length > 0">
            <td class="short-1">X</td>
            <td class="short-1">Y</td>
            <td class="short-1">Alto</td>
            <td class="short-1">Ancho</td>
            <td class="short-1" colspan="2">Herramienta</td>
            <td class="short-1" colspan="2">Cant. C</td>
          </tr>
          <tr v-for="(c, index) in getConexionesDrawing(calcoInfo)" :key="index">
            <td class="short-1">{{ c.x | round }}</td>
            <td class="short-1">{{ c.y | round }}</td>
            <td class="short-1">{{ c.alto | round }}</td>
            <td class="short-1">{{ c.ancho  | round }}</td>
            <td class="short-1" colspan="2">{{ c.herramienta }}</td>
            <td class="short-1" colspan="2">{{ c.cantPasadas | round }}</td>
          </tr>     
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'id' ],
  computed: {
    getModule () {
      return this.$store.getters.selectedModule
    },
    calcoList () {
      // this.$store.commit('calcularConexiones', this.$store.getters.getElement(this.id.id))
      return this.$store.getters.getCalcoInfo(this.id.id)
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    aperturaUbicacion () {
      if (this.selectedElement && this.selectedElement.puerta) {
        return this.selectedElement.puerta.aperturaUbicacion
      }
    },
    bisagraUbicacion () {
      if (this.id && this.id.puerta) {
        // HOTFIX:
        console.log(this.selectedElement && this.selectedElement.puerta && this.selectedElement.puerta.bisagraUbicacion)
        //
        return this.id.puerta.bisagraUbicacion
      }
    },
    height () {
      return Number(this.$store.getters.getHeight(this.id.id)).toFixed(2)
    },
    width () {
      return Number(this.$store.getters.getWidth(this.id.id)).toFixed(2)
    }
  },
  methods: {
    getConexionesDrawing(calco){
      try {
        return calco.conexionesDrawingCurrent ? calco.conexionesDrawingCurrent:[];
      } catch (error) {
        return []
      }
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    getConexiones (conexiones, isCaraOpuesta) {
      let result = []
      conexiones && conexiones.forEach(c => {
        let cara = isCaraOpuesta ? c.info.caraOpuesta : c.info.caraEnContacto
        if (cara) {
          result.push({
            altura1: cara.altura1,
            altura2: cara.altura2,
            prof1: cara.prof1,
            prof2: c.separator.barral ? cara.prof2 : c.separator.prof2 || cara.prof2,
            prof3: cara.prof3,
            tipo: cara.tipo,
            tipo2: c.tipo,
            nombre: c.separator.name,
            separator: c.separator
          })
        }

        if (c.conexionDividida && cara) {
          result.push({
            altura1: cara.altura1,
            altura2: cara.altura2,
            prof1: cara.prof4,
            prof2: cara.prof5,
            prof3: cara.prof6,
            tipo: cara.tipo,
            tipo2: c.tipo,
            nombre: 'Div ' + c.separator.name,
            separator: c.separator
          })
        }
      })

      return result
    },
    isCorrediza ({separator}) {
      return separator && separator.puerta && separator.puerta.corrediza
    },
    getBisagraPosicion ({separator}, index) {
      const position = separator.puertaIzquierda ? separator.puerta.posicionBisagrasIzquierda[index] : separator.puerta.posicionBisagrasDerecha[index]
      return this.round(position)
    },
    round (n, decimals = 2) {
      let negative = false
      if (n < 0) {
        negative = true
        n = n * -1
      }
      var multiplicator = Math.pow(10, decimals)
      n = parseFloat((n * multiplicator).toFixed(11))
      n = (Math.round(n) / multiplicator).toFixed(decimals)
      if (negative) {
        n = (n * -1).toFixed(decimals)
      }
      return n
    },
    getBisagraStyle (index, separator) {
      const puerta = separator.puerta
      let styles = {}
      const diagramSize = 198
      if (puerta.bisagraUbicacion === 'Derecha') {
        if (index !== 0) {
          styles['margin-bottom'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
        }
        styles['margin-left'] = '93px'
      }
      if (puerta.bisagraUbicacion === 'Inferior') {
        if (index !== puerta.cantidadBisagras - 1) {
          styles['margin-right'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
        }
        styles['margin-top'] = '93px'
      }
      if (puerta.bisagraUbicacion === 'Superior') {
        if (index !== puerta.cantidadBisagras - 1) {
          styles['margin-right'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
        }
        styles['margin-top'] = '-4px'
      }
      if (puerta.bisagraUbicacion === 'Izquierda') {
        if (index !== 0) {
          styles['margin-bottom'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
        }
        styles['margin-left'] = '-4px'
      }
      if (puerta.bisagraUbicacion === 'Izquierda/Derecha') {
        if (separator.puertaIzquierda) {
          if (index !== 0) {
            styles['margin-bottom'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
          }
          styles['margin-left'] = '-4px'
        } else {
          if (index !== 0) {
            styles['margin-bottom'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
          }
          styles['margin-left'] = '93px'
        }
      }
      return styles
    },
    getBisagraUbicacion (separator) {
      if (this.bisagraUbicacion) {
        return this.bisagraUbicacion
      }
      if (separator.puerta) {
        return separator.puerta.bisagraUbicacion
      }
      return ''
    },
    getAperturaUbicacion (separator) {
      if (this.aperturaUbicacion) {
        return this.aperturaUbicacion
      }
      if (separator.puerta && !separator.puerta.corrediza) {
        return separator.puerta.aperturaUbicacion
      }
      return ''
    },
    downRightMeasure (calcoInfo) {
      const modulo = calcoInfo.modulo
      let measure = modulo.LType === 'derecho' ? modulo.LLength - this.$store.getters.getElement(modulo.latDerId).size : modulo.latDerZ
      return measure + 'mm'
    },
    downMeasure (calcoInfo) {
      const modulo = calcoInfo.modulo
      const calco = this.$store.getters.getCalcoInfo(modulo.techoId)[0]
      return calco.LVeta + 'mm'
    },
    downLeftMeasure (calcoInfo) {
      const modulo = calcoInfo.modulo
      let measure = modulo.LType === 'derecho' ? modulo.latIzqZ : modulo.LLength - this.$store.getters.getElement(modulo.latIzqId).size
      return measure + 'mm'
    },
    upperMeasure (calcoInfo) {
      const modulo = calcoInfo.modulo
      let measure = modulo.LType === 'derecho' ? modulo.latDerZ : modulo.latIzqZ
      return measure + 'mm'
    },
    getComentario (calco) {
      if (calco.isCustomDoor) {
        return calco.separator.puerta.comentario
      }
      return calco.separator.comentario
    },
    isFrenteCajon (separator) {
      return separator && separator.cajon && separator.name.toUpperCase().indexOf('FRENTE') > -1
    },
    isFrenteDesplazado (separator) {
      if (!this.isFrenteCajon(separator)) {
        return false
      }
      return separator.extraAbajo > 0 || separator.extraDerecha > 0 || separator.extraIzquierda > 0
    },
    getCorredera ({separator}) {
      if (this.isFrenteCajon(separator) || separator.bandeja) {
        return separator.corredera
      }
    },
    getCajonMaterial ({separator}) {
      if (separator.name.toUpperCase().indexOf('FRENTE') > -1) {
        return separator.frenteMaterial
      }

      if (separator.name.toUpperCase().indexOf('BASE') > -1) {
        return separator.fondoMaterial
      }

      return separator.material
    },
    getOrientacionManija ({separator}) {
      if (separator.puerta && !separator.puerta.corrediza) {
        return 'Manija: ' + separator.puerta.orientationManija
      }
    },
    getInfoApertura ({separator}) {
      if (separator.cajon && separator.name.toUpperCase().indexOf('FRENTE') > -1) {
        return separator.aperturaSistema ? separator.aperturaSistema + ' - ' + separator.aperturaUbicacion : separator.aperturaUbicacion
      }
      if (separator.puerta && !separator.puerta.corrediza) {
        let aperturaUbicacion = separator.puerta.aperturaUbicacion.toUpperCase()
        if (aperturaUbicacion !== 'IZQUIERDA' && aperturaUbicacion !== 'DERECHA' && aperturaUbicacion !== 'INFERIOR' && aperturaUbicacion !== 'SUPERIOR') {
          return separator.puerta.aperturaSistema + ' ' + aperturaUbicacion
        }
      }
    },
    medidaSuperior (o) {
      if (o.separator) {
        if (o.separator.dobleFondo) {
          return o.AVeta
        }
        if (o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || o.separator.elementType === 'puerta-corrediza' || o.separator.cajon) {
          const sentidoVeta = o.separator.cajon ? o.separator.sentidoVeta.toUpperCase() : o.separator.puerta.sentidoVeta.toUpperCase()

          if (sentidoVeta === 'VERTICAL' && (this.isFrenteCajon(o.separator) || o.separator.puerta)) {
            return o.AVeta
          }

          return o.LVeta
        }
      }
      return o.separator.displayAVeta || o.AVeta
    },
    medidaInferior (o) {
      if (o.separator) {
        if (o.separator.dobleFondo) {
          return o.AVeta
        }
        if (o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || o.separator.elementType === 'puerta-corrediza' || o.separator.cajon) {
          const sentidoVeta = o.separator.cajon ? o.separator.sentidoVeta.toUpperCase() : o.separator.puerta.sentidoVeta.toUpperCase()

          if (sentidoVeta === 'VERTICAL' && (this.isFrenteCajon(o.separator) || o.separator.puerta)) {
            return o.AVeta
          }

          return o.LVeta
        }
      }
      return o.separator.displayAVeta || o.AVeta
    },
    medidaIzquierda (o) {
      if (o.separator) {
        if (o.separator.dobleFondo) {
          return o.LVeta
        }

        if (o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || o.separator.elementType === 'puerta-corrediza' || o.separator.cajon) {
          const sentidoVeta = o.separator.cajon ? o.separator.sentidoVeta.toUpperCase() : o.separator.puerta.sentidoVeta.toUpperCase()

          if (sentidoVeta === 'VERTICAL' && (this.isFrenteCajon(o.separator) || o.separator.puerta)) {
            return o.LVeta
          }

          return o.AVeta
        }
      }
      return o.separator.displayLVeta || o.LVeta
    },
    medidaDerecha (o) {
      if (o.separator) {
        if (o.separator.dobleFondo) {
          return o.LVeta
        }

        if (o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || o.separator.elementType === 'puerta-corrediza' || o.separator.cajon) {
          const sentidoVeta = o.separator.cajon ? o.separator.sentidoVeta.toUpperCase() : o.separator.puerta.sentidoVeta.toUpperCase()

          if (sentidoVeta === 'VERTICAL' && (this.isFrenteCajon(o.separator) || o.separator.puerta)) {
            return o.LVeta
          }

          return o.AVeta
        }
      }
      return o.separator.displayLVeta || o.LVeta
    },
    superior (o) {
      if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
        return false
      }
      if (o.separator && o.separator.tapacantos && o.separator.tapacantos.superior) {
        return true
      }
      if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.superior) {
        return true
      }
      if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.superior) {
        return true
      }
      return false
    },
    getCaraBackFront (o, lado, calcoInfo) {

      try {
        if (calcoInfo.separator.cajon && !this.isFrenteCajon(calcoInfo.separator)) {
          return ""
        }
        if (calcoInfo.separator && calcoInfo.separator.dobleFondo && calcoInfo.separator.dobleFondcalcoInfo.tapacantos && calcoInfo.separator.dobleFondcalcoInfo.tapacantos.superior) {
          return "";
        }
        if (calcoInfo.separator && calcoInfo.separator.puerta && calcoInfo.separator.puerta.tapacantos && calcoInfo.separator.puerta.tapacantos.superior) {
          return "";
        }
        
        var numerosD = [];
        var numerosI = [];
        var i = 0;
        for (let index = 0; index < 50; index++) {
          numerosD.push(i);
          i++;
          numerosI.push(i);
          i++;
        }

        if(lado == "I"){
          if(typeof numerosD.find(a=> a == o) !== "undefined"){
            return "Fo";
          }

          if(typeof numerosI.find(a=> a == o) !== "undefined"){
            return "Fre";
          }
        }
        
        if(lado == "D"){
          if(typeof numerosD.find(a=> a == o) !== "undefined"){
            return "Fre";
          }

          if(typeof numerosI.find(a=> a == o) !== "undefined"){
            return "Fo";
          }
        }
        
        return "";
      } catch (error) {
        
      }
    },
    superiorInfo (o) {
      let apertura = ''
      if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getAperturaUbicacion(o.separator) === 'Superior') {
        apertura = o.separator.puerta.aperturaSistema
      }
      let bisagra = ''
      if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getBisagraUbicacion(o.separator) === 'Superior') {
        bisagra = o.separator.puerta.bisagraTipo || ''
      }
      if (o.separator) {
        if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
          return ''
        }
        if (o.separator.elementType === 'separador' && (o.separator.tapacantos && o.separator.tapacantos.superior)) {
          return o.separator.tapacantos.superior.nombre || o.separator.tapacantos.superior
        }
        if (o.separator.tapacantos && o.separator.tapacantos.superior && !o.isCustomDoor) {
          return o.separator.tapacantos.superior.nombre || o.separator.tapacantos.superior
        }
        if ((o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || (o.separator.elementType === 'puerta-corrediza')) && o.separator.puerta.tapacantos) {
          const tapacantos = o.separator.puerta.tapacantos.superior ? o.separator.puerta.tapacantos.superior.nombre || o.separator.puerta.tapacantos.superior : ''
          return tapacantos + ' ' + apertura + ' ' + bisagra
        }
        if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
          return o.separator.dobleFondo.tapacantos.superior.nombre || o.separator.dobleFondo.tapacantos.superior
        }
      }
      return ''
    },
    derecho (o) {
      if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
        return false
      }
      if (o.separator && o.separator.tapacantos && o.separator.tapacantos.derecho) {
        return true
      }
      if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.derecho) {
        return true
      }
      if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.derecho) {
        return true
      }
      return false
    },
    derechoInfo (o) {
      let apertura = ''
      if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getAperturaUbicacion(o.separator) === 'Izquierda') {
        apertura = o.separator.puerta.aperturaSistema
      }
      let bisagra = ''
      if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getBisagraUbicacion(o.separator) === 'Izquierda') {
        bisagra = o.separator.puerta.bisagraTipo || ''
      }
      if (o.separator.puerta && this.getBisagraUbicacion(o.separator) === 'Izquierda/Derecha') {
        const name = o.separator.name.split(' ')
        if (name[name.length - 1] === 'I') {
          bisagra = o.separator.puerta.bisagraTipo || ''
        }
      }
      if (o.separator) {
        if (o.separator.cajon) {
          return this.isFrenteCajon(o.separator) ? o.separator.tapacantos.izquierdo.nombre || o.separator.tapacantos.izquierdo : ''
        }
        if (o.separator.elementType === 'separador' && (o.separator.tapacantos && o.separator.tapacantos.derecho)) {
          return o.separator.tapacantos.derecho.nombre || o.separator.tapacantos.derecho
        }
        if (o.separator.tapacantos && o.separator.tapacantos.derecho && !o.isCustomDoor) {
          return o.separator.tapacantos.derecho.nombre || o.separator.tapacantos.derecho
        }
        if ((o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || (o.separator.elementType === 'puerta-corrediza')) && o.separator.puerta.tapacantos) {
          const tapacantos = o.separator.puerta.tapacantos.izquierdo ? o.separator.puerta.tapacantos.izquierdo.nombre || o.separator.puerta.tapacantos.izquierdo : ''
          return tapacantos + ' ' + apertura + ' ' + bisagra
        }
        if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
          return o.separator.dobleFondo.tapacantos.derecho.nombre || o.separator.dobleFondo.tapacantos.derecho
        }
      }
      return ''
    },
    izquierdo (o) {
      if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
        return false
      }
      if (o.separator && o.separator.tapacantos && o.separator.tapacantos.izquierdo) {
        return true
      }
      if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.izquierdo) {
        return true
      }
      if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.izquierdo) {
        return true
      }
      return false
    },
    izquierdoInfo (o) {
      let apertura = ''
      if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getAperturaUbicacion(o.separator) === 'Derecha') {
        apertura = o.separator.puerta.aperturaSistema
      }
      let bisagra = ''
      if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getBisagraUbicacion(o.separator) === 'Derecha') {
        bisagra = o.separator.puerta.bisagraTipo || ''
      }
      if (o.separator.puerta && this.getBisagraUbicacion(o.separator) === 'Izquierda/Derecha') {
        const name = o.separator.name.split(' ')
        if (name[name.length - 1] === 'D') {
          bisagra = o.separator.puerta.bisagraTipo || ''
        }
      }
      if (o.separator) {
        if (o.separator.cajon) {
          return this.isFrenteCajon(o.separator) ? o.separator.tapacantos.derecho.nombre || o.separator.tapacantos.derecho : ''
        }
        if (o.separator.elementType === 'separador' && (o.separator.tapacantos && o.separator.tapacantos.izquierdo)) {
          return o.separator.tapacantos.izquierdo.nombre || o.separator.tapacantos.izquierdo
        }
        if (o.separator.tapacantos && o.separator.tapacantos.izquierdo && !o.isCustomDoor) {
          return o.separator.tapacantos.izquierdo.nombre || o.separator.tapacantos.izquierdo
        }
        if ((o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || (o.separator.elementType === 'puerta-corrediza')) && o.separator.puerta.tapacantos) {
          const tapacantos = o.separator.puerta.tapacantos.derecho ? o.separator.puerta.tapacantos.derecho.nombre || o.separator.puerta.tapacantos.derecho : ''
          return tapacantos + ' ' + apertura + ' ' + bisagra
        }
        if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
          return o.separator.dobleFondo.tapacantos.izquierdo.nombre || o.separator.dobleFondo.tapacantos.izquierdo
        }
      }
      return ''
    },
    inferior (o) {
      if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
        return false
      }
      if (o.separator && o.separator.tapacantos && o.separator.tapacantos.inferior) {
        return true
      }
      if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.inferior) {
        return true
      }
      if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.inferior) {
        return true
      }
      return false
    },
    inferiorInfo (o) {
      let apertura = ''
      if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getAperturaUbicacion(o.separator) === 'Inferior') {
        apertura = o.separator.puerta.aperturaSistema
      }
      let bisagra = ''
      if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getBisagraUbicacion(o.separator) === 'Inferior') {
        bisagra = o.separator.puerta.bisagraTipo || ''
      }
      if (o.separator) {
        if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
          return ''
        }
        if (o.separator.elementType === 'separador' && (o.separator.tapacantos && o.separator.tapacantos.inferior)) {
          return o.separator.tapacantos.inferior.nombre || o.separator.tapacantos.inferior
        }
        if (o.separator.tapacantos && o.separator.tapacantos.inferior && !o.isCustomDoor) {
          return o.separator.tapacantos.inferior.nombre || o.separator.tapacantos.inferior
        }
        if ((o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || (o.separator.elementType === 'puerta-corrediza')) && o.separator.puerta.tapacantos) {
          const tapacantos = o.separator.puerta.tapacantos.inferior ? o.separator.puerta.tapacantos.inferior.nombre || o.separator.puerta.tapacantos.inferior : ''
          return tapacantos + ' ' + apertura + ' ' + bisagra
        }
        if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
          return o.separator.dobleFondo.tapacantos.inferior.nombre || o.separator.dobleFondo.tapacantos.inferior
        }
      }
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
td {
  font-size: 11px;
  text-align: center;
  padding: 0;
}
.short-1 {
  min-width: 30px;
  max-width: 40px;
}
.short-2 {
  min-width: 60px;
  max-width: 60px;
}
.short-2.separator-name {
  min-width: 91px;
  max-width: 91px;
}
.short-4 {
  min-width: 120px;
  max-width: 120px;
}
.short-6 {
  min-width: 180px;
  max-width: 180px;
}
.table-calco {
  min-width: 240px;
  max-width: 240px;
  font-size: 9px;
}
.container-calco {
  display: inline-block;
  vertical-align: top;
}
.tapacanto {
  vertical-align: middle;
  word-break: keep-all;
}
.padding {
  padding-right: 5px;
}
.green {
  background-color: lightgreen;
}
.grey {
  background-color: lightgray;
}
.orange {
  background-color: orange;
}
.door-sketch {
  width: 98px;
  height: 98px;
  border: 1px solid black;
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.bisagra {
  width: 7px;
  height: 7px;
  background-color: #8BC34A;
}
.bisagra-position {
  position: relative;
  display: inline-block;
  left: 8px;
  bottom: 5px;
}
[class="Izquierda/Derecha"] {
  .bisagra-position {
    left: 10px;
    bottom: 5px;
  }  
}
.Inferior {
  .bisagra-position {
    transform: rotate(310deg);
    left: -5px;
    bottom: 24px;
  }
}
.Superior {
  .bisagra-position {
    transform: rotate(310deg);
    left: -25px;
    top: 15px;
  }
}
.Derecha {
  .bisagra-position {
    left: 8px;
    bottom: 5px;
  }
}
.Izquierda {
  .bisagra-position {
    right: 36px;
    bottom: 5px;
  }
}
.module-sketch {
  display: flex;
  flex-wrap: wrap;
  width: 125px;
  padding-top: 5px;
  margin: 0 auto;

  .regular {
    width: 50px;
    height: 50px;
  }

  .slim {
    width: 25px;
    height: 50px;

    &.upper {
      border-bottom: 1px solid black;
    }

    &.down {
      position: relative;
      span {
        position: absolute;
        top: 50px;
        left: 0px;
      }
    }
  }

  .down {
    border-bottom: 1px solid black;

    &.right {
      border-right: 1px solid black;
      position: relative;
      span {
        position: absolute;
        left: 55px;
      }

      &.izquierdo {
        span {
          top: 15px;
        }
      }
    }

    &.left {
      border-left: 1px solid black;
      position: relative;
      span {
        position: absolute;
        left: -45px;
        top: 15px;
      } 
    }
  }

  .upper {
    &.derecho {
      &.right {
        border-right: 1px solid black;
        border-left: 1px solid black;
        border-top: 1px solid black;
      }

      &.left {
        border-bottom: 1px solid black;
      }
    }

    &.izquierdo {
      &.right {
        border-bottom: 1px solid black;
      }

      &.left {
        border-right: 1px solid black;
        border-left: 1px solid black;
        border-top: 1px solid black;
      }
    }
  }

}
.frente-desplazado {
  span {
    font-weight: bold;
  }
  ul {
    margin: 0;
    padding-left: 25px;
    text-align: left;
  }
}


@media print
{    
  .short-1 {
    min-width: 40px !important;
    max-width: 80px !important;
  }

  .short-2.separator-name {
    min-width: 80px !important;
    max-width: 120px !important;
    font-size: 14px !important;
  }

  td, td div {
    font-size: 18px !important;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
}
</style>
