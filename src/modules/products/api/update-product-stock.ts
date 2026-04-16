import { apiClient, type ApiEnvelope } from '@/api/client'
import type { Product, UpdateProductStockInput } from '@/modules/products/types/product.types'

export async function updateProductStock(
  id: string,
  input: UpdateProductStockInput
): Promise<Product> {
  const response = await apiClient.put<ApiEnvelope<Product>>(`/products/${id}/stock`, input)
  return response.data.data
}
