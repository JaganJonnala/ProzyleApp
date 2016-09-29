import * as enums from './../common/enums';

export class Filter {
    modelFieldName: string = '';
    fieldValue: any = '';
    searchFieldName: string = '';
    operation: enums.DBOperation = enums.DBOperation.equalTo;
    sortBy: enums.SortOperation = enums.SortOperation.none;
    logicalOperation: enums.LogicalOperation = enums.LogicalOperation.none;
    pairOperation: enums.PairOperation = enums.PairOperation.none;
    constructor(modelFieldName: string, fieldValue: any = null, operation = enums.DBOperation.equalTo,
        logicalOperation = enums.LogicalOperation.none, sortBy = enums.SortOperation.none, pairOperation = enums.PairOperation.none,
        searchFieldName?: string) {
        this.modelFieldName = modelFieldName;
        this.searchFieldName = searchFieldName;
        this.fieldValue = fieldValue;
        this.operation = operation;
        this.sortBy = sortBy;
        this.logicalOperation = logicalOperation;
        this.pairOperation = pairOperation;
    }
}
export class PagedParams {
    pageNumber: number;
    pageSize: number;
    filters: Array<Filter>;
    constructor(pageNumber: number, pageSize: number, filters: Array<Filter>) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.filters = filters;
    }
}