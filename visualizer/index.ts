import { ArrayChange } from 'diff';
import pug from 'pug';
import puppeteer from 'puppeteer';

interface Diff {
    type: 'added' | 'removed' | 'no-change-head' | 'no-change-tail';
    value: string[];
}

export default async (page: puppeteer.Page, lastUpdated: string, currentDate: Date, paragraphDiffs: ArrayChange<string>[]) => {
    const diffs: Diff[] = []
    const displayedNoChangeParagraphs = 4;
    for (const [i, diff] of paragraphDiffs.entries()) {
        if (diff.added) {
            diffs.push({ type: 'added', value: diff.value});
        } else if (diff.removed) {
            diffs.push({ type: 'removed', value: diff.value});
        } else {
            if (diff.value.length <= displayedNoChangeParagraphs * 2) {
                diffs.push({ type: 'no-change-head', value: diff.value });
            } else {
                if (i > 0) {
                    const value = diff.value.slice(0, displayedNoChangeParagraphs);
                    diffs.push({ type: 'no-change-head', value });
                }
                if (i < paragraphDiffs.length - 1) {
                    const value = diff.value.slice(-displayedNoChangeParagraphs);
                    diffs.push({ type: 'no-change-tail', value });
                }
            }
        }
    }
    const currentDateStr = currentDate.toLocaleString('ja-JP');
    const html = pug.renderFile(`${__dirname}/template.pug`, {
        lastUpdated, currentDateStr, diffs,
    });
    await page.setContent(html);
    await page.waitFor(1);
    await page.screenshot({
        path: 'visualized.png',
        fullPage: true,
    });
};