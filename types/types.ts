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
0