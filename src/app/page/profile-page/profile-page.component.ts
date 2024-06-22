import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SearchComponent } from './search/search.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [SidebarComponent, SearchComponent, TodoFormComponent, TodoListComponent ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
