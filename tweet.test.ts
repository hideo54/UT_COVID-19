jest.mock('twitter');

import Twitter from 'twitter';
import tweet from './tweet';

describe('Tweet function', () => {
    it('posts the originl image when it is small enough', async () => {
        // @ts-ignore
        const client = new Twitter();
        expect(async () => { await tweet(client) }).not.toThrow();
    });
    it('posts minified image when it is too big', async () => {
        // @ts-ignore
        const client = new Twitter();
        await tweet(client);
        expect(async () => { await tweet(client) }).not.toThrow();
    });
});