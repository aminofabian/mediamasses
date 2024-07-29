import ServiceCard from "@/components/ServiceCard";
import { prisma } from "@/lib/db/prisma";

export default async function Home() {
  let services = [];
  
  try {
    services = await prisma.service.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        socialAccount: true,
        description: true,
        lowPrice: true,
        mediumPrice: true,
        highPrice: true,
        imageUrl: true,
        minQuantity: true,
        maxQuantity: true,
        deliveryTime: true,
        serviceType: true,
        isAvailable: true,
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    // Optionally, set services to an empty array or handle error state
  }
  
  return (
    <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {services.length > 0 ? (
      services.map((service) => (
        <div key={service.id} className="flex">
        <ServiceCard service={service} />
        </div>
      ))
    ) : (
      <p>No services available</p>
    )}
    </div>
    </div>
  );
}