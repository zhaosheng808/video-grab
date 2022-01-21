const mediaTypeArr = [
    // {name: '未知', value: 0},
    {name: '图片', value: 1, type: 'image'},
    {name: '视频', value: 2, type: 'video'},
    {name: '音频', value: 3, type: 'audio'},
    {name: '文档', value: 4},
    {name: '非编工程', value: 5},
    {name: '其它', value: 10},
];

const taskTypeArr = [
    // {name: '未知', value: 0},
    {name: '素材入库', value: 'vms'},
    {name: '素材交换', value: 'vxs'},
    {name: '非编合成', value: 'nle'},
    {name: '切片合成', value: 'slicemerge'},
    {name: '语音识别', value: 'audiototext'},
    {name: '素材转码', value: 'transcode'},
    {name: '智能分析', value: 'aianalysis'},
    {name: '智能校对', value: 'aicheck'},
];
const taskStatusArr = [
    // {name: '未知', value: 0},
    {name: '未处理', value: 1},
    {name: '正在处理', value: 2},
    {name: '处理成功', value: 3},
    {name: '处理失败', value: 4},
]
const storageTypeArr = [
    {name: '常规存储', value: 1},
    {name: '临时存储', value: 2},
    {name: '三方存储', value: 3}
]
export {
    mediaTypeArr,
    taskTypeArr,
    taskStatusArr,
    storageTypeArr,
}