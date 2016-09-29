import { Injectable } from '@angular/core';
import { Http, Response, ResponseOptionsArgs } from '@angular/http';
import { Observable } from "rxjs";
import { BaseService } from './base-service';
import {PropertyAsset} from './../models';
import {ApplicationStateService} from './../application-state-service';
import {BaseConfig, IConfig} from './../base-config';
import {PagedParams} from '../models/paged-params';

@Injectable()
export class PropertyAssetService extends BaseService {

    constructor(protected http: Http,
        protected appStateService: ApplicationStateService,
        protected baseConfig: BaseConfig
    ) {
        super(http, appStateService, baseConfig, 'PropertyAssets');
    }
    getPropertyAssets(pagedParamsData: PagedParams): Observable<Array<PropertyAsset>> {
        return this.post(`GetList`, JSON.stringify(pagedParamsData));
    }
}
