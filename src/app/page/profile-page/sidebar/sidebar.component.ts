import { Component } from '@angular/core';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CategoryFormComponent, CategoryListComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
