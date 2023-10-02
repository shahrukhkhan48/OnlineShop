import { OrderService } from '../services/orderService';
import { OrderRepository } from '../repositories/orderRepository';

const repo = new OrderRepository();
const service = new OrderService(repo);

interface AppSyncEvent {
    identity: {
        claims: {
            email: string;
        };
    };
    arguments: {
        order: {
            ShippingAddress: string;
            OrderDetails: any[];
        };
    };
}

export const main = async (event: AppSyncEvent) => {
    const customerEmail = event.identity.claims.email;
    const { ShippingAddress, OrderDetails } = event.arguments.order;

    return await service.placeOrder(customerEmail, ShippingAddress, OrderDetails);
};
