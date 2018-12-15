# DataTransfer Parser

用于在浏览器中解析剪切板数据。

## Install

```bash
npm install data-transfer-parser -S
```

## Usage

```js
    import parseDataTransfer from 'data-transfer-parser'

    document.body.addEventListener('paste', handle)

    function handle (e) {
      const data = e.clipboardData

      parseDataTransfer(data, {
        greed: false,
        rules: [
          {
            test: 'image/png',
            parser: function(file) {
              // 使用FileReader处理文件对象  
            }
          },
          {
            test: 'text/html',
            parser: function(html) {
              // 处理html格式
            }
          },
          {
            test: 'text/plain',
            parser: function(str) {
              // 处理普通文本
            }
          }
        ]
      })
    }
```

## Params

parseDataTransfer(clipboardData, options)

- clipboardData，剪切板数据
- options.greed 是否为贪婪模式；剪切板中可能包含多种数据类型，该字段为```true```会将所有类型进行依次处理。为```false```时只会取options.rules中最先匹配的一个规则（匹配顺序从rules中索引0开始）。
- options.mutiple 是否处理多个类型相同的文件
- options.rules 处理规则，为一个处理规则的数组，
    - test 匹配规则，字符串或者正则，匹配内容的mime类型。
    - parser 处理器，为函数，参数是内容。
    