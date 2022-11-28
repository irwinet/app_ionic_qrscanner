import { Component } from '@angular/core';
import { DataLocalService } from 'src/app/services/data-local.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    public dataLocalService: DataLocalService
  ) {}

  enviarCorreo(){
    console.log('Enviando correo...');
    this.dataLocalService.enviarCorreo();
  }

  abrirRegistro(registro: Registro){
    console.log(registro)
    this.dataLocalService.abrirRegistro(registro);
  }
}
