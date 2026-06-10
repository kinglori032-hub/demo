export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  notes: string | null;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  [productId: string]: number;
}

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  stock?: number;
}

export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  notes: string | null;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export type CreateProductType = Omit<Product, "id">;
