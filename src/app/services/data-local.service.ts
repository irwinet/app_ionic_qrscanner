import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _storage: Storage | null = null;
  guardados: Registro[] = []

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private inAppBrowser: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
  ) {
    this.init()
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;

    this.loadQRs();
  }

  async loadQRs(){
    try {
      const registros = await this._storage.get('regitros');
      this.guardados = registros || [];
    } catch (error) {

    }
  }

  async guardarRegistro(format: string, text:string){

    await this.init();

    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    console.log(this.guardados);

    this._storage.set('regitros', this.guardados);

    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro(registro: Registro){
    this.navCtrl.navigateForward('/tabs/tab2');
    switch(registro.type){
      case 'http':
        this.inAppBrowser.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    }
  }

  enviarCorreo(){
    const arrTemp = []
    const titulos = 'Tipo, Formato, Crean en, Texto\n';

    arrTemp.push(titulos);
    this.guardados.forEach((registro) => {
      const linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',',' ')}\n`;
      arrTemp.push(linea);
    });

    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string){
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
      .then(existe => {
        console.log('Existe el archivo?', existe);
        return this.escribirArchivo(text);
      })
      .catch(err => {
        return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
          .then(creado => this.escribirArchivo(text))
          .catch(err2 => console.log('No se puede crear el archivo', err2));
      });
  }

  async escribirArchivo(text: string){
    await this.file.writeExistingFile(this.file.dataDirectory,'registros.csv', text);

    console.log(this.file.dataDirectory + 'registros.csv');

    const archivo = this.file.dataDirectory + '/registros.csv';

    const email = {
      to: 'irwinestradatorres@gmail.com',
      //cc: 'erika@mustermann.de',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Aqui tienen sus backups de los scans - <strong>ScanApp</strong>',
      isHtml: true
    }

    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
