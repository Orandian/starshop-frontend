"use client";

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
  useCategoryList,
  useChangeCategoryStatus,
  useCreateCategory,
  useUpdateCategory,
  useParentCategories,
} from "@/hooks/admin/useCategory";
import { CategoryItem } from "@/types/admin/category.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ChevronDown, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const CategoryPage = () => {
  const [pageSize] = useState(10); // Page size
  const [page, setPage] = useState(1); // Page

  const [isActive, setIsActive] = useState(""); // Status
  const [searchIsActive, setSearchIsActive] = useState("all"); // Search status
  const [parentId, setParentId] = useState("all"); // Parent ID
  const [searchParentId, setSearchParentId] = useState(""); // Search parent ID
  const [categoryId, setCategoryId] = useState(0); // Category ID

  const [openNewCategory, setOpenNewCategory] = useState(false); // Open new category
  const [openUpdateCategory, setOpenUpdateCategory] = useState(false); // Open update category
  const [updateCategoryId, setUpdateCategoryId] = useState(0); // Update category id

  // Mutations for category status change
  const {
    mutate: changeStatus,
    isPending: changeStatusLoading,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
  } = useChangeCategoryStatus();

  // Get categories
  const {
    data: categories,
    isLoading,
    error,
    isError,
    refetch,
  } = useCategoryList(page, pageSize, searchIsActive, searchParentId);

  // Mutations for category creation
  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateCategory();

  // Mutations for category update
  const { mutate: updateCategory, isPending: isUpdatingCategory } =
    useUpdateCategory();

  // Total categories
  const total = categories?.data?.pagination.totalElements || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Form schema
  const FormSchema = z.object({
    name: z.string().min(1, "カテゴリ名は必須です"),
    description: z.string().min(1, "説明は必須です"),
    parentCategoryId: z.number().nullable().optional(),
  });

  // Form state for create
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategoryId: null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Form state for update
  const updateForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategoryId: null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Get parent categories for parent selection
  const { data: parentCategories } = useParentCategories();

  // Handle search categories
  const handleSearch = () => {
    setPage(1);
    setSearchIsActive(isActive === "all" ? "" : isActive);
    setSearchParentId(parentId === "all" ? "" : parentId);
  };

  // Handle status change
  const handleStatusChange = (categoryId: number, categoryStatus: boolean) => {
    changeStatus(
      { categoryId, status: categoryStatus },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      },
    );
  };

  // Handle create category
  const handleCreateCategory = (data: z.infer<typeof FormSchema>) => {
    createCategory(
      {
        name: data.name,
        description: data.description,
        parentCategoryId: data.parentCategoryId,
        isActive: true,
      },
      {
        onSuccess: () => {
          setOpenNewCategory(false);
          toast.success("カテゴリを追加しました");
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      },
    );
  };

  // Handle update category
  const handleUpdateCategory = (data: z.infer<typeof FormSchema>) => {
    updateCategory(
      {
        categoryId: updateCategoryId,
        name: data.name,
        description: data.description,
        parentCategoryId: data.parentCategoryId,
        isActive: true,
      },
      {
        onSuccess: () => {
          setOpenUpdateCategory(false);
          toast.success("カテゴリを更新しました");
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      },
    );
  };

  // Handle error
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

  const resetFilters = () => {
    setPage(1);
    setIsActive("all");
    setParentId("all");
    setSearchIsActive("");
    setSearchParentId("");
    refetch();
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>カテゴリ一覧</h2>
          </div>
          <Button
            onClick={() => setOpenNewCategory(true)}
            className="bg-primary hover:bg-primary/80 text-white rounded-md px-3 py-2"
          >
            <CirclePlus className="w-4 h-4" />
            新規作成
          </Button>
        </div>

        {/* Filter Section */}
        <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 w-full">
              {/* 親カテゴリ */}
              <div>
                <span className="text-sm">商品分類</span>
                <Select
                  value={parentId}
                  onValueChange={(value) => setParentId(value)}
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="親カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">すべて</SelectItem>
                    {parentCategories?.data?.map((cat: CategoryItem) => (
                      <SelectItem
                        key={cat.categoryId}
                        value={cat.categoryId.toString()}
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 状況 */}
              <div>
                <span className="text-sm">ステータス</span>
                <Select
                  value={isActive}
                  onValueChange={(value) => setIsActive(value)}
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="状況を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="true">有効</SelectItem>
                    <SelectItem value="false">無効</SelectItem>
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

        <div className="flex justify-between items-center gap-2 mb-1 ">
          <p className="text-sm my-3 mb-5">{total ? total : 0}件</p>
        </div>

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                  商品分類
                </TableHead>
                <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                  詳細
                </TableHead>
                <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                  備考
                </TableHead>
                <TableHead className="text-center py-3 px-6 font-bold text-black text-xs uppercase">
                  ステータス
                </TableHead>
                <TableHead className="text-center py-3 px-6 font-bold text-black text-xs uppercase">
                  設定
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.data &&
                categories?.data &&
                categories?.data?.data.length > 0 &&
                categories?.data.data.map((category: CategoryItem) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                    key={category.categoryId}
                  >
                    <TableCell className="py-4 px-4">
                      {category.name || "N/A"}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {category.parentCategoryName || "-"}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {category.description || "N/A"}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              category.isActive
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-disabled hover:bg-disabled/80"
                            }`}
                            onClick={() => {
                              setCategoryId(category.categoryId || 0);
                            }}
                          >
                            {category.isActive ? "有効" : "無効"}
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
                                  handleStatusChange(categoryId, true);
                                }}
                              >
                                有効
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-disabled text-white cursor-pointer w-[100px] py-2 hover:bg-disabled/80"
                                onClick={() => {
                                  handleStatusChange(categoryId, false);
                                }}
                              >
                                無効
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Button
                        onClick={() => {
                          setOpenUpdateCategory(true);
                          setUpdateCategoryId(category.categoryId);
                          updateForm.reset({
                            name: category.name || "",
                            description: category.description || "",
                            parentCategoryId: category.parentCategoryId || null,
                          });
                        }}
                        className="bg-primary hover:bg-primary/80 text-white text-xs px-4 py-2 rounded-md"
                      >
                        編集
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && categories?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    カテゴリがありません
                  </TableCell>
                </TableRow>
              )}
              {isLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={5} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading &&
          categories?.data &&
          categories?.data?.data?.length > 0 &&
          total &&
          total > pageSize && (
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

      <ServerActionLoadingComponent
        loading={changeStatusLoading}
        message="カテゴリの状態を変更しています"
      />

      {/* Create new category dialog */}
      <Dialog open={openNewCategory} onOpenChange={setOpenNewCategory}>
        <Form {...form}>
          <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
            <form onSubmit={form.handleSubmit(handleCreateCategory)}>
              <DialogHeader>
                <DialogTitle>新規カテゴリ</DialogTitle>
                <DialogDescription className="mt-2 space-y-4">
                  {/* カテゴリ名 */}
                  <FormInputComponent
                    control={form.control}
                    name="name"
                    label="商品分類"
                    placeholder="商品分類を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />

                  {/* 親カテゴリ */}
                  <div>
                    <FormLabel htmlFor="parentCategoryId">詳細</FormLabel>
                    <FormField
                      control={form.control}
                      name="parentCategoryId"
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString() || "null"}
                          onValueChange={(val) =>
                            field.onChange(val === "null" ? null : Number(val))
                          }
                        >
                          <SelectTrigger className="w-full border border-white-bg rounded-md mt-2 mb-4">
                            <SelectValue placeholder="詳細を選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="null">なし</SelectItem>
                            {parentCategories?.data?.map((cat) => (
                              <SelectItem
                                key={cat.categoryId}
                                value={cat.categoryId.toString()}
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* 説明 */}
                  <div>
                    <FormLabel htmlFor="description">
                      備考 <span className="text-required text-xl">*</span>
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <textarea
                          {...field}
                          placeholder="備考を入力"
                          className="w-full border border-white-bg rounded-md mt-2 mb-4 p-2 text-xs min-h-[100px] resize-none"
                        />
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
                  {isCreatingCategory ? "作成中..." : "OK"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>

      {/* Update category dialog */}
      <Dialog open={openUpdateCategory} onOpenChange={setOpenUpdateCategory}>
        <Form {...updateForm}>
          <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
            <form onSubmit={updateForm.handleSubmit(handleUpdateCategory)}>
              <DialogHeader>
                <DialogTitle>更新カテゴリ</DialogTitle>
                <DialogDescription className="mt-2 space-y-4">
                  {/* カテゴリ名 */}
                  <FormInputComponent
                    control={updateForm.control}
                    name="name"
                    label="商品分類"
                    placeholder="商品分類を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />

                  {/* 親カテゴリ */}
                  <div>
                    <FormLabel htmlFor="parentCategoryId">詳細</FormLabel>
                    <FormField
                      control={updateForm.control}
                      name="parentCategoryId"
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString() || "null"}
                          onValueChange={(val) =>
                            field.onChange(val === "null" ? null : Number(val))
                          }
                        >
                          <SelectTrigger className="w-full border border-white-bg rounded-md mt-2 mb-4">
                            <SelectValue placeholder="詳細を選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="null">なし</SelectItem>
                            {parentCategories?.data?.map((cat) => (
                              <SelectItem
                                key={cat.categoryId}
                                value={cat.categoryId.toString()}
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* 説明 */}
                  <div>
                    <FormLabel htmlFor="description">
                      備考 <span className="text-required text-xl">*</span>
                    </FormLabel>
                    <FormField
                      control={updateForm.control}
                      name="description"
                      render={({ field }) => (
                        <textarea
                          {...field}
                          placeholder="備考を入力"
                          className="w-full border border-white-bg rounded-md mt-2 mb-4 p-2 text-xs min-h-[100px] resize-none"
                        />
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
                  {isUpdatingCategory ? "更新中..." : "OK"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>
    </section>
  );
};

export default CategoryPage;
