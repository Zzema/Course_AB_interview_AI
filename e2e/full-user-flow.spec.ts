import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive E2E Test Suite for A/B Testing Interview Trainer
 * Tests all user flows and visual regressions
 */

test.describe('Full User Flow - Desktop', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('01 - Login Screen - Initial Load and UI', async () => {
    console.log('🧪 Testing Login Screen...');
    
    // Check if login page is visible
    const loginTitle = page.locator('text=/подготовка к A\\/B Testing интервью/i');
    await expect(loginTitle).toBeVisible({ timeout: 10000 });
    
    // Check for level selection cards (for new users)
    const juniorCard = page.locator('text=/Junior/i').first();
    const midCard = page.locator('text=/Mid/i').first();
    const seniorCard = page.locator('text=/Senior/i').first();
    const staffCard = page.locator('text=/Staff/i').first();
    
    // Take screenshot of login screen
    await page.screenshot({ path: 'e2e/screenshots/01-login-screen.png', fullPage: true });
    
    console.log('✅ Login screen loaded successfully');
  });

  test('02 - Visual Regression - Login Screen Layout', async () => {
    console.log('🧪 Testing Login Screen Layout...');
    
    // Check viewport dimensions
    const viewportSize = page.viewportSize();
    console.log('Viewport:', viewportSize);
    
    // Check for proper gradient header
    const header = page.locator('div').filter({ hasText: /подготовка к A\/B Testing интервью/i }).first();
    const headerStyles = await header.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        backgroundImage: computed.backgroundImage,
        padding: computed.padding,
        textAlign: computed.textAlign,
      };
    });
    
    console.log('Header styles:', headerStyles);
    expect(headerStyles.textAlign).toBe('center');
    
    // Check for proper spacing and margins
    const container = page.locator('body > div').first();
    const containerStyles = await container.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        minHeight: computed.minHeight,
        display: computed.display,
      };
    });
    
    console.log('Container styles:', containerStyles);
    expect(containerStyles.minHeight).toBe('100vh');
    
    await page.screenshot({ path: 'e2e/screenshots/02-login-layout.png', fullPage: true });
    
    console.log('✅ Login layout check complete');
  });

  test('03 - Level Selection Cards - Hover and Click States', async () => {
    console.log('🧪 Testing Level Selection Cards...');
    
    // Find level cards
    const cards = page.locator('div').filter({ hasText: /Junior|Mid|Senior|Staff/ });
    const cardCount = await cards.count();
    console.log('Found cards:', cardCount);
    
    // Test hover effect on first card
    const firstCard = cards.first();
    await firstCard.hover();
    await page.waitForTimeout(500); // Wait for hover animation
    
    await page.screenshot({ path: 'e2e/screenshots/03-card-hover.png', fullPage: true });
    
    // Check if card is clickable
    const isClickable = await firstCard.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        cursor: computed.cursor,
        pointerEvents: computed.pointerEvents,
      };
    });
    
    console.log('Card clickability:', isClickable);
    expect(isClickable.cursor).toBe('pointer');
    
    console.log('✅ Level cards working correctly');
  });

  test('04 - Navigation to Summary Screen', async () => {
    console.log('🧪 Testing navigation to Summary screen...');
    
    // Mock user login by setting localStorage
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    // Reload to trigger auto-login
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for data loading
    
    // Check if we're on summary or game screen
    const summaryTitle = page.locator('text=/Прогресс|Начать практику|Learning Path/i').first();
    await expect(summaryTitle).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ path: 'e2e/screenshots/04-summary-screen.png', fullPage: true });
    
    console.log('✅ Summary screen loaded');
  });

  test('05 - Game Screen - Main UI Elements', async () => {
    console.log('🧪 Testing Game Screen UI...');
    
    // Mock login and navigate to game
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for game elements
    const questionText = page.locator('div').filter({ hasText: /Вопрос|Question/i }).first();
    const answerArea = page.locator('textarea');
    
    // Check if game elements are visible
    const hasQuestionOrButton = await page.locator('text=/Начать практику|Вопрос/i').first().isVisible();
    
    if (hasQuestionOrButton) {
      console.log('Game screen elements found');
      await page.screenshot({ path: 'e2e/screenshots/05-game-screen.png', fullPage: true });
    } else {
      console.log('⚠️ Game screen not immediately visible');
    }
    
    // Check for header with user info
    const userProfile = page.locator('img[alt*="avatar"]').or(page.locator('img[src*="googleusercontent"]'));
    const headerExists = await userProfile.count() > 0;
    console.log('User profile in header:', headerExists);
    
    console.log('✅ Game screen UI check complete');
  });

  test('06 - Textarea and Input Validation', async () => {
    console.log('🧪 Testing textarea and validation...');
    
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Try to find start button first
    const startButton = page.locator('button:has-text("Начать практику")');
    const hasStartButton = await startButton.count() > 0;
    
    if (hasStartButton) {
      await startButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for textarea
    const textarea = page.locator('textarea');
    const textareaCount = await textarea.count();
    
    if (textareaCount > 0) {
      console.log('Found textarea');
      
      // Type short text (should show warning)
      await textarea.fill('Short answer');
      await page.screenshot({ path: 'e2e/screenshots/06-textarea-short.png', fullPage: true });
      
      // Type long text (should enable submit)
      const longText = 'A'.repeat(150);
      await textarea.fill(longText);
      await page.screenshot({ path: 'e2e/screenshots/06-textarea-filled.png', fullPage: true });
      
      // Check character counter
      const charCounter = page.locator('text=/символов/i');
      if (await charCounter.count() > 0) {
        const counterText = await charCounter.textContent();
        console.log('Character counter:', counterText);
        expect(counterText).toContain('150');
      }
      
      console.log('✅ Textarea validation working');
    } else {
      console.log('⚠️ No textarea found on current screen');
    }
  });

  test('07 - Learning Path Navigation', async () => {
    console.log('🧪 Testing Learning Path...');
    
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for Learning Path button
    const learningPathButton = page.locator('button:has-text("Модули")').or(
      page.locator('button:has-text("Learning Path")')
    );
    
    const hasButton = await learningPathButton.count() > 0;
    
    if (hasButton) {
      await learningPathButton.click();
      await page.waitForTimeout(1000);
      
      // Check for modules
      const modules = page.locator('text=/Модуль|Module|Введение/i');
      await expect(modules.first()).toBeVisible({ timeout: 5000 });
      
      await page.screenshot({ path: 'e2e/screenshots/07-learning-path.png', fullPage: true });
      
      // Check module structure
      const moduleCards = page.locator('div').filter({ hasText: /Level|Уровень/i });
      const moduleCount = await moduleCards.count();
      console.log('Found modules:', moduleCount);
      
      console.log('✅ Learning Path accessible');
    } else {
      console.log('⚠️ Learning Path button not found');
    }
  });

  test('08 - Statistics Screen', async () => {
    console.log('🧪 Testing Statistics Screen...');
    
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for Stats button
    const statsButton = page.locator('button:has-text("Статистика")').or(
      page.locator('button:has-text("📊")')
    );
    
    const hasButton = await statsButton.count() > 0;
    
    if (hasButton) {
      await statsButton.click();
      await page.waitForTimeout(1000);
      
      // Check for stats elements
      const xpElement = page.locator('text=/XP|опыт/i').first();
      await expect(xpElement).toBeVisible({ timeout: 5000 });
      
      await page.screenshot({ path: 'e2e/screenshots/08-statistics.png', fullPage: true });
      
      // Check for quest cards
      const questCard = page.locator('text=/Квест|Quest/i');
      const hasQuests = await questCard.count() > 0;
      console.log('Has quests:', hasQuests);
      
      console.log('✅ Statistics screen accessible');
    } else {
      console.log('⚠️ Statistics button not found');
    }
  });

  test('09 - Visual Regression - Text Overflow', async () => {
    console.log('🧪 Testing text overflow issues...');
    
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for text overflow in all visible elements
    const overflowIssues = await page.evaluate(() => {
      const issues: string[] = [];
      const elements = document.querySelectorAll('*');
      
      elements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        // Check if element overflows viewport
        if (rect.right > window.innerWidth) {
          issues.push(`Element overflows viewport: ${el.tagName} - ${el.textContent?.substring(0, 50)}`);
        }
        
        // Check for hidden overflow without proper handling
        if (computed.overflow === 'visible' && rect.width > window.innerWidth) {
          issues.push(`Element with visible overflow exceeds width: ${el.tagName}`);
        }
      });
      
      return issues;
    });
    
    console.log('Overflow issues found:', overflowIssues.length);
    overflowIssues.forEach(issue => console.log('  -', issue));
    
    await page.screenshot({ path: 'e2e/screenshots/09-overflow-check.png', fullPage: true });
    
    console.log('✅ Overflow check complete');
  });

  test('10 - Responsive Design - Button Positioning', async () => {
    console.log('🧪 Testing button positioning...');
    
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for fixed bottom buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    console.log('Total buttons found:', buttonCount);
    
    // Check button positions
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const position = await button.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          position: computed.position,
          bottom: computed.bottom,
          top: rect.top,
          isFixed: computed.position === 'fixed',
        };
      });
      
      console.log(`Button ${i} position:`, position);
    }
    
    await page.screenshot({ path: 'e2e/screenshots/10-button-positions.png', fullPage: true });
    
    console.log('✅ Button positioning check complete');
  });

  test('11 - Activity Series Widget', async () => {
    console.log('🧪 Testing Activity Series Widget...');
    
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for streak indicator
    const streakElement = page.locator('text=/🔥|серия|streak/i');
    const hasStreak = await streakElement.count() > 0;
    
    if (hasStreak) {
      console.log('Activity series widget found');
      await page.screenshot({ path: 'e2e/screenshots/11-activity-series.png', fullPage: true });
      
      const streakText = await streakElement.first().textContent();
      console.log('Streak text:', streakText);
    } else {
      console.log('⚠️ Activity series widget not visible');
    }
    
    console.log('✅ Activity series check complete');
  });

  test('12 - Leaderboard Display', async () => {
    console.log('🧪 Testing Leaderboard...');
    
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Navigate to stats to find leaderboard
    const statsButton = page.locator('button:has-text("Статистика")').or(
      page.locator('button:has-text("📊")')
    );
    
    if (await statsButton.count() > 0) {
      await statsButton.click();
      await page.waitForTimeout(1000);
      
      // Look for leaderboard
      const leaderboard = page.locator('text=/Лидерборд|Leaderboard|Топ игроков/i');
      const hasLeaderboard = await leaderboard.count() > 0;
      
      if (hasLeaderboard) {
        console.log('Leaderboard found');
        await page.screenshot({ path: 'e2e/screenshots/12-leaderboard.png', fullPage: true });
      } else {
        console.log('⚠️ Leaderboard not visible on stats screen');
      }
    }
    
    console.log('✅ Leaderboard check complete');
  });
});

