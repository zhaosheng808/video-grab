/*
* 自定义管道
* */
import Vue from 'vue';
import {formatDate} from './utils';
const filters = {
    formatDate
};
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))