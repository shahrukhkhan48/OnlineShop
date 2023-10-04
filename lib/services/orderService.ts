import { Order } from '../models/order';
import { OrderRepository } from '../repositories/orderRepository';

export class OrderService {
    constructor(private repo: OrderRepository) {}

    async placeOrder(orderId: string, orderDate: string, customerEmail: string, ShippingAddress: string, OrderDetails: any[]): Promise<Order> {
        try {
            return await this.repo.placeOrder(orderId, orderDate,customerEmail, ShippingAddress, OrderDetails);
        } catch (error) {
            console.error('Error in OrderService.placeOrder:', error);
            throw error;
        }
    }
}
