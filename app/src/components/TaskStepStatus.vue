<template>
    <div class="steps-wrap">
        <div class="steps-item" v-for="(item, index) in stepsData" :key="item.id"
             :class="{ active: ( item.status == 1 || index == stepsData.length-1)}">
            <div class="steps-head">
                <span class="circle">{{ index + 1 }}</span>
                <span class="line"></span>
            </div>
            <div class="steps-content">
                <img :src="item.url" alt="">
                {{ item.name }}
            </div>
            <div class="steps-detail">
                <template v-if="item.work">
                    <p v-if="item.work.nodeAddress">执行地址：{{ item.work.nodeAddress }}</p>
                    <p v-if="item.work.creationTime">开始时间：{{ item.work.creationTime * 1000 | formatDate }}</p>
                    <p v-if="item.work.completionTime">结束时间：{{ item.work.completionTime * 1000 | formatDate }}</p>
                </template>
                <p>信息状态：<span :style="{ color: isNodeError(item) ? '#ea5036': 'inherit' }">{{getNodeStatus(item)}}</span></p>
            </div>
        </div>
    </div>
</template>

<script>
    const icon0 = require('../assets/images/task/0.png');
    const icon1 = require('../assets/images/task/1.png');
    const icon2 = require('../assets/images/task/2.png');
    const icon3 = require('../assets/images/task/3.png');
    const icon4 = require('../assets/images/task/4.png');
    const icon5 = require('../assets/images/task/5.png');
    const icon6 = require('../assets/images/task/6.png');
    const icon7 = require('../assets/images/task/7.png');
    const icon8 = require('../assets/images/task/8.png');
    const icon9 = require('../assets/images/task/9.png');

    const stepOptions = {
        vms: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: '文件下载', icon: icon1},
            {step: 2, name: '一级杀毒', icon: icon2},
            {step: 3, name: '二级杀毒', icon: icon3},
            {step: 4, name: '媒体筛选', icon: icon4},
            {step: 5, name: '文件上传', icon: icon5},
            {step: 6, name: '媒体转码', icon: icon6},
            {step: 7, name: '媒体截图', icon: icon7},
            {step: 8, name: '结束处理', icon: icon8},
        ],
        vxs: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: '文件下载', icon: icon1},
            {step: 2, name: '一级杀毒', icon: icon2},
            {step: 3, name: '二级杀毒', icon: icon3},
            {step: 4, name: '媒体筛选', icon: icon4},
            {step: 5, name: '媒体转码', icon: icon6},
            {step: 6, name: '文件上传', icon: icon5},
            {step: 7, name: '完成通知', icon: icon8},
            {step: 8, name: '结束处理', icon: icon8},
        ],
        nle: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: 'NLE合成', icon: icon4},
            {step: 2, name: '媒体转码', icon: icon6},
            {step: 3, name: '媒体截图', icon: icon7},
            {step: 4, name: '文件上传', icon: icon5},
            {step: 5, name: '结束处理', icon: icon8},
        ],
        slicemerge: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: '切片合并', icon: icon4},
            {step: 2, name: '结束处理', icon: icon8},
        ],
        audiototext: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: '音频转文字', icon: icon6},
            {step: 2, name: '结束处理', icon: icon8},
        ],

        /**
         * 媒体智能分析工作流从基本工作流转为复合工作流，step值需要单独处理，可以通过判断结束的值来特殊处理。新老的step如下：
         *老：0 - 无效, 1 - 媒体AI分析, 2 - 结束处理
         *新：0 - 无效, 1 - 媒体解析, 2 - 媒体AI分析, 3 - 音频转文字, 4 - 结束处理
         * */
        aianalysis: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: '媒体AI分析', icon: icon4},
            {step: 2, name: '结束处理', icon: icon8},
        ],
        aianalysisNew: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: '媒体解析', icon: icon4},
            {step: 2, name: '媒体AI分析', icon: icon4},
            {step: 3, name: '音频转文字', icon: icon6},
            {step: 4, name: '结束处理', icon: icon8},
        ],
        transcode: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: '媒体转码', icon: icon6},
            {step: 2, name: '结束处理', icon: icon8},
        ],
        aicheck: [
            {step: 0, name: '无效', icon: icon0},
            {step: 1, name: '音频转文字', icon: icon6},
            {step: 2, name: '结束处理', icon: icon8},
        ]
    };
    export default {
        name: 'TaskStepStatus',
        props: ['taskStatusInfo', 'taskType'],
        computed: {
            stepsData() {
                const { taskStatusInfo, taskType } = this;
                let stepList = [];
                if (taskStatusInfo && taskStatusInfo.graph) {
                    stepList = taskStatusInfo.graph || [];
                    let options = stepOptions[taskType] || [];
                    // aianalysis 最后一步大于4 按新版命名规则命名
                    if (taskType == 'aianalysis') {
                        let lastStep = stepList[stepList.length - 1];
                        if (lastStep && lastStep.step >= 4){
                            options = stepOptions['aianalysisNew'];
                        }
                    }
                    stepList.forEach(item => {
                        if (options.length == 0) {
                            return;
                        }
                        const currentStep = options[item.step / 1];
                        item.url = currentStep.icon;
                        item.name = currentStep.name;
                    })
                }
                return stepList;
            },
        },
        methods: {
            // 判断节点状态是否是失败状态
            isNodeError(node) {
                if (node.status === 3) return true;
                if (node.status === 2) {
                    if (node.work && node.work.status === 5) return true;
                }
                return false;
            },
            // 获取节点对应状态名称
            getNodeStatus(node) {
                if (node.status === 2) {
                    // 节点状态为2时采用节点作业(work)状态,若作业状态无效(0),则采用节点状态
                    if (node.work && node.work.status > 0) {
                        const workStatusMap = {
                            0: '无效',
                            1: '空闲',
                            2: '等待',
                            3: '暂停',
                            4: '运行',
                            5: '失败',
                            6: '成功'
                        };
                        return workStatusMap[node.work.status];
                    }
                }
                return this.nodeStatusMap(node.status);
            },
            nodeStatusMap(val) {
                if (val === undefined || val === '') return '';
                let statusOptions = {
                    0: '无效',
                    1: '未开始',
                    2: '已开始',
                    3: '失败',
                    4: '成功'
                };
                return statusOptions[val];
            },
        },
        filters: {
            stepMap(val) {
                if (val === undefined || val === '') return '';
                let stepOptions = {
                    0: '无效',
                    1: '文件下载',
                    2: '一级杀毒',
                    3: '二级杀毒',
                    4: '媒体解析',
                    5: '文件迁移',
                    6: '媒体转码',
                    7: '媒体截图',
                    8: '结束处理',
                    9: '目标反馈'
                };
                return stepOptions[val];
            },

        }
    };
</script>

<style lang="scss">
    .steps-wrap {
        padding: 0;
        overflow: auto;

        .steps-item {
            float: left;
            width: 200px;
            min-height: 200px;
            margin-bottom: 10px;
        }
        .steps-detail p{
            margin: 0 0 4px 0;
        }
        .steps-item.active {
            .steps-detail {
                color: #333;
            }
        }

        .steps-item:last-child {
            .steps-head .line {
                display: none;
            }
        }

        .steps-head {
            margin-bottom: 10px;

            .circle {
                display: inline-block;
                vertical-align: middle;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                color: #1890FF;
                border: 1px solid #1890FF;
                border-radius: 50%;
                margin-left: 13px;
                margin-right: 10px;
            }

            .line {
                display: inline-block;
                vertical-align: middle;
                width: 140px;
                height: 2px;
                background: #1890FF;
            }
        }

        .steps-content {
            margin-bottom: 10px;
            display: inline-flex;
            align-items: center;
            > img {
                width: 48px;
                height: 48px;
                margin-right: 10px;
            }
        }

        .steps-detail {
            font-size: 12px;
            line-height: 24px;
            color: #999;
            padding-left: 4px;
        }
    }
</style>