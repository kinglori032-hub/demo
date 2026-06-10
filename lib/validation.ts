import { z } from "zod";

export const CheckoutFormSchema = z.object({
  customerName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Phone must be 10-15 digits (optional + prefix)"),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform(val => val === "" ? null : val),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
  notes: z
    .union([
      z.string().max(500, "Notes must be less than 500 characters"),
      z.null(),
      z.literal("")
    ])
    .optional()
    .transform(val => val === "" ? null : val),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().int("Quantity must be an integer").positive("Quantity must be greater than 0"),
      })
    )
    .min(1, "Cart cannot be empty"),
});

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  price: z
    .number()
    .positive("Price must be greater than 0"),
  image: z
    .string()
    .min(10, "Image data is required"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
});

export const AdminLoginSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required"),
});

export type CheckoutFormType = z.infer<typeof CheckoutFormSchema>;
export type CreateProductType = z.infer<typeof CreateProductSchema>;
export type AdminLoginType = z.infer<typeof AdminLoginSchema>;

type ValidationSuccess<T> = { success: true; data: T };
type ValidationError = { success: false; errors: Record<string, (string | undefined)[] | undefined> };

export function validateCheckoutForm(data: unknown): ValidationSuccess<CheckoutFormType> | ValidationError {
  try {
    return { success: true, data: CheckoutFormSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return {
        success: false,
        errors: fieldErrors as Record<string, (string | undefined)[] | undefined>,
      };
    }
    return { success: false, errors: { _form: ["Validation failed"] } };
  }
}

export function validateCreateProduct(data: unknown): ValidationSuccess<CreateProductType> | ValidationError {
  try {
    return { success: true, data: CreateProductSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return {
        success: false,
        errors: fieldErrors as Record<string, (string | undefined)[] | undefined>,
      };
    }
    return { success: false, errors: { _form: ["Validation failed"] } };
  }
}

export function validateAdminLogin(data: unknown): ValidationSuccess<AdminLoginType> | ValidationError {
  try {
    return { success: true, data: AdminLoginSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return {
        success: false,
        errors: fieldErrors as Record<string, (string | undefined)[] | undefined>,
      };
    }
    return { success: false, errors: { _form: ["Validation failed"] } };
  }
}
