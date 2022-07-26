<template>
    <div class="container">
        <div class="panel-body">
            <ul id="tabs" class="nav nav-tabs nav-justified">
                <li class="active">
                    <a data-toggle="tab" href="#menu2">CHAT</a>
                </li>
                <li><a data-toggle="tab" href="#menu1">TEMAS GLOBALES</a></li>
                <!-- <li><a data-toggle="tab" href="#menu3">TAREA</a></li> -->
            </ul>

            <div class="tab-content" id="content">
                <div id="menu1" class="tab-pane fade">
                    <!-- <h3 class=" text-center">GRUPO</h3> -->
                    <!-- [ngStyle]="{'visibility':columngrupovisible != false ? 'visible' : 'hidden' }"" -->
                    <div class="messaging">
                        <div class="inbox_msg">
                            <div class="inbox_people col-xs-12 col-sm-4 col-md-4 col-lg-4" :class="{'hidden': (modeOneView && (groupSelectedName && groupSelectedName.length > 0))}">
                                <div class="headind_srch">
                                    <div class="recent_heading">
                                        <h4>Temas</h4>
                                    </div>

                                    <div class="srch_bar">
                                        <div class="stylish-input-group">
                                            <input type="text" class="search-bar" placeholder="Filtrar" v-model="busquedaTema" @change="temaFiltrar()">
                                            <span class="icon-group-cc">
                                                <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="inbox_chat">
                                    <div v-for="(tema, indx) in listadoTemas"
                                        :hidden = "tema.hidden"
                                        class="chat_list" 
                                        :class="{'chat_list_active': actualopcionselec === tema.grup_nid}" :key="indx">
                                        <div class="chat_people" @click='selecttema(tema)' id="tema{{tema.grup_nid}}">
                                            <div class="chat_img"></div>
                                            <div class="chat_ib">
                                                <h5>
                                                    {{ tema.grup_vtema || "~No posee nombre" }}
                                                    <span v-if="(tema.mensajes_no_leidos && (tema.mensajes_no_leidos > 0))" class="badge badge-warning">
                                                        {{ tema.mensajes_no_leidos }}
                                                    </span>
                                                </h5>
                                                <template v-if="userRol === 'Administrador'">
                                                    <button class="btn btn-sm btn-danger glyphicon glyphicon-remove button-remove" type="button" @click='deletetema($event, tema.grup_nid)'></button>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="type_msg">
                                    <div class="input_msg_write">
                                        <input v-model="datatipogrupo" type="text" class="write_msg" placeholder="Crear grupo" />
                                        <button @click="nuevotipogrupo()" class="msg-add-group glyphicon glyphicon-plus" type="button"></button>
                                    </div>
                                </div>
                            </div>

                            <div class="mesgs col-xs-12 col-sm-8 col-md-8 col-lg-8" :class="{'show': (modeOneView && (groupSelectedName && groupSelectedName.length > 0))}">
                                <div v-if="modeOneView"  class="headind_srch chat-info">
                                    <div class="recent_heading">
                                        <span @click="backGroup()" class="button-back"><i class="glyphicon glyphicon-chevron-left"></i></span>
                                        <h4>{{ groupSelectedName }}</h4>
                                    </div>
                                </div>

                                <div id="msg_history-group" class="msg_history" :class="{'one-view-chat-history': (modeOneView)}">
                                    <div class="img-loader-spinner" *ngIf="groupLoader">
                                        <div class="img-loader">
                                            <div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-for="(tema, i) in listagrupomensajes" id="grupomensajes{{i}}" class="incoming_msg" :key="i">
                                        <div v-if="listagrupomensajes[i].user_nid_envidox != iduseractual" class="incoming_msg_img"> </div>

                                        <div v-if="listagrupomensajes[i].user_nid_envidox != iduseractual" class="received_msg">
                                            <div class="received_withd_msg">
                                                <span class="name_msg"> {{listausuarios[listagrupomensajes[i].user_nid_envidox]}}</span>
                                                <p>{{ listagrupomensajes[i].grme_vmensaje }}</p>
                                                <span class="time_date">{{ moment(listagrupomensajes[i].grme_dfechaenvio).format("MMM DD, YYYY ~ hh:mm a") }}</span>
                                            </div>
                                        </div>

                                        <div v-if="listagrupomensajes[i].user_nid_envidox == iduseractual" class="outgoing_msg">
                                            <div class="sent_msg">
                                                <span class="time_date"> {{listausuarios[listagrupomensajes[i].user_nid_envidox]}}</span>
                                                <p>{{ listagrupomensajes[i].grme_vmensaje }}</p>
                                                <span class="time_date">{{ moment(listagrupomensajes[i].grme_dfechaenvio).format("MMM DD, YYYY ~ hh:mm a") }}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                
                                <div class="type_msg">
                                    <div class="input_msg_write">
                                        <input v-model="datagrupomensaje" type="text" class="write_msg" placeholder="Escribe un mensaje"/>
                                        <button @click="nuevogrupomensaje()" class="msg_send_btn glyphicon glyphicon-send" type="button"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="menu2" class="tab-pane fade in active">
                    <!-- <h3 class=" text-center">CHAT</h3> -->
                    <div class="messaging">
                        <div class="inbox_msg" :class="{'sidebar-active': showSidebarChat}">
                            <div id="mySidebar" class="sidebar">
                            <a href="javascript:void(0)" class="menu">MENÚ</a>
                            <a href="javascript:void(0)" @click="modalChatGrupo()">Crear grupo</a>
                            </div>

                            <div class="inbox_people col-xs-12 col-sm-4 col-md-4 col-lg-4" :class="{'hidden': (modeOneView && (privateSelectedName && privateSelectedName.length > 0))}">
                                <div class="headind_srch">
                                    <div id="div-menu-chat">
                                        <button id="menu-chat" _ngcontent-c0="" aria-controls="navbar" aria-expanded="false" class="navbar-toggle ng-star-inserted collapsed" data-target="#por-definir" data-toggle="collapse" type="button" @click="btnShowSidebar()">
                                            <span _ngcontent-c0="" class="sr-only">Toggle navigation</span>
                                            <span _ngcontent-c0="" class="icon-bar"></span>
                                            <span _ngcontent-c0="" class="icon-bar"></span>
                                            <span _ngcontent-c0="" class="icon-bar"></span>
                                        </button>
                                    </div>

                                    <div class="recent_heading">
                                        <h4>Usuarios</h4>
                                    </div>

                                    <div class="srch_bar">
                                        <div class="stylish-input-group">
                                            <input type="text" class="search-bar" placeholder="Filtrar" v-model="busquedaUsuario" @change="usuarioFiltrar()">
                                            <span class="icon-group-cc">
                                                <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="inbox_chat">
                                    <div v-for="(usuario, index) in listadoUsuarios" 
                                        :hidden="usuario.hidden"
                                        @click="cargarmensajechat(usuario)"
                                        class="chat_list"
                                        :class="{'chat_list_active': actualopcionselec === usuario.id}" :key="index">
                                        <div class="chat_people" >
                                            <div v-if=" iduseractual != usuario.id" class="chat_img"> </div>
                                            <div v-if=" iduseractual != usuario.id" class="chat_ib">
                                                <h5>
                                                    <span v-if="usuario.tipo === 'chat_grupo'" class="badge badge-primary badge-group">
                                                        Grupo
                                                    </span>

                                                    <span v-if="usuario.tipo === 'chat_grupo'">
                                                        {{ usuario.nombre }}
                                                    </span>

                                                    <template v-else-if="elseChatGrupo">
                                                        <span>
                                                            {{ usuario.usuario }}
                                                        </span>
                                                    </template>

                                                    <span v-if="(usuario.tipo === 'chat' && listausuariosmsjc[usuario.id] != 0)"
                                                        class="badge badge-warning">{{listausuariosmsjc[usuario.id]}}
                                                    </span>

                                                    <span v-if="(usuario.tipo === 'chat_grupo' && usuario.mensajes_no_leidos > 0)"
                                                        class="badge badge-warning">{{ usuario.mensajes_no_leidos }}
                                                    </span>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mesgs col-xs-12 col-sm-8 col-md-8 col-lg-8" :class="{'show': (modeOneView && (privateSelectedName && privateSelectedName.length > 0))}">
                                <div v-if="modeOneView" class="headind_srch chat-info">
                                    <div class="recent_heading">
                                        <span @click="backPrivate()" class="button-back"><i class="glyphicon glyphicon-chevron-left"></i></span>
                                        <h4>{{ privateSelectedName }}</h4>
                                    </div>
                                </div>

                                <div id="msg_history-private" class="msg_history">
                                    <div class="img-loader-spinner" v-if="privateLoader">
                                        <div class="img-loader">
                                            <div>
                                            </div>
                                        </div>
                                    </div>

                                    <template v-if="chatSelected && chatSelected.tipo === 'chat'">
                                        <div v-for="(message, i) in listachatmensajes" :id="'chatmensajes'+{i}" :key="i">
                                            <div v-if="message.user_enviox_nid == iduseractual" class="outgoing_msg">
                                                <div class="sent_msg">
                                                    <span class="time_date">
                                                        {{listausuarios[message.user_enviox_nid]}}
                                                    </span>
                                                    <p>{{ message.chtm_mensaje }}</p>
                                                    <span v-if="message.chtm_nvisto == 1" class="time_date check-icon  glyphicon glyphicon-ok"></span>
                                                    <span class="time_date">
                                                        {{ moment(message.chtm_dfechacrea).format("MMM DD, YYYY ~ hh:mm a") }}
                                                    </span>
                                                </div>
                                                <button v-if="message.chtm_tipo == 'pedido'"
                                                    type="button"
                                                    disabled="disabled"
                                                    class="btn btn-sm msg_check_btn msg_check_btn_right glyphicon glyphicon-shopping-cart"
                                                    :class="[(message.chtm_npedidosts == 1) ? 'msg_check_approved' : 'msg_check_waiting']"
                                                    ></button>
                                            </div>

                                            <div v-if="message.user_enviox_nid != iduseractual" class="incoming_msg">
                                                <div class="incoming_msg_img"> </div>
                                                <div class="received_msg">
                                                    <div class="received_withd_msg">
                                                        <span class="time_date"> 
                                                            {{listausuarios[message.user_enviox_nid]}}
                                                        </span>
                                                        <p>{{ message.chtm_mensaje }}</p>
                                                        <span v-if="message.chtm_nvisto == 1" class="time_date check-icon glyphicon glyphicon-ok"></span>
                                                        <span class="time_date">
                                                            {{ moment(message.chtm_dfechacrea).format("MMM DD, YYYY ~ hh:mm a") }}
                                                        </span>
                                                    </div>
                                                    <button v-if="message.chtm_tipo == 'pedido'"
                                                        type="button"
                                                        class="btn btn-sm msg_check_btn glyphicon glyphicon-ok"
                                                        :disabled="message.chtm_npedidosts == 1"
                                                        :class="[(message.chtm_npedidosts == 1) ? 'msg_check_approved' : 'msg_check_waiting']"
                                                        @click="checkpedidochat(message.chtm_nid)"
                                                        ></button>
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-else-if="chatGrupo" id="chatGrupo">
                                        <div v-for="(message, i) in chatGrupoMessages" class="incoming_msg" :key="i">
                                            <div v-if="message.usuario_id != iduseractual" class="incoming_msg_img"> </div>

                                            <div v-if="message.usuario_id != iduseractual" class="received_msg">
                                                <div class="received_msg">
                                                    <div class="received_withd_msg">
                                                        <span class="name_msg">
                                                            {{ message.usuario.usuario }}
                                                        </span>
                                                        <p>{{ message.mensaje }}</p>
                                                        <span class="time_date">
                                                            {{ moment(message.created_at).format("MMM DD, YYYY ~ hh:mm a") }}
                                                            <span v-if="(message.aprobado_usuario_id > 0)">
                                                                ~> Aprobado por {{ message.aprobado_usuario.usuario }}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <button v-if="message.tipo === 'pedido'"
                                                        type="button"
                                                        class="btn btn-sm msg_check_btn chat_grupo_check_btn glyphicon glyphicon-ok"
                                                        :disabled="(message.aprobado_usuario_id > 0)"
                                                        :class="[(message.aprobado_usuario_id > 0) ? 'msg_check_approved' : 'msg_check_waiting']"
                                                        @click="checkpedidochat(message.id, 'chat_grupo')"
                                                        ></button>
                                                </div>
                                            </div>

                                            <div v-if="message.usuario_id == iduseractual" class="outgoing_msg">
                                                <div class="sent_msg">
                                                    <span class="time_date">
                                                        {{ message.usuario.usuario }}
                                                    </span>
                                                    <p>{{ message.mensaje }}</p>
                                                    <span class="time_date">
                                                        {{ moment(message.created_at).format("MMM DD, YYYY ~ hh:mm a") }}
                                                        <span v-if="(message.aprobado_usuario_id > 0)">
                                                            ~> Aprobado por {{ message.aprobado_usuario.usuario }}
                                                        </span>
                                                    </span>
                                                </div>
                                                <button v-if="message.tipo === 'pedido'"
                                                    type="button"
                                                    disabled="disabled"
                                                    class="btn btn-sm msg_check_btn msg_check_btn_right chat_grupo_check_btn glyphicon glyphicon-shopping-cart"
                                                    :class="[(message.aprobado_usuario_id > 0) ? 'msg_check_approved' : 'msg_check_waiting']">
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                </div>

                                <div class="type_msg">
                                    <div class="input_msg_write">
                                        <input type="text" v-model="mensajechat" class="write_msg" placeholder="Escribe un mensaje o un pedido"/>
                                        <button type="button" @click="enviarchatmensaje('mensaje')" class="msg_send_btn with-other-btn glyphicon glyphicon-send"></button>
                                        <button type="button" @click="enviarchatmensaje('pedido')" class="msg_request_btn glyphicon glyphicon-shopping-cart"></button>
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </div>
                </div>
                
                <!-- <div id="menu3" class="tab-pane fade ">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12 deck-column panel-group">
                                <div class="panel panel-success">
                                    <div class="panel-heading">
                                        <i class="glyphicon glyphicon-briefcase"></i>
                                        TAREAS
                                    </div>

                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="form-group col-md-6">
                                                <input type="text" class="form-control" [(ngModel)]="textotarea" placeholder="Agregar tarea">
                                            </div>
                                            <button type="button" class="btn btn-primary mb-2" (click)="agregartarea()" > + </button>
                                        </div>
                                        <div class="list-decks">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">tarea</th>
                                                    </tr>
                                                </thead>
                                                <tbody *ngFor=" let tareaid of arraylistatareas; let i = index; "  >
                                                    <tr  >
                                                        <td><button  [disabled]="listatareas[tareaid].sts == 1"  type="button" class="btn btn-primary" (click)="tarearealizada(tareaid)"> OK </button></td>
                                                        <td>{{ listatareas[tareaid].mensaje }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>

        <!-- <b-modal id="help-modal" title="Ayuda" size="xl">
      
      
        </b-modal> -->

        <b-modal id="modal-chat-grupo" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Creación de grupo</h4>
                </div>
                <div class="modal-body">
                    <div id="form-inputs" class="container-fluid">
                        <div class="form-group">
                        <label for="chat-grupo-nombre">Nombre</label>
                        <input type="text" class="form-control" id="chat-grupo-nombre" placeholder="Nombre de grupo" v-model="formChatGrupo.nombre">
                        </div>

                        <div class="from-group">
                            <label for="chat-grupo-nombre">Listado de usuarios</label>
                            <hr>
                            <div id="chat-grupo-listado" class="container-fluid">
                                <div class="form-check" *ngFor="let usuario of formUsuarios">
                                    <label v-if="usuario.tipo === 'chat'">
                                        <input type="checkbox" name="chat_grupos_usuarios" v-model="usuario.check">
                                        <span class="label-text">{{ usuario.usuario }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" @click="crearChatGrupo()">Crear</button>
                </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    data (){
        return{
            datamensaje: '',
            mensaje: '',
            displaydata: '',
            displaydataerr: '',
            allmensaje: '',
            mensajedata: '',
            usuario: '',
            estado: false,
            fecha: '',
            ckeckdata: '',
            estadodata: '',
            listo: '',
            estadomensaje: '',
            coundmensaje: '',
            usuariopara: 'Todos',
            formUsers: '',
            pedidopor: '',
            usuarioPrivado: '',
            smsPrivado: '',
            datatipogrupo: '',
            datagrupomensaje: '',
            actualgruposeleccionado: 0,
            temas: '',
            temasgrupo: {},
            arraytemasgrupo: [],
            listagrupomensajes: [],
            iduseractual: 0,
            idgrupo: {},
            subscription: Subscription,
            mensajessus: '',
            actualopcionselec: '',
            listatareas: {},
            arraylistatareas: [],
            groupLoader: false,
            privateLoader: false,
            columngrupovisible: true,
            modeOneView: false,
            groupSelectedName: '',
            privateSelectedName: '',
            activegrupo:any = 1,
            activechat:any = 0,
            listausuarios: {},
            listausuariosmsjc: {},
            Arraylistausuarios: [],
            actualchatuserseleccionado: '',
            listachatmensajes: [],
            mensajechat: '',
            arrayNuevoOrdenTemas: [],
            textotarea: '',
            //moment: moment_;
            mensajesNoLeidos:  0,
            listadoTemas: [],
            listadoUsuarios: [],
            busquedaTema: "",
            busquedaUsuario: '',
            wsSubject: '',
            showSidebarChat: false,
            formUsuarios: '',
            formChatGrupo: {nombre: ''},
            chatSelected: null,
            chatGrupoMessages: null,
            chatMessages: null,
        }
    }
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

    @media screen and (max-width: 450px) {
        .mesgs {
            display: none;
        }
        .img-loader {
            left: 25% !important;
        }
        .msg_history {
            padding-right: 10px !important;
            overflow-y: auto !important;
            max-height: 50vh !important;
        }
        .msg_history:hover {
            overflow-y: auto !important;
        }
        .messaging {
            padding-bottom: 0px !important;
        }
        .input_msg_write input {
            width: 77% !important;
        }
    }
    .nav-tabs.nav-justified > li {
        display: table-cell !important;
        width: 1% !important;
    }
    .cla-box {
        padding-top: 20px;
        margin-bottom: 20px;
        border: 2px dotted #99a3a5;
        height: 400px;
        overflow: auto;
    }
    .true {
        text-decoration: line-through;
    }
    .false {
        text-decoration: none;
    }
    .btn-success, button.true {
        pointer-events: none;
        cursor: default;
        color: #fff;
        background-color: #5cb85c;
        border-color: #4cae4c;
    }
    .panel-heading {
        font-size: x-large;
        text-align: center;
        font-weight: bold;
    }
    .panel-heading I {
        margin-right: 10px;
        font-size: xx-large;
    }
    .btn-cta-deck {
        float: right;
    }
    .mytext{
        border:0;padding:10px;background:whitesmoke;
    }
    .text{
        width:75%;display:flex;flex-direction:column;
    }
    .text > p:first-of-type{
        width:100%;margin-top:0;margin-bottom:auto;line-height: 13px;font-size: 12px;
    }
    .text > p:last-of-type{
        width:100%;text-align:right;color:silver;margin-bottom:-7px;margin-top:auto;
    }
    .text-l{
        float:left;padding-right:10px;
    }        
    .text-r{
        float:right;padding-left:10px;
    }
    .avatar{
        display:flex;
        justify-content:center;
        align-items:center;
        width:25%;
        float:left;
        padding-right:10px;
    }
    .macro{
        margin-top:5px;width:85%;border-radius:5px;padding:5px;display:flex;
    }
    .msj-rta{
        float:right;background:whitesmoke;
    }
    .msj{
        float:left;background:white;
    }
    .frame{
        background:#e0e0de;
        height:450px;
        overflow:hidden;
        padding:0;
    }
    .frame > div:last-of-type{
        position:absolute;bottom:0;width:100%;display:flex;
    }
    body > div > div > div:nth-child(2) > span{
        background: whitesmoke;padding: 10px;font-size: 21px;border-radius: 50%;
    }
    body > div > div > div.msj-rta.macro{
        margin:auto;margin-left:1%;
    }
    /*ul {
    width:100%;
    list-style-type: none;
    padding:18px;
    position:absolute;
    bottom:47px;
    display:flex;
    flex-direction: column;
    top:0;
    overflow-y:scroll;
    }*/
    .msj:before{
        width: 0;
        height: 0;
        content:"";
        top:-5px;
        left:-14px;
        position:relative;
        border-style: solid;
        border-width: 0 13px 13px 0;
        border-color: transparent #ffffff transparent transparent;            
    }
    .msj-rta:after{
        width: 0;
        height: 0;
        content:"";
        top:-5px;
        left:14px;
        position:relative;
        border-style: solid;
        border-width: 13px 13px 0 0;
        border-color: whitesmoke transparent transparent transparent;           
    }  
    input:focus{
        outline: none;
    }
    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #282727;
        /* color: #d4d4d4; */
    }
    ::-moz-placeholder { /* Firefox 19+ */
        color: #282727;
    }
    :-ms-input-placeholder { /* IE 10+ */
        color: #282727;
    }
    :-moz-placeholder { /* Firefox 18- */
        color: #282727;
    }
    .container{
        max-width: 1170px;
        margin: auto;
    }
    img{
        max-width: 100%;
    }
    .inbox_people {
        background: #f8f8f8 none repeat scroll 0 0;
        float: left;
        overflow: hidden;
        /*width: 40%;*/
        border-right:1px solid #c4c4c4;
    }
    .inbox_msg {
        border: 1px solid #c4c4c4;
        clear: both;
        overflow: hidden;
    }
    .top_spac{ margin: 20px 0 0;}

    .recent_heading {
        float: left;
        width: 34%;
        margin-top: 5px;
        transition: margin-left .5s; /* If you want a transition effect */
        /* width: 99%; */
    }
    .srch_bar {
        /* display: inline-block; */
        text-align: right;
        /* width: 60%; */
        width: 50%;
        float: right;
    }
    .headind_srch {
        padding: 10px 7px 5px 5px;
        overflow:hidden;
        border-bottom:1px 
        solid #c4c4c4;
    }
    .recent_heading h4 {
        color: #05728f;
        font-size: 21px;
        margin: auto;
        float: left;
    }
    .srch_bar input{
        border: 1px solid #cdcdcd;
        border-width: 0 0 1px 0;
        width: 100%;
        padding: 2px 0 4px 6px;
        background: none;
    }
    .srch_bar .icon-group-cc button {
        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
        border: medium none;
        padding: 0;
        color: #707070;
        font-size: 18px;
    }
    .srch_bar .icon-group-cc {
        margin: 0 0 0 -27px;
    }
    .chat_ib h5 {
        font-size: 15px;
        color: #464646;
        margin: 0 0 8px 0;
        float: left;
        width: 88%;
        padding-top: 8px;
        padding-right: 5px;
    }
    .chat_ib h5 span {
        font-size:15px;
        float:left;
    }
    .chat_ib p {
        font-size: 14px;
        color: #989898;
        margin: auto
    }
    .chat_img {
        float: left;
        width: 11%;
    }
    .chat_ib {
        float: left;
        /* padding: 0 0 0 15px; */
        width: 100%;
    }
    .chat_people {
        overflow: hidden;
        clear: both;
        padding-bottom: 2px;
    }
    .chat_list {
        border-bottom: 1px solid #c4c4c4;
        margin: 0;
        padding: 18px 16px 10px;
        cursor: pointer;
    }
    .inbox_chat {
        height: 60vh;
        overflow-y: scroll;
    }
    .active_chat { background: #ebebeb; }
    .incoming_msg_img {
        display: inline-block;
        /* width: 6%; */
    }
    .received_msg {
        display: inline-block;
        padding: 0 0 0 10px;
        vertical-align: top;
        width: 92%;
    }
    .received_withd_msg p {
        background: #ebebeb none repeat scroll 0 0;
        border-radius: 7px;
        color: #646464;
        font-family: 'Roboto';
        font-size: 15px;
        margin: 0;
        padding: 8px 10px 7px 10px;;
        width: 100%;
    }
    .time_date {
        color: #747474;
        display: block;
        font-size: 12px;
        margin: 8px 0 0;
    }
    .name_msg {
        color: #747474;
        display: block;
        font-size: 13px;
        margin: 8px 0 0;
        font-weight: bold;
    }
    .received_withd_msg {
        float: left;
        width: 70%;
    }
    .mesgs {
        float: left;
        padding: 15px 15px 0 15px;
        transition-duration: 1s;
        /*width: 60%;*/
    }
    .sent_msg p {
        background: #dcf8c6 none repeat scroll 0 0;
        border-radius: 7px;
        font-family: 'Roboto';
        font-size: 15px;
        margin: 0;
        color: #646464;
        padding: 8px 10px 7px 10px;;
        width:100%;
    }
    .outgoing_msg {
        overflow: hidden;
        margin: 10px 0 10px; 
    }
    .sent_msg {
        float: right;
        width: 70%;
    }
    .input_msg_write input {
        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
        border: medium none;
        color: #4c4c4c;
        font-size: 15px;
        min-height: 48px;
        width: 88%;
    }
    .type_msg { border-top: 1px solid #c4c4c4; position: relative;}
    .msg_send_btn {
        background: #05728f none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 11px;
        width: 31px;
        padding-left: 1px;
        padding-right: 5px;
    }
    .with-other-btn {
        right: 41px;
    }
    .msg_request_btn {
        background: #278427 none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 11px;
        width: 31px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .msg_check_btn {
        background: #278427 none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        font-size: 17px;
        height: 30px;
        padding: 2px 5px 0 5px;
        margin: 27px 0 0 15px
    }
    .msg_check_btn_right {
        margin-right: 15px;
        margin-top: 10px;
        float: right;
    }
    .msg_check_approved {
        background: #278427 none repeat scroll 0 0;
    }
    .msg_check_waiting {
        background: #a94442 none repeat scroll 0 0;
    }
    .msg-add-group {
        background: #278427 none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 11px;
        width: 31px;
    }
    .messaging { 
        padding: 0 0 0 0;
        position: relative;
    }
    .msg_history {
        /* height: 570px; */
        height: 60vh;
        overflow-y: hidden;
        transition-duration: 1s;
    }
    .msg_history:hover {
        padding-right: 10px;
        overflow-y: scroll;
    }
    /* #menu2 .msg_history {
        height: 62.7vh !important;
    } */
    #menu2 .inbox_chat {
        height: 64vh !important;
    }
    .btn.button-remove {
        border-radius: 25px;
        padding: 3px 6px;
        margin-top: 3px;
        max-width: 11%;
        /* position: absolute; */
        /* right: 40px; */
        /* top: 57px; */
    }
    .chat_list_active {
        background-color: #00bfa5;
    }
    .chat_list_active .chat_ib h5 {
        color: white;
        font-weight: bold;
    }

    /* Loader */
    @keyframes img-loader {
        0% { transform: translate(-50%,-50%) rotate(0deg); }
        100% { transform: translate(-50%,-50%) rotate(360deg); }
    }
    .img-loader div {
        position: absolute;
        width: 120px;
        height: 120px;
        border: 20px solid #00bfa5;
        /* border: 20px solid #1d3f72; */
        border-top-color: transparent;
        border-radius: 50%;
    }
    .img-loader div {
        animation: img-loader 1s linear infinite;
        top: 100px;
        left: 100px
    }
    .img-loader-spinner {
        position: absolute;
        width: 100%;
        height: 97%;
        display: inline-block;
        overflow: hidden;
        background: #fff;
    }
    .img-loader {
        width: 100%;
        height: 100%;
        position: relative;
        transform: translateZ(0) scale(1);
        backface-visibility: hidden;
        transform-origin: 0 0; /* see note above */
        top: 25%;
        left: 35%;
    }
    .img-loader div { box-sizing: content-box; }
    /* generated by https://loading.io/ */

    .chat-info {
        padding-top: 0px;
        padding-bottom: 10px;
    }
    .one-view-msg-history {
        height: 530px;
    }
    .button-back {
        float: left;
        width: 7%;
        cursor: pointer;
        font-size: 18px;
        color: #05728f;
        margin-right: 10px;
        padding-right: 20px;
    }
    #content .container-fluid {
        padding-right: 0px;
        padding-left: 0px;
    }
    .check-icon {
        float: left;
        margin-right: 7px;
    }

        /*Para mantener activo el tema o chat seleccionado*/
        /*.chat_people:hover  {
        background: #58ACFA;
        }*/
        /*a:active  {
        background: #58ACFA;
        }
        a.active{
        background: #58ACFA;
        }*/

    button#menu-chat {
        border-color: #ddd;
        margin-top: 0px;
        margin-bottom: 0px;
        padding: 6px 6px;
        border-color: #ddd0;
        display: block;
    }
    button#menu-chat span.icon-bar {
        background-color: #888;
        display: block;
        width: 22px;
        height: 2px;
        border-radius: 1px;
    }
    button#menu-chat:hover {
        background-color: #ddd;
    }

    .sidebar {
    height: 100%; /* 100% Full-height */
    width: 0; /* 0 width - change this with JavaScript */
    position: absolute; /* Stay in place */
    z-index: 1; /* Stay on top */
    top: 0;
    left: 0;
    background-color: #f8f8f8; /* Black*/
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: 0.5s; /* 0.5 second transition effect to slide in the sidebar */
    border: 1px solid #c4c4c4;
    }

    .sidebar a {
    padding: 8px 8px 8px 20px;
    text-decoration: none;
    font-size: 15px;
    color: #05728f;
    display: block;
    transition: 0.3s;
    font-weight: bold;
    }

    #div-menu-chat {
        float: left;
        width: 15%;
    }

    .inbox_msg.sidebar-active #mySidebar {
        width: 150px;
    }

    .inbox_msg.sidebar-active .inbox_people {
        margin-left: 150px;
    }

    .inbox_msg.sidebar-active .mesgs {
        width: 53%;
    }

    #mySidebar a.menu {
        background-color: #05728f;
        color: #f8f8f8 !important;
        text-align: center;
        padding: 20px !important;	
    }

    #modal-chat-grupo hr {
        margin-top: 5px;
        margin-bottom: 10px;
    }

    .form-check label {
        position: relative;
        cursor: pointer;
        color: #666;
        font-size: 15px;
    }

    input[type="checkbox"], input[type="radio"]{
        position: absolute;
        right: 9000px;
    }

    /*Check box*/
    input[type="checkbox"] + .label-text:before{
        content: "\f096";
        font-family: "FontAwesome";
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing:antialiased;
        width: 1em;
        display: inline-block;
        margin-right: 5px;
    }

    input[type="checkbox"]:checked + .label-text:before{
        content: "\f14a";
        color: #2980b9;
        animation: effect 250ms ease-in;
    }

    input[type="checkbox"]:disabled + .label-text{
        color: #aaa;
    }

    input[type="checkbox"]:disabled + .label-text:before{
        content: "\f0c8";
        color: #ccc;
    }

    @keyframes effect{
        0%{transform: scale(0);}
        25%{transform: scale(1.3);}
        75%{transform: scale(1.4);}
        100%{transform: scale(1);}
    }

    #form-inputs {
        
    }

    #chat-grupo-listado {
        overflow-y: auto;
        max-height: calc(80vh - 225px);
    }

    .chat_ib h5 span.badge-group {
        font-size:10px;
        float: float;
        margin-right: 5px;
    }

    .chat_grupo_check_btn {
        margin-top: 30px;
    }

    span.badge.badge-warning {
        float: right !important;
    }
</style>