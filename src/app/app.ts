import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfileComponent } from './features/user-profile/user-profile';
import { PokemonSelectorComponent } from './features/pokemon-selector/pokemon-selector';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserProfileComponent, PokemonSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}