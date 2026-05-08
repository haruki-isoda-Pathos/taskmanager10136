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

  title: string = ""
  memo: string = ""
  deadline = ''
  notifyAfterMinutes: number | null = null;
  priority = 1;
  showRemoveConfirm = false;

    //UI用
    onInputLimit(event: Event, max: number, field: 'title' | 'memo') {
      const target = event.target as HTMLTextAreaElement;
    
      if (target.value.length > max) {
        target.value = target.value.slice(0, max);
      }
    
      if (field === 'title') {
        this.title = target.value;
      } else {
        this.memo = target.value;
      }
    }
  
    //UI用
    autoResize(event: Event) {
      const textarea = event.target as HTMLTextAreaElement;
      textarea.style.height = 'auto'; // 一旦リセット
      textarea.style.height = textarea.scrollHeight + 'px'; // 中身に合わせる
    }

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.title = this.task.title;
    this.memo = this.task.memo;
    this.deadline = this.task.deadline;
    this.notifyAfterMinutes = this.task.notifyAfterMinutes;
    this.priority = this.task.priority;
  }
  
  saveTask() {
    const updatedTask: Task = {
      ...this.task,
      title: this.title,
      memo: this.memo,
      deadline: this.deadline,
      notifyAfterMinutes: this.notifyAfterMinutes,
      priority: this.priority
    };
    this.save.emit(updatedTask);
    //★おそらく、ここに通知とモーダル閉じを置くことになる。↓
    // this.notificationService.notify("タスクを編集しました");
    // @Output() modalClose = new EventEmitter<void>();
  }

  removeTask() {
    this.showRemoveConfirm = true;
  }

  cancelRemove() {
    this.showRemoveConfirm = false;
  }

  @Input() task!: Task;

  @Output() save = new EventEmitter<Task>();
  
  @Output() remove = new EventEmitter<Task>();
  
  @Output() modalClose = new EventEmitter<void>();

}