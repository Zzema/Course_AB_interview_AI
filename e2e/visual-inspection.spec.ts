import { test, expect, Page } from '@playwright/test';

/**
 * Simplified Visual Inspection Tests
 * Run these after manual login to check UI/UX issues
 */

test.describe('Visual Inspection - With Test Mode Bypass', () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to the app with test mode enabled
    await page.goto('/?test-mode=true');
    await page.waitForTimeout(2000); // Wait for initial load
    
    // Auto-login with test bypass if on login screen
    const bypassButton = page.locator('[data-testid="bypass-auth-button"]');
    if (await bypassButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('🧪 Using test mode bypass for authentication');
      await bypassButton.click();
      await page.waitForTimeout(2000); // Wait for login to complete
    }
  });

  test('01 - Initial Screen Check', async ({ page }) => {
    console.log('🔍 Checking initial screen...');
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'e2e/screenshots/01-initial-screen.png', 
      fullPage: true 
    });
    
    // Check what screen we're on
    const hasLoginButton = await page.locator('text=/Google/i').count() > 0;
    const hasContinueButton = await page.locator('button:has-text("Продолжить")').count() > 0;
    const hasStartButton = await page.locator('button:has-text("Начать")').count() > 0;
    const hasModulesButton = await page.locator('button:has-text("Модули")').count() > 0;
    
    console.log('Screen state:', {
      hasLoginButton,
      hasContinueButton,
      hasStartButton,
      hasModulesButton
    });
    
    // Get all visible text to understand current state
    const bodyText = await page.locator('body').textContent();
    console.log('Body contains:', bodyText?.substring(0, 200));
  });

  test('02 - Overflow and Layout Issues', async ({ page }) => {
    console.log('🔍 Checking for layout issues...');
    
    await page.waitForTimeout(2000);
    
    // Check for horizontal overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    console.log('Has horizontal scroll:', hasHorizontalScroll);
    if (hasHorizontalScroll) {
      console.log('⚠️ WARNING: Page has horizontal scroll!');
    }
    
    // Find elements that overflow
    const overflowingElements = await page.evaluate(() => {
      const issues: Array<{tag: string, text: string, width: number, viewportWidth: number}> = [];
      const elements = document.querySelectorAll('*');
      const viewportWidth = window.innerWidth;
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > viewportWidth + 10) { // 10px tolerance
          issues.push({
            tag: el.tagName,
            text: el.textContent?.substring(0, 50) || '',
            width: rect.width,
            viewportWidth: viewportWidth
          });
        }
      });
      
      return issues.slice(0, 10); // First 10 issues
    });
    
    if (overflowingElements.length > 0) {
      console.log('⚠️ Overflowing elements found:');
      overflowingElements.forEach((el, i) => {
        console.log(`  ${i + 1}. ${el.tag}: "${el.text}" (width: ${el.width}px, viewport: ${el.viewportWidth}px)`);
      });
    } else {
      console.log('✅ No overflow issues detected');
    }
    
    await page.screenshot({ 
      path: 'e2e/screenshots/02-layout-check.png', 
      fullPage: true 
    });
  });

  test('03 - Button Touch Targets', async ({ page }) => {
    console.log('🔍 Checking button sizes...');
    
    await page.waitForTimeout(2000);
    
    const buttons = await page.evaluate(() => {
      const buttonElements = document.querySelectorAll('button');
      const buttonData: Array<{text: string, width: number, height: number, isTooSmall: boolean}> = [];
      
      buttonElements.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const text = btn.textContent?.trim().substring(0, 30) || '';
        const isTooSmall = rect.width < 44 || rect.height < 44;
        
        if (rect.width > 0 && rect.height > 0) { // Only visible buttons
          buttonData.push({
            text,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            isTooSmall
          });
        }
      });
      
      return buttonData;
    });
    
    console.log(`Found ${buttons.length} visible buttons`);
    
    const smallButtons = buttons.filter(b => b.isTooSmall);
    if (smallButtons.length > 0) {
      console.log('⚠️ Small buttons (< 44x44px):');
      smallButtons.forEach((btn, i) => {
        console.log(`  ${i + 1}. "${btn.text}" - ${btn.width}x${btn.height}px`);
      });
    } else {
      console.log('✅ All buttons meet minimum touch target size (44x44px)');
    }
    
    await page.screenshot({ 
      path: 'e2e/screenshots/03-buttons.png', 
      fullPage: true 
    });
  });

  test('04 - Text Readability', async ({ page }) => {
    console.log('🔍 Checking text readability...');
    
    await page.waitForTimeout(2000);
    
    const textIssues = await page.evaluate(() => {
      const issues: Array<{text: string, fontSize: string, color: string}> = [];
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, a');
      
      textElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        const text = el.textContent?.trim();
        
        if (text && text.length > 0 && text.length < 100) {
          const fontSize = parseFloat(computed.fontSize);
          
          // Check if text is too small
          if (fontSize < 12) {
            issues.push({
              text: text.substring(0, 50),
              fontSize: computed.fontSize,
              color: computed.color
            });
          }
        }
      });
      
      return issues.slice(0, 15);
    });
    
    if (textIssues.length > 0) {
      console.log('⚠️ Small text found (< 12px):');
      textIssues.forEach((issue, i) => {
        console.log(`  ${i + 1}. "${issue.text}" - ${issue.fontSize}`);
      });
    } else {
      console.log('✅ All text meets minimum size requirements');
    }
    
    await page.screenshot({ 
      path: 'e2e/screenshots/04-text-readability.png', 
      fullPage: true 
    });
  });

  test('05 - Navigation Flow', async ({ page }) => {
    console.log('🔍 Testing navigation between screens...');
    
    await page.waitForTimeout(2000);
    
    // Try to find and click "Модули" button
    const modulesButton = page.locator('button:has-text("Модули")').or(
      page.locator('button:has-text("🎓")')
    );
    
    if (await modulesButton.count() > 0) {
      console.log('Found "Модули" button, clicking...');
      await modulesButton.first().click();
      await page.waitForTimeout(1500);
      
      await page.screenshot({ 
        path: 'e2e/screenshots/05-learning-path.png', 
        fullPage: true 
      });
      
      // Go back
      const backButton = page.locator('button:has-text("← Назад")').or(
        page.locator('button:has-text("←")')
      );
      
      if (await backButton.count() > 0) {
        console.log('Going back...');
        await backButton.first().click();
        await page.waitForTimeout(1000);
      }
    } else {
      console.log('⚠️ "Модули" button not found on current screen');
    }
    
    // Try to find and click "Статистика" button
    const statsButton = page.locator('button:has-text("Статистика")').or(
      page.locator('button:has-text("📊")')
    );
    
    if (await statsButton.count() > 0) {
      console.log('Found "Статистика" button, clicking...');
      await statsButton.first().click();
      await page.waitForTimeout(1500);
      
      await page.screenshot({ 
        path: 'e2e/screenshots/05-statistics.png', 
        fullPage: true 
      });
      
      // Go back
      const backButton = page.locator('button:has-text("← Назад")').or(
        page.locator('button:has-text("←")')
      );
      
      if (await backButton.count() > 0) {
        console.log('Going back...');
        await backButton.first().click();
        await page.waitForTimeout(1000);
      }
    } else {
      console.log('⚠️ "Статистика" button not found on current screen');
    }
  });

  test('06 - Console Errors', async ({ page }) => {
    console.log('🔍 Monitoring console for errors...');
    
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
    
    // Navigate through app
    await page.waitForTimeout(2000);
    
    // Click around if possible
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      console.log(`Clicking first button to trigger interactions...`);
      try {
        await buttons.first().click({ timeout: 2000 });
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log('Could not click button');
      }
    }
    
    console.log('\n📊 Console Report:');
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 150)}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      warnings.slice(0, 5).forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn.substring(0, 150)}`);
      });
    }
    
    if (errors.length === 0) {
      console.log('✅ No console errors detected');
    }
  });

  test('07 - Mobile View Check', async ({ page }) => {
    console.log('🔍 Testing mobile viewport...');
    
    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'e2e/screenshots/07-mobile-view.png', 
      fullPage: true 
    });
    
    // Check for horizontal scroll on mobile
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    if (hasHorizontalScroll) {
      console.log('⚠️ WARNING: Mobile view has horizontal scroll!');
      
      // Find the widest element
      const widestElement = await page.evaluate(() => {
        let maxWidth = 0;
        let widestEl = '';
        const elements = document.querySelectorAll('*');
        
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > maxWidth) {
            maxWidth = rect.width;
            widestEl = `${el.tagName}: "${el.textContent?.substring(0, 40)}"`;
          }
        });
        
        return { widestEl, maxWidth };
      });
      
      console.log(`Widest element: ${widestElement.widestEl} (${widestElement.maxWidth}px)`);
    } else {
      console.log('✅ Mobile view has no horizontal scroll');
    }
    
    // Check button sizes on mobile
    const buttons = await page.evaluate(() => {
      const buttonElements = document.querySelectorAll('button');
      let tooSmall = 0;
      
      buttonElements.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
          tooSmall++;
        }
      });
      
      return { total: buttonElements.length, tooSmall };
    });
    
    console.log(`Mobile buttons: ${buttons.total} total, ${buttons.tooSmall} too small`);
  });

  test('08 - Fixed Elements and Scroll', async ({ page }) => {
    console.log('🔍 Testing fixed elements during scroll...');
    
    await page.waitForTimeout(2000);
    
    // Take screenshot at top
    await page.screenshot({ 
      path: 'e2e/screenshots/08-scroll-top.png', 
      fullPage: false 
    });
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'e2e/screenshots/08-scroll-middle.png', 
      fullPage: false 
    });
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'e2e/screenshots/08-scroll-bottom.png', 
      fullPage: false 
    });
    
    // Check for fixed/sticky elements
    const fixedElements = await page.evaluate(() => {
      const fixed: Array<{tag: string, text: string, position: string}> = [];
      const elements = document.querySelectorAll('*');
      
      elements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.position === 'fixed' || computed.position === 'sticky') {
          fixed.push({
            tag: el.tagName,
            text: el.textContent?.substring(0, 40) || '',
            position: computed.position
          });
        }
      });
      
      return fixed;
    });
    
    console.log(`Found ${fixedElements.length} fixed/sticky elements:`);
    fixedElements.forEach((el, i) => {
      console.log(`  ${i + 1}. ${el.tag} (${el.position}): "${el.text}"`);
    });
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  test('09 - Color Contrast Check', async ({ page }) => {
    console.log('🔍 Checking color contrast...');
    
    await page.waitForTimeout(2000);
    
    // Sample some text elements and check their contrast
    const contrastIssues = await page.evaluate(() => {
      // Simple contrast ratio calculator
      const getLuminance = (r: number, g: number, b: number) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };
      
      const getContrastRatio = (rgb1: string, rgb2: string) => {
        const parse = (rgb: string) => {
          const match = rgb.match(/\d+/g);
          if (!match) return [0, 0, 0];
          return match.map(Number);
        };
        
        const [r1, g1, b1] = parse(rgb1);
        const [r2, g2, b2] = parse(rgb2);
        
        const l1 = getLuminance(r1, g1, b1);
        const l2 = getLuminance(r2, g2, b2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
      };
      
      const issues: Array<{text: string, ratio: number, color: string, bgColor: string}> = [];
      const textElements = document.querySelectorAll('p, span, button, a, h1, h2, h3, h4, h5, h6');
      
      textElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        const text = el.textContent?.trim();
        
        if (text && text.length > 0 && text.length < 50) {
          const color = computed.color;
          const bgColor = computed.backgroundColor;
          
          if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            const ratio = getContrastRatio(color, bgColor);
            
            // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
            if (ratio < 4.5) {
              issues.push({
                text: text.substring(0, 40),
                ratio: Math.round(ratio * 10) / 10,
                color,
                bgColor
              });
            }
          }
        }
      });
      
      return issues.slice(0, 10);
    });
    
    if (contrastIssues.length > 0) {
      console.log('⚠️ Potential contrast issues (< 4.5:1):');
      contrastIssues.forEach((issue, i) => {
        console.log(`  ${i + 1}. "${issue.text}" - ratio: ${issue.ratio}:1`);
      });
    } else {
      console.log('✅ No obvious contrast issues detected');
    }
    
    await page.screenshot({ 
      path: 'e2e/screenshots/09-contrast-check.png', 
      fullPage: true 
    });
  });

  test('10 - Performance Metrics', async ({ page }) => {
    console.log('🔍 Collecting performance metrics...');
    
    await page.waitForTimeout(3000);
    
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart),
        loadComplete: Math.round(nav.loadEventEnd - nav.fetchStart),
        domInteractive: Math.round(nav.domInteractive - nav.fetchStart),
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });
    
    console.log('\n📊 Performance Metrics:');
    console.log(`  DOM Interactive: ${metrics.domInteractive}ms`);
    console.log(`  DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`  Load Complete: ${metrics.loadComplete}ms`);
    console.log(`  First Paint: ${Math.round(metrics.firstPaint)}ms`);
    console.log(`  First Contentful Paint: ${Math.round(metrics.firstContentfulPaint)}ms`);
    
    // Check memory usage
    const memory = await page.evaluate(() => {
      const perf = performance as any;
      if (perf.memory) {
        return {
          usedJSHeapSize: Math.round(perf.memory.usedJSHeapSize / 1024 / 1024),
          totalJSHeapSize: Math.round(perf.memory.totalJSHeapSize / 1024 / 1024),
        };
      }
      return null;
    });
    
    if (memory) {
      console.log(`  JS Heap: ${memory.usedJSHeapSize}MB / ${memory.totalJSHeapSize}MB`);
    }
    
    if (metrics.loadComplete < 3000) {
      console.log('✅ Good load time (< 3s)');
    } else if (metrics.loadComplete < 5000) {
      console.log('⚠️ Moderate load time (3-5s)');
    } else {
      console.log('❌ Slow load time (> 5s)');
    }
  });
});

