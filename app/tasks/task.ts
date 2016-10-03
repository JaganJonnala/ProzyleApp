import {Component, OnInit} from "@angular/core";
import {Page} from "ui/page";
import {Router} from "@angular/router";
import cameraModule = require("camera");
import {PropertyService} from './../services';
import {getString, setString} from 'application-settings';
import {ApplicationStateService} from './../application-state-service';
import {CheckList, CheckListCategory} from '../models/checklist';
import {RouterExtensions as TNSRouterExtensions} from 'nativescript-angular/router/router-extensions';
import {PropertyType} from './../common/enums';
import { GestureEventData } from "ui/gestures";
import dialogs = require("ui/dialogs");
var imagepicker = require("nativescript-imagepicker");
var fs = require("file-system");
var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

@Component({
    selector: "list",
    templateUrl: "tasks/task.html",
    styleUrls: ["tasks/task.css"],
    providers: [PropertyService]
})
export class TaskViewModel {
    item: any;
    items: Array<any> = [];
    checkListType: Array<CheckList> = [];
    inspectionEntity: Array<string> = [];
    currentIndex: number = 0;
    localImagePath: string;
    imageTapStatus: boolean = false;
    secondTapStatus: boolean;
    checklists: Array<CheckListCategory> = [];
    countString: string = "";
    public counter: number = 16;
    public binaryThumb: any;

