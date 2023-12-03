export interface foodItem{
    id: number,
    name: string,
    price: number,
    rating: number,
    discount: number,
    category: string,
    image: string
}

export interface cartItem{
    name: string,
    price: number,
    rating: number,
    discount: number,
    image: string,
    quantity: number,
    grandTotal: number
}