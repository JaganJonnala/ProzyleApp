import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { BaseService } from './base-service';
import { Http, Headers, RequestOptions, Response, Request } from '@angular/http';
import {ApplicationStateService} from './../application-state-service';
import {BaseConfig, IConfig} from './../base-config';

@Injectable()
export class UserService extends BaseService {

  constructor(protected http: Http,
        protected appStateService: ApplicationStateService,
        protected baseConfig: BaseConfig
        ) {
        super(http, appStateService, baseConfig, 'user');
        
    }
   
  
}
