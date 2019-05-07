import { ProgrammService } from './home.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { ItemPage } from '../item/item';
import { MapPage } from '../map/map';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[
    ProgrammService
  ]
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  item: ItemPage;

  subscription: Subscription;  
  cards: any;
  loading: boolean;

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }
  ngAfterViewInit(): void {
    // throw new Error("Method not implemented.");
  }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }
//----------------------------------------------------------------------------------
showItemPage(item) {
    this.navCtrl.push(ItemPage,{
      itemId: item
    });
}

showMap(){
   this.navCtrl.push(MapPage);
}
//---------------------------------------------------------------------------------  
  constructor(public navCtrl: NavController,
              private homeSrvice: ProgrammService
              ) {
      this.loading = true;    
       this.cards = [];      
      this.subscription = homeSrvice.getProgram().subscribe(
      state => {
        
        console.log("Result", state);
        this.cards = state;
        this.loading = false;
        
    });          

  }

}
