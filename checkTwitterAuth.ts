import Twitter from 'twitter';
import dotenv from 'dotenv';
dotenv.config();

const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN!,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET!,
});

(async () => {
    const myIdStr = '1243047408784687104';
    const { id_str } = await twitterClient.get('users/show', {
        screen_name: 'UT_COVID19',
    });
    if (myIdStr === id_str) {
        console.log("Token: OK.");
    }
})();