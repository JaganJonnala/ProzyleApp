import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "dateConverter" })
export class DateDateMonthYearValueConverter {
    transform(value: string, args: string[]): any {
        var givenDate = new Date(value);
        var dd: string = givenDate.getDate().toString();
        var mm: string = (givenDate.getMonth() + 1).toString(); //January is 0!

        var yyyy = givenDate.getFullYear();
        if (+dd < 10) {
            dd = '0' + dd
        }
        if (+mm < 10) {
            mm = '0' + mm
        }
        var dateContext = dd + '/' + mm + '/' + yyyy;
        return dateContext;
    }
}
