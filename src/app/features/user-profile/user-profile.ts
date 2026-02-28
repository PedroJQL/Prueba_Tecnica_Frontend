import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfileComponent {
  user = {
    name: 'José Sosa',
    hobby: 'Ver Series',
    age: '17 años',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jose'
  };
}