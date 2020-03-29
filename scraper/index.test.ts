import fs from 'fs';

jest.mock('tinyreq', () => {
    const sourceHTML = fs.readFileSync(`${__dirname}/source.test.html`, {
        encoding: 'utf-8',
    });
    return (options: string, callback: Function) => {
        const err = null;
        const body = sourceHTML;
        const res = null;
        callback(err, body, res);
    }
});

import { fetchCurrentSiteData } from './index';

describe('Scraper', () => {
    it('extracts data from the original website', async () => {
        const data = await fetchCurrentSiteData();
        const expected = {
            lastUpdated: '01:23, on March 28',
            paragraphs: [
                '以下の通知もご確認ください。',
                'リンクAリンクB',
                '0. この情報サイトの取り扱いについて',
                '- 一見箇条書きに見える段落もただの "- " つきテキスト',
                'このように\n' +
                  'brが挟まれていることもあります\n' +
                  '実ははテキスト化の際取り除かれてしまうのですが\n' +
                  'このサイトはbrの後にHTMLテキストの方も改行を入れており、\n' +
                  'そこは拾われます',
            ],
        };
        expect(data).toStrictEqual(expected);
    });
});