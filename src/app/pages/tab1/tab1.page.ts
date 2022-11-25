import { Component } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  swiperOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  }

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocalService: DataLocalService
  ) {}

  ionViewDidEnter(){
    console.log('ViewDidEnter');
  }

  ionViewDidLeave(){
    console.log('ViewDidLeave');
  }

  // ionViewDidLoad(){
  //   console.log('ViewDidLoad');
  // }

  ionViewWillEnter(){
    console.log('ViewWillEnter');
    this.scan();
  }

  ionViewWillLeave(){
    console.log('ViewWillLeave');
  }

  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if(!barcodeData.cancelled){
        this.dataLocalService.guardarRegistro(barcodeData.format, barcodeData.text);
      }
     }).catch(err => {
         console.log('Error', err);
        //  this.dataLocalService.guardarRegistro('QRCode', 'http://www.google.com.pe/');
         this.dataLocalService.guardarRegistro('QRCode', 'geo:40.73151796986687,-74.06087294062502');
     });
  }
}
