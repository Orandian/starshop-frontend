"use client";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import PaginationComponent from "@/components/app/PaginationComponent";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  useCreateSupplierOrder,
  useExportToCSVSupplier,
  useGetAllBrands,
  useGetAllSupplier,
  useGetProductById,
  useUpdateSupplierOrder,
} from "@/hooks/admin/useInventory";
import {
  CreateSupplierRequest,
  SupplierBrand,
  SupplierOrder,
  UpdateSupplierRequest,
} from "@/types/admin/inventory.type";
import { SupplierOrderFilter } from "@/components/admin/inventory/SupplierOrderFilter";
import { formatDate2 } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useCsvDownloader } from "@/hooks/admin/useCsvDownloader";

// Mock data - replace with actual API call

const SupplierOrderPage = () => {
  const router = useRouter();
  const query = useQueryClient();

  const [openNewOrder, setOpenNewOrder] = useState(false); // Open new order
  const [openUpdateOrder, setOpenUpdateOrder] = useState(false); // Open update order
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    brandName: "",
    productName: "",
    status: "-1",
  });
  const size = 10;
  const { data: suppliersResult, isLoading: isGettingSupplier } =
    useGetAllSupplier(page, size, filters);

  const { mutate: createSupplierOrder, isPending: isCreatingSupplier } =
    useCreateSupplierOrder();
  const { mutate: updateSupplierOrder, isPending: isUpdatingSupplier } =
    useUpdateSupplierOrder();
  const { data: brandsResult, isLoading: isGetBrandLoading } =
    useGetAllBrands();

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const suppliers = suppliersResult?.data?.data || [];
  const pagination = suppliersResult?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = suppliersResult?.data?.pagination.totalElements || 0;

  // const [, brandsResult] = results.map((result) => result.data);
  const isLoading = isGettingSupplier || isGetBrandLoading;
  const brands = brandsResult?.data as SupplierBrand[];

  const { data: productListByBrand, isLoading: isLoadingProductListByBrand } =
    useGetProductById(selectedBrandId ?? 0);

  //csv download
  const { mutate: exportToCSV } = useExportToCSVSupplier(filters);
  const { downloadCsv, isDownloading: csvDownloading } =
    useCsvDownloader(exportToCSV);

  const FormSchema = z.object({
    orderDate: z
      .string()
      .min(1, "発注日は必須です")
      .transform((val) => `${val}T00:00:00`),
    brandId: z.number().min(1, "ブランドは必須です"),
    productId: z.number().min(1, "商品は必須です"),
    purchasePrice: z
      .string()
      .min(1, "仕入金額を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    quantity: z
      .string()
      .min(1, "数量を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    subTotal: z
      .string()
      .min(1, "合計を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    totalTax: z
      .string()
      .min(1, "消費税を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    totalPrice: z
      .string()
      .min(1, "合計(税込)を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    status: z.string().min(1, "ステータスは必須です"),
  });
  type SupplierFormValues = z.infer<typeof FormSchema>;

  const UpdateFormSchema = z.object({
    supplierOrderId: z.string(),
    purchasePrice: z
      .string()
      .min(1, "仕入金額を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    quantity: z
      .string()
      .min(1, "数量を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    subTotal: z
      .string()
      .min(1, "合計を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    totalTax: z
      .string()
      .min(1, "消費税を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    totalPrice: z
      .string()
      .min(1, "合計(税込)を入力してください")
      .regex(/^\d+$/, "数字のみ入力してください"),
    status: z.string().min(1, "ステータスは必須です"),
  });

  type UpdateSupplierFormValues = z.infer<typeof UpdateFormSchema>;

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      orderDate: "",
      brandId: 0,
      productId: 0,
      purchasePrice: "",
      totalPrice: "",
      subTotal: "",
      quantity: "",
      totalTax: "",
      status: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const updateForm = useForm<UpdateSupplierFormValues>({
    resolver: zodResolver(UpdateFormSchema),
    defaultValues: {
      supplierOrderId: "",
      purchasePrice: "",
      totalPrice: "",
      subTotal: "",
      quantity: "",
      totalTax: "",
      status: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // const { data: supplier } = useGetSupplierById(1);

  const getStatusStyle = (status: number) => {
    switch (status) {
      case 0:
        return "bg-blue-100 text-blue-800 font-bold";
      case 1:
        return "bg-yellow-100 text-yellow-800 font-bold";
      case 2:
        return "bg-green-100 text-green-800 font-bold";
      // case 4:
      //   return "bg-red-50 text-red-600";
      // default:
      //   return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "発注済み";
      case 1:
        return "配送中";
      case 2:
        return "完了";
      // case 4:
      //   return "キャンセル";
      // default:
      //   return "不明";
    }
  };

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString("ja-JP")}`;
  };

  const calculateSubTotal = (
    purchasePrice: number | undefined,
    quantity: number | undefined
  ) => {
    if (purchasePrice && quantity) {
      return purchasePrice * quantity;
    }
    return undefined;
  };

  const calculateTotalPrice = (
    subTotal: number | undefined,
    totalTax: number | undefined
  ) => {
    if (subTotal && totalTax) {
      return subTotal + totalTax;
    }
    return undefined;
  };

  const updateAllCalculations = (
    purchasePrice: number | undefined,
    quantity: number | undefined,
    isUpdate: boolean
  ) => {
    const subTotal = calculateSubTotal(purchasePrice, quantity);

    if (isUpdate) {
      updateForm.setValue("subTotal", subTotal?.toString() || "");
    } else {
      form.setValue("subTotal", subTotal?.toString() || "");
    }
  };

  const handleCreateBrand = (value: SupplierFormValues) => {
    const transformedValue: CreateSupplierRequest = {
      ...value,
      purchasePrice: parseFloat(Number(value.purchasePrice).toFixed(2)),
      quantity: parseFloat(Number(value.quantity).toFixed(2)),
      subTotal: parseFloat(Number(value.subTotal).toFixed(2)),
      totalTax: parseFloat(Number(value.totalTax).toFixed(2)),
      totalPrice: parseFloat(Number(value.totalPrice).toFixed(2)),
      status: Number(value.status),
    };

    createSupplierOrder(transformedValue, {
      onSuccess: () => {
        form.reset();
        setOpenNewOrder(false);
        query.invalidateQueries({ queryKey: ["inventory-get-all-supplier"] });
        toast.success("発注を作成しました");
      },
      onError: () => toast.error("発注を作成できませんでした"),
    });
  };

  const openUpdateModel = (item: SupplierOrder) => {
    // form.reset({
    //   purchasePrice: item.purchasePrice.toString(),
    //   quantity: item.quantity.toString(),
    //   subTotal: item.subTotal.toString(),
    //   totalTax: item.totalTax.toString(),
    //   totalPrice: item.totalPrice.toString(),
    //   status: item.status.toString(),
    // });
    updateForm.setValue("supplierOrderId", item.supplierOrderId.toString(), {
      shouldValidate: true,
    });
    updateForm.setValue("purchasePrice", item.purchasePrice.toString(), {
      shouldValidate: true,
    });
    updateForm.setValue("quantity", item.quantity.toString(), {
      shouldValidate: true,
    });
    updateForm.setValue("subTotal", item.subTotal.toString(), {
      shouldValidate: true,
    });
    updateForm.setValue("totalTax", item.totalTax.toString(), {
      shouldValidate: true,
    });
    updateForm.setValue("totalPrice", item.totalPrice.toString(), {
      shouldValidate: true,
    });
    updateForm.setValue("status", item.status.toString(), {
      shouldValidate: true,
    });
    setOpenUpdateOrder(true);
  };
  const handleUpdateBrand = (value: UpdateSupplierFormValues) => {
    const transformedValue: UpdateSupplierRequest = {
      purchasePrice: Number(value.purchasePrice),
      quantity: Number(value.quantity),
      subTotal: Number(value.subTotal),
      totalTax: Number(value.totalTax),
      totalPrice: Number(value.totalPrice),
      status: Number(value.status),
    };

    updateSupplierOrder(
      { id: Number(value.supplierOrderId), data: transformedValue },
      {
        onSuccess: () => {
          form.reset();
          setOpenUpdateOrder(false);
          query.invalidateQueries({ queryKey: ["inventory-get-all-supplier"] });
          toast.success("発注を更新しました");
        },
        onError: () => toast.error("発注を更新できませんでした"),
      }
    );
  };

  useEffect(() => {
    if (!productListByBrand?.data || productListByBrand.data.length === 0) {
      form.setValue("productId", 0); // or undefined
    }
  }, [productListByBrand?.data, form]);

  /**
   * handle csv download
   * @author Phway
   * @date 2026-01-05
   */
  const handleDownloadCSV = () => {
    downloadCsv(undefined, `発注状況`, {
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
                className={`w-28  flex justify-center items-center   rounded-full text-sm bg-transparent border border-black text-black hover:bg-black/20`}
                onClick={() => router.push("/admin/products/inventory")}
              >
                在庫状況
              </Button>

              <Button
                className={`w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-black bg-black`}
              >
                発注状況
              </Button>
            </div>
          </div>

          <Button
            className="bg-primary hover:bg-primary/80 text-white flex items-center gap-2 "
            onClick={() => {
              form.reset();
              setOpenNewOrder(true);
            }}
          >
            <CirclePlus className="w-4 h-4" />
            新規発注
          </Button>
        </div>

        {/* Filter Section */}
        <SupplierOrderFilter onFilter={handleFilterChange} />

        {/* Count */}
        <div className="flex justify-between items-center gap-2 mb-4">
          <p className="text-sm"> {total ? total : 0}件</p>
          <Button
            onClick={() => handleDownloadCSV()}
            disabled={
              csvDownloading ||
              isLoading ||
              suppliers.length === 0
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
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                  No
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                  発注日
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs">
                  ブランド名
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs">
                  商品名
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-right">
                  仕入金額（税別）
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                  数量
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-right">
                  合計 （税別）
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-right">
                  消費税（１０％）
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-right">
                  合計(税込)
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                  ステータス
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                  設定
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                suppliers?.map((item, index) => (
                  <TableRow
                    key={item.supplierOrderId}
                    className="border-b border-black/10 hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-4 text-center">
                      {(page - 1) * size + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {formatDate2(item.orderDate)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {item.brandName}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {item.productName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      {formatCurrency(item.purchasePrice)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {item.quantity.toLocaleString("ja-JP")}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      {formatCurrency(item.subTotal)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      {formatCurrency(item.totalTax)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-medium">
                      {formatCurrency(item.totalPrice)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Button
                        onClick={() => openUpdateModel(item)}
                        className="bg-primary hover:bg-primary/80 text-white text-xs px-4 py-2 rounded-md"
                      >
                        設定
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={11} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    発注データがありません
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

      {/* Create new brand dialog */}
      <Dialog open={openNewOrder} onOpenChange={setOpenNewOrder}>
        <Form {...form}>
          <DialogContent className="sm:max-w-md md:max-w-2xl bg-white border border-white-bg rounded-md">
            <form onSubmit={form.handleSubmit(handleCreateBrand)}>
              <DialogHeader>
                <DialogTitle>新規ブランド</DialogTitle>
                <DialogDescription className="mt-2 space-y-4">
                  {/* ブランド名 */}
                  {/* 発注日 */}
                  {/* 発注日 */}
                  <FormField
                    control={form.control}
                    name="orderDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                          発注日
                        </FormLabel>
                        <FormControl>
                          <AdminDatePicker
                            value={field.value || ""}
                            onChange={field.onChange}
                            styleName="w-full border border-white-bg bg-white rounded-md"
                          />
                        </FormControl>
                        <FormMessage className="text-error text-left" />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 w-full gap-3">
                    {/* ブランド */}
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem className="mt-2 w-full col-span-1">
                          <FormLabel>
                            ブランド名{" "}
                            <span className="text-required text-xl">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(Number(value));
                                setSelectedBrandId(Number(value));
                              }}
                              value={field.value ? field.value.toString() : ""}
                            >
                              <SelectTrigger className="w-full border border-white-bg rounded-md">
                                <SelectValue placeholder="ブランドを選択" />
                              </SelectTrigger>
                              <SelectContent className="bg-white ">
                                {brands.map((brand) => (
                                  <SelectItem
                                    key={brand.brandId}
                                    value={brand.brandId.toString()}
                                  >
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-error text-left" />
                        </FormItem>
                      )}
                    />

                    {/* 商品 */}
                    <FormField
                      control={form.control}
                      name="productId"
                      disabled={!selectedBrandId}
                      render={({ field }) => (
                        <FormItem className="mt-2 w-full col-span-1">
                          <FormLabel>
                            商品名{" "}
                            <span className="text-required text-xl">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value ? field.value.toString() : ""}
                            >
                              <SelectTrigger className="w-full border border-white-bg rounded-md">
                                <SelectValue placeholder="商品を選択" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {isLoadingProductListByBrand ? (
                                  <div className="p-2 text-center text-gray-500">
                                    読み込み中...
                                  </div>
                                ) : productListByBrand?.data &&
                                  productListByBrand?.data?.length > 0 ? (
                                  productListByBrand?.data?.map((product) => (
                                    <SelectItem
                                      key={product.productId}
                                      value={product.productId.toString()}
                                    >
                                      {product.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-center text-gray-500">
                                    商品がありません
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-error text-left" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex w-full gap-3">
                    {/* 仕入金額 */}
                    <div className="w-full">
                      <FormInputComponent
                        control={form.control}
                        type="number"
                        name="purchasePrice"
                        label="仕入金額（税別）"
                        placeholder="仕入金額を入力"
                        className="mt-2 text-sm border border-white-bg rounded-md p-2"
                        preventAutoSelect
                        required
                        onChange={(e) => {
                          const purchasePrice =
                            Number(e.target.value) || undefined;
                          const quantity =
                            Number(form.getValues("quantity")) || undefined;
                          updateAllCalculations(purchasePrice, quantity, false);
                        }}
                      />
                    </div>
                    {/* 数量 */}
                    <div className="w-full">
                      <FormInputComponent
                        control={form.control}
                        name="quantity"
                        type="number"
                        label="数量"
                        placeholder="数量を入力"
                        className="mt-2 text-sm border border-white-bg rounded-md p-2"
                        preventAutoSelect
                        required
                        onChange={(e) => {
                          const quantity = Number(e.target.value) || undefined;
                          const purchasePrice =
                            Number(form.getValues("purchasePrice")) ||
                            undefined;
                          updateAllCalculations(purchasePrice, quantity, false);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-3">
                    {/* 小計 */}
                    <div className="w-full">
                      <FormInputComponent
                        control={form.control}
                        name="subTotal"
                        type="number"
                        label="合計（税別）"
                        placeholder="合計を入力"
                        className="mt-2 text-sm border border-white-bg rounded-md p-2"
                        preventAutoSelect
                        disabled
                        required
                      />
                    </div>
                    {/* 消費税 */}
                    <div className="w-full">
                      <FormInputComponent
                        control={form.control}
                        name="totalTax"
                        type="number"
                        label="消費税(10%)"
                        placeholder="消費税を入力"
                        className="mt-2 text-sm border border-white-bg rounded-md p-2"
                        preventAutoSelect
                        required
                        onChange={(e) => {
                          const totalTax = Number(e.target.value) || undefined;
                          const subTotal =
                            Number(form.getValues("subTotal")) || undefined;
                          const totalPrice = calculateTotalPrice(
                            subTotal,
                            totalTax
                          );
                          form.setValue(
                            "totalPrice",
                            totalPrice?.toString() || ""
                          );
                        }}
                      />
                    </div>
                  </div>
                  {/* 合計 */}
                  <FormInputComponent
                    control={form.control}
                    name="totalPrice"
                    label="合計(税込)	"
                    type="number"
                    placeholder="合計を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    disabled
                    required
                  />
                  {/* ステータス */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="mt-2 w-full">
                        <FormLabel>
                          ステータス{" "}
                          <span className="text-required text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full border border-white-bg rounded-md">
                              <SelectValue placeholder="ステータスを選択" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="0">発注済み</SelectItem>
                              <SelectItem value="1">未発注</SelectItem>
                              <SelectItem value="2">キャンセル</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-error text-left" />
                      </FormItem>
                    )}
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
                >
                  {isCreatingSupplier ? "作成中..." : "OK"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>

      {/* Update brand dialog */}
      <Dialog open={openUpdateOrder} onOpenChange={setOpenUpdateOrder}>
        <Form {...updateForm}>
          <DialogContent className="sm:max-w-md md:max-w-2xl bg-white border border-white-bg rounded-md">
            <form onSubmit={updateForm.handleSubmit(handleUpdateBrand)}>
              <DialogHeader>
                <DialogTitle>発注更新</DialogTitle>
                <DialogDescription className="mt-2 space-y-4">
                  <div className="flex w-full gap-3">
                    {/* 仕入金額 */}
                    <div className="w-full">
                      <FormInputComponent
                        control={updateForm.control}
                        type="number"
                        name="purchasePrice"
                        label="仕入金額（税別）"
                        placeholder="仕入金額を入力"
                        className="mt-2 text-sm border border-white-bg rounded-md p-2"
                        preventAutoSelect
                        required
                        onChange={(e) => {
                          const purchasePrice =
                            Number(e.target.value) || undefined;
                          const quantity =
                            Number(updateForm.getValues("quantity")) ||
                            undefined;
                          updateAllCalculations(purchasePrice, quantity, true);
                        }}
                      />
                    </div>
                    {/* 数量 */}
                    <div className="w-full">
                      <FormInputComponent
                        control={updateForm.control}
                        name="quantity"
                        type="number"
                        label="数量"
                        placeholder="数量を入力"
                        className="mt-2 text-sm border border-white-bg rounded-md p-2"
                        preventAutoSelect
                        required
                        onChange={(e) => {
                          const quantity = Number(e.target.value) || undefined;
                          const purchasePrice =
                            Number(updateForm.getValues("purchasePrice")) ||
                            undefined;
                          updateAllCalculations(purchasePrice, quantity, true);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-3">
                    {/* 小計 */}
                    <div className="w-full">
                      <FormInputComponent
                        control={updateForm.control}
                        name="subTotal"
                        type="number"
                        label="合計 （税別）"
                        placeholder="合計を入力"
                        className="mt-2 text-sm border border-white-bg rounded-md p-2"
                        preventAutoSelect
                        disabled
                        required
                      />
                    </div>
                    {/* 消費税 */}
                    <div className="w-full">
                      <FormInputComponent
                        control={updateForm.control}
                        name="totalTax"
                        type="number"
                        label="消費税（１０％）"
                        placeholder="消費税を入力"
                        className="mt-2 text-sm border border-white-bg rounded-md p-2"
                        preventAutoSelect
                        required
                        onChange={(e) => {
                          const totalTax = Number(e.target.value) || undefined;
                          const subTotal =
                            Number(updateForm.getValues("subTotal")) ||
                            undefined;
                          const totalPrice = calculateTotalPrice(
                            subTotal,
                            totalTax
                          );
                          updateForm.setValue(
                            "totalPrice",
                            totalPrice?.toString() || ""
                          );
                        }}
                      />
                    </div>
                  </div>
                  {/* 合計 */}
                  <FormInputComponent
                    control={updateForm.control}
                    name="totalPrice"
                    label="合計(税込)	"
                    type="number"
                    placeholder="合計を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    disabled
                    required
                  />
                  {/* ステータス */}
                  <FormField
                    control={updateForm.control}
                    name="status"
                    render={({ field }) => (
                      <div className="mt-2">
                        <FormLabel>
                          ステータス{" "}
                          <span className="text-required text-xl">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full border border-white-bg rounded-md">
                            <SelectValue placeholder="ステータスを選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="0">発注済み</SelectItem>
                            <SelectItem value="1">配送中</SelectItem>
                            <SelectItem value="2">完了</SelectItem>
                            {/* <SelectItem value="4">キャンセル</SelectItem> */}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
                >
                  {isUpdatingSupplier ? "作成中..." : "OK"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>
    </section>
  );
};

export default SupplierOrderPage;
