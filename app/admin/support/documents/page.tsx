"use client";

import AdminDatePicker from "@/components/admin/AdminDatePicker";
import PaginationComponent from "@/components/app/PaginationComponent";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
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
import {
  useCreateDocument,
  useDocuments,
  useUpdateDocument,
} from "@/hooks/admin/useDocuments";
import { cn } from "@/lib/utils";
import {
  Document,
  DocumentCreateRequest,
  DocumentUpdateRequest,
} from "@/types/documents/document.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronDown, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Form schema validation for new document
const FormSchema = z.object({
  document_name: z.string().min(1, "書類名は必須です"),
  document_type: z.string().min(1, "書類タイプは必須です"),
  brand_id: z.string().min(1, "ブランドは必須です"),
  document_file: z.any().refine((val) => {
    if (val instanceof FileList) return val.length > 0;
    if (typeof val === "string") return val.length > 0;
    return false;
  }, "ファイルを選択してください"),
  status: z.string().min(1, "ステータスは必須です"),
});

const DocumentsPage = () => {
  const router = useRouter();
  const [pageSize] = useState(10); // Page size
  const [page, setPage] = useState(1); // Page
  const [filterValues, setFilterValues] = useState({
    documentName: "",
    documentDate: "",
    brandId: "",
    status: "",
  });

  const [searchValues, setSearchValues] = useState({
    documentName: "",
    documentDate: "",
    brandId: "",
    status: "",
  });

  const [openNewDialog, setOpenNewDialog] = useState(false); // Open new document dialog
  const [documentId, setDocumentId] = useState(0); // Document ID
  //const [statusChange,setStatusToChange] = useState(false); // Status to change
  const [fileName, setFileName] = useState<string>(""); // Store selected file name
  const [isEditMode, setIsEditMode] = useState(false);

  // Create document mutation
  const {
    mutate: createDocument,
    error: createDocumentError,
    isSuccess: createDocumentSuccess,
    isPending: isCreatingDocument,
  } = useCreateDocument();

  const {
    mutate: updateDocument,
    error: updateDocumentError,
    isSuccess: updateDocumentSuccess,
    isPending: isUpdatingDocument,
  } = useUpdateDocument();

  // Get documents
  const {
    data: documents,
    isLoading,
    error,
    isError,
    refetch,
  } = useDocuments(
    page,
    pageSize,
    searchValues.documentName,
    searchValues.status,
    searchValues.documentDate,
    searchValues.brandId,
  );

  const { data: brandsData, isLoading: isbrandLoading } = useBrands(1, 0);

  const brandOptions =
    brandsData?.data?.data
      .filter((brand) => brand.isActive)
      .map((brand) => ({ label: brand.name, value: brand.brandId })) || [];

  // Form state for new document
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      document_name: "",
      brand_id: "",
      document_type: "",
      document_file: undefined,
      status: "",
    },
  });

  // Total documents
  const total = documents?.data?.pagination?.totalElements || 0;
  const totalPages =
    documents?.data?.pagination?.totalPages || Math.ceil(total / pageSize);

  // Handle search documents
  const handleSearch = () => {
    setPage(1);
    setSearchValues({
      documentName: filterValues.documentName,
      documentDate: filterValues.documentDate,
      status: filterValues.status,
      brandId: filterValues.brandId,
    });
  };

  const handleResetSearch = () => {
    setPage(1);
    setFilterValues({
      documentName: "",
      documentDate: "",
      status: "",
      brandId: "",
    });
    setSearchValues({
      documentName: "",
      documentDate: "",
      status: "",
      brandId: "",
    });
    refetch();
  };

  // Handle status change
  const handleStatusChange = (documentStatus: boolean) => {
    //setStatusToChange(documentStatus);

    const payload: DocumentUpdateRequest = {
      docId: documentId,
      docStatus: documentStatus ? 0 : 1,
    };

    updateDocument(payload, {
      onSuccess: () => {
        toast.success("書類のステータスを変更しました");
        refetch();
      },
    });

    // changeStatus();
  };

  // Handle file selection
  // Change the handleFileSelect function to:
  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        form.setError("document_file", {
          type: "manual",
          message: "ファイルを選択してください",
        });
        return;
      }

      // Validate file type
      if (file.type !== "application/pdf") {
        form.setError("document_file", {
          type: "manual",
          message: "PDFファイルのみアップロード可能です。",
        });
        return;
      }

      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        form.setError("document_file", {
          type: "manual",
          message: "ファイルサイズは50MB以下にしてください。",
        });
        return;
      }

      setFileName(file.name);
      if (target.files) {
        form.setValue("document_file", target.files);
      }
      form.clearErrors("document_file");
    };
    input.click();
  };

  const handleRowClick = (document: Document) => {
    setDocumentId(document.docId || 0);
    setIsEditMode(true);
    form.reset({
      document_name: document.docName || "",
      document_type: document.docType?.toString() || "",
      status: document.docStatus?.toString() || "0",
      brand_id: document.brand.brandId.toString() || "",
      document_file: document.docPath, // Just pass the full path as a string
    });
    setFileName(document.docPath.split("/").pop() || ""); // Show just the filename
    setOpenNewDialog(true);
  };

  // Form submit handler for new document
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const isNewFile =
      data.document_file instanceof FileList && data.document_file.length > 0;

    if (documentId) {
      // Update existing document
      const fileList = data.document_file as FileList;
      const payload: DocumentUpdateRequest = {
        docId: documentId,
        docName: data.document_name,
        docType: Number(data.document_type),
        docStatus: Number(data.status),
        brandId: Number(data.brand_id),
        file: isNewFile ? Array.from(fileList) : undefined,
      };

      updateDocument(payload, {
        onSuccess: () => {
          toast.success("書類を更新しました");
          refetch();
          handleCloseNewDialog();
        },
        onError: (error) => {
          toast.error("更新に失敗しました");
          console.error(error);
        },
      });
    } else {
      // For new documents, we must have a file
      if (!isNewFile) {
        toast.error("新しいファイルを選択してください");
        return;
      }

      const fileList = data.document_file as FileList;

      const payload: DocumentCreateRequest = {
        docName: data.document_name,
        docType: Number(data.document_type),
        docStatus: Number(data.status),
        brandId: Number(data.brand_id),
        file: Array.from(fileList),
      };

      createDocument(payload, {
        onSuccess: () => {
          toast.success("書類を登録しました");
          refetch();
          handleCloseNewDialog();
        },
        onError: (error) => {
          toast.error("登録に失敗しました");
          console.error(error);
        },
      });
    }
  };

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
    setDocumentId(0);
    setIsEditMode(false);
    form.reset({
      document_name: "",
      document_type: "",
      status: "",
      brand_id: "",
      document_file: undefined,
    });
    setFileName("");
  };

  // Handle error
  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }

    if (updateDocumentError) {
      toast.error(updateDocumentError?.message);
    }

    // if (updateDocumentSuccess) {
    //   toast.success(updateDocumentData?.data?.message);
    //   refetch();
    // }

    if (createDocumentSuccess) {
      setOpenNewDialog(false);
      form.reset();
      setFileName("");
      refetch();
    }

    if (createDocumentError) {
      toast.error(createDocumentError.message);
    }
  }, [
    isError,
    error,
    updateDocumentSuccess,
    createDocumentSuccess,
    createDocumentError,
    updateDocumentError,
    refetch,
    form,
  ]);

  // useEffect(() => {
  //   if (documents?.data) {
  //     // setStatus(documents?.data?.data?.docStatus);
  //   }
  // }, [documents]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="  flex  items-center  gap-4 text-left">
            <h2>ドキュメント管理</h2>

            <div className="flex gap-4  items-center">
              <Button
                className={`w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-dark bg-black`}
              >
                ドキュメント
              </Button>

              <Button
                className={`w-28  flex justify-center items-center rounded-full text-sm bg-transparent border border-black text-black hover:bg-black/20`}
                onClick={() =>
                  router.push("/admin/support/documents/contracts")
                }
              >
                契約書
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setOpenNewDialog(true)}
            className="bg-primary hover:bg-primary/80 text-white rounded-md px-3 py-2"
          >
            <CirclePlus className="w-4 h-4" />
            新規作成
          </Button>
        </div>

        {/* Filter & Search */}
        {/* Filter Section */}
        <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              {/* 登録日時 */}
              <div>
                <span className="text-sm">登録日時</span>
                <AdminDatePicker
                  value={filterValues.documentDate}
                  onChange={(date) =>
                    setFilterValues({ ...filterValues, documentDate: date })
                  }
                  styleName="w-full border border-white-bg rounded-md mt-2 mb-4"
                />
              </div>

              {/* 書類名 */}
              <div>
                <span className="text-sm">書類名</span>
                <Input
                  value={filterValues.documentName}
                  onChange={(e) =>
                    setFilterValues({
                      ...filterValues,
                      documentName: e.target.value,
                    })
                  }
                  placeholder="書類名を入力"
                  className="mt-2 text-sm border border-white-bg rounded-md p-2"
                />
              </div>

              {/* ブランド */}
              <div>
                <span className="text-sm">ブランド</span>
                <Select
                  value={filterValues.brandId}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, brandId: value })
                  }
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="ブランドを選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {brandOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ステータス */}
              <div>
                <span className="text-sm">ステータス</span>
                <Select
                  value={filterValues.status}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, status: value })
                  }
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0">公開</SelectItem>
                    <SelectItem value="1">非公開</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleResetSearch}
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

        {/* Count */}
        <div className="flex justify-between items-center gap-2 mb-1 ">
          <p className="text-sm my-3 mb-5">{total ? total : 0}件</p>
        </div>
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10 ">
                <TableHead className="w-[150px] py-3 px-6 uppercase text-xs font-bold text-black">
                  書類タイプ
                </TableHead>
                <TableHead className="py-3 px-6 uppercase text-xs font-bold text-black ">
                  書類名
                </TableHead>
                <TableHead className="py-3 px-6 uppercase text-xs font-bold text-black ">
                  ブランド名
                </TableHead>
                <TableHead className="w-[200px] py-3 px-6 uppercase text-xs font-bold text-black">
                  登録日時
                </TableHead>
                <TableHead className="text-center w-[150px] py-3 px-6 uppercase text-xs font-bold text-black">
                  ステータス
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents?.data &&
                documents?.data?.data?.length > 0 &&
                documents?.data?.data.map((document: Document) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                    key={document.docId}
                  >
                    <TableCell
                      className="py-3 px-6 cursor-pointer"
                      onClick={() => handleRowClick(document)}
                      // onClick={() =>
                      //   router.push(
                      //     `/admin/documents/${encryptString(
                      //       document.docId.toString()
                      //     )}`
                      //   )
                      // }
                    >
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium  text-white",
                          document.docType === 1
                            ? "bg-[#9399D4]"
                            : "bg-[#9F9F9F]",
                        )}
                      >
                        {document.docType === 1 ? "化粧品書類" : "その他"}
                      </span>
                    </TableCell>
                    <TableCell
                      className="py-3 px-6 cursor-pointer"
                      onClick={() => handleRowClick(document)}
                      // onClick={() =>
                      //   router.push(
                      //     `/admin/documents/${encryptString(
                      //       document.docId.toString()
                      //     )}`
                      //   )
                      // }
                    >
                      {document.docName}
                    </TableCell>
                    <TableCell
                      className="py-3 px-6 cursor-pointer"
                      onClick={() => handleRowClick(document)}
                      // onClick={() =>
                      //   router.push(
                      //     `/admin/documents/${encryptString(
                      //       document.docId.toString()
                      //     )}`
                      //   )
                      // }
                    >
                      {document.brand?.name || "-"}
                    </TableCell>
                    <TableCell
                      className="py-3 px-6 cursor-pointer"
                      onClick={() => handleRowClick(document)}
                      // onClick={() =>
                      //   router.push(
                      //     `/admin/documents/${encryptString(
                      //       document.docId.toString()
                      //     )}`
                      //   )
                      // }
                    >
                      {document.createdAt &&
                        format(
                          new Date(
                            document.createdAt[0] || 0, // year
                            (document.createdAt[1] || 1) - 1, // month (0-11)
                            document.createdAt[2] || 1, // day
                            document.createdAt[3] || 0, // hours
                            document.createdAt[4] || 0, // minutes
                            document.createdAt[5] || 0, // seconds
                            document.createdAt[6] || 0, // milliseconds
                          ),
                          "yyyy/MM/dd HH:mm",
                          { locale: ja },
                        )}
                    </TableCell>
                    <TableCell className="text-center py-3 px-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              document.docStatus === 0
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              // setStatusToChange(
                              //   document.docStatus === 0 ? true : false
                              // );
                              setDocumentId(document.docId || 0);
                            }}
                          >
                            {document.docStatus === 0 ? "公開" : "非公開"}
                            <ChevronDown size={15} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                          <DialogHeader>
                            <DialogTitle>ステータス変更</DialogTitle>
                            <DialogDescription className="w-full flex items-center justify-center gap-4 border-y border-black/10 py-8 mt-2">
                              <DialogClose
                                type="button"
                                className={`rounded-md text-xs w-[100px] py-2 bg-tertiary cursor-pointer text-white border-tertiary hover:bg-tertiary/80`}
                                onClick={() => {
                                  //setStatusToChange(true);
                                  handleStatusChange(true);
                                }}
                              >
                                公開
                              </DialogClose>
                              <DialogClose
                                type="button"
                                className={`rounded-md text-xs w-[100px] py-2 bg-secondary cursor-pointer text-white border-secondary hover:bg-secondary/80`}
                                onClick={() => {
                                  //setStatusToChange(false);
                                  handleStatusChange(false);
                                }}
                              >
                                非公開
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                          {/* <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                onClick={() =>
                                  handleStatusChange(statusToChange)
                                }
                                className="text-xs bg-additional text-white cursor-pointer w-[100px] ml-auto hover:bg-additional/80"
                              >
                                {isUpdatingDocument ? (
                                  <LoadingIndicator size="sm" />
                                ) : (
                                  "OK"
                                )}
                              </Button>
                            </DialogClose>
                          </DialogFooter> */}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && documents?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    書類がありません
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
          documents?.data &&
          documents?.data?.pagination?.totalPages > 0 &&
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

      {/* New Document Dialog */}
      <Dialog open={openNewDialog} onOpenChange={handleCloseNewDialog}>
        <DialogOverlay className="bg-transparent" />
        <DialogContent className="sm:max-w-2xl bg-white border border-white-bg rounded-md">
          <DialogHeader>
            <DialogTitle>{documentId ? "書類編集" : "書類登録"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-6">
                {/* 書類名 */}
                <div className="flex flex-col">
                  <FormInputComponent
                    control={form.control}
                    name="document_name"
                    label="書類名"
                    placeholder="書類名を入力"
                    //required
                    className="placeholder:text-sm bg-white border border-black/10 rounded-md p-2 text-xs"
                  />
                </div>

                {/* ブランド */}
                <div className="flex flex-col">
                  <p className="text-sm mb-1.5 text-black">
                    ブランド <span className="text-[#FF0000]">*</span>
                  </p>
                  <Controller
                    control={form.control}
                    name="brand_id"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full border border-black/10 rounded-md p-2">
                          <SelectValue placeholder="ブランドを選択" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {brandOptions?.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value.toString()}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.brand_id && (
                    <p className="text-xs text-[#FF0000] mt-1">
                      {form.formState.errors.brand_id?.message}
                    </p>
                  )}
                </div>

                {/* 書類タイプ */}
                <div className="flex flex-col">
                  <p className="text-sm mb-1.5 text-black">
                    書類タイプ <span className="text-[#FF0000]">*</span>
                  </p>
                  <Controller
                    control={form.control}
                    name="document_type"
                    disabled={isbrandLoading}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full border border-black/10 rounded-md p-2">
                          <SelectValue placeholder="書類タイプを選択" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="1">化粧品書類</SelectItem>
                          <SelectItem value="2">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.document_type && (
                    <p className="text-xs text-[#FF0000] mt-1">
                      {form.formState.errors.document_type?.message}
                    </p>
                  )}
                </div>

                {/* 書類 */}
                <div className="flex flex-col">
                  <p className="text-sm mb-1.5 text-black">
                    書類 <span className="text-[#FF0000]">*</span>
                  </p>
                  <Controller
                    control={form.control}
                    name="document_file"
                    render={({ field: { value, ...field } }) => (
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Input
                            {...field}
                            value={
                              fileName ||
                              (isEditMode && typeof value === "string"
                                ? value.split("/").pop()
                                : "")
                            }
                            readOnly
                            accept=".pdf"
                            placeholder={
                              isEditMode && !fileName
                                ? "現在のファイルを使用"
                                : "ファイルを選択してください"
                            }
                            className="flex-1 bg-white border border-black/10 rounded-r-none p-2 text-xs cursor-not-allowed"
                          />
                          <Button
                            type="button"
                            onClick={handleFileSelect}
                            className="bg-dark/40 hover:bg-gray-600 rounded-l-none text-black cursor-pointer px-6"
                          >
                            選択
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                  {form.formState.errors.document_file && (
                    <p className="text-xs text-[#FF0000] mt-1">
                      {String(
                        form.formState.errors.document_file.message || "",
                      )}
                    </p>
                  )}
                </div>

                {/* ステータス */}
                <div className="flex flex-col">
                  <p className="text-sm mb-1.5 text-black">
                    ステータス <span className="text-[#FF0000]">*</span>
                  </p>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full border border-black/10 rounded-md p-2">
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="0">公開</SelectItem>
                          <SelectItem value="1">非公開</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.status && (
                    <p className="text-xs text-[#FF0000] mt-1">
                      {form.formState.errors.status?.message}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="w-full bg-additional hover:bg-additional/90 text-white cursor-pointer px-20 py-4 rounded-md text-sm"
                  disabled={
                    isUpdatingDocument || isCreatingDocument || isbrandLoading
                  }
                >
                  {isUpdatingDocument ||
                  isCreatingDocument ||
                  isbrandLoading ? (
                    <LoadingIndicator size="sm" />
                  ) : (
                    "保存"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ServerActionLoadingComponent
        loading={isCreatingDocument}
        message="書類を登録しています"
      />

      <ServerActionLoadingComponent
        loading={isUpdatingDocument}
        message="書類の状態を変更しています"
      />
    </section>
  );
};

export default DocumentsPage;
