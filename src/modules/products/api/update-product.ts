import { apiClient, type ApiEnvelope } from '@/api/client'
import type { Product, UpdateProductInput } from '@/modules/products/types/product.types'

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const response = await apiClient.put<ApiEnvelope<Product>>(`/products/${id}`, input)
  return response.data.data
}
