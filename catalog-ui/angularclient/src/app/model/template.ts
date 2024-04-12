import { Property } from './property';

export interface Template {
  id?: number;
  name: string;
  properties?: Property[];
}
