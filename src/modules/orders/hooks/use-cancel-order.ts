import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardKeys } from '@/modules/dashboard/api/get-dashboard-overview'
import { inventoryKeys } from '@/modules/inventory/api/inventory'
import { cancelOrder } from '@/modules/orders/api/cancel-order'
import { ordersKeys } from '@/modules/orders/api/orders.keys'
import { productsKeys } from '@/modules/products/api/list-products'
import type { Order } from '@/modules/orders/types/order.types'

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, { id: string; reason?: string }>({
    mutationFn: ({ id, reason }) => cancelOrder(id, reason),
    onSuccess: (order) => {
      queryClient.setQueryData(ordersKeys.detail(order.id), order)
      void queryClient.invalidateQueries({ queryKey: ordersKeys.all })
      void queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
      void queryClient.invalidateQueries({ queryKey: productsKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.summary })
    },
  })
}
