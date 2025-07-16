import type { FieldVisualization } from '../types';

export const determineVisualization = (optionCount: number): FieldVisualization => {
  if (optionCount <= 4) {
    return 'radio';
  }
  return 'select';
};