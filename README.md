# UT_COVID-19

[東京大学　教養学部・大学院総合文化研究科の講義オンライン化に関する情報サイト](https://komabataskforce.wixsite.com/forstudents) など、新型コロナウイルス流行による東京大学の対応の情報を自動でツイートする **非公式** bot [@UT_COVID19](https://twitter.com/UT_COVID19) のプログラムです。

## 連絡先

このbotは **1学生個人が大学の許可を得ずに非公式に運用している** ものですから、bot の動作の不具合の報告などは、絶対に大学当局には連絡せず、代わりに以下に連絡してください。

* Email: `contact@hideo54.com`
* Twitter: [@hideo54](https://twitter.com/hideo54)
* GitHub 上での Issue/Pull Request も大歓迎です。

## Setup

1. `sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget` (for puppeteer)
1. `cp sample.env .env` and set appropriate values. (for Twitter)
1. `npm i`
1. `npm run build`
1. pm2 とかで index.ts を走らせる