import Twitter from 'twitter';
import { promises as fs } from 'fs';

const tweetBody = '講義オンライン化に関する情報サイト https://komabataskforce.wixsite.com/forstudents が更新されました。';

export default async (client: Twitter) => {
    const srcPath = `${__dirname}/visualized.png`;
    const media = await fs.readFile(srcPath);
    try {
        const res = await client.post('media/upload', { media });
        await client.post('statuses/update', {
            status: tweetBody,
            media_ids: res.media_id_string,
        });
    } catch (e) {
        await client.post('statuses/update', {
            status: tweetBody + '画像は間もなく添付いたします。',
        });
        const now = new Date();
        const nowStr = now.toISOString();
        const destPath = `${__dirname}/visualized-${nowStr}.png`;
        await fs.copyFile(srcPath, destPath);
    }
};