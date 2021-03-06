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
        }).png().toBuffer();
        const res = await client.post('media/upload', { media: smallerMedia });
        await client.post('statuses/update', {
            status: tweetBody,
            media_ids: res.media_id_string,
        });
    }
};

export default async (client: Twitter, tweet?: string) => {
    if (tweet) {
        await client.post('statuses/update', { status: tweet });
    } else {
        const srcPath = `${__dirname}/visualized.png`;
        const media = await fs.readFile(srcPath);
        await tweetMedia(client, media);
    }
};