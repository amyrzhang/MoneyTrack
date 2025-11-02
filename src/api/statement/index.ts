import request from '/@/utils/request';

/**
 * 以下为模拟接口地址，gitee 的不通，就换自己的真实接口地址
 *
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 后端控制菜单模拟json，路径在 https://gitee.com/lyt-top/vue-next-admin-images/tree/master/menu
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @method updateBillRecord 获取后端动态路由菜单(admin)
 * @method createBillRecord 获取后端动态路由菜单(test)
 */
export function useStatementApi() {
    return {
        getStatement: (params?: object) => {
            return request({
                url: '/api/bank-statement',
                method: 'get',
                params,
            });
        },
        getExpCategory: (params?: object) => {
            return request({
                url: '/api/statement/category',
                method: 'get',
                params,
            });
        },
        getExpTop10: (params?: object) => {
            return request({
                url: '/api/statement/top10',
                method: 'get',
                params
            })
        },
        getMonthlyBalance: (params?: object) => {
            return request({
                url: '/api/statement/balance/monthly',
                method: 'get',
                params,
            });
        },
        getQuarterlyBalance: (params?: object) => {
            return request({
                url: '/api/statement/balance/quarterly',
                method: 'get',
                params,
            });
        },
        getAnnualBalance: (params?: object) => {
            return request({
                url: '/api/statement/balance/annual',
                method: 'get',
                params,
            });
        },
        getBankStatementMonthlyAgg: (params?: object) => {
            return request({
                url: '/api/bank-statement/monthly-agg',
                method: 'get',
                params,
            });
        },
    };
}
