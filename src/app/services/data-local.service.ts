import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _storage: Storage | null = null;
  guardados: Registro[] = []

  constructor(private storage: Storage) {
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
  }
}
