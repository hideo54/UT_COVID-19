import puppeteer from 'puppeteer';
import Twitter from 'twitter';
import dotenv from 'dotenv';
dotenv.config();

import { makeDiffs } from './scraper';
import visualizer from './visualizer';
import tweet from './tweet';

const init = async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 1200,
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
    })
    const page = await browser.newPage();
    return { page, twitterClient };
};

const job = async (page: puppeteer.Page, twitterClient: Twitter) => {
    const { lastUpdated, paragraphDiffs } = await makeDiffs(`${__dirname}/cache.json`);
    const currentDate = new Date();
    if (paragraphDiffs.filter(x => x.added || x.removed).length > 0) {
        await visualizer(page, lastUpdated, currentDate, paragraphDiffs);
        await tweet(twitterClient);
    }
};

(async () => {
    const { page, twitterClient } = await init();
    await job(page, twitterClient);
})();