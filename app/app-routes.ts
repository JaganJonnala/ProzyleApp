import {RouterConfig} from "@angular/router";
import {nsProvideRouter} from "nativescript-angular/router";
import {LoginViewModel} from "./login/login";
import {TaskListViewModel} from "./tasks/task-list";
import {TaskViewModel} from "./tasks/task";
import {ConnectivityPage} from "./connectivity/connectivity";

export const routes: RouterConfig = [
  { path: "", component: LoginViewModel },
  { path: "Task-List", component: TaskListViewModel },
  { path: "Task", component: TaskViewModel },
  { path: "connectivity", component: ConnectivityPage }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, {})
];