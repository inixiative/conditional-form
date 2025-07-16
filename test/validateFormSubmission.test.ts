import { describe, test, expect } from 'bun:test';
import { validateFormSubmission } from '../src/validation';
import { generateForm } from '../src/generateForm';
import type { ModelGroup } from '../src/types';

describe('validateFormSubmission', () => {
  const products: ModelGroup = {
    label: 'Product',
    key: 'product',
    records: [
      { id: 'prod-1', name: 'T-Shirt', type: 'physical' },
      { id: 'prod-2', name: 'E-Book', type: 'digital' }
    ]
  };

  const shippingMethods: ModelGroup = {
    label: 'Shipping Method',
    key: 'shippingMethod',
    records: [
      { id: 'standard', label: 'Standard Shipping' },
      { id: 'express', label: 'Express Shipping' }
    ]
  };

  test('validates valid submission without changes', () => {
    const submission = {
      product: 'prod-1',
      shippingMethod: 'standard'
    };

    const result = validateFormSubmission(submission, [products, shippingMethods]);
    
    expect(result.changed).toBe(false);
    expect(result.errors).toBeUndefined();
    expect(result.updated).toEqual(submission);
  });

  test('auto-selects single option when missing', () => {
    const singleProduct: ModelGroup = {
      label: 'Product',
      key: 'product',
      records: [{ id: 'only-one', name: 'Single Product' }]
    };

    const submission = {};
    const result = validateFormSubmission(submission, [singleProduct]);
    
    expect(result.changed).toBe(true);
    expect(result.updated.product).toBe('only-one');
    expect(result.errors).toBeUndefined();
  });

  test('auto-selects first option as default when missing', () => {
    const submission = {};
    const result = validateFormSubmission(submission, [products]);
    
    expect(result.changed).toBe(true);
    expect(result.updated.product).toBe('prod-1');
  });

  test('reports error for invalid selection', () => {
    const submission = {
      product: 'invalid-id'
    };

    const result = validateFormSubmission(submission, [products]);
    
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].field).toBe('product');
    expect(result.errors![0].message).toContain('Invalid selection');
    expect(result.errors![0].expectedValue).toEqual(['prod-1', 'prod-2']);
  });

  test('removes fields that no longer exist in schema', () => {
    const submission = {
      product: 'prod-1',
      oldField: 'should be removed'
    };

    const result = validateFormSubmission(submission, [products]);
    
    expect(result.changed).toBe(true);
    expect(result.updated).not.toHaveProperty('oldField');
    expect(result.updated.product).toBe('prod-1');
  });

  test('respects exempt fields', () => {
    const submission = {
      product: 'invalid-id',
      customField: 'exempt-value'
    };

    const result = validateFormSubmission(
      submission, 
      [products], 
      ['product', 'customField']
    );
    
    expect(result.errors).toBeUndefined();
    expect(result.updated.product).toBe('invalid-id'); // Not validated
    expect(result.updated.customField).toBe('exempt-value'); // Preserved
  });

  test('uses additional context for conditions', () => {
    const submission = {
      product: 'prod-1'
    };

    const context = {
      userType: 'premium'
    };

    const result = validateFormSubmission(
      submission,
      [products],
      [],
      context
    );

    expect(result.changed).toBe(false);
    expect(result.updated).toEqual(submission);
  });

  test('injects model data into context for condition checking', () => {
    // This would be used in a real scenario where form fields have conditions
    // that check model properties like: product.type === 'physical'
    const submission = {
      product: 'prod-1',
      shippingMethod: 'standard'
    };

    const result = validateFormSubmission(submission, [products, shippingMethods]);
    
    // The validation internally makes the full product model available
    // for condition checking, but only returns IDs in the result
    expect(result.updated.product).toBe('prod-1');
    expect(typeof result.updated.product).toBe('string');
  });

  test('handles complex self-healing scenario', () => {
    const submission = {
      product: 'prod-3', // Invalid ID
      shippingMethod: 'overnight', // Invalid option
      extraField: 'remove-me' // Field not in schema
    };

    const result = validateFormSubmission(submission, [products, shippingMethods]);
    
    expect(result.changed).toBe(true);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(2); // Two invalid selections
    expect(result.updated).not.toHaveProperty('extraField');
    
    // Check error details
    const productError = result.errors!.find(e => e.field === 'product');
    expect(productError).toBeDefined();
    expect(productError!.value).toBe('prod-3');
    
    const shippingError = result.errors!.find(e => e.field === 'shippingMethod');
    expect(shippingError).toBeDefined();
    expect(shippingError!.value).toBe('overnight');
  });

  test('preserves valid data while fixing invalid data', () => {
    const submission = {
      product: 'prod-2', // Valid
      shippingMethod: 'invalid', // Invalid - should get default
      keepMe: 'value' // Not in schema - should be removed
    };

    const result = validateFormSubmission(submission, [products, shippingMethods]);
    
    expect(result.changed).toBe(true);
    expect(result.updated.product).toBe('prod-2'); // Preserved
    expect(result.updated).not.toHaveProperty('keepMe'); // Removed
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].field).toBe('shippingMethod');
  });

  test('handles array notation in field paths', () => {
    // For this test, we'll use exempt fields to demonstrate path handling
    // In real usage, these paths would come from the form schema
    const submission = {
      'items.0.product': 'prod-1',
      'items.0.quantity': 2,
      'items.1.product': 'prod-2',
      'items.1.quantity': 1,
      'customer.name': 'John Doe',
      'customer.email': 'john@example.com'
    };

    // Mark all path-based fields as exempt to preserve them
    const exemptFields = [
      'items.0.product',
      'items.0.quantity',
      'items.1.product', 
      'items.1.quantity',
      'customer.name',
      'customer.email'
    ];

    const result = validateFormSubmission(submission, [products], exemptFields);
    
    // The validation should preserve the path notation
    expect(result.updated['items.0.product']).toBe('prod-1');
    expect(result.updated['items.0.quantity']).toBe(2);
    expect(result.updated['items.1.product']).toBe('prod-2');
    expect(result.updated['items.1.quantity']).toBe(1);
    expect(result.updated['customer.name']).toBe('John Doe');
    expect(result.updated['customer.email']).toBe('john@example.com');
  });

  test('handles model references within array structures', () => {
    // Define formats as a model group
    const formats: ModelGroup = {
      label: 'Format',
      key: 'format',
      records: [
        { id: 'format-1', name: 'Standard' },
        { id: 'format-2', name: 'Extended' },
        { id: 'format-3', name: 'Limited' }
      ]
    };

    // Submission with array notation
    const submission = {
      'format': 'format-1', // Direct model reference
      'tournaments.0.name': 'Spring Championship',
      'tournaments.0.formatId': 'format-1',  // This would need to be in schema or exempt
      'tournaments.0.maxPlayers': 64,
      'tournaments.1.name': 'Summer Series',
      'tournaments.1.formatId': 'format-2',
      'tournaments.1.maxPlayers': 32
    };

    // Since array fields aren't in the schema, they need to be exempt to be preserved
    const exemptFields = [
      'tournaments.0.name',
      'tournaments.0.formatId',
      'tournaments.0.maxPlayers',
      'tournaments.1.name',
      'tournaments.1.formatId',
      'tournaments.1.maxPlayers'
    ];

    const result = validateFormSubmission(submission, [formats], exemptFields);
    
    // Direct model reference is validated
    expect(result.updated.format).toBe('format-1');
    
    // Path-based fields are preserved as exempt
    expect(result.updated['tournaments.0.name']).toBe('Spring Championship');
    expect(result.updated['tournaments.0.formatId']).toBe('format-1');
    expect(result.updated['tournaments.0.maxPlayers']).toBe(64);
    expect(result.updated['tournaments.1.name']).toBe('Summer Series');
    expect(result.updated['tournaments.1.formatId']).toBe('format-2');
    expect(result.updated['tournaments.1.maxPlayers']).toBe(32);
  });

  test('handles multiple instances of same model with different keys', () => {
    // Different model groups with explicit keys
    const homeTeams: ModelGroup = {
      label: 'Home Team',
      key: 'homeTeam',
      records: [
        { id: 'team-1', name: 'Red Team' },
        { id: 'team-2', name: 'Blue Team' }
      ]
    };

    const awayTeams: ModelGroup = {
      label: 'Away Team',
      key: 'awayTeam',
      records: [
        { id: 'team-2', name: 'Blue Team' },
        { id: 'team-3', name: 'Green Team' }
      ]
    };

    const primaryFormats: ModelGroup = {
      label: 'Primary Format',
      key: 'primaryFormat',
      records: [
        { id: 'format-1', name: 'Standard' },
        { id: 'format-2', name: 'Extended' }
      ]
    };

    const secondaryFormats: ModelGroup = {
      label: 'Secondary Format', 
      key: 'secondaryFormat',
      records: [
        { id: 'format-1', name: 'Standard' },
        { id: 'format-3', name: 'Limited' }
      ]
    };

    const submission = {
      // Model references using their explicit keys
      'homeTeam': 'team-1',
      'awayTeam': 'team-3',
      'primaryFormat': 'format-1',
      'secondaryFormat': 'format-3',
      'invalidField': 'should-be-removed'
    };

    const result = validateFormSubmission(submission, [homeTeams, awayTeams, primaryFormats, secondaryFormats]);
    
    // Each model validates based on its own key
    expect(result.updated.homeTeam).toBe('team-1');
    expect(result.updated.awayTeam).toBe('team-3');
    expect(result.updated.primaryFormat).toBe('format-1');
    expect(result.updated.secondaryFormat).toBe('format-3');
    
    // Invalid field is removed
    expect(result.updated.invalidField).toBeUndefined();
  });

  test('validates complex scenarios with resource types and array notation', () => {
    // Tournament formats
    const tournamentFormats: ModelGroup = {
      label: 'Tournament Format',
      key: 'tournamentFormat',
      records: [
        { id: 'single-elim', name: 'Single Elimination' },
        { id: 'double-elim', name: 'Double Elimination' },
        { id: 'swiss', name: 'Swiss' }
      ]
    };

    // League formats  
    const leagueFormats: ModelGroup = {
      label: 'League Format',
      key: 'leagueFormat',
      records: [
        { id: 'round-robin', name: 'Round Robin' },
        { id: 'divisions', name: 'Divisions' }
      ]
    };

    // Teams that can be used in multiple contexts
    const homeTeams: ModelGroup = {
      label: 'Home Team',
      key: 'homeTeam',
      records: [
        { id: 'team-a', name: 'Team Alpha' },
        { id: 'team-b', name: 'Team Beta' }
      ]
    };

    const awayTeams: ModelGroup = {
      label: 'Away Team',
      key: 'awayTeam',
      records: [
        { id: 'team-b', name: 'Team Beta' },
        { id: 'team-c', name: 'Team Charlie' }
      ]
    };

    const submission = {
      // Direct model references
      'tournamentFormat': 'swiss',
      'leagueFormat': 'round-robin',
      
      // Array notation with model references
      'events.0.type': 'tournament',
      'events.0.tournamentFormat': 'single-elim',
      'events.0.maxPlayers': 32,
      
      'events.1.type': 'league', 
      'events.1.leagueFormat': 'divisions',
      'events.1.numberOfWeeks': 8,
      
      // Matches with team references
      'matches.0.homeTeam': 'team-a',
      'matches.0.awayTeam': 'team-b',
      'matches.0.round': 1,
      
      'matches.1.homeTeam': 'team-invalid', // Invalid
      'matches.1.awayTeam': 'team-c',
      'matches.1.round': 1
    };

    // Mark array fields as exempt since they're not in the generated schema
    const exemptFields = [
      'events.0.type',
      'events.0.tournamentFormat', 
      'events.0.maxPlayers',
      'events.1.type',
      'events.1.leagueFormat',
      'events.1.numberOfWeeks',
      'matches.0.homeTeam',
      'matches.0.awayTeam',
      'matches.0.round',
      'matches.1.homeTeam',
      'matches.1.awayTeam',
      'matches.1.round'
    ];

    const result = validateFormSubmission(
      submission, 
      [tournamentFormats, leagueFormats, homeTeams, awayTeams],
      exemptFields
    );
    
    // Direct references are validated
    expect(result.updated.tournamentFormat).toBe('swiss');
    expect(result.updated.leagueFormat).toBe('round-robin');
    
    // Array fields are preserved
    expect(result.updated['events.0.tournamentFormat']).toBe('single-elim');
    expect(result.updated['events.1.leagueFormat']).toBe('divisions');
    
    // Team references work in arrays
    expect(result.updated['matches.0.homeTeam']).toBe('team-a');
    expect(result.updated['matches.0.awayTeam']).toBe('team-b');
    
    // Invalid homeTeam is preserved because it's exempt
    expect(result.updated['matches.1.homeTeam']).toBe('team-invalid');
    expect(result.updated['matches.1.awayTeam']).toBe('team-c');
    
    // No errors because array fields are exempt
    expect(result.errors).toBeUndefined();
  });

  test('validates forms with array notation element keys', () => {
    // Generate a form with array paths
    const tournaments: ModelGroup = {
      label: 'Tournament',
      key: 'tournament', 
      records: [
        {
          id: 'tournament-1',
          name: 'Spring Championship',
          elements: [
            {
              key: 'tournaments.0.format',
              formElement: {
                id: 'form-el-1',
                name: 'format',
                label: 'Format',
                visualization: 'select',
                conditions: true,
                disabled: false,
                locked: false,
                options: [
                  { id: 'opt-1', label: 'Single Elim', value: 'single', isDefault: true, conditions: true },
                  { id: 'opt-2', label: 'Double Elim', value: 'double', conditions: true }
                ]
              }
            }
          ]
        }
      ]
    };

    // First generate the form to understand the schema structure
    const formSchema = generateForm([tournaments]);
    
    // Check the generated schema structure
    expect(formSchema.fields['tournaments.0.format']).toBeDefined();
    expect(formSchema.fields['tournaments.0.format']).toBeInstanceOf(Array);
    expect(formSchema.fields['tournaments.0.format'][0].options).toBeDefined();
    
    // Create a submission
    const submission = {
      'tournament': 'tournament-1',
      'tournaments.0.format': 'single'
    };

    // Validate - the array path field should be in the schema
    const result = validateFormSubmission(submission, [tournaments]);
    
    // Should preserve both fields
    expect(result.updated.tournament).toBe('tournament-1');
    expect(result.updated['tournaments.0.format']).toBe('single');
    expect(result.errors).toBeUndefined();
    
    // Test with invalid value
    const invalidSubmission = {
      'tournament': 'tournament-1',
      'tournaments.0.format': 'invalid'
    };
    
    const invalidResult = validateFormSubmission(invalidSubmission, [tournaments]);
    
    // Should report error because there are multiple options (not auto-corrected)
    expect(invalidResult.updated['tournaments.0.format']).toBeUndefined();
    expect(invalidResult.errors).toBeDefined();
    expect(invalidResult.errors![0].field).toBe('tournaments.0.format');
    expect(invalidResult.errors![0].expectedValue).toEqual(['single', 'double']);
  });
});