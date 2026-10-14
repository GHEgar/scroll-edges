import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function scrollTo(page: Page, testId: string, left: number, top: number): Promise<void> {
    await page.getByTestId(testId).evaluate((element, position) => element.scrollTo({ ...position, behavior: 'instant' }), { left, top });
}

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('the sticky list flags its edges and keeps the top arrow below the header', async ({ page }) => {
    const list = page.getByTestId('sticky');
    await expect(list).toHaveAttribute('data-overflow-bottom', '');
    await expect(list).not.toHaveAttribute('data-overflow-top');
    await expect(page.getByTestId('sticky-pill-bottom')).toHaveText('bottom: true');
    await expect(page.getByTestId('sticky-pill-top')).toHaveText('top: false');
    await expect(page.getByTestId('sticky-arrow-top')).toHaveCount(0);

    await scrollTo(page, 'sticky', 0, 200);
    await expect(list).toHaveAttribute('data-overflow-top', '');
    await expect(list).toHaveAttribute('data-overflow-bottom', '');
    const header = await page.getByTestId('sticky-header').boundingBox();
    await expect(page.getByTestId('sticky-pill-inset')).toHaveText(`inset.top: ${Math.round(header?.height ?? 0)}`);
    const arrow = await page.getByTestId('sticky-arrow-top').boundingBox();
    expect(arrow && header && arrow.y >= header.y + header.height).toBe(true);

    await page.getByTestId('sticky-arrow-bottom').click();
    await expect(list).not.toHaveAttribute('data-overflow-bottom');
    await expect(page.getByTestId('sticky-arrow-bottom')).toHaveCount(0);

    await page.getByTestId('sticky-arrow-top').click();
    await expect(list).not.toHaveAttribute('data-overflow-top');
    await expect(page.getByTestId('sticky-pill-inset')).toHaveText('inset.top: 0');
});

test('the masked list fades only the overflowing edges', async ({ page }) => {
    const list = page.getByTestId('mask');
    const mask = (): Promise<string> => list.evaluate((element) => element.style.maskImage);
    await expect.poll(mask).toContain('transparent 100%');
    await expect.poll(mask).not.toContain('transparent 0%');

    await scrollTo(page, 'mask', 0, 120);
    await expect(page.getByTestId('mask-pill-top')).toHaveText('top: true');
    await expect.poll(mask).toContain('transparent 0%');
    await expect.poll(mask).toContain('transparent 100%');

    await page.getByTestId('mask-arrow-bottom').click();
    await expect(page.getByTestId('mask-pill-bottom')).toHaveText('bottom: false');
    await expect.poll(mask).not.toContain('transparent 100%');
});

test('the horizontal row flags left and right and its arrows jump', async ({ page }) => {
    const row = page.getByTestId('row');
    await expect(row).toHaveAttribute('data-overflow-right', '');
    await expect(row).not.toHaveAttribute('data-overflow-left');
    await expect(page.getByTestId('row-arrow-left')).toHaveCount(0);

    await page.getByTestId('row-arrow-right').click();
    await expect(page.getByTestId('row-pill-right')).toHaveText('right: false');
    await expect(page.getByTestId('row-pill-left')).toHaveText('left: true');
    expect(await row.evaluate((element) => element.scrollLeft + element.clientWidth)).toBeGreaterThanOrEqual(await row.evaluate((element) => element.scrollWidth - 1));

    await page.getByTestId('row-arrow-left').click();
    await expect(page.getByTestId('row-pill-left')).toHaveText('left: false');
    await expect(row).toHaveAttribute('data-overflow-right', '');
    expect(await row.evaluate((element) => element.scrollLeft)).toBe(0);
});
