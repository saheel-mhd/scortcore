import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ordersKeys } from '@/modules/orders/api/orders.keys'
import { updateOrderStatus } from '@/modules/orders/api/update-order-status'
import type { Order, OrderStatus } from '@/modules/orders/types/order.types'

type Variables = {
  id: string
  status: OrderStatus
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, Variables>({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (order) => {
      queryClient.setQueryData(ordersKeys.detail(order.id), order)
      void queryClient.invalidateQueries({ queryKey: ordersKeys.all })
    },
  })
}
