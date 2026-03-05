"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetAdminConfirmedFcCustomers,
  useGetCustomerById,
} from "@/hooks/admin/useCustomer";
import PaginationComponent from "@/components/app/PaginationComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminConfirmFcUser } from "@/types/customers";
import { useCustomerStore } from "@/store/Admin/useCustomerStore";
import { useFcPlanMaster } from "@/hooks/admin/useFc";
import { FCPlanMaster } from "@/types/admin/fcplan.type";

const ContractsPage = () => {
  const router = useRouter();

  const [pageSize] = useState(10); // Page size
  const [page, setPage] = useState(1); // Page
  const { data: customerData, isLoading } = useGetAdminConfirmedFcCustomers(
    page,
    pageSize,
  );

  const total = customerData?.pagination?.totalElements || 0; // Total
  const totalPages = Math.ceil(total / pageSize); // Total pages

  //for contracts
  const [currentCustomerId, setCurrentCustomerId] = useState(0);
  const [downloadingCustomerId, setDownloadingCustomerId] = useState<
    number | null
  >(null);
  const [currentDownloadType, setCurrentDownloadType] = useState<
    "contract1" | "contract2" | "contract3" | null
  >(null);
  const { data: customerDetail, isLoading: isCustomerLoading } =
    useGetCustomerById(currentCustomerId);
  const {
    downloadContract1,
    isContract1Downloading,
    downloadContract2,
    isContract2Downloading,
    downloadContract3,
    isContract3Downloading,
  } = useCustomerStore();
  //fc plans
  const { data: plans } = useFcPlanMaster();

  useEffect(() => {
    if (!customerDetail || !downloadingCustomerId || !plans) return;

    let plansToUse: FCPlanMaster[] = [];

    if (customerDetail.fc_info?.role === 4) {
      plansToUse = plans.filter((plan) => plan.isActive);
    } else {
      plansToUse = plans;
    }

    if (plansToUse.length > 0 && currentDownloadType === "contract1") {
      downloadContract1(customerDetail, plansToUse);
    }

    if (currentDownloadType === "contract2") {
      downloadContract2(customerDetail);
    }

    if (currentDownloadType === "contract3") {
      downloadContract3(customerDetail);
    }

    // reset after download starts
    setDownloadingCustomerId(null);
  }, [
    customerDetail,
    plans,
    downloadingCustomerId,
    downloadContract1,
    downloadContract2,
    downloadContract3,
    currentDownloadType,
  ]);

  /**
   * downloadContract1
   * @param customer
   * @returns
   */
  const handleDownloadContract1 = (customer: AdminConfirmFcUser) => {
    setDownloadingCustomerId(customer.fcId);
    setCurrentCustomerId(customer.fcId);
    setCurrentDownloadType("contract1");
  };

  const handleDownloadContract2 = (customer: AdminConfirmFcUser) => {
    setDownloadingCustomerId(customer.fcId);
    setCurrentCustomerId(customer.fcId);
    setCurrentDownloadType("contract2");
  };

  const handleDownloadContract3 = (customer: AdminConfirmFcUser) => {
    setDownloadingCustomerId(customer.fcId);
    setCurrentCustomerId(customer.fcId);
    setCurrentDownloadType("contract3");
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-left">
            <div className="  flex  items-center  gap-4 text-left">
              <h2>契約書管理</h2>
              <div className="flex gap-4  items-center">
                <Button
                  className={`w-28  flex justify-center items-center  rounded-full text-sm bg-transparent border border-black text-black hover:bg-black/20`}
                  onClick={() => router.push("/admin/support/documents")}
                >
                  ドキュメント
                </Button>
                <Button
                  className={`w-28  flex justify-center items-center rounded-full text-sm text-white hover:bg-dark bg-black`}
                >
                  契約書
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        {/* table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  氏名
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  継続供給販売申込書
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  紹介制度同意書
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  個人情報取扱い同意書
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={4} className="h-10 text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : customerData && customerData?.data?.length > 0 ? (
                customerData.data.map((customer: AdminConfirmFcUser) => {
                  const isThisRowDownloading =
                    downloadingCustomerId === customer.fcId &&
                    (isCustomerLoading ||
                      isContract1Downloading ||
                      isContract2Downloading ||
                      isContract3Downloading);

                  return (
                    <TableRow
                      className="border-b border-black/10 hover:bg-black/2"
                      key={customer.fcId}
                    >
                      {/* customer name */}
                      <TableCell className="px-6 py-3">
                        {customer?.userName || "-"}
                      </TableCell>

                      {/* 継続供給販売申込書 */}
                      <TableCell className="px-6 py-4">
                        <Button
                          disabled={isThisRowDownloading}
                          onClick={() => handleDownloadContract1(customer)}
                          className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                        >
                          {isThisRowDownloading &&
                          currentDownloadType === "contract1"
                            ? "ダウンロード中..."
                            : "ダウンロード"}
                        </Button>
                      </TableCell>

                      {/* 紹介制度同意書 */}
                      <TableCell className="px-6 py-4">
                        <Button
                          disabled={isThisRowDownloading}
                          onClick={() => handleDownloadContract2(customer)}
                          className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                        >
                          {isThisRowDownloading &&
                          currentDownloadType === "contract2"
                            ? "ダウンロード中..."
                            : "ダウンロード"}
                        </Button>
                      </TableCell>

                      {/* 個人情報取扱い同意書 */}
                      <TableCell className="px-6 py-4">
                        <Button
                          disabled={isThisRowDownloading}
                          onClick={() => handleDownloadContract3(customer)}
                          className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                        >
                          {isThisRowDownloading &&
                          currentDownloadType === "contract3"
                            ? "ダウンロード中..."
                            : "ダウンロード"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-3 text-center text-sm text-gray-500"
                  >
                    レコードがありません
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading &&
          customerData &&
          customerData?.data?.length > 0 &&
          customerData?.pagination?.totalElements &&
          customerData?.pagination?.totalElements > pageSize && (
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
    </section>
  );
};

export default ContractsPage;
