import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  Coupon,
  CouponListParams,
  CouponListResponse,
  CreateCouponInput,
  UpdateCouponInput,
} from '@/modules/coupons/types/coupon.types'

export const couponKeys = {
  all: ['coupons'] as const,
  list: (params: CouponListParams) => ['coupons', 'list', params] as const,
  detail: (id: string) => ['coupons', 'detail', id] as const,
}

export function couponListQueryOptions(params: CouponListParams) {
  return queryOptions({
    queryKey: couponKeys.list(params),
    queryFn: async (): Promise<CouponListResponse> => {
      const response = await apiClient.get<ApiEnvelope<CouponListResponse>>(
        '/coupons',
        { params }
      )
      return response.data.data
    },
  })
}

export async function createCoupon(input: CreateCouponInput): Promise<Coupon> {
  const response = await apiClient.post<ApiEnvelope<Coupon>>('/coupons', input)
  return response.data.data
}

export async function updateCoupon(
  id: string,
  input: UpdateCouponInput
): Promise<Coupon> {
  const response = await apiClient.put<ApiEnvelope<Coupon>>(
    `/coupons/${id}`,
    input
  )
  return response.data.data
}

export async function deleteCoupon(id: string): Promise<Coupon> {
  const response = await apiClient.delete<ApiEnvelope<Coupon>>(
    `/coupons/${id}`
  )
  return response.data.data
}