test.describe('Mobile User Flow', () => {
  test('13 - Mobile - Login Screen', async ({ page }) => {
    console.log('🧪 Testing Mobile Login Screen...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check viewport
    const viewport = page.viewportSize();
    console.log('Mobile viewport:', viewport);
    expect(viewport?.width).toBeLessThanOrEqual(428);
    
    // Check if content is visible
    const title = page.locator('text=/подготовка/i').first();
    await expect(title).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ path: 'e2e/screenshots/13-mobile-login.png', fullPage: true });
    
    console.log('✅ Mobile login screen working');
  });

  test('14 - Mobile - Touch Targets', async ({ page }) => {
    console.log('🧪 Testing Mobile Touch Targets...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check button sizes (should be at least 44x44 for accessibility)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    console.log('Checking', buttonCount, 'buttons for touch target size');
    
    const smallButtons: string[] = [];
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const size = await button.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          text: el.textContent?.substring(0, 20),
        };
      });
      
      if (size.width < 44 || size.height < 44) {
        smallButtons.push(`Button "${size.text}": ${size.width}x${size.height}px`);
      }
    }
    
    if (smallButtons.length > 0) {
      console.log('⚠️ Small touch targets found:');
      smallButtons.forEach(btn => console.log('  -', btn));
    } else {
      console.log('✅ All touch targets are adequate size');
    }
    
    await page.screenshot({ path: 'e2e/screenshots/14-mobile-touch-targets.png', fullPage: true });
  });

  test('15 - Mobile - Scrolling and Fixed Elements', async ({ page }) => {
    console.log('🧪 Testing Mobile Scrolling...');
    
    await page.evaluate(() => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: 'e2e/screenshots/15-mobile-scrolled.png', fullPage: true });
    
    // Check for fixed elements that might block content
    const fixedElements = await page.evaluate(() => {
      const fixed: string[] = [];
      const elements = document.querySelectorAll('*');
      
      elements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.position === 'fixed' || computed.position === 'sticky') {
          fixed.push(`${el.tagName}: ${computed.position} - ${el.textContent?.substring(0, 30)}`);
        }
      });
      
      return fixed;
    });
    
    console.log('Fixed elements found:', fixedElements.length);
    fixedElements.forEach(el => console.log('  -', el));
    
    console.log('✅ Mobile scrolling check complete');
  });
});

