import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [

    {
        path: '/',
        component: () => import('layouts/login-layout.vue'),
        children: [
            {
                path: '',
                component: () => import('pages/index.vue'),
                alias: 'login',
            },
        ],
    },

    {
        path: '/interconnect',
        component: () => import('layouts/main-layout.vue'),
        children: [{ path: '', component: () => import('pages/chat.vue') }],
        meta: {
            access: 'auth-only',
        },
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
