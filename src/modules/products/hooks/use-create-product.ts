import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createProduct } from '@/modules/products/api/create-product'
import { productsKeys } from '@/modules/products/api/list-products'
import type { CreateProductInput, Product } from '@/modules/products/types/product.types'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation<Product, Error, CreateProductInput>({
    mutationFn: createProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })
}
