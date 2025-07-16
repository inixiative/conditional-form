import React from 'react';

export interface HiddenFieldProps {
  value?: any;
  onChange: (value: any) => void;
}

export const HiddenField: React.FC<HiddenFieldProps> = ({
  value,
  onChange
}) => {
  return (
    <input
      type="hidden"
      value={typeof value === 'object' ? JSON.stringify(value) : value || ''}
      onChange={(e) => {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(e.target.value);
          onChange(parsed);
        } catch {
          // If not JSON, use as string
          onChange(e.target.value);
        }
      }}
    />
  );
};