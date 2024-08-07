import { Prisma, PaymentMethod, OrderStatus, PriceType } from "@prisma/client";
import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";

export type OrderWithServices = Prisma.OrderGetPayload<{
  include: { orderItems: { include: { service: true } } };
}>;

export type OrderItemWithService = Prisma.OrderItemGetPayload<{
  include: { service: true };
}>;

export type ShoppingOrder = OrderWithServices & {
  size: number;
  subtotal: number;
};

export async function getOrder(): Promise<ShoppingOrder | null> {
  const localOrderId = cookies().get("localOrderId")?.value;
  
  if (!localOrderId) {
    return null;
  }

  const orderId = parseInt(localOrderId, 10);

  if (isNaN(orderId)) {
    console.error("Invalid order ID in cookie");
    return null;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: { include: { service: true } } },
  });

  if (!order) {
    return null;
  }

  return {
    ...order,
    size: order.orderItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: order.orderItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    ),
  };
}

export async function createOrder(phoneNumber: string = ""): Promise<ShoppingOrder> {
  const newOrder = await prisma.order.create({
    data: {
      total: 0,
      status: OrderStatus.PENDING,
      paymentMethod: PaymentMethod.MPESA,
      currencyCode: 'KES',
      phoneNumber: phoneNumber,
      paymentInitiated: false,
      orderItems: {
        create: [],
      },
    },
    include: { orderItems: { include: { service: true } } },
  });

  cookies().set("localOrderId", newOrder.id.toString());

  return {
    ...newOrder,
    size: 0,
    subtotal: 0,
  };
}