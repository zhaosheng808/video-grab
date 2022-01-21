const puppeteer = require('puppeteer');
// const axios = require('axios');
// const devices = require('puppeteer/DeviceDescriptors');
const MAX_TRY_TIME = 30; // 未抓取到视频重试次数
const RETRY_INTERVAL = 1000; // 未抓取到视频重试间隔 ms

// console.log(puppeteer.devices);
// axios.get('https://www.douyin.com/video/7020764246476590339', {
//     headers: {
//         'content-type': 'multipart/form-data',
//         'cookie': 'ttwid=1%7C5xnOpAFoQ-mULhyHjlQaziJAyLGbXimC8nJ6vhVDFiM%7C1642147652%7C32876e1c62053690c9b8f2f2c5bea77f146f1ac1e8dafa7835fdcd0b4bf80743;'
//     }
// }).then(resp => {
//     console.log('data1', resp.data)
// })

async function getVideoUrl(pageUrl) {
    if(!pageUrl) {
        return Promise.reject('网页地址不能为空！');
    }
    return new Promise(async (resolve, reject) => {
        try{
            let videoUrl = '';
            if (pageUrl.indexOf(`//www.douyin.com`) > -1) { // 抖音
                videoUrl = await getDouyinVideo(pageUrl);
            } else if (pageUrl.indexOf(`//v.cctv.cn`) > -1) { // 央视
                videoUrl = await getCctvVideo(pageUrl);
            } else if (pageUrl.indexOf(`//weibo.com`) > -1) { // 微博
                videoUrl = await getWeiboVideo(pageUrl);
            }else {
                videoUrl = await getDouyinVideo(pageUrl);
            }
            resolve(videoUrl)
        }catch (e) {
            reject(e);
        }
    })
};
// 央视
function getCctvVideo(pageUrl) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
            const page = await browser.newPage();
            page.once('load', async () => {
                // await page.waitForTimeout(1000)
                let videoSrc = '';
                try {
                    videoSrc = await getVideoFormPuppeteerPage(page);
                }catch (e) {
                    reject(e);
                }
                browser.close();
                resolve(videoSrc)
            })
            page.on('response', async (response) => {
                if (response.ok()) {
                    const request = response.request();
                    const reqUrl = request.url();
                    if (reqUrl.indexOf('/api/getHttpVideoInfo.do') > -1) {
                        const respData = await response.json();
                        const video = respData.video;
                        if (video && video.validChapterNum > 0){
                            const currentChapter = video[`chapters${video.validChapterNum}`];
                            if (currentChapter && currentChapter.length > 0 && currentChapter[0] && currentChapter[0].url) {
                                resolve(currentChapter[0].url)
                            }
                        }
                    }
                }
            })
            await page.goto(pageUrl);
        }catch (e) {
            reject(e);
        }
    })
};
// 抖音
function getDouyinVideo(pageUrl) {
    return new Promise(async (resolve, reject) => {
        try{
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });

            const page = await browser.newPage();
            await page.emulate(puppeteer.devices['iPhone 6'])
            page.once('load', async () => {
                let videoSrc = '';
                try {
                    videoSrc = await getVideoFormPuppeteerPage(page);
                }catch (e) {
                    reject(e);
                }
                browser.close();
                resolve(videoSrc)
            })
            await page.goto(pageUrl);
            // await page.waitForTimeout(2000)
            // const pageHtml = await page.content(); // 获取页面html Gets the full HTML contents of the page, including the doctype.
            // console.log('pageHtml', pageHtml);

        }catch (e) {
            reject(e);
        }
    })
};
// 微博
function getWeiboVideo(pageUrl) {
    return new Promise(async (resolve, reject) => {
        try{
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
            // const page = await browser.newPage();
            // await page.emulate(puppeteer.devices['iPad Pro']);
            // // 第一次加载设置cookie
            // page.once('load', async () => {
            //     await page.waitForTimeout(5000);
                // 第二次加载打开详情页面
                const page2 = await browser.newPage();
                await page2.emulate(puppeteer.devices['iPad Pro'])
                page2.once('load', async () => {
                    let videoSrc = '';
                    try {
                        videoSrc = await getVideoFormPuppeteerPage(page2);
                    }catch (e) {
                        reject(e);
                    }
                    browser.close();
                    resolve(videoSrc)
                })
                await page2.goto(pageUrl);
            // })
            // await page.goto(pageUrl);
            // const pageHtml = await page.content(); // 获取页面html Gets the full HTML contents of the page, including the doctype.
            // console.log(pageHtml, 'pageHtml');
        }catch (e) {
            reject(e);
        }
    })
};

function getVideoFormPuppeteerPage(page, time = 1) {
    console.log('tryTime', time);
    return new Promise(async (resolve, reject) => {
        let videoSrc = '';
        try{
            let videoDom = await page.$('video');
            if (videoDom) {
                videoSrc = await page.$eval('video', (el) => {
                    let src = '';
                    if (el && el.src) {
                        src = el.src;
                    }
                    return src;
                });
            }
            if (!videoSrc) {
                let videoSourceDom = await page.$('video source');
                if (videoSourceDom) {
                    videoSrc = await page.$eval('video source', (el) => {
                        let src = '';
                        if (el && el.src) {
                            src = el.src;
                        }
                        return src;
                    });
                }
            }
            if (!videoSrc && time < MAX_TRY_TIME) {
                // puppeteer ^13.0.1 以上使用 waitForTimeout
                // puppeteer 2.1.1 使用 waitFor
                await page.waitFor(RETRY_INTERVAL);
                videoSrc = await getVideoFormPuppeteerPage(page, time + 1);
            }
            resolve(videoSrc)
        }catch (e) {
            if (time < MAX_TRY_TIME) {
                await page.waitFor(RETRY_INTERVAL);
                videoSrc = await getVideoFormPuppeteerPage(page, time + 1);
                resolve(videoSrc)
            }
            reject(e);
        }
    })
}

exports.getVideoUrl = getVideoUrl;