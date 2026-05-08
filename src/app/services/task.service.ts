import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

export interface Board {
  todo: Task[];
  pending: Task[];
  doing: Task[];
  done: Task[];
}

@Injectable({ providedIn: 'root' })
export class TaskService {

  private board: Board = {
    todo: [],
    pending: [],
    doing: [],
    done: []
  };

  private subject = new BehaviorSubject<Board>(this.board);
  board$ = this.subject.asObservable();

  addTask(task: Task) {
    this.board.todo.push(task);
    this.subject.next(this.board);
  }

  updateBoard(board: Board) {
    this.board = board;
    this.subject.next(this.board);
  }
}