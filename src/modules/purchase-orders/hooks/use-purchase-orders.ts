import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardKeys } from '@/modules/dashboard/api/get-dashboard-overview'
import { inventoryKeys } from '@/modules/inventory/api/inventory'
import { productsKeys } from '@/modules/products/api/list-products'
import { createPurchaseOrder, purchaseOrderKeys, purchaseOrdersListQueryOptions, receivePurchaseOrder,} from '@/modules/purchase-orders/api/purchase-orders'
import type { CreatePurchaseOrderInput, PurchaseOrder, PurchaseOrderListParams, ReceivePurchaseOrderInput, } from '@/modules/purchase-orders/types/purchase-order.types'

export function usePurchaseOrders(params: PurchaseOrderListParams) {
  return useQuery(purchaseOrdersListQueryOptions(params))
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation<PurchaseOrder, Error, CreatePurchaseOrderInput>({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all })
    },
  })
}

export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation<
    PurchaseOrder,
    Error,
    { id: string; input: ReceivePurchaseOrderInput }
  >({
    mutationFn: ({ id, input }) => receivePurchaseOrder(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all })
      void queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
      void queryClient.invalidateQueries({ queryKey: productsKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.summary })
    },
  })
}
