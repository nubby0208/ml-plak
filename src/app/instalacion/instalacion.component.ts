import { environment } from './../../environments/environment';
import { ModalOptimizeComponent } from './../modal-optimize/modal-optimize.component';
import { CellInfo } from './../models';
import { ModalSelectComponent, SelectTypeEnum } from './../modal-select/modal-select.component';
import { ModalAlertComponent } from './../modal-alert/modal-alert.component';
import { TablePropertiesService } from './../services/table-properties.service';
import { GoogleApiEventService } from './../google-api-event.service';
import { GoogleApiService } from './../google-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { Client, Sheet, TableProperties } from 'app/models';
import { _window, _$ } from 'app/common';
import * as moment from 'moment';

declare let jsPDF;
declare var html2canvas: any
declare var download: any

declare var $: any;

@Component({
	selector: 'app-instalacion',
	templateUrl: './instalacion.component.html',
	styleUrls: ['./instalacion.component.css']
})
export class InstalacionComponent implements OnInit {

	@ViewChild(ModalAlertComponent)
	private modalAlertComponent: ModalAlertComponent;

	@ViewChild(ModalSelectComponent)
	private modalSelectComponent: ModalSelectComponent;

	@ViewChild(ModalOptimizeComponent)
	private modalOptimizeComponent: ModalOptimizeComponent;

	selectClientList: object[];

	clients: Client[];
	sheets: Sheet[];
	selectedClient: Client;
	selectedSheet: Sheet; // this.selectedSheet.name = 'C1'
	sheetId = 0;
	spreadSheetUrl;
	logged: boolean;
	public items = []
	public datacliente: any = []
	public itemsss = {
		title: '',
		start: '',
	}


	public itemsData
	public datait
	public dataittems = []
	public proyectoCLie
	public hojaDta
	public Linkimgen
	public DataLinkimgen
	public DataLinkimgenSe
	public InfoImagenData


	public nomApellido
	public Direccion
	public Telefono
	public Mueble
	public Total
	public Sena
	public SaldoPen
	public fchainst
	public horadeinst
	public comentarioInsta

	public RespnomApellido
	public RespDireccion
	public RespTelefono
	public RespMueble
	public RespTotal
	public RespSena
	public RespSaldoPen
	public Respfchainst
	public Resphoradeinst
	public RespcomentarioInsta
	public FooterEmp
	public arrimgen
	public headerdata
	public headerdataInfo = []
	public nGdataresumen = false
	public nGdatadetalle = false
	public ColumsDEtalle = false

	selectedTable: string;
	iframeHeight = '500px';
	//@RestController
	//@CrossOrigin(origins = "*")


	constructor(private sanitizer: DomSanitizer,
		public googleApi: GoogleApiService,
		private googleApiEvent: GoogleApiEventService,
		private tableProperties: TablePropertiesService,
		private ref: ChangeDetectorRef,
		private zone: NgZone) {

	}

