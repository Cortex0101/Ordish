import { test, expect } from '@playwright/test';
import { keyboardTestIds } from './Keyboard.testIds';

// Test page setup - this would be used in a Playwright test context
const WORDLE_PAGE_URL = '/wordle';

test.describe('Keyboard Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WORDLE_PAGE_URL);
    // Wait for the keyboard to be rendered
    await page.waitForSelector(`[data-testid="${keyboardTestIds.container}"]`);
  });

  test.describe('Basic Rendering', () => {
    test('should render the keyboard container', async ({ page }) => {
      const keyboard = page.getByTestId(keyboardTestIds.container);
      await expect(keyboard).toBeVisible();
    });

    test('should render all three keyboard rows', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        const row = page.getByTestId(`${keyboardTestIds.row}-${i}`);
        await expect(row).toBeVisible();
      }
    });

    test('should render special keys (Enter and Backspace)', async ({ page }) => {
      const enterKey = page.getByTestId(keyboardTestIds.enter);
      const backspaceKey = page.getByTestId(keyboardTestIds.backspace);
      
      await expect(enterKey).toBeVisible();
      await expect(backspaceKey).toBeVisible();
    });

    test('should render all English alphabet letters', async ({ page }) => {
      const englishLetters = 'qwertyuiopasdfghjklzxcvbnm';
      
      for (const letter of englishLetters) {
        const letterKey = page.getByTestId(`${keyboardTestIds.letter}-${letter}`);
        await expect(letterKey).toBeVisible();
      }
    });
  });

  test.describe('Language Layouts', () => {
    test('should render English layout by default', async ({ page }) => {
      // Check that standard English letters are present
      const qKey = page.getByTestId(`${keyboardTestIds.letter}-q`);
      const zKey = page.getByTestId(`${keyboardTestIds.letter}-z`);
      
      await expect(qKey).toBeVisible();
      await expect(zKey).toBeVisible();
    });

    test('should render Danish layout when language is set to Danish', async ({ page, context }) => {
      // Set Danish locale (this would depend on your i18n implementation)
      await context.addCookies([{ name: 'i18next', value: 'da', domain: 'localhost', path: '/' }]);
      await page.reload();
      
      // Wait for keyboard to re-render
      await page.waitForSelector(`[data-testid="${keyboardTestIds.container}"]`);
      
      // Check for Danish specific letters
      const aaKey = page.getByTestId(`${keyboardTestIds.letter}-å`);
      const aeKey = page.getByTestId(`${keyboardTestIds.letter}-æ`);
      const oeKey = page.getByTestId(`${keyboardTestIds.letter}-ø`);
      
      await expect(aaKey).toBeVisible();
      await expect(aeKey).toBeVisible();
      await expect(oeKey).toBeVisible();
    });
  });

  test.describe('User Interactions', () => {
    test('should respond to letter key clicks', async ({ page }) => {
      const qKey = page.getByTestId(`${keyboardTestIds.letter}-q`);
      
      // Click the key and verify it's clickable
      await qKey.click();
      
      // You would verify game state changes here based on your game logic
      // For example, checking if the letter appears in the current guess
    });

    test('should respond to Enter key clicks', async ({ page }) => {
      const enterKey = page.getByTestId(keyboardTestIds.enter);
      
      await expect(enterKey).toBeVisible();
      await enterKey.click();
      
      // Verify enter key functionality based on your game logic
    });

    test('should respond to Backspace key clicks', async ({ page }) => {
      const backspaceKey = page.getByTestId(keyboardTestIds.backspace);
      
      await expect(backspaceKey).toBeVisible();
      await backspaceKey.click();
      
      // Verify backspace functionality based on your game logic
    });

    test('should handle rapid key presses', async ({ page }) => {
      const keys = ['q', 'u', 'i', 'c', 'k'];
      
      for (const key of keys) {
        const keyElement = page.getByTestId(`${keyboardTestIds.letter}-${key}`);
        await keyElement.click();
      }
      
      // Verify that all key presses were registered
    });
  });

  test.describe('Letter Status Display', () => {
    test('should display different states for letters', async ({ page }) => {
      // This test would require setting up game state with known letter statuses
      // You would need to play a game or mock the state to test different letter colors
      
      // Example: After a guess, check if letters have the correct CSS classes
      const qKey = page.getByTestId(`${keyboardTestIds.letter}-q`);
      
      // Check for different possible states
      const hasCorrectClass = await qKey.evaluate((el) => el.classList.contains('correct'));
      const hasPresentClass = await qKey.evaluate((el) => el.classList.contains('present'));
      const hasAbsentClass = await qKey.evaluate((el) => el.classList.contains('absent'));
      const hasUnusedClass = await qKey.evaluate((el) => el.classList.contains('unused'));
      
      // At least one of these should be true
      expect(hasCorrectClass || hasPresentClass || hasAbsentClass || hasUnusedClass).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper aria-labels for all keys', async ({ page }) => {
      // Check letter keys
      const qKey = page.getByTestId(`${keyboardTestIds.letter}-q`);
      await expect(qKey).toHaveAttribute('aria-label', 'Q');
      
      // Check special keys
      const enterKey = page.getByTestId(keyboardTestIds.enter);
      const backspaceKey = page.getByTestId(keyboardTestIds.backspace);
      
      await expect(enterKey).toHaveAttribute('aria-label', 'Enter');
      await expect(backspaceKey).toHaveAttribute('aria-label', 'Backspace');
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Test tab navigation through keyboard
      await page.keyboard.press('Tab');
      
      // The first focusable element should be focused
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
      
      // Should be one of the keyboard keys
      expect(focusedElement).toBeTruthy();
    });

    test('should support keyboard shortcuts', async ({ page }) => {
      // Test physical keyboard input
      await page.keyboard.press('q');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Backspace');
      
      // Verify that keyboard events are handled (would depend on your implementation)
    });
  });

  test.describe('Visual Design', () => {
    test('should have proper visual styling', async ({ page }) => {
      const keyboard = page.getByTestId(keyboardTestIds.container);
      
      // Check that the keyboard has the expected CSS classes
      await expect(keyboard).toHaveClass(/keyboard-container/);
    });

    test('should be responsive on different screen sizes', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const keyboard = page.getByTestId(keyboardTestIds.container);
      await expect(keyboard).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 });
      await expect(keyboard).toBeVisible();
    });
  });

  test.describe('Special Key Content', () => {
    test('should display correct content in special keys', async ({ page }) => {
      const enterKey = page.getByTestId(keyboardTestIds.enter);
      const backspaceKey = page.getByTestId(keyboardTestIds.backspace);
      
      // Enter key should have text
      await expect(enterKey).toContainText('ENTER');
      
      // Backspace key should have an icon (SVG)
      const backspaceIcon = backspaceKey.locator('svg');
      await expect(backspaceIcon).toBeVisible();
    });
  });
});
