import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'todo-angular';
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('auth-token');
    if (token !== null) {
      this.auth.setToken(token)
    }
  }

}
