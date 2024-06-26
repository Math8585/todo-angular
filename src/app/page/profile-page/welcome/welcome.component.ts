import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {

  public features = [
    'Edit category by double click on category name (press Enter to save)',
    'Add new category by click on "Add new category" input (press Enter to add)',
    'Remove category with all todos by click on "Delete category" button',
    'Add todos for each category by click on "Add" button',
    'Edit todos by click on "edit" icon(press Enter to save)',
    'Remove todos by click on "delete" icon',
    'Search todos by title'
  ];

  constructor(private authService: AuthService,
    private route: Router
  ) {

  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.route.navigate(['/login']);
      }
    });
  }
}
