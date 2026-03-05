"use client";

import PaginationComponent from "@/components/app/PaginationComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllUsers, useUpdateUser } from "@/hooks/admin/useSetting";
import {
  AdminUpdateUserRequest,
  AdminUserData,
} from "@/types/admin/setting.type";
import { encryptString, formatDate } from "@/utils";
import { ChevronDown, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";

const AdminPermissionsPage = () => {
  const router = useRouter();
  const [admins, setAdmin] = useState<AdminUserData[]>([]);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllUsers(page, 10);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = data?.data?.pagination.totalElements || 0;

  useEffect(() => {
    if (data?.data?.data) {
      setAdmin(data?.data?.data);
    }
  }, [data]);

  const handleStatusChange = (adminId: number, newStatus: number) => {
    // TODO: Replace with actual API call

    const currentAdmin = admins.find((admin) => admin.userId === adminId);
    if (!currentAdmin) {
      toast.error("管理者が見つかりません");
      return;
    }

    const updateData: AdminUpdateUserRequest = {
      username: currentAdmin.username,
      usernameKana: currentAdmin.usernameKana,
      email: currentAdmin.email,
      password: currentAdmin.password,
      phoneNumber: currentAdmin.phoneNumber,
      status: newStatus,
    };
    updateUser(
      { id: adminId, data: updateData },
      {
        onSuccess: () =>
          toast.success(`ステータスを「${newStatus}」に変更しました`),
      },
    );
    // Refetch data here
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2">
            <h2>管理者権限</h2>
          </div>
          <Button
            onClick={() => router.push("/admin/settings/admin-permissions/new")}
            className="bg-primary hover:bg-primary/80 text-white rounded-md px-3 py-2"
          >
            <CirclePlus className="w-4 h-4" />
            新規作成
          </Button>
        </div>

        <div className="flex justify-between items-center gap-2 mb-5">
          <p className="text-sm"> {total ? total : 0}件</p>
        </div>

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  No
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  ユーザー名
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  メールアドレス
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  電話番号
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  最終ログイン
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  作成日
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  更新日
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  ステータス
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={9} className="h-10 text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : admins.length > 0 ? (
                admins.map((admin, index) => (
                  <TableRow
                    key={admin.userId}
                    className="border-b border-black/10 hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-3">
                      {(page - 1) * (pagination?.pageSize || 0) + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {admin.username}
                    </TableCell>
                    <TableCell className="px-6 py-3">{admin.email}</TableCell>
                    <TableCell className="px-6 py-3">
                      {admin.phoneNumber}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {admin.lastLogin ? formatDate(admin.lastLogin) : "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {formatDate(admin.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {formatDate(admin.updatedAt)}
                    </TableCell>
                    <TableCell
                      className="px-6 py-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              admin.status === 1
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-primary hover:bg-primary/80"
                            }`}
                          >
                            {admin.status === 1 ? "有効" : "無効"}
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
                                  handleStatusChange(admin.userId, 1)
                                }
                              >
                                有効
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-primary text-white cursor-pointer w-[100px] py-2 hover:bg-primary/80"
                                onClick={() =>
                                  handleStatusChange(admin.userId, 0)
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
                            `/admin/settings/admin-permissions/${encryptString(admin.userId.toString())}`,
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
                  <TableCell colSpan={9} className="h-24 text-center">
                    管理者がいません
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
        loading={isUpdating}
        message="お客様のステータスを変更中..."
      />
    </section>
  );
};

export default AdminPermissionsPage;
