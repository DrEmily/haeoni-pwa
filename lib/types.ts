export interface Weather {
  tmn: number | null;
  tmx: number | null;
  pop_max: number | null;
  wind_speed_avg: number | null;
}

export interface SeaLayer {
  layer: string | null;
  depth: string | null;
  temp_celsius: number | null;
  active: boolean;
}

export interface SeaTemp {
  station_name: string;
  observed_at: string | null;
  primary: {
    layer: string;
    depth: string | null;
    temp_celsius: number | null;
    active: boolean;
  };
  all_layers: SeaLayer[];
}
