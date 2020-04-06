import { ArrayChange } from 'diff';
import pug from 'pug';
import moment from 'moment';
import { promises as fs } from 'fs';
import puppeteer from 'puppeteer';

interface Diff {
    type: 'added' | 'removed' | 'no-change-head' | 'no-change-tail';
    value: string[];
}

export const generateDiff = (paragraphDiffs: ArrayChange<string>[], convertBreaklineToBr: boolean = true) => {
    const diffs: Diff[] = []
    const displayedNoChangeParagraphs = 4;
    for (const [i, diff] of paragraphDiffs.entries()) {
        if (convertBreaklineToBr) {
            diff.value = diff.value.map(p =>
                p.replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br />'));
        }
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
    return diffs;
};

export const generateHTML = async (lastUpdated: string, currentDate: Date, paragraphDiffs: ArrayChange<string>[]) => {
    const diffs = generateDiff(paragraphDiffs);
    const currentDateStr = moment(currentDate).locale('ja').format('YYYY/M/DD H:mm:ss');
    const style = await fs.readFile(`${__dirname}/style.css`, 'utf-8');
    const html = pug.renderFile(`${__dirname}/template.pug`, {
        lastUpdated, currentDateStr, diffs, style,
    });
    await fs.writeFile(`${__dirname}/generated/${currentDate.getTime()}.html`, html);
    return html;
};

export default async (page: puppeteer.Page, lastUpdated: string, currentDate: Date, paragraphDiffs: ArrayChange<string>[]) => {
    const html = await generateHTML(lastUpdated, currentDate, paragraphDiffs);
    await page.setContent(html);
    await page.waitFor(1);
    await page.screenshot({
        path: 'lib/visualized.png',
        fullPage: true,
    });
};