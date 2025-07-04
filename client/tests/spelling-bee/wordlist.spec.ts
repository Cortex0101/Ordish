// Example Playwright test for WordList component
// This demonstrates how to use the test IDs for comprehensive testing

import { test, expect } from '@playwright/test';

test.describe('WordList Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the spelling bee page
    await page.goto('/spelling-bee');
  });

  test('should display word list container', async ({ page }) => {
    await expect(page.getByTestId('word-list-container')).toBeVisible();
  });

  test('should show header with title and count', async ({ page }) => {
    const header = page.getByTestId('word-list-header');
    const title = page.getByTestId('word-list-title');
    const count = page.getByTestId('word-list-count');

    await expect(header).toBeVisible();
    await expect(title).toBeVisible();
    await expect(count).toBeVisible();
    
    // Check title text
    await expect(title).toContainText('You have found');
    
    // Check count format (should show "X of Y words")
    await expect(count).toContainText(/\d+ of \d+ words/);
  });

  test('should show toggle button on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const toggle = page.getByTestId('word-list-toggle');
    await expect(toggle).toBeVisible();
    
    // Check initial icon (should be down arrow when collapsed)
    const icon = page.getByTestId('word-list-toggle-icon');
    await expect(icon).toHaveClass(/bi-chevron-down/);
  });

  test('should expand/collapse on mobile when toggle is clicked', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const toggle = page.getByTestId('word-list-toggle');
    const mobileContent = page.getByTestId('word-list-mobile-content');
    const icon = page.getByTestId('word-list-toggle-icon');
    
    // Initially collapsed
    await expect(mobileContent).not.toBeVisible();
    await expect(icon).toHaveClass(/bi-chevron-down/);
    
    // Click to expand
    await toggle.click();
    await expect(mobileContent).toBeVisible();
    await expect(icon).toHaveClass(/bi-chevron-up/);
    
    // Click to collapse
    await toggle.click();
    await expect(mobileContent).not.toBeVisible();
    await expect(icon).toHaveClass(/bi-chevron-down/);
  });

  test('should always show content on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    
    const desktopContent = page.getByTestId('word-list-desktop-content');
    const toggle = page.getByTestId('word-list-toggle');
    
    await expect(desktopContent).toBeVisible();
    await expect(toggle).not.toBeVisible();
  });

  test('should display words grouped by length', async ({ page }) => {
    // Increment score to show some words
    const progressBar = page.getByTestId('sb-progress');
    await progressBar.click(); // This should add some demo words
    
    // Check if word groups appear
    const wordGroups = page.locator('[data-testid^="word-group-length-"]');
    await expect(wordGroups.first()).toBeVisible();
    
    // Check word group structure
    const firstGroup = wordGroups.first();
    const groupLabel = firstGroup.locator('[data-testid^="word-group-label-"]');
    const wordGrid = firstGroup.locator('[data-testid^="word-group-grid-"]');
    
    await expect(groupLabel).toBeVisible();
    await expect(wordGrid).toBeVisible();
  });

  test('should show words in correct order (length then alphabetical)', async ({ page }) => {
    // Increment score multiple times to get various word lengths
    const progressBar = page.getByTestId('sb-progress');
    for (let i = 0; i < 5; i++) {
      await progressBar.click();
    }
    
    // Get all word items
    const wordItems = page.locator('[data-testid^="word-item-"]');
    const count = await wordItems.count();
    
    if (count > 1) {
      // Check that words are grouped by length (shorter words first)
      const firstWord = await wordItems.first().textContent();
      const lastWord = await wordItems.last().textContent();
      
      if (firstWord && lastWord) {
        expect(firstWord.length).toBeLessThanOrEqual(lastWord.length);
      }
    }
  });

  test('should show empty state when no words are found', async ({ page }) => {
    // Ensure score is 0 (no words found)
    const emptyState = page.getByTestId('word-list-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No words found yet');
  });

  test('should update word count when words are added', async ({ page }) => {
    const countElement = page.getByTestId('word-list-count');
    
    // Get initial count
    const initialCount = await countElement.textContent();
    
    // Add words by clicking progress bar
    const progressBar = page.getByTestId('sb-progress');
    await progressBar.click();
    
    // Check that count has changed
    const newCount = await countElement.textContent();
    expect(newCount).not.toBe(initialCount);
  });
});