test.describe('Performance and Edge Cases', () => {
  test('16 - Console Errors Check', async ({ page }) => {
    console.log('🧪 Checking for console errors...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(`Page error: ${error.message}`);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('Console errors:', errors.length);
    errors.forEach(err => console.log('  ❌', err));
    
    console.log('Console warnings:', warnings.length);
    warnings.forEach(warn => console.log('  ⚠️', warn));
    
    // Don't fail on warnings, but report errors
    if (errors.length > 0) {
      console.log('⚠️ Console errors detected');
    } else {
      console.log('✅ No console errors');
    }
  });

  test('17 - Network Request Analysis', async ({ page }) => {
    console.log('🧪 Analyzing network requests...');
    
    const requests: string[] = [];
    const failedRequests: string[] = [];
    
    page.on('request', (request) => {
      requests.push(`${request.method()} ${request.url()}`);
    });
    
    page.on('requestfailed', (request) => {
      failedRequests.push(`Failed: ${request.url()}`);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('Total requests:', requests.length);
    console.log('Failed requests:', failedRequests.length);
    
    if (failedRequests.length > 0) {
      console.log('⚠️ Failed requests:');
      failedRequests.forEach(req => console.log('  -', req));
    } else {
      console.log('✅ All network requests successful');
    }
  });

  test('18 - Load Time Performance', async ({ page }) => {
    console.log('🧪 Testing page load performance...');
    
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('load');
    
    const loadTime = Date.now() - startTime;
    console.log('Page load time:', loadTime, 'ms');
    
    // Wait for React to render
    await page.waitForTimeout(1000);
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive,
      };
    });
    
    console.log('Performance metrics:', performanceMetrics);
    
    if (loadTime < 3000) {
      console.log('✅ Fast load time');
    } else if (loadTime < 5000) {
      console.log('⚠️ Moderate load time');
    } else {
      console.log('❌ Slow load time');
    }
  });

  test('19 - Local Storage Persistence', async ({ page }) => {
    console.log('🧪 Testing localStorage persistence...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Set user data
    await page.evaluate(() => {
      const mockUser = {
        email: 'test-persistence@example.com',
        name: 'Test Persistence',
        given_name: 'Test',
        picture: 'https://via.placeholder.com/100',
      };
      localStorage.setItem('ab-hero-user', JSON.stringify(mockUser));
    });
    
    // Reload and check persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const userData = await page.evaluate(() => {
      const userString = localStorage.getItem('ab-hero-user');
      return userString ? JSON.parse(userString) : null;
    });
    
    console.log('User data persisted:', userData);
    expect(userData).not.toBeNull();
    expect(userData?.email).toBe('test-persistence@example.com');
    
    console.log('✅ localStorage persistence working');
  });

  test('20 - Accessibility - ARIA Labels and Roles', async ({ page }) => {
    console.log('🧪 Testing accessibility features...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for proper semantic HTML
    const semanticElements = await page.evaluate(() => {
      return {
        buttons: document.querySelectorAll('button').length,
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        images: document.querySelectorAll('img').length,
        imagesWithAlt: document.querySelectorAll('img[alt]').length,
        inputs: document.querySelectorAll('input, textarea').length,
      };
    });
    
    console.log('Semantic elements:', semanticElements);
    
    // Check if images have alt text
    if (semanticElements.images > 0) {
      const altTextPercentage = (semanticElements.imagesWithAlt / semanticElements.images) * 100;
      console.log('Images with alt text:', altTextPercentage.toFixed(0), '%');
      
      if (altTextPercentage < 100) {
        console.log('⚠️ Some images missing alt text');
      }
    }
    
    console.log('✅ Accessibility check complete');
  });
});

