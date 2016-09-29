import {PropertyAsset} from '../models';
export class Assignment {
    id: number = 0;
    propertyId: number = 0;
    fieldAgentId: number = 0;
    taskType: string = "";
    taskStatus: string = "";
    propertyTitle: string = "";
    propertyAddressLine1: string = "";
    propertyAddressLine2: string = "";
    propertyAddressLine3: string = "";
    propertyAddressLine4: string = "";
    city: string = "";
    state: string = "";
    defaultFieldAgentId: number = 0;
    defaultDueDate: Date;
    taskTypeId: number = 0;
    propertyType: string = "";
    userId: number = 0;
    taskStatusId: number = 0;
    approvalStatusId: number = 0;
    fieldAgentFirstName: string = "";
    fieldAgentLastName: string = "";
    fieldAgentMobileNumber: string = "";
    createdDate: Date;
    dueDate: Date;
    lastUpdatedDate: Date;
    lastUpdatedBy: string;
    assets: Array<PropertyAsset> = [];
    entityType: string = "Assignment";
}

