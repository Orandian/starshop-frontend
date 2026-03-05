import { OrderDetail, OrderProduct, AddressType } from "@/types/orders/index";
import { CartData } from "@/types/cart/cardtype";
import { Address, CustomerDetail } from "@/types/customers";

export const buildOrderDetailFromCart = (
  cartData: CartData,
  userDetail: CustomerDetail,
  orderId: number = Date.now(),
): OrderDetail => {
  // Transform cart products to OrderProduct format
  const products: OrderProduct[] = (cartData.products || []).map((product) => ({
    productId: product.productId,
    productName: product.productName,
    price: product.salePrice || 0,
    quantity: product.quantity,
    tax: product.tax || 0,
    subtotal: product.total,
    taxAmount: Math.round(
      (((product.salePrice || 0) * (product.tax || 0)) / 100) *
        product.quantity,
    ),
    images: product.productImages || [],
  }));

  // Helper function to transform address
  const transformAddress = (addressArray?: Address[]): AddressType => {
    if (!addressArray || addressArray.length === 0) {
      // Return default empty address when no address exists
      return {
        firstName: "",
        lastName: "",
        postalCode: "",
        prefecture: "",
        city: "",
        street: "",
        building: "",
        room: "",
        phone: "",
        country: "",
      };
    }

    const address = addressArray[0];
    return {
      firstName: address.name?.split(" ")[0] || "",
      lastName: address.name?.split(" ")[1] || "",
      postalCode: address.postalCode || "",
      prefecture: address.prefecture || "",
      city: address.city || "",
      street: address.address1 || "",
      building: address.address2 || "",
      room: "",
      phone: address.phoneNumber || "",
      country: "",
    };
  };

  // Calculate totals
  const orderTotal = cartData.cartTotalPrice || 0;
  const shippingCost = cartData.shippingFee || 0;
  const orderTotalNoTax =
    orderTotal - (cartData.taxEight || 0) - (cartData.taxTen || 0);

  return {
    orderId,
    orderDate: [
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    ],
    paymentMethod: "credit_card", // Default payment method
    orderStatus: "pending",
    notes: null,
    shippingCompany: null,
    shippingDate: null,
    trackingNumber: null,
    shippingCost,
    orderTotal,
    orderTotalNoTax,
    eightPercentTotal: cartData.taxEight || 0,
    tenPercentTotal: cartData.taxTen || 0,
    adminConfirmStatus: 0,
    fcRole: 0,
    customerId:
      userDetail?.userId?.toString() || userDetail?.user_id?.toString() || "",
    customerName: `${userDetail?.username || ""}`,
    customerEmail: userDetail?.email || "",
    userType: userDetail?.user_type || 1,
    shippingAddress: transformAddress(userDetail?.shipping_address),
    billingAddress: transformAddress(userDetail?.billing_address),
    products,
  };
};
