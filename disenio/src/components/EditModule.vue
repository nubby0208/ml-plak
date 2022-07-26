<style lang="scss">
  .zero-width-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;

    label {
      margin-bottom: 0px;
      margin-left: 5px;
      cursor: pointer;
    }
  }
  #zero-width {
    margin-right: 5px;
    margin-top: 2px
  }
  .opt:hover {
    cursor: pointer;
    background-color: rgba(123, 66, 123, 0.46);
  }
  .medidas {
    margin-top: 10px;
    font-weight: 400;
    color: #007bff;
  }
  .medidas:hover {
    text-decoration: underline;
    cursor: pointer;
    color: #0056b3;
  }
  .config-elem {
    font-size: 16px;
    color: black !important;
  }
  .config-elem-clickeable {
    cursor: pointer;
    color: #007bff !important;
  }
  .small-buttons td {
    padding: 4px !important;
  }
  .small-buttons button {
    font-size: 12px;
    padding: 2px;
  }
  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-2 {
    flex: 2;
  }
  .flex-3 {
    flex: 3;
  }
  .align-center {
    align-self: center;
  }
  .ml-btn-sm {
    &.btn.btn-sm:not(.btn-link) {
      font-size: 11px;
      height: 25px;
      margin: 0px 2px;
    }
  }
  .seccion-acciones, .modulo-medidas {
    margin-top: 5px;

    .btn.btn-sm:not(.btn-link) {
      font-size: 11px;
      height: 25px;
      margin: 0px 2px;
    }
    .btn-group {
      height: 25px;

      button {
        font-size: 11px;
        padding: .25rem .5rem;
      }
    }
  }
  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .modulo-input-number {
    width: 55px;
  }
  .hover-line:hover, .hover-line:hover label {
    font-weight: bold !important;
  }
  .empty-row {
    height: 40px;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-left {
    justify-content: left;
  }
  .flex-column {
    flex-direction: column;
  }
  .inline-flex {
    display: inline-flex;
  }
  .bordered-separator-right {
    border-right: solid 1px #ccc;
  }
  .v-separator {
    position: relative;
    top: 3px;
  }
  .margin-top-10 {
    margin-top: 10px;
  }
  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .margin-left-5 {
    margin-left: 5px;
  }
  .bordered-container {
    .bordered-section {
      border: 1px solid #ccc;
      padding: 5px;
      padding-top: 13px;

      &.uncollapsed {
        height: 0px;
        overflow: hidden;
        padding: 0;
      }
    }

    .container-title {
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

      .container-toggler {
        font-size: 10px;
        position: relative;
        bottom: 3px;
      }
    }
  }
  .fondo-medidas {
    padding: 0px 25px;
    input {
      width: 50px;
    }
  }
  .fondo-label {
    width: 135px;
  }
  .fondo-opt-list {
    position: relative;
    bottom: 35px;
  }
  .modulo-medidas {
    border-right: solid 1px #ccc;
    margin-right: 5px;
    min-width: 165px;
  }
  .modulo-materiales {
    border-right: solid 1px #ccc;
    padding-right: 5px;
  }
  .font-divide {
    font-weight: bold;
    font-size: 14px;
  }
  .small-label {
    font-size: 10px;
  }
  .align-items-center {
    align-items: center;
  }
  .configuration-item {
    margin-left: 25px;
  }
  .configuration-item label {
    width: 200px;
    margin-bottom: 0px;
  }
  .bordered-section-label {
    width: 200px;
    margin-bottom: 0px;
  }
  .bordered-section-select {
    width: 250px;
  }
  .ml-control {
    display: flex;
    align-items: center;
  }
  .ml-control input, .ml-control select {
    display: block;
    height: calc(2.25rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    height: calc(1.8125rem + 2px);
  }
  .mlplak-icon-button {
    cursor: pointer;
    padding: 2px 5px;
    transition: background-color 0.5s ease;
    border-radius: 2px;

    &:hover {
      background-color: #cbe2fb;
    }
  }
  .ml-control input.vw-4, .vw-4 {
    width: 4vw;
  }
  .ml-control.small select, .ml-control.small input{
    width: 100px;
  }
  .ml-control label {
    font-size: 12px;
    margin-bottom: 0px;
  }
  .avanzado-bordered-section {
    max-height: 400px;
    overflow-y: auto;
  }
  .avanzado-bordered-section .section-title {
    text-align: left;
    margin-left: 20px;
    font-size: 15px;
  }
  @media print {
    .not-printable {
      display: none;
    }
  }
  .inline-block {
    display: inline-block;
  }
  .fondo-material {
    height: 28px;
    text-align: left;
    padding: 0px 25px;
    color: #6c757d;
  }
  .highlighted {
    font-weight: bold;
    font-size: 15px;
    color: #2c3e50;
  }
</style>
<template>
    <div>
      <div class="bordered-container">
        <div class="flex">
          <div class="container-title not-printable"  @click="toggleContainer('modulo')">
            <span class="container-toggler more" v-if="containerExpanded['modulo']">▼</span>
            <span class="container-toggler less" v-if="!containerExpanded['modulo']">▲</span>
            Módulo
          </div>
        </div>
        <div class="bordered-section" :class="{'uncollapsed': containerExpanded['modulo']}">
          <div class="seccion-modulo flex">
            <div class="modulo-medidas flex-1">
              <div class="flex hover-line">
                <div class="column flex-1">
                  Alto:
                </div>
                <div class="column flex-1 align-center">
                    <input v-if="!mounted" v-model="customHeight" class="modulo-input-number" type="number">
                    <div v-else>{{ height }}mm</div>
                </div>
              </div>

              <div class="flex hover-line">
                <div class="column flex-1">
                  Ancho:
                </div>
                <div class="column flex-1 align-center">
                  <input class="modulo-input-number" v-if="!mounted" v-model="customWidth" type="number">
                  <div v-else>{{ width }}mm</div>
                </div>
              </div>
            
              <div v-if="moduloLineal" class="hover-line flex">
                <div class="column flex-1">
                  Profundidad:
                </div>
                <div class="column flex-1 align-center">
                  <input class="modulo-input-number" v-if="!mounted" v-model="customZ" type="number">
                  <div v-else>{{ z }}mm</div>
                </div>
              </div>

              <div v-if="!moduloLineal" class="hover-line flex">
                <div class="column flex-1">
                  Profundidad total:
                </div>
                <div class="column flex-1 align-center">
                  <input class="modulo-input-number" v-if="!mounted" v-model="customZ" type="number">
                  <div v-else>{{ z }}mm</div>
                </div>
              </div>
            
              <div v-if="!moduloLineal" class="hover-line flex">
                <div class="column flex-1">
                  Profundidad de lateral Izquierdo:
                </div>
                <div class="column flex-1 align-center">
                  <input class="modulo-input-number" v-if="!mounted" v-model="customLatIzqZ" type="number">
                  <div v-else>{{ latIzqZ }}mm</div>
                </div>
              </div>

              <div v-if="!moduloLineal" class="hover-line flex">
                <div class="column flex-1">
                  Profundidad de lateral Derecho:
                </div>
                <div class="column flex-1 align-center">
                  <input class="modulo-input-number" v-if="!mounted" v-model="customLatDerZ" type="number">
                  <div v-else>{{ latDerZ }}mm</div>
                </div>
              </div>
            
              <div v-if="mounted && moduloLineal" class="flex not-printable">
                <div class="column flex-1 margin-top-10">
                  <span class="medidas" v-on:click="changeDimensions">Cambiar medidas</span>
                </div>
              </div>
            </div>

            <div class="modulo-materiales flex-2">
              <div class="hover-line flex">
                <div class="column flex-1 flex align-items-center">
                  Material por defecto:
                </div>
                <div class="column flex-1 align-center">
                  <select id="material" v-model="material" :title="material" @change="onMaterialChange($event)"  name="material" class="form-control form-control-sm">
                      <option v-for="material in availableMaterials" :key="material" :value="material">{{ material }}</option>
                  </select>
                </div>
              </div>

              <div v-if="!isAmbienteSelected" class="hover-line flex">
                <div class="column flex-1 flex align-items-center">
                  Tapacantos por defecto:
                </div>
                <div class="column flex-1 align-center">
                  <select id="tapacantos" v-model="tapacanto" :title="tapacanto && tapacanto.nombre" @change="onTapacantosChange($event)"  name="tapacantos" class="form-control form-control-sm">
                      <option v-for="tapacanto in availableTapacantos" :key="tapacanto.id" :value="tapacanto">{{ tapacanto.nombre }}</option>
                  </select>
                </div>
              </div>

              <div v-if="moduloLineal" class="hover-line flex">
                <div class="column flex-1 flex align-items-center">
                  Material para fondo:
                </div>
                <div class="column flex-1 align-center">
                  <select id="materialFondo" v-model="materialFondo" :title="materialFondo" @change="onMaterialFondoChange($event)"  name="materialFondo" class="form-control form-control-sm">
                      <option :value="null">Sin fondo</option>
                      <option v-for="material in availableMaterialsFondo" :key="material" :value="material">{{ material }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="modulo-acciones flex-1">
              <div class="not-printable flex justify-center margin-top-10">
                <input type="checkbox" id="zero-width" name="zero-width" v-model="zeroWidth">
                <label for="zero-width" class="small-label">Crear sin espesor</label>
              </div>

              <div class="not-printable flex justify-center margin-top-10">
                <input type="radio" id="lineal" value="0" v-model="moduloType">
                <label for="lineal" class="small-label">Lineales</label>
                <input type="radio" id="l" value="1" v-model="moduloType" style="margin-left:15px">
                <label for="l" class="small-label">en L</label>
              </div>

              <div v-if="canClone" class="flex not-printable margin-top-10 margin-bottom-10 justify-center">
                <div class="flex-1">
                  <button class="btn btn-sm" v-on:click="cloneModule">
                    Clonar módulo
                  </button>
                </div>
              </div>

              <div v-if="!canClone" class="flex empty-row">
                <div class="column flex-1">
                </div>
                <div class="column flex-1 align-center">
                </div>
              </div>
            </div>
          </div>

          <div class="seccion-acciones not-printable">
            <div class="flex justify-center">
              <div class="flex" v-if="!mounted && moduloLineal">
                <button class="btn btn-sm" v-on:click="setupHorizontal" :disabled="configureDisabled()">
                  Configurar módulo (Piso/Techo)
                </button>
                <button class="btn btn-sm" v-on:click="setupVertical" :disabled="configureDisabled()">
                Configurar módulo (Laterales)
                </button>
              </div>
              <div class="flex" v-if="!mounted && !moduloLineal">
                <button class="btn btn-sm" v-on:click="setupLIzquierdo" :disabled="configureDisabled()">
                  Módulo L Izquierdo
                </button>
                <button class="btn btn-sm" v-on:click="setupLDerecho" :disabled="configureDisabled()">
                  Módulo L Derecho
                </button>
              </div>
              <div class="flex" v-if="mounted">
                <button class="btn btn-sm" v-on:click="resetModule" v-if="!dividing">
                  Restablecer módulo
                </button>
              </div>

              <div class="flex">
                <span class="v-separator" v-if="mounted && !dividing">|</span>
                <button @click="saveElementConfig()" v-if="mounted" type="button" class="btn btn-primary btn-sm">Guardar Módulo</button>
                <button @click="loadElementConfig()" type="button" class="btn btn-primary btn-sm">Cargar Módulo</button> <span  class="v-separator" v-if="mounted">|</span>
                <button @click="printModule()" v-if="mounted" type="button" class="btn btn-primary btn-sm">Imprimir</button>
                <div v-if="mounted" class="inline-block">
                  <b-button-group>
                    <b-dropdown right text="Imagen" variant="primary">
                      <b-dropdown-item @click="createModuleImage()">Descargar imagen</b-dropdown-item>
                      <b-dropdown-item @click="uploadModuleImage()">Exportar imagen al Servidor</b-dropdown-item>
                    </b-dropdown>
                  </b-button-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bordered-container">
        <div class="flex">
          <div class="container-title not-printable"  @click="toggleContainer('avanzado')">
            <span class="container-toggler more" v-if="containerExpanded['avanzado']">▼</span>
            <span class="container-toggler less" v-if="!containerExpanded['avanzado']">▲</span>
            Avanzado
          </div>
        </div>
        <div class="avanzado-bordered-section bordered-section not-printable" :class="{'uncollapsed': containerExpanded['avanzado']}">
          <div class="modulo-advanced-settings flex flex-column">
            <div class="section-title">
              Módulo
            </div>
            <div class="configuration-item hover-line flex align-items-center">
              <label for="espesorGeneral">Espesor General</label>
              <input id="espesorGeneral" v-model="EspesorGeneral">
            </div>
           
            <div class="configuration-item hover-line flex align-items-center">
              <label for="DesplazamientoFrentalCajon">Desplazamiento Frental Cajon</label>
              <input id="DesplazamientoFrentalCajon" v-model="DesplazamientoFrentalCajon">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="RetrasoFrontalFrente">Retraso Frontal Frente</label>
              <input id="RetrasoFrontalFrente" v-model="RetrasoFrontalFrente">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="RetrasoFrontalEstante">Retraso Frontal Estante</label>
              <input id="RetrasoFrontalEstante" v-model="RetrasoFrontalEstante">
            </div>
                  
            <div class="configuration-item hover-line flex align-items-center">
              <label for="HolguraEntreFrentes">Holgura Entre Frentes</label>
              <input id="HolguraEntreFrentes" v-model="HolguraEntreFrentes">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="HolguraLateralFrentesCajon">Holgura Lateral Frentes Cajon</label>
              <input id="HolguraLateralFrentesCajon" v-model="HolguraLateralFrentesCajon">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="SuperpuestoGlobalLateral">Superpuesto Global Lateral</label>
              <input id="SuperpuestoGlobalLateral" v-model="SuperpuestoGlobalLateral">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="SuperpuestoGlobalAltura">Superpuesto Global Altura</label>
              <input id="SuperpuestoGlobalAltura" v-model="SuperpuestoGlobalAltura">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="EspesorBarral">Espesor Barral</label>
              <input id="EspesorBarral" v-model="EspesorBarral">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="ProfundidadMarco">Profundidad Marco</label>
              <input id="ProfundidadMarco" v-model="ProfundidadMarco">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="AnchoListonesPisosTechos">Ancho Listones Pisos Techos</label>
              <input id="AnchoListonesPisosTechos" v-model="AnchoListonesPisosTechos">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="TechoMarco">Techo Marco</label>
              <input id="TechoMarco" v-model="TechoMarco">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="TechoCajoneras">Techo Cajoneras</label>
              <input id="TechoCajoneras" v-model="TechoCajoneras">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="Perfil35">Perfil 35</label>
              <input id="Perfil35" v-model="Perfil35">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="Espacio25">Espacio 25</label>
              <input id="Espacio25" v-model="Espacio25">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="Corte45Grados">Corte 45°</label>
              <input id="Corte45Grados" v-model="Corte45Grados">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="MargenLateral">Margen Lateral</label>
              <input id="MargenLateral" v-model="MargenLateral">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="MargenVertical">Margen Vertical</label>
              <input id="MargenVertical" v-model="MargenVertical">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="EspesorCajones">Espesor Cajones</label>
              <input id="EspesorCajones" v-model="EspesorCajones">
            </div>
          </div>
          <div class="modulo-conection-settings flex flex-column">
            <div class="section-title">
              Conexiones
            </div>
            <div class="configuration-item hover-line flex align-items-center">
              <label for="tornillo">Tornillo</label>
              <input id="tornillo" v-model="Tornillo">
            </div>

             <div class="configuration-item hover-line flex align-items-center">
              <label for="tarugo">Tarugo</label>
              <input id="tarugo" v-model="Tarugo">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="pituto">Pituto</label>
              <input id="pituto" v-model="Pituto">
            </div>

            <div class="configuration-item hover-line flex align-items-center">
              <label for="Minfix">Minfix</label>
              <input id="Minfix" v-model="Minfix">
            </div>
          </div>
        </div>
      </div>

      <div class="bordered-container" v-if="mounted && !hasCustomFondos && materialFondo && !isAmbienteSelected">
        <div class="flex">
          <div class="container-title not-printable" @click="toggleContainer('fondos')">
            <span class="container-toggler more" v-if="containerExpanded['fondos']">▼</span>
            <span class="container-toggler less" v-if="!containerExpanded['fondos']">▲</span>
            Fondo
          </div>
        </div>
        <div class="bordered-section" :class="{'uncollapsed': containerExpanded['fondos']}">
          <div class="fondo-material">
            Material de fondo
            <span class="highlighted" v-if="materialFondo">{{materialFondo}}</span>
          </div>
          <div class="flex">
            <div class="flex flex-column fondo-medidas flex-1 bordered-separator-right">
              <div class="flex">
                <span class="fondo-label inline-flex">Estirar hacia arriba</span>
                <input v-model="selectedModule.ExtraAlto" type="number" @keydown="updateArea()">
              </div>

              <div class="flex">
                <span class="fondo-label inline-flex">Estirar hacia derecha</span>
                <input v-model="selectedModule.ExtraDerecha" type="number" @keydown="updateArea()">
              </div>

              <div class="flex">
                <span class="fondo-label inline-flex">Estirar hacia abajo</span>
                <input v-model="selectedModule.ExtraAbajo" type="number" @keydown="updateArea()">
              </div>

              <div class="flex">
                <span class="fondo-label inline-flex">Estirar hacia izquierda</span>
                <input v-model="selectedModule.ExtraIzquierda" type="number" @keydown="updateArea()">
              </div>
            </div>

            <div class="flex flex-1 flex-column" :class="{'fondo-opt-list': dividing}">

              <div v-if="!dividing">
                <div v-if="mounted" class="column flex-1 align-center">
                  <button class="btn btn-link btn-sm" @click="openDrawingModal()">Agregar dibujo a fondo</button>
                </div>
              </div>

              <div v-if="dividing" class="not-printable flex margin-top-10 justify-center">
                <div class="flex-1">
                  <div class="font-divide opt" v-for="divideOpt in divideOpts" :key="divideOpt.id" :value="divideOpt.id" @mouseover="setHoveredElement(divideOpt.id)" @click="doDivide(divideOpt)">
                    {{ divideOpt.id }}
                  </div>
                  <div v-if="divideOpts.length === 0" class="font-divide">
                    No se encontraron divisiones posibles
                  </div>
                </div>
                <div class="not-printable" v-if="selectedModule.customFondos.length <= 1 && !dividing">
                  <div>                    
                      <div v-if="mounted">
                        <button class="btn btn-link btn-sm" @click="openDrawingModal()">Agregar dibujo a fondo</button>
                      </div>
                  </div>
                </div>
              </div>

              <div class="margin-top-10">
                <button class="btn btn-sm btn-primary" v-if="!dividing && !hasCustomFondos && !isAmbienteSelected" v-on:click="toggleDivide">
                  Dividir fondo
                </button>
                <button class="btn btn-sm" v-if="dividing" v-on:click="toggleDivide">
                  Cancelar division
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



        <!-- Editar Fondo -->
        <edit-custom-fondos v-if="selectedModule.customFondos.length"></edit-custom-fondos>
   
        <div style="display:none" ref="configOptions" class="save-module-modal">
          <div>
            <h3>Guardar Módulo</h3>
            <br/>
            <form style="text-align:left">
              <div class="form-group">
                <label for="module-config-name">Nombre del módulo</label>
                <input type="text" class="form-control modulo-save-name" id="module-config-name" :class="{'ambiente-name': isAmbienteSelected, 'modulo-name': !isAmbienteSelected}">
              </div>
            </form>
          </div>
        </div>
        <b-modal ref="loadConfigModal" hide-footer title="Listado de presets guardadas">
          <div class="d-block text-center">
            <!-- <div>
              <div class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="project-filter-label">Filtrar</span>
                </div>
                <input ref="filterInput" type="text" class="form-control" id="project-filter" v-on:keyup="filtrar()" v-model="filterQuery">
              </div>
            </div> -->
            <table class="table table-bordered" style="width: 100% !important;">
              <thead class="thead-light">
                <tr>
                  <th class="text-center">Nombre</th>
                  <th class="text-center">Tipo</th>
                  <th class="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(config, index) in configuraciones" :key="index">
                  <td><a @click="configLoad(config.id)" class="config-elem config-elem-clickeable">{{ config.name }}</a></td>
                  <td><a class="config-elem">{{ config.type }}</a></td>
                  <td><button type="button" class="btn btn-sm btn-danger" @click="configDelete(index)">&#10006;</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-modal> 

        <!-- Modal dibujo calco -->
        <b-modal ref="drawingModal" hide-footer title="Agregar dibujo a Doble Fondo" v-model="drawingModalShow">
            <div class="d-block text-center" v-if="drawingModalShow && calco">
              <div class="title">
                {{calco.separator.name}}
              </div>
              <drawing-canvas :calco="calco"></drawing-canvas>
            </div>
        </b-modal>        
    </div>
</template>

<script>
import swal from 'sweetalert2'
import { HTTP } from '../index'
import { ModuleLType } from '../models/enums'
import domtoimage from 'dom-to-image'
import { STAGING_PROJECT_TOKEN } from '../constants'

export default {
  data () {
    return {
      customHeight: 1200,
      customWidth: 2500,
      customZ: 500,
      customLatIzqZ: 500,
      customLatDerZ: 500,
      material: null,
      materialFondo: null,
      tapacanto: null,
      dividing: false,
      drawingModalShow: false,
      configuraciones: [],
      containerExpanded: {
        modulo: true,
        fondos: true,
        avanzado: false
      }
    }
  },
  mounted () {
    this.customHeight = localStorage.getItem('temp_height') || this.customHeight
    this.customWidth = localStorage.getItem('temp_width') || this.customWidth
    this.customZ = localStorage.getItem('temp_customZ') || this.customZ
    this.customLatIzqZ = localStorage.getItem('temp_customLatIzqZ') || this.customLatIzqZ
    this.customLatDerZ = localStorage.getItem('temp_customLatDerZ') || this.customLatDerZ
    this.material = this.materialDefault()
    this.tapacanto = this.tapacantosDefault()
    this.materialFondo = this.selectedModule.fondo
    this.containerExpanded['modulo'] = this.isContainerExpanded('modulo')
    this.containerExpanded['fondos'] = this.isContainerExpanded('fondos')
    this.containerExpanded['avanzado'] = this.isContainerExpanded('avanzado')
  },
  watch: {
    hasCustomFondos: function (newVal, oldVal) {
    },
    selectedModule: function (newVal, oldVal) {
      const material = this.getMaterialDefaultPorModulo(this.selectedModule.moduleId)
      this.material = material ? JSON.parse(material) : ''
      const tapacanto = this.getTapacantosDefaultPorModulo(this.selectedModule.moduleId)
      // fix perdida de tapacanto
      var tcId = tapacanto ? JSON.parse(tapacanto).id : -1
      var tc = this.availableTapacantos.find(tc => tc.id === tcId)
      this.tapacanto = tc || ''
    }
  },
  computed: {
    moduleSettings () {
      return this.$store.getters.selectedModule.settings
    },
    EspesorGeneral: {
      get () {
        return this.moduleSettings.EspesorGeneral
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'EspesorGeneral', value: Number(value) })
      }
    },
    DesplazamientoFrentalCajon: {
      get () {
        return this.moduleSettings.DesplazamientoFrentalCajon
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'DesplazamientoFrentalCajon', value: Number(value) })
      }
    },
    RetrasoFrontalFrente: {
      get () {
        return this.moduleSettings.RetrasoFrontalFrente
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'RetrasoFrontalFrente', value: Number(value) })
      }
    },
    RetrasoFrontalEstante: {
      get () {
        return this.moduleSettings.RetrasoFrontalEstante
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'RetrasoFrontalEstante', value: Number(value) })
      }
    },
    HolguraEntreFrentes: {
      get () {
        return this.moduleSettings.HolguraEntreFrentes
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'HolguraEntreFrentes', value: Number(value) })
      }
    },
    HolguraLateralFrentesCajon: {
      get () {
        return this.moduleSettings.HolguraLateralFrentesCajon
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'HolguraLateralFrentesCajon', value: Number(value) })
      }
    },
    SuperpuestoGlobalLateral: {
      get () {
        return this.moduleSettings.SuperpuestoGlobalLateral
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'SuperpuestoGlobalLateral', value: Number(value) })
      }
    },
    SuperpuestoGlobalAltura: {
      get () {
        return this.moduleSettings.SuperpuestoGlobalAltura
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'SuperpuestoGlobalAltura', value: Number(value) })
      }
    },
    EspesorBarral: {
      get () {
        return this.moduleSettings.EspesorBarral
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'EspesorBarral', value: Number(value) })
      }
    },
    ProfundidadMarco: {
      get () {
        return this.moduleSettings.ProfundidadMarco
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'ProfundidadMarco', value: Number(value) })
      }
    },
    AnchoListonesPisosTechos: {
      get () {
        return this.moduleSettings.AnchoListonesPisosTechos
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'AnchoListonesPisosTechos', value: Number(value) })
      }
    },
    TechoMarco: {
      get () {
        return this.moduleSettings.TechoMarco
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'TechoMarco', value: Number(value) })
      }
    },
    TechoCajoneras: {
      get () {
        return this.moduleSettings.TechoCajoneras
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'TechoCajoneras', value: Number(value) })
      }
    },
    Perfil35: {
      get () {
        return this.moduleSettings.Perfil35
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'Perfil35', value: Number(value) })
      }
    },
    Espacio25: {
      get () {
        return this.moduleSettings.Espacio25
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'Espacio25', value: Number(value) })
      }
    },
    Corte45Grados: {
      get () {
        return this.moduleSettings.Corte45Grados
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'Corte45Grados', value: Number(value) })
      }
    },
    MargenLateral: {
      get () {
        return this.moduleSettings.MargenLateral
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'MargenLateral', value: Number(value) })
      }
    },
    MargenVertical: {
      get () {
        return this.moduleSettings.MargenVertical
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'MargenVertical', value: Number(value) })
      }
    },
    EspesorCajones: {
      get () {
        return this.moduleSettings.EspesorCajones
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'EspesorCajones', value: Number(value) })
      }
    },
    Tornillo: {
      get () {
        return this.moduleSettings.Tornillo
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'Tornillo', value: Number(value) })
      }
    },
    Tarugo: {
      get () {
        return this.moduleSettings.Tarugo
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'Tarugo', value: Number(value) })
      }
    },
    Pituto: {
      get () {
        return this.moduleSettings.Pituto
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'Pituto', value: Number(value) })
      }
    },
    Minfix: {
      get () {
        return this.moduleSettings.Minfix
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'Minfix', value: Number(value) })
      }
    },
    calco () {
      const fondo = {
        name: 'Fondo',
        moduleName: this.selectedModule.moduleName,
        moduleId: this.selectedModule.moduleId,
        visible: true,
        elementType: 'fondo',
        comentario: '',
        parent: null,
        id: this.selectedModule.moduleId * 100000
      }
      return this.$store.getters.getFondoCalco(fondo)
    },
    isAmbienteSelected () {
      return !!this.$store.state.layout.ambienteEnabled
    },
    moduloType: {
      get () {
        return this.selectedModule.isTypeL ? '1' : '0'
      },
      set (val) {
        this.selectedModule.isTypeL = val === '1'
      }
    },
    zeroWidth: {
      get () {
        return this.$store.state.layout.zeroWidth
      },
      set (val) {
        this.$store.commit('updateZeroWidth', val)
      }
    },
    moduloLineal () {
      return this.moduloType === '0'
    },
    width: {
      get () {
        return this.mounted ? (this.selectedModule.displayWidth && this.selectedModule.displayWidth > 0 ? this.selectedModule.displayWidth : this.selectedModule.width) : this.customWidth
      }
    },
    height: {
      get () {
        return this.mounted ? this.selectedModule.height : this.customHeight
      }
    },
    z: {
      get () {
        if (!this.mounted) {
          return this.customZ
        }
        if (this.selectedModule.isTypeL) {
          return this.selectedModule.LLength
        }

        return this.selectedModule.z
      }
    },
    latIzqZ: {
      get () {
        return this.mounted ? this.selectedModule.latIzqZ : this.customLatIzqZ
      }
    },
    latDerZ: {
      get () {
        return this.mounted ? this.selectedModule.latDerZ : this.customLatDerZ
      }
    },
    mounted () {
      return this.$store.getters.selectedModule.elements.length > 0
    },
    canClone () {
      return this.$store.state.layout.modules.length > 1
    },
    selectedModule: {
      get () {
        return this.$store.getters.selectedModule
      }
    },
    availableMaterials () {
      const materiales = this.$store.state.general.materiales_add
      if (!materiales) {
        return []
      }
      return JSON.parse(materiales).map(m => m.material)
    },
    availableTapacantos () {
      return this.$store.getters.getTapacantosAdd
    },
    availableMaterialsFondo () {
      const materiales = this.$store.state.general.materiales_add
      if (!materiales) {
        return []
      }
      this.materialFondo = this.selectedModule.fondo || null
      return JSON.parse(materiales).map(m => m.material)
    },
    divideOpts () {
      return this.$store.getters.getFondoDivideOptions
    },
    hasCustomFondos () {
      return this.selectedModule.customFondos.length > 0
    }
  },
  methods: {
    setErrorsIn3d (errors) {
      this.$store.commit('setErrorsIn3d', errors)
    },
    toggleContainer (containerId) {
      const value = localStorage.getItem(containerId)
      if (value === 'true') {
        localStorage.setItem(containerId, 'false')
        this.containerExpanded[containerId] = false
      } else {
        localStorage.setItem(containerId, 'true')
        this.containerExpanded[containerId] = true
      }
    },
    isContainerExpanded (containerId) {
      const value = localStorage.getItem(containerId)
      if (value === undefined) {
        return containerId !== 'avanzado'
      }
      return localStorage.getItem(containerId) === 'true'
    },
    timedUpdate (callback) {
      clearTimeout(this.timer)
      this.timer = setTimeout(callback, 500)
    },
    updateArea () {
      this.timedUpdate(() => {
        this.$store.commit('setFondoExtraArea', { key: 'ExtraAlto', value: Number(this.selectedModule.ExtraAlto) })
        this.$store.commit('setFondoExtraArea', { key: 'ExtraAbajo', value: Number(this.selectedModule.ExtraAbajo) })
        this.$store.commit('setFondoExtraArea', { key: 'ExtraDerecha', value: Number(this.selectedModule.ExtraDerecha) })
        this.$store.commit('setFondoExtraArea', { key: 'ExtraIzquierda', value: Number(this.selectedModule.ExtraIzquierda) })
      })
    },
    openDrawingModal () {
      this.$refs.drawingModal.show()
    },
    exportList () {
      if (this.isAmbienteSelected) {
        let self = this
        var info = this.$store.state.info
        // DEBUG ONLY!
        if (STAGING_PROJECT_TOKEN) {
          info.token_project = STAGING_PROJECT_TOKEN
        }
        const parts = [...JSON.parse(JSON.stringify(this.$store.getters.getPartList)), ...JSON.parse(JSON.stringify(this.$store.getters.getRoomEditorPartList))]
        let data = {
          info: info,
          rotacion: this.$store.getters.getModulesRotacion,
          parts: parts,
          id_cliente: 21,
          id_proyecto: 18
        }
        HTTP.post('/api/3dviewer/save_parts', {
          data: data
        }).then(result => {
          let resp = result.data.response
          this.setErrorsIn3d(undefined)
          self.$store.commit('setGeneralInfo', { key: 'token_project', value: resp.token_project })
        }).catch(result => {
          this.setErrorsIn3d(result)
        })
      }
    },
    toggleDownloadableElements (show) {
      const elements = document.getElementsByClassName('downloadable-hidden')
      for (let index = 0; index < elements.length; index++) {
        elements[index].style = show ? 'display: block; background: white;' : 'display: none;'
      }
    },
    createModuleImage () {
      // make details visible
      this.toggleDownloadableElements(true)
      let node = document.getElementsByClassName('downloadable-image')[0]
      node.style = 'padding: 20px 0px;background-color: white;'
      let that = this
      domtoimage.toJpeg(node).then(function (dataUrl) {
        var link = document.createElement('a')
        link.download = that.$store.state.info.name + ' - ' + that.$store.state.info.mueble + ' - ' + that.selectedModule.moduleName + '.jpeg'
        link.href = dataUrl
        link.click()
        // hide details again
      }).catch(function (error) {
        console.error('oops, something went wrong!', error)
      }).finally(() => {
        node.style = 'background-color: white;'
        this.toggleDownloadableElements(false)
      })
    },
    uploadModuleImage () {
      // make details visible
      this.toggleDownloadableElements(true)
      let node = document.getElementsByClassName('downloadable-image')[0]
      node.style = 'padding: 20px 0px;background-color: white;'
      let that = this
      domtoimage.toJpeg(node).then(function (dataUrl) {
        var info = that.$store.state.info
        // DEBUG ONLY!
        if (STAGING_PROJECT_TOKEN) {
          info.token_project = STAGING_PROJECT_TOKEN
        }

        HTTP.post('/api/v2/images', {
          base64: dataUrl,
          project_name: info.token_project
        }).then(result => {
          that.$noty.success('La imagen se ha subido con exito')
        }).catch(result => {
          that.$noty.error('Error al subir imagen al servidor. Intentelo nuevamente.')
        })
      }).finally(() => {
        node.style = 'background-color: white;'
        this.toggleDownloadableElements(false)
      })
    },
    materialDefault () {
      const material = this.getMaterialDefaultPorModulo(this.selectedModule.moduleId)
      return material ? JSON.parse(material) : ''
    },
    getMaterialDefaultPorModulo (id) {
      return this.$store.state.general[this.isAmbienteSelected ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo'][id - 1]
    },
    getTapacantosDefaultPorModulo (id) {
      return this.$store.state.general[this.isAmbienteSelected ? 'tapacantos_default_por_modulo_room_editor' : 'tapacantos_default_por_modulo'][id - 1]
    },
    tapacantosDefault () {
      const tapacanto = this.getTapacantosDefaultPorModulo(this.selectedModule.moduleId)
      return tapacanto ? JSON.parse(tapacanto) : ''
    },
    saveElementConfig () {
      this.$refs.configOptions.style.display = 'block'
      this.$swal({
        content: this.$refs.configOptions,
        buttons: {
          cancelar: {
            text: 'Cancelar',
            value: 0
          },
          save: {
            text: 'Guardar',
            value: 1
          }
        }
      }).then((result) => {
        const elements = [...document.getElementsByClassName('modulo-save-name')]
        const element = elements[elements.length - 1]
        const name = element.value
        if (result === 1 && name) {
          const app = JSON.parse(localStorage.getItem('vuex'))
          const mod = this.isAmbienteSelected ? app.layout.roomEditorModules[this.$store.getters.selectedModuleId] : app.layout.modules[this.$store.getters.selectedModuleId]
          const config = {
            name,
            type: this.isAmbienteSelected ? 'Ambiente' : 'Modulo',
            values: [
              { name: 'mod', value: mod },
              { name: 'created_at', value: new Date() },
              { name: 'default_tapacantos', value: this.getTapacantosDefaultPorModulo(mod.moduleId) },
              { name: 'default_material', value: this.getMaterialDefaultPorModulo(mod.moduleId) },
              { name: 'original_project_name', value: localStorage.getItem('projectName') }
            ]
          }

          HTTP.post('/api/configuracion', config).then(result => {
            if (result.data.success) {
              this.$noty.success('¡Datos guardados correctamente!')
            }
          }).catch(result => {
            this.$noty.error('¡Error al guardar los datos!')
          })
        }
        element.value = ''
        this.$refs.configOptions.style.display = 'none'
      })
    },
    loadElementConfig () {
      let self = this
      const type = this.isAmbienteSelected ? 'ambiente' : 'modulo'
      HTTP.get('/api/configuracion/tipo/' + type).then(result => {
        self.configuraciones = result.data.configuraciones
        self.$refs.loadConfigModal.show()
      }).catch(result => {
        this.$noty.error('¡Error al cargar datos!')
      })
    },
    printModule () {
      window.print()
    },
    configLoad (id) {
      this.$noty.info('Cargando configuración...')
      HTTP.get(`/api/configuracion/${id}`).then((response) => {
        const config = response.data.configuracion.values
        const mod = config.find((value) => value.name === 'mod').value
        const currentModIndex = this.$store.getters.selectedModuleId
        if (this.isAmbienteSelected) {
          this.$store.state.layout.roomEditorModules[currentModIndex] = mod
        } else {
          this.$store.state.layout.modules[currentModIndex] = mod
        }
        this.$refs.loadConfigModal.hide()
        const tapacantos = config.find((value) => value.name === 'default_tapacantos')
        if (tapacantos && tapacantos.value) {
          this.$store.commit('setDefaultTapacantosForModule', { tapacantos: JSON.parse(tapacantos.value), module: this.selectedModule.moduleId, ambienteEnabled: this.isAmbienteSelected })
        }
        const material = config.find((value) => value.name === 'default_material')
        if (material && material.value) {
          this.$store.commit('setDefaultMaterialForModule', { material: JSON.parse(material.value), module: this.selectedModule.moduleId, ambienteEnabled: this.isAmbienteSelected })
        }
        this.$store.commit('cloneModule', { current: currentModIndex, new: currentModIndex + '', mod: mod })
        window.location.reload()
      })
    },
    configDelete (index) {
      const config = this.configuraciones[index]
      let self = this

      this.$swal('No podrá volver a acceder a dicha configuración', {
        title: '¿Seguro de eliminar configuración?',
        icon: 'warning',
        buttons: {
          cancel: 'Cancelar',
          aceptar: {
            text: 'Confirmar',
            value: true
          }
        }
      }).then((value) => {
        if (value === true) {
          self.$noty.info('Eliminando configuración...')
          HTTP.delete(`/api/configuracion/${config.id}`).then((response) => {
            if (response.data.success) {
              self.$noty.success('¡Configuración eliminada con éxito!')
              self.configuraciones.splice(index, 1)
            }
          })
        } else {
          this.close()
        }
      })
    },
    configureDisabled () {
      return this.customHeight === '' ||
      this.customWidth === '' ||
      this.customZ === '' ||
      !this.material ||
      (!this.tapacanto && !this.isAmbienteSelected) ||
      (this.moduloType === '1' && (this.customLatIzqZ === '' || this.customLatDerZ === ''))
    },
    setHoveredElement (id) {
      this.$store.commit('setHoveredElement', { elementId: id })
    },
    onMaterialChange: function (e) {
      if (this.$store.getters.selectedModule.elements.length > 0) {
        this.$swal('Esta acción aplicará sólo a este módulo', {
          title: 'Cambiar el material por defecto',
          icon: 'warning',
          buttons: {
            default: {
              text: 'Solo las que ya tienen material',
              value: 0
            },
            empty: {
              text: 'Solo las que no tienen material',
              value: 1
            },
            all: {
              text: 'Cambiar a todas las piezas',
              value: 2
            }
          }
        }).then((result) => {
          this.$store.commit('setGeneralProperty', { key: 'material_default', value: JSON.stringify(this.material) })
          this.$store.commit('updatePiecesMaterial', { material: this.material, update: result })
          this.$store.commit('setDefaultMaterialForModule', { material: this.material, module: this.selectedModule.moduleId, ambienteEnabled: this.isAmbienteSelected })
        })
      } else {
        this.$store.commit('setGeneralProperty', { key: 'material_default', value: JSON.stringify(this.material) })
        this.$store.commit('updatePiecesMaterial', { material: this.material, update: 0 })
        this.$store.commit('setDefaultMaterialForModule', { material: this.material, module: this.selectedModule.moduleId, ambienteEnabled: this.isAmbienteSelected })
      }
    },
    onTapacantosChange: function (e) {
      if (this.$store.getters.selectedModule.elements.length > 0) {
        this.$swal('Esta acción aplicará sólo a este módulo', {
          title: 'Cambiar tapacantos por defecto',
          icon: 'warning',
          buttons: {
            default: {
              text: 'Solo las que ya tienen tapacantos',
              value: 0
            },
            empty: {
              text: 'Solo las que no tienen tapacantos',
              value: 1
            },
            all: {
              text: 'Cambiar a todas las piezas',
              value: 2
            }
          }
        }).then((result) => {
          this.saveTempMeasures()
          this.$store.commit('setGeneralProperty', { key: 'tapacantos_default', value: this.tapacanto })
          this.$store.commit('updatePiecesTapacantos', { tapacanto: this.tapacanto, update: result })
          this.$store.commit('setDefaultTapacantosForModule', { tapacantos: this.tapacanto, module: this.selectedModule.moduleId, ambienteEnabled: this.isAmbienteSelected })
        })
      } else {
        this.saveTempMeasures()
        this.$store.commit('setGeneralProperty', { key: 'tapacantos_default', value: this.tapacanto })
        this.$store.commit('updatePiecesTapacantos', { tapacanto: this.tapacanto, update: 0 })
        this.$store.commit('setDefaultTapacantosForModule', { tapacantos: this.tapacanto, module: this.selectedModule.moduleId, ambienteEnabled: this.isAmbienteSelected })
      }
    },
    onMaterialFondoChange: function (e) {
      this.$store.commit('updateMaterialFondo', { material: this.materialFondo })
    },
    saveTempMeasures () {
      localStorage.setItem('temp_height', this.customHeight)
      localStorage.setItem('temp_width', this.customWidth)
      localStorage.setItem('temp_customZ', this.customZ)
      localStorage.setItem('temp_customLatIzqZ', this.customLatIzqZ)
      localStorage.setItem('temp_customLatDerZ', this.customLatDerZ)
    },
    setupHorizontal: function () {
      this.$store.commit('setupModule', { width: Number(this.customWidth), height: Number(this.customHeight), z: Number(this.customZ), mainLayout: 'horizontal', tapacantos: this.tapacantosDefault(), material: this.materialDefault() })
      this.exportList()
    },
    setupVertical: function () {
      this.$store.commit('setupModule', { width: Number(this.customWidth), height: Number(this.customHeight), z: Number(this.customZ), mainLayout: 'vertical', tapacantos: this.tapacantosDefault(), material: this.materialDefault() })
      this.exportList()
    },
    setupLIzquierdo: function () {
      this.$store.commit('setupLModule', { lType: ModuleLType.izquierdo, width: Number(this.customWidth), height: Number(this.customHeight), z: Number(this.customZ), mainLayout: 'vertical', latIzqZ: Number(this.customLatIzqZ), latDerZ: Number(this.customLatDerZ), tapacantos: this.tapacantosDefault(), material: this.materialDefault() })
      this.exportList()
    },
    setupLDerecho: function () {
      this.$store.commit('setupLModule', { lType: ModuleLType.derecho, width: Number(this.customWidth), height: Number(this.customHeight), z: Number(this.customZ), mainLayout: 'vertical', latIzqZ: Number(this.customLatIzqZ), latDerZ: Number(this.customLatDerZ), tapacantos: this.tapacantosDefault(), material: this.materialDefault() })
      this.exportList()
    },
    resetModule: function () {
      this.$store.commit('resetModule')
      this.exportList()
    },
    toggleDivide: function () {
      this.dividing = !this.dividing
    },
    doDivide: function (divider) {
      this.$store.commit('divideFondo', divider)
      this.toggleDivide()
      this.setHoveredElement(-1)
    },
    async cloneModule () {
      let modules = {}
      const currentModuleId = this.$store.getters.selectedModuleId
      this.$store.getters.getModulesList.forEach((mod, index) => {
        if (index !== this.$store.getters.selectedModuleId) {
          modules[index] = mod.module
        }
      })
      let result = await swal({
        title: 'Clonar',
        input: 'select',
        inputOptions: modules,
        inputPlaceholder: 'Clonar en...'
      })

      if (result.value) {
        const newModuleZeroIndex = result.value
        const tapacantos = this.getTapacantosDefaultPorModulo(+currentModuleId + 1)
        this.$store.commit('setDefaultTapacantosForModule', { tapacantos: tapacantos ? JSON.parse(tapacantos) : undefined, module: +newModuleZeroIndex + 1, ambienteEnabled: this.isAmbienteSelected })
        const material = this.getMaterialDefaultPorModulo(+currentModuleId + 1)
        this.$store.commit('setDefaultMaterialForModule', { material: material ? JSON.parse(material) : undefined, module: +newModuleZeroIndex + 1, ambienteEnabled: this.isAmbienteSelected })
        this.$store.commit('cloneModule', { current: currentModuleId, new: newModuleZeroIndex })
      }
    },
    async changeDimensions () {
      let result = await swal({
        title: 'Cambiar medidas',
        html: `
         <div style="color:red;padding-bottom:10px">¡Atención! esto reseteará el fondo del mueble y se perderán todas las divisiones</div>
         <span>Alto</span>
         <input id="height" class="swal2-input" value="${this.selectedModule.height}">
         <span>Ancho</span>
         <input id="width" class="swal2-input"  value="${this.selectedModule.width}">
         <span>Profundidad</span>
         <input id="z" class="swal2-input"  value="${this.selectedModule.z}">`,
        preConfirm: () => {
          return [
            document.getElementById('height').value,
            document.getElementById('width').value,
            document.getElementById('z').value
          ]
        }
      })
      if (result.value) {
        this.$store.commit('setSelectedModuleDimension', { height: Number(result.value[0]), width: Number(result.value[1]), z: Number(result.value[2]) })
      }
    }
  }
}
</script>