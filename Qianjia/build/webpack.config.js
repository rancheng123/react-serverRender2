//目录结构
var dir={
    js: './js/',
    css: './style/',
    images: './images/'
};

var path = require('path');



//开发或生产环境
var isOnline = (process.env.NODE_ENV.trim() == 'production');
//APP
var app = process.env.APP_ENV;

if(process.env.NODE_SOURCEMAP){
    var isNoSourceMap = (process.env.NODE_SOURCEMAP.trim() == 'noSourceMap');
}else{
    var isNoSourceMap = false;
}





var config = require('./config/'+ process.env.APP_ENV.trim() +'_config');
var src_path = config.src_path;
var dist_path = config.dist_path;


/*webpack插件 start*/
var webpack = require('webpack');


//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    //filename: 'apps/vendors.js',
    filename: isOnline ? dir.js+'vendors.[chunkhash:5].js' : dir.js+'vendors.js'

});





var HtmlWebpackPlugin= require('html-webpack-plugin');
var px2rem = require('postcss-px2rem');
var browserslist = require('browserslist');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
/*webpack插件 end*/


var indexHtml = new HtmlWebpackPlugin({
	template: path.resolve(src_path,'index.html'),
	hash: true
});



var plugins = [
    commonsPlugin,
    indexHtml,

    //热更新插件
    //new webpack.HotModuleReplacementPlugin()

    new ExtractTextPlugin({
        //filename: isOnline ? dir.css+'styles[contenthash].css' : dir.css+'styles.css'  ,
        filename: isOnline ? 'styles[contenthash].css' : 'styles.css'  ,
        allChunks: true
    }),
];

/*console.log('isOnline')
console.log(isOnline)
//给react-devTool 加入source功能 （自定义组件右键 出现 show Source）
require("babel-core").transform("code", {
    plugins: ["transform-react-jsx-source"]
});*/



if(isOnline){
    var uglifyJS = new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        sourceMap: true,
        mangle: false
    });
    plugins.push(uglifyJS);

    //解决压缩后报错警告
    var AA = new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    });
    plugins.push(AA);



}



/*蚂蚁金服 start*/
const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
    path.resolve(__dirname, '../frontEnd/qianjia/src/image/svg/'),  // 2. 自己私人的 svg 存放目录
];
/*蚂蚁金服 end*/



const cssLoaders = [
    /*{
     loader: 'style-loader'
     },*/
    {
        loader: 'css-loader',
        options: {
            sourceMap: true
        }
    },
    //注意事项：
    //postcss-loader需要放在style-loader,css-loader之前 ，sass-loader之后
    {
        loader: 'postcss-loader',
        options: {
            plugins: [
                //require('postcss-smart-import')({ /* ...options */ }),
                //require('precss')({ /* ...options */ }),
                require('autoprefixer')({
                    browsers: browserslist('> 1%')
                }),
                require('postcss-px2rem')({
                    remUnit: 100
                })
            ]
        }
    }
];
const sassLoaders = cssLoaders.concat([
    {
        loader: 'sass-loader',
        options: {
            sourceMap: true
        }
    }
])






module.exports = {
    //插件项
    plugins:plugins,
    //页面入口文件配置
    entry: {
        //'webpack-hot-middleware/client': ['webpack-hot-middleware/client'],

        vendors: [
            'react',
            'react-router',
            'react-dom',

            //'antd-mobile',
            'classnames',
            'isomorphic-fetch',
            'moment',
            'react-addons-css-transition-group',
            'react-addons-transition-group',
            'rmc-cascader',
            'underscore'

            /*
             react-validation
             react-addons-css-transition-group
             react-addons-transition-group
             classnames

             Popagation组件 需要定义别名

            */


        ],
        index : path.resolve(src_path,'js/index.js')

    },
    output: {
        path: dist_path,
        filename: isOnline ? dir.js+'[name].[chunkhash:5].js' : dir.js+'[name].js'  ,
        chunkFilename: isOnline ? dir.js+'modules/[name].[chunkhash:5].chunk.js' : dir.js+'modules/[name].chunk.js' ,
        //publicPath: isOnline ? '' : 'http://localhost:8388/',
        publicPath: isOnline ? '' : 'http://localhost:'+ config.port +'/'
    },
    watch: true,
    watchOptions: {
        poll: true
    },

    devtool: isNoSourceMap?'':'source-map',
    module: {

        //加载器配置
        loaders: [
            {
                test: /\.css$/,
                include: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    use: cssLoaders
                }),
            },

            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    use: sassLoaders
                }),
            },

            {
                test: /\.js$/,
                // 匹配不希望处理文件的路径
                exclude: /(node_modules|bower_components)/,


                /*此处含有隐患
                    node报错：
                         (node:9704) DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic, see https://github.com/webpack/loader-utils/issues/56
                         parseQuery() will be replaced with getOptions() in the next major version of loader-utils.
                    描述：loader 开发者的问题，不是使用者的问题。期待开发者解决
                    备选方案：
                        使用以下方式不会报错
                            loader: 'babel-loader?presets[]=es2015&presets[]=react'

                */

                //ES2015转码规则       react转码规则
                //loader: 'babel-loader?presets[]=es2015&presets[]=react'

                //
                loader: [
                    {
                        loader: 'babel-loader',
                        options: {
                            //babelrc: false,
                            presets: ['es2015','react'],
                            plugins: [
                                ["import", {
                                    "style": "css",
                                    "libraryName": "antd-mobile"
                                }],

                                //react-hot-loader
                                //["react-hot-loader/babel"]
                            ]
                        }
                    }
                ]
            },
            

            {
                test: /\.(jpeg|jpg|png|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[hash:8].[ext]'

                //html中使用  <img src={require("./ran.jpg")} alt="22222222"/>

            },


           /* {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            },*/


           //蚂蚁金服字体 start
            {
                test: /\.(svg)$/i,
                loader: 'svg-sprite-loader',
                include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
            },
            //蚂蚁金服字体 end

        ]
    },
    //其它解决方案配置
    resolve: {
        alias: {
            AppStore : 'js/stores/AppStores.js',  //后续直接 require('AppStore') 即可
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js',
            test: path.resolve(src_path,'js/asset/third/test.js')

        },
        extensions: ['.web.js','.js', '.json', '.scss'],
    },

    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000',
                secure: false
            }
        },
        hotOnly: true
    }
};

