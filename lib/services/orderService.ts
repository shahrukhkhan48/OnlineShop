import { Order } from '../models/order';
import { OrderRepository } from '../repositories/orderRepository';
import {CategoryRepository} from "../repositories/categoryRepository";

export class OrderService {

    private repo: OrderRepository;

    constructor() {
        this.repo = new OrderRepository();
    }
    async placeOrder(orderId: string, orderDate: string, customerEmail: string, ShippingAddress: string, OrderDetails: any[]): Promise<Order> {
        try {
            return await this.repo.placeOrder(orderId, orderDate,customerEmail, ShippingAddress, OrderDetails);
        } catch (error) {
            console.error('Error in OrderService.placeOrder:', error);
            throw error;
        }
    }
}
