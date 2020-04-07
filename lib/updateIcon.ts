import sharp from 'sharp';
import Twitter from 'twitter';

export const updateIcon = async (client: Twitter, color: sharp.Color) => {
    const icon = await sharp({create: {
        width: 400, height: 400, channels: 3,
        background: color,
    }}).png().toBuffer();
    await client.post('account/update_profile_image', {
        image: icon.toString('base64'),
    });
};

export default updateIcon;