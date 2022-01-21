const puppeteer = require('puppeteer');

async function getVideoUrl () {
    const browser = await puppeteer.launch({
        headless: false
    });// 打开浏览器
    const page = await browser.newPage();
    // await page.emulate(puppeteer.devices['iPhone 6'])
    await page.goto('https://www.douyin.com/video/7020764246476590339'); // 跳转到指定页面
    await page.waitFor(2000)  // 延时2s加载页面 puppeteer2.1.1使用 waitFor ^13.0.1以上使用 waitForTimeout
    const pageHtml = await page.content(); // 获取页面html Gets the full HTML contents of the page, including the doctype.
    console.log(pageHtml);
}
getVideoUrl()