"use client";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExportToCSVInventory, useGetProductList, useUpdateProductQty } from "@/hooks/admin/useInventory";
import { InventroyProduct } from "@/types/admin/inventory.type";
import { InventoryFilter } from "@/components/admin/inventory/InventoryFilter";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCsvDownloader } from "@/hooks/admin/useCsvDownloader";

const InventoryManagementPage = () => {
  const query = useQueryClient();
  // const [isLoading] = useState(false);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<InventroyProduct | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    brandName: "",
    productName: "",
    safeStockQuantity: "",
    status: "-1",
  });

  const { data: productLists, isLoading } = useGetProductList(page, 10, filters);
  const { mutate: updateStockQty, isPending: isUpdatingStock } =
    useUpdateProductQty();

  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [adjustmentSafeStockValue, setAdjustmentSafeStockValue] =
    useState<number>(0);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const pagination = productLists?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = productLists?.data?.pagination.totalElements || 0;

  //csv download
    const { mutate: exportToCSV } = useExportToCSVInventory(filters);
    const { downloadCsv, isDownloading: csvDownloading } =
      useCsvDownloader(exportToCSV);
  

  // const getStatusStyle = (status: string) => {
  //   switch (status) {
  //     case "在庫切れ":
  //       return "bg-red-50 text-red-600";
  //     case "十分":
  //       return "bg-blue-50 text-blue-600";
  //     case "警告":
  //       return "bg-yellow-50 text-yellow-600";
  //     default:
  //       return "bg-gray-50 text-gray-600";
  //   }
  // };

  const getStockStatus = (stockQuantity: number, safeStockQuantity: number) => {
    if (stockQuantity > safeStockQuantity) {
      return { text: "在庫あり", style: "bg-blue-100 text-blue-800" }; //1
    } else {
      return { text: "在庫切れ", style: "bg-red-100 text-red-800" }; //0
    }
  };

  const handleAdjustStock = (item: InventroyProduct) => {
    setSelectedItem(item);
    setAdjustmentValue(item.stockQuantity);
    setAdjustmentSafeStockValue(item.safeStockQuantity);
  };

  const handleSaveAdjustment = () => {
    if (selectedItem) {
      // TODO: Call API to update stock
      updateStockQty(
        {
          id: selectedItem.productId,
          data: {
            quantity: adjustmentValue,
            safeStockQuantity: adjustmentSafeStockValue,
          },
        },
        {
          onSuccess: () => {
            toast.success(
              `商品「${selectedItem.productName}」の在庫を ${adjustmentValue} に更新しました`
            );
            setSelectedItem(null);
            query.invalidateQueries({
              queryKey: ["inventory-get-product-list"],
            });
          },
          onError: () => toast.error("在庫更新に失敗しました"),
        }
      );
    }
  };

  const incrementStock = () => {
    setAdjustmentValue((prev) => prev + 1);
  };

  const decrementStock = () => {
    setAdjustmentValue((prev) => Math.max(0, prev - 1));
  };

   /**
     * handle csv download
     * @author Phway
     * @date 2026-01-05
     */
    const handleDownloadCSV = () => {
      downloadCsv(undefined, `在庫状況`, {
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

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left flex items-center gap-3">
            <h2>在庫管理</h2>

            <div className="flex gap-4  items-center">
              <Button
                className={`w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-dark bg-black`}
              >
                在庫状況
              </Button>

              <Button
                className={`w-28  flex justify-center items-center rounded-full text-sm bg-transparent border border-black text-black hover:bg-black/20`}
                onClick={() =>
                  router.push("/admin/products/inventory/supplier-order")
                }
              >
                発注状況
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <InventoryFilter onFilter={handleFilterChange} />

        {/* Count */}
        <div className="flex justify-between items-center">
          <p className="text-sm ">{total ? total : 0}件</p>
          <Button
            onClick={() => handleDownloadCSV()}
            disabled={
              csvDownloading ||
              isLoading ||
              productLists?.data?.data?.length === 0
            }
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
          >
            {csvDownloading ? "CSVエクスポート中... " : "CSVエクスポート"}
            
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10 bg-white">
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  No
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  ブランド名
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  商品名
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  現在在庫
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  安全在庫
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  発注点
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  ステータス 
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  設定
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productLists?.data?.data &&
                productLists?.data?.data.map((item, index) => (
                  <TableRow
                    key={item.productId}
                    className="border-b border-black/10 hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-3 text-center">
                      {pagination?.currentPage && pagination?.pageSize
                        ? (pagination.currentPage - 1) * pagination.pageSize +
                          index +
                          1
                        : index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {item.brandName}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {item.productName}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {item.stockQuantity}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {item.safeStockQuantity}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {item.orderCount}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1.5 rounded-md  font-medium ${getStockStatus(item.stockQuantity, item.safeStockQuantity).style}`}
                      >
                        {
                          getStockStatus(
                            item.stockQuantity,
                            item.safeStockQuantity
                          ).text
                        }
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className=" border-black/10 bg-primary text-white"
                            onClick={() => handleAdjustStock(item)}
                          >
                            設定
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-lg">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-bold">
                              在庫設定
                            </DialogTitle>
                          </DialogHeader>
                          <DialogDescription className="text-left">
                            <div className="space-y-4 py-4">
                              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 w-20">
                                    商品名:
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {selectedItem?.productName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 w-20">
                                    ブランド:
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {selectedItem?.brandName}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-900 block">
                                  現在在庫
                                </label>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0  border hover:bg-gray-100"
                                    onClick={decrementStock}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={adjustmentValue}
                                    onChange={(e) =>
                                      setAdjustmentValue(
                                        Math.max(
                                          0,
                                          parseInt(e.target.value) || 0
                                        )
                                      )
                                    }
                                    className="text-center w-20 h-9 text-base font-medium border focus:ring-2 focus:ring-primary"
                                    min="0"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0  border hover:bg-gray-100"
                                    onClick={incrementStock}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-900 block">
                                  安全在庫
                                </label>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0  border hover:bg-gray-100"
                                    onClick={() =>
                                      setAdjustmentSafeStockValue((prev) =>
                                        Math.max(0, prev - 1)
                                      )
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={adjustmentSafeStockValue}
                                    onChange={(e) =>
                                      setAdjustmentSafeStockValue(
                                        Math.max(
                                          0,
                                          parseInt(e.target.value) || 0
                                        )
                                      )
                                    }
                                    className="text-center w-20 h-9 text-base font-medium border focus:ring-2 focus:ring-primary"
                                    min="0"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0  border hover:bg-gray-100"
                                    onClick={() =>
                                      setAdjustmentSafeStockValue(
                                        (prev) => prev + 1
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogDescription>
                          <DialogFooter className="flex gap-2 sm:gap-2">
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                className="flex-1 border-black/10 hover:bg-gray-100"
                              >
                                キャンセル
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                onClick={handleSaveAdjustment}
                                className="flex-1 bg-primary text-white hover:bg-primary/80"
                              >
                                保存
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={8} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && productLists?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    在庫データがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading &&
          pagination &&
          totalPages > 0 &&
          pagination?.totalElements > pagination?.pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={pagination.currentPage}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </div>
          )}
      </div>

      <ServerActionLoadingComponent
        loading={isUpdatingStock}
        message={
          isUpdatingStock ? "在庫を更新しています" : "在庫調整を処理しています"
        }
      />
    </section>
  );
};

export default InventoryManagementPage;
