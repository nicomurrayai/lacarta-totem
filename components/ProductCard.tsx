import { Eye, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Product } from "@/types/types";



export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header with title and share icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {product.category}
            </p>
          </div>
        
        </div>


        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Price */}
        <p className="text-2xl font-bold text-gray-900 mb-6">
          ${product.price.toLocaleString('es-AR')}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 rounded-lg py-2.5"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver vista previa
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-orange-500 text-orange-600 font-medium hover:bg-orange-50 rounded-lg py-2.5"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar Producto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}