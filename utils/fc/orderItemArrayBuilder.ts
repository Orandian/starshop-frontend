import { Order, OrderItem } from "@/types/fc/order.type";
import { User, UserDetail } from "@/types/fc/user.type";
import { Cart } from "@/types/fc/fc-stripe.type";
import { Category } from "@/types/fc";

export const buildOrderFromStripeCart = (
  cart: Cart,
  userDetail: UserDetail,
  orderId: number,
): Order => {
  // Calculate totals from cart products
  const subtotal = cart.products.reduce(
    (sum, product) => sum + product.sale_price * product.quantity,
    0,
  );
  const tax = cart.tax_eight + cart.tax_ten;
  const shippingCost = cart.shipping_fee;
  const total = subtotal + tax + shippingCost;
  return {
    orderId,
    orderDate: new Date().toISOString(),
    orderType: 1,
    orderStatus: -1,
    paymentType: 1,
    shippingCost: shippingCost.toString(), // need this
    totalPrice: total, // need this
    totalPriceNoTax: subtotal, //need this
    totalTax: tax, // need this

    // Billing info from userDetail => billing info need
    billName: userDetail.user?.username || "",
    billPostalCode:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 2)
        ?.postalCode || "",
    billPrefecture:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 2)
        ?.prefecture || "",
    billCity:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 2)
        ?.city || "",
    billAddress1:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 2)
        ?.address1 || "",
    billAddress2:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 2)
        ?.address2 || "",
    billPhone: userDetail.user?.phoneNumber || "",

    // Shipping info (same as billing for now)
    receiveName: userDetail.user?.username || "",
    receivePostalCode:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 1)
        ?.postalCode || "",
    receivePrefecture:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 1)
        ?.prefecture || "",
    receiveCity:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 1)
        ?.city || "",
    receiveAddress1:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 1)
        ?.address1 || "",
    receiveAddress2:
      userDetail.user?.userAddresses?.find((addr) => addr.addressType === 1)
        ?.address2 || "",
    receivePhone: userDetail.user?.phoneNumber || "",

    // Other required fields
    user: {} as User,
    fcInitial: 0,
    subscript: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    orderItems: [], // Will be populated below
  };
};

export const buildOrderItemsFromStripeCart = (
  cart: Cart,
  userDetail: UserDetail,
): OrderItem[] => {
  //build order firsst
  const order = buildOrderFromStripeCart(cart, userDetail, 0); //order id is not known yet
  return cart.products.map(
    (product): OrderItem => ({
      orderDetailId: 0,
      orderId: order.orderId,
      productId: 0,
      productName: product.product_name,
      quantity: product.quantity,
      originalSalePrice: product.sale_price.toString(),
      discount: 0,
      priceAtPurchase: product.sale_price.toString(),
      tax: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order,
      product: {
        productId: 0,
        name: product.product_name,
        originalPrice: product.sale_price,
        salePrice: product.sale_price,
        discountSalePrice: product.sale_price,
        tax: 10,
        images: product.product_images.map((img, imgIndex) => ({
          imageId: imgIndex,
          imageUrl: img,
          imageOrder: imgIndex,
        })),
        category: {} as Category,
        brand: null,
        productCode: "",
        description: "",
        subscriptDiscountSalePrice: 0,
        subscriptDiscountPercent: 0,
        stockQuantity: 0,
        safeStockQuantity: 0,
        status: 1,
        createdAt: [Date.now()],
        updatedAt: [Date.now()],
        deletedAt: null,
        shippingFee: 0,
      },
      productImageUrl: product.product_images[0] || "",
    }),
  );
};
