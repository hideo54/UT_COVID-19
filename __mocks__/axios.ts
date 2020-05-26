import { promises as fs } from 'fs';

const axios = {
    get: async (url: string) => {
        if (url === 'https://komabataskforce.wixsite.com/forstudents') {
            const sourceHTML = await fs.readFile(`${__dirname}/source.test.html`, 'utf-8');
            return {
                status: 200,
                data: sourceHTML,
            };
        }
    },
};

export default axios;