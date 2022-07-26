<template>
  <div class="page-contents">
    <notification></notification>
    <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
      <div class="row form-group">
        <div class="col-md-3">
          <b-form-input v-model="searchParam" placeholder="Filtrar por nombre" type="text" debounce="500"
            @update="filterBy"></b-form-input>
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-secondary"
            v-b-modal.modal-pedido
          >
            + Agregar pedido
          </button>
        </div>
        <div class="col-md-2">
          <b-form-select v-model="selectedEstado" :options="estados.map((el, i) => ({value: i, text: el}))"
            @change="filterBy">
            <template #first>
              <b-form-select-option value="">Filtrar por estado</b-form-select-option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md-2">
          <b-form-select v-model="selectedProveedor" :options="proveedores" value-field="id" text-field="empresa"
            @change="filterBy">
            <template #first>
              <b-form-select-option value="">Filtrar por proveedor</b-form-select-option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md-3">
          <button class="btn btn-default"
            v-b-modal.modal-proveedor
          >
            + Proveedores
          </button>
        </div>
        <div class="col-md-3 mt-3" v-if="selected.length">
          <button class="btn btn-danger" @click="deleteBulk">Eliminar selecionados</button>
        </div>
      </div>
      <div>
        <b-table 
          id="presupuestos" 
          striped responsive 
          :sort-by.sync="sortBy" 
          :sort-desc.sync="sortDesc" 
          :fields="fields"
          :items="pedidos.data" 
          style="background-color: white" 
          no-local-sorting
          selectable
          no-select-on-click
          ref="selectableTable"
          @row-selected="onRowSelected"
          :select-mode="'multi'"
          @sort-changed="$nextTick(() => obtenerPedidos())">
          <template #cell(selected)="{ rowSelected, index }">
            <b-form-checkbox
              @change="selectRow($event, index)"
              :v-model="rowSelected"
            ></b-form-checkbox>
          </template>
          <template #cell(estado)="data">
            <b-badge class="badge">{{ estados[data.item.estado] }}
              <span
                :class="estadosColors[data.item.estado]"
                @click="changeStatus(data.item.id)"
              >
                <font-awesome-icon icon="circle"></font-awesome-icon>
              </span>
            </b-badge>
          </template>
          <template #cell(created_at)="data">
            <b class="text-dark">{{
              $moment(data.item.created_at).format("DD-MM-YYYY ")
            }}</b>
          </template>

          <template #cell(producto)="data">
            <b class="text-dark">{{ data.item.producto }}</b>
          </template>

          <template #cell(comentario)="data">
            <b class="text-dark">{{ data.item.comentario }}</b>
          </template>
          <template #cell(imagen)="data">
            <b class="text-info" v-if="data.item.imagen">
              <a :href="data.item.imagen" target="_blank">link</a>
            </b>
          </template>
          <template #cell(usuario)="data">
            <b class="text-dark">{{ data.item.usuario }}</b>
          </template>

          <template #cell(resumen)="data">
            <b class="text-dark">{{ data.item.resumen }}</b>
          </template>

          <template #cell(actions)="data">
            <button class="btn btn-default" @click="editPedido(data.item)">
              <font-awesome-icon icon="edit"></font-awesome-icon>
            </button>
          </template>

        </b-table>
        <div style="display: flex">
          <b-pagination 
            style="margin: auto; margin-top: 20px"
            v-model="currentPage" 
            :total-rows="pageLimit"
            :per-page="1" 
            aria-controls="pedidos"
            @change="(page) => obtenerPedidos(page)">
          </b-pagination>
        </div>
      </div>
    </b-overlay>
    <b-modal
        id="modal-proveedor"
        ref="modal"
        size="lg"
        title="Agregar proveedor"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <div class="tabel-responsive" v-if="!showForm">
          <div class="row">
            <div class="col-md-3">
              <input type="search" v-model="filter" class="form-control" placeholder="filtrar">
            </div>
            <div class="col-md-9">
              <button class="btn btn-primary" @click="showFormProveedor">Agregar</button>
            </div>
          </div>
          <b-table striped hover small
            :items="proveedores"
            :fields="proveedorHeader"
            :filter="filter"
          >
            <template #cell(actions)="row">
              <div class="w-100 d-flex">
                <b-button size="sm" @click="showFormProveedor(row)" class="mr-1">
                  <font-awesome-icon icon="edit"></font-awesome-icon>
                </b-button>
                <b-button size="sm" variant="danger" @click="deleteProveedor(row.item.id)">
                  <font-awesome-icon icon="trash"></font-awesome-icon>
                </b-button>
              </div>
            </template>
          </b-table>
        </div>
        <form ref="form" @submit.stop.prevent="handleProveedor" v-if="showForm">
          <button class="btn btn-primary" @click="showForm=false">Volver</button>
          <b-form-group
            label="Empresa"
            label-for="empresa"
            invalid-feedback="El nombre de la empresa es requerido"
            :state="proveedorState.empresa"
          >
            <template #label>
              Empresa <span class="text-danger"></span>
            </template>
            <b-form-input
              id="empresa"
              placeholder="Nombre de la empresa"
              v-model="formProveedor.empresa"
              :state="proveedorState.empresa"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Contacto"
            label-for="contacto"
          >
            <b-form-input
              id="contacto"
              placeholder="Nombre del contacto"
              v-model="formProveedor.contacto"
              :state="proveedorState.contacto"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Mail"
            label-for="email"
          >
            <b-form-input
              id="email"
              placeholder="Mail"
              v-model="formProveedor.email"
              :state="proveedorState.email"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Teléfono"
            label-for="telefono"
          >
            <b-form-input
              id="telefono"
              placeholder="Teléfono"
              v-model="formProveedor.telefono"
              :state="proveedorState.telefono"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Dirección"
            label-for="direccion"
          >
            <b-form-input
              id="direccion"
              placeholder="Dirección"
              v-model="formProveedor.direccion"
              :state="proveedorState.direccion"
              required
            ></b-form-input>
          </b-form-group>
        </form>
        <template #modal-footer="{ ok, cancel }">
          
          <b-button variant="secondary" @click="cancel()">
            Cancelar
          </b-button>
          <b-button variant="primary" @click="ok()" v-if="showForm">
            Guardar
          </b-button>
        </template>
      </b-modal>

      <b-modal
        id="modal-pedido"
        ref="modal2"
        title="Agregar pedido"
        @show="resetModalPedido()"
        @hidden="resetModalPedido()"
        @ok="handleOkPedido"
      >
        <form ref="form" @submit.stop.prevent="handleProveedor">
          <b-form-group
            label="Producto"
            label-for="producto"
            invalid-feedback="El nombre del producto es requerido"
            :state="pedidoState.producto"
            id="search"
          >
            <template #label>
              Producto <span class="text-danger">*</span>
            </template>
            <input type="text" class="form-control" v-if="pedidoForm.id" v-model="pedidoForm.producto">
            <vue-bootstrap-typeahead v-else
              placeholder="Nombre del producto"
              v-model="pedidoForm.producto"
              :value="pedidoForm.producto"
              :serializer="item => item.material"
              :data="productos"
            />
          </b-form-group>

          <b-form-group
            label="Cantidad"
            label-for="cantidad"
          >
            <b-form-input
              id="cantidad"
              placeholder="Cantidad"
              type="number"
              min="1"
              v-model="pedidoForm.cantidad"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Cliente"
            label-for="cliente"
          >
            <b-form-input
              id="cliente"
              placeholder="Cliente"
              v-model="pedidoForm.cliente"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Comentario"
            label-for="comentario"
          >
            <b-form-input
              id="comentario"
              placeholder="Comentario"
              v-model="pedidoForm.comentario"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Imagen"
            label-for="imagen"
          >
            <b-form-input
              id="imagen"
              placeholder="Enlace de la imagen"
              v-model="pedidoForm.imagen"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Comentario resumen"
            label-for="resumen"
          >
            <b-form-input
              id="resumen"
              placeholder="Resumen"
              v-model="pedidoForm.resumen"
            ></b-form-input>
          </b-form-group>
          
          <div class="form-group">
            <label>Usuario</label>
            <input readonly :value="usuario.usuario" class="form-control">
          </div>

          <div class="form-group">
            <label for="proveedor">Proveedor <span class="text-danger">*</span></label>
            <select class="form-control" v-model="pedidoForm.proveedor_id">
              <option value="">Seleccione un provedor</option>
              <option :value="user.id" :key="user.id"
                v-for="user in proveedores"
              >{{user.empresa}} - {{user.contacto}}</option>
            </select>
            <div class="text-danger" v-if="pedidoState.proveedor_id==false">El proveedor es requerido</div>
          </div>
        </form>
      </b-modal>
  </div>
