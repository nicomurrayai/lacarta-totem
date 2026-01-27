import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Loader2 } from "lucide-react";

interface EditProductModalProps {
  product: {
    _id: Id<"products">;
    name: string;
    description: string;
    price: number;
    category: string;
    show: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProductModal({
  product,
  open,
  onOpenChange,
}: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    show: product.show,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateProduct = useMutation(api.products.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
 
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      await updateProduct({
        id: product._id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        category: formData.category.trim(),
        show: formData.show,
      });


      onOpenChange(false);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
 
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Realiza cambios en la información del producto. Los cambios se
            guardarán al hacer clic en guardar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del producto"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>

       
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show">Visible</Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar este producto a los clientes
                </p>
              </div>
              <Switch
                id="show"
                checked={formData.show}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, show: checked })
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}