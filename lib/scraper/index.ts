import scrapeIt from 'scrape-it';
import { promises as fs } from 'fs';
import { diffArrays } from 'diff';

const url = 'https://komabataskforce.wixsite.com/forstudents';

interface SiteData {
    lastUpdated: string;
    paragraphs: string[];
}

export const fetchCurrentSiteData = async () => {
    const result = await scrapeIt<SiteData>(url, {
        lastUpdated: {
            selector: 'div#comp-k8515tfz p',
            convert: s => s.replace(/^last updated at ([a-zA-Z0-9,: ]*)$/,
                (m: string, date: string) => date
            ),
        },
        paragraphs: {
            listItem: 'div#comp-k844k5vo p',
        },
    });
    const data = result.data;
    data.paragraphs = (data.paragraphs.filter(s => typeof s === 'string'
        && s !== '​' // This is U+200B (zero width space), not an empty string.
    ));
    return data;
};

export const makeDiffs = async (cacheJSONPath: string) => {
    let cacheData = {} as SiteData;
    try {
        const cacheFile = await fs.readFile(cacheJSONPath, 'utf-8');
        cacheData = JSON.parse(cacheFile);
    } catch {
        cacheData = { lastUpdated: '', paragraphs: [] };
    }

    const currentData = await fetchCurrentSiteData();
    const lastUpdated = cacheData.lastUpdated;
    const paragraphDiffs = diffArrays(cacheData.paragraphs, currentData.paragraphs);

    if (process.env.NODE_ENV !== 'development') {
        await fs.writeFile(cacheJSONPath, JSON.stringify(currentData));
    }

    return { lastUpdated, paragraphDiffs };
};