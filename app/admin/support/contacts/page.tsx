"use client";
import PaginationComponent from "@/components/app/PaginationComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { useGetContactUs } from "@/hooks/admin/useSetting";
import { dateArrayToString } from "@/utils";
import { useState } from "react";

const ContactsPage = () => {
  const [page, setPage] = useState(1);
  const { data: contactsData, isLoading } = useGetContactUs(page, 10);

  const pagination = contactsData?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = contactsData?.data?.pagination.totalElements || 0;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2">
            <h2>お問い合わせ管理</h2>
          </div>
        </div>

        {/* Count */}
        <div className="flex justify-between items-center gap-2 mb-5">
          <p className="text-sm">{total ? total : 0}件</p>
        </div>

        {/* Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10 bg-white">
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  No
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  氏名
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  メールアドレス
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  電話番号
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  件名
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  お問い合わせ内容
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  受信日時
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                contactsData?.data?.data &&
                contactsData?.data?.data.map((contact, index) => (
                  <TableRow
                    key={contact.contactId}
                    className="border-b border-black/10 hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-3 text-center">
                      {(page - 1) * (pagination?.pageSize || 0) + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-3 font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell className="px-6 py-3">{contact.email}</TableCell>
                    <TableCell className="px-6 py-3">
                      {contact.phoneNumber}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {contact.subject}
                    </TableCell>
                    <TableCell className="px-6 py-3 max-w-md whitespace-normal">
                      {truncateText(contact.body, 50)}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {dateArrayToString(contact.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm cursor-pointer"
                          >
                            詳細
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
                              お問い合わせ詳細
                            </DialogTitle>
                          </DialogHeader>
                          <DialogDescription asChild>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-4 items-start gap-4">
                                <div className="font-semibold text-gray-700">
                                  氏名:
                                </div>
                                <div className="col-span-3 text-gray-900">
                                  {contact.name}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4">
                                <div className="font-semibold text-gray-700">
                                  メールアドレス:
                                </div>
                                <div className="col-span-3 text-gray-900">
                                  {contact.email}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4">
                                <div className="font-semibold text-gray-700">
                                  電話番号:
                                </div>
                                <div className="col-span-3 text-gray-900">
                                  {contact.phoneNumber}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4">
                                <div className="font-semibold text-gray-700">
                                  件名:
                                </div>
                                <div className="col-span-3 text-gray-900">
                                  {contact.subject}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4">
                                <div className="font-semibold text-gray-700">
                                  受信日時:
                                </div>
                                <div className="col-span-3 text-gray-900">
                                  {dateArrayToString(contact.createdAt)}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4 border-t pt-4">
                                <div className="font-semibold text-gray-700">
                                  お問い合わせ内容:
                                </div>
                                <div className="col-span-3 text-gray-900 whitespace-pre-wrap">
                                  {contact.body}
                                </div>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={8} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && contactsData?.data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    お問い合わせがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading &&
          pagination &&
          totalPages > 0 &&
          total > pagination?.pageSize && (
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
    </section>
  );
};

export default ContactsPage;
