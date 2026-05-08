import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service'
import { Task } from '../../models/task.model'

@Component({
    selector: 'app-task-modal',
    standalone: true,
    imports:[CommonModule, FormsModule],
    templateUrl: './task-modal.component.html',
    styleUrls:['./task-modal.component.css']
  })

export class TaskModalComponent {

  constructor(
    private notificationService: NotificationService
  ) {}
  
  @Input() task!: Task;

  @Output() save = new EventEmitter<Task>();
  
  @Output() remove = new EventEmitter<Task>();
  
  @Output() close = new EventEmitter<void>();

}