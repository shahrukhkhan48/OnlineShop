import { SES } from 'aws-sdk';
import * as Handlebars from 'handlebars';
import {OrderRepository} from "../repositories/orderRepository";
import {OrderService} from "../services/orderService";


export const main = async (event: any) => {
    try {

        const repo = new OrderRepository();
        const service = new OrderService(repo);

        const { orderId, customerEmail, ShippingAddress, OrderDetails, orderDate } = event;

        await service.placeOrder(orderId, orderDate, customerEmail, ShippingAddress, OrderDetails);

    } catch (error) {
        console.error('Error processing order:', error);
        throw new Error('Error processing order');
    }
};
