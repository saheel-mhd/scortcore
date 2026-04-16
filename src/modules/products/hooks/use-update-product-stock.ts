import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productsKeys } from '@/modules/products/api/list-products'
import { updateProductStock } from '@/modules/products/api/update-product-stock'
import type { Product, UpdateProductStockInput } from '@/modules/products/types/product.types'

type Variables = {
  id: string
  input: UpdateProductStockInput
}

export function useUpdateProductStock() {
  const queryClient = useQueryClient()

  return useMutation<Product, Error, Variables>({
    mutationFn: ({ id, input }) => updateProductStock(id, input),
    onSuccess: (product) => {
      queryClient.setQueryData(productsKeys.detail(product.id), product)
      void queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })
}
