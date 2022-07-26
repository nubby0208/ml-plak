<template>
  <div>
    <div class="header-container">
      <h4 class="header-title">
        <b-button
          size="sm"
          class="help-button"
          variant="outline-primary"
          @click="openHelpModal()"
        >
          <b-icon icon="question"></b-icon>
        </b-button>
      </h4>
    </div>

    <b-modal id="help-modal" title="Ayuda" size="xl">
      <h4>Conexiones</h4>
      <b-table striped bordered :items="conexionesHelp"></b-table>
      <h4>Herramientas</h4>
      <b-table striped bordered :items="herramientasHelp"></b-table>

      <template #modal-footer>
        <b-button variant="light" @click="$bvModal.hide('help-modal')">
          Cerrar
        </b-button>
      </template>
    </b-modal>

    <div class="conexiones">
      <h5>Conexiones</h5>

      <div class="button-add-container">
        <b-button
          variant="outline-primary"
          size="sm"
          :disabled="isBusy"
          @click="openAddConexionModal()"
          >Agregar Conexion</b-button
        >
      </div>
      <b-table-simple
        hover
        small
        responsive
        striped
        :class="{ loading: isBusy }"
      >
        <colgroup>
          <col />
          <col />
        </colgroup>
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>
        <colgroup>
          <col />
          <col />
        </colgroup>
        <b-thead>
          <b-tr>
            <b-th>Nombre</b-th>
            <b-th>Cara</b-th>
            <b-th>Tipo</b-th>
            <b-th>Tipo Estrategia</b-th>
            <b-th>Alt 1</b-th>
            <b-th>Alt 2</b-th>
            <b-th>Prof 1</b-th>
            <b-th>Prof 2</b-th>
            <b-th>Prof 3</b-th>
            <b-th>Profundidad Perforacion</b-th>
            <b-th>Alt Movimiento Herramienta</b-th>
            <b-th>Diametro Perforacion</b-th>
            <b-th>Herramienta</b-th>
            <b-th>Extra 1</b-th>
            <b-th></b-th>
          </b-tr>
        </b-thead>
        <b-tbody v-if="!isBusy">
          <template v-for="c in conexiones">
            <b-tr v-bind:key="c.id + 'a'">
              <b-th rowspan="2">{{ c.nombre }}</b-th>
              <b-th>Anterior</b-th>
              <b-td>{{ c.anterior.tipo }}</b-td>
              <b-td>{{ c.anterior.tipoEstrategia }}</b-td>
              <b-td>{{ c.anterior.alt1 }}</b-td>
              <b-td>{{ c.anterior.alt2 }}</b-td>
              <b-td>{{ c.anterior.prof1 }}</b-td>
              <b-td>{{ c.anterior.prof2 }}</b-td>
              <b-td>{{ c.anterior.prof3 }}</b-td>
              <b-td>{{ c.anterior.profPerforacion }}</b-td>
              <b-td>{{ c.anterior.altMovimientoHerramienta }}</b-td>
              <b-td>{{ c.anterior.diametroPerforacion }}</b-td>
              <b-td>{{ c.anterior.herramienta }}</b-td>
              <b-td>{{ c.anterior.extra1 }}</b-td>
              <th rowspan="2">
                <b-button
                  size="sm"
                  variant="outline-primary"
                  @click="openEditConexionModal(c)"
                >
                  <b-icon icon="pencil"></b-icon>
                </b-button>

                <b-button
                  size="sm"
                  variant="outline-danger"
                  @click="openDeleteConexionModal(c)"
                >
                  <b-icon icon="trash"></b-icon>
                </b-button>
              </th>
            </b-tr>
            <b-tr v-bind:key="c.id + 'p'">
              <b-th>Posterior</b-th>
              <b-td>{{ c.posterior.tipo }}</b-td>
              <b-td>{{ c.posterior.tipoEstrategia }}</b-td>
              <b-td>{{ c.posterior.alt1 }}</b-td>
              <b-td>{{ c.posterior.alt2 }}</b-td>
              <b-td>{{ c.posterior.prof1 }}</b-td>
              <b-td>{{ c.posterior.prof2 }}</b-td>
              <b-td>{{ c.posterior.prof3 }}</b-td>
              <b-td>{{ c.posterior.profPerforacion }}</b-td>
              <b-td>{{ c.posterior.altMovimientoHerramienta }}</b-td>
              <b-td>{{ c.posterior.diametroPerforacion }}</b-td>
              <b-td>{{ c.posterior.herramienta }}</b-td>
              <b-td>{{ c.posterior.extra1 }}</b-td>
            </b-tr>
          </template>
        </b-tbody>
      </b-table-simple>
      <template v-if="isBusy">
        <div class="text-center text-danger my-2 loading">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Cargando...</strong>
        </div>
      </template>
    </div>

    <b-modal id="add-edit-conexion" size="xl" ref="addEditConexion" hide-footer>
      <template #modal-title>{{
        selectedConexion
          ? "Editar Conexion " + selectedConexion.nombre
          : "Agregar Conexion"
      }}</template>

      <b-form v-if="show" class="nombre-form">
        <b-form-group
          id="input-group-1"
          label="Nombre"
          required
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="formConexiones.nombre"
            required
          ></b-form-input>
        </b-form-group>
      </b-form>
      <div class="conexion-forms-container">
        <div class="conexion-form anterior">
          <p>Cara Anterior</p>
          <b-form v-if="show">
            <b-form-group
              id="input-group-t"
              label="Tipo:"
              required
              label-for="input-t"
              description="Hasta tres caracteres."
            >
              <b-form-input
                id="input-t"
                v-model="formConexiones.anterior.tipo"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Tipo de Estrategia:"
              label-for="input-2"
            >
              <b-form-select
                id="input-2"
                v-model="formConexiones.anterior.tipoEstrategia"
                :options="formOptionTipoEstrategia"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              id="input-group-4"
              label="Altura 1"
              required
              label-for="input-4"
              description="Numero positivo o negativo con decimales."
            >
              <b-form-input
                id="input-4"
                v-model="formConexiones.anterior.alt1"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-5"
              label="Altura 2"
              required
              label-for="input-5"
              description="Numero positivo o negativo con decimales."
            >
              <b-form-input
                id="input-5"
                v-model="formConexiones.anterior.alt2"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-6"
              label="Profundidad 1"
              required
              label-for="input-6"
              description="Numero positivo con decimales"
            >
              <b-form-input
                id="input-6"
                v-model="formConexiones.anterior.prof1"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group"
              label="Profundidad 2:"
              label-for="input-2"
            >
              <b-form-select
                id="input"
                v-model="formOptionAnteriorSiNoSelected"
                :options="formOptionSiNo"
                required
              ></b-form-select>
            </b-form-group>

            <div
              class="valor-prof-container"
              v-if="formOptionAnteriorSiNoSelected === 'Si'"
            >
              <b-form-group
                id="input-group-7"
                label="Valor Profundidad 2"
                label-for="input-7"
                description="Numero positivo con decimales"
              >
                <b-form-input
                  id="input-7"
                  v-model="formConexiones.anterior.prof2"
                ></b-form-input>
              </b-form-group>
            </div>

            <b-form-group
              id="input-group-8"
              label="Profundidad 3"
              required
              label-for="input-8"
              description="Numero positivo con decimales"
            >
              <b-form-input
                id="input-8"
                v-model="formConexiones.anterior.prof3"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-9"
              label="Profundidad de Perforacion"
              required
              label-for="input-9"
              description="Numero positivo o negativo con decimales."
            >
              <b-form-input
                id="input-9"
                v-model="formConexiones.anterior.profPerforacion"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-10"
              label="Altura movimiento herramienta"
              required
              label-for="input-10"
              description="Numero positivo o negativo con decimales."
            >
              <b-form-input
                id="input-10"
                v-model="formConexiones.anterior.altMovimientoHerramienta"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-12"
              label="Diametro Perforacion"
              required
              label-for="input-12"
              description="Numero positivo con decimales."
            >
              <b-form-input
                id="input-12"
                v-model="formConexiones.anterior.diametroPerforacion"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-3"
              label="Herramienta:"
              label-for="input-3"
            >
              <b-form-select
                id="input-3"
                v-model="formConexiones.anterior.herramienta"
                :options="formOptionHerramientas"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              id="input-group-11"
              label="Extra 1"
              label-for="input-11"
            >
              <b-form-input
                id="input-11"
                v-model="formConexiones.anterior.extra1"
              ></b-form-input>
            </b-form-group>
          </b-form>
        </div>
        <div class="divider"></div>
        <div class="conexion-form posterior">
          <p>Cara Posterior</p>
          <b-form v-if="show">
            <b-form-group
              id="input-group-t"
              label="Tipo:"
              required
              label-for="input-t"
              description="Hasta tres caracteres."
            >
              <b-form-input
                id="input-t"
                v-model="formConexiones.posterior.tipo"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Tipo de Estrategia:"
              label-for="input-2"
            >
              <b-form-select
                id="input-2"
                v-model="formConexiones.posterior.tipoEstrategia"
                :options="formOptionTipoEstrategia"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              id="input-group-4"
              label="Altura 1"
              required
              label-for="input-4"
              description="Numero positivo o negativo con decimales."
            >
              <b-form-input
                id="input-4"
                v-model="formConexiones.posterior.alt1"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-5"
              label="Altura 2"
              required
              label-for="input-5"
              description="Numero positivo o negativo con decimales."
            >
              <b-form-input
                id="input-5"
                v-model="formConexiones.posterior.alt2"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-6"
              label="Profundidad 1"
              required
              label-for="input-6"
              description="Numero positivo con decimales"
            >
              <b-form-input
                id="input-6"
                v-model="formConexiones.posterior.prof1"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group"
              label="Profundidad 2:"
              label-for="input-2"
            >
              <b-form-select
                id="input"
                v-model="formOptionPosteriorSiNoSelected"
                :options="formOptionSiNo"
                required
              ></b-form-select>
            </b-form-group>

            <div
              class="valor-prof-container"
              v-if="formOptionPosteriorSiNoSelected === 'Si'"
            >
              <b-form-group
                id="input-group-7"
                label="Valor Profundidad 2"
                label-for="input-7"
                description="Numero positivo con decimales"
              >
                <b-form-input
                  id="input-7"
                  v-model="formConexiones.posterior.prof2"
                ></b-form-input>
              </b-form-group>
            </div>

            <b-form-group
              id="input-group-8"
              label="Profundidad 3"
              required
              label-for="input-8"
              description="Numero positivo con decimales"
            >
              <b-form-input
                id="input-8"
                v-model="formConexiones.posterior.prof3"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-9"
              label="Profundidad de Perforacion"
              required
              label-for="input-9"
              description="Numero positivo o negativo con decimales."
            >
              <b-form-input
                id="input-9"
                v-model="formConexiones.posterior.profPerforacion"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-10"
              label="Altura movimiento herramienta"
              required
              label-for="input-10"
              description="Numero positivo o negativo con decimales."
            >
              <b-form-input
                id="input-10"
                v-model="formConexiones.posterior.altMovimientoHerramienta"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-12"
              label="Diametro Perforacion"
              required
              label-for="input-12"
              description="Numero positivo con decimales."
            >
              <b-form-input
                id="input-12"
                v-model="formConexiones.posterior.diametroPerforacion"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-3"
              label="Herramienta:"
              label-for="input-3"
            >
              <b-form-select
                id="input-3"
                v-model="formConexiones.posterior.herramienta"
                :options="formOptionHerramientas"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              id="input-group-11"
              label="Extra 1"
              label-for="input-11"
            >
              <b-form-input
                id="input-11"
                v-model="formConexiones.posterior.extra1"
              ></b-form-input>
            </b-form-group>
          </b-form>
        </div>
      </div>

      <div class="modal-footer">
        <b-button variant="light" @click="closeConexionModal()">
          Cancelar
        </b-button>
        <b-button variant="primary" @click="submitConexionModal()">{{
          selectedConexion ? "Guardar" : "Agregar"
        }}</b-button>
      </div>
    </b-modal>

    <b-modal id="delete-conexion" hide-header size="md">
      <h5 v-if="selectedConexion">
        ¿Estas seguro que deseas borrar la conexion
        <strong>{{ selectedConexion.nombre }}</strong> ?
      </h5>
      <template #modal-footer>
        <b-button size="sm" variant="light" @click="closeDeleteConexionModal()">
          Cancel
        </b-button>
        <b-button size="sm" variant="danger" @click="deleteConexion()">
          Borrar
        </b-button>
      </template>
    </b-modal>

    <div class="herramientas">
      <h5>Herramientas</h5>

      <div class="button-add-container">
        <b-button
          variant="outline-primary"
          size="sm"
          :disabled="isBusy"
          @click="openAddHerramientaModal()"
          >Agregar Herramienta</b-button
        >
      </div>
      <b-table
        striped
        hover
        responsive
        :busy="isBusy"
        :items="herramientas"
        :fields="herramientasFields"
      >
        <template #cell(actions)="row">
          <b-button
            size="sm"
            variant="outline-primary"
            @click="openEditHerramientaModal(row.item)"
          >
            <b-icon icon="pencil"></b-icon>
          </b-button>

          <b-button
            size="sm"
            variant="outline-danger"
            @click="openDeleteHerramientaModal(row.item)"
          >
            <b-icon icon="trash"></b-icon>
          </b-button>
        </template>

        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Cargando...</strong>
          </div>
        </template>
      </b-table>

      <b-modal
        id="add-edit-herramienta"
        size="xl"
        ref="addEditHerramienta"
        hide-footer
      >
        <template #modal-title>{{
          selectedHerramienta
            ? "Editar Herramienta " + selectedHerramienta.nombre
            : "Agregar Herramienta"
        }}</template>

        <b-form v-if="show">
          <b-form-group
            id="input-group-1"
            label="Nombre"
            required
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="formHerramientas.nombre"
              :disabled="selectedHerramienta"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Diametro de la Herramienta"
            required
            label-for="input-2"
            description="Numero positivo con decimales."
          >
            <b-form-input
              id="input-2"
              v-model="formHerramientas.diametroHerramienta"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-4"
            label="Profundidad de Pasada"
            required
            label-for="input-4"
            description="Numero positivo con decimales."
          >
            <b-form-input
              id="input-4"
              v-model="formHerramientas.profPasada"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-5"
            label="Velocidad de Avance"
            required
            label-for="input-5"
            description="Numero positivo con decimales."
          >
            <b-form-input
              id="input-5"
              v-model="formHerramientas.velAvance"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-m"
            label="Velocidad de Movimiento"
            required
            label-for="input-m"
            description="Numero positivo con decimales."
          >
            <b-form-input
              id="input-m"
              v-model="formHerramientas.velMovimiento"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-6"
            label="Velocidad de Bajada"
            required
            label-for="input-6"
            description="Numero positivo con decimales."
          >
            <b-form-input
              id="input-6"
              v-model="formHerramientas.velBajada"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-7"
            label="Profundidad de Pasada"
            required
            label-for="input-7"
            description="Numero positivo. Debe ser menor al radio de la herramienta."
          >
            <b-form-input
              id="input-7"
              v-model="formHerramientas.paso"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-8"
            label="Velocidad de Husillo"
            required
            label-for="input-8"
            description="Numero positivo con decimales."
          >
            <b-form-input
              id="input-8"
              v-model="formHerramientas.velHusillo"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-9"
            label="Zona Segura Z"
            required
            label-for="input-9"
            description="Numero positivo con decimales."
          >
            <b-form-input
              id="input-9"
              v-model="formHerramientas.zonaSeguraZ"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-10"
            label="Extra 2"
            label-for="input-10"
          >
            <b-form-input
              id="input-10"
              v-model="formHerramientas.extra2"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-11"
            label="Ajuste X"
            label-for="input-11"
          >
            <b-form-input
              id="input-11"
              v-model="formHerramientas.ajuste_x"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-12"
            label="Ajuste Y"
            label-for="input-12"
          >
            <b-form-input
              id="input-12"
              v-model="formHerramientas.ajuste_y"
            ></b-form-input>
          </b-form-group>

          <div class="modal-footer">
            <b-button variant="light" @click="closeHerramientaModal()">
              Cancelar
            </b-button>
            <b-button variant="primary" @click="submitHerramientaModal()">{{
              selectedHerramienta ? "Guardar" : "Agregar"
            }}</b-button>
          </div>
        </b-form>
      </b-modal>

      <b-modal id="delete-herramienta" size="md" hide-header>
        <h5 v-if="selectedHerramienta">
          ¿Estas seguro que deseas borrar la herramienta
          <strong>{{ selectedHerramienta.nombre }}</strong> ?
        </h5>
        <template #modal-footer>
          <b-button
            size="sm"
            variant="light"
            @click="closeDeleteHerramientaModal()"
          >
            Cancel
          </b-button>
          <b-button size="sm" variant="danger" @click="deleteHerramienta()">
            Borrar
          </b-button>
        </template>
      </b-modal>
    </div>

    <div id="footer">MlPlak - Centro de Diseño</div>
  </div>
