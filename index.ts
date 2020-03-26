import dotenv from 'dotenv';
dotenv.config();

import { makeDiffs } from './scraper';

const job = async () => {
    const { lastUpdated, paragraphDiffs } = await makeDiffs(`${__dirname}/cache.json`);
};

job();