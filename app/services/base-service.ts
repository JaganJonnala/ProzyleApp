
import {Observable} from 'rxjs/Rx';
import { Http, Headers, RequestOptions, Response, Request } from '@angular/http';
//import { environment } from './../app/';
import { Injectable } from '@angular/core';
import {ApplicationStateService} from './../application-state-service';
import {BaseConfig, IConfig} from './../base-config';
import { getString, setString } from "application-settings";


@Injectable()
export class BaseService {
    config: IConfig;

    constructor(protected http: Http,
        protected appStateService: ApplicationStateService,
        protected baseConfig: BaseConfig,
        private controller: string
    ) {
        this.config = this.baseConfig.current;
    }


    protected get(action: string = '', options?: RequestOptions): Observable<any> {
        let url = this.getUrl(action);
        options = this.getRequiredOptions(options);
        return this.mapObservable(this.http.get(url, options));
    }

    protected post(action: string = '', body: string, options?: RequestOptions): Observable<any> {
        options = this.getRequiredOptions(options);
        let url = this.getUrl(action);
        return this.mapObservable(this.http.post(url, body, options));
    }

    protected put(action: string = '', body: string, options?: RequestOptions): Observable<any> {
        options = this.getRequiredOptions(options);
        let url = this.getUrl(action);
        return this.mapObservable(this.http.put(url, body, options));
    }

    protected delete(action: string = '', options?: RequestOptions): Observable<any> {
        options = this.getRequiredOptions(options);
        let url = this.getUrl(action);
        return this.mapObservable(this.http.delete(url, options));
    }

    protected patch(action: string = '', body: string, options?: RequestOptions): Observable<any> {
        options = this.getRequiredOptions(options);
        let url = this.getUrl(action);
        return this.mapObservable(this.http.patch(url, body, options));
    }

    protected head(action: string = '', options?: RequestOptions): Observable<any> {
        options = this.getRequiredOptions(options);
        let url = this.getUrl(action);
        return this.mapObservable(this.http.head(url, options));
    }

    protected request(url: string | Request, options?: RequestOptions): Observable<any> {
        options = this.getRequiredOptions(options);
        return this.mapObservable(this.http.request(url, options));
    }

    private getRequiredOptions(options: RequestOptions) {
        options = options || new RequestOptions();

        options.headers = options.headers || new Headers({ 'Content-Type': 'application/json' });
        let token = getString("token");
        if (token) {
            options.headers.append("Authorization", `Bearer ${token}`);
        }
        return options;

    }

    protected mapObservable(observable: Observable<Response>): Observable<any> {
        return observable.map(response => {
            let bodyData = {};
            if (response.status >= 200 && response.status < 400
                && response.text()) {
                bodyData = response.json();
            }
            //any time want to see actual response then use response.status.
            //to avoid mapping in all service methods we are sending only needed information from base service.
            //return { status: response.status, data: bodyData };
            return bodyData;

        });
    }

    protected getUrl(action): string {
        action = action || '';
        let controller = this.controller && `${this.controller}/` || '';
        return `${this.config.apiBaseUrl}${this.config.apiPrefix}${controller}${action}`;

    }
}


