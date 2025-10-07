export interface Order {
    _id: {
        $oid: string;
    };
    userId: {
        $oid: string;
    };
    products: OrderProduct[];
    totalPrice: number;
    status: string;
    createdAt: {
        $date: string;
    };
    updatedAt: {
        $date: string;
    };
    __v: number;
}

export interface OrderProduct {
    productId: {
        $oid: string;
    };
    productName: string;
    price: number;
    quantity: number;
    _id: {
        $oid: string;
    };
}