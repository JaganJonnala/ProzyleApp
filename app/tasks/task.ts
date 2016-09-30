import {Component, OnInit} from "@angular/core";
import {Page} from "ui/page";
import {Router} from "@angular/router";
import cameraModule = require("camera");
import {PropertyService} from './../services';
import {ApplicationStateService} from './../application-state-service';
import {CheckList, CheckListCategory} from '../models/checklist';
import {PropertyType} from './../common/enums';
import { GestureEventData } from "ui/gestures";
import dialogs = require("ui/dialogs");
var fs = require("file-system");
var enums = require("ui/enums");

@Component({
    selector: "list",
    templateUrl: "tasks/task.html",
    styleUrls: ["tasks/task.css"],
    providers: [PropertyService]
})
export class TaskViewModel {
    localImagePath: string;
    imageTapStatus: boolean = false;
    secondTapStatus: boolean;
    checklists: Array<CheckListCategory> = [];
    items: Array<any> = [];
    inspectionEntity: Array<string> = [];
    item: any;
    countString: string = "";
    currentIndex: number = 0;
    checkListType: Array<CheckList> = [];
    constructor(private page: Page,private router:Router, private propertyService: PropertyService,
        private applicationStateService: ApplicationStateService) {
    }
    ngOnInit() {
        return this.propertyService.getCheckList().subscribe(checklists => {
            this.checkListType = checklists.filter((checklist) => {
                return checklist.propertyTypeId == this.applicationStateService.propertyTypeId;
            });
            this.customMapping();
            this.inspectionEntity = this.applicationStateService.propertyTypeId === PropertyType.Land
                ? ["Inspected", "Not Inspected", "Good", "Damaged", "Yes", "No"]
                : ["Inspected", "Not Inspected", "Good", "Damaged"];
            this.setItem();
        });
    }
    customMapping() {
        let input = this.applicationStateService.assets;
        // console.log("assets,", JSON.stringify(input));
        let mappedCategories = this.checkListType[0].categories.reduce((result, category) => {
            let inputIds = input.map(item => item.checkListitemId);
            let tempIds = category.items.map(item => item.id);
            let b = new Set(tempIds);
            let intersection = new Set(inputIds.filter(x => b.has(x)));
            let resultIds = [];
            intersection.forEach((item) => {
                resultIds.push(item);
            });
            if (resultIds && resultIds.length) {
                let finalSubscriptions = resultIds.reduce(function (result, itemId) {
                    let items = input.filter(function (inputItem) {
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
                        'inspectedValue': subscription.inspectedValue,
                        'dataEntryType': lookupChecklistItem.dataEntryType,
                        // 'isBlock': isBlock
                    }
                });
                result.push({
                    'categoryName': category.name,
                    'items': mappedItems
                    // 'items': mappedItems.forEach(function (mappedItem) {
                    //     mappedItem.checkListCategoryName = category.name;
                    // })
                });
            }
            return result;
        }, []);

        this.items = mappedCategories.reduce(function (result, checkList) {
            result.push(...checkList.items);
            return result;
        }, []);
        // console.log("Final Assets", JSON.stringify(this.items));
        // this.items = mappedCategories[0].items;
        // this.items = this.items.concat(mappedCategories[1].items);
    }
    setItem() {
        this.item = this.items[this.currentIndex];
        this.checkListItemCount();
    }
    back() {
        if (this.currentIndex === 0) {
            this.currentIndex = this.items.length - 1;
        }
        else {
            this.currentIndex--;
        }
        this.setItem();
    }
    forward() {
        if (this.currentIndex === this.items.length - 1) {
            this.currentIndex = 0;
            this.setItem();
        }
        else {
            this.currentIndex++;
        }
        this.setItem();
    }
    onLongPress(args: GestureEventData) {
        console.log("LongPress!")
        dialogs.action({
            actions: ["Remove", "Cancel"]
        }).then(result => {
            console.log("result", result);
            if (result == "Remove") {
                this.localImagePath = "";
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
        this.localImagePath = path;
    }
    checkListItemCount() {
        this.countString = `${this.currentIndex + 1} / ${this.items.length}`;
        console.log("checklistItemcount", this.countString);
    }
    navigate(){
        this.router.navigate(["/Task-List"]);
    }
}