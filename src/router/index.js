import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        //登入頁
        {
            path: '/',
            name: 'SignIn',
            component: () => import('../views/SignInViews.vue'),
        },
        //註冊頁
        {
            path: '/signup',
            name: 'SignUp',
            component: () => import('../views/SignUpViews.vue'),
        },
        //待辦事項頁
        {
            path: '/todolist',
            name: 'TodoList',
            component: () => import('../views/TodoListViews.vue'),
        },
    ],
});

//每一頁都檢查是否有token
router.beforeEach( async(to ,from, next) => {
    const token = document.cookie.replace(/(?:^|.*;\s*)todolistToken\s*=\s*([^;]*).*$/i, '$1');
    if(!token){
        if(to.path === '/' || to.path === '/signup'){
            return next();
        }else{
            return next('/');
        }
    }
    next();
})

export default router;
