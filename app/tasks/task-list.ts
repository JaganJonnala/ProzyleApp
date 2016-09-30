import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AssignmentService, PropertyAssetService} from './../services';
import {DateDateMonthYearValueConverter} from './../common/converters/date-pipe';
import {TaskStatusPipe} from './../common/converters/task-status-pipe';
import {TaskTypePipe} from './../common/converters/task-type-pipe';
import * as moment from 'moment';
import {TaskStatus, DBOperation, LogicalOperation, SortOperation, PairOperation} from './../common/enums';
import {ApplicationStateService} from './../application-state-service';
import {Filter, PagedParams} from '../models/paged-params';
import {PropertyAsset, Assignment} from '../models';
import {CouchGlobal} from "./../common/global";
// import * as enums from './../common/enums';
import {RouterExtensions as TNSRouterExtensions} from 'nativescript-angular/router/router-extensions';
import { getString, setString, remove } from "application-settings";

@Component({
    selector: "list",
    templateUrl: "tasks/task-list.html",
    styleUrls: ["tasks/task-list.css"],
    viewProviders: [AssignmentService],
    providers: [PropertyAssetService],
    pipes: [DateDateMonthYearValueConverter, TaskStatusPipe, TaskTypePipe]

})
export class TaskListViewModel {
    details: Array<Assignment>;
    countString: string;
    constructor(private router: Router,
        private assignmentService: AssignmentService,
        private propertyAssetService: PropertyAssetService,
        private applicationStateService: ApplicationStateService,
        private global: CouchGlobal,
        private routerExtensions: TNSRouterExtensions) {
        // this.details = [
        //     { id: "11", date: "21-5-2016", status: "Assign" },
        //     { id: "24", date: "24-9-2016", status: "InProgress" },
        //     { id: "38", date: "28-10-2016", status: "Assign" },
        //     { id: "20", date: "12-10-2016", status: "InProgress" },
        //     { id: "35", date: "28-9-2016", status: "Assign" }
        // ];
        this.details = [];
    }
    ngOnInit() {
        // console.log('FROM ngOnInit() Task List Page', this.applicationStateService.userId);
        let todayDate = new Date();
        let date = moment(todayDate).format('MM-DD-YYYY');
        // console.log("UserId", this.applicationStateService.userId);
        // console.log(TaskStatus.Assigned);
        // console.log(TaskStatus.InProgress);
        this.assignmentService.getAssignmentsByUserId(date, [TaskStatus.Assigned, TaskStatus.InProgress], +this.applicationStateService.userId).subscribe((assignments) => {
            this.details = assignments;
            // console.log("Length", this.details.length);

        }),
            () => {
                console.log("Failed to Get Assignments");
            };
        // this.details = this.global.getSavedTasks();
    }

    gotoTask(assignmentId, approvalStatusId, taskTypeId, propertyTypeId, taskStatusId) {
        console.log("Task Assets Page Navigation ................");
        let pagedParams: PagedParams = new PagedParams(0, 0, [
            new Filter("assignmentId", assignmentId, DBOperation.equalTo, LogicalOperation.none, SortOperation.none),
        ]);

        this.propertyAssetService.getPropertyAssets(pagedParams).subscribe((assets) => {
            if (assets.length > 0) {
                this.applicationStateService.approvalStatusId = approvalStatusId;
                this.applicationStateService.assignmentId = assignmentId;
                this.applicationStateService.assets = assets;
                this.applicationStateService.propertyTypeId = propertyTypeId;
                // this.router.navigate(["/Task"]);
                this.routerExtensions.navigate(["/Task"], {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 180,
                        curve: "easeIn"
                    }
                });
            }
            else {
                alert("No records found Something went wrong please contact with Support members");
            }
        }),
            () => {
                console.log("Some Error oocured");
            };

    }
    // gotoTask(taskId) {
    //     this.applicationStateService.currentTask = this.details.filter((task) => {
    //         return taskId == task.id;
    //     })[0];
    // }
    logout() {
        remove("userId");
        remove("token");
        this.applicationStateService.userId = "0";
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 180,
                curve: "easeIn"
            }
        });
    }
}
