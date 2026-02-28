export interface PokemonStat{
    name: string;
    baseStat: number;
    percentage: number;
}

export interface Pokemon{
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
    stats: PokemonStat[];
}