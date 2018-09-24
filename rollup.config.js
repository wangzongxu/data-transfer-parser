var pkg = require('./package.json')
var name = pkg.name

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/' + name + '.js',
        name: 'dataTransferParser',
        format: 'umd'
    }
}