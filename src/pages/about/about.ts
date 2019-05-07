import { Subscription } from 'rxjs/Subscription';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProgrammService } from '../home/home.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers:[
    ProgrammService
  ]
})
export class AboutPage {
  subscription: Subscription;  
  content:any;
  constructor(public navCtrl: NavController,
              private homeSrvice: ProgrammService) {

    this.subscription = homeSrvice.getAbout().subscribe(
      state => {
        this.content = state;
        console.log("Title", this.content);        
    });           

  }

}
