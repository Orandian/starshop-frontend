"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils";
import { toast } from "sonner";
import { useFcPendingUsers, useUpdateFcUserStatus } from "@/hooks/admin/useFc";
import { FCPendingUser } from "@/types/admin/fcUser.type";




const FCApprovalsPage = () => {
  const router = useRouter();
  const [selectedFcId, setSelectedFcId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(-1);
  const [amount, setAmount] = useState<number>(0);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  
  const { data: fcUsers, isPending, refetch } = useFcPendingUsers();
  const { mutate: updateStatus, isSuccess } = useUpdateFcUserStatus(selectedFcId, selectedStatus, amount);

  
  const handleStatusChange = (requestId: number, newStatus: number, amount : number) => {
    setSelectedFcId(requestId);
    setSelectedStatus(newStatus);
    setAmount(amount);
    setShouldUpdate(true);
  };

  // Trigger mutation after state updates
  useEffect(() => {
    if (shouldUpdate && selectedFcId !== 0) {
      updateStatus();
      setShouldUpdate(false);
    }
  }, [shouldUpdate, selectedFcId, selectedStatus, updateStatus]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      const statusText = selectedStatus === 1 ? "承認" : "却下";
      toast.success(`申請を${statusText}しました`);
      refetch(); // Refetch the list after status change
    }
  }, [isSuccess, selectedStatus, refetch]);




  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2 flex items-center gap-3">
            <h2>代理店承認</h2>
            
            <div className="flex gap-4 items-center">
              <Button
                className="w-28 flex justify-center items-center text-white rounded-full text-sm hover:bg-dark bg-black"
              >
                承認待ち
              </Button>

              <Button
                className="w-28 flex justify-center items-center  rounded-full text-sm bg-transparent border border-black text-black hover:bg-black/20"
                onClick={() => router.push("/admin/fc-functions/fc-approvals/history")}
              >
                承認履歴
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 mb-1">
          <p className="text-sm my-3 mb-5">{fcUsers?.length}件</p>
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
                  申請プラン
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  申請日
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs uppercase">
                  支払い方法
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  支払い金額
                </TableHead>
                <TableHead className="px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  ステータス
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={7} className="h-10 text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : fcUsers && fcUsers.length > 0 ? (
                fcUsers.map((fc: FCPendingUser, index: number) => (
                  <TableRow
                    key={fc.fcId}
                    className="border-b border-black/10 hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-3">{index + 1}</TableCell>
                    <TableCell className="px-6 py-3">{fc.username}</TableCell>
                    <TableCell className="px-6 py-3">
                      
                        {fc.planName}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {formatDate(fc.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-3">{fc.paymentType === 1 ? '銀行振込' : 'クレジットカード払い'}</TableCell>
                    <TableCell className="px-6 py-3 text-right">¥{fc.totalPrice.toLocaleString("ja-JP")}</TableCell>
                    <TableCell
                      className="px-6 py-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="rounded-[30px] text-xs cursor-pointer w-[100px] text-white bg-yellow-500 hover:bg-yellow-600"
                          >
                            {"申請中"}
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
                                  handleStatusChange(fc.fcId, 1, fc.totalPrice)
                                }
                              >
                                承認
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                onClick={() =>
                                  handleStatusChange(fc.fcId, 2, fc.totalPrice)
                                }
                              >
                                却下
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-3 text-center text-sm text-gray-500">
                        レコードがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default FCApprovalsPage;
