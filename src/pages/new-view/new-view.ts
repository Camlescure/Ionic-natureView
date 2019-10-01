import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, Modal, ToastController, NavController } from 'ionic-angular';
import { SetCoordinatesPage } from '../set-coordinates/set-coordinates';
import { Camera } from '@ionic-native/camera';
import { normalizeURL } from 'ionic-angular';
import { NatureView } from '../../models/NatureView.model';
import { NatureViewService } from '../../services/natureView.service';


@Component({
  selector: 'page-new-view',
  templateUrl: 'new-view.html',
})
export class NewViewPage implements OnInit {

  natureViewForm: FormGroup;
  latitude: number; 
  longitude: number; 
  imageUrl: string;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController, public modalCtrl: ModalController, public camera: Camera, public toastCtrl: ToastController, public natureViewService: NatureViewService) {
  }

  ngOnInit(){
    this.initForm();
  }

  initForm(){
    this.natureViewForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required], 
      description: ['']
    });
  }

  onSubmitForm() {
      let newView = new NatureView(
        this.natureViewForm.get('name').value, 
        new Date(), 
        this.natureViewForm.get('description').value, 
        this.latitude, 
        this.longitude, 
        this.imageUrl
      );
      this.natureViewService.addNatureView(newView);
      this.navCtrl.pop;
  }

  onOpenCoordsModal(){
    let modal: Modal; 
    if (this.latitude){
      modal = this.modalCtrl.create(
        SetCoordinatesPage
      );
      modal.present();
      modal.onDidDismiss(
        (data) => {
          if(data){
          this.latitude = data.latitude;
          this.longitude = data.longitude;
          }
        }
      );
    }
  }

  onTakePhoto() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }).then(
      (data) => {
        if (data) {
          this.imageUrl = normalizeURL(data);
        }
      }
    ).catch(
      (error) => {
        this.toastCtrl.create({
          message: error.message,
          duration: 3000,
          position: 'bottom'
        }).present();
      }
    )
  }


}
