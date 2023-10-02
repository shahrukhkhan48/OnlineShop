import { Order } from '../models/order';
import { OrderRepository } from '../repositories/orderRepository';

export class OrderService {
    constructor(private repo: OrderRepository) {}

    async placeOrder(customerEmail: string, ShippingAddress: string, OrderDetails: any[]): Promise<Order> {
        return await this.repo.placeOrder(customerEmail, ShippingAddress, OrderDetails);
    }
}
