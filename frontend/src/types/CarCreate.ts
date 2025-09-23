// Русский коммент: DTO для отправки на бек при создании
export interface CarCreate {
  make: string
  model: string
  year: number
  priceEur: number
  imageUrl: string
}
