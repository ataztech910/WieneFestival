import { Subscription } from 'rxjs/Subscription';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProgrammService } from '../home/home.service';

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
  providers:[
    ProgrammService
  ]
})
export class ItemPage {
  loading: boolean;
  content: any;
  subscription: Subscription;  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private homeSrvice: ProgrammService) {
    let itemId = navParams.get('itemId');
    console.log("itemId",itemId);

      this.loading = true;          
      this.subscription = homeSrvice.getItem(itemId).subscribe(
      state => {
        
        
        this.content = state;
        console.log("Title", this.content);
        this.loading = false;
        
    });  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemPage');
  }

}
