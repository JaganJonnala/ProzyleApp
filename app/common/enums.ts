export enum PropertyType {
    Land = 1,
    Residential = 2,
    Commercial = 3,
};
export enum TaskType {
    Verification = 1,
    Inspection = 2
}
export enum TaskStatus {
    Assigned = 1,
    InProgress = 2,
    Review = 3,
    Completed = 4,
    DeclinedByCustomer = 5,
    UnderCustomerReview = 6,
    Cancelled
}
export interface ValuePair {
    id: number,
    name: string
}
export class EnumEx {

    static getNames(e: any) {
        return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
    }

    static getValues(e: any) {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static getNamesAndValues(e: any): Array<ValuePair> {
        return EnumEx.getValues(e).map(v => { return { id: v, name: e[v] as string }; });
    }
}

export enum DBOperation {
    unknown = 0, contains = 1, doesNotContain = 2, startsWith = 3, endsWith = 4,
    equalTo = 5, notEqualTo = 6, greaterThan = 7, greaterThanOrEqualTo = 8,
    lessThan = 9, lessThanOrEqualTo = 10, in = 11, notIn = 12, isNULL = 13,
    isNotNull = 14, dateEqual = 15, dateNotEqual = 16, dateGreaterThan = 17,
    dateGreaterThanOrEqual = 18, dateLessThan = 19, dateLessThanOrEqual = 20, orderBy = 21,
    doesNotStartsWith = 22, doesNotEndsWith = 23
};
export enum SortOperation {
    none = 0, ascending = 1, descending = 2
};
export enum LogicalOperation {
    none = 0, and = 1, or = 2
};
export enum PairOperation {
    none = 0, open = 1, close = 2
}