    constructor(private page: Page, private propertyService: PropertyService,
        private applicationStateService: ApplicationStateService,
        private routerExtensions: TNSRouterExtensions) {
        this.item = {};
        this.items = [];
    }
    ngOnInit() {
        console.log("nogonit loaded");
        return this.propertyService.getCheckList().subscribe(checklists => {
            this.checkListType = checklists.filter((checklist) => {
                return checklist.propertyTypeId == this.applicationStateService.propertyTypeId;
            });
            this.inspectionEntity = this.applicationStateService.propertyTypeId === PropertyType.Land
                ? ["Inspected", "Not Inspected", "Good", "Damaged", "Yes", "No"]
                : ["Inspected", "Not Inspected", "Good", "Damaged"];
            this.items = this.getData();
            this.item = this.items[this.currentIndex];
            this.checkListItemCount();
        });
    }
    onchange(selectedi) {
        console.log("selected index " + selectedi);
        this.items[this.currentIndex].inspectedValue = this.inspectionEntity[selectedi];
    }
    changeRemarks() {
        this.items = this.getData();
        this.currentIndex = 0;
        this.item = this.items[this.currentIndex];
    }
    getData() {
        var rawData = this.applicationStateService.assets;
        return this.mapToLocalData(rawData);
    }
    mapToLocalData(rawData: any) {
        let mappedCategories = this.checkListType[0].categories.reduce((result, category) => {
            let inputIds = rawData.map(item => item.checkListitemId);
            let tempIds = category.items.map(item => item.id);
            let b = new Set(tempIds);
            let intersection = new Set(inputIds.filter(x => b.has(x)));
            let resultIds = [];
            intersection.forEach((item) => {
                resultIds.push(item);
            });
            if (resultIds && resultIds.length) {
                let finalSubscriptions = resultIds.reduce(function (result, itemId) {
                    let items = rawData.filter(function (inputItem) {
                        return inputItem.checkListitemId === itemId;
                    });
                    if (items.length) {
                        result.push(...items);
                    }
                    return result;
                }, []);
                let startValue = 0, startItemId = 0;
                let mappedItems = finalSubscriptions.map((subscription, index) => {

                    let lookupChecklistItem = category.items.filter(function (categoryItem) {
                        return categoryItem.id === subscription.checkListitemId;
                    })[0];
                    let temp = finalSubscriptions.filter((mainSubscription) => {
                        return mainSubscription.checkListitemId == subscription.checkListitemId;
                    });
                    if (temp.length === 1) {
                        startValue = 0;
                        startItemId = subscription.checkListitemId;
                    }
                    else if (startItemId != subscription.checkListitemId) {
                        startValue = 1;
                        startItemId = subscription.checkListitemId;
                    }
                    else {
                        startValue++;
                    }
                    let checklistItemName = lookupChecklistItem.name;
                    if (startValue) {
                        checklistItemName = checklistItemName + " " + startValue;
                    }
                    // let isBlock = false;
                    // if (taskStatus === enums.TaskStatus.InProgress
                    //     && taskType === enums.TaskType.Inspection
                    //     && approvalStatus === enums.ApprovalStatus.Rejected
                    //     && subscription.propertyImageUrl) {
                    //     isBlock = true;
                    // }
                    return {
                        "id": subscription.id,
                        "checkListItemId": subscription.checkListitemId,
                        "checkListItemName": checklistItemName,
                        'assignmentId': subscription.assignmentId,
                        'remarks': subscription.remarks,
                        'reviewComments': subscription.reviewComments,
                        'propertyImageUrl': subscription.propertyImageUrl,
                        'localImagePath': subscription.propertyImageUrl,
                        'inspectedValue': subscription.inspectedValue,
                        'dataEntryType': lookupChecklistItem.dataEntryType,
                        // 'isBlock': isBlock
                    }
                });
                result.push({
                    'categoryName': category.name,
                    'items': mappedItems
                });
            }
            return result;
        }, []);

        let results = mappedCategories.reduce(function (result, checkList) {
            result.push(...checkList.items);
            return result;
        }, []);
        return results;
    }
    mapToServerData(cookedData) {
        return cookedData;
    }
    save() {
        let results = this.mapToServerData(this.items);
        let subsmissionIndex = [];
        this.items.forEach((element, index) => {
            if (element.localImagePath === '' && element.inspectedValue === '') {
                console.log("Item Index is", index);
                subsmissionIndex.push(index);
            }
        });
        console.log("Saved Items ", JSON.stringify(subsmissionIndex));
        if (subsmissionIndex.length > 0) {
            this.currentIndex = subsmissionIndex[0];
            this.item = this.items[this.currentIndex];
            this.checkListItemCount();
            nstoasts.show({
                text: "Please fill required data",
            });
        }
        console.log("Saved Items ", JSON.stringify(results));
    }
    move(index) {
        this.currentIndex = this.currentIndex + index;
        if (this.currentIndex < 0) {
            this.currentIndex = this.items.length - 1;
        }
        if (this.currentIndex === this.items.length) {
            this.currentIndex = 0;
        }
        this.item = this.items[this.currentIndex];
        this.checkListItemCount();
    }
    onLongPress(args: GestureEventData) {
        console.log("LongPress!")
        dialogs.action({
            actions: ["Remove", "Cancel"]
        }).then(result => {
            console.log("result", result);
            if (result == "Remove") {
                this.items[this.currentIndex].localImagePath = '';
            }
        });
    }
    onTap(args: GestureEventData) {
        console.log("ontap called");
        if (!this.imageTapStatus) {
            this.imageTapStatus = true;
            this.secondTapStatus = false;
        }
        else {
            this.secondTapStatus = true;
            this.imageTapStatus = false;
        }
    }

    takePicture() {
        cameraModule.takePicture().then(picture => {
            console.log("Result is an image source instance");
            var folder = fs.knownFolders.documents();
            var path = fs.path.join(folder.path, "Test.png");
            var saved = picture.saveToFile(path, enums.ImageFormat.png);
        });
        this.displayPicture();
    }
    displayPicture() {
        var folder = fs.knownFolders.documents();
        var path = fs.path.join(folder.path, "Test.png");
        this.items[this.currentIndex].localImagePath = path;
    }
    selectImages() {
        var context = imagepicker.create({
            mode: "single"
        });
        context
            .authorize()
            .then(function () {
                return context.present();
            })
            .then((selection) => {
                console.log("Selection done:");
                selection.forEach(function (selected) {
                    console.log(" - " + selected.uri);
                });
                this.items[this.currentIndex].localImagePath = selection[0].thumb;
            }).catch(function (e) {
                console.log(e);
            });
    }
    checkListItemCount() {
        this.countString = `${this.currentIndex + 1} / ${this.items.length}`;
        console.log("checklistItemcount", this.countString);
    }
    navigate() {
        this.routerExtensions.navigate(["/Task-List"]);
    }
}