import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/ui/alert/alert.component';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('social_app');
}
