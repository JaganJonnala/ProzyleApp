import { Injectable } from '@angular/core';
import { Http, Response, ResponseOptionsArgs } from '@angular/http';
import { Observable } from "rxjs";
import { BaseService } from './base-service';
import {CheckList} from './../models';
import {ApplicationStateService} from './../application-state-service';
import {BaseConfig, IConfig} from './../base-config';

@Injectable()
export class PropertyService extends BaseService {

    constructor(protected http: Http,
        protected appStateService: ApplicationStateService,
        protected baseConfig: BaseConfig
    ) {
        super(http, appStateService, baseConfig, 'Property');

    }
    getCheckList(): Observable<Array<CheckList>> {
        return this.get(`/GetCheckList`);
    }
}

