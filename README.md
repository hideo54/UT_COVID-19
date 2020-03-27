# UT_COVID-19

[東京大学　教養学部・大学院総合文化研究科の講義オンライン化に関する情報サイト](https://komabataskforce.wixsite.com/forstudents) など、新型コロナウイルス流行による東京大学の対応の情報を自動でツイートする **非公式** bot [@UT_COVID19](https://twitter.com/UT_COVID19) のプログラムです。

## 連絡先

このbotは **1学生個人が大学の許可を得ずに非公式に運用している** ものですから、bot の動作の不具合の報告などは、絶対に大学当局には連絡せず、代わりに以下に連絡してください。

* Email: `contact@hideo54.com`
* Twitter: [@hideo54](https://twitter.com/hideo54)
* GitHub 上での Issue/Pull Request も大歓迎です。

## Setup

1. Prepare environment for puppeteer according to [the official document](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix). You may also need to prepare for Japanese fonts, such as `sudo apt install fonts-noto-cjk-extra`.
1. `cp sample.env .env` and set appropriate values. (for Twitter)
1. `npm i`
1. `npm run build`
1. pm2 とかで index.js を走らせる