import {PropertyType} from './../enums';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'propertyType'})

export class PropertyTypePipe {
  transform(value: string, args: string[]): any {
        return PropertyType[value];
    }
}

