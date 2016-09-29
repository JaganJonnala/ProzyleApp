import { Injectable } from '@angular/core';
import { Http, Response, ResponseOptionsArgs } from '@angular/http';
import { Observable } from "rxjs";
import { BaseService } from './base-service';
import {Assignment} from './../models';
import {TaskStatus} from './../common/enums';
import {ApplicationStateService} from './../application-state-service';
import {BaseConfig, IConfig} from './../base-config';

@Injectable()
export class AssignmentService extends BaseService {

  constructor(protected http: Http,
    protected appStateService: ApplicationStateService,
    protected baseConfig: BaseConfig
  ) {
    super(http, appStateService, baseConfig, 'assignments');

  }
  getAssignments(): Observable<Array<Assignment>> {
    return this.get();
  }

  getAssignment(id: string): Observable<Assignment> {
    return this.get(`${id}`);
  }
  getAssignmentsByUserId(date: string, taskStatus: Array<TaskStatus>, fieldAgentId: number = 0): Observable<Array<Assignment>> {
    let taskStatusString: string = "";
    taskStatus.forEach((item) => {
      taskStatusString += '&taskStatus=' + item;
    });
    let str = `GetAssignments?date=${date}${taskStatusString}&fieldAgentId=${fieldAgentId}`;
    return this.get(str);
  }
  getAssignmentByPropertyId(id: string): Observable<Assignment> {
    return this.get(`GetByPropertyId/${id}`);
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  saveAssignment(assignmentModel: Assignment): Observable<boolean> {
    // if (assignmentModel.id) {
    //   return this.put(assignmentModel.id, JSON.stringify(assignmentModel));
    // } else {
    //   let id = this.guid();
    //   assignmentModel.id = id;
    //   return this.post('', JSON.stringify(assignmentModel));
    // }
    return null;//Observable(true)
  }

  deleteAssignment(id: string): Observable<boolean> {
    return this.delete(id)
      .map(result => {
        return <boolean>!!result;
      });

  }
}
