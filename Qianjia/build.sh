echo '执行nodejs脚本编译静态资源';
BUILD_DIR=/home/test/fff/Qianjia/build;
cd $BUILD_DIR;
export NODE_ENV=production & export APP_ENV=qianjia& node build.js & node buildStatic.js;
cd $BUILD_DIR;
echo 'nodejs scripts finished';