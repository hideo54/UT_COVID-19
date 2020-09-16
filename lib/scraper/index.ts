import axios from 'axios';
import { scrapeHTML } from 'scrape-it';
import cheerio from 'cheerio';
import { Parser, Ruleset, Declaration, Expression } from 'shady-css-parser';
import { promises as fs } from 'fs';
import { diffArrays, ArrayChange } from 'diff';

const url = 'https://komabataskforce.wixsite.com/forstudents';

interface SiteData {
    lastUpdated: string;
    stageName: string;
    stageColor: string;
    paragraphs: string[];
}

export const fetchCurrentSiteData = async () => {
    try {
        const res = await axios.get(url);
        if (res.status !== 200) return null;
        const html = res.data;
        const data = scrapeHTML<SiteData>(html, {
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
        if (data.stageName === '' && data.lastUpdated === '') {
            console.log('stageName and lastUpdated become empty; something might be wrong. Paragraphs:');
            console.log(data.paragraphs);
            return null;
        }
        data.paragraphs = (data.paragraphs.filter(s => typeof s === 'string'
            && s !== '​' // This is U+200B (zero width space), not an empty string.
            && s !== '' // empty string
        ));
        const $ = cheerio.load(html);
        const styleId = 'style-kbfuay7t';
        const style = $(`style[data-styleid=${styleId}]`).html();
        if (style) {
            const parser = new Parser();
            const { rules } = parser.parse(style);
            const rulesets = rules.filter(rule => rule.type === 'ruleset') as Ruleset[];
            const rulelist = rulesets.filter(rset => rset.selector === `.${styleId}bg`)[0].rulelist;
            const declarations = rulelist.rules.filter(rule => rule.type === 'declaration') as Declaration[];
            const bgColorDeclaration = declarations.filter(declaration => declaration.name === 'background-color')[0];
            const bgColorExpression = bgColorDeclaration.value as Expression;
            const bgColor = bgColorExpression.text;
            data.stageColor = bgColor;
        } else {
            data.stageColor = '';
        }
        return data;
    } catch (e) {
        console.log(`Error: ${e}`);
        return null;
    }
};

interface StageDiff {
    name?: {
        before: string;
        after: string;
    };
    color?: {
        before: string;
        after: string;
    };
}

export const makeDiffs = async (cacheJSONPath: string, doUpdate: boolean = false): Promise<{
    lastUpdated: string;
    paragraphDiffs: ArrayChange<string>[];
    stageDiff: StageDiff;
} | null> => {
    let cacheData = {} as SiteData;
    try {
        const cacheFile = await fs.readFile(cacheJSONPath, 'utf-8');
        cacheData = JSON.parse(cacheFile);
    } catch {
        console.error('Failed to read cache file. Make cache file before running this program.');

        return {
            lastUpdated: '',
            stageDiff: {},
            paragraphDiffs: [],
        };
    }

    const currentData = await fetchCurrentSiteData();
    if (currentData === null) return null;
    if (currentData.paragraphs === []) return null;
    const lastUpdated = cacheData.lastUpdated;
    const lastStageName = cacheData.stageName;
    const lastStageColor = cacheData.stageColor;

    const stageDiff = {
        name: currentData.stageName === lastStageName ? undefined : {
            before: lastStageName,
            after: currentData.stageName,
        },
        color: currentData.stageColor === lastStageColor ? undefined : {
            before: lastStageColor,
            after: currentData.stageColor,
        },
    };

    const paragraphDiffs = diffArrays(cacheData.paragraphs, currentData.paragraphs);

    if (doUpdate) {
        if (stageDiff || currentData.paragraphs !== []) {
            await fs.writeFile(cacheJSONPath, JSON.stringify(currentData));
        }
    }

    return { lastUpdated, paragraphDiffs, stageDiff };
};