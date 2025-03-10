import request from '/@/utils/request';

/**
 * 以下为模拟接口地址，gitee 的不通，就换自己的真实接口地址
 *
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 后端控制菜单模拟json，路径在 https://gitee.com/lyt-top/vue-next-admin-images/tree/master/menu
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @method getAdminReport 获取后端动态路由菜单(admin)
 * @method getTestMenu 获取后端动态路由菜单(test)
 */
export function useTableApi() {
    return {
        getTable: (params?: object) => {
            return request({
                url: '/transactions',
                method: 'get',
                params,
            });
        },
        updateRecord:(data) => {
            return request({
                url: '/transactions',
                method: 'post',
                data
            });
        },
        getAccountBalance: (params?: object) => {
            return request({
                url: '/account/balance',
                method: 'get',
                params,
            });
        },
        getMonthlyBalance: (params?: object) => {
            return request({
                url: '/monthly/balance',
                method: 'get',
                params,
            });
        },
        getAccountActivity: (params?: object) => {
            return request({
                url: '/account/activity',
                method: 'get',
                params,
            });
        },
    };
}
