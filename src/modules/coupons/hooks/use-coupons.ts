import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  couponKeys,
  couponListQueryOptions,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from '@/modules/coupons/api/coupons'
import type {
  Coupon,
  CouponListParams,
  CreateCouponInput,
  UpdateCouponInput,
} from '@/modules/coupons/types/coupon.types'

export function useCoupons(params: CouponListParams) {
  return useQuery(couponListQueryOptions(params))
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()
  return useMutation<Coupon, Error, CreateCouponInput>({
    mutationFn: createCoupon,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()
  return useMutation<Coupon, Error, { id: string; input: UpdateCouponInput }>({
    mutationFn: ({ id, input }) => updateCoupon(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()
  return useMutation<Coupon, Error, string>({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
  })
}
