import { Subscription } from 'rxjs/Subscription';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProgrammService } from '../home/home.service';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers:[
    ProgrammService
  ]  
})
export class ContactPage {
  subscription: Subscription;  
  content:any;
  constructor(public navCtrl: NavController,
              private homeSrvice: ProgrammService) {

    this.subscription = homeSrvice.getSponsors().subscribe(
      state => {
        this.content = state;
        console.log("Title", this.content);        
    });  
  }

}
