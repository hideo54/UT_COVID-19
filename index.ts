import puppeteer from 'puppeteer';
import Twitter from 'twitter';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
dotenv.config();

import { makeDiffs } from './lib/scraper';
import visualizer from './lib/visualizer';
import tweet from './lib/tweet';
import { updateIcon } from './lib/updateIcon';
import sendEmail from './lib/sendEmail';

const init = async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 800,
            height: 800,
            deviceScaleFactor: 2,
        },
        headless: process.env.NODE_ENV !== 'development',
    });
    const twitterClient = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY!,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN!,
        access_token_secret: process.env.TWITTER_ACCESS_SECRET!,
    });
    return { browser, twitterClient };
};

const job = async (browser: puppeteer.Browser, twitterClient: Twitter, doCacheUpdate: boolean) => {
    const diffs = await makeDiffs(`${__dirname}/cache.json`, doCacheUpdate);
    if (diffs) {
        const { lastUpdated, paragraphDiffs, stageDiff } = diffs;
        const currentDate = new Date();
        if (paragraphDiffs.filter(x => x.added || x.removed).length > 0) {
            console.log('Tweeting paragraph diffs...');
            const page = await browser.newPage();
            await visualizer(page, lastUpdated, currentDate, paragraphDiffs);
            await tweet(twitterClient);
            await page.close();
        }
        if (stageDiff.name) {
            const { before, after } = stageDiff.name;
            if (before !== after && after.includes('ステージ')) {
                console.log('Tweeting stage-name change...');
                const url = 'https://komabataskforce.wixsite.com/forstudents';
                const text = `ステージが「${before}」から「${after}」に変更されました。 ${url}`;
                await tweet(twitterClient, text);
            }
        }
        if (stageDiff.color) {
            console.log('Updating icon color...');
            await updateIcon(twitterClient, stageDiff.color.after);
        }
    }
};

(async () => {
    const { browser, twitterClient } = await init();
    if (process.env.NODE_ENV === 'development') {
        await job(browser, twitterClient, false);
    } else {
        schedule.scheduleJob('*/10 * * * *', async () => {
            await job(browser, twitterClient, true);
        });
        schedule.scheduleJob('0 22 * * *', async () => {
            await sendEmail();
        });
    }
})();