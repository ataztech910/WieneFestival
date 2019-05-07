import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ShredService } from './../../app/shared.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class ProgrammService extends ShredService{
    private programmUrl = "http://www.vmff.ru/mobile-api/?command=getlist";
    private itemUrl = "http://vmff.ru/mobile-api/?command=getone&id=";
    private aboutUrl = "http://vmff.ru/mobile-api/?command=about";
    private sponsorsUrl = "http://vmff.ru/mobile-api/?command=sponsors";
    constructor(
        private http: Http,
    ){
        super();
    }
//------------------------------------------------------   
  getProgram(): Observable<any> {
    return this.http.get(this.programmUrl)
      // .map(this.extractData)
      .debounceTime(300)
      .distinctUntilChanged()
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }
//------------------------------------------------------   
   getItem(id): Observable<any> {
    return this.http.get(this.itemUrl+id)
      // .map(this.extractData)
      .debounceTime(300)
      .distinctUntilChanged()
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }  
//------------------------------------------------------
    getAbout(): Observable<any> {
    return this.http.get(this.aboutUrl)
      // .map(this.extractData)
      .debounceTime(300)
      .distinctUntilChanged()
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }
//------------------------------------------------------   
    getSponsors(): Observable<any> {
    return this.http.get(this.sponsorsUrl)
      // .map(this.extractData)
      .debounceTime(300)
      .distinctUntilChanged()
      .map((res:Response) => res.json())
      .catch(this.handleError);
  } 
}