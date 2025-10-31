import { test, expect } from '@playwright/test';

/**
 * Debug test to find which buttons are too small on mobile
 */

test('Find small buttons on mobile with details', async ({ page }) => {
  // Go to the app with test mode enabled
  await page.goto('/?test-mode=true');
  await page.waitForTimeout(2000);
  
  // Auto-login with test bypass
  const bypassButton = page.locator('[data-testid="bypass-auth-button"]');
  if (await bypassButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('🧪 Using test mode bypass for authentication');
    await bypassButton.click();
    await page.waitForTimeout(2000);
  }
  
  // Switch to mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  
  // Get detailed button info
  const buttonDetails = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    const details: Array<{
      text: string;
      width: number;
      height: number;
      isTooSmall: boolean;
      styles: {
        padding: string;
        minHeight: string;
        fontSize: string;
      };
    }> = [];
    
    buttons.forEach((btn) => {
      const rect = btn.getBoundingClientRect();
      const computed = window.getComputedStyle(btn);
      const text = btn.textContent?.trim().substring(0, 30) || '';
      const isTooSmall = rect.width < 44 || rect.height < 44;
      
      if (rect.width > 0 && rect.height > 0) {
        details.push({
          text,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          isTooSmall,
          styles: {
            padding: computed.padding,
            minHeight: computed.minHeight,
            fontSize: computed.fontSize,
          },
        });
      }
    });
    
    return details;
  });
  
  console.log('\n📱 Mobile Button Analysis:');
  console.log('====================================');
  
  buttonDetails.forEach((btn, i) => {
    const status = btn.isTooSmall ? '❌ TOO SMALL' : '✅ OK';
    console.log(`\n${i + 1}. "${btn.text}" ${status}`);
    console.log(`   Size: ${btn.width}×${btn.height}px`);
    console.log(`   Padding: ${btn.styles.padding}`);
    console.log(`   MinHeight: ${btn.styles.minHeight}`);
    console.log(`   FontSize: ${btn.styles.fontSize}`);
  });
  
  const tooSmall = buttonDetails.filter(b => b.isTooSmall);
  console.log('\n====================================');
  console.log(`Total: ${buttonDetails.length} buttons`);
  console.log(`Too small: ${tooSmall.length} buttons`);
  console.log('====================================\n');
  
  // Take screenshot
  await page.screenshot({ 
    path: 'e2e/screenshots/mobile-buttons-debug.png', 
    fullPage: true 
  });
});

