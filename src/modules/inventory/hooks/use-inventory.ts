import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardKeys } from '@/modules/dashboard/api/get-dashboard-overview'
import { productsKeys } from '@/modules/products/api/list-products'
import { adjustStock, inventoryKeys, inventoryListQueryOptions, inventoryMovementsQueryOptions, lowStockQueryOptions, } from '@/modules/inventory/api/inventory'
import type { AdjustStockInput, InventoryListParams, InventoryMovementsParams, InventoryVariant, } from '@/modules/inventory/types/inventory.types'

export function useInventory(params: InventoryListParams) {
  return useQuery(inventoryListQueryOptions(params))
}

export function useLowStock(params: InventoryListParams) {
  return useQuery(lowStockQueryOptions(params))
}

export function useInventoryMovements(variantId: string, params: InventoryMovementsParams) {
  return useQuery(inventoryMovementsQueryOptions(variantId, params))
}

export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation<InventoryVariant, Error, { variantId: string; input: AdjustStockInput }>({
    mutationFn: ({ variantId, input }) => adjustStock(variantId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
      void queryClient.invalidateQueries({ queryKey: productsKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.summary })
    },
  })
}
