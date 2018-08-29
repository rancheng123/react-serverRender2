


//组件管理器
class ComponentStore{
    constructor(){
        this.modules = {};
    };

    //通过id 获取组件
    getById(id){
        if(this.isExist(id)){
            return this.modules[id];
        }else{
            console.error('组件名为'+id+'不存在')
            return null;
        }

    };

    //给组件设置id
    set(component){

        //自动收集 组件id来源  start
        if(component.props.$id){
            var id = component.props.$id;
        }
        //没有id
        else{
            //路由组件
            if(component.props.route){
                id = component.props.route.path;
            }
            //非路由组件，提示加上$id 属性
            else{
                console.error('组件'+component.constructor.name+'不是路由组件，请加上$id 属性');
                return;
            }
        }
        //自动收集 组件id来源  end

        if(this.isExist(id)){
            console.error('组件id名'+ id +'重复')
            return;
        }

        //给组件加入id 属性
        component.selfId = id;
        this.modules[id] = component;

        //路由组件 title
        if(component.props.route){
            if(component.props.route.title){
                document.title = component.props.route.title;
            }
        }

    };

    //通过id 清除组件
    clear(component){

        var id = component.selfId;
        if(!this.isExist(id)){
            console.error('组件名为'+id+'不存在')
            return;
        };
        this.modules[id] = null;
        delete this.modules[id];
    };
    //判断组件是否存在
    isExist(id){
        return this.modules[id]?true:false;
    };




    /**
     * 更新组件
     * @param id  组件或组件id
     * @param json
     * @param callback
     */
    update(componentArg,json,callback){

        //是react组件
        if(componentArg.setState){
            var component = componentArg;
        }
        // id
        else if( typeof componentArg == 'string' ){
            var component = this.getById(componentArg);
        }

        if(component){
            for(var name in json){
                component.state[name] = json[name];
            };
            component.setState(component.state,function(){
                callback && callback()
            });

            //跟踪组件更新
            var isDebug = location.href.match(config.debug.trace);
            if(isDebug){
                debugger;
            }
        }
    }

};
window.componentStore = new ComponentStore();

