"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CounterComponent from "@/components/app/public/CounterComponent";
import { convertToYen, encryptString, getPublicUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useDeleteCartItem,
  useGetCartItems,
  useUpdateCartItemQuantity,
} from "@/hooks/user/useCart";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { CartData, CartProduct } from "@/types/cart/cardtype";
import { ApiError } from "@/lib/api/api.gateway";
import { MESSAGES } from "@/types/messages";
import Line from "@/public/fc/line.jpg";
import ImageComponent from "../fc/ImageComponent";
import Link from "next/link";
import { useGetShippingAddress } from "@/hooks/user/useAddress";

export const ProductCell = ({
  name,
  price,
  image,
  isTax,
  count,
  onClick,
}: {
  name: string;
  price: number;
  image: string;
  isTax?: boolean;
  count?: number;
  onClick?: () => void;
}) => {
  return (
    <div className="flex gap-4 items-center cursor-pointer" onClick={onClick}>
      <div className="w-[80px] h-[80px] bg-white-bg border border-black/10">
        <Image
          src={image}
          alt={name || ""}
          className="w-full h-full object-contain"
          width={80}
          height={80}
        />
      </div>
      <div className="space-y-2">
        <p className="text-normal">{name || ""}</p>
        <p className="text-normal">
          {convertToYen(price)} {isTax && "[税込]"} {count && `* ${count}`}
        </p>
      </div>
    </div>
  );
};