</template>

<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import usuarioService from '../Services/usuarioService'
import pedidoService from '../Services/pedidoService'
import proveedorService from '../Services/proveedorService'
import swal from "sweetalert2";
const UsuarioService = new usuarioService()

  export default {
    components: {
        VueBootstrapTypeahead
    },
    mounted() {
      this.getUsers()
      this.getProveedores()
      this.obtenerPedidos();
      this.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    data() {
      return {
        sortBy: "id",
        sortDesc: true,
        currentPage: 1,
        pageLimit: 1,
        loadingPage: true,
        fields: [
          { key: "selected", label: "#", sortable: false },
          {
            key: "estado",
            label: "Estado",
            sortable: true
          },
          {
            key: "created_at",
            label: "Fecha",
            sortable: true
          },
          {
            key: "cantidad",
            label: "Cantidad",
            sortable: true
          },
          {
            key: "producto",
            label: "Producto",
            sortable: true
          },
          {
            key: "cliente",
            label: "Cliente",
            sortable: true
          },
          {
            key: "comentario",
            label: "Comentario 1",
            sortable: true
          },
          {
            key: "imagen",
            label: "Imagen",
            sortable: false
          },
          {
            key: "usuario",
            label: "Usuario",
            sortable: true
          },
          {
            key: "resumen",
            label: "Comentario resumen",
            sortable: true,
          },{
            key: "actions",
            label: "#",
            sortable: false,
          },
        ],
        searchParam: "",
        usuarios: [],
        pedidos: [],
        proveedores: [],
        selectedProveedor: "",
        formProveedor: {
          empresa: '',
          contacto: '',
          email: '',
          telefono: '',
          direccion: '',
        },
        proveedorState: {
          empresa: null,
          contacto: null,
          email: null,
          telefono: null,
          direccion: null,
        },
        pedidoForm: {
          producto: '',
          comentario: '',
          imagen: '',
          usuario: '',
          proveedor_id: '',
          resumen: '',
          cantidad: '',
          cliente: '',
        },
        pedidoState: {
          producto: null,
          imagen: null,
          usuario: null,
          proveedor_id: null,
        },
        estados: [
          'Para pedir',
          'Pedido',
          'En deposito',
          'Recibido',
          'En falta',
        ],
        estadosColors: [
          'text-danger',
          'text-warning',
          'text-success',
          'text-success',
          'text-info',
        ],
        usuario: {},
        proveedorHeader: [
          { key: 'empresa', label: 'Empresa' },
          { key: 'contacto'},
          { key: 'email'},
          { key: 'telefono'},
          { key: 'direccion'},
          { key: 'actions', label: 'Acciones' }
        ],
        showForm: false,
        filter:'',
        productos: [],
        selected: [],
        selectedEstado: '',
      }
    },
    methods: {
      onRowSelected(items) {
        this.selected = items
      },
      async obtenerPedidos(page = this.currentPage) {
        this.loadingPage = true
        let params = {
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
          searchParam: this.searchParam,
          proveedor: this.selectedProveedor,
          estado: this.selectedEstado,
          page: page
        }
        this.pedidos = await pedidoService.getAll(params).catch(err => {
          this.loadingPage = false
          
        })
        this.pageLimit = this.pedidos.last_page
        //alert(this.pageLimit)
        this.loadingPage = false
      },
      filterBy() {
        this.obtenerPedidos();
      },
      async getUsers() {
        let data = await UsuarioService.getAll()
        if (data)
          this.usuarios = data.usuarios;
      },
      async getProveedores() {
        let data = await proveedorService.getAll()
        if (data)
          this.proveedores = data;
      },
      checkFormValidity() {
        let valid = this.$refs.form.checkValidity()
        console.log(valid)
        return valid
      },
      showFormProveedor(data = null){
        this.resetModal()
        console.log(data)
        if(data){
          this.formProveedor = {
            ...data.item
          }
        }
        this.showForm = true
      },
      resetModal() {
        this.formProveedor = {
          empresa: '',
          contacto: '',
          email: '',
          telefono: '',
          direccion: '',
        }
        this.proveedorState = {
          empresa: null,
          contacto: null,
          email: null,
          telefono: null,
          direccion: null,
        }
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleProveedor()
      },
      handleProveedor(){
        if(this.formProveedor.id){
          this.updateProveedor()
          return
        }
        proveedorService.store(this.formProveedor).then(async resp => {
          this.$noty.info('Se ha agregado el proveedor')
          this.getProveedores()
          this.showForm=false
          this.resetModal()
        }).catch(err => {
          this.$noty.error('Ha ocurrido un error')
        })
        
      },
      updateProveedor(){
        proveedorService.update(this.formProveedor.id, this.formProveedor).then(async resp => {
          this.$noty.info('Se ha guardado el proveedor')
          this.getProveedores()
          this.showForm=false
          this.resetModal()
        }).catch(err => {
          this.$noty.error('Ha ocurrido un error')
        })
      },
      resetModalPedido() {
        this.pedidoForm = {
          producto: '',
          comentario: '',
          imagen: '',
          usuario: '',
          proveedor_id: '',
          resumen: '',
        }
        this.pedidoState = {
          producto: null,
          proveedor_id: null,
        }
      },
      setModalPedido(data){
        if(data)
          this.pedidoForm = {...data}
        
      },
      handleOkPedido(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handlePedido()
      },
      handlePedido(){
        this.pedidoState.producto = null
        this.pedidoState.usuario = null
        this.pedidoState.provedor_id = null
        if(!this.pedidoForm.producto){
          this.pedidoState.producto = false
          return
        }
        if(!this.pedidoForm.proveedor_id){
          this.pedidoState.proveedor_id = false
          return
        }
        if(this.pedidoForm.id){
          this.updatePedido()
          return
        }
        pedidoService.store({
          ...this.pedidoForm,
          usuario: this.usuario.usuario
        }).then(() => {
          this.$noty.info('Se ha agregado el pedido')
          this.$nextTick(() => {
            this.$bvModal.hide('modal-pedido')
          })
          this.obtenerPedidos()
        }).catch(error => {
          try {
            this.$noty.error(Object.values(error.response.data).flat()[0])
          } catch (err) {
            this.$noty.error('Ha ocurrido un error')
          }
        })
      },
      updatePedido(){
        pedidoService.update(this.pedidoForm.id, {
          ...this.pedidoForm,
          usuario: this.usuario.usuario
        }).then(() => {
          this.$noty.info('Se ha guardado el pedido')
          this.$nextTick(() => {
            this.$bvModal.hide('modal-pedido')
          })
          this.obtenerPedidos()
        }).catch(error => {
          try {
            this.$noty.error(Object.values(error.response.data).flat()[0])
          } catch (err) {
            this.$noty.error('Ha ocurrido un error')
          }
        })
      },
      async changeStatus(id){
        const { value: estado } = await swal({
          title: 'Seleccione un estado',
          input: 'select',
          inputOptions: this.estados,
          inputPlaceholder: 'Estados',
          showCancelButton: true,
        })

        if (estado) {
          await pedidoService.update(id, {
            estado: estado
          });
          this.$noty.info('Estado actualizado a ' + this.estados[estado])
          this.obtenerPedidos()
        }
      },
      deleteProveedor(id) {
        swal({
          title: '¿Esta seguro?',
          text: "Esta acción no se puede deshacer",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar'
        }).then((result) => {
          console.log(result)
          if (result.value == true) {
            proveedorService.delete(id).then(resp=>{
              this.$noty.info('Se ha eliminado correctamente')
              this.getProveedores()
            }).catch(()=>{
              this.$noty.error('No se ha podido eliminar')
            })
          }
        })
      },
      async getProducts(query){
        let results = await pedidoService.getProducts(query)
        return results
      },
      selectRow(e, row) {
        // Rows are indexed from 0, so the third row is index 2
        console.log(e)
        if(e)
          this.$refs.selectableTable.selectRow(row)
        else
          this.$refs.selectableTable.unselectRow(row)
      },
      deleteBulk(){
        const ids = this.selected.map(el => el.id)
        console.log(ids)
        swal({
          title: '¿Esta seguro?',
          text: "Esta acción no se puede deshacer",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar'
        }).then((result) => {
          console.log(result)
          if (result.value == true) {
            pedidoService.deleteBulk({ids}).then(resp=>{
              this.$noty.info('Se ha eliminado correctamente')
              this.obtenerPedidos()
            }).catch(()=>{
              this.$noty.error('No se ha podido eliminar')
            })
          }
        })
      },
      editPedido(data){
        this.$bvModal.show('modal-pedido')
        this.setModalPedido(data)
      }
    },
    watch: {
    // When the query value changes, fetch new results from
    // the API - in practice this action should be debounced
    'pedidoForm.producto': async function(query) {
      this.productos = await this.getProducts(query)
    }
  },
  }
</script>

<style>

</style>