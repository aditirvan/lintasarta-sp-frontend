import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
export const useVoucher = () => {

    const {
        fetchVouchers,
        claimVoucher,
        fetchVoucherCreditDetails,
        claimVoucherCredit,
        fetchVoucherDiscountProjects,
        claimVoucherDiscount,
    } = useNamespacedActions('VOUCHER', [
        'fetchVouchers',
        'claimVoucher',
        'fetchVoucherCreditDetails',
        'claimVoucherCredit',
        'fetchVoucherDiscountProjects',
        'claimVoucherDiscount',
    ])

    return {
        ...useNamespacedState('VOUCHER', [
            'vouchers',
            'voucher',
            'isLoading',
            'voucherCreditDetail',
            'voucherCreditDetails',
            'voucherCreditDetailPagination',
            'isVoucherCreditDetailLoading',
            'voucherDiscountProject',
            'voucherDiscountProjects',
            'voucherDiscountProjectPagination',
            'isVoucherDiscountProjectLoading',
        ]),
        fetchVouchers,
        claimVoucher,
        fetchVoucherCreditDetails,
        claimVoucherCredit,
        fetchVoucherDiscountProjects,
        claimVoucherDiscount,
    }
}