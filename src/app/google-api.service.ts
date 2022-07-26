import { Client, Sheet, TableProperties } from 'app/models';
import { GoogleApiEventService } from './google-api-event.service';
import { Injectable } from '@angular/core';

import * as google from 'googleapis';
import * as googleAuth from 'google-auth-library';

import * as PhotoSwipe from 'photoswipe/dist/photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

// Client ID and API key from the Developer Console
const CLIENT_ID = '289462742400-od2j1hnp3es5kehov4oiivu800inudbt.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4',
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
];

// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly';

const MONITOR_CLIENTS_RANGE = 'General!A1:AU39';

function _gapiService(): GoogleApiService {
  return (window as any).gApiService;
}

function _monitorSheetId(): string {
  return (window as any).TALLER_SPREADSHEET_ID;
}

const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

@Injectable()
export class GoogleApiService {

  gapi = (window as any).gapi;

  public logged: boolean;

  constructor(private googleApiEvent: GoogleApiEventService) {
    this.loadClient();
  }

  public arrayToObject(arr, positions: number[]) {
    const rv = {};

    positions.forEach((pos, index) => {
      if (arr[pos] !== undefined) {
        rv[index] = arr[pos]
      } else {
        rv[index] = '';
      }
    });

    return rv;
  }

  valueToObject(val, positions: number[]) {
    const rv = {};

    positions.forEach((pos, index) => {
      rv[index] = val
    });

    return rv;
  }

  private getRowOffset(range: string): number {
    if (!range.startsWith('!A')) {
      console.error('Invalid range');
      return;
    }

    return parseInt(range.substr(2, range.indexOf(':') - 2), 10);
  }