	ngOnInit() {
		this.proyectoCLie = ''
		this.ClientePro()

	}
	imgToBase64(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = function () {
			var reader = new FileReader();
			reader.onloadend = function () {
				callback(reader.result.toString().replace('text/xml', 'image/jpeg'));
			};
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.send();
	}

	getdetails(proyecto, tipo) {

		if (proyecto == '' || proyecto == undefined) {

			document.getElementById("proyectoCLie").focus();
			alert('Antes de iniciar Seleccione Proyecto')
		} else {
			var ass = []
			var objstring = proyecto.replace(/&/g, '"')
			var objsString = JSON.stringify(objstring);
			var obj = JSON.parse(objstring);
			var imagenData
			// console.log('Load gallery from ' + obj[3] + '. Id:' + obj[1])
			const begin = obj[1].lastIndexOf('folders/') + ('folders/').length;
			var imageFolderId = obj[1].substr(begin);
			this.callGoogleImages(imageFolderId, tipo);
			this.Linkimgen = 'IMAGEN!a9:a10';

			switch (tipo) {
				case "B":
					this.hojaDta = 'GRAL!A1:F11'
					// this.GeneraPdf(proyecto,tipo)
					//console.log(obj)
					//this.InfoImagenData = JSON.parse(this.DataLinkimgen); 
					this.GeneraPdf('', 'GRAL!A1:F11', obj[2], tipo)
					break;
				case "D":
					this.hojaDta = 'GRAL!A1:F11'

					this.DataLinkimgen = localStorage.getItem("GalTipoD");
					this.InfoImagenData = JSON.parse(this.DataLinkimgen);
					localStorage.removeItem('GalTipoD');
					this.GeneraPdf(this.InfoImagenData, 'GRAL!a1:f11', obj[2], tipo)

					break;
				case "C":
					this.hojaDta = 'GRAL!a1:Aj150'
					this.DataLinkimgen = localStorage.getItem("GalTipoC");
					this.InfoImagenData = JSON.parse(this.DataLinkimgen);
					localStorage.removeItem("GalTipoC");
					this.GeneraPdf(this.InfoImagenData, 'GRAL!a1:Aj150', obj[2], tipo)
					break;
			}



		}
	}
	callGoogleImages(folderId: string, tipo: string) {
		console.log('Searching in folder...' + folderId);
		const driveImagesUrl = 'https://docs.google.com/uc?id=';
		gapi.client.drive.files.list({
			corpus: 'user', q: '"' + folderId + '" in parents'
		}).then(function (response) {
			const imageItems = [];

			response.result.files.forEach(element => {
				imageItems.push({ src: driveImagesUrl + element.id, w: 1108, h: 729 });
			});

			const pswpElement = document.querySelectorAll('.pswp')[0];
			const options = {
				index: 0 // start at first slide
			};
			var strinImg = JSON.stringify(imageItems);
			// console.log(strinImg)
			//this.DataLinkimgenSe = strinImg


			localStorage.setItem('GalTipo' + tipo, strinImg);

		});
		//console.log(this.DataLinkimgenSe)
	}

	ClientePro() {
		var itenslo = localStorage.getItem("Clientes");
		this.clients = JSON.parse(itenslo);

		if (this.clients != null || this.clients != undefined) {
			this.googleApi.getClients().then(clients => {
				this.clients = clients;
			});
		}

	}


	/*	descarga(archivo) {
			document.location = archivo;
		}
		*/


	GeneraPdf(imagen, textdata, obj, tipo) {
		this.arrimgen = imagen
		this.googleApi.getRawCells(obj, textdata).then(result => {

			this.nomApellido = result[1][0]
			this.Direccion = result[2][0]
			this.Telefono = result[3][0]
			this.Mueble = result[4][0]
			this.Total = result[5][0]
			this.Sena = result[6][0]
			this.SaldoPen = result[7][0]
			this.fchainst = result[8][0]
			this.horadeinst = result[9][0]
			this.comentarioInsta = result[10][0]

			this.RespnomApellido = result[1][3]
			this.RespDireccion = result[2][3]
			this.RespTelefono = result[3][3]
			this.RespMueble = result[4][3]
			this.RespTotal = result[5][3]
			this.RespSena = result[6][3]
			this.RespSaldoPen = result[7][3]
			this.Respfchainst = result[8][3]
			this.Resphoradeinst = result[9][3]
			this.RespcomentarioInsta = result[10][3]
			this.headerdata = result[13]

			this.headerdataInfo.push({
				'NombreApellido': result[1][3],
				'Direccion': result[2][3],
				'Telefono': result[3][3],
				'Mueble': result[4][3],
				'Total': result[5][3],
				'Sena': result[6][3],
				'Saldopend': result[7][3],
				'Fechadeinstalacion': result[8][3],
				'Horadeinstalaicon': result[9][3],
				'Comentariodeinstalcio': result[10][3]

			})

			var strinImgMJ = JSON.stringify(this.headerdataInfo);
			localStorage.setItem('Resumen', strinImgMJ);


			if (tipo == 'C') {
				for (var i = 14; i < result.length; ++i) {
					this.headerdataInfo.push(
						{
							'N': result[i][0],
							'CORTE': result[i][1],
							'PC': result[i][2],
							'PRE': result[i][3],
							'BOX': result[i][4],
							'FLE': result[i][5],
							'CANT': result[i][6],
							'Pieza': result[i][7],
							'MOD': result[i][9],
							'EXTRA1': result[i][10],
							'EXTRA2': result[i][11],
							'EXTRA3': result[i][15],
							'EXTRA4': result[i][16],
							'LVETA': result[i][18],
							'AVETA': result[i][21],
							'nuldat7': result[i][22],
							'EXTRA5': result[i][23],
							'EXTRA6': result[i][24],
							'EXTRA7': result[i][29],
							'EXTRA8': result[i][31],
							'MATERIAL': result[i][33]
						}
					)

				}
				var strinImgMJ = JSON.stringify(this.headerdataInfo);
				localStorage.setItem('FullDetalle', strinImgMJ);

			}
		});
		var details
		var getDataRown
		var rows
		var detailsd
		var rowsd
		if (tipo == 'B') {
			details = [
				{ title: "Nombre Apellido", dataKey: "NombreApellido" },
				{ title: "Direccion", dataKey: "Direccion" },
				{ title: "Telefono", dataKey: "Telefono" },
				{ title: "Mueble", dataKey: "Mueble" },
				{ title: "Total", dataKey: "Total" },
				{ title: "Seña", dataKey: "Sena" },
				{ title: "Saldo pend", dataKey: "Saldopend" },
				{ title: "Fecha de instalacion  ", dataKey: "Fechadeinstalacion" },
				{ title: "Hora de instalaicon  ", dataKey: "Horadeinstalaicon" },
				{ title: "Comentario de instalcio  ", dataKey: "Comentariodeinstalcio" }
			];
			getDataRown = localStorage.getItem("Resumen");
			rows = JSON.parse(getDataRown);
			//console.log('Resumen--->',rows)

		}


		//if (tipo == 'C'  || tipo == 'D') {
		details = [
			{ title: "N", dataKey: "N" },
			{ title: "CANT", dataKey: "CANT" },
			{ title: "Pieza", dataKey: "Pieza" },
			{ title: "MOD", dataKey: "MOD" },
			{ title: "EXTRA1", dataKey: "EXTRA1" },
			{ title: "EXTRA2", dataKey: "EXTRA2" },
			{ title: "EXTRA3", dataKey: "EXTRA3" },
			{ title: "EXTRA4", dataKey: "EXTRA4" },
			{ title: "LVETA", dataKey: "LVETA" },
			{ title: "AVETA", dataKey: "AVETA" },
			{ title: "EXTRA5", dataKey: "EXTRA5" },
			{ title: "EXTRA6", dataKey: "EXTRA6" },
			{ title: "EXTRA7", dataKey: "EXTRA7" },
			{ title: "EXTRA8", dataKey: "EXTRA8" },
			{ title: "MATERIAL", dataKey: "MATERIAL" }
		];

		getDataRown = localStorage.getItem("FullDetalle");
		rows = JSON.parse(getDataRown);
		//console.log('FullDetalle--->',rows)


		detailsd = [
			{ title: "Nombre Apellido", dataKey: "NombreApellido" },
			{ title: "Direccion", dataKey: "Direccion" },
			{ title: "Telefono", dataKey: "Telefono" },
			{ title: "Mueble", dataKey: "Mueble" },
			{ title: "Total", dataKey: "Total" },
			{ title: "Seña", dataKey: "Sena" },
			{ title: "Saldo pend", dataKey: "Saldopend" },
			{ title: "Fecha de instalacion  ", dataKey: "Fechadeinstalacion" },
			{ title: "Hora de instalaicon  ", dataKey: "Horadeinstalaicon" },
			{ title: "Comentario de instalcio  ", dataKey: "Comentariodeinstalcio" }
		];

		getDataRown = localStorage.getItem("Resumen");
		rowsd = JSON.parse(getDataRown);
		//console.log('Resumen--->',detailsd)
		//}


		var columns = details

		setTimeout(function () {
			//console.log('print v')

			if (tipo == 'B' || tipo == 'D') {
				download(document.getElementById('imegenes').outerHTML, moment() + "mlplak.html", "text/html");
			} else {
				download(document.getElementById('imprimir').outerHTML, moment() + "mlplak.html", "text/html");
			}

			localStorage.removeItem("Resumen");
			localStorage.removeItem("FullDetalle");


			// body...
		}, 500)
		/* if (rows != '' ) {
			  console.log('*****************************',detailsd)

			var doc = new jsPDF('l', 'pt');

			 if (tipo == 'C'  || tipo == 'D') {
				  doc.autoTable(columns, getDataRown, {
							theme: 'striped',
								
								headerStyles: {
											fillColor: [177, 208, 230],
											fontSize: 9,
											textColor: [27, 54, 93],
											fontStyle: 'bold',
											overflow: 'linebreak',
											cellPadding: [3, 1, 3, 0]
									},

									styles: {
											font: "helvetica", // helvetica, times, courier
											lineWidth: 0,
											fontStyle: 'helvetica',
											fontSize: 9,
											tableWidth: 'auto',
											cellPadding: [3, 1, 3, 0],
											textColor: [80, 80, 80]
									},
									alternateRowStyles: {
											fillColor: [225, 225, 225]
									},
								margin: {top: 60},
								addPageContent: function(data) {
									doc.text("DETALLE ML PLAK", 40, 30);
								}
						});
					
					}
					if (tipo == 'B') {
						console.log(detailsd, rows)
						doc.autoTable( details, rows, {
							theme: 'striped',
								
								headerStyles: {
											fillColor: [177, 208, 230],
											fontSize: 9,
											textColor: [27, 54, 93],
											fontStyle: 'bold',
											overflow: 'linebreak',
											cellPadding: [3, 1, 3, 0]
									},

									styles: {
											font: "helvetica", // helvetica, times, courier
											lineWidth: 0,
											fontStyle: 'helvetica',
											fontSize: 9,
											tableWidth: 'auto',
											cellPadding: [3, 1, 3, 0],
											textColor: [80, 80, 80]
									},
									alternateRowStyles: {
											fillColor: [225, 225, 225]
									},
								margin: {top: 60},
								addPageContent: function(data) {
									doc.text("DETALLE ML PLAK", 40, 30);
								}
						});
					}
					doc.save('mlplak.pdf');
					this.ClientePro();
			} */
	}


}
