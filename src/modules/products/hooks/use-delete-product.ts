import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteProduct } from '@/modules/products/api/delete-product'
import { productsKeys } from '@/modules/products/api/list-products'
import type { Product } from '@/modules/products/types/product.types'

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation<Product, Error, string>({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: (_product, id) => {
      queryClient.removeQueries({ queryKey: productsKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })
}
