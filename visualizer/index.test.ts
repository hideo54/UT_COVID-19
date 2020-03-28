import { promises as fs } from 'fs';
import { generateHTML } from './index';

describe('Visualizer', () => {
    it('generates HTML from the given parsed data', async () => {
        const html = await generateHTML(
            '01:23, on March 28',
            new Date('2020-03-28 23:45:67'),
            [
                {
                    count: 2,
                    value: [
                        '変更なし文章1',
                        '変更なし文章2',
                    ],
                },
                {
                    count: 3,
                    added: undefined,
                    removed: true,
                    value: [
                        '削除された文章1',
                        '削除された文章2',
                        '削除された文章3',
                    ],
                },
                {
                    count: 4,
                    added: true,
                    removed: undefined,
                    value: [
                        '追加された文章1',
                        '追加された文章2',
                        '追加された文章3',
                        '追加された文章4',
                    ],
                },
                {
                    count: 9,
                    value: [
                        '変更なし文章3',
                        '変更なし文章4',
                        '変更なし文章5',
                        '変更なし文章6',
                        '変更なし文章7',
                        '変更なし文章8',
                        '変更なし文章9',
                        '変更なし文章10',
                        '変更なし文章11',
                    ],
                },
                {
                    count: 1,
                    added: true,
                    removed: undefined,
                    value: [
                        '追加された文章5',
                    ],
                },
                {
                    count: 9,
                    value: [
                        '変更なし文章12',
                        '変更なし文章13',
                        '変更なし文章14',
                        '変更なし文章15',
                        '変更なし文章16',
                        '変更なし文章17',
                        '変更なし文章18',
                        '変更なし文章19',
                        '変更なし文章20',
                    ],
                },
            ]
        );
        const expected = await fs.readFile(`${__dirname}/generated.test.html`, 'utf-8');
        expect(html).toBe(expected);
    })
});