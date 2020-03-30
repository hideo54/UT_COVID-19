import puppeteer from 'puppeteer';
import Twitter from 'twitter';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
dotenv.config();

import { makeDiffs } from './scraper';
import visualizer from './visualizer';
import tweet from './lib/tweet';

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

const job = async (browser: puppeteer.Browser, twitterClient: Twitter) => {
    const { lastUpdated, paragraphDiffs } = await makeDiffs(`${__dirname}/cache.json`);
    const currentDate = new Date();
    if (paragraphDiffs.filter(x => x.added || x.removed).length > 0) {
        const page = await browser.newPage();
        await visualizer(page, lastUpdated, currentDate, paragraphDiffs);
        await tweet(twitterClient);
        await page.close();
    }
};

(async () => {
    const { browser, twitterClient } = await init();
    if (process.env.NODE_ENV === 'development') {
        await job(browser, twitterClient);
    } else {
        schedule.scheduleJob('* * * * *', async () => {
            await job(browser, twitterClient);
        });
    }
})();