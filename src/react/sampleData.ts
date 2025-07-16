import type { GeneratedFormSchema, ModelGroup } from '../types';

// Sample models that would come from the backend
export const sampleModels: ModelGroup[] = [
  {
    label: 'Game',
    key: 'gameId',
    records: [
      {
        id: 'chess',
        name: 'Chess',
        elements: [
          {
            key: 'timeControl',
            formElement: {
              id: 'time-control-1',
              label: 'Time Control',
              visualization: 'select',
              conditions: true,
              disabled: false,
              locked: false,
              options: [
                { id: 'blitz', label: 'Blitz (5 min)', value: 'blitz', conditions: true, writeIn: false },
                { id: 'rapid', label: 'Rapid (15 min)', value: 'rapid', conditions: true, writeIn: false },
                { id: 'classical', label: 'Classical (30+ min)', value: 'classical', conditions: true, writeIn: false }
              ]
            }
          },
          {
            key: 'rated',
            formElement: {
              id: 'rated-1',
              label: 'Rated Game',
              visualization: 'switch',
              conditions: true,
              disabled: false,
      locked: false,
      defaultValue: true
            }
          }
        ]
      },
      {
        id: 'poker',
        name: 'Poker',
        elements: [
          {
            key: 'variant',
            formElement: {
              id: 'poker-variant-1',
              label: 'Poker Variant',
              visualization: 'radio',
              conditions: true,
              disabled: false,
              locked: false,
              options: [
                { id: 'holdem', label: 'Texas Hold\'em', value: 'holdem', conditions: true, writeIn: false },
                { id: 'omaha', label: 'Omaha', value: 'omaha', conditions: true, writeIn: false },
                { id: 'stud', label: 'Seven Card Stud', value: 'stud', conditions: true, writeIn: false }
              ]
            }
          },
          {
            key: 'buyIn',
            formElement: {
              id: 'buy-in-1',
              label: 'Buy-in Amount',
              visualization: 'number',
              conditions: true,
              disabled: false,
      locked: false,
      defaultValue: 20
            }
          },
          {
            key: 'rebuyAllowed',
            formElement: {
              id: 'rebuy-1',
              label: 'Allow Rebuys',
              visualization: 'checkbox',
              conditions: {
                field: 'variant',
                operator: 'equals',
                value: 'holdem'
              },
              disabled: false,
              locked: false
            }
          }
        ]
      },
      {
        id: 'mtg',
        name: 'Magic: The Gathering',
        elements: [
          {
            key: 'format',
            formElement: {
              id: 'mtg-format-1',
              label: 'Format',
              visualization: 'select',
              conditions: true,
              disabled: false,
              locked: false,
              options: [
                { id: 'standard', label: 'Standard', value: 'standard', conditions: true, writeIn: false },
                { id: 'modern', label: 'Modern', value: 'modern', conditions: true, writeIn: false },
                { id: 'legacy', label: 'Legacy', value: 'legacy', conditions: true, writeIn: false },
                { id: 'commander', label: 'Commander', value: 'commander', conditions: true, writeIn: false }
              ]
            }
          },
          {
            key: 'deckCheckRequired',
            formElement: {
              id: 'deck-check-1',
              label: 'Deck Check Required',
              visualization: 'switch',
              conditions: {
                field: 'format',
                operator: 'in',
                value: ['standard', 'modern', 'legacy']
              },
              disabled: false,
      locked: false,
      defaultValue: false
            }
          },
          {
            key: 'commanderBanList',
            formElement: {
              id: 'commander-banlist-1',
              label: 'Commander Ban List',
              visualization: 'radio',
              conditions: {
                field: 'format',
                operator: 'equals',
                value: 'commander'
              },
              disabled: false,
              locked: false,
              options: [
                { id: 'official', label: 'Official RC Ban List', value: 'official', conditions: true, writeIn: false },
                { id: 'house', label: 'House Rules', value: 'house', conditions: true, writeIn: false }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    label: 'Template',
    key: 'templateId',
    records: [
      {
        id: 'tournament',
        name: 'Tournament',
        elements: [
          {
            key: 'rounds',
            formElement: {
              id: 'rounds-1',
              label: 'Number of Rounds',
              visualization: 'number',
              conditions: true,
              disabled: false,
              locked: false,
              defaultValue: 5,
              helperText: 'Number of swiss rounds before elimination'
            }
          },
          {
            key: 'elimination',
            formElement: {
              id: 'elimination-1',
              label: 'Elimination Format',
              visualization: 'radio',
              conditions: {
                field: 'rounds',
                operator: 'greaterThan',
                value: 0
              },
              disabled: false,
              locked: false,
              options: [
                { id: 'single', label: 'Single Elimination', value: 'single', conditions: true, writeIn: false },
                { id: 'double', label: 'Double Elimination', value: 'double', conditions: true, writeIn: false }
              ]
            }
          }
        ]
      },
      {
        id: 'casual',
        name: 'Casual Play',
        elements: [
          {
            key: 'dropInDropOut',
            formElement: {
              id: 'drop-in-1',
              label: 'Allow Drop-in/Drop-out',
              visualization: 'switch',
              conditions: true,
              disabled: false,
      locked: false,
      defaultValue: true
            }
          },
          {
            key: 'timeLimit',
            formElement: {
              id: 'time-limit-1',
              label: 'Session Time Limit (hours)',
              visualization: 'slider',
              conditions: {
                field: 'dropInDropOut',
                operator: 'equals',
                value: false
              },
              disabled: false,
      locked: false,
      defaultValue: 2,
              config: { min: 1, max: 8, step: 0.5 }
            }
          }
        ]
      }
    ]
  }
];

// Sample generated form schema (what the backend would return)
export const sampleFormSchema: GeneratedFormSchema = {
  order: ['gameId', 'templateId', 'timeControl', 'rated', 'variant', 'buyIn', 'rebuyAllowed', 'format', 'deckCheckRequired', 'commanderBanList', 'rounds', 'elimination', 'dropInDropOut', 'timeLimit'],
  fields: {
    gameId: [
      {
        label: 'Game',
        visualization: 'radio', // Determined by number of options (≤4 = radio)
        conditions: true,
        disabled: false,
        locked: false,
        isModel: true, // This is a model selection field
        options: [
          { id: 'chess', label: 'Chess', value: 'chess', conditions: true, writeIn: false },
          { id: 'poker', label: 'Poker', value: 'poker', conditions: true, writeIn: false },
          { id: 'mtg', label: 'Magic: The Gathering', value: 'mtg', conditions: true, writeIn: false }
        ]
      }
    ],
    templateId: [
      {
        label: 'Template',
        visualization: 'radio',
        conditions: true,
        disabled: false,
        locked: false,
        isModel: true, // This is a model selection field
        options: [
          { id: 'tournament', label: 'Tournament', value: 'tournament', conditions: true, writeIn: false },
          { id: 'casual', label: 'Casual Play', value: 'casual', conditions: true, writeIn: false }
        ]
      }
    ],
    timeControl: [
      {
        label: 'Time Control',
        visualization: 'select',
        conditions: {
          field: 'gameId',
          operator: 'equals',
          value: 'chess'
        },
        disabled: false,
        locked: false,
        options: [
          { id: 'blitz', label: 'Blitz (5 min)', value: 'blitz', conditions: true, writeIn: false },
          { id: 'rapid', label: 'Rapid (15 min)', value: 'rapid', conditions: true, writeIn: false },
          { id: 'classical', label: 'Classical (30+ min)', value: 'classical', conditions: true, writeIn: false }
        ]
      }
    ],
    rated: [
      {
        label: 'Rated Game',
        visualization: 'switch',
        conditions: {
          field: 'gameId',
          operator: 'equals',
          value: 'chess'
        },
        disabled: false,
      locked: false,
      defaultValue: true
      }
    ],
    variant: [
      {
        label: 'Poker Variant',
        visualization: 'radio',
        conditions: {
          field: 'gameId',
          operator: 'equals',
          value: 'poker'
        },
        disabled: false,
        locked: false,
        options: [
          { id: 'holdem', label: 'Texas Hold\'em', value: 'holdem', conditions: true, writeIn: false },
          { id: 'omaha', label: 'Omaha', value: 'omaha', conditions: true, writeIn: false },
          { id: 'stud', label: 'Seven Card Stud', value: 'stud', conditions: true, writeIn: false }
        ]
      }
    ],
    buyIn: [
      {
        label: 'Buy-in Amount',
        visualization: 'number',
        conditions: {
          field: 'gameId',
          operator: 'equals',
          value: 'poker'
        },
        disabled: false,
      locked: false,
      defaultValue: 20
      }
    ],
    rebuyAllowed: [
      {
        label: 'Allow Rebuys',
        visualization: 'checkbox',
        conditions: {
          all: [
            { field: 'gameId', operator: 'equals', value: 'poker' },
            { field: 'variant', operator: 'equals', value: 'holdem' }
          ]
        },
        disabled: false,
        locked: false
      }
    ],
    format: [
      {
        label: 'Format',
        visualization: 'select',
        conditions: {
          field: 'gameId',
          operator: 'equals',
          value: 'mtg'
        },
        disabled: false,
        locked: false,
        options: [
          { id: 'standard', label: 'Standard', value: 'standard', conditions: true, writeIn: false },
          { id: 'modern', label: 'Modern', value: 'modern', conditions: true, writeIn: false },
          { id: 'legacy', label: 'Legacy', value: 'legacy', conditions: true, writeIn: false },
          { id: 'commander', label: 'Commander', value: 'commander', conditions: true, writeIn: false }
        ]
      }
    ],
    deckCheckRequired: [
      {
        label: 'Deck Check Required',
        visualization: 'switch',
        conditions: {
          all: [
            { field: 'gameId', operator: 'equals', value: 'mtg' },
            { field: 'format', operator: 'in', value: ['standard', 'modern', 'legacy'] }
          ]
        },
        disabled: false,
      locked: false,
      defaultValue: false
      }
    ],
    commanderBanList: [
      {
        label: 'Commander Ban List',
        visualization: 'radio',
        conditions: {
          all: [
            { field: 'gameId', operator: 'equals', value: 'mtg' },
            { field: 'format', operator: 'equals', value: 'commander' }
          ]
        },
        disabled: false,
        locked: false,
        options: [
          { id: 'official', label: 'Official RC Ban List', value: 'official', conditions: true, writeIn: false },
          { id: 'house', label: 'House Rules', value: 'house', conditions: true, writeIn: false }
        ]
      }
    ],
    rounds: [
      {
        label: 'Number of Rounds',
        visualization: 'number',
        conditions: {
          field: 'templateId',
          operator: 'equals',
          value: 'tournament'
        },
        disabled: false,
        locked: false,
        defaultValue: 5,
        helperText: 'Number of swiss rounds before elimination'
      }
    ],
    elimination: [
      {
        label: 'Elimination Format',
        visualization: 'radio',
        conditions: {
          all: [
            { field: 'templateId', operator: 'equals', value: 'tournament' },
            { field: 'rounds', operator: 'greaterThan', value: 0 }
          ]
        },
        disabled: false,
        locked: false,
        options: [
          { id: 'single', label: 'Single Elimination', value: 'single', conditions: true, writeIn: false },
          { id: 'double', label: 'Double Elimination', value: 'double', conditions: true, writeIn: false }
        ]
      }
    ],
    dropInDropOut: [
      {
        label: 'Allow Drop-in/Drop-out',
        visualization: 'switch',
        conditions: {
          field: 'templateId',
          operator: 'equals',
          value: 'casual'
        },
        disabled: false,
      locked: false,
      defaultValue: true
      }
    ],
    timeLimit: [
      {
        label: 'Session Time Limit (hours)',
        visualization: 'slider',
        conditions: {
          all: [
            { field: 'templateId', operator: 'equals', value: 'casual' },
            { field: 'dropInDropOut', operator: 'equals', value: false }
          ]
        },
        disabled: false,
      locked: false,
      defaultValue: 2,
        config: { min: 1, max: 8, step: 0.5 }
      }
    ]
  }
};

// Sample form values
export const sampleFormValues = {
  gameId: 'chess',
  templateId: 'tournament',
  timeControl: 'rapid',
  rated: true,
  rounds: 5
};