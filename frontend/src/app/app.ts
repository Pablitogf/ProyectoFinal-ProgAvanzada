import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './componentes/footer/footer';
import { Header } from './componentes/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
