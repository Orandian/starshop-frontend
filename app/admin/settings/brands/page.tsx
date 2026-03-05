"use client";

import AdminDatePicker from "@/components/admin/AdminDatePicker";
import PaginationComponent from "@/components/app/PaginationComponent";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import FormInputComponent from "@/components/app/public/FormInputComponent";
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
import { Form, FormField, FormLabel } from "@/components/ui/form";
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
import {
  useBrands,
  useChangeBrandStatus,
  useCreateBrand,
  useUpdateBrand,
} from "@/hooks/admin/useBrands";
import { Brand } from "@/types/admin/brand.type";
import { formatDate2 } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ChevronDown, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const BrandsPage = () => {
  const [pageSize] = useState(10); // Page size
  const [page, setPage] = useState(1); // Current page

  const [brandsKeyword, setBrandsKeyword] = useState(""); // Brands keyword
  const [searchBrandsKeyword, setSearchBrandsKeyword] = useState(""); // Search brands keyword
  const [brandsDate, setBrandsDate] = useState(""); // Brands date
  const [searchBrandsDate, setSearchBrandsDate] = useState(""); // Search brands date
  const [status, setStatus] = useState("0"); // Status
  const [searchStatus, setSearchStatus] = useState("0"); // Search status
  const [brandId, setBrandId] = useState(0); // Brand id
  //const [statusToChange, setStatusToChange] = useState(false); // Status to change

  const [openNewBrand, setOpenNewBrand] = useState(false); // Open new brand

  const [openUpdateBrand, setOpenUpdateBrand] = useState(false); // Open update brand
  const [updateBrandId, setUpdateBrandId] = useState(0); // Update brand id

  // Mutations for brand status change
  const {
    mutate: changeStatus,
    isPending: changeStatusLoading,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
  } = useChangeBrandStatus();

  // useBrands hook for fetching brands
  const {
    data: brands,
    isLoading,
    error,
    isError,
    refetch,
  } = useBrands(
    page,
    pageSize,
    searchBrandsKeyword,
    searchStatus,
    searchBrandsDate
  );

  // Mutations for brand creation
  const { mutate: createBrand, isPending: isCreatingBrand } = useCreateBrand();

  // Mutations for brand update
  const { mutate: updateBrand, isPending: isUpdatingBrand } = useUpdateBrand();

  // Total number of brands
  const total = brands?.data?.pagination.totalElements || 0;
  const totalPages = Math.ceil(total / pageSize);

  //form schema
  const FormSchema = z.object({
    name: z.string().min(1, "ブランド名は必須です"),
    isFcShow: z.boolean(),
    seller: z.string().min(1, "ブランド名は必須です"),
    manufacture: z.string().min(1, "ブランド名は必須です"),
  });

  //form state for create
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      isFcShow: true,
      seller: "",
      manufacture: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  //form state for update
  const updateForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      isFcShow: false,
      seller: "",
      manufacture: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Handle search brands
  const handleSearch = () => {
    setPage(1);
    setSearchBrandsKeyword(brandsKeyword);
    setSearchBrandsDate(brandsDate);
    setSearchStatus(status);
  };

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    //setStatusToChange(productStatus);
    changeStatus(
      { brandId, status: productStatus },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      }
    );
  };

  // Handle create brand
  const handleCreateBrand = (data: z.infer<typeof FormSchema>) => {
    createBrand(
      {
        name: data.name,
        isFcShow: data.isFcShow,
        manufacturerCompany: data.manufacture,
        distributionCompany: data.seller,
      },
      {
        onSuccess: () => {
          setOpenNewBrand(false);
          toast.success("ブランドを追加しました");
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      }
    );
  };

  // Handle update brand
  const handleUpdateBrand = (data: z.infer<typeof FormSchema>) => {
    updateBrand(
      {
        brand_id: updateBrandId,
        brand: {
          name: data.name,
          isFcShow: data.isFcShow,
          manufacturerCompany: data.manufacture,
          distributionCompany: data.seller,
        },
      },
      {
        onSuccess: () => {
          setOpenUpdateBrand(false);
          setUpdateBrandId(0);
          refetch();
        },
        onError: (err) => {
          toast.error(err?.message);
        },
      }
    );
  };

  // Error handling
  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }

    // change status error
    if (changeStatusError) {
      toast.error(changeStatusError?.message);
    }
    // change status success
    if (isSuccess) {
      toast.success(changeStatusData?.message);
      refetch();
    }
  }, [isError, error, changeStatusError, isSuccess, changeStatusData, refetch]);

  const resetFilters = () => {
    setPage(1);
    setBrandsDate("");
    setBrandsKeyword("");
    setStatus("0");
    setSearchBrandsDate("");
    setSearchBrandsKeyword("");
    setSearchStatus("0");
    refetch();
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>ブランド設定</h2>
          </div>
          <Button
            onClick={() => {
              form.reset();
              setOpenNewBrand(true);
            }}
            className="bg-primary hover:bg-primary/80 text-white rounded-md px-3 py-2"
          >
          <CirclePlus className="w-4 h-4" />
            新規作成
          </Button> 
        </div>

        <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex justify-between items-center gap-4 flex-col md:flex-row ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {/* ブランドキーワード */}
              <div>
                <span className="text-sm">ブランドキーワード</span>
                <Input
                  value={brandsKeyword}
                  onChange={(e) => setBrandsKeyword(e.target.value)}
                  placeholder="ブランドキーワードを入力"
                  className="mt-2 text-sm border border-white-bg rounded-md p-2"
                />
              </div>

              {/* 日付 */}
              <div>
                <span className="text-xs">日付</span>
                <AdminDatePicker
                  value={brandsDate}
                  onChange={(date) => setBrandsDate(date)}
                  styleName="w-full border border-white-bg rounded-md p-2 mt-2 mb-4"
                />
              </div>

              {/* 状況 */}
              <div>
                <span className="text-sm">状況</span>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="状況を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0">すべて</SelectItem>
                    <SelectItem value="1">有効</SelectItem>
                    <SelectItem value="2">無効</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="px-6 w-20 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                リセット
              </Button>
              <Button
                onClick={handleSearch}
                className="px-6 w-20 bg-primary text-white hover:bg-primary/80 cursor-pointer"
              >
                検索
              </Button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm mb-5"> {total ? total : 0}件</p>
        </div>
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="py-3 px-6 text-xs font-bold text-black uppercase">
                  登録日
                </TableHead>
                <TableHead className="py-3 px-6 text-xs font-bold text-black uppercase">
                  ブランド名
                </TableHead>
                <TableHead className="py-3 px-6 text-xs font-bold text-black uppercase">
                  製造元会社
                </TableHead>
                <TableHead className="py-3 px-6 text-xs font-bold text-black uppercase">
                  販売元会社
                </TableHead>
                <TableHead className="py-3 px-6 text-xs font-bold text-black uppercase">
                  商品数
                </TableHead>
                <TableHead className="py-3 px-6 text-xs font-bold text-black uppercase">
                  代理店販売
                </TableHead>
                <TableHead className="text-center py-3 px-6 text-xs font-bold text-black uppercase">
                  ステータス
                </TableHead>
                <TableHead className="text-center py-3 px-6 text-xs font-bold text-black uppercase">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands?.data &&
                brands?.data?.data?.length > 0 &&
                brands?.data?.data?.map((brand: Brand) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2"
                    key={brand.brandId}
                  >
                    <TableCell className="py-3 px-6 ">
                      {formatDate2(brand.createdAt)}
                    </TableCell>
                    <TableCell className="py-3 px-6">
                      {brand.name}
                    </TableCell>
                    <TableCell className="py-3 px-6">
                      {brand.manufacturerCompany}
                    </TableCell>
                    <TableCell className="py-3 px-6">
                      {brand.distributionCompany}
                    </TableCell>
                    <TableCell className="py-3 px-6">
                      {brand.productCount}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-red-500 font-bold">
                      {brand?.isFcShow ? "O" : "X"}
                    </TableCell>
                    <TableCell className="text-center py-3 px-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              brand.isActive
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              setBrandId(brand.brandId || 0);
                            }}
                          >
                            {brand.isActive ? "有効" : "無効"}
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
                                有効
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                onClick={() => {
                                  handleStatusChange(false);
                                }}
                              >
                                無効
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                          {/* <DialogFooter>
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
                          </DialogFooter> */}
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-center">
                      <Button
                        onClick={() => {
                          setOpenUpdateBrand(true);
                          setUpdateBrandId(brand.brandId);
                          updateForm.reset({
                            name: brand.name || "",
                            isFcShow: brand.isFcShow || false,
                            manufacture: brand.manufacturerCompany || "",
                            seller: brand.distributionCompany || "",
                          });
                        }}
                        className="bg-primary hover:bg-primary/80 text-white text-xs px-4 py-2 rounded-md"
                      >
                        編集
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && brands?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    ブランドがありません
                  </TableCell>
                </TableRow>
              )}
              {isLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={8} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading && brands?.data && brands?.data?.data?.length > 0 && total > pageSize && (
          <div className="flex justify-end">
            <div>
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Create new brand dialog */}
      <Dialog open={openNewBrand} onOpenChange={setOpenNewBrand}>
        <Form {...form}>
          <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
            <form onSubmit={form.handleSubmit(handleCreateBrand)}>
              <DialogHeader>
                <DialogTitle>新規ブランド</DialogTitle>
                <DialogDescription className="mt-2 space-y-4">
                  {/* ブランド名 */}
                  <FormInputComponent
                    control={form.control}
                    name="name"
                    label="ブランド名"
                    placeholder="ブランド名を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />

                  {/* 	製造元会社 */}
                  <FormInputComponent
                    control={form.control}
                    name="manufacture"
                    label="製造元会社"
                    placeholder="製造元会社を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />

                  {/* 	販売元会社 */}
                  <FormInputComponent
                    control={form.control}
                    name="seller"
                    label="販売元会社"
                    placeholder="販売元会社を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />
                  {/* 代理店販売 */}
                  <div>
                    <FormLabel htmlFor="contractStartDate">
                      代理店販売{" "}
                      <span className="text-required text-xl">*</span>
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="isFcShow"
                      render={({ field }) => (
                        <Select
                          value={field.value ? "true" : "false"}
                          onValueChange={(val) =>
                            field.onChange(val === "true")
                          }
                        >
                          <SelectTrigger className="w-full border border-white-bg rounded-md mt-2 mb-4">
                            <SelectValue placeholder="代理店販売を選択してください" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="true" className="text-red-500">
                              O
                            </SelectItem>
                            <SelectItem value="false" className="text-red-500">
                              X
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
                >
                  {isCreatingBrand ? "作成中..." : "OK"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>

      {/* Update brand dialog */}
      <Dialog open={openUpdateBrand} onOpenChange={setOpenUpdateBrand}>
        <Form {...updateForm}>
          <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
            <form onSubmit={updateForm.handleSubmit(handleUpdateBrand)}>
              <DialogHeader>
                <DialogTitle>更新ブランド</DialogTitle>
                <DialogDescription className="mt-2 space-y-4">
                  {/* ブランド名 */}
                  <FormInputComponent
                    control={updateForm.control}
                    name="name"
                    label="ブランド名"
                    placeholder="ブランド名を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />

                  {/* 	製造元会社 */}
                  <FormInputComponent
                    control={updateForm.control}
                    name="manufacture"
                    label="製造元会社"
                    placeholder="製造元会社を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />

                  {/* 	販売元会社 */}
                  <FormInputComponent
                    control={updateForm.control}
                    name="seller"
                    label="販売元会社"
                    placeholder="販売元会社を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />

                  {/* 代理店販売 */}
                  <div>
                    <FormLabel htmlFor="contractStartDate">
                      代理店販売{" "}
                      <span className="text-required text-xl">*</span>
                    </FormLabel>
                    <FormField
                      control={updateForm.control}
                      name="isFcShow"
                      render={({ field }) => (
                        <Select
                          value={field.value ? "true" : "false"}
                          onValueChange={(val) =>
                            field.onChange(val === "true")
                          }
                        >
                          <SelectTrigger className="w-full border border-white-bg rounded-md mt-2 mb-4">
                            <SelectValue placeholder="代理店販売を選択してください" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="true" className="text-red-500">
                              O
                            </SelectItem>
                            <SelectItem value="false" className="text-red-500">
                              X
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
                  disabled={!updateForm.formState.isValid}
                >
                  {isUpdatingBrand ? "更新中..." : "OK"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>

      <ServerActionLoadingComponent
        loading={changeStatusLoading || isUpdatingBrand || isCreatingBrand}
        message={
          changeStatusLoading
            ? "ブランドの状況を変更しています"
            : isUpdatingBrand
              ? "ブランドを更新しています"
              : "ブランドを登録しています"
        }
      />
    </section>
  );
};

export default BrandsPage;
