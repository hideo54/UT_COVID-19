jest.mock('twitter');

import Twitter from 'twitter';
import sharp from 'sharp';
import { tweetMedia } from './tweet';

describe('Tweet function', () => {
    it('posts the originl image when it is small enough', async () => {
        // @ts-ignore
        const client = new Twitter();
        const media = await sharp({ create: {
            width: 1600, height: 2400, channels: 3,
            background: { r: 255, g: 255, b: 255 },
        }}).png().toBuffer();
        expect(async () => { await tweetMedia(client, media) }).not.toThrow();
    });
    it('posts minified image when it is too big', async () => {
        // @ts-ignore
        const client = new Twitter();
        const media = await sharp({ create: {
            width: 1600, height: 9000, channels: 3,
            background: { r: 255, g: 255, b: 255 },
        }}).png().toBuffer();
        expect(async () => { await tweetMedia(client, media) }).not.toThrow();
    });
});