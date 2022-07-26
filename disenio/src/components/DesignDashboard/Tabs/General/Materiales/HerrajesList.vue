<template>
    <fieldset>
      <table class="materiales_add" style="width: 100% !important;">          
        <tr>
          <th class="th-mat">#</th>
          <th class="th-mat">BUSCAR HERRAJES <input v-model="search_material" placeholder="Ejmp: Melamina" name="material_name"><img v-show="loader" :src=base64_loader /></th>
        </tr>
        <tr v-show="!herrajes.length">
            <th colspan="2" class="no-material">No existen Resultados para {{search_material}}</th>
        </tr>
        <tr v-for="(herraje, id) in herrajes_search">
          <td>{{ id + 1  }}</td>
          <td class="material-input">
            <label>{{ herraje.nombre + ' ' + herraje.material }}
              <input type="checkbox" v-on:change="onChangeHerrajes" :value=herraje  v-model="herrajes_add">
            </label>
          </td>
        </tr>
      </table>      
    </fieldset>
</template>
<script>
import { HTTP } from '@/plugins/HTTP.js'

export default {
  data () {
    return {
      herrajes: [],
      herrajes_add: [],
      search_material: '',
      loader: false,
      base64_loader: 'data:image/gif;base64,R0lGODlhFAAUAKUfAGSy7Gy27HS27HS67Hy67Hy+7IS+7ITC7IzG9JTK9JzK9JzO9KTO9KTS9KzS9KzW9LTW9LTa9MTi9Mzm/NTm/NTq/Nzu/OTu/OTy/Ozy/Oz2/PT2/PT6/Pz6/Pz+/P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQAdACwAAAAAFAAUAAAGxsCOcNi5VCqUyoXIHCIrmCjm2RRiKBbO5+PxbDcWCoZ5xXg4EEMgYIBoPGXiBPOZBBIUjYaSEEw+V04WHhMCFVuIHxV+HhYVQhQcGwEWiYkVAZIURYcQCpaWChCKU3QGf6CIFQYfjlAeARqpiBoBcEhmsbNbtR57UB8Gh7sUrI5GH567HwmjUB2RtZWpmBwcmx0Vg4XDl4yOQxOydgoVehUKAX+BQ2UeG2lrbW9xRFcWslxeHxxhY1VPpExJUoWJhTBHljQJAgAh+QQJCQAdACwAAAAAFAAUAAAG1sCOcKi5VCqAQWIybDYrlAoG81AMAAKms4OhWDifj8cjphwADWcX4+FADIGKJTN+JC7NCeYzCSQoGh4bFhUaHxeAQnIeEwIVYZAfHBETHoQdGhQcGwEWkZEVAhscgEYfEQqfnwkQHxVGewYTqqAGH4RSHgGGtGEaAR4aUGy7vb7AXVIfBo/GFLaEphCpxqyuGJkcv560FQEcpBodi43NoFmWFUMTGXwBCoXCCgGzXeJCa20PcAEGDxwe1qjxsiHMmDCDKGDYggmKlCkYHN5jiMmIQ2xbggAAIfkECQkAEQAsAAAAABQAFAAABt7AiHCouVQqgEFiMmw2K5QKBvNQDAACpjOCoVg4n0/H8/FQDoCGs4vxcCCFQMWS8XQe6eYE85kEEhUaHRsWgR94WnMeEwIVYY8fHBUbHQYDERoUHBsBFpCQGxUeSBJGHxAKn590HgKAfAWOqo+SH1ZSHgEas48dongUbQK7vB8aBR4ZR7CyvBQGH4WmqMW2D9EXmRwajbwVARwcExoRiozNjxZZHoVDExl9AQqBGhUKARMfXRtDbG4PBgIEMPCAgwc2a7xsCOOBzAdC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'
    }
  },
  created () {
  },
  mounted: function () {
    this.getMateriales()
  },
  computed: {
    herrajes_search () {
      return this.herrajes.filter(mat => mat.material.toLowerCase().indexOf(this.search_material.toLowerCase()) > -1)
    }
  },
  methods: {
    onChangeHerrajes: function () {
      this.$store.commit('setGeneralProperty', { key: 'herrajes_add', value: JSON.stringify(this.herrajes_add) })
      this.$store.commit('setGeneralProperty', { key: 'herrajes_default', value: this.herrajes_add.length ? this.herrajes_add[0].material : '' })
    },
    getMateriales () {
      this.loader = true
      let self = this
      HTTP.get('/api/materiales/materials_for_type/H', {
      }).then(result => {
        this.herrajes = result.data.materiales
        JSON.parse(this.$store.state.general.herrajes_add).forEach((m) => {
          this.herrajes_add.push(this.herrajes.find((mat) => mat.id === m.id))
        })
        self.loader = false
      }).catch(result => {
        console.log(result)
        self.loader = false
      })
    }
  }
}
</script>
<style>
 .cancel-material {
     cursor: pointer;
     color: red;
  }

  .add-icon {
    padding-left: 3px;
    font-weight: bold;
    color: #28a745;
    font-size: 2em;
    cursor: pointer;
  }

  .add-icon:hover {
    font-weight: bold;
    color: red;
  }

  .th-mat {
    background-color: rgb(231, 236, 241);
    border-bottom: 1px solid rgb(87, 136, 185);
    padding: 10px;
  }

  .material-input {
    text-align: right;
    padding-right: 100px !important;
  }

  .material-input label, input[type="checkbox"] {
    cursor: pointer
  }
</style>