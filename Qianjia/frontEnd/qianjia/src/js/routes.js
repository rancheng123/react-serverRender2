
const login = (location, callback)=>{
    require.ensure([],require=>{
        callback(null,require('./page/login/login').default)
    },'login')
}

const home = (location, callback)=>{
    require.ensure([],require=>{

        callback(null,require('./page/home/home').default)
    },'home')
}

const routes = [
    {
        path: '/',
        //此属性必填
        exact: true,
        keywords: '1111111',
        description: 'description2222',
        title: 'home',
        getComponent: home
    },
    {
        path: '/home',
        keywords: '1111111',
        description: 'description2222',
        title: 'home',
        getComponent: home
    },
    {
        path: '/login',
        keywords: '1111111',
        description: 'description2222',
        title: 'login',
        getComponent: login
    }

];
export default routes;

