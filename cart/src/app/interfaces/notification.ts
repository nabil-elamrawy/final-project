export interface Notification {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

export interface OrderConfirmResponse {
    message: string;
    order: {
        _id: string;
        userId: string;
        products: {
            productId: string;
            productName: string;
            price: number;
            quantity: number;
            _id: string;
        }[];
        totalPrice: number;
        status: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}