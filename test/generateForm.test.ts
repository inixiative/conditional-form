import { describe, test, expect } from 'bun:test';
import { generateForm } from '../src/generateForm';
import type { ModelGroup } from '../src/types';

describe('generateForm', () => {
  test('generates empty form with no models', () => {
    const result = generateForm();
    
    expect(result).toEqual({
      order: [],
      fields: {}
    });
  });

  test('generates form with single model selector', () => {
    const products: ModelGroup = {
      label: 'Product',
      key: 'product',
      records: [
        { id: 'prod-1', name: 'T-Shirt', price: 20 },
        { id: 'prod-2', name: 'Hat', price: 15 }
      ]
    };

    const result = generateForm([products]);
    
    expect(result.order).toEqual(['product']);
    expect(result.fields.product).toBeDefined();
    expect(result.fields.product).toHaveLength(1);
    expect(result.fields.product[0].label).toBe('Product');
    expect(result.fields.product[0].options).toHaveLength(2);
    expect(result.fields.product[0].options[0].value).toBe('prod-1');
    expect(result.fields.product[0].options[0].label).toBe('T-Shirt');
    expect(result.fields.product[0].defaultValue).toBe('prod-1');
  });

  test('generates form with multiple model selectors', () => {
    const products: ModelGroup = {
      label: 'Product',
      key: 'product',
      records: [
        { id: 'prod-1', name: 'T-Shirt' }
      ]
    };

    const shippingMethods: ModelGroup = {
      label: 'Shipping Method',
      key: 'shippingMethod',
      records: [
        { id: 'ship-1', label: 'Standard', days: 5 },
        { id: 'ship-2', label: 'Express', days: 2 }
      ]
    };

    const result = generateForm([products, shippingMethods]);
    
    expect(result.order).toEqual(['product', 'shippingMethod']);
    expect(result.fields.product).toBeDefined();
    expect(result.fields.shippingMethod).toBeDefined();
    expect(result.fields.shippingMethod[0].options[0].label).toBe('Standard');
  });

  test('handles empty model records', () => {
    const products: ModelGroup = {
      label: 'Product',
      key: 'product',
      records: []
    };

    const result = generateForm([products]);
    
    expect(result.order).toEqual(['product']);
    expect(result.fields.product[0].options).toEqual([]);
    expect(result.fields.product[0].defaultValue).toBeUndefined();
  });

  test('uses name field for label when available', () => {
    const categories: ModelGroup = {
      label: 'Category',
      key: 'category',
      records: [
        { id: 'cat-1', name: 'Electronics' },
        { id: 'cat-2', title: 'Books' }, // should fall back to title
        { id: 'cat-3' } // should fall back to string representation
      ]
    };

    const result = generateForm([categories]);
    
    expect(result.fields.category[0].options[0].label).toBe('Electronics');
    expect(result.fields.category[0].options[1].label).toBe('Books');
    expect(result.fields.category[0].options[2].label).toBe('[object Object]');
  });

  test('sets correct visualization based on number of options', () => {
    const fewOptions: ModelGroup = {
      label: 'Size',
      key: 'size',
      records: [
        { id: 's', label: 'Small' },
        { id: 'm', label: 'Medium' }
      ]
    };

    const manyOptions: ModelGroup = {
      label: 'Country',
      key: 'country',
      records: Array.from({ length: 10 }, (_, i) => ({
        id: `country-${i}`,
        name: `Country ${i}`
      }))
    };

    const result = generateForm([fewOptions, manyOptions]);
    
    expect(result.fields.size[0].visualization).toBe('radio');
    expect(result.fields.country[0].visualization).toBe('select');
  });

  test('handles multiple resource types with same model', () => {
    // Example: A format model used by different resource types
    const tournamentFormats: ModelGroup = {
      label: 'Tournament Format',
      key: 'format',
      records: [
        { 
          id: 'format-1', 
          name: 'Standard',
          elements: [
            {
              key: 'maxRounds',
              formElement: {
                id: 'form-el-1',
                name: 'maxRounds',
                label: 'Maximum Rounds',
                visualization: 'number',
                conditions: true,
                disabled: false,
                locked: false,
                options: []
              }
            }
          ]
        },
        { 
          id: 'format-2', 
          name: 'Swiss',
          elements: [
            {
              key: 'swissRounds',
              formElement: {
                id: 'form-el-2',
                name: 'swissRounds',
                label: 'Swiss Rounds',
                visualization: 'number',
                conditions: true,
                disabled: false,
                locked: false,
                options: []
              }
            }
          ]
        }
      ]
    };

    const leagueFormats: ModelGroup = {
      label: 'League Format',
      key: 'leagueFormat',
      records: [
        { 
          id: 'format-1', 
          name: 'Standard',
          elements: [
            {
              key: 'weeksPerSeason',
              formElement: {
                id: 'form-el-3',
                name: 'weeksPerSeason',
                label: 'Weeks Per Season',
                visualization: 'number',
                conditions: true,
                disabled: false,
                locked: false,
                options: []
              }
            }
          ]
        }
      ]
    };

    const result = generateForm([tournamentFormats, leagueFormats]);
    
    // Both format selectors should exist with different keys
    expect(result.order).toContain('format');
    expect(result.order).toContain('leagueFormat');
    expect(result.fields.format).toBeDefined();
    expect(result.fields.leagueFormat).toBeDefined();
    
    // Form elements should be properly scoped to their models
    expect(result.fields.maxRounds).toBeDefined();
    expect(result.fields.swissRounds).toBeDefined();
    expect(result.fields.weeksPerSeason).toBeDefined();
    
    // Check conditions are properly set
    expect(result.fields.maxRounds[0].conditions).toEqual({
      field: 'format',
      operator: 'equals',
      value: 'format-1'
    });
    expect(result.fields.swissRounds[0].conditions).toEqual({
      field: 'format',
      operator: 'equals',
      value: 'format-2'
    });
    expect(result.fields.weeksPerSeason[0].conditions).toEqual({
      field: 'leagueFormat',
      operator: 'equals',
      value: 'format-1'
    });
  });

  test('handles same resource with different keys', () => {
    // Example: Team model used for home and away teams
    const homeTeam: ModelGroup = {
      label: 'Home Team',
      key: 'homeTeam',
      records: [
        { 
          id: 'team-1', 
          name: 'Red Dragons',
          elements: [
            {
              key: 'homeAdvantage',
              formElement: {
                id: 'form-el-1',
                name: 'homeAdvantage',
                label: 'Home Advantage',
                visualization: 'switch',
                conditions: true,
                disabled: false,
                locked: false,
                options: []
              }
            }
          ]
        },
        { id: 'team-2', name: 'Blue Knights' }
      ]
    };

    const awayTeam: ModelGroup = {
      label: 'Away Team', 
      key: 'awayTeam',
      records: [
        { id: 'team-1', name: 'Red Dragons' },
        { id: 'team-2', name: 'Blue Knights' },
        { id: 'team-3', name: 'Green Warriors' }
      ]
    };

    const result = generateForm([homeTeam, awayTeam]);
    
    // Both team selectors should exist
    expect(result.order).toEqual(['homeTeam', 'awayTeam', 'homeAdvantage']);
    expect(result.fields.homeTeam).toBeDefined();
    expect(result.fields.awayTeam).toBeDefined();
    
    // Home team has 2 options, away team has 3
    expect(result.fields.homeTeam[0].options).toHaveLength(2);
    expect(result.fields.awayTeam[0].options).toHaveLength(3);
    
    // Form element should only appear for home team
    expect(result.fields.homeAdvantage).toBeDefined();
    expect(result.fields.homeAdvantage[0].conditions).toEqual({
      field: 'homeTeam',
      operator: 'equals',
      value: 'team-1'
    });
  });

  test('handles same model instance with different keys', () => {
    // Create a single team model records array
    const teamRecords = [
      { 
        id: 'team-1', 
        name: 'Red Dragons',
        elements: [
          {
            key: 'teamStrategy',
            formElement: {
              id: 'form-el-1',
              name: 'teamStrategy',
              label: 'Team Strategy',
              visualization: 'select',
              conditions: true,
              disabled: false,
              locked: false,
              options: [
                { id: 'opt-1', label: 'Aggressive', value: 'aggressive' },
                { id: 'opt-2', label: 'Defensive', value: 'defensive' },
                { id: 'opt-3', label: 'Balanced', value: 'balanced' }
              ]
            }
          }
        ]
      },
      { id: 'team-2', name: 'Blue Knights' },
      { id: 'team-3', name: 'Green Warriors' }
    ];

    // Use the same records for multiple model groups
    const primaryTeam: ModelGroup = {
      label: 'Primary Team',
      key: 'primaryTeam',
      records: teamRecords
    };

    const secondaryTeam: ModelGroup = {
      label: 'Secondary Team',
      key: 'secondaryTeam',
      records: teamRecords
    };

    const opponentTeam: ModelGroup = {
      label: 'Opponent Team',
      key: 'opponentTeam',
      records: teamRecords
    };

    const result = generateForm([primaryTeam, secondaryTeam, opponentTeam]);
    
    // All three selectors should exist
    expect(result.order).toContain('primaryTeam');
    expect(result.order).toContain('secondaryTeam');
    expect(result.order).toContain('opponentTeam');
    
    // All should have the same options
    expect(result.fields.primaryTeam[0].options).toHaveLength(3);
    expect(result.fields.secondaryTeam[0].options).toHaveLength(3);
    expect(result.fields.opponentTeam[0].options).toHaveLength(3);
    
    // Options should have the same values
    expect(result.fields.primaryTeam[0].options[0].value).toBe('team-1');
    expect(result.fields.secondaryTeam[0].options[0].value).toBe('team-1');
    expect(result.fields.opponentTeam[0].options[0].value).toBe('team-1');
    
    // Form element appears multiple times with different conditions
    expect(result.fields.teamStrategy).toBeDefined();
    expect(result.fields.teamStrategy).toHaveLength(3); // One for each model group
    
    // Check conditions for each instance
    const conditions = result.fields.teamStrategy.map(f => f.conditions);
    expect(conditions).toContainEqual({
      field: 'primaryTeam',
      operator: 'equals',
      value: 'team-1'
    });
    expect(conditions).toContainEqual({
      field: 'secondaryTeam',
      operator: 'equals',
      value: 'team-1'
    });
    expect(conditions).toContainEqual({
      field: 'opponentTeam',
      operator: 'equals',
      value: 'team-1'
    });
  });

  test('handles array notation in element keys', () => {
    // Example: Tournament with array-based format configuration
    const tournaments: ModelGroup = {
      label: 'Tournament',
      key: 'tournament',
      records: [
        { 
          id: 'tournament-1',
          name: 'Spring Championship',
          elements: [
            {
              key: 'tournaments.0.name',
              formElement: {
                id: 'form-el-1',
                name: 'tournamentName',
                label: 'Tournament Name',
                visualization: 'text',
                conditions: true,
                disabled: false,
                locked: false,
                options: []
              }
            },
            {
              key: 'tournaments.0.format',
              formElement: {
                id: 'form-el-2',
                name: 'tournamentFormat',
                label: 'Format',
                visualization: 'select',
                conditions: true,
                disabled: false,
                locked: false,
                options: [
                  { id: 'opt-1', label: 'Single Elimination', value: 'single-elim' },
                  { id: 'opt-2', label: 'Double Elimination', value: 'double-elim' }
                ]
              }
            }
          ]
        },
        {
          id: 'tournament-2',
          name: 'Summer Series',
          elements: [
            {
              key: 'tournaments.1.name',
              formElement: {
                id: 'form-el-3',
                name: 'tournamentName',
                label: 'Tournament Name',
                visualization: 'text',
                conditions: true,
                disabled: false,
                locked: false,
                options: []
              }
            },
            {
              key: 'tournaments.1.format',
              formElement: {
                id: 'form-el-4',
                name: 'tournamentFormat',
                label: 'Format',
                visualization: 'select',
                conditions: true,
                disabled: false,
                locked: false,
                options: [
                  { id: 'opt-3', label: 'Swiss', value: 'swiss' },
                  { id: 'opt-4', label: 'Round Robin', value: 'round-robin' }
                ]
              }
            }
          ]
        }
      ]
    };

    const result = generateForm([tournaments]);
    
    // Should have tournament selector
    expect(result.fields.tournament).toBeDefined();
    
    // Should have array-indexed fields
    expect(result.fields['tournaments.0.name']).toBeDefined();
    expect(result.fields['tournaments.0.format']).toBeDefined();
    expect(result.fields['tournaments.1.name']).toBeDefined();
    expect(result.fields['tournaments.1.format']).toBeDefined();
    
    // Order should include all fields
    expect(result.order).toContain('tournament');
    expect(result.order).toContain('tournaments.0.name');
    expect(result.order).toContain('tournaments.0.format');
    expect(result.order).toContain('tournaments.1.name');
    expect(result.order).toContain('tournaments.1.format');
    
    // Each field should have proper conditions
    expect(result.fields['tournaments.0.name'][0].conditions).toEqual({
      field: 'tournament',
      operator: 'equals',
      value: 'tournament-1'
    });
    
    expect(result.fields['tournaments.1.format'][0].conditions).toEqual({
      field: 'tournament',
      operator: 'equals',
      value: 'tournament-2'
    });
  });
});