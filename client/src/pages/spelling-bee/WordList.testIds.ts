// Test IDs for WordList component
export const WordListTestIds = {
  // Container
  container: "word-list-container",
  
  // Header
  header: "word-list-header",
  title: "word-list-title",
  count: "word-list-count",
  toggle: "word-list-toggle",
  toggleIcon: "word-list-toggle-icon",
  
  // Content
  mobileContent: "word-list-mobile-content",
  desktopContent: "word-list-desktop-content",
  empty: "word-list-empty",
  
  // Dynamic test IDs (functions)
  wordContent: (platform: 'mobile' | 'desktop') => `word-list-content-${platform}`,
  wordGroup: (length: number) => `word-group-length-${length}`,
  wordGroupLabel: (length: number) => `word-group-label-${length}`,
  wordGroupGrid: (length: number) => `word-group-grid-${length}`,
  wordItem: (word: string) => `word-item-${word}`,
} as const;

export default WordListTestIds;
