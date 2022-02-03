import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';

export interface DataWebSocketChat {
  position: number,
  name: string,
  message: string
}

export interface DataWebSocketChatSalon {
  name: string,
}

@Component({
  selector: 'ss-test-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})


export class WebsocketComponent implements OnInit, OnDestroy {
  connection: Subscription | undefined;
  connectionSalon: Subscription | undefined;
  user: DataWebSocketChat = { position: 0, name: "", message: "" };
  salon: DataWebSocketChatSalon = { name: "" };
  dataSource: DataWebSocketChat[] = [];
  dataSourceSalon: DataWebSocketChatSalon[] = [];
  displayedColumns: string[] = ['id', 'name', 'message'];
  displayedColumnsSalon: string[] = ['salon'];


  @ViewChild('table') table: MatTable<DataWebSocketChat> | undefined;
  @ViewChild('tableSalon') tableSalon: MatTable<DataWebSocketChatSalon> | undefined;


  constructor(private websocketService: WebsocketService) { }

  onClick(): void {
    this.websocketService.emit('broadcast', { id: 0, name: this.user.name, message: this.user.message });
  }

  onClickSalon(): void {
    this.websocketService.emit('broadcastSalon', { name: this.salon.name });
  }

  ngOnInit(): void {
    this.websocketService.connect();

    this.connection = this.websocketService.on('broadcast').subscribe(data => {
      console.log(data);
      this.dataSource.push(data as DataWebSocketChat);
      this.table?.renderRows();
    })

    this.connectionSalon = this.websocketService.on('broadcastSalon').subscribe(salon => {
      console.log(salon);
      this.dataSourceSalon.push(salon as DataWebSocketChatSalon)
      this.tableSalon?.renderRows();
    })
  }

  ngOnDestroy(): void {
    this.connection?.unsubscribe();
  }
}