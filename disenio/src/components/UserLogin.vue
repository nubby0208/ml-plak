<template>
<div class="row">
    
      <vue-toastr ref="toastr"></vue-toastr>
      <div style="margin-top:8%;" class="col-md-12 col-center">
      <b-overlay 
      :show="loading" 
      opacity="1.0" 
      variant="white"
      >
        <!-- <h1>Bienvenido al centro de Diseño</h1> -->
        <div class="col-md-6 col-center">
        <h1>Bienvenido al centro de Diseño</h1>
        <h2>--</h2>
        <form class="form-horizontal" method="POST">
        <b-card header="Login de usuario" header-class="text-center" align="left">
          <div class="form-group row">
            <label class="col-md-2 control-label" for="name">Username</label>  
            <div class="col-md-4">
              <input  v-model="username" placeholder="Nombre de usuario" name="username" type="text" class="form-control form-control-sm">
            </div>
          </div>
      

            <div class="form-group row">
                <label class="col-md-2 control-label" for="name">Password</label>  
                <div class="col-md-4">
                    <input v-model="password" placeholder="Password" name="password" type="password" class="form-control form-control-sm" >
                </div>
            </div>
            

          <div class="form-group row">
              <div class="col-md-4 col-md-offset-4">
                <input v-on:click="doLogin($event)" type="submit" value="Submit">
              </div>
          </div>
          <div slot="footer">
            <small class="text-danger"> {{ loginErrors }}</small>
          </div>
        </b-card>
        </form>
        </div>
        <template #overlay>
          <div class="text-center">
            <img  src="../assets/mlplak_gif.gif" alt="">
          </div>
        </template>
        
      </b-overlay>
    </div>
</div>
</template>

<script>
import { HTTP, EventBus } from '../index'
import VueToastr from "vue-toastr";

export default {
  name: 'user-login',
  components:{
    VueToastr
  },  
  data () {
    return {
      username: '',
      password: '',
      loginErrors: '',
      loginSuccesful: false,
      loading:true
    }
  },
  created () {
  },
  mounted: function () {
    this.loading = false
  },
  updated (){
    this.loading = false
  },
  methods: {
    doLogin: function (event) {
      event.preventDefault()

      HTTP.post('/api/login', { username: this.username, password: this.password }).then(result => {
        console.log('data--->', result.data)
        if (result.data.success) {
          // console.log(result.data)
          localStorage.setItem('token', result.data.data.token)
          localStorage.setItem('usuario', JSON.stringify(result.data.data.usuario))
          localStorage.setItem('user-name', result.data.data.usuario.usuario)
          localStorage.setItem('user-id', result.data.data.usuario.id)
          localStorage.setItem('user-rol', result.data.data.usuario.rol)
          this.loginSuccesful = true
          EventBus.$emit('userLoggedIn', this.loginSuccesful)
          ///////////
           this.$refs.toastr.s('¡Bienvenido!');
          if (result.data.yet_login_today) {
            this.$router.push('/calendar')
            window.location.reload();

						// this.router.navigate(['/']);
					} else {
            //en revision 

            if(result.data.data.hasasistencia){
               this.$router.push('/calendar')
               window.location.reload();
            }else{
              this.$router.push('/asistencia', { queryParams: { goToTask: true } });
              window.location.reload();
            }
						

					}
          ///////
          // TODO: quiza en un futuro cercano halla que llamar al api de los permisos.
          // this.permissionService.loadPermissions([response.data.usuario.rol]);
          // console.log('perm', this.permissionService.getPermissions());
          // console.log(result.data)
          this.loading = false
        } else {
          // error
          this.loginErrors = result.data.error
        }
      }).catch(result => {
        this.loginErrors = 'Por Favor verifique sus credenciales o intente más tarde'
      })
    }
  }

}
</script>

<style>
  .col-center {
    float: none;
    margin: 0 auto;
  }
</style>