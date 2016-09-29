import {LoginService, PropertyService, AssignmentService, PropertyAssetService} from './../services';
import {Component, Injectable} from "@angular/core";
import {ApplicationStateService} from './../application-state-service';
import {Couchbase} from 'nativescript-couchbase';
var couchbaseModule = require("nativescript-couchbase");
import * as moment from 'moment';
import { getString, setString, remove } from "application-settings";
import * as enums from './../common/enums';
import {PropertyAsset, Assignment, CheckList} from '../models';
import {Filter, PagedParams} from '../models/paged-params';

@Injectable()
export class CouchGlobal {
    database: any;
    constructor(protected propertyService: PropertyService, protected applicationStateService: ApplicationStateService,
        protected assignmentService: AssignmentService,
        protected propertyAssetService: PropertyAssetService) {
        // this.database = new couchbaseModule.Couchbase("prozyle-database");
    }
    ngOnInit() {
        this.database = new couchbaseModule.Couchbase("prozyle-database");
    }
    loadGlobal(result: any) {
        console.log("In loadGlobal Method");
        this.setLocalStorage(result);
        this.saveUser(result);
        this.loadNecessaryData();
    }
    loadNecessaryData() {
        let assignents: Array<Assignment> = this.getTasksDetails();
        this.getPropertyAssets(assignents);
        this.saveTasks(assignents);
    }
    saveUser(result: any) {
        result.entityType = "User";
        this.database.createDocument(result);
        console.log("......User Saved...............");
        this.database.createView("User", "1", function (document, emitter) {
            if (document.entityType === "User") {
                emitter.emit(document._id, document);
            }
        });
    }
    getTasksDetails(): Array<Assignment> {
        let assignments: Array<Assignment> = [];
        let todayDate = new Date();
        let date = moment(todayDate).format('MM-DD-YYYY');
        this.assignmentService.getAssignmentsByUserId(date,
            [enums.TaskStatus.Assigned, enums.TaskStatus.InProgress],
            +this.applicationStateService.userId).subscribe((assignments) => {
                assignments = assignments;
                this.getPropertyAssets(assignments);
            });
        return assignments;
    }
    saveTasks(assignments: Array<Assignment>) {
        assignments.forEach((task) => {
            this.database.createDocument(task);
        });
        console.log("......Assignments Saved...............");
        this.database.createView("Assignment", "1", function (document, emitter) {
            if (document.entityType === "Assignment") {
                emitter.emit(document._id, document);
            }
        });
    }
    getPropertyAssets(assignments: Array<Assignment>) {
        let propertyAssets: Array<PropertyAsset> = [];
        let taskIds: Array<number> = assignments.map((task) => task.id);
        let taskIdString: string = taskIds.map(function (elem) {
            return taskIds;
        }).join(",");

        let pagedParams: PagedParams = new PagedParams(0, 0, [
            new Filter("assignmentId", taskIdString, enums.DBOperation.in, enums.LogicalOperation.none,
                enums.SortOperation.none)]);
        this.propertyAssetService.getPropertyAssets(pagedParams).subscribe((assets) => {
            propertyAssets = assets;
            assignments.forEach((task) => {
                task.assets = propertyAssets.filter((asset) => {
                    return asset.assignmentId == task.id;
                });
            });
            this.saveTasks(assignments);
        });

    }
    saveCheckList(checklistArray: Array<CheckList>) {
        checklistArray.forEach((checklist) => {
            this.database.createDocument(checklist);
        });
        console.log("......Checklist Saved...............");
        this.database.createView("CheckList", "1", function (document, emitter) {
            if (document.entityType === "CheckList") {
                emitter.emit(document._id, document);
            }
        });
    }
    setLocalStorage(result) {
        let user = {
            "token": result.access_token,
            "userId": result.Id
        };
        setString("user", JSON.stringify(user));
    }
    logout() {
        remove("user");
    }
    getSavedTasks(): Array<Assignment> {
        var tasks = this.database.executeQuery("Assignment");
        return tasks;
    }


}