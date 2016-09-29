import "reflect-metadata";
import {nativeScriptBootstrap} from "nativescript-angular/application";
import {HTTP_PROVIDERS} from "@angular/http";
import {AppComponent} from "./app-component";
import {APP_ROUTER_PROVIDERS} from "./app-routes";
import connectivity = require("connectivity");
import dialogs = require("ui/dialogs");
import {ApplicationStateService} from './application-state-service';
import {CustomValidations} from "./common/validations";
import {BaseConfig} from './base-config';
import {TaskStatusPipe} from "./common/converters/task-status-pipe";
import {TaskTypePipe} from "./common/converters/task-type-pipe";
import {DateDateMonthYearValueConverter} from "./common/converters/date-pipe";
import { NS_HTTP_PROVIDERS } from "nativescript-angular/http";
import {CouchGlobal} from './common/global';
import {LoginService, PropertyService, AssignmentService, PropertyAssetService} from './services';

nativeScriptBootstrap(AppComponent, [CouchGlobal, HTTP_PROVIDERS, NS_HTTP_PROVIDERS,
    APP_ROUTER_PROVIDERS,
    CustomValidations,
    ApplicationStateService,
    LoginService, PropertyService, AssignmentService, PropertyAssetService,
    BaseConfig, TaskStatusPipe,
    TaskTypePipe, DateDateMonthYearValueConverter,
], { startPageActionBarHidden: false });
