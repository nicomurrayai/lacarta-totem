import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Product } from "@/types/types";
import EditProductModal from "./EditProductModal";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProductCard({ product }: { product: Product }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const handleDelete = async () => {
    try {
      await deleteProduct({ id: product._id });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <>
      <Card className="overflow-hidden border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {product.description}
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-6">
            ${product.price.toLocaleString('es-AR')}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-orange-500 text-orange-600 font-medium hover:bg-orange-50 rounded-lg py-2.5"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar 
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-600 font-medium hover:bg-red-50 rounded-lg py-2.5"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditProductModal
        product={product}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto "{product.name}" del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}