import {Component} from "@angular/core";
import {Router} from "@angular/router";
import connectivity = require("connectivity");
import dialogs = require("ui/dialogs");

@Component({
    selector: "sfhfhsj",
    templateUrl: "./connectivity/connectivity.html"
})
export class ConnectivityPage {
    connectionType: number;
    constructor(private _router: Router) {
        console.log("Getting Connection wait........");
    }
    submit() {
        // console.log("connection Type None", connectivity.connectionType.none);
        // console.log("connection Type WIFI", connectivity.connectionType.wifi);
        // console.log("connection Type Mobile Data", connectivity.connectionType.mobile);
        this.connectionType = connectivity.getConnectionType();

        if (this.connectionType === connectivity.connectionType.wifi) {
            var options = {
                title: "Connection Information",
                message: "You are on wifi Now",
                okButtonText: "OK"
            };
            // dialogs.alert(options).then(() => {
            //     console.log("You are on wifi Now!");
            // });
            console.log("The Current Connection is WIFI");
        }
        else if (this.connectionType === connectivity.connectionType.mobile) {
            var options = {
                title: "Connection Information",
                message: "You are on Mobile Network Now",
                okButtonText: "OK"
            };
            // dialogs.alert(options).then(() => {
            //     console.log("You are on Mobile Network Now!");
            // });
            console.log("The Current Connection is Mobile");
        }
        else {
            var options = {
                title: "Connection Information",
                message: "No internet",
                okButtonText: "OK"
            };
            // dialogs.alert(options).then(() => {
            //     console.log("No internet!");
            // });
            console.log("The Current Connection is None");
        }
        // console.log("connection Type", this.connectionType);

        // var connectionType = connectivity.getConnectionType();
        // console.log("connection Type", connectionType);

        // switch (connectionType) {
        //     case connectivity.connectionType.none:
        //         console.log("No connection");
        //         break;
        //     case connectivity.connectionType.wifi:
        //         console.log("WiFi connection");
        //         break;
        //     case connectivity.connectionType.mobile:
        //         console.log("Mobile connection");
        //         break;
        // }
    }
}
connectivity.startMonitoring(function onConnectionTypeChanged(newConnectionType: number) {

    switch (newConnectionType) {

        case connectivity.connectionType.none:
            var options = {
                title: "Connection Changed",
                message: "No internet",
                okButtonText: "OK"
            };
            // dialogs.alert(options).then(() => {
            //     console.log("No internet!");
            // });
            console.log("Connection type changed to none.");
            break;
        case connectivity.connectionType.wifi:
            var options = {
                title: "Connection Changed",
                message: "You are on wifi Now",
                okButtonText: "OK"
            };
            // dialogs.alert(options).then(() => {
            //     console.log("You are on wifi Now!");
            // });
            console.log("Connection type changed to WiFi.");
            break;
        case connectivity.connectionType.mobile:
            var options = {
                title: "Connection Changed",
                message: "You are on Mobile Network Now",
                okButtonText: "OK"
            };
            // dialogs.alert(options).then(() => {
            //     console.log("You are on Mobile Network Now!");
            // });
            console.log("Connection type changed to mobile.");
            break;
    }
});
//...
connectivity.stopMonitoring();