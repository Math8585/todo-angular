import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [SidebarComponent, WelcomeComponent, CategoryDetailComponent, RouterOutlet],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {

}
