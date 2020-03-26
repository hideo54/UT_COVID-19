import dotenv from 'dotenv';
dotenv.config();

import { makeDiffs } from './scraper';
import visualizer from './visualizer';

const job = async () => {
    const { lastUpdated, paragraphDiffs } = await makeDiffs(`${__dirname}/cache.json`);
    const currentDate = new Date();
    if (paragraphDiffs.filter(x => x.added || x.removed).length > 0) {
        await visualizer(lastUpdated, currentDate, paragraphDiffs);
    }
};
job();