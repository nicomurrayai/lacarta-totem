import { type LucideIcon } from "lucide-react";

export interface FeedItemProps {
  product: any;
  isActive: boolean;
  shouldRender: boolean;
  bgColor: string;
  textColor: string;
}

export type Tab = {
  name: string
  path: string
  icon: LucideIcon
}

export  interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  contentUrl: string;
  contentType: string;
  show: boolean;
}