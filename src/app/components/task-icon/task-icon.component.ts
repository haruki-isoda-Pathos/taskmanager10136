import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HistoryService } from '../../services/history.service'
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-icon',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule   
  ],
  templateUrl: './task-icon.component.html',
  styleUrls: ['./task-icon.component.css']
})

export class TaskIconComponent {
  @Input() task!: Task;
  showHint = false;
  isDragging = false;

  constructor(
     private historyService: HistoryService
  ) {}

    onMouseEnter() {
      if (!this.isDragging) {
        this.showHint = true;
      }
    }
  
    onMouseLeave() {
      this.showHint = false;
    }
  
    onDragStart() {
      this.isDragging = true;
      this.showHint = false;
    }
  
    onDragEnd() {
      this.isDragging = false;
    }


  @Input() column!: 'todo' | 'pending' | 'doing' | 'done';

    getColor(): string {

      if (this.column === 'done') return 'default';
    
      const now = new Date().getTime();
      const due = new Date(this.task.deadline).getTime();
    
      if (now >= due) return 'red';
    
      if (this.task.notifyAfterMinutes != null) {
        const notifyTime = this.task.createdAt + this.task.notifyAfterMinutes * 60 * 1000;
        if (now >= notifyTime && now < due) return 'yellow';
      }
    
      return 'default';
    }

  @Output() taskClick = new EventEmitter<Task>();

  onClickTask() {
    this.taskClick.emit(this.task)
  }
}