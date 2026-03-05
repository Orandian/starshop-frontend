"use client";

import BadgeComponent from "@/components/app/public/BadgeComponent";
import CounterComponent from "@/components/app/public/CounterComponent";
import TitleWithUnderlineDecorationComponent from "@/components/app/public/TitleWithUnderlineDecorationComponent";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
// import ProductItemComponent from "@/components/app/public/ProductItemComponent";
import ProductPhotoGallery from "@/components/profile/ProductPhotoGallery";
import { usePublicProductsDetails, usePublicProductsList } from "@/hooks/user/useProduct";
import { useParams ,useRouter } from "next/navigation";
import {
  convertToYen,
  decryptString,
  getPublicUrl,
  priceWithTax,
} from "@/utils";
import { useAddToCart } from "@/hooks/user/useCart";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
import { Product } from "@/types/dashboard/products";
// import ProductItemComponent from "@/components/app/public/ProductItemComponent"; // Temporarily disabled - see recommend products section
import { useUserStore } from "@/store/useAuthStore";
import { ApiError } from "@/lib/api/api.gateway";
import { MESSAGES } from "@/types/messages";
import RecommandProductItemComponent from "@/components/app/public/RecommandProductItemComponent";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProductDetailPage = () => {
  // const router = useRouter();
  const params = useParams(); // Get params
  const { mutate: addToCart, isPending: addToCartPending } = useAddToCart(); // Add to cart
  const { user } = useUserStore(); // Is logged in

  const [productId, setProductId] = useState<number>(); // Product ID
  const [product, setProduct] = useState<Product>(); // Product
  // Recommend products currently not displayed - backend returns IDs only
  // const [recommendProduct, setRecommendProduct] =
  //   useState<Product[]>(); // Recommend product

  // const [regularPercentage, setRegularPercentage] = useState<string>("0");
  const [count, setCount] = useState(1); // Count
  const { data: products,  isLoading } = usePublicProductsList("all");
  const productList = (products?.data?.data ?? []) as Product[];
  // const router = useRouter();

  // Get product detail
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
    isError: productIsError,
  } = usePublicProductsDetails(productId || 0);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!user || !user.userId) {
      setOpen(true);
      // toast.error("ログインしてください");
      return;
    }
    // if (regularPercentage !== "0") {
    //   router.push(`/subscription/${params.slug}`);
    //   return;
    // }
    addToCart(
      {
        productId: productId || 0,
        quantity: count,
      },
      {
        onSuccess: () => {
          toast.success("商品をカートに入れました");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(err.data.message);
            return;
          }
          toast.error(MESSAGES.AUTH.SIGNUP_FAILED);
        }
      }
    );
  };

  // Set product ID
  useEffect(() => {
    if (params.slug) {
      const productId = decryptString(params.slug as string);
      setProductId(Number(productId));
    }
  }, [params.slug]);

  // Set product data
  useEffect(() => {
    if (!productData?.data) return;

    const product = productData.data as unknown as Product;

    setProduct(product);

    // TODO: Fetch full product details for recommended products
    // Backend now returns recommendProducts as number[] (IDs only)
    // Need to fetch full product details separately if needed for display
    // if (Array.isArray(product.recommendProducts)) {
    //   setRecommendProduct(product.recommendProducts as Product[]);
    // }
  }, [productData]);

  // Set product error
  useEffect(() => {
    if (productIsError) {
      const error = productError as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message);
    }
  }, [productIsError, productError]);
  const [open, setOpen] = useState(false);
  const router = useRouter(); // Router
  const handleToLogin = () => {
    router.push("/login");
  };

  return (
    <PublicDetailsLayout>
      <div className="px-4 flex flex-col md:flex-row md:gap-10">
        {!productLoading && product?.images && (
          <ProductPhotoGallery
            products={product?.images
              .slice()
              .sort((a, b) => (a.imageOrder || 0) - (b.imageOrder || 0))
              .map((image, index) => ({
                id: index,
                name: product?.name,
                image: image.imageUrl
                  ? getPublicUrl(image.imageUrl)
                  : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }))}
          />
        )}
        {productLoading && (
          <Skeleton className="w-full md:w-[70%] h-[500px] bg-white-bg border border-black/10" />
        )}

        {product && (
          <div className="w-full md:w-[30%] md:mt-0 mt-5">
            <div className="space-y-4">
              <BadgeComponent
                label={product?.stockQuantity > 0 ? "在庫あり" : "在庫なし"}
              />

              <p className="text-normal">{product?.name}</p>
            </div>
            <div className="flex items-center mt-4 space-x-2">
              <p className="text-sm font-bold">ブランド:</p>
              <p className="text-sm">{product?.brandName}</p>
            </div>

            <div className="my-6 md:my-10">
              <p className="text-price">
                {convertToYen(priceWithTax(product?.salePrice, product?.tax))}
                <span className="text-normal">[税込]</span>
              </p>
            </div>

            {/* <div className="mt-6 mb-2 md:mt-10 md:mb-4">
              <RadioGroup
                value={regularPercentage ?? "0"}
                onValueChange={setRegularPercentage}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="option-one" />
                  <Label htmlFor="option-one">今回のみのご購入</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={product?.subscriptDiscountPercent?.toString() ?? "1"}
                    id="option-two"
                  />
                  <Label htmlFor="option-two">
                    定期購入（{product?.subscriptDiscountPercent}%割引）
                  </Label>
                </div>
              </RadioGroup>
            </div> */}

            {/* {regularPercentage === "0" && ( */}
              <div>
                <CounterComponent
                  min={1}
                  max={product?.stockQuantity}
                  count={count}
                  setCount={setCount}
                  isMinusDisabled={true}
                />
              </div>
            {/* )} */}

            <Button
              onClick={handleAddToCart}
              className="w-full rounded-none bg-black hover:bg-black/80 text-xs text-white mt-4 cursor-pointer"
              disabled={addToCartPending}
            >
              {addToCartPending ? "追加中..." : "カートに入れる"}
            </Button>

            <div className="mt-10 space-y-4">
              <TitleWithUnderlineDecorationComponent title="概要" />

              <div className="prose max-w-none [&_h3]:mt-6 [&_h3]:mb-2 [&_h4]:mt-4 [&_h4]:mb-2 [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2">
                <div
                  dangerouslySetInnerHTML={{ __html: product?.description }}
                />
              </div>
            </div>
          </div>
        )}
        {productLoading && (
          <Skeleton className="w-full md:w-[30%] h-[500px] bg-white-bg border border-black/10" />
        )}
      </div>

      <div className="mt-10 space-y-10 md:mt-20 px-4 md:px-6 lg:px-8">
        <div className="text-left">
          <span
            className="text-2xl font-allura"
            style={{ fontFamily: "Allura, cursive" }}
          >
            その他のアイテム
          </span>
        </div>

        <div className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar">
          {!isLoading &&
            productList?.map((product: Product) => {
              const mainImage = product.images?.find(
                (image) => image?.imageOrder === 1
              )?.imageUrl;

              return (
                <div
                  key={product.productId}
                  className="min-w-[240px] max-w-[240px] flex-shrink-0"
                >
                  <RecommandProductItemComponent
                    product={{
                      id: product.productId || 0,
                      name: product.name,
                      price: product.tax
                        ? product.salePrice +
                        (product.salePrice * product.tax) / 100
                        : product.salePrice,
                      image: mainImage
                        ? getPublicUrl(mainImage)
                        : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop",
                      isTax: !!product.tax,
                      imgBg: false,
                    }}
                  />
                </div>
              );
            })}

          {!isLoading && productList?.length === 0 && (
            <p className="w-full text-center text-lg">商品がありません</p>
          )}

          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className="min-w-[240px] h-64 bg-white-bg border border-black/10 flex-shrink-0"
              />
            ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white border border-white-bg rounded-md">
            <DialogHeader>
              <DialogTitle>
                カートに追加するにはログインが必要です。
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              ログインしますか？
            </p>

            <DialogFooter className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-[100px] cursor-pointer"
              >
                キャンセル
              </Button>

              <Button
                onClick={() => {
                  setOpen(false);
                  handleToLogin();
                }}
                className="text-white w-[100px] cursor-pointer"
              >
                ログイン
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PublicDetailsLayout>
  );
};

export default ProductDetailPage;
