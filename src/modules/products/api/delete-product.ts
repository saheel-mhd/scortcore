import { apiClient, type ApiEnvelope } from '@/api/client'
import type { Product } from '@/modules/products/types/product.types'

export async function deleteProduct(id: string): Promise<Product> {
  const response = await apiClient.delete<ApiEnvelope<Product>>(`/products/${id}`)
  return response.data.data
}
