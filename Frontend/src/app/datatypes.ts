export interface foodItem{
    name: string,
    price: number,
    rating: number,
    discount: number,
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