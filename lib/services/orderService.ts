import { Order } from '../models/order';
import { OrderRepository } from '../repositories/orderRepository';

export class OrderService {
    constructor(private repo: OrderRepository) {}

    async placeOrder(
        orderDate: string,
        orderId: string,
        customerEmail: string,
        shippingAddress: string,
        orderDetails: { productId: string, quantity: number }[],
        status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'FAILED'
    ): Promise<Order> {
        return this.repo.placeOrder(orderDate, orderId, customerEmail, shippingAddress, orderDetails, status);
    }

    async updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
        return this.repo.updateOrderStatus(orderId, newStatus);
    }
}