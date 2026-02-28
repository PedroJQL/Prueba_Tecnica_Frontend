import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.model';
import { StatBarComponent } from '../stat-bar/stat-bar';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, StatBarComponent],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css'
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() selected = false;
  @Input() showStats = false;
  @Output() select = new EventEmitter<Pokemon>();

  onSelect(): void {
    this.select.emit(this.pokemon);
  }
}