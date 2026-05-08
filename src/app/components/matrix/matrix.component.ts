import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray  } from '@angular/cdk/drag-drop';
import { interval } from 'rxjs';
import { TaskIconComponent } from '../task-icon/task-icon.component'
import { TaskModalComponent } from '../task-modal/task-modal.component'
import { TaskService, Board } from '../../services/task.service';
import { BrowserNotificationService } from '../../services/browser-notification.service'
import { NotificationService } from '../../services/notification.service'
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-matrix',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskIconComponent, TaskModalComponent],
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})

export class MatrixComponent implements OnInit{

  board!: Board;
  pendingDrop: CdkDragDrop<Task[]> | null = null;
  showConfirm = false;
  selectedTask: Task | null = null;
  showModal = false;

constructor(
  private taskService: TaskService,
  private notificationService: NotificationService,
  private cdr: ChangeDetectorRef,
  private browserNotificationService: BrowserNotificationService
) {}

ngOnInit() {
  this.browserNotificationService.requestPermission();
      this.taskService.board$.subscribe(board => {
        this.board = {
          ...board,
          todo: this.getSortedTasks([...board.todo]),
          pending: this.getSortedTasks([...board.pending]),
          doing: this.getSortedTasks([...board.doing]),
          done: this.getSortedTasks([...board.done]),
        };
       });

       interval(1000).subscribe(() => {
        this.cdr.detectChanges(); // 再描画トリガー
        this.checkNotifications();
       });
     }    



getSortedTasks(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {

    if (a.manualOrder != null && b.manualOrder != null) {
      return a.manualOrder - b.manualOrder;
    }
    if (a.manualOrder != null) return -1;
    if (b.manualOrder != null) return 1;

    if(a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}
     
onDrop(event: CdkDragDrop<Task[]>) {
      // 同一カラム内だけ確認したい場合
      if (event.previousContainer === event.container) {
        this.pendingDrop = event;
        this.showConfirm = true;
      } else {
        // カラム移動は即実行でもOK
        this.executeDrop(event);
      }
    }
  
confirmReorder() {
  if(!this.pendingDrop) return;
  this.executeDrop(this.pendingDrop);
  const event = this.pendingDrop;
  event.container.data.forEach((task, index) => {
    task.manualOrder = index;
  });
  this.taskService.updateBoard(this.board);
  this.resetDialog();

}

cancelReorder() {
  this.resetDialog();
}

private resetDialog() {
  this.pendingDrop = null;
  this.showConfirm = false;
}

private executeDrop(event: CdkDragDrop<Task[]>) {
    // 同じカラム内の並び替え
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } 
    // カラム間移動
    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.taskService.updateBoard(this.board); // 状態を更新
}

trackById(index: number, task: Task) {
  return task.id;
}

checkNotifications() {
  const now = Date.now();

  Object.values(this.board)
    .flat()
    .forEach(task => {
      // done除外
      if (this.board.done.includes(task)) return;
      const due =
        new Date(task.deadline).getTime();
      // 通知
      if (task.notifyAfterMinutes != null && !task.notified) {
        const notifyTime =
          task.createdAt + task.notifyAfterMinutes * 60 * 1000;
        
          if (now >= notifyTime) {
          this.notificationService.notify("通知の到来したタスクがあります");
          this.browserNotificationService.show(
            '通知到来',
            `${task.title} を確認してください`
          );
          task.notified = true;
        }
      }
      // 期限
      if (now >= due && !task.deadlineNotified) {
        this.notificationService.notify("期限を超過したタスクがあります");
        this.browserNotificationService.show(
          '期限超過',
          `${task.title} の期限です`
        );
        task.deadlineNotified = true;
      }
    });
}

openEditModal(task: Task) {
  this.selectedTask = task;
  this.showModal = true;
}


saveTask(updatedTask: Task) {
  this.taskService.updateTask(updatedTask);
  this.closeModal();
  this.notificationService.notify("タスクを編集しました");
}

removeTask(task: Task) {
  this.taskService.deleteTask(task.id);
  this.closeModal();
  this.notificationService.notify("タスクを削除しました");
}


closeModal() {
  this.showModal = false;
}

}