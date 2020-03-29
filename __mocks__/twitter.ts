import sharp from 'sharp';

const media_id_string = '123456789abcdef0';

class Twitter {
    async post(path: string, options: any) {
        if (path === 'media/upload') {
            const media: Buffer = options.media;
            const size = await sharp(media).metadata();
            if (size.height! <= 8192) {
                return { media_id_string };
            } else {
                throw {
                    code: 324,
                    message: 'Image dimensions must be >= 4x4 and <= 8192x8192',
                };
            }
        } else if (path === 'statuses/update') {
            if (options.media_ids !== media_id_string) throw null;
            return;
        }
    }
}

module.exports = Twitter;