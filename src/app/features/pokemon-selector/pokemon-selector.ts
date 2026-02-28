import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokeApiService } from '../../core/services/poke-api';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonCardComponent } from '../../shared/pokemon-card/pokemon-card';

@Component({
  selector: 'app-pokemon-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, PokemonCardComponent],
  templateUrl: './pokemon-selector.html',
  styleUrl: './pokemon-selector.css'
})
export class PokemonSelectorComponent implements OnInit {
  pokemonList = signal<Pokemon[]>([]);
  selectedPokemon = signal<Pokemon[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  filteredPokemon = computed(() => {
    const list = this.pokemonList();
    const search = this.searchTerm().toLowerCase().trim();
    if (!search) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.id.toString().includes(search)
    );
  });

  constructor(private pokeApi: PokeApiService) {}

  ngOnInit(): void {
    this.loadPokemon();
  }

  loadPokemon(): void {
    this.loading.set(true);
    this.pokeApi.getPokemonList(9, 0).subscribe({
      next: (list) => {
        this.pokemonList.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar Pokémon');
        this.loading.set(false);
      }
    });
  }

 onSearch(value: string): void {
  this.searchTerm.set(value);
  const term = value.trim().toLowerCase();
  if (!term) {
    this.loadPokemon();
    return;
  }
  this.loading.set(true);
  this.pokeApi.getPokemonByIdOrName(term).subscribe({
    next: (pokemon) => {
      this.pokemonList.set([pokemon]);
      this.loading.set(false);
    },
    error: () => {
      this.pokemonList.set([]);
      this.loading.set(false);
    }
  });
}

  toggleSelect(pokemon: Pokemon): void {
    const current = this.selectedPokemon();
    const exists = current.find((p) => p.id === pokemon.id);
    if (exists) {
      this.selectedPokemon.set(current.filter((p) => p.id !== pokemon.id));
    } else if (current.length < 3) {
      this.selectedPokemon.set([...current, pokemon]);
    }
  }

  isSelected(pokemon: Pokemon): boolean {
    return this.selectedPokemon().some((p) => p.id === pokemon.id);
  }

  save(): void {
    console.log('Pokémon seleccionados:', this.selectedPokemon());
    alert('¡Equipo guardado!\n' +
      this.selectedPokemon()
        .map((p) => `${p.name} (#${p.id})`)
        .join('\n'));
  }
}