"use client";

import { ArrowLeft, CirclePlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import RecommendProductCardComponent from "@/components/admin/RecommendProductCardComponent";
import { Form } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { usePublicCategory } from "@/hooks/useCategory";
import { useProductById, useUpdateProduct } from "@/hooks/admin/useProduct";
import { Product as DashboardProduct, ProductImage as DashboardProductImage, UpdateProductRequest } from "@/types/dashboard/products";
import { toast } from "sonner";
import {
  useDeleteFiles,
  useDeleteImageRecords,
  useUploadFiles,
  useSaveImageOrder,
} from "@/hooks/admin/useStorage";
import {
  useGetRecommendProductsToChoose,
} from "@/hooks/admin/useRecommendProduct";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { decryptString, getPublicUrl } from "@/utils";
import ImageUploadUpdater from "@/components/admin/ImageUploadUpdater";
import TiptapEditor from "@/components/app/TipTapEditor";
import { CategoryPublic } from "@/types/categories";
import { usePublicBrands } from "@/hooks/useBrands";
import { BrandType } from "@/types/dashboard/brands";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import { regularPercentage } from "@/data/products";

const imageSchema = z
  .object({
    file: z
      .custom<File>((val) => typeof File !== "undefined" && val instanceof File)
      .optional(),
    image_url: z.string().optional(),
    del_flg: z.boolean(),
  })
  .refine((data) => data.file || data.image_url, {
    message: "Either file or image_url is required",
    path: ["file"],
  });

// Define the schema for the product form using Zod for validation
const FormSchema = z
  .object({
    name: z.string().min(1, "商品名は必須です"),
    category: z.string().min(1, "カテゴリーは必須です"),
    brand: z.string().min(1, "ブランドは必須です"),
    tax: z.string().min(1, "税率は必須です"),
    price: z.string().min(1, "卸金額（税別）は必須です"),
    salePrice: z.string().min(1, "販売金額（税抜）は必須です"),
    regularPercentage: z.string().min(1, "定形購入割引率は必須です"),
    regularDiscountPrice: z.string().min(1, "定形購入金額は必須です"),
    description: z.string().min(1, "説明は必須です"),
    barcode: z.string().optional(),
    images: z.array(imageSchema).optional(),
    // stock: z.string().min(1, "在庫数は必須です"),
    // safeStock: z.string().min(1, "安全な在庫数は必須です"),
    shippingFee: z.string().optional(),
    shippingType: z.string(),
    recommendProducts: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shippingType !== "free" && !data.shippingFee) {
      ctx.addIssue({
        path: ["shippingFee"],
        code: z.ZodIssueCode.custom,
        message: "配送料設定は必須です",
      });
    }
  });

const ProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const [productId, setProductId] = useState<number | null>(null);

  const [isOpenToChooseRecommendProduct, setIsOpenToChooseRecommendProduct] =
    useState(false); // State to toggle the dialog for choosing recommend products
  const [selectedRecommendProducts, setSelectedRecommendProducts] = useState<
    { productId: number; name: string; imageUrl: string }[]
  >([]); // State to store selected recommend products
  const [tempSelectedRecommendProducts, setTempSelectedRecommendProducts] =
    useState<{ productId: number; name: string; imageUrl: string }[]>([]); // State to store temporary selected recommend products

  //販売金額税込計算
  const [salePriceWithTax, setSalePriceWithTax] = useState(0);
  const [regularDiscountPriceWithTax, setRegularDiscountPriceWithTax] =
    useState(0);

  const { data: categories } = usePublicCategory(); // Custom hook to fetch category data
  const categoryList = useMemo(() => (categories?.data ?? []) as CategoryPublic[], [categories]);

  const { data: brands } = usePublicBrands(); // Custom hook to fetch brand data
  const brandList = useMemo(() => (brands?.data?.data ?? []) as BrandType[], [brands]);

  const { data: product } = useProductById(productId || 0); // Custom hook to fetch product data

  const { data: recommendProducts } = useGetRecommendProductsToChoose(
    productId || 0
  ); // Custom hook to fetch recommend products for selection

  //initial image count
  const [initialImageCount, setInitialImageCount] = useState(0);

  // Mutation hooks for product update and file uploads
  const {
    mutate: updateProduct,
    error: updateProductError,
    isSuccess: updateProductSuccess,
    data: updateProductData,
    isPending: isUpdatingProduct,
  } = useUpdateProduct();

  const { mutate: uploadFiles } = useUploadFiles(initialImageCount); // Mutation hook for uploading files, passing initial image count for correct ordering

  const { mutate: deleteImageRecords } = useDeleteImageRecords(); // Mutation hook for deleting image records

  const { mutate: deleteFiles } = useDeleteFiles();

  const { mutate: saveImageOrder } = useSaveImageOrder(); // Mutation hook for saving image order

  // Initialize react-hook-form with default values and Zod validation
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      tax: "",
      price: "",
      salePrice: "",
      regularPercentage: "",
      regularDiscountPrice: "",
      description: "",
      barcode: "",
      images: [
        {
          file: new File([], "sample.jpg"), // or just leave it undefined
          image_url: "https://example.com/sample.jpg",
          del_flg: false,
        },
      ],
      // stock: "",
      // safeStock: "",
      shippingFee: "",
      recommendProducts: [],
    },
  });

  const handleSalePriceWithTax = () => {
    const salePrice = Number(form.getValues("salePrice"));
    const tax = Number(form.getValues("tax"));
    const salePriceWithTax = Math.floor(salePrice + (salePrice * tax) / 100);
    setSalePriceWithTax(salePriceWithTax);
  };

  const handleRegularDiscountPrice = () => {
    const regularPercentage = Number(form.getValues("regularPercentage"));
    const salePrice = Number(form.getValues("salePrice"));
    const regularDiscountPrice = Math.floor(
      salePrice - (salePrice / 100) * regularPercentage
    );
    const regularDiscountPriceWithTax = Math.floor(
      salePriceWithTax - (salePriceWithTax / 100) * regularPercentage
    );
    form.setValue("regularDiscountPrice", regularDiscountPrice.toString());
    setRegularDiscountPriceWithTax(regularDiscountPriceWithTax);
  };

  // Handles form submission: builds product object and triggers updateProduct mutation
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const product: UpdateProductRequest = {
      name: data.name,
      categoryId: Number(data.category),
      brandId: Number(data.brand),
      // productCode: "", // Optional field
      description: data.description,
      originalPrice: Number(data.price),
      salePrice: Number(data.salePrice),
      subscriptDiscountSalePrice: Number(data.regularDiscountPrice),
      subscriptDiscountPercent: Number(data.regularPercentage),
      tax: Number(data.tax),
      status: 1, // Active by default
      barcode: data.barcode || "",
    };

    updateProduct({
      productId: productId || 0,
      product,
      recommendProducts: selectedRecommendProducts.map(p => p.productId),
    });
  };

  // Handle select all recommend products
  const handleToSeletAllRecommendProducts = () => {
    setSelectedRecommendProducts(tempSelectedRecommendProducts);
  };

  // Handle select recommend products
  const handleToSelectRecommendProducts = (product: {
    productId: number;
    name: string;
    imageUrl: string;
  }) => {
    if (
      tempSelectedRecommendProducts?.some(
        (item) => item.productId === product.productId
      )
    ) {
      setTempSelectedRecommendProducts(
        (tempSelectedRecommendProducts || []).filter(
          (item) => item.productId !== product.productId
        )
      );
    } else {
      setTempSelectedRecommendProducts([
        ...(tempSelectedRecommendProducts || []),
        {
          productId: product.productId,
          name: product.name,
          imageUrl: product.imageUrl,
        },
      ]);
    }
  };

  // Handle unselect recommend products
  const handleToUnselectRecommendProducts = (productId: number) => {
    setSelectedRecommendProducts(
      (selectedRecommendProducts || []).filter(
        (item) => item.productId !== productId
      )
    );
  };

  useEffect(() => {
    if (params.slug) {
      const decryptedProductId = decryptString(params.slug as string);
      setProductId(Number(decryptedProductId));
    }
  }, [params.slug]);

  // Update form values when product data changes
  useEffect(() => {
    const productItem = product as DashboardProduct | undefined;

    if (productItem && categoryList.length > 0 && brandList.length > 0) {
      form.reset({
        shippingType: productItem.shippingFee === 0 ? "free" : "fixed",
        name: productItem.name,
        category: productItem.categoryId.toString(),
        tax: productItem.tax.toString(),
        brand: productItem.brandId.toString(),
        price: productItem.originalPrice.toString(),
        salePrice: productItem.salePrice.toString(),
        description: productItem.description,
        barcode: productItem.barcode || "",
        regularPercentage: productItem.subscriptDiscountPercent?.toString(),
        regularDiscountPrice: productItem.subscriptDiscountSalePrice?.toString(),
        // stock: productItem.stockQuantity.toString() ,
        // safeStock: productItem.safeStockQuantity.toString(),
        shippingFee: "0",
        images: productItem.images.map((image: DashboardProductImage) => ({
          image_url: image.imageUrl,
          del_flg: false,
        })),
      });

      // Set initial image count
      setInitialImageCount(productItem.images.length || 0);

      // Load recommended products from product details
      if (productItem.recommendProducts && Array.isArray(productItem.recommendProducts) && recommendProducts) {
        // Map the IDs to full product objects with details from recommendProducts list
        const selectedRecommends = productItem.recommendProducts
          .map((recId) => {
            const foundProduct = recommendProducts.find((p) => p.productId === recId);
            if (foundProduct) {
              return {
                productId: foundProduct.productId,
                name: foundProduct.name,
                imageUrl: foundProduct.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              };
            }
            return null;
          })
          .filter((p): p is { productId: number; name: string; imageUrl: string } => p !== null);

        setSelectedRecommendProducts(selectedRecommends);
      }
    }
  }, [product, categoryList, brandList, recommendProducts, form]);

  useEffect(() => {
    handleSalePriceWithTax();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues("salePrice"), form.getValues("tax")]);

  useEffect(() => {
    if(salePriceWithTax){
      handleRegularDiscountPrice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("regularPercentage"), form.watch("salePrice"), salePriceWithTax]);

  useEffect(() => {
    if (updateProductError) {
      toast.error(updateProductError?.message);
    }

    if (updateProductData && updateProductSuccess) {
      const images = form.getValues("images") || [];

      const imagesToDelete = images
        .filter((img) => img.del_flg && typeof img.image_url === "string")
        .map((img) => img.image_url);

      const finalImages = [...images]; // ordered

      const deleteAndUploadAndSaveOrder = async () => {
        try {
          // 1. Delete flagged images sequentially
          if (imagesToDelete.length > 0) {
            await new Promise<void>((resolve, reject) => {
              deleteFiles(
                { productId: productId || 0, imageUrls: imagesToDelete as string[] },
                {
                  onSuccess: () => resolve(),
                  onError: (err) => reject(err),
                }
              );
            });

            await new Promise<void>((resolve, reject) => {
              deleteImageRecords(
                {
                  productId: productId || 0,
                  imageUrls: imagesToDelete as string[],
                },
                {
                  onSuccess: () => resolve(),
                  onError: (err) => reject(err),
                }
              );
            });
          }

          // 2. Upload new images sequentially
          const newFiles = finalImages
            .filter((img) => !img.del_flg && img.file instanceof File)
            .map((img) => img.file) as File[];

          if (newFiles.length > 0) {
            await new Promise<void>((resolve, reject) => {
              uploadFiles(
                {
                  files: newFiles,
                  productId: productId || 0,
                },
                {
                  onSuccess: () => resolve(),
                  onError: (err) => reject(err),
                }
              );
            });
          }

          // 3. Update image order
          const imagesToOrder = finalImages
            .filter((img) => !img.del_flg && img.image_url)
            .map((img, idx) => ({
              imageUrl: img.image_url as string,
              imageOrder: idx + 1,
            }));


          if (imagesToOrder.length > 0) {
            await new Promise<void>((resolve, reject) => {
              saveImageOrder(
                {
                  productId: productId || 0,
                  images: imagesToOrder,
                },
                {
                  onSuccess: () => resolve(),
                  onError: (err) => reject(err),
                }
              );
            });
          }

          // Show single success toast and navigate
          toast.success("商品が更新されました");
          router.back();
        } catch (err) {
          const error = err as Error;
          toast.error(error?.message || "画像更新に失敗しました");
        }
      };

      deleteAndUploadAndSaveOrder();
    }
  }, [
    updateProductError,
    updateProductData,
    updateProductSuccess,
    form,
    uploadFiles,
    deleteFiles,
    deleteImageRecords,
    router,
    productId,
    saveImageOrder,
  ]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border"
      >
        {/* Header */}
        <div className="flex justify-between mb-5">
          <div className="flex gap-2 text-left items-center">
            <ArrowLeft size={20} onClick={() => router.back()} />
            <h2>商品編集</h2>
          </div>
          <Button
            type="submit"
            className="bg-primary/100 hover:bg-primary/60 text-white cursor-pointer"
            disabled={isUpdatingProduct}
          >
            {isUpdatingProduct ? "更新中..." : "更新"}
          </Button>
        </div>

        {/* Tabs */}
        <div className="w-full bg-black/5 rounded-[10px]">
          <Tabs defaultValue="productInfo" className="w-full">
            <TabsList className="w-full flex justify-start max-lg:overflow-x-auto overflow-y-hidden bg-black/5 rounded-t-[10px] rounded-b-[0px] p-4 md:p-5 gap-4 md:gap-5 h-[70px] text-black/50">
              <TabsTrigger
                value="productInfo"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white text-black"
              >
                商品情報
              </TabsTrigger>
              <TabsTrigger
                value="photo"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white text-black"
              >
                写真
              </TabsTrigger>
              {/* <TabsTrigger
                value="stock"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white text-black"
              >
                在庫管理
              </TabsTrigger>
              <TabsTrigger
                value="shippingFee"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white text-black"
              >
                配送料設定
              </TabsTrigger> */}
              <TabsTrigger
                value="recommend"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white text-black"
              >
                オススメ商品設定
              </TabsTrigger>
            </TabsList>
            {/* Product Info */}
            <TabsContent value="productInfo">
              <div className="p-5 pt-5 pb-0 w-full">
                <div className="flex flex-wrap justify-between">
               

                    <div className="flex flex-col w-[33%]">
                <FormInputComponent
                  control={form.control}
                  name="barcode"
                  label="バーコード"
                  placeholder=""
                  className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                />
              </div>

                 <div className="flex flex-col w-[33%]">
                    <FormInputComponent
                      control={form.control}
                      name="name"
                      label="商品名"
                      placeholder="商品名"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>

                  <div className="flex flex-col w-[33%]">
                    <span className="text-sm -mt-0.5 mb-1">カテゴリー</span>
                    <Controller
                      key={form.watch("category")}
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs">
                            <SelectValue placeholder="カテゴリーを選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-black/10 rounded-[10px]">
                            {categoryList?.map(
                              (category: CategoryPublic) => (
                                <SelectItem
                                  key={category.categoryId}
                                  value={category.categoryId.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-5 mt-5">
                <div className="max-lg:grid max-lg:grid-cols-2 flex flex-wrap justify-between gap-5 lg:gap-0">
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <span className="text-sm -mt-0.5 mb-1">税率</span>
                    <Controller
                      key={form.watch("tax")}
                      control={form.control}
                      name="tax"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs">
                            <SelectValue placeholder="税率を選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-black/10 rounded-[10px]">
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="8">8%</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <FormInputComponent
                      control={form.control}
                      name="price"
                      label="卸金額（税抜）"
                      placeholder="卸金額（税抜）"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <FormInputComponent
                      control={form.control}
                      name="salePrice"
                      label="販売金額（税抜）"
                      placeholder="販売金額（税抜）"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <label
                      htmlFor="salePriceWithTax"
                      className="text-sm -mt-0.5 mb-1"
                    >
                      販売金額(税込)
                    </label>
                    <input
                      type="number"
                      id="salePriceWithTax"
                      name="salePriceWithTax"
                      placeholder=""
                      value={salePriceWithTax}
                      readOnly
                      className="text-black/30 placeholder:text-sm bg-white/50 border border-white-bg rounded-[10px] px-2 py-1.5 text-sm"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-5 mt-5">
                <div className="max-lg:grid max-lg:grid-cols-2 flex flex-wrap gap-4">
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <span className="text-sm -mt-0.5 mb-1">定形購入割引率</span>
                    <Controller
                      key={form.watch("regularPercentage")}
                      control={form.control}
                      name="regularPercentage"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs">
                            <SelectValue placeholder="定形購入割引率を選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-black/10 rounded-[10px]">
                            {regularPercentage.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.name}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <FormInputComponent
                      control={form.control}
                      name="regularDiscountPrice"
                      label="定形購入金額（税抜）"
                      placeholder="定形購入金額（税抜）"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <label
                      htmlFor="regularDiscountPriceWithTax"
                      className="text-sm -mt-0.5 mb-1"
                    >
                      定形購入金額(税込)
                    </label>
                    <input
                      type="number"
                      id="regularDiscountPriceWithTax"
                      name="regularDiscountPriceWithTax"
                      placeholder=""
                      value={regularDiscountPriceWithTax}
                      readOnly
                      className="text-black/30 placeholder:text-sm bg-white/50 border border-white-bg rounded-[10px] px-2 py-1.5 text-sm"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-5">
                <p className="text-sm mb-1">ブランド</p>
                <Controller
                  key={form.watch("brand")}
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs">
                        <SelectValue placeholder="ブランドを選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-black/10 rounded-[10px]">
                        {brandList?.map((brand: BrandType) => (
                          <SelectItem
                            key={brand.brandId}
                            value={brand.brandId.toString()}
                          >
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.brand && (
                  <p className="text-red-500 mt-2 text-sm">
                    {form.formState.errors.brand.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col p-5">
                <p className="text-sm mb-1.5">説明</p>
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <TiptapEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 mt-2 text-sm">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Photo */}
            <TabsContent value="photo">
              <div className="px-5 pt-4 pb-5">
                <p className="text-sm mb-1.5">写真</p>
                <Controller
                  name="images"
                  control={form.control}
                  render={({ field }) => (
                    <ImageUploadUpdater
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  )}
                />
                {form.formState.errors.images && (
                  <p className="text-red-500 mt-2 text-sm">
                    {form.formState.errors.images.message}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Stock */}
            {/* <TabsContent value="stock">
              <div className="p-5 w-full">
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col">
                    <FormInputComponent
                      control={form.control}
                      name="stock"
                      label="在庫数"
                      placeholder="在庫数"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>
                  <div className="flex flex-col">
                    <FormInputComponent
                      control={form.control}
                      name="safeStock"
                      label="安全な在庫数"
                      placeholder="安全な在庫数"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </TabsContent> */}

            {/* Shipping Fee */}
            <TabsContent value="shippingFee">
              <div className="p-5 flex flex-row gap-10">
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="shippingType"
                    value="free"
                    className="w-5 h-5"
                    checked={form.watch("shippingType") === "free"}
                    onChange={(e) =>
                      form.setValue("shippingType", e.target.value)
                    }
                  />
                  <span className="text-xs">送料無料</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="shippingType"
                    value="fixed"
                    className="w-5 h-5"
                    checked={form.watch("shippingType") === "fixed"}
                    onChange={(e) =>
                      form.setValue("shippingType", e.target.value)
                    }
                  />
                  <span className="text-xs">固定送料</span>
                </div>
              </div>
              <div className="pl-5 pb-5 w-[200px] md:w-[20%]">
                <FormInputComponent
                  control={form.control}
                  name="shippingFee"
                  label=""
                  placeholder="固定送料"
                  className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                  disabled={form.watch("shippingType") !== "fixed"}
                />
              </div>
            </TabsContent>

            {/* Recommend */}
            <TabsContent value="recommend">
              <div className="p-5">
                <span className="text-xs">オススメ商品</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-3 ">
                  {selectedRecommendProducts?.map((product) => (
                    <RecommendProductCardComponent
                      key={product.productId}
                      imgURL={product.imageUrl}
                      imgName={product.name}
                      active={false}
                      onRemove={() =>
                        handleToUnselectRecommendProducts(product.productId)
                      }
                    />
                  ))}
                  <div
                    onClick={() => {
                      setIsOpenToChooseRecommendProduct(true);
                      setTempSelectedRecommendProducts(
                        selectedRecommendProducts
                      );
                    }}
                    className="w-[150px] h-[150px] bg-white flex items-center justify-center cursor-pointer"
                  >
                    <CirclePlus size={30} className="fill-black text-white" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </form>

      {/* Dialog for choosing recommend products */}
      <Dialog
        open={isOpenToChooseRecommendProduct}
        onOpenChange={setIsOpenToChooseRecommendProduct}
      >
        <DialogContent className="bg-white border border-black/10 rounded-[10px]">
          <DialogHeader>
            <DialogTitle>オススメ商品選択</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            {recommendProducts && recommendProducts.length > 0 ? (
              <div className="grid grid-cols-3 gap-5 mt-3 h-[400px] overflow-y-scroll">
                {recommendProducts.map((product: DashboardProduct) => (
                  <RecommendProductCardComponent
                    key={product.productId}
                    imgURL={
                      product.images?.[0]?.imageUrl
                        ? getPublicUrl(product.images[0].imageUrl)
                        : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    imgName={product.name}
                    active={tempSelectedRecommendProducts?.some(
                      (item) => item.productId === product.productId
                    )}
                    onClick={() =>
                      handleToSelectRecommendProducts({
                        productId: product.productId ?? 0,
                        name: product.name,
                        imageUrl: product.images?.[0]?.imageUrl
                          ? getPublicUrl(product.images[0].imageUrl)
                          : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <span>おすすめ商品がありません</span>
            )}
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="bg-primary/100 hover:bg-primary/60 text-white-bg cursor-pointer"
                onClick={handleToSeletAllRecommendProducts}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ServerActionLoadingComponent
        loading={isUpdatingProduct}
        message="更新中..."
      />
    </Form>
  );
};

export default ProductPage;
