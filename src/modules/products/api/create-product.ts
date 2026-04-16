import { apiClient, type ApiEnvelope } from '@/api/client'
import type { CreateProductInput, Product } from '@/modules/products/types/product.types'

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const response = await apiClient.post<ApiEnvelope<Product>>('/products', input)
  return response.data.data
}
