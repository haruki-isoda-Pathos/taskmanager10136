import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface History {
    taskId: string;
    taskTitle: string;
  
    action:
      | 'create'
      | 'edit'
      | 'delete'
      | 'status'
      | 'deadline';
  
    detail: string;
  
    createdAt: Date;
  }

@Injectable({ providedIn: 'root' })
export class HistoryService {

    private histories: History[] = [] 

    private subject = new BehaviorSubject<History[]>(this.histories);
    histories$ = this.subject.asObservable();

    addHistory(history: History) {
        this.histories.unshift(history)
        this.subject.next(this.histories);
      }

    clearHistories() {
        this.histories = [];
        this.subject.next(this.histories);
      }

}