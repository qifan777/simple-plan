module.exports = {
    transpileDependencies: ['@dcloudio/uni-ui'],
    devServer: {
        disableHostCheck: true,
        open: true,
        port: 3000,
        proxy: {
            '/api': {
                // target: 'http://localhost',
                target:"https://www.jarcheng.top/cloud-api",
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    publicPath: './',
};