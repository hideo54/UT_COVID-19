import Twitter from 'twitter';
import { promises as fs } from 'fs';
import sharp from 'sharp';

const tweetBody = '講義オンライン化に関する情報サイト https://komabataskforce.wixsite.com/forstudents が更新されました。';

export const tweetMedia = async (client: Twitter, media: Buffer) => {
    try {
        const res = await client.post('media/upload', { media });
        await client.post('statuses/update', {
            status: tweetBody,
            media_ids: res.media_id_string,
        });
    } catch (e) {
        const smallerMedia = await sharp(media).resize({
            height: 8192,
        }).toBuffer();
        const res = await client.post('media/upload', { media: smallerMedia });
        await client.post('statuses/update', {
            status: tweetBody,
            media_ids: res.media_id_string,
        });
        const now = new Date();
        const nowStr = now.toISOString();
        const srcPath = `${__dirname}/visualized.png`;
        const destPath = `${__dirname}/visualized-${nowStr}.png`;
        await fs.copyFile(srcPath, destPath);
    }
};

export default async (client: Twitter) => {
    const srcPath = `${__dirname}/visualized.png`;
    const media = await fs.readFile(srcPath);
    await tweetMedia(client, media);
};