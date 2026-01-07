/**
 * Test IDs for the Wordle Board component
 * Used for Playwright and other automated testing
 */
export const boardTestIds = {
  // Main container elements
  container: 'board-container',
  grid: 'board-grid',
  
  // Row elements
  row: 'board-row',
  
  // Tile elements
  tile: 'board-tile',
  letter: 'board-letter',
  
  // Animation state classes (for testing animations)
  revealing: 'tile-revealing',
  current: 'tile-current',
  shake: 'row-shake',
  bounce: 'row-bounce',
  
  // Tile states (for testing tile appearance)
  states: {
    empty: 'tile-empty',
    filled: 'tile-filled',
    submitted: 'tile-submitted'
  },
  
  // Tile statuses (for testing color feedback)
  statuses: {
    correct: 'tile-correct',
    present: 'tile-present', 
    absent: 'tile-absent',
    empty: 'tile-empty-status'
  }
} as const;

// Type for test ID values
export type BoardTestId = typeof boardTestIds[keyof typeof boardTestIds];
