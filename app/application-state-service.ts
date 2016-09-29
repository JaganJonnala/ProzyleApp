import {Injectable} from '@angular/core';
import {CheckList, PropertyAsset, Assignment} from './models';
@Injectable()
export class ApplicationStateService {
    // isEdit: boolean;
    userId: string;
    // token: string;
    // name: string;
    approvalStatusId: number;
    assignmentId: number;
    assets: Array<PropertyAsset>;
    propertyTypeId: number;
    metaCheckList: Array<CheckList>;
    currentTask: Assignment;
}