  getImages(folderId: string) {
    console.log('Searching in folder...' + folderId);
    const driveImagesUrl = 'https://docs.google.com/uc?id=';
    gapi.client.drive.files.list({
          corpus: 'user', q: '"' + folderId + '" in parents'
    }).then(function(response) {
      const imageItems = [];

      response.result.files.forEach(element => {
        imageItems.push({src: driveImagesUrl + element.id, w: 1108, h: 729 });
      });

      const pswpElement = document.querySelectorAll('.pswp')[0];
      const options = {
          index: 0 // start at first slide
      };

      // Initializes and opens PhotoSwipe
      const gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, imageItems, options);
      gallery.init();
    });
  }

  isRowValid(matrix: any[][], row: number, columnValidator: number) {
    return matrix.length > row && matrix[row].length > columnValidator && matrix[row][columnValidator] !== '';
  }

  parseRawCells(tableProperties: TableProperties, matrix: any[][], addSeparator: boolean = true): any {
    const result = [];
    const rowOffset = this.getRowOffset(tableProperties.rawRange);
    const validRows = [];
		console.log(rowOffset);

    tableProperties.rowRanges.forEach((range, index) => {
      if (index > 0 && addSeparator) {
          result.push(this.valueToObject(' ', tableProperties.columns));
          validRows.push(104);
      }

      for (let i = range.begin; i <= range.end; i++) {
        if (this.isRowValid(matrix, i, tableProperties.columnValidator)) {
          result.push(this.arrayToObject(matrix[i], tableProperties.columns));
          validRows.push(rowOffset + i);
        }
      }
    });

    return { table: result, validRows: validRows };
  }

  writeCell(shespreadsheetId: string, range: string, value: string): Promise<any> {
    console.log('Writing cell ' + range + ' with ' + value);
    return new Promise((resolve, reject) => {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: shespreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        values: [[ value ]]})
      .then(
        response => {
          resolve(response);
        },
        response => {
          console.error(response);
          reject(response);
        }
      )
    });
  }

  writeCells(shespreadsheetId: string, range: string, values: string[][]): Promise<any> {
    console.log('Writing cell ' + range + ' with ' + values);
    return new Promise((resolve, reject) => {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: shespreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        values: values})
      .then(
        response => {
          resolve(response);
        },
        response => {
          console.error(response);
          reject(response);
        }
      )
    });
  }

  getRawCells(sheetId: string, range: string): Promise<any> {
    console.log('Loading range ' + range + ' of ' + sheetId);
    return new Promise((resolve, reject) => {
      gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: range
      })
      .then(
        function(response) {
          resolve(response.result.values);
        },
        function(response) {
          reject(response.result.error);
      })
    });
  }

  getRawCell(sheetId: string, cell: string): Promise<any> {
    console.log('Loading cell ' + cell + ' of ' + sheetId);
    return new Promise((resolve, reject) => {
      gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: cell
      })
      .then(
        function(response) {
          resolve(response.result.values[0][0]);
        },
        function(response) {
          reject(response.result.error);
      })
    });
  }

  // Get sheet list in a spreadsheet
  getSheets(sheetId: string): Promise<Sheet[]> {
    return new Promise(resolve => {
      gapi.client.sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      }).then(function(response) {
        const sheetList: Sheet[] = [];
        response.result.sheets.forEach(element => {
          const sheet = new Sheet();
          sheet.id = element.properties.sheetId;
          sheet.name = element.properties.title;
          sheetList.push(sheet);
        });
        resolve(sheetList);
      }, function(response) {
        console.error(response.result.error.message);
        resolve([]);
      });
    });
  }

  // Get client list
  getClients(): Promise<Client[]> {
    return new Promise(resolve => {
      this.googleApiEvent.notifierSubject.subscribe(data => {
        resolve(Promise.resolve(data));
      });
    });
  }

  // Load GoogleApi
  loadClient() {
    gapi.load('client:auth2', this.initClient);
    (window as any).gApiService = this;
  }

  // Init GoogleApi
  initClient() {
		console.log('test initClient');
    gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => {
        _gapiService().updateSigninStatus(signedIn);
      });

      // Handle the initial sign-in state.
      _gapiService().updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			console.log('test-2: logged', gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  // Manage signin status
  updateSigninStatus(logged: boolean) {
    this.logged = logged;
    if (logged) {
      this.googleApiEvent.notifySigninStatus();
      this.getClientList();

			if (!window.localStorage.hasOwnProperty('profileGoogle') || (window.localStorage.getItem('profileGoogle').length === 0)) {
				let profileRaw    = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
				let profileGoogle = {
					name:  profileRaw.ig,
					email: profileRaw.U3
				};
				window.localStorage.setItem('profileGoogle', JSON.stringify(profileGoogle));
			}

      console.log('Signed In: new');
    } else {
      console.log('Sign out');
    }
  }

  // Send a request for client data
  getClientList() {
    gapi.client.sheets.spreadsheets.get({
      spreadsheetId: _monitorSheetId(),
      ranges: MONITOR_CLIENTS_RANGE,
      includeGridData: true
    }).then(function(response) {
      console.log(response);
      _gapiService().printClientList(response.result.sheets[0].data[0].rowData);
    }, function(response) {
      console.error(response.result.error.message);
    });
  }

  getValue(matrix, i, j) {
    return matrix[i].values[j].formattedValue;
  }

  printClientList(matrix) {
    if (matrix.length === 0) {
      return;
    }

    const clientList: Client[] = [];

    for (let r = 2; r < matrix.length; r++) {
      if (matrix[r].values.length > 2
        && this.getValue(matrix, r, 2) !== undefined
        && this.getValue(matrix, r, 2) !== ''
        && this.getValue(matrix, r, 2) !== 'Disponible') {

        const client: Client = new Client();
        client.id = r;
        client.name = this.getValue(matrix, r, 2);

        if (matrix[r].values.length > 22) {
          client.imageFolderLink = matrix[r].values[22].hyperlink;
        }

        if (matrix[r].values.length > 31 && this.getValue(matrix, r, 31) !== '') {
          let clientSheetId = this.getValue(matrix, r, 31);

          if (clientSheetId) {
            clientSheetId = clientSheetId.match(/spreadsheets\/d\/(.*?)\/edit/g);
          }

          if (clientSheetId) {
            client.clientDetailLink = 'https://docs.google.com/' + clientSheetId[0] + '?rm=minimal#gid=';
            client.clientDetailId = clientSheetId[0].substr(15, 44);

            if (isMobile.any()) {
              client.clientDetailLink = 'https://docs.google.com/spreadsheets/d/' +
                client.clientDetailId +
                '/htmlembed?single=true&widget=false&chrome=false&gid=';
            }
          } else {
            console.error('Error parsing client: ' + client.name);
          }
        }

        clientList.push(client);
      }
    }

    this.googleApiEvent.notify(clientList);
  }

  /**
   *  Sign in the user upon button click.
   */
  handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
		console.log(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
  }

	public getUser() {
		return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
		// return gapi.auth2.getAuthInstance().currentUser().get().getBasicProfile();
	}
}
