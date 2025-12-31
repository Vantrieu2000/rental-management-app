export type PropertyType = 'apartment' | 'dormitory' | 'house' | 'commercial';

export interface PropertyTypeOption {
  value: PropertyType;
  labelKey: string;
  icon: string;
}

export const PROPERTY_TYPES: PropertyTypeOption[] = [
  {
    value: 'apartment',
    labelKey: 'properties.types.apartment',
    icon: 'apartment',
  },
  {
    value: 'dormitory',
    labelKey: 'properties.types.dormitory',
    icon: 'school',
  },
  {
    value: 'house',
    labelKey: 'properties.types.house',
    icon: 'home',
  },
  {
    value: 'commercial',
    labelKey: 'properties.types.commercial',
    icon: 'business',
  },
];

export const getPropertyTypeOption = (type: PropertyType): PropertyTypeOption | undefined => {
  return PROPERTY_TYPES.find((option) => option.value === type);
};
