import {TaskStatus} from './../enums';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'taskStatus' })
export class TaskStatusPipe {
    transform(value: string, args: string[]): any {
        return TaskStatus[value];
    }
}


