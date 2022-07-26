import { Subscription, Observable } from 'rxjs'
import { MensajeService } from './../services/mensaje.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy , NgZone, ViewChild } from '@angular/core';
import { _window, _$ } from 'app/common';
import * as moment_ from 'moment';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { environment } from './../../environments/environment';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { map, retryWhen, tap, delay, retry, repeatWhen } from "rxjs/operators";

@Component({
	selector: 'app-mensajes',
	templateUrl: './mensajes.component.html',
	styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit,OnDestroy {
	public datamensaje
	public mensaje
	public displaydata
	public displaydataerr
	public allmensaje
	public mensajedata
	public usuario 
	public estado = false
	public fecha 
	public ckeckdata
	public estadodata
	public listo = ''
	public estadomensaje
	public coundmensaje
	public usuariopara = 'Todos'
	public formUsers :any
	public pedidopor
	public usuarioPrivado
	public smsPrivado

	public datatipogrupo:any = ''
	public datagrupomensaje:any = ''
	public actualgruposeleccionado:any = 0 

	public temas:any
	public temasgrupo:any = {}
	public arraytemasgrupo:any = []
	public listagrupomensajes = []

	public iduseractual:number = 0
	public idgrupo:any = {}
	private subscription: Subscription;
	private mensajessus:any; 
	public actualopcionselec:any = '';

	public listatareas:any = {};
	public arraylistatareas:any = [];
  public groupLoader: boolean = false;
  public privateLoader: boolean = false;
	public columngrupovisible: any = true;
  public modeOneView: boolean = false;
	public groupSelectedName: string = '';
	public privateSelectedName: string = '';
	public activegrupo:any = 1;
	public activechat:any = 0;
	public listausuarios:any = {};
	public listausuariosmsjc:any = {};
	public Arraylistausuarios:any = [];
	public actualchatuserseleccionado:any = '';
	public listachatmensajes:any = [];
	public mensajechat:any = '';
	public arrayNuevoOrdenTemas:any = [];
	public textotarea:any = '';
  public moment:any = (<any>moment_)['default'] || moment_;
  public mensajesNoLeidos: number = 0;
  public listadoTemas: any = [];
  public listadoUsuarios: any = [];
  public busquedaTema: string = "";
  public busquedaUsuario: string = "";
  public wsSubject: any;
  public showSidebarChat: boolean = false;
  public formUsuarios: any;
  public formChatGrupo: any = {nombre: ''};
  public chatSelected: any = null;
  public chatGrupoMessages: any = null;
  public chatMessages: any = null;

	constructor(private mensajeService: MensajeService,
              private toastr: ToastrService, public breakpointObserver: BreakpointObserver) {
    this.listagrupomensajes = [];
    let userid = Object.assign({}, JSON.parse(localStorage.getItem('usuario')));
		this.iduseractual = userid.id;

    this.mensajeService.wsSubject
    .pipe(retryWhen(errors => {
      console.log('erroerwerer');
      this.mensajeService.wsSubject.next({type: 'new_connection', message: '', data: userid});
      delay(2000);
      return errors;
    }))
    .pipe(repeatWhen(complete => {
      console.log('completeerwerer');
      this.mensajeService.wsSubject.next({type: 'new_connection', message: '', data: userid});
      delay(2000);
      return complete;
    }))
    .subscribe(
      message => {
        if (!this.iduseractual) {
          userid = Object.assign({}, JSON.parse(localStorage.getItem('usuario')));
          this.iduseractual = userid.id;
        }
        
        let res = Object.assign({}, message.data);
        const resp_message = {...message};
        console.log('resp_message: ', resp_message);
        
  			switch (resp_message.type) {
          case "resp_new_connection":
            if (!resp_message.data.saved) {
              this.mensajeService.wsSubject.next({type: 'new_connection', message: '', data: userid});
            }
            break;
  				case "resp_gru_temanuevo":
  					this.temasgrupo[resp_message.data.grupo.grup_vtema] = []
  					this.idgrupo[resp_message.data.grupo.grup_vtema] = resp_message.data.grupo.grup_nid
            this.arraytemasgrupo.push(resp_message.data.grupo.grup_vtema)
            
            let nuevoTema = {...resp_message.data.grupo};
            nuevoTema['hidden'] = false;
            nuevoTema['mensajes_no_leidos'] = 0;
            this.listadoTemas.unshift(nuevoTema);
  					break;
  				
  				case "resp_grumen_mensajenuevo":
            // console.log("resp_grumen_mensajenuevo: ", res.data);
  					if (resp_message.data.message.grup_nid == this.actualgruposeleccionado) {
              this.listagrupomensajes.push(resp_message.data.message);

              setTimeout(() => {
                const scrollbar = document.getElementById("msg_history-group");
                scrollbar.scrollTop = scrollbar.scrollHeight;
              }, 0);
            }

            for (let index = 0; index < this.listadoTemas.length; index++) {
              const tema = this.listadoTemas[index];

              if (resp_message.data.message.grup_nid === tema.grup_nid) {
                if (resp_message.data.from !== this.iduseractual) {
                  this.listadoTemas[index].mensajes_no_leidos++;
                } 

                this.listadoTemas.splice(index, 1);
                this.listadoTemas.unshift(tema);

              }
            }
  					break;

  				case "resp_chatmen_mensajenuevo":
            let suma = 0;
            const msgData = res.data;

  					if (
              (this.iduseractual == resp_message.data.from && resp_message.data.to == this.actualchatuserseleccionado)
              || (resp_message.data.to == this.iduseractual && resp_message.data.from  == this.actualchatuserseleccionado)
            ) {
  						this.listachatmensajes.push(resp_message.message)

  						//si esta viendo el chat y llega un nuevo mensaje
  						let vistodata = {
  							from: this.iduseractual,
  							to: this.actualchatuserseleccionado
              }
              
  						this.listausuariosmsjc[resp_message.data.from] = 0;
  						this.mensajeService.wsSubject.next({
                type: 'env_marcarvisto_mensajechat',
                data: vistodata,
                message: 'chat visto'
              });
              
              suma = 1;
              
              setTimeout(() => {
                const scrollbar = document.getElementById("msg_history-private");
                scrollbar.scrollTop = scrollbar.scrollHeight;
              }, 0);
            }
            // console.log([msgData.user_nid_destinatario, msgData.user_enviox_nid], this.iduseractual,
            // [msgData.user_nid_destinatario, msgData.user_enviox_nid].includes(this.iduseractual));

            if ([resp_message.data.to, resp_message.data.from].includes(this.iduseractual)) {
              const chatId = (this.iduseractual === resp_message.data.to)
                ? resp_message.data.from
                : resp_message.data.to;

              for (let index = 0; index < this.listadoUsuarios.length; index++) {
                const element = this.listadoUsuarios[index];

                if (element.tipo === 'chat' && element.id === chatId) {
                  this.listadoUsuarios.splice(index, 1);
                  this.listadoUsuarios.unshift(element);
                  break;
                }
              }
            }

  					if (suma == 0 ) {
  						this.listausuariosmsjc[resp_message.data.from] = Number(this.listausuariosmsjc[resp_message.data.from]) + 1
  					}
  					break;
  				
  				case "resp_actchatpedido_ok":
  						for (let i in this.listachatmensajes){ 
  							if (resp_message.data.chtm_nid == this.listachatmensajes[i].chtm_nid) {
  								this.listachatmensajes[i].chtm_npedidosts = 1;
                  break;
  							}
  						}
  					break;
  					
  				case "resp_activogrupo_user":
  						// console.log("resp_activogrupo_user",res)
  					break;

  				case "resp_marcarvisto_mensajechat":
  						// console.log("resp_marcarvisto_mensajechat",res)
  					break;

  				case "resp_deletetema_delete":
              const data = resp_message.data;
  						if (data.success) {
  							for(let idgr in this.arraytemasgrupo) {
  								if(this.idgrupo[this.arraytemasgrupo[idgr]] == data.idgrupo){
  									//this.arraytemasgrupo.splice(Number(idgr))
  									delete this.arraytemasgrupo[idgr];
  									this.arraytemasgrupo.splice(Number(idgr), 1);
  									delete this.idgrupo[this.arraytemasgrupo[idgr]];
  									// var elemt = document.getElementById("tema" + data.idgrupo);
  									// elemt.remove();
  								}
                }

                for (let index = 0; index < this.listadoTemas.length; index++) {
                  const tema = this.listadoTemas[index];

                  console.log(data.idgrupo, tema.grup_nid);
                  if (data.idgrupo == tema.grup_nid) {
                    this.listadoTemas.splice(index, 1);
                    break;
                  }
                }

                console.log(this.listadoTemas);
  						}
  					break;

          case "resp_chat_grupo_nuevo":
            let chat_grupo = {...resp_message.data.chat_grupo};
            chat_grupo['hidden'] = false;
            chat_grupo['mensajes_no_leidos'] = 0;
            this.listadoUsuarios.unshift(chat_grupo);
            break;

          case "resp_chat_grupo_mensaje":
            const message = resp_message.message;

            if (this.chatSelected && this.chatSelected.tipo === 'chat_grupo' && this.chatSelected.id === message.chat_grupo_id) {
              this.chatGrupoMessages.push(message);
            }

            for (let index = 0; index < this.listadoUsuarios.length; index++) {
              const element = this.listadoUsuarios[index];

              if (element.tipo === 'chat_grupo' && element.id === message.chat_grupo_id) {
                if (this.iduseractual !== message.usuario_id) {
                  element.mensajes_no_leidos++;
                }

                this.listadoUsuarios.splice(index, 1);
                this.listadoUsuarios.unshift(element);
                break;
              }
            }

            setTimeout(() => {
              const scrollbar = document.getElementById("msg_history-private");
              scrollbar.scrollTop = scrollbar.scrollHeight;
            }, 0);

            break;

          case "resp_chat_grupo_aprobar":
            const respMessage = resp_message.data;

            if (this.chatSelected.tipo === 'chat_grupo' && this.chatSelected.id === respMessage.chat_grupo_id) {
              this.chatGrupoMessages.forEach((message) => {
                if (message.id === respMessage.id) {
                  message.aprobado_usuario_id = respMessage.aprobado_usuario_id;
                  message.aprobado_usuario = respMessage.aprobado_usuario;
                }
              });
            }

            break;

  				default:
  					break;
  			}
  		},
      (error) => {
        console.log(error);
      },
      () => { console.log('complete'); },  
    );
	}

	ngOnInit() {
		this.getusuariosAll();
    this.cargatemas();
    
    this.breakpointObserver
    .observe(['(max-width: 450px)'])
    .subscribe((state: BreakpointState) => {
      this.modeOneView = state.matches;
		});		
	}

	visiblecolumngrupo(){
		if(this.columngrupovisible){
			this.columngrupovisible = false;
		}else{
			this.columngrupovisible = true;
		}
	}

	cargatemas(){
		this.mensajeService.gruposOrderLasMessages(this.iduseractual).subscribe((data: any) => {
      this.listadoTemas = [...data.grupos];
      this.listadoTemas.forEach(elemento => {
        elemento['hidden'] = false;
      });

			for (let r in data.grupos) {
				if(!(data.grupos[r].grup_vtema in this.temasgrupo)){
					this.temasgrupo[data.grupos[r].grup_vtema] = []
					this.idgrupo[data.grupos[r].grup_vtema] = data.grupos[r].grup_nid
				}

			}
			for(let i in this.temasgrupo){
				if(!(i in this.arraytemasgrupo)){
					this.arraytemasgrupo.push(i)
				}
      }
      // console.log(this.arraytemasgrupo);
		});
	}

	ngOnDestroy(){ 
	  // this.mensajessus.unsubscribe();
	  // NOTA; aqui se almacenara la ultima vez que estuvo conectado al chat
	}

	nuevotipogrupo(){
    if (!this.datatipogrupo || (this.datatipogrupo.length === 0)) {
      return this.toastr.error('Debe completar el nombre del grupo');
    }

		let user = Object.assign({}, JSON.parse(localStorage.getItem('usuario')));
		let hora = new Date()
		let data = {
			grup_vtema : this.datatipogrupo,
			user_nid : user.id,
			grup_nsts : 1,
			grup_dfechacreacion: hora.toISOString()
		}

		if (this.datatipogrupo in this.temasgrupo) {
			return this.toastr.error('¡Ya existe el tema');
		} else {
			this.mensajeService.wsSubject.next({
        type: 'env_gru_temanuevo',
        data: data,
				message: 'agregando grupo'
			});

			this.datatipogrupo = '';
			this.toastr.success('¡Grupo creado con éxito!');
		}
	}

	selecttema(tema: any){
    const grupo_id = tema.grup_nid;
		this.actualopcionselec = grupo_id;
		this.actualgruposeleccionado = grupo_id
    this.groupSelectedName = tema.grup_vtema;
    this.groupLoader = true;

		for (let p in this.listagrupomensajes) {
			var elem = document.getElementById("grupomensajes" + p );
			elem.remove();
		}
		
		this.mensajeService.listagrupomensaje(grupo_id).subscribe((data: any) => {
			//this.listagrupomensajes.length = 0
			//this.listagrupomensajes.splice(0,1)
			
			delete this.listagrupomensajes
			this.listagrupomensajes = []

			for (let lg in data.listagrupomensaje) {
				this.listagrupomensajes.push(data.listagrupomensaje[lg])
			}

      this.groupLoader = false;

			// Para actualizar la ultima vez que estuvo activo
			let fecha = new Date();
			let messageData = {
				act_dfechaultima: fecha.toISOString(),
				user_id: this.iduseractual,
				grupo_nid: grupo_id
			}

			this.mensajeService.wsSubject.next({
        type: 'env_activogrupo_user',
        data: messageData,
        message:'activo en grupo'
      });

      tema.mensajes_no_leidos = 0;

			// console.log('this.listagrupomensajes   ',this.listagrupomensajes,this.arraytemasgrupo)

      setTimeout(() => {
        const scrollbar = document.getElementById("msg_history-group");
        scrollbar.scrollTop = scrollbar.scrollHeight;
      }, 0);
		});
	}

	nuevogrupomensaje() {
		try {
      if (!this.groupSelectedName || (this.groupSelectedName.length === 0)) {
        return this.toastr.error('Debe seleccionar un grupo destinatario');
      }

      if (!this.datagrupomensaje || (this.datagrupomensaje.length === 0)) {
        return this.toastr.error('Debe escribir un mensaje');
      }

			let user = Object.assign({}, JSON.parse(localStorage.getItem('usuario')));
			let hora = new Date()
			let datagrmen = {
				to_group: this.actualgruposeleccionado,
				from: user.id,
				message: this.datagrupomensaje,
				created_at: hora.toISOString()
			}
			// console.log('datagrmen, ',datagrmen)

			this.datagrupomensaje = '';
			this.mensajeService.wsSubject.next({
        type: 'env_grumen_mensajenuevo',
        data: datagrmen,
        message: 'agregando mensaje grupo'
			});
			// this.mensajeService.creategrupomensaje(datagrmen).subscribe(data => {
			// 	console.log('crear grupo mensaje ',data.grupomensaje)
			// 	this.listagrupomensajes.push(data.grupomensaje)
			// });
		}catch(err){
			console.log(err)
		}
		
	}

	getusuariosAll(){
		this.mensajeService.usuariosOrderLasMessages().subscribe((data: any) => {
      this.listadoUsuarios = [...data.usuarios];
      this.formUsuarios = [...data.usuarios];
      this.listadoUsuarios.forEach((usuario) => {
        usuario['hidden'] = false;
      });
			
			for(let us in data.usuarios){
				if(!(data.usuarios[us].id in this.listausuarios)){
					this.listausuarios[data.usuarios[us].id] = data.usuarios[us].usuario
					this.listausuariosmsjc[data.usuarios[us].id] = 0
				}
				
			}
			for(let id in data.usuarios){
				this.Arraylistausuarios.push(data.usuarios[id].id)
			}
			this.listachatmjcountmsj();
		});
	}

	cargarmensajechat(usuario){
    const userid_destinatario = usuario.id;
    const username_destinatario = usuario.usuario;

    this.privateLoader = true;
		this.actualopcionselec = userid_destinatario;
		this.actualchatuserseleccionado = userid_destinatario
		this.privateSelectedName = username_destinatario || usuario.nombre;
    this.chatSelected = usuario;
    // console.log('fff ',userid_destinatario,this.iduseractual);

    if (usuario.tipo === 'chat_grupo') {
      this.chatGrupoMessages = [];
      const data = {
        chat_grupo_id: usuario.id,
      };


      for (let index = 0; index < this.listadoUsuarios.length; index++) {
        const element = this.listadoUsuarios[index];

        if (element.tipo === 'chat_grupo' && element.id === usuario.id) {
          element.mensajes_no_leidos = 0;
          break;
        }
      }

      this.mensajeService.getMessagesChatGrupo(data).subscribe((data: any) => {
        this.chatGrupoMessages = data.messages;
        this.privateLoader = false;

        const dataActivo = {
          chat_grupo_id: usuario.id,
          from: this.iduseractual,
        };

        this.mensajeService.wsSubject.next({
          type: 'chat_grupo_activo',
          data: dataActivo,
          message: null,
        });

        setTimeout(() => {
          const scrollbar = document.getElementById("msg_history-private");
          scrollbar.scrollTop = scrollbar.scrollHeight;
        }, 0);
     });

    } else {
      /*
  		for (let p in this.listachatmensajes) {
  			var elem = document.getElementById("chatmensajes" + p );
  			elem.remove();
      }
      */
      
  		let mensajesdata = {
  			user_enviox_nid:this.iduseractual,
  			user_nid_destinatario:userid_destinatario,
      }
      
  		this.mensajeService.listachatmensaje(mensajesdata).subscribe((data: any) => {
  			//this.listachatmensajes.length = 0
  			//this.listachatmensajes.splice(0,1)
  			
  			// delete this.listachatmensajes;
  			this.listachatmensajes = [];
        this.listachatmensajes = data.listachatmensaje;

        /*
  			for (let lg in data.listachatmensaje) {
  				this.listachatmensajes.push(data.listachatmensaje[lg])
  			}
        */
  			/*
  				Marco los mensajes como vistos
  			*/
  			let vistodata = {
  				from: this.iduseractual,
  				to: this.actualchatuserseleccionado
  			}

  			this.listausuariosmsjc[userid_destinatario] = 0;
  			
  			this.mensajeService.wsSubject.next({
          type: 'env_marcarvisto_mensajechat',
          data: vistodata,
          message: 'chat visto'
        });
        
  			// console.log('this.listachatmensajes  ',this.listachatmensajes);

  			setTimeout(() => {
          const scrollbar = document.getElementById("msg_history-private");
          scrollbar.scrollTop = scrollbar.scrollHeight;
          this.privateLoader = false;
        }, 1);
  		});
    }
	}

	listachatmjcountmsj(){

		let mensajesdata = {
			user_nid_destinatario:this.iduseractual
		}
		this.mensajeService.listachatmjcountmsj(mensajesdata).subscribe((data: any) => {
			//this.listachatmensajes.length = 0
			//this.listachatmensajes.splice(0,1)
			// console.log('data  ',data,this.listausuariosmsjc)

			let countlist = data.listachatmensajecount
			for(let i in countlist){
				this.listausuariosmsjc[countlist[i].user_enviox_nid] = Number(this.listausuariosmsjc[countlist[i].user_enviox_nid]) + 1;
			}
		});
	}

	enviarchatmensaje(tipo){
    // console.log("enviar mensaje ", tipo);
    if (!this.mensajechat || (this.mensajechat.length === 0)) {
      return this.toastr.error('Debe escribir un mensaje');
    }

    if (!this.chatSelected || (Object.keys(this.chatSelected).length === 0)) {
      return this.toastr.error('Debe seleccionar un destinatario');
    }


    if (this.chatSelected.tipo === 'chat_grupo') {
      const data = {
        from: this.iduseractual,
        message: this.mensajechat,
        type: tipo,
        chat_grupo_id: this.chatSelected.id,
      }

      this.mensajechat = '';

      this.mensajeService.wsSubject.next({
        type: 'chat_grupo_mensaje',
        data: data,
        message: ''
      });
    } else {
			let data = {
				from: this.iduseractual,
				message: this.mensajechat,
				type: tipo,
				to: this.actualchatuserseleccionado,
			}

      this.mensajechat = '';
      // console.log(this.mensajeService.messages);
			this.mensajeService.wsSubject.next({
				type: 'env_chatmen_mensajenuevo',
				data: data,
				message:'agregando gmensaje chat'
			});
    }
	}

	checkpedidochat(chtm_nid, tipo = 'chat') {
		// console.log('chtm_nid',chtm_nid);

    if (tipo === 'chat_grupo') {
      const data = {  
        message_id: chtm_nid,
        from: this.iduseractual,
      }

      this.mensajeService.wsSubject.next({
        type: 'chat_grupo_aprobar',
        data: data,
        message: null,
      })
    } else {
      const data = {  
        chtm_nid: chtm_nid,
        from: this.iduseractual,
        to: this.actualchatuserseleccionado,
      }

      this.mensajeService.wsSubject.next({
        type: 'env_actchatpedido_ok',
        data: data,
        message:'actualizar pedido'
      })
    }
	}

	cargalistatareas(){
		this.mensajeService.getlistatareas(this.iduseractual).subscribe((data: any) => {
			for (let r in data.listatareas) {
				if(!(data.listatareas[r].tar_nid in this.listatareas)){
					this.listatareas[data.listatareas[r].tar_nid] = {'mensaje':data.listatareas[r].tar_vmensaje,'sts': data.listatareas[r].tar_nsts}
				}
			}
			for(let i in this.listatareas){
				this.arraylistatareas.push(i)
			}
			this.getnuevoordentareas()

		});
	}

	getnuevoordentareas(){

		this.arrayNuevoOrdenTemas = []
		for(let i in this.arraylistatareas){
			let ont = this.arraylistatareas[i]
			if(this.listatareas[ont].sts == 0 ){
				this.arrayNuevoOrdenTemas.push(ont)
			}
		}

		for(let i2 in this.arraylistatareas){
			let ont2 = this.arraylistatareas[i2]
			if(this.listatareas[ont2].sts != 0 ){
				this.arrayNuevoOrdenTemas.push(ont2)
			}
		}

		let cont = 1
		for(let i3 in this.arrayNuevoOrdenTemas){
			if(cont == 1){
				// console.log('length',this.arraylistatareas.length)
				this.arraylistatareas.splice(0,(this.arraylistatareas.length))
				
			}
			this.arraylistatareas.push(this.arrayNuevoOrdenTemas[i3])
			cont = 2
		}

		//this.arraylistatareas = this.arrayNuevoOrdenTemas
		// console.log(this.arraylistatareas)
	}

	agregartarea(){
		let hora = new Date()
		let data = {		
			tar_vmensaje:this.textotarea,
			tar_nsts:0,
			tar_dfechacreacion:hora.toISOString(),
			user_nid:this.iduseractual
		}
		this.mensajeService.agregartarea(data).subscribe((data: any) => {
			this.listatareas[data.tarea.tar_nid] = {'mensaje':data.tarea.tar_vmensaje,'sts': data.tarea.tar_nsts}
			this.arraylistatareas.push(data.tarea.tar_nid)
		});
	}

	tarearealizada(tareaid){
		this.mensajeService.tarearealizada(tareaid).subscribe((data: any) => {
			if(data.success){
				this.listatareas[data.tar_nid].sts = 1
				this.getnuevoordentareas()
			}
		});
	}

	activegrupof(){
		// console.log('grupo')
		this.activegrupo = 1;
		this.activechat  = 0;
	}

	activechatf(){
		// console.log('chat')
		this.activegrupo = 0;
		this.activechat  = 1;
	}

	deletetema(event, idgrupo) {
    event.stopPropagation();

		let data = {idgrupo: idgrupo};
		const r = confirm("¿Eliminar tema?");

		if (r == true) {
			this.mensajeService.wsSubject.next({
        type: 'env_deletetema_delete',
        data: data,
        message: 'delete tema'
      });
		} else {
		}
	}

  backGroup() {
    this.groupSelectedName = "";
    this.actualopcionselec = "";
	}
	
	backPrivate() {
    this.privateSelectedName = "";
    this.actualopcionselec = "";
    this.chatSelected = null;
  }

  public usuarioFiltrar() {
    const busquedaUsuario = this.busquedaUsuario.toLowerCase();
    const usuariosFiltrados =[...this.listadoUsuarios];

    usuariosFiltrados.forEach(elemento => { elemento.hidden = false; });

    if (busquedaUsuario && (busquedaUsuario.length > 0)) {
      usuariosFiltrados.forEach(elemento => {
        let username = '';

        if (elemento.tipo === 'chat') {
          username = elemento.usuario.toLowerCase() || null;
        } else if (elemento.tipo === 'chat_grupo') {
          username = elemento.nombre.toLowerCase() || null;
        }

        if (!username || (username.indexOf(busquedaUsuario) === -1)) {
          elemento.hidden = true;
        }
      });
    }

    this.listadoUsuarios = usuariosFiltrados;
  }

  public temaFiltrar() {
    const busquedaTema = this.busquedaTema.toLowerCase();
    const temasFiltrados =[...this.listadoTemas];

    temasFiltrados.forEach(elemento => { elemento.hidden = false; });

    if (busquedaTema && (busquedaTema.length > 0)) {
      temasFiltrados.forEach(elemento => {
        const groupName = elemento.grup_vtema.toLowerCase() || null;

        if (!groupName || (groupName.indexOf(busquedaTema) === -1)) {
          elemento.hidden = true;
        }
      });
    }

    this.listadoTemas = temasFiltrados;
  }

  public btnShowSidebar() {
    console.log(this.showSidebarChat);
    this.showSidebarChat = !this.showSidebarChat;
  }

  public modalChatGrupo() {
    _$('#modal-chat-grupo').modal();
  }

  public crearChatGrupo() {
    if (!this.formChatGrupo.nombre || (this.formChatGrupo.nombre.length === 0)) {
      return this.toastr.error('Debe completar el nombre del nuevo grupo');
    }

    let usuariosSelected = this.formUsuarios.filter(usuario => {
      return usuario.hasOwnProperty('check') && usuario.check === true;
    });

    console.log(usuariosSelected);

    if (!usuariosSelected || (usuariosSelected.length === 0)) {
      return this.toastr.error('Debe añadir al menos un usuario al grupo');
    }

    usuariosSelected = usuariosSelected.map(usuario => {
      return usuario.id;
    });

    const data = {
      from: this.iduseractual,
      usuarios: usuariosSelected,
      nombre: this.formChatGrupo.nombre,
    }

    this.mensajeService.wsSubject.next({
      type: 'chat_grupo_nuevo',
      message: '',
      data: data,
    });

    _$('#modal-chat-grupo').modal('hide');

    this.toastr.success('¡Grupo añadido con éxito!');
  }
}
