/**
 * 解析剪切板数据传输对象
 * @param data {object} 剪切板数据传输对象
 * @param opt {object} 选项
 */
function parseDataTransfer(data, opt) {
    if (!(data && data.items)) return
    var greed = !!opt.greed

    if (greed) {
        getAllResult(data.items, opt.rules)
    } else {
        getHigherPriorityResult(data.items, opt.rules)
    }
}

/**
 * 获取优先级最高的结果
 * @param transfers {array} 数据传输对象集合
 * @param rules {array} 规则
 * @return {array}
 */
function getHigherPriorityResult(transfers, rules) {
    var priorities = []
    var itemsMap = {}

    for (let i = 0; i < transfers.length; i++) {
        let item = transfers[i]
        let index = getRuleIndexByType(item.type, rules)

        if (index > -1) {
            priorities.push(index)
            itemsMap[index] = item
        }
    }

    let hpIndex = Math.min.apply(null, priorities)
    let hpRule = rules[hpIndex]
    let transfer = itemsMap[hpIndex]
    getResultByTransfer(transfer, hpRule.parser)
}

/**
 * 获取所有结果
 * @param transfers {array} 数据传输对象集合
 * @param rules {array} 规则
 * @return {array}
 */
function getAllResult(transfers, rules) {
    for (let i = 0; i < transfers.length; i++) {
        let item = transfers[i]
        let rule = getRuleByType(item.type, rules)

        if (rule) {
            getResultByTransfer(item, rule.parser)
        }
    }
}

/**
 * 通过传输数据获取结果
 * @param transfer {object} 数据传输对象
 * @param cb {function} 回调
 */
function getResultByTransfer(transfer, cb) {
    const kind = transfer.kind

    if (kind === 'string') {
        transfer.getAsString(cb)
    } else if (kind === 'file') {
        cb(transfer.getAsFile())
    } else {
        throw new Error('unknow type: ' + kind)
    }
}

/**
 * 通过类型获取规则
 * @param type {string|regexp} 类型
 * @param rules {array} 规则
 * @return {object}
 */
function getRuleByType(type, rules) {
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        if (typeMatch(type, rule.test)) {
            return rule
        }
    }
}

/**
 * 通过类型获取规则索引
 * @param type {string|regexp} 类型
 * @param rules {array} 规则
 * @return {number}
 */
function getRuleIndexByType(type, rules) {
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        if (typeMatch(type, rule.test)) {
            return i
        }
    }
    return -1
}

/**
 * 类型匹配
 * @param type {string|regexp} 类型
 * @param rules {array} 规则
 * @return {boolean}
 */
function typeMatch(type, rule) {
    if (rule instanceof RegExp) {
        return rule.test(type)
    } else {
        return rule === type
    }
}

export default parseDataTransfer