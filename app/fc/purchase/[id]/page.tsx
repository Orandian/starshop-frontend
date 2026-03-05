"use client";

import ImageComponent from "@/components/fc/ImageComponent";
import { CartIcon } from "@/components/fc/purchase/CartIcon";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart, useGetProductDetails } from "@/hooks/fc/usePurchase";
import { decryptString, getPublicUrl } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [maxQuantity, setMaxQuantity] = useState<number>(1);
  const { id } = useParams();
  const [productId, setProductId] = useState<string | null>(null);
  const { data: product, isLoading } = useGetProductDetails(
    productId as string,
  );

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // const taxIncludePrice = product?.data?.discountSalePrice
  //   ? Math.round(product?.data?.discountSalePrice * (product?.data?.tax / 100))
  //   : 0;

  useEffect(() => {
    if (id) {
      setProductId(decryptString(id as string));
    }
  }, [id]);

  useEffect(() => {
    if (product?.data) {
      // Set initial quantity to 1 or safe stock quantity, whichever is smaller
      const initialQty = Math.min(1, product.data.stockQuantity || 1);
      setQuantity(initialQty);
      setMaxQuantity(product.data.stockQuantity);
    }
  }, [product]);

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => {
        const newQty = prev + 1;
        validateQuantity(newQty);
        return newQty;
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => {
        const newQty = prev - 1;
        validateQuantity(newQty);
        return newQty;
      });
    }
  };

  const validateQuantity = (qty: number) => {
    if (!product?.data) return;

    if (qty >= product.data.stockQuantity) {
      toast.error("在庫が少なくなっております。");
    }
  };

  const handleAddToCart = () => {
    if (!product?.data) return;
    addToCart(
      {
        products: [
          {
            productId: Number(productId),
            quantity,
          },
        ],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-cart"] });
          router.push("/fc/purchase");
          toast.success("商品をカートに追加しました");
        },
        onError: (error) => {
          toast.error(
            error.message ||
              "カートに商品を追加できませんでした。もう一度お試しください。",
          );
        },
      },
    );
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <LoadingIndicator size="md" />
  //     </div>
  //   );
  // }

  return (
    <section className="w-full">
      <div className="w-full px-8 py-6 bg-white rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-bold mb-6">商品詳細</h1>

          <CartIcon />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full md:w-1/2 flex gap-2 md:flex-row flex-col-reverse">
            <div className="flex overflow-x-auto md:overflow-x-hidden p-2 flex-row md:flex-col gap-2 w-full md:w-28">
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton
                      className="h-20 w-full rounded-md bg-white-bg"
                      key={index}
                    />
                  ))}
                </div>
              ) : (
                product?.data?.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-dark" : ""
                    }`}
                  >
                    <ImageComponent
                      imgURL={getPublicUrl(img.imageUrl) || ""}
                      imgName={`${product?.data?.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))
              )}
            </div>

            {/* Main Product Image */}
            <div className="h-96 w-full bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : product?.data?.images?.[selectedImage]?.imageUrl ? (
                <ImageComponent
                  imgURL={getPublicUrl(
                    product.data.images[selectedImage].imageUrl,
                  )}
                  imgName={product.data.name || "Product image"}
                  className="w-full h-full object-contain"
                  fill={true}
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <span className="inline-block border border-gray-300  px-4 py-2">
                {isLoading ? (
                  <Skeleton className="w-16 h-4 bg-white-bg" />
                ) : (product?.data?.stockQuantity || 0) > 0 ? (
                  "在庫あり"
                ) : (
                  "在庫なし"
                )}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-10 mt-5">
              {isLoading ? (
                <Skeleton className="w-32 h-6 bg-white-bg" />
              ) : (
                product?.data?.name
              )}
            </h2>

            <div className="flex flex-col items-start gap-4 mb-10">
              <span className="text-secondary text-lg">
                卸率
                {product?.data?.salePrice && product?.data?.discountSalePrice
                  ? `${((product?.data?.discountSalePrice / product?.data?.salePrice) * 100).toFixed(0)}`
                  : "-"}
                %
              </span>
              <span className="text-secondary  text-sm">
                <span className="line-through">
                  {isLoading ? (
                    <Skeleton className="w-20 h-4 bg-white-bg" />
                  ) : (
                    `¥${((product?.data?.salePrice ?? 0) * 1.1)?.toLocaleString("ja-JP")}`
                  )}
                </span>
                <span className="text-sm font-normal  ml-1">[税別]</span>
              </span>

              <span className="text-xl ">
                {isLoading ? (
                  <Skeleton className="w-24 h-6 bg-white-bg" />
                ) : product?.data?.discountSalePrice ? (
                  `¥${product.data.discountSalePrice.toLocaleString("ja-JP")} `
                ) : (
                  ""
                )}
                <span className="text-sm font-normal  ml-1">[税別]</span>
              </span>
            </div>

            <div className="mb-6 flex flex-col gap-3 justify-center">
              <div className="flex items-center  border border-gray-300 w-fit">
                <button
                  onClick={decreaseQuantity}
                  className="p-3 hover:bg-gray-100 border-r border-gray-300 cursor-pointer w-fit"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="p-3 hover:bg-gray-100 border-l border-gray-300 cursor-pointer w-fit"
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button
                className="w-72 md:w-auto bg-black text-white h-12"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <LoadingIndicator size="sm" />
                ) : (
                  "カートに入れる"
                )}
              </Button>
            </div>

            {/* Product Tabs */}
            <div className=" pt-4">
              <div className="flex border-b">
                <button className="px-4 py-2 font-medium border-b-2 border-dark text-dark">
                  概要
                </button>
              </div>

              <div className="py-4">
                <div className="prose text-sm text-gray-700">
                  <div>
                    {isLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 3 }, (_, i) => (
                          <Skeleton
                            key={i}
                            className="w-full h-4 bg-white-bg"
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        className="mt-2"
                        dangerouslySetInnerHTML={{
                          __html: product?.data?.description || "",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
