import moment from 'moment';
import nodemailer from 'nodemailer';
import { stripIndent } from 'common-tags';
import dotenv from 'dotenv';
dotenv.config();

import { makeDiffs } from './scraper';
import { generateDiff } from './visualizer';

const key: { client_id: string; private_key: string; } = require('../key.json');

const sendEmail = async () => {
    const yesterday = moment().subtract(1, 'day');
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const { paragraphDiffs } = await makeDiffs(`${__dirname}/../cache/${yesterdayStr}.json`, false);
    const diffs = generateDiff(paragraphDiffs, false);
    const dataText = diffs.map(diff => {
        let headText = '';
        switch (diff.type) {
            case 'added':
                headText = '\n// 追加';
                break;
            case 'removed':
                headText = '\n// 削除';
                break;
            case 'no-change-head':
                headText = '\n// 変更なし';
                break;
            case 'no-change-tail':
                headText = '// 中略';
                break;
        }
        return `${headText}\n${diff.value.join('\n')}`;
    });
    const text = stripIndent`
        @UT_COVID19 bot システムによる、自動配信メールです。
        昨日 (${yesterday.format('M月D日')}) 22時から本日22時までの「講義オンライン化に関する情報サイト」の更新内容をお伝えいたします。
        お問い合わせは本メールに対する返信でも承ることが可能です。
        配信を停止したい場合にもお問い合わせください。

        以下、更新内容になります。
        ---` + dataText.join('\n') + '\n// 後略';
    const fromAddress = process.env.EMAIL_ADDRESS_FROM!;
    const toAddress = process.env.EMAIL_ADDRESS_TO!;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: fromAddress,
            serviceClient: key.client_id,
            privateKey: key.private_key,
        },
    });
    await transporter.verify();
    await transporter.sendMail({
        to: toAddress,
        subject: '[自動] 講義情報サイト更新通知',
        text,
    });
};

export default sendEmail;