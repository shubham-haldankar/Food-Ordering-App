export interface foodItem{
    id: number,
    name: string,
    price: number,
    rating: number,
    category: string,
    discount: number,
    image: string
}

export interface cartItem{
    "item-id": number,
    name: string,
    price: number,
    rating: number,
    category: string,
    discount: number,
    image: string,
    "restaurant-id": number,
    quantity: number,
    subTotal: number
}

export interface restaurant{
    id: number,
    name: string,
    mobile: number,
    address: {
        street: string,
        pincode: number,
        city: string,
        state: string,
        country: string
    },
    image: string,
    rating: number,
    noOfRatings: number,
    menu: foodItem[],
    maxDiscount: number,
    category: string
}

export interface user{
    id: number,
    name: string,
    mobile: number,
    address: {
        street: string,
        pincode: number,
        city: string,
        state: string,
        country: string
    },
    cart: cartItem[]
}

export interface credentials{
    id: number,
    email: string,
    password: string
}

export interface order{
    id: number,
    "user-id": number,
    "restaurant-id": number,
    items: cartItem[],
    address: {
        street: string,
        pincode: number,
        city: string,
        state: string,
        country: string
    },
    grandTotal: number,
    rating: number
}