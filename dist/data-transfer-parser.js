(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.dataTransferParser = factory());
}(this, (function () { 'use strict';

    /**
     * 解析剪切板数据传输对象
     * @param data {object} 剪切板数据传输对象
     * @param opt {object} 选项
     */
    function parseDataTransfer(data, opt) {
        if (data && data.items && data.items.length > 0) {
            var greed = !!opt.greed;
            var multiple = !!opt.multiple;

            if (greed) {
                getAllResult(data.items, opt.rules);
            } else {
                let rule = getHigherPriorityRule(data.items, opt.rules);
                if (rule) {
                    getResultByRule(data.items, rule, multiple);
                }
            }
        }
    }

    /**
     * 获取可用的最高优先级规则
     * @param transfers {array} 数据传输对象集合
     * @param rules {array} 规则
     * @return {rule}
     */
    function getHigherPriorityRule(transfers, rules) {
        var priorities = [];

        for (let i = 0; i < transfers.length; i++) {
            let item = transfers[i];
            let index = getRuleIndexByType(item.type, rules);

            if (index > -1) {
                priorities.push(index);
            }
        }

        if (priorities.length > 0) {
            let hpIndex = Math.min.apply(null, priorities);
            return rules[hpIndex]
        }
    }

    /**
     * 根据单个规则或取结果
     * @param transfers {array} 数据传输对象集合
     * @param rule {rule} 规则
     * @param multiple {boolean} 是否处理多个类型相同的文件
     * @return {array}
     */
    function getResultByRule(transfers, rule, multiple) {
        for (let i = 0; i < transfers.length; i++) {
            let item = transfers[i];

            if (typeMatch(item.type, rule.test)) {
                getResultByTransfer(item, rule.parser);

                if (!multiple) {
                    break
                }
            }
        }
    }

    /**
     * 获取所有结果
     * @param transfers {array} 数据传输对象集合
     * @param rules {array} 规则
     * @return {array}
     */
    function getAllResult(transfers, rules) {
        for (let i = 0; i < transfers.length; i++) {
            let item = transfers[i];
            let rule = getRuleByType(item.type, rules);

            if (rule) {
                getResultByTransfer(item, rule.parser);
            }
        }
    }

    /**
     * 通过传输数据获取结果
     * @param transfer {object} 数据传输对象
     * @param cb {function} 回调
     */
    function getResultByTransfer(transfer, cb) {
        const kind = transfer.kind;

        if (kind === 'string') {
            transfer.getAsString(cb);
        } else if (kind === 'file') {
            cb(transfer.getAsFile());
        } else {
            throw new Error('unknow type: ' + kind)
        }
    }

    /**
     * 通过类型获取规则
     * @param type {string} 类型
     * @param rules {array} 规则
     * @return {object}
     */
    function getRuleByType(type, rules) {
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (typeMatch(type, rule.test)) {
                return rule
            }
        }
    }

    /**
     * 通过类型获取规则索引
     * @param type {string} 类型
     * @param rules {array} 规则
     * @return {number}
     */
    function getRuleIndexByType(type, rules) {
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (typeMatch(type, rule.test)) {
                return i
            }
        }
        return -1
    }

    /**
     * 类型匹配
     * @param type {string} 类型
     * @param rule {string|regexp} 规则
     * @return {boolean}
     */
    function typeMatch(type, rule) {
        if (rule instanceof RegExp) {
            return rule.test(type)
        } else {
            return rule === type
        }
    }

    return parseDataTransfer;

})));