</template>

<script>
import { HTTP } from "../index";
import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

export default {
  data() {
    return {
      conexionesHelp: [
        {
          columna: "Nombre",
          descripcion: "Nombre de la conexion.",
        },
        {
          columna: "Tipo Estrategia",
          descripcion: "Estrategia.",
        },
        {
          columna: "Alt 1",
          descripcion:
            "Compensacion de altura. Es un valor numerico que puede ser positivo o negativo y puede tener decimales",
        },
        {
          columna: "Alt 2",
          descripcion:
            "Compensacion de altura. Es un valor numerico que puede ser positivo o negativo y puede tener decimales. Se toma el valor que se utiliza para alt 1 virgen, y se le suma el espesor de la madera a la cual se conecta.",
        },
        {
          columna: "Prof 1",
          descripcion:
            "Margenes de perforacion. Es un valor numerico que puede ser positivo o negativo y puede tener decimales.",
        },
        {
          columna: "Prof 2",
          descripcion:
            "Es un valor numerico que puede ser positivo o negativo y puede tener decimales.",
        },
        {
          columna: "Prof 3",
          descripcion:
            "Es un valor numerico que puede ser positivo o negativo y puede tener decimales.",
        },
        {
          columna: "Profundidad Perforacion",
          descripcion:
            "Profundidad de perforacion o incicion. Es el valor en milimetros que va a entrar la mecha en la perforacion. Valor numerico con decimales.",
        },
        {
          columna: "Alt Movimiento Herramienta",
          descripcion:
            "Altura de Movimiento libre de la herramienta en el eje Z. Es un valor numerico con decimales, que se utilizara para darle la altura al eje Z para los movimientos cuando la herramienta se traslada de un punto a otro pero sin realzar corte.",
        },
        {
          columna: "Diametro Perforacion",
          descripcion:
            "Diametro deseado de perforacion. Valor numerico que puede tener decimales.",
        },
        {
          columna: "Herramienta",
          descripcion: "Herramienta de la lista de herramientas",
        },
        {
          columna: "Extra 1",
          descripcion: "Informacion extra.",
        },
      ],
      herramientasHelp: [
        {
          columna: "Nombre",
          descripcion: "Nombre de la herramienta.",
        },
        {
          columna: "Diametro de Herramienta",
          descripcion: "Diametro de la herramienta.",
        },
        {
          columna: "Profundidad de Pasada",
          descripcion:
            "Es la profundidad maxima que puede dar la herramienta por cada vez que pasa. Es un valor numerico.",
        },
        {
          columna: "Velocidad de Avance",
          descripcion:
            "Es la velocidad a la que se mueve la herramienta mientras funciona haciendo incicion desde un lado a otro. Es un valor numerico.",
        },
        {
          columna: "Velocidad de Bajada",
          descripcion:
            "Es la velocidad para bajar de un escalon a otro en el eje Z. Es un valor numerico.",
        },
        {
          columna: "Paso",
          descripcion:
            "Es el radio de la mecha que va a trabajar sobre la parte de material a cortar. Tiene que se menor al diametro de la herramienta.",
        },
        {
          columna: "Velocidad de Husillo",
          descripcion: "Es la velocidad al a que gira la herramienta.",
        },
        {
          columna: "Zona Segura Z",
          descripcion: "Es un valor numerico.",
        },
        {
          columna: "Extra 2",
          descripcion: "Informacion extra.",
        },
      ],
      conexiones: [],
      herramientas: [],
      isBusy: false,
      selectedConexion: undefined,
      formConexiones: {
        nombre: "",
        anterior: {
          tipoEstrategia: "",
          tipo: "",
          herramienta: null,
          tipoEstrategia: null,
          alt1: "",
          alt2: "",
          prof1: "",
          prof2: "",
          prof3: "",
          extra1: "",
          profPerforacion: "",
          altMovimientoHerramienta: "",
          diametroPerforacion: "",
        },
        posterior: {
          tipoEstrategia: "",
          herramienta: null,
          tipoEstrategia: null,
          tipo: "",
          alt1: "",
          alt2: "",
          prof1: "",
          prof2: "",
          prof3: "",
          extra1: "",
          profPerforacion: "",
          altMovimientoHerramienta: "",
          diametroPerforacion: "",
        },
      },
      formOptionSiNo: ["Si", "No"],
      formOptionAnteriorSiNoSelected: undefined,
      formOptionPosteriorSiNoSelected: undefined,
      formOptionHerramientas: [],
      formOptionTipoEstrategia: ["Perforado", "Calado", "Rebaje", "Dibujo"],
      show: true,
      selectedHerramienta: undefined,
      formHerramientas: {
        nombre: "",
        profPasada: "",
        velAvance: null,
        velMovimiento: null,
        velBajada: null,
        paso: "",
        diametroHerramienta: "",
        velHusillo: "",
        zonaSeguraZ: "",
        extra2: "",
        ajuste_x: "",
        ajuste_y: "",
      },
      herramientasFields: [
        { label: "Nombre", key: "nombre", sortable: true },
        {
          label: "Diametro Herramienta",
          key: "diametroHerramienta",
          sortable: true,
        },
        { label: "Profundidad de Pasada", key: "profPasada", sortable: true },
        { label: "Velocidad de Avance", key: "velAvance", sortable: true },
        { label: "Velocidad de Movimiento", key: "velMovimiento", sortable: true },
        { label: "Velocidad de Bajada", key: "velBajada", sortable: true },
        { label: "Paso", key: "paso", sortable: true },
        { label: "Velocidad de Husillo", key: "velHusillo", sortable: true },
        { label: "Zona Segura Z", key: "zonaSeguraZ", sortable: true },
        { label: "Extra 2", key: "extra2", sortable: false },
        { label: "Ajuste X", key: "ajuste_x", sortable: false },
        { label: "Ajuste Y", key: "ajuste_y", sortable: false },
        { label: "", key: "actions" },
      ],
    };
  },
  name: "Conexiones",
  props: [],
  methods: {
    openHelpModal() {
      this.$bvModal.show("help-modal");
    },
    back() {
      this.$router.push("DesignCenter");
    },
    submitHerramientaModal() {
      const herramienta = {
        name: this.formHerramientas.nombre,
        type: "ConexionesConfig",
        values: [
          { name: "tipo", value: "herramienta" },
          { name: "nombre", value: this.formHerramientas.nombre },
          { name: "profPasada", value: this.formHerramientas.profPasada },
          { name: "velAvance", value: this.formHerramientas.velAvance },
          { name: "velMovimiento", value: this.formHerramientas.velMovimiento },
          { name: "velBajada", value: this.formHerramientas.velBajada },
          { name: "paso", value: this.formHerramientas.paso },
          { name: "velHusillo", value: this.formHerramientas.velHusillo },
          { name: "zonaSeguraZ", value: this.formHerramientas.zonaSeguraZ },
          { name: "extra2", value: this.formHerramientas.extra2 },
          { name: "ajuste_x", value: this.formHerramientas.ajuste_x },
          { name: "ajuste_y", value: this.formHerramientas.ajuste_y },
          {
            name: "key",
            value: this.formHerramientas.nombre
              .toLowerCase()
              .split(" ")
              .join("_"),
          },
          {
            name: "diametroHerramienta",
            value: this.formHerramientas.diametroHerramienta,
          },
        ],
      };

      if (this.selectedHerramienta) {
        // actualizo una herramienta
        herramienta.id = this.selectedHerramienta.id;
        HTTP.put("/api/configuracion/" + herramienta.id, herramienta)
          .then((result) => {
            if (result.data.success) {
              this.$noty.success("¡Herramienta actualizada correctamente!");
            }
            this.getConexionesConfig();
            this.closeHerramientaModal();
          })
          .catch((result) => {
            this.$noty.error("¡Error al guardar los datos!");
          });
      } else {
        // creo una nueva herramienta
        HTTP.post("/api/configuracion", herramienta)
          .then((result) => {
            if (result.data.success) {
              this.$noty.success("¡Herramienta agregada correctamente!");
            }
            this.getConexionesConfig();
            this.closeHerramientaModal();
          })
          .catch((result) => {
            this.$noty.error("¡Error al guardar los datos!");
          });
      }
    },
    closeHerramientaModal() {
      this.$bvModal.hide("add-edit-herramienta");
      this.resetHerramientaModal();
    },
    resetHerramientaModal() {
      this.formHerramientas.nombre = "";
      this.formHerramientas.profPasada = "";
      this.formHerramientas.velAvance = "";
      this.formHerramientas.velMovimiento = "";
      this.formHerramientas.velBajada = "";
      this.formHerramientas.velHusillo = "";
      this.formHerramientas.extra2 = "";
      this.formHerramientas.ajuste_x = "";
      this.formHerramientas.ajuste_y = "";
      this.formHerramientas.diametroHerramienta = "";
      this.formHerramientas.paso = "";
      this.selectedHerramienta = undefined;
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    openAddHerramientaModal() {
      this.resetHerramientaModal();
      this.$bvModal.show("add-edit-herramienta");
    },
    openEditHerramientaModal(item) {
      this.selectedHerramienta = item;
      Object.assign(this.formHerramientas, item);
      this.$bvModal.show("add-edit-herramienta");
    },
    openDeleteHerramientaModal(item) {
      this.selectedHerramienta = item;
      this.$bvModal.show("delete-herramienta");
    },
    closeDeleteHerramientaModal() {
      this.selectedHerramienta = undefined;
      this.$bvModal.hide("delete-herramienta");
    },
    deleteHerramienta() {
      HTTP.delete(`/api/configuracion/${this.selectedHerramienta.id}`).then(
        (response) => {
          if (response.data.success) {
            this.$noty.success("¡Herramienta eliminada con éxito!");
            this.closeDeleteHerramientaModal();
            this.getConexionesConfig();
          }
        }
      );
    },
    openAddConexionModal() {
      this.resetConexionModal();
      this.$bvModal.show("add-edit-conexion");
    },
    openEditConexionModal(item) {
      this.selectedConexion = JSON.parse(JSON.stringify(item));
      Object.assign(this.formConexiones, this.selectedConexion);
      this.formOptionAnteriorSiNoSelected = item.anterior.prof2 ? "Si" : "No";
      this.formOptionPosteriorSiNoSelected = item.posterior.prof2 ? "Si" : "No";
      this.$bvModal.show("add-edit-conexion");
    },
    closeDeleteConexionModal() {
      this.selectedConexion = undefined;
      this.$bvModal.hide("delete-conexion");
    },
    deleteConexion() {
      HTTP.delete(`/api/configuracion/${this.selectedConexion.id}`).then(
        (response) => {
          if (response.data.success) {
            this.$noty.success("¡Conexion eliminada con éxito!");
            this.closeDeleteConexionModal();
            this.getConexionesConfig();
          }
        }
      );
    },
    openDeleteConexionModal(item) {
      this.selectedConexion = item;
      this.$bvModal.show("delete-conexion");
    },
    submitConexionModal() {
      const obj = this.formConexiones;
      obj.tipo = "conexion";

      if (this.formOptionAnteriorSiNoSelected === "No") {
        this.formConexiones.anterior.prof2 = undefined;
      }

      if (this.formOptionPosteriorSiNoSelected === "No") {
        this.formConexiones.posterior.prof2 = undefined;
      }

      const conexion = {
        name: this.formConexiones.nombre,
        type: "ConexionesConfig",
        values: [
          { name: "tipo", value: "conexion" },
          { name: "nombre", value: this.formConexiones.nombre },
          { name: "conexion", value: JSON.stringify(obj) },
          {
            name: "key",
            value: this.formConexiones.nombre
              .toLowerCase()
              .split(" ")
              .join("_"),
          },
        ],
      };

      if (this.selectedConexion) {
        // actualizo una conexion
        conexion.id = this.selectedConexion.id;
        HTTP.put("/api/configuracion/" + conexion.id, conexion)
          .then((result) => {
            if (result.data.success) {
              this.$noty.success("¡Conexion actualizada correctamente!");
            }
            this.getConexionesConfig();
            this.closeConexionModal();
          })
          .catch((result) => {
            this.$noty.error("¡Error al guardar los datos!");
          });
      } else {
        // creo una nueva conexion
        HTTP.post("/api/configuracion", conexion)
          .then((result) => {
            if (result.data.success) {
              this.$noty.success("¡Conexion agregada correctamente!");
            }
            this.getConexionesConfig();
            this.closeConexionModal();
          })
          .catch((result) => {
            this.$noty.error("¡Error al guardar los datos!");
          });
      }
    },
    closeConexionModal() {
      this.$bvModal.hide("add-edit-conexion");
      this.resetConexionModal();
    },
    resetConexionModal() {
      this.formConexiones.nombre = "";

      this.formConexiones.anterior.alt1 = "";
      this.formConexiones.anterior.alt2 = "";
      this.formConexiones.anterior.tipo = "";
      this.formConexiones.anterior.prof1 = "";
      this.formConexiones.anterior.prof2 = "";
      this.formConexiones.anterior.prof3 = "";
      this.formConexiones.anterior.extra1 = "";
      this.formConexiones.anterior.diametroPerforacion = "";
      this.formConexiones.anterior.profPerforacion = "";
      this.formConexiones.anterior.altMovimientoHerramienta = "";
      this.formConexiones.anterior.tipoEstrategia = null;
      this.formConexiones.anterior.herramienta = null;

      this.formConexiones.posterior.alt1 = "";
      this.formConexiones.posterior.alt2 = "";
      this.formConexiones.posterior.tipo = "";
      this.formConexiones.posterior.prof1 = "";
      this.formConexiones.posterior.prof2 = "";
      this.formConexiones.posterior.prof3 = "";
      this.formConexiones.posterior.extra1 = "";
      this.formConexiones.posterior.diametroPerforacion = "";
      this.formConexiones.posterior.profPerforacion = "";
      this.formConexiones.posterior.altMovimientoHerramienta = "";
      this.formConexiones.posterior.tipoEstrategia = null;
      this.formConexiones.posterior.herramienta = null;
      this.formOptionAnteriorSiNoSelected = undefined;
      this.selectedConexion = undefined;
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    getConexionesConfig() {
      this.isBusy = true;
      this.conexiones.length = 0;
      this.herramientas.length = 0;
      HTTP.get("/api/configuracion/tipo/ConexionesConfig/all")
        .then(({ data }) => {
          if (!data.error && data.configuraciones) {
            data.configuraciones.forEach((config) => {
              const object = this.buildFromJson(config.values);
              object.id = config.id;

              if (object.tipo === "conexion") {
                const conexion = JSON.parse(object.conexion);
                conexion.id = object.id;
                this.conexiones.push(conexion);
              } else {
                this.herramientas.push(object);
              }
            });
          }
          this.formOptionHerramientas = [
            { text: "", value: null },
            ...this.herramientas.map((h) => h.nombre),
          ];
          this.isBusy = false;
        })
        .catch((result) => {
          this.isBusy = false;
          this.$noty.error(
            "¡Error al cargar la configuracion de las conexiones!"
          );
        });
    },
    buildFromJson(values) {
      const obj = {};
      values.forEach((value) => {
        obj[value.name] = value.value;
      });
      return obj;
    },
  },
  created() {},
  mounted() {
    this.getConexionesConfig();
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.header-container {
  .help-button {
    position: absolute;
    right: 20px;
    margin-top: 10px;
  }
  a {
    position: absolute;
    left: 20px;
    margin-top: 10px;
    font-size: 16px;
  }
}
.modal-footer {
  display: flex;
  flex-direction: row;
}
.button-add-container {
  margin: 10px 0px;
  display: flex;
  flex-direction: row-reverse;
}
.conexiones,
.herramientas {
  padding: 20px;
}
b-table {
  margin: 20px 0px;
}
#footer {
  margin-top: 60px;
  left: 0px;
  bottom: 0px;
  height: 56px;
  width: 100%;
  padding: 10px 16px 0 24px;
  text-align: center;
  background: #35495e;
  color: white;
  font-size: 1.3em;
}
.valor-prof-container {
  background-color: #ccc;
  padding: 10px;
}
.conexion-forms-container {
  display: flex;

  .divider {
    width: 1px;
    background: #ccc;
    margin: 40px 0px;
  }

  .conexion-form {
    flex: 1;
    padding: 0px 20px;

    & > p {
      font-size: 24px;
    }
  }
}
.nombre-form {
  padding: 0px 20px;
}
.loading {
  opacity: 0.4;
}
</style>
