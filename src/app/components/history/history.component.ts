import { Component, OnInit } from '@angular/core';
import { HistoryService, History } from '../../services/history.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit{

histories: History[] = []

constructor(
  private historyService: HistoryService
){}

ngOnInit() {
      this.historyService.histories$.subscribe(histories => {this.histories = histories});
}

clearHistory() {
  this.historyService.clearHistories();
}

}
