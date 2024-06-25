import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../../../../services/todos.servise';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  todos$ = this.todosService.todos$;
  search: any;
  constructor(private todosService: TodosService) {}

  Search() {
    if (this.search === '') {
      this.todos$ = this.todosService.todos$;
    } else {
      this.todos$ = this.todos$.pipe(
        map((todos) =>
          todos.filter((todo) =>
            todo.title
              .toLocaleLowerCase()
              .includes(this.search.toLocaleLowerCase())
          )
        )
      );
    }
  }
}
