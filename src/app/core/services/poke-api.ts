import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { Pokemon } from '../../models/pokemon.model';

const API_URL = 'https://pokeapi.co/api/v2';

interface PokeApiResponse {
  results: { name: string; url: string }[];
}

interface PokeApiPokemonDetail {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

const MAX_STAT = 255;
const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad'
};

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  constructor(private http: HttpClient) {}

  getPokemonList(limit = 9, offset = 0): Observable<Pokemon[]> {
    return this.http
      .get<PokeApiResponse>(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        switchMap((res) => {
          const requests = res.results
            .slice(0, limit)
            .map((r) =>
              this.http.get<PokeApiPokemonDetail>(r.url).pipe(
                map((d) => this.mapToPokemon(d))
              )
            );
          return forkJoin(requests);
        })
      );
  }

  getPokemonByIdOrName(idOrName: string | number): Observable<Pokemon> {
    return this.http
      .get<PokeApiPokemonDetail>(`${API_URL}/pokemon/${idOrName}`)
      .pipe(map((d) => this.mapToPokemon(d)));
  }

  private mapToPokemon(detail: PokeApiPokemonDetail): Pokemon {
    const stats = detail.stats
      .filter((s) => STAT_NAMES[s.stat.name])
      .map((s) => ({
        name: STAT_NAMES[s.stat.name],
        baseStat: s.base_stat,
        percentage: Math.round((s.base_stat / MAX_STAT) * 100)
      }));

    return {
      id: detail.id,
      name: detail.name,
      imageUrl: detail.sprites?.front_default ?? 'https://via.placeholder.com/96',
      types: detail.types.map((t) => this.capitalizeType(t.type.name)),
      stats
    };
  }

  private capitalizeType(name: string): string {
    const typeMap: Record<string, string> = {
      grass: 'Planta', poison: 'Veneno', fire: 'Fuego', water: 'Agua',
      flying: 'Volador', bug: 'Bicho', electric: 'Eléctrico', ground: 'Tierra',
      fairy: 'Hada', fighting: 'Lucha', psychic: 'Psíquico', rock: 'Roca',
      steel: 'Acero', ice: 'Hielo', ghost: 'Fantasma', dragon: 'Dragón',
      dark: 'Siniestro', normal: 'Normal'
    };
    return typeMap[name] || name;
  }
}