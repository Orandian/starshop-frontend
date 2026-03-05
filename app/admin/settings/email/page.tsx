"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { formatDate, encryptString } from "@/utils";
import { useGetAllMail, useUpdateMail } from "@/hooks/admin/useSetting";
import {
  AdminMailTemplate,
  AdminMailUpdateRequest,
} from "@/types/admin/setting.type";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, CirclePlus } from "lucide-react";
import PaginationComponent from "@/components/app/PaginationComponent";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import { toast } from "sonner";
const EmailSettingsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const [templates, setTemplates] = useState<AdminMailTemplate[]>([]);
  const { data, isLoading } = useGetAllMail(page, 10);

  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = data?.data?.pagination.totalElements || 0;
  const { mutateAsync: updateMail, isPending } = useUpdateMail();

  useEffect(() => {
    if (data?.data) {
      setTemplates(data.data.data);
    }
  }, [data]);

  const handleStatusChange = (templateId: number, newStatus: boolean) => {
    const currentTemplate = templates.find(
      (template) => template.templateId === templateId
    );
    if (!currentTemplate) {
      toast.error("テンプレートが見つかりません");
      return;
    }
    const updateMailPayload: AdminMailUpdateRequest = {
      templateName: currentTemplate.templateName,
      templateDescription: currentTemplate.templateDescription,
      isActive: newStatus,
    };
    updateMail(
      {
        id: currentTemplate.templateId.toString(),
        data: updateMailPayload,
      },
      {
        onSuccess: () => {
          toast.success("メールテンプレートを更新しました");
          // Refetch or update the local state to reflect the change
          setTemplates((prevTemplates) =>
            prevTemplates.map((template) =>
              template.templateId === templateId
                ? { ...template, isActive: newStatus ? 1 : 0 }
                : template
            )
          );
        },
      }
    );
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2">
            <h2>メール設定</h2>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 mb-5">
          <p className="text-sm">{total ? total : 0}件</p>
          <Button
            onClick={() => router.push("/admin/settings/email/new")}
            className="bg-primary hover:bg-primary/80 text-white rounded-md px-3 py-2"
          >
            <CirclePlus className="w-4 h-4" />
            新規作成
          </Button>
        </div>

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  No
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  テンプレート名
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  更新日
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  ステータス
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={10} className="h-10 text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : templates.length > 0 ? (
                templates
                  //.filter((template) => template.isActive)
                  .map((template, index) => (
                    <TableRow
                      key={template.templateId}
                      className="border-b border-black/10 hover:bg-black/2"
                    >
                      <TableCell className="px-6 py-3">
                        {(page - 1) * (pagination?.pageSize || 0) + index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        {template.templateName}
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        {formatDate(template.updatedAt)}
                      </TableCell>
                      <TableCell
                        className="px-6 py-3"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                                template.isActive === 1
                                  ? "bg-tertiary hover:bg-tertiary/80"
                                  : "bg-disabled hover:bg-disabled/80"
                              }`}
                            >
                              {template.isActive === 1 ? "有効" : "無効"}
                              <ChevronDown size={15} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                            <DialogHeader>
                              <DialogTitle>ステータス変更</DialogTitle>
                              <DialogDescription className="w-full flex items-center justify-center gap-4 border-y border-black/10 py-8 mt-2">
                                <DialogClose
                                  className="rounded-md text-xs bg-tertiary text-white cursor-pointer w-[100px] py-2 hover:bg-tertiary/80"
                                  onClick={() =>
                                    handleStatusChange(
                                      template.templateId,
                                      true
                                    )
                                  }
                                >
                                  有効
                                </DialogClose>
                                <DialogClose
                                  className="rounded-md text-xs bg-disabled text-white cursor-pointer w-[100px] py-2 hover:bg-disabled/80"
                                  onClick={() =>
                                    handleStatusChange(
                                      template.templateId,
                                      false
                                    )
                                  }
                                >
                                  無効
                                </DialogClose>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Button
                          onClick={() =>
                            router.push(
                              `/admin/settings/email/${encryptString(template.templateId.toString())}`
                            )
                          }
                          className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                        >
                          詳細
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    テンプレートがありません
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
        loading={isPending}
        message="メール設定のステータスを変更中..."
      />
    </section>
  );
};

export default EmailSettingsPage;
