export type CakeAssemblyPhase =
  | 'idle'
  | 'plate'
  | 'bottom_layer'
  | 'middle_cream'
  | 'top_layer'
  | 'frosting'
  | 'toppings'
  | 'candle_4'
  | 'candle_0'
  | 'candle_t'
  | 'candle_h'
  | 'lighting_flames'
  | 'completed';

export interface CandleState {
  id: '4' | '0' | 'T' | 'H';
  label: string;
  isLanded: boolean;
  isLit: boolean;
}
