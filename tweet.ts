import Twitter from 'twitter';
import { promises as fs } from 'fs';

const tweetBody = '講義オンライン化に関する情報サイト https://komabataskforce.wixsite.com/forstudents が更新されました。';

export default async (client: Twitter) => {
    const media = await fs.readFile(`${__dirname}/visualized.png`);
    const res = await client.post('media/upload', { media });
    await client.post('statuses/update', {
        status: tweetBody,
        media_ids: res.media_id_string,
    });
};