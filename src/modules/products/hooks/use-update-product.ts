import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productsKeys } from '@/modules/products/api/list-products'
import { updateProduct } from '@/modules/products/api/update-product'
import type { Product, UpdateProductInput } from '@/modules/products/types/product.types'

type Variables = {
  id: string
  input: UpdateProductInput
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation<Product, Error, Variables>({
    mutationFn: ({ id, input }) => updateProduct(id, input),
    onSuccess: (product) => {
      queryClient.setQueryData(productsKeys.detail(product.id), product)
      void queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })
}
