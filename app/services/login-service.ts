import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { BaseService } from './base-service';
import { Http, Headers, RequestOptions, Response, Request } from '@angular/http';
import {ApplicationStateService} from './../application-state-service';
import {BaseConfig, IConfig} from './../base-config';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService extends BaseService {

    constructor(protected http: Http,
        protected appStateService: ApplicationStateService,
        protected baseConfig: BaseConfig
    ) {
        super(http, appStateService, baseConfig, '');

    }

    login(username: string, password: string): Observable<string> {
        var obj = {
            "username": username,
            "password": password,
            "gran_type": 'password'
        };
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        return this.post('Token', 'username=' + username + '&password=' + password + '&grant_type=password', options);

        //return this.get('');

    }

    // testHttp(): Observable<any>{
    //     console.log('this is testing');
    //     let headers = new Headers();
    //     headers.append("Content-Type", "application/json");

    //     return this.http.get('http://freegeoip.net/json/', { headers: headers }).map((res: Response) => {
    //         var result = res.json();
    //         console.log('result ', res);
    //         return result;
    //     }).catch(this.handleErrors);
    // }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }





}
