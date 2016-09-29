export interface IConfig {
    apiBaseUrl:string
    baseUrl: string;
    apiPrefix: string;
}
// declare var ENV: string;
export class BaseConfig {
    _current: IConfig;
    ENV : string
    get current(): IConfig {
        return this._current;
    };
    constructor() {
        this.ENV="test";

        let url = 'http://web.xavica.local/wpweb/',
            marketingUrl = "http://web.xavica.local/prozyle/";
        if (this.ENV === "test") {
            url = "http://test.wpapi.xavica.com/";
            marketingUrl = "http://test.prozyle.xavica.com/";
        }
        else if (this.ENV === "production") {
            url = "http://test.wpapi.xavica.com/";
            marketingUrl = "http://prozyle.com/";
        }
        this._current = {

            baseUrl: '/',
            apiBaseUrl: url,
            apiPrefix:'api/'
        };
    }
}