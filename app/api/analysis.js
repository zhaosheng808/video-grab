var express = require('express');

var router = express.Router();


var utils = require('./utils/utils');

// let testPageUrl = 'https://www.douyin.com/video/7020764246476590339'; // 抖音
// let testPageUrl = 'https://v.cctv.cn/2022/01/15/VIDEJnMMIJw5FRqehWqkua8w220115.shtml?spm=C90324.PE6LRxWJhH5P.EPZudTwNMBDs.1'; // 央视网
// let testPageUrl = 'https://weibo.com/tv/show/1034:4726981519147023?mid=4726985493054318'; // 微博

// utils.getVideoUrl(testPageUrl).then(src => {
//     console.log(src, 'src')
// })

router.post('/video', async function (req, res, next) {
    var pageUrl = req.body.url;
    let videoUrl = '';
    try {
        await utils.getVideoUrl(pageUrl).then(src => {
            videoUrl = src;
        });
        if (!videoUrl) {
            next('该页面暂未解析到视频信息！');
            return;
        }
        res.json({
            videoUrl: videoUrl,
            pageUrl: pageUrl
        });
    }catch (e) {
        next(e);
    }
});

module.exports = router;