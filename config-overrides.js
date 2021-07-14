const {override, fixBabelImports} = require('customize-cra')
module.exports = override(
    // 针对antd按需导包 使用babel-plugin-import
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',  // 自动打包相关样式
    }),
);
