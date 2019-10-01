import { Component, OnInit } from '@angular/core';
import { ViewController, ToastController, LoadingController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { Geolocation }  from '@ionic-native/geolocation'


@Component({
  selector: 'page-set-coordinates',
  templateUrl: 'set-coordinates.html',
})
export class SetCoordinatesPage implements OnInit {

  latitude: number;
  longitude: number;
  marker: {
    latitude: number,
    longitude: number,
    draggable: true
  };

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private geolocation: Geolocation, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    let receivedLatitude = this.navParams.get('latitude');
    let receivedLongitude = this.navParams.get('longitude');
    if(receivedLatitude){
      this.latitude = receivedLatitude; 
      this.longitude = receivedLongitude;
      this.marker = {
        longitude : receivedLongitude, 
        latitude : receivedLatitude,
        draggable: true
      }
    } else {
      this.latitude = 57.28;
      this.longitude = 2.58;
    }
  }

  onCancel() {
    this.viewCtrl.dismiss();
  }

  onMapClicked($event) {
    this.marker = {
      latitude: $event.coords.lat,
      longitude: $event.coords.lng,
      draggable: true
    };
  }

  onSave() {
    this.viewCtrl.dismiss({
      latitude: this.marker.latitude,
      longitude: this.marker.longitude
    });
  }

  onLocateMe() {
    let loader = this.loadingCtrl.create({
      content: 'Recherche de votre position…'
    });
    loader.present();
    this.geolocation.getCurrentPosition().then(
      (resp) => {
        loader.dismiss();
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.marker = {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude,
          draggable: true
        }
      }).catch(
      (error) => {
        loader.dismiss();
        this.toastCtrl.create({
          message: error,
          duration: 3000,
          position: 'bottom'
        }).present();
      }
    );
  }

}
