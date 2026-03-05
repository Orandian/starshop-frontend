"use client";

import ImageCardComponent from "@/components/admin/ImageCardComponent";
import PaginationComponent from "@/components/app/PaginationComponent";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBrands } from "@/hooks/admin/useBrands";
import { useCsvDownloader } from "@/hooks/admin/useCsvDownloader";
import {
  useChangeProductStatus,
  useGetAllProductsForExport,
  useProducts,
  useUpdateRankingAndArrival,
} from "@/hooks/admin/useProduct";
import { Brand } from "@/types/admin/brand.type";
import {
  Product as AdminProduct,
  ProductListData,
} from "@/types/dashboard/products";
import { encryptString, getPublicUrl } from "@/utils";
import { ChevronDown, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ProductsPage = () => {
  const router = useRouter(); // Router for navigation
  const queryClient = useQueryClient();
  const [pageSize] = useState(10); // Number of items per page
  const [page, setPage] = useState(1); // Current page number
  const [productName, setProductName] = useState(""); // Product name for search
  const [searchProductName, setSearchProductName] = useState(""); // Search product name
  const [status, setStatus] = useState("0"); // Product status for search
  const [searchStatus, setSearchStatus] = useState("0"); // Search product status
  const [brand, setBrand] = useState("0"); // Brand for search
  const [searchBrand, setSearchBrand] = useState("0"); // Search brand
  const [productId, setProductId] = useState(0); // Product ID for status change
  const [statusToChange, setStatusToChange] = useState(false); // Status to change

  // Mutation hooks for product status change
  const {
    mutate: changeStatus,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingProductStatus,
  } = useChangeProductStatus(productId, statusToChange);

  const {
    mutate: changeRankingAndArrival,
    isPending: isChangingRankingAndArrival,
  } = useUpdateRankingAndArrival();

  // Custom hook to fetch product data
  const { mutate: exportAllProductsToCSV } = useGetAllProductsForExport({
    productName: searchProductName,
    status: searchStatus,
    brandId: searchBrand,
  });
  const {
    data: products,
    isLoading,
    error,
    isError,
    refetch,
  } = useProducts(page, pageSize, searchProductName, searchStatus, searchBrand);

  const { downloadCsv, isDownloading: csvDownloading } = useCsvDownloader(
    exportAllProductsToCSV,
  );

  const brandPageSize = 1000;
  const brandPage = 1;
  // Custom hook to fetch brand data
  const { data: brands } = useBrands(brandPage, brandPageSize);

  // Normalize product list shape
  const productList = (products as unknown as ProductListData) || undefined;

  // Calculate total and total pages
  const total = productList?.pagination?.totalElements || 0;
  const pagination = productList?.pagination;
  const totalPages =
    productList?.pagination?.totalPages || Math.ceil((total || 0) / pageSize);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setSearchProductName(productName.trim());
    setSearchStatus(status);
    setSearchBrand(brand);
  };

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    setStatusToChange(productStatus);
    changeStatus();
  };

  const handleRankingChange = (id: number, data: { ranking?: number }) => {
    changeRankingAndArrival(
      { id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["products"],
          });
          toast.success("ランキングを更新しました");
        },
        onError: (error) => {
          toast.error(error?.message || "ランキングを更新できませんでした");
        },
      },
    );
  };

  const handleArrivalChange = (
    id: number,
    data: { isNewArrival?: boolean },
  ) => {
    changeRankingAndArrival(
      { id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["products"],
          });
          toast.success("新着を更新しました");
        },
        onError: (error) => {
          toast.error(error?.message || "新着を更新できませんでした");
        },
      },
    );
  };

  // const isFilteringNow = () => {
  //   return searchProductName || searchStatus !== "0" || searchBrand !== "0";
  // };

  const clearSearch = () => {
    setProductName("");
    setStatus("0");
    setBrand("0");
    setSearchProductName("");
    setSearchStatus("0");
    setSearchBrand("0");
    setPage(1);
  };

  const formatProductId = (createdAt: string, productId: number): string => {
    try {
      const [year, month, day] = createdAt;
      const formattedDate = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
      const paddedProductId = String(productId);
      return `${formattedDate}-${paddedProductId}`;
    } catch (_) {
      return String(productId);
    }
  };

  const handleDownloadCSV = () => {
    downloadCsv(undefined, "商品一覧", {
      onSuccess: () => {
        toast.success("CSV出力が完了しました");
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("CSV出力に失敗しました");
        }
      },
    });
  };

  // Handle status change
  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }

    if (changeStatusError) {
      toast.error(changeStatusError?.message);
    }

    if (isSuccess) {
      toast.success(changeStatusData?.message);
      refetch();
    }
  }, [isError, error, changeStatusError, isSuccess, changeStatusData, refetch]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-3 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>商品一覧</h2>
          </div>
          <Button
            onClick={() => router.push("/admin/products/new")}
            className="bg-primary hover:bg-primary/80 text-white rounded-md px-3 py-2"
          >
            <CirclePlus className="w-4 h-4" />
            新規作成
          </Button>
        </div>

        {/* Filter Section */}
        <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 w-full">
              {/* 商品名 */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品名
                </label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="商品名を入力"
                  className="mt-2 text-sm border border-white-bg rounded-md p-2"
                />
              </div>

              {/* 状況 */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状況
                </label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md">
                    <SelectItem value="0">すべて</SelectItem>
                    <SelectItem value="1">販売中</SelectItem>
                    <SelectItem value="2">販売停止</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ブランド */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ブランド
                </label>
                <Select
                  value={brand}
                  onValueChange={(value) => setBrand(value)}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md">
                    <SelectItem value="0">すべて</SelectItem>
                    {brands?.data?.data?.map((brand: Brand) => (
                      <SelectItem
                        key={brand.brandId}
                        value={brand.brandId.toString()}
                      >
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={clearSearch}
                className="px-6 w-[80px] border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                リセット
              </Button>
              <Button
                onClick={handleSearch}
                className="px-6 w-[80px] bg-primary text-white hover:bg-primary/80 cursor-pointer"
              >
                検索
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 mb-5">
          <div>
            <p className="text-sm">{total}件</p>
          </div>

          <Button
            onClick={() => {
              handleDownloadCSV();
            }}
            disabled={csvDownloading || isLoading}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {csvDownloading ? "CSVエクスポート中... " : "CSVエクスポート"}
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-[100px] py-4 px-4 text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  商品ID
                </TableHead>
                <TableHead className="py-4 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  ブランド名
                </TableHead>
                <TableHead className="w-[100px] py-4 px-4 text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  商品
                </TableHead>

                <TableHead className="py-4 text-center text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  ランキング
                </TableHead>
                <TableHead className="py-4 text-center text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  新着商品
                </TableHead>
                {/* <TableHead className="py-4 text-right text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  卸金額
                </TableHead>
                <TableHead className="py-4 text-right text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  販売金額(税込)
                </TableHead>
                <TableHead className="py-4 text-right text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  税率
                </TableHead> */}

                <TableHead className="py-4 text-center text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  ステータス
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                productList?.data?.map((product: AdminProduct) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2"
                    key={product.productId}
                  >
                    <TableCell className="py-4 text-left">
                      <p>
                        #{formatProductId(product.createdAt, product.productId)}
                      </p>
                    </TableCell>

                    <TableCell className="py-4 text-left">
                      {product.brandName}
                    </TableCell>

                    <TableCell className="py-4 px-4 flex items-center gap-2">
                      <ImageCardComponent
                        imgURL={getPublicUrl(product.images?.[0]?.imageUrl)}
                        imgName="product1"
                      />
                      <div className="flex-col">
                        <p className="truncate w-[200px]">{product.name}</p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 ">
                      <Select
                        value={product.ranking?.toString()}
                        onValueChange={(value) =>
                          handleRankingChange(product.productId, {
                            ranking: Number(value),
                          })
                        }
                      >
                        <SelectTrigger className="w-24 m-auto border border-gray-300 rounded-md px-3 py-2">
                          <SelectValue placeholder="未設定" />
                        </SelectTrigger>
                        <SelectContent className="bg-white w-fit border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                          <SelectItem value="0">未設定</SelectItem>
                          {Array.from({ length: total }, (_, i) => i + 1).map(
                            (item) => (
                              <SelectItem key={item} value={item.toString()}>
                                {item}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] bg-transparent  text-xs cursor-pointer w-[100px]  ${
                              product.isNewArrival === true
                                ? "bg-tertiary text-white hover:bg-tertiary/80"
                                : "text-black hover:bg-transparent"
                            }`}
                            onClick={() => {
                              setProductId(product.productId || 0);
                            }}
                          >
                            {product.isNewArrival === true
                              ? "新着商品"
                              : "通常商品"}
                            <ChevronDown size={15} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                          <DialogHeader>
                            <DialogTitle>新着商品ステータス</DialogTitle>
                            <DialogDescription className="w-full flex items-center justify-center gap-4 border-y border-black/10 py-8 mt-2">
                              <DialogClose
                                className="rounded-md text-xs bg-tertiary text-white cursor-pointer w-[100px] py-2 hover:bg-tertiary/80"
                                onClick={() => {
                                  handleArrivalChange(product.productId, {
                                    isNewArrival: true,
                                  });
                                }}
                              >
                                新着商品
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                onClick={() => {
                                  handleArrivalChange(product.productId, {
                                    isNewArrival: false,
                                  });
                                }}
                              >
                                通常商品
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                onClick={() => {
                                  handleArrivalChange(product.productId, {
                                    isNewArrival: true,
                                  });
                                }}
                                className="text-xs bg-additional text-white cursor-pointer w-[100px] ml-auto hover:bg-additional/80"
                              >
                                OK
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    {/* <TableCell className="py-4 text-right">
                      ¥{Number(product.originalPrice).toLocaleString()}
                    </TableCell>

                    <TableCell className="py-4 text-right">
                      ¥
                      {Number(
                        Math.floor(
                          product.salePrice +
                            (product.salePrice * product.tax) / 100
                        )
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      {product.tax}%
                    </TableCell>
                    */}
                    <TableCell className="text-center py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              product.status === 1
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              setProductId(product.productId || 0);
                            }}
                          >
                            {product.status === 1 ? "販売中" : "販売停止"}
                            <ChevronDown size={15} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                          <DialogHeader>
                            <DialogTitle>ステータス変更</DialogTitle>
                            <DialogDescription className="w-full flex items-center justify-center gap-4 border-y border-black/10 py-8 mt-2">
                              <DialogClose
                                className="rounded-md text-xs bg-tertiary text-white cursor-pointer w-[100px] py-2 hover:bg-tertiary/80"
                                onClick={() => {
                                  handleStatusChange(true);
                                }}
                              >
                                販売中
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                onClick={() => {
                                  handleStatusChange(false);
                                }}
                              >
                                販売停止
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                onClick={() => {
                                  handleStatusChange(!statusToChange);
                                }}
                                className="text-xs bg-additional text-white cursor-pointer w-[100px] ml-auto hover:bg-additional/80"
                              >
                                OK
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-center">
                      <Button
                        onClick={() =>
                          router.push(
                            `/admin/products/${encryptString(
                              product.productId?.toString() || "",
                            )}`,
                          )
                        }
                        className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm cursor-pointer"
                      >
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && productList?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p>商品がありません</p>
                  </TableCell>
                </TableRow>
              )}
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={9} className="h-24 text-center">
                      <Skeleton className="h-24 w-full bg-white-bg rounded-[10px]" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading &&
          productList?.data &&
          productList?.data?.length > 0 &&
          pagination &&
          pagination?.pageSize &&
          pagination?.totalElements &&
          pagination.totalElements > pagination.pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={pagination.currentPage ?? 1}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </div>
          )}
      </div>

      <ServerActionLoadingComponent
        loading={isChangingProductStatus || isChangingRankingAndArrival}
        message="商品のステータスを変更中..."
      />
    </section>
  );
};

export default ProductsPage;
