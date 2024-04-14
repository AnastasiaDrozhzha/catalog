import { PropertyType } from './property-type';

export interface Property {
  id?: number;
  name: string;
  type: PropertyType;
}
