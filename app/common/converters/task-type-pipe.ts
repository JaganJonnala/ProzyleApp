import {TaskType} from './../enums';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'taskType'})

export class TaskTypePipe {
     transform(value: string, args: string[]): any {
        return TaskType[value];
    }
}






