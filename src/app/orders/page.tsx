import { OrdersList } from "./OrderList"

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-6">All Orders</h1>
    <OrdersList />
    </div>
  )
}
