import { Tab } from "@/types/types";
import { Box,  Settings } from "lucide-react";

export const BASE_TABS: Tab[] = [
  { name: "Configuracion", path: "/dashboard", icon: Settings },
  { name: "Productos", path: "/dashboard/products", icon: Box },
] as const;
