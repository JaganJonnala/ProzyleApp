import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {LoginService} from './../services';
import { getString, setString } from "application-settings";
import {ApplicationStateService} from './../application-state-service';
import { connectionType, getConnectionType } from "connectivity";
import {CouchGlobal} from "./../common/global";
import {CustomValidations} from "./../common/validations";
var couchbaseModule = require("nativescript-couchbase");
import {RouterExtensions as TNSRouterExtensions} from 'nativescript-angular/router/router-extensions';
import {Page} from "ui/page";
var nstoasts = require("nativescript-toasts");

@Component({
  selector: "my-app",
  templateUrl: "./login/login.html",
  styleUrls: ["./login/login.css"],
  providers: [LoginService]
})
export class LoginViewModel {
  username: string = "jaganjvvn@gmail.com";
  // username: string = "devfa@dev.com";
  password: string = "Test@123";
  database: any;
  validationStatus: boolean = false;
  isLoading: boolean = false;
  validationMessage: string;
  constructor(private page: Page, private router: Router,
    private loginService: LoginService,
    private applicationStateService: ApplicationStateService,
    private global: CouchGlobal, private customValidations: CustomValidations,
    private routerExtensions: TNSRouterExtensions) {
  }
  ngOnInit() {
    this.page.actionBarHidden = true;
    if (getString("token")) {
      this.applicationStateService.userId = getString("userId");
      this.router.navigate(["/Task-List"]);
    }
  }
  validate() {
    let isValid = true;

    if (this.username.length <= 0) {
      isValid = false;
      nstoasts.show({
        text: "Email ID Required",
      });
    }
    else {
      if (!this.customValidations.isValidEmail(this.username)) {
        isValid = false;
        nstoasts.show({
          text: "Valid Email ID Required",
        });
      }
    }
    return isValid;
  }
  signIn() {
    if (getConnectionType() === connectionType.none) {
      nstoasts.show({
        text: "No Internet Connection",
      });
      return;
    }

    if (this.validate()) {
      this.loginService.login(this.username, this.password).subscribe((result: any) => {
        setString("token", result.access_token);
        setString("userId", result.Id);
        this.applicationStateService.userId = result.Id;
        this.routerExtensions.navigate(["/Task-List"], {
          clearHistory: true,
          animated: true,
          transition: {
            name: "slide",
            duration: 180,
            curve: "easeIn"
          }
        });
      },
        () => {
          nstoasts.show({
            text: "user doesn't exists",
          });
        });
    }
  }
}

