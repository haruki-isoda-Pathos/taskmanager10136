import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { TaskIconComponent } from '../task-icon/task-icon.component';
import { BrowserNotificationService } from '../../services/browser-notification.service'
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../services/notification.service'

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, TaskIconComponent],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})

export class TaskFormComponent {

  title: string = ""
  memo: string = ""
  deadline = ''
  notifyBefore: number | null = null;
  priority = 1
  manualOrder?: number;

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
    private taskService: TaskService,
    private notificationService: NotificationService,
    private browserNotificationService: BrowserNotificationService
  ){}

  addTasks() {
    
    this.browserNotificationService.requestPermission();

    if (!this.title || !this.deadline) {
      this.notificationService.notify('必須項目を入力してください');
      return;
    }
  
    const newTask = {
      id: crypto.randomUUID(),
      title: this.title,
      memo: this.memo,
      deadline: this.deadline,
      notifyAfterMinutes: this.notifyBefore,
      priority: this.priority,
      createdAt: Date.now(),
      notified: false,
      deadlineNotified: false
    };
    this.taskService.addTask(newTask);
    this.notificationService.notify("タスクを追加しました");
    this.title = ''
    this.memo = ''

  }
}