const handleApiError = (err: unknown) => {
  if (err instanceof ApiError) {
    toast.error(err.data.message);
    return;
  }
  toast.error(MESSAGES.COMMON.UNEXPECTED_ERROR);
};
// Desktop
const ProductRow = ({
  product,
  handleToCalculateTotalPrice,
}: {
  product: CartProduct;
  handleToCalculateTotalPrice: (
    productId: number,
    quantity: number,
    tax: number
  ) => void;
}) => {
  const router = useRouter(); // Router
  const [count, setCount] = useState<number>(0); // Count
  const { mutate: updateCartItemQuantity } = useUpdateCartItemQuantity(); // Update cart item quantity
  const { mutate: deleteCartItem } = useDeleteCartItem(); // Delete cart item

  useEffect(() => {
    setCount(product.quantity);
  }, [product.quantity]);

  return (
    <TableRow key={product.productId} className="border-b border-white-bg">
      <TableCell className="md:px-6 px-3 md:py-4 py-4">
        <ProductCell
          name={product.productName}
          price={product?.salePrice || 0}
          image={
            product?.productImages[0]
              ? getPublicUrl(product?.productImages[0])
              : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          onClick={() => router.push(`/products/${encryptString(product.productId.toString())}`)}
        />
      </TableCell>
      <TableCell className="px-6 py-4">
        {convertToYen(product?.salePrice || 0)}
      </TableCell>
      <TableCell className="px-6 py-4">
        <CounterComponent
          max={product.stockQuantity}
          min={product.safeStockQuantity}
          count={count}
          setCount={setCount}
          handleToClick={(quantity) => {
            handleToCalculateTotalPrice(
              product.productId,
              quantity,
              product?.tax || 0
            );
            if (quantity === 0) {
              deleteCartItem(
                {
                  cartItemId: product?.cartItemId,
                },
                {
                  onError: handleApiError
                }
              );
            } else {
              updateCartItemQuantity(
                {
                  cartItemId: product.cartItemId,
                  productId: product.productId,
                  quantity,
                },
                {
                  onError: handleApiError
                }
              );
            }
          }}
        />
      </TableCell>
      <TableCell className="text-right px-6 py-4">
        {convertToYen(product.total)}
      </TableCell>
    </TableRow>
  );
};

// Mobile
const ProductRowMobile = ({
  product,
  handleToCalculateTotalPrice,
}: {
  product: CartProduct;
  handleToCalculateTotalPrice: (
    productId: number,
    quantity: number,
    tax: number
  ) => void;
}) => {
  const router = useRouter(); // Router
  const [count, setCount] = useState<number>(0); // Count
  const { mutate: updateCartItemQuantity } = useUpdateCartItemQuantity(); // Update cart item quantity
  const { mutate: deleteCartItem } = useDeleteCartItem(); // Delete cart item

  useEffect(() => {
    setCount(product.quantity);
  }, [product.quantity]);

  return (
    <div key={product?.productId} className="border-b border-white-bg">
      <div className="md:px-6 px-3 md:py-4 py-4">
        <ProductCell
          name={product.productName}
          price={product?.salePrice || 0}
          image={
            product?.productImages[0]
              ? getPublicUrl(product?.productImages[0])
              : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          onClick={() => router.push(`/products/${encryptString(product.productId.toString())}`)}
        />
      </div>
      <div className="px-3 py-2 mb-2 flex items-center justify-between">
        <CounterComponent
          max={product.stockQuantity}
          min={product.safeStockQuantity}
          count={count}
          setCount={setCount}
          handleToClick={(quantity) => {
            handleToCalculateTotalPrice(
              product.productId,
              quantity,
              product?.tax || 0
            );
            if (quantity === 0) {
              deleteCartItem(
                {
                  cartItemId: product.cartItemId
                },
                {
                  onError: handleApiError
                }
              );
            } else {
              updateCartItemQuantity(
                {
                  cartItemId: product.cartItemId,
                  productId: product.productId,
                  quantity,
                },
                {
                  onError: handleApiError
                }
              );
            }
          }}
        />
        <div className="text-right">
          {convertToYen(product.total)}
        </div>
      </div>
    </div>
  );
};

const CartSectionOneComponent = ({
  handleToUpdateCart,
}: {
  handleToUpdateCart: () => void;
}) => {
  // Get cart items
  const { data: shippingAddress } = useGetShippingAddress(); // 配送先住所を取得
  const [postname, setPostname] = useState<string>(shippingAddress?.data?.[0]?.city || "");
  const { data: cartItems, isLoading, error, isError } = useGetCartItems(postname); // カートアイテムを取得
  const [cart, setCart] = useState<CartData>({} as CartData); // Cart items
  const [disableNextButton, setDisableNextButton] = useState<boolean>(false);

  // Handle to calculate total price
  const handleToCalculateTotalPrice = (
    productId: number,
    quantity: number,
    tax: number
  ) => {
    const { products, userId, cartId } = cart;

    const cartItem = products?.find((item) => item.productId === productId);
    if (!cartItem) return;

    // Update the specific item
    cartItem.quantity = quantity;
    const salePrice = cartItem?.salePrice || 0;
    cartItem.total = salePrice * quantity;
    cartItem.tax = tax;

    // Recalculate entire cart from scratch to avoid cumulative errors
    let subTotal = 0;
    let taxEight = 0;
    let taxTen = 0;
    let shippingFee = 0;

    products?.forEach((item) => {
      subTotal += item.total;

      // Calculate tax per unit and multiply by quantity to avoid rounding issues
      const taxPerUnit = Math.floor(((item?.salePrice || 0) * (item?.tax || 0)) / 100);
      const taxAmount = taxPerUnit * item.quantity;
      const itemShippingFee = item.shippingFee || 0;
      shippingFee += itemShippingFee;

      if (item.tax === 8) {
        taxEight += taxAmount;
      } else if (item.tax === 10) {
        taxTen += taxAmount;
      }
    });
    if (subTotal > 30000) {
      shippingFee = 0;
    }
    const cartTotalPrice = subTotal + taxEight + taxTen + shippingFee;

    setCart({
      subTotal: subTotal,
      taxEight: taxEight,
      taxTen: taxTen,
      cartTotalPrice: cartTotalPrice,
      shippingFee: shippingFee,
      products,
      userId,
      cartId,
    });

    if (cartTotalPrice === 0) {
      setDisableNextButton(true);
    } else {
      setDisableNextButton(false);
    }
  };

  // Set cart items
  useEffect(() => {
    if (!cartItems?.data){
      setDisableNextButton(true);
      return;
    }
    const cartData = (cartItems?.data as unknown as CartData) || undefined;
    if (cartData?.cartTotalPrice === 0) {
      setDisableNextButton(true);
    } else {
    if (!shippingAddress?.data || shippingAddress.data.length === 0) return;
    const addr = shippingAddress.data[0];
    setPostname(addr?.city || "");
      setDisableNextButton(false);
    }
    setCart(cartData);
  }, [cartItems, shippingAddress]);

  // If error, show error message
  useEffect(() => {
    if (isError) {
      handleApiError(error);
    }
  }, [isError, error]);

  return (
    <>
      <div className="mt-10 border border-white-bg rounded-md bg-white">
        {/* Desktop */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="">
              <TableRow className="border-b border-white-bg">
                <TableHead className="md:w-[200px] w-[100px] md:px-6 px-3 md:py-4 py-2">
                  商品
                </TableHead>
                <TableHead className="md:w-[100px] w-[50px] md:px-6 px-3 md:py-4 py-2">
                  金額（税別）
                </TableHead>
                <TableHead className="md:w-[200px] w-[100px] md:px-6 px-3 md:py-4 py-2">
                  個数
                </TableHead>
                <TableHead className="md:w-[150px] w-[100px] text-right md:px-6 px-3 md:py-4 py-2">
                  合計金額
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                cart?.products
                  ?.filter((product) => product.quantity > 0)
                  .map((product) => (
                    <ProductRow
                      key={product.productId}
                      product={product}
                      handleToCalculateTotalPrice={handleToCalculateTotalPrice}
                    />
                  ))}
              {/* 読み込み中。。。 */}
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-white-bg">
                    <TableCell colSpan={4} className="h-16">
                      <Skeleton className="h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
              {/* Empty cart */}
              {(!isLoading && cart?.products?.length === 0) ||
                (cart?.products?.length === undefined && (
                  <TableRow key={"empty"} className="border-b border-white-bg">
                    <TableCell colSpan={4} className="h-16" align="center">
                      <p>カートに商品がありません</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {/* 商品表示 */}
          {!isLoading &&
            cart?.products
              ?.filter((product) => product.quantity > 0)
              .map((product) => (
                <ProductRowMobile
                  key={product.productId}
                  product={product}
                  handleToCalculateTotalPrice={handleToCalculateTotalPrice}
                />
              ))}
          {/* 読み込み中。。。 */}
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border-b border-white-bg">
                <Skeleton className="h-full bg-white-bg" />
              </div>
            ))}
          {/* Empty cart */}
          {(!isLoading && cart?.products?.length === 0) ||
            (cart?.products?.length === undefined && (
              <div
                key={"empty"}
                className="border-b border-white-bg p-4 text-center"
              >
                <p>カートに商品がありません</p>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4 border border-white-bg rounded-md md:px-6 px-4 md:py-10 py-8 md:space-y-10 space-y-6 bg-white">
        <div className="flex justify-between">
          <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>小計</p>
          </div>
          <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>{convertToYen(cart?.subTotal || 0)}</p>
          </div>
        </div>
        {cart?.taxEight !== undefined && cart?.taxEight !== 0 && (
          <div className="flex justify-between">
            <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
              <p>税金 (8%)</p>
            </div>
            <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
              <p>{convertToYen(cart?.taxEight || 0)}</p>
            </div>
          </div>)
        }
        <div className="flex justify-between">
          <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>税金 (10%)</p>
          </div>
          <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>{convertToYen(cart?.taxTen || 0)}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>送料</p>
          </div>
          <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>{convertToYen(cart?.shippingFee || 0)}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="md:w-[70%] flex justify-end font-semibold text-2xl">
            <p>合計</p>
          </div>
          <div className="md:w-[30%] flex justify-end font-semibold text-2xl">
            <p>{convertToYen(cart?.cartTotalPrice || 0)}</p>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-end md:mt-10 mt-6"> */}
      <div className="flex items-left justify-between md:mt-10 mt-6 w-full">
        <div className=" flex justify-center px-4">
          <Link
            href={"https://lin.ee/tgFsxgK"}
            target="_blank"
            className="flex items-center gap-2"
          >
            <ImageComponent
              imgURL={Line.src}
              imgName="line"
              width={80}
              height={80}
            />
          </Link>
        </div>
        <Button
          onClick={() => {
            if (cartItems?.data === null) return;
            handleToUpdateCart();
          }}
          disabled={
            cartItems?.data === null ||
            cart?.products?.length === undefined ||
            disableNextButton
          }
          className="flex-row-center gap-1 text-white w-[100px] cursor-pointer"
        >
          <p>次へ</p>
          <ChevronRight size={26} />
        </Button>
      </div>
    </>
  );
};

export default CartSectionOneComponent;
