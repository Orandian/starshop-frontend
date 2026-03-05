"use client";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFcPlanMaster,
  useChangePlanStatus,
  useGetPeriodUpgrade,
  useUpdatePeriodUpgrade,
  useUpdatePlan,
} from "@/hooks/admin/useFc";
import { FCPlanMaster } from "@/types/admin/fcplan.type";
import { convertToYen } from "@/utils";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { AxiosError } from "axios";

const FcPlanMasterPage = () => {
  const totalDefultPlan = 2;
  //plan data
  const { data: plans, isLoading, error, isError, refetch } = useFcPlanMaster();
  const totalPlans = Array.isArray(plans) ? plans?.length : 0;

  const [planId, setPlanId] = useState<string | number>(0); // Plan ID
  const [statusToChange, setStatusToChange] = useState(false); // Status to change

  const [openUpdatePlan, setOpenUpdatePlan] = useState(false); // Open update plan
  const [updatePlanId, setUpdatePlanId] = useState(0); // Update plan id

  // Change status mutation
  const {
    mutate: changeStatus,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingPlanStatus,
  } = useChangePlanStatus(planId, statusToChange);

  const {
    data: period,
    isLoading: isPeriodLoading,
    error: periodError,
    refetch: refetchPeriod,
  } = useGetPeriodUpgrade();

  const [periodValue, setPeriodValue] = useState<number>(0);

  // Update period mutation
  const {
    mutate: updatePeriod,
    isPending: isUpdatingPeriod,
    error: updatePeriodError,
    isSuccess: isUpdatePeriodSuccess,
  } = useUpdatePeriodUpgrade();

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    setStatusToChange(productStatus);
    changeStatus();
  };

  //update plan
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUpdatePlan();

  //form schema
  const FormSchema = z.object({
    name: z.string().min(1, "プラン名は必須です"),
    contractPurchaseAmount: z.coerce
      .number()
      .min(1, "契約購入金額は0以上である必要があります"),
    wholesaleRate: z.coerce
      .number()
      .min(1, "卸売率は0以上である必要があります")
      .max(100, "卸売率は100%以下である必要があります"),
    introIncentive: z.coerce
      .number()
      .min(1, "紹介インセンティブは0以上である必要があります"),
  });

  //form state for create
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      contractPurchaseAmount: 0,
      wholesaleRate: 0,
      introIncentive: 0,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Initialize period value when data is loaded
  useEffect(() => {
    if (period?.data?.allowPeriod) {
      setPeriodValue(period.data.allowPeriod);
    }
  }, [period]);

  // Handle period save
  const handleSavePeriod = () => {
    if (periodValue !== undefined && periodValue !== null) {
      updatePeriod(periodValue);
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }

    if (changeStatusError) {
      toast.error(changeStatusError?.message);
    }

    if (periodError) {
      toast.error("期間データの取得に失敗しました: " + periodError?.message);
    }

    if (updatePeriodError) {
      toast.error(
        "昇格条件の更新に失敗しました: " + updatePeriodError?.message,
      );
    }

    if (isSuccess) {
      toast.success(changeStatusData?.message);
      refetch();
    }

    if (isUpdatePeriodSuccess) {
      toast.success("昇格条件を更新しました");
      refetchPeriod();
    }
  }, [
    isError,
    error,
    changeStatusError,
    periodError,
    updatePeriodError,
    isSuccess,
    changeStatusData,
    isUpdatePeriodSuccess,
    refetch,
    refetchPeriod,
  ]);

  const setFormData = (plan: FCPlanMaster) => {
    setUpdatePlanId(plan.planId);
    form.setValue("name", plan?.planName);
    form.setValue("contractPurchaseAmount", plan?.contractPurchaseAmount);
    form.setValue("wholesaleRate", plan?.wholesaleRate);
    form.setValue("introIncentive", plan?.introIncentive);
  };

  const handleUpdatePlan = (data: z.infer<typeof FormSchema>) => {
    updatePlan(
      {
        planId: updatePlanId,
        name: data.name,
        contractPurchaseAmount: data.contractPurchaseAmount,
        wholesaleRate: data.wholesaleRate,
        introIncentive: data.introIncentive,
      },
      {
        onSuccess: () => {
          setOpenUpdatePlan(false);
          setUpdatePlanId(0);
          toast.success("プランを更新しました");
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      },
    );
  };

  // /**
  //  * allow to type only numbers only
  //  * @param e
  //  * @param form
  //  * @param fieldName
  //  * @returns
  //  */
  // const handleNumericInput = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   form: ReturnType<typeof useForm<z.infer<typeof FormSchema>>>,
  //   fieldName: "contractPurchaseAmount" | "introIncentive" | "wholesaleRate",
  // ) => {
  //   const value = e.target.value;
  //   // Only allow numbers and empty string
  //   if (value === "" || /^[0-9\b]+$/.test(value)) {
  //     form.setValue(fieldName, value === "" ? 0 : Number(value), {
  //       shouldValidate: true,
  //     });
  //     return value; // Return the sanitized value
  //   }
  //   return e.target.value.replace(/[^0-9]/g, ""); // Return sanitized value for display
  // };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h2>代理店設定</h2>
          </div>
        </div>
        <div>
          <h3 className="text-base font-bold mb-4">代理店プラン</h3>
        </div>
        {/* count */}
        <div className="flex justify-between items-center gap-2 mb-1">
          <p className="text-sm mb-5">{totalPlans}件</p>
        </div>
        {/* table */}

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-[25%] px-6 py-3 font-bold text-black text-xs uppercase">
                  No
                </TableHead>
                <TableHead className="w-[25%] px-6 py-3 font-bold text-black text-xs uppercase">
                  プラン名
                </TableHead>
                <TableHead className="w-[20%] px-6 py-3 font-bold text-black text-right text-xs uppercase">
                  契約金額
                </TableHead>
                <TableHead className="w-[25%] px-6 py-3 font-bold text-black text-center text-xs uppercase">
                  仕入率
                </TableHead>
                <TableHead className="w-[20%] px-6 py-3 font-bold text-black text-right text-xs uppercase">
                  紹介インセンティブ
                </TableHead>
                <TableHead className="w-[15%] px-6 py-3 font-bold text-black text-xs uppercase">
                  表示ステータス
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(plans) &&
                plans?.length > 0 &&
                plans.map((plan: FCPlanMaster) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2"
                    key={plan?.planId}
                  >
                    <TableCell
                      onClick={() => {
                        setOpenUpdatePlan(true);
                        setFormData(plan);
                      }}
                      className="px-6 py-3"
                    >
                      {plan?.planId}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setOpenUpdatePlan(true);
                        setFormData(plan);
                      }}
                      className="px-6 py-3"
                    >
                      {plan?.planName}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setOpenUpdatePlan(true);
                        setFormData(plan);
                      }}
                      className="px-6 py-3 text-right"
                    >
                      {convertToYen(plan?.contractPurchaseAmount || 0)}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setOpenUpdatePlan(true);
                        setFormData(plan);
                      }}
                      className="px-6 py-3 text-center"
                    >
                      {plan?.wholesaleRate}%
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setOpenUpdatePlan(true);
                        setFormData(plan);
                      }}
                      className="px-6 py-3 text-right"
                    >
                      {convertToYen(plan?.introIncentive || 0)}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              plan?.isActive
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-disabled hover:bg-disabled/80"
                            }`}
                            onClick={() => {
                              setPlanId(plan?.planId || 0);
                            }}
                          >
                            {plan?.isActive ? "有効" : "無効"}
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
                                  setPlanId(plan?.planId || 0);
                                  handleStatusChange(true);
                                }}
                              >
                                有効
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-disabled text-white cursor-pointer w-[100px] py-2 hover:bg-disabled/80"
                                onClick={() => {
                                  setPlanId(plan?.planId || 0);
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
                                  handleStatusChange(statusToChange);
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
                  </TableRow>
                ))}
              {!isLoading && plans?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    FCプランがありません
                  </TableCell>
                </TableRow>
              )}
              {isLoading &&
                Array.from({ length: totalDefultPlan }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={6} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {/* Management Fee Settings */}
        <div className="grid grid-cols-2 gap-6">
          <div className="mb-6">
            <h3 className="text-base font-bold mb-4">管理金率設定</h3>
            <div className="rounded-[10px] overflow-hidden border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-black/10">
                    <TableHead className="w-1/2 px-6 py-3 font-bold text-black text-xs">
                      代理店役割
                    </TableHead>
                    <TableHead className="w-1/2 px-6 py-3 font-bold text-black text-xs">
                      管理金率設定
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-black/10 hover:bg-black/2">
                    <TableCell className="px-6 py-3">
                      代理店コンサルタント
                    </TableCell>
                    <TableCell className="px-6 py-3">2.00%</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-black/10 hover:bg-black/2">
                    <TableCell className="px-6 py-3">代理店リーダー</TableCell>
                    <TableCell className="px-6 py-3">2.00%</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-black/10 hover:bg-black/2">
                    <TableCell className="px-6 py-3">
                      代理店スペシャルリスト
                    </TableCell>
                    <TableCell className="px-6 py-3">2.00%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-base font-bold mb-4">昇格条件</h3>
            <div className="rounded-[10px] overflow-hidden border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-black/10">
                    <TableHead className="px-6 py-3 font-bold text-black text-xs text-center">
                      昇格条件
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-black/10 hover:bg-black/2">
                    <TableCell className="px-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <span>{plans?.[0].planName}</span>
                        <span>→</span>
                        <span>{plans?.[1].planName}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b border-black/10 hover:bg-black/2">
                    <TableCell className="px-6 py-3 text-center">
                      {isPeriodLoading ? (
                        <Skeleton className="h-8 w-20 mx-auto bg-white-bg" />
                      ) : (
                        <>
                          <input
                            type="number"
                            value={
                              periodValue || period?.data?.allowPeriod || 0
                            }
                            onChange={(e) =>
                              setPeriodValue(Number(e.target.value))
                            }
                            className="w-14 py-1 mr-2  border border-black/10 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <span>ヶ月以内</span>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {/* Save Button */}
            <div className="flex justify-end mt-4">
              <Button
                className="bg-primary hover:bg-primary/80 text-white px-8 py-2 rounded-md"
                onClick={handleSavePeriod}
                disabled={isUpdatingPeriod}
              >
                {isUpdatingPeriod ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Update brand dialog */}
      <Dialog
        open={openUpdatePlan}
        onOpenChange={(open) => {
          setOpenUpdatePlan(open);
          if (!open) {
            // Reset form when dialog is closed
            form.reset();
          }
        }}
      >
        <Form {...form}>
          <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
            <form onSubmit={form.handleSubmit(handleUpdatePlan)}>
              <DialogHeader>
                <DialogTitle>更新ブランド</DialogTitle>
                <DialogDescription className="mt-2 space-y-4">
                  {/* プラン名*/}
                  <FormInputComponent
                    control={form.control}
                    name="name"
                    label="プラン名"
                    placeholder="プラン名を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    preventAutoSelect
                    required
                  />
                  {/* 契約金額*/}
                  <FormInputComponent
                    control={form.control}
                    type="text"
                    name="contractPurchaseAmount"
                    label="契約金額"
                    placeholder="契約金額を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    required
                    inputMode="numeric"
                  />
                  {/*仕入率*/}
                  <FormInputComponent
                    control={form.control}
                    type="text"
                    name="wholesaleRate"
                    label="仕入率"
                    placeholder="仕入率を入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    required
                    inputMode="numeric"
                  />
                  {/*仕入率*/}
                  <FormInputComponent
                    control={form.control}
                    type="text"
                    name="introIncentive"
                    label="紹介インセンティブ"
                    placeholder="紹介インセンティブを入力"
                    className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    required
                    inputMode="numeric"
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-lg mt-2 px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
                  disabled={!form.formState.isValid}
                >
                  {isUpdatingPlan ? "更新中..." : "OK"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>
      <ServerActionLoadingComponent
        loading={isChangingPlanStatus || isUpdatingPeriod}
        message={
          isChangingPlanStatus
            ? "FCプランの状況を変更しています"
            : "昇格条件を更新しています"
        }
      />
    </section>
  );
};

export default FcPlanMasterPage;
