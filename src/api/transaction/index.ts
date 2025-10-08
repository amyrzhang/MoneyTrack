import request from '/@/utils/request';
import {UnwrapRef} from "vue";

/**
 * 证券交易记录接口
 *
 * @method getTransactions 获取证券交易记录列表
 * @method createTransaction 创建证券交易记录
 * @method updateTransaction 更新证券交易记录
 * @method deleteTransaction 删除证券交易记录
 */
export function useTransactionApi() {
    return {
        // 获取证券交易记录列表
        getTransactions: (params?: object) => {
            return request({
                url: '/api/transaction',
                method: 'get',
                params,
            });
        },
        // 创建证券交易记录
        createTransaction: (data?: object) => {
            return request({
                url: '/api/transaction',
                method: 'post',
                data,
            });
        },
        // 获取单个证券交易记录详情
        getTransaction: (transaction_id: string, params?: object) => {
            return request({
                url: `/api/transaction/${transaction_id}`,
                method: 'get',
                params,
            });
        },
        // 更新证券交易记录
        updateTransaction: (transaction_id: UnwrapRef<number>, data?: object) => {
            return request({
                url: `/api/transaction/${transaction_id}`,
                method: 'put',
                data,
            });
        },
        // 删除证券交易记录
        deleteTransaction: (transaction_id: string) => {
            return request({
                url: `/api/transaction/${transaction_id}`,
                method: 'delete',
            });
        },
    };
}