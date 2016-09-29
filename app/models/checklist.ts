export class CheckList {
    id: number;
    checkListItemName: string;
    checkListitemId: number;
    inspectedValue: string;
    propertyTypeId: number;
    categories: Array<CheckListCategory>;
    entityType: string = "CheckList";
}
export class CheckListCategoryMappedItems {
    id: number;
    checkListItemName: string;
    inspectedValue: string;
    remarks: string;
}
export class CheckListCategory {
    id: number;
    name: string;
    toopTip: string;
    items: Array<CheckListItem>;
}

export class CheckListItem {
    id: number;
    name: string;
    displayText: string;
    toolTip: string;
    description: string;
    descriptions: Array<{
        name: string;
        tooltip: string;
    }>;
    selectedValue: number;
    inspectedValue: string;
    propertyImageUrl: string;
    controlType: string;
    dataEntryType: string;
    cost: string;
    reviewComments: string;
}

export class PricingSubscription {
    id: number;
    type: string;
    paymentOptions: Array<PaymentOption>;
}
export class PaymentOption {
    id: number;
    name: string;
    cost: string;
    costPerCurrency: string;
}