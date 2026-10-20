export interface CartItem {
  id: string; // unique item key in cart (e.g. productId or productId_variationId)
  productId: string;
  variationId?: string | null;
  name: string;
  variationDesc?: string | null;
  image?: string | null;
  price: number; // in paisa
  regularPrice?: number; // in paisa
  quantity: number;
  productType?: string;
}

export interface AttributeValue {
  id: string;
  value: string;
}

export interface ProductAttributeData {
  id: string;
  name: string;
  slug: string;
  options: AttributeValue[];
}

export interface VariationOptionData {
  attribute: {
    id: string;
    name: string;
    slug: string;
  };
  option: {
    id: string;
    value: string;
  };
}

export interface ProductVariationData {
  id: string;
  productId: string;
  sku?: string | null;
  regularPrice: number;
  salePrice?: number | null;
  image?: string | null;
  stockQty?: number | null;
  stockStatus: string;
  isActive: boolean;
  deliveryInstructions?: string | null;
  variationOptions: VariationOptionData[];
}

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string | null;
  fullDesc?: string | null;
  categoryId?: string | null;
  productType: string;
  featuredImage?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  badge?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  regularPrice: number;
  salePrice?: number | null;
  stockQty?: number | null;
  stockStatus: string;
  trackStock: boolean;
  totalSold: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images?: {
    id: string;
    url: string;
    alt?: string | null;
  }[];
  variations?: ProductVariationData[];
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface HeroSlideData {
  id: string;
  headline: string;
  description?: string | null;
  bgImage?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  badge?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface PaymentMethodSettingData {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  merchantNumber?: string | null;
  accountType?: string | null;
  instructions?: string | null;
  qrCodeUrl?: string | null;
  isActive: boolean;
  supportedTypes?: string | null;
  verificationNotes?: string | null;
}

export interface OrderItemData {
  id: string;
  productId?: string | null;
  variationId?: string | null;
  productName: string;
  variationDesc?: string | null;
  productImage?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryStatus: string;
  deliveryNotes?: string | null;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  notes?: string | null;
  billingName?: string | null;
  billingEmail?: string | null;
  billingPhone?: string | null;
  billingAddress?: string | null;
  paymentMethod?: string | null;
  createdAt: string | Date;
  items: OrderItemData[];
  paymentSubmissions?: {
    id: string;
    method: string;
    transactionId?: string | null;
    senderNumber?: string | null;
    amount: number;
    status: string;
    submittedAt: string | Date;
    reviewNotes?: string | null;
  }[];
}
