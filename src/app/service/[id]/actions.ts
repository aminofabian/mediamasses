"use server";

import { createOrder, getOrder } from "@/lib/db/order";
import { prisma } from "@/lib/db/prisma";
import { PriceType } from "@prisma/client";

export async function incrementServiceQuantity(
  serviceId: number,
  priceType: PriceType,
  quantity: number,
  targetUrl: string
) {
  const order = (await getOrder() ?? await createOrder());
  const articleInCart = order.orderItems.find(
    orderItem => orderItem.serviceId === serviceId && orderItem.priceType === priceType
  );

  // Fetch the service to get its prices
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service) {
    throw new Error("Service not found");
  }

  let price: number;
  switch (priceType) {
    case "LOW":
      price = service.lowPrice;
      break;
    case "MEDIUM":
      price = service.mediumPrice;
      break;
    case "HIGH":
      price = service.highPrice;
      break;
    default:
      throw new Error("Invalid price type");
  }

  if (articleInCart) {
    await prisma.orderItem.update({
      where: { id: articleInCart.id },
      data: {
        quantity: { increment: quantity }
      }
    });
  } else {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        serviceId,
        quantity,
        price,
        priceType,
        targetUrl
      }
    });
  }
}