import scrapeIt from 'scrape-it';
import { promises as fs } from 'fs';
import { diffArrays, ArrayChange } from 'diff';

const url = 'https://komabataskforce.wixsite.com/forstudents';

interface SiteData {
    lastUpdated: string;
    stageName: string;
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
        stageName: {
            selector: '#comp-k89t0scx h6',
            eq: 0, // 0 to Japanese, 1 to English
        },
    });
    if (result.response.statusCode !== 200) return null;
    const data = result.data;
    data.paragraphs = (data.paragraphs.filter(s => typeof s === 'string'
        && s !== '​' // This is U+200B (zero width space), not an empty string.
        && s !== '' // empty string
    ));
    return data;
};

export const makeDiffs = async (cacheJSONPath: string, doUpdate: boolean = false): Promise<{
    lastUpdated: string;
    paragraphDiffs: ArrayChange<string>[];
} | null> => {
    let cacheData = {} as SiteData;
    try {
        const cacheFile = await fs.readFile(cacheJSONPath, 'utf-8');
        cacheData = JSON.parse(cacheFile);
    } catch {
        console.error('Failed to read cache file. Make cache file before running this program.');

        return { lastUpdated: '', paragraphDiffs: []};
    }

    const currentData = await fetchCurrentSiteData();
    if (currentData === null) return null;
    if (currentData.paragraphs === []) return null;
    const lastUpdated = cacheData.lastUpdated;
    const paragraphDiffs = diffArrays(cacheData.paragraphs, currentData.paragraphs);

    if (doUpdate && currentData.paragraphs !== []) {
        await fs.writeFile(cacheJSONPath, JSON.stringify(currentData));
    }

    return { lastUpdated, paragraphDiffs };
};