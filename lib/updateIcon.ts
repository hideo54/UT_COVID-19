import sharp from 'sharp';
import Twitter from 'twitter';

export default async (client: Twitter, color: sharp.Color) => {
    const icon = await sharp({create: {
        width: 400, height: 400, channels: 3,
        background: color,
    }}).toBuffer();
    await client.post('account/update_profile_image', {
        image: icon.toString('base64'),
    });
};