// src/app/app.ts
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './componentes/footer/footer';
import { Header } from './componentes/header/header';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from './servicios/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);

  constructor() {
    effect(() => {
      const msg = this.notificationService.message();
      if (msg) {
        this.messageService.add({
          severity: msg.severity,
          summary: msg.summary,
          detail: msg.detail,
          life: 4000
        });
      }
    });
  }
}
