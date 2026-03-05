"use client";

import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAllDelivery,
  useGetAllShippingCost,
  useUpdateDelivery,
  useUpdateShippingCost,
} from "@/hooks/admin/useSetting";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ShippingSettingsPage = () => {
  const { data } = useGetAllDelivery();
  const { data: shippingCost } = useGetAllShippingCost({});
  const {
    mutateAsync: mutateUpdateShippingCost,
    isPending: isPendingUpdateShippingCost,
  } = useUpdateShippingCost();

  const { mutateAsync, isPending } = useUpdateDelivery();

  const [userShippingFreeLimitPrice, setUserShippingFreeLimitPrice] =
    useState(0);
  const [fcShippingFreeLimitPrice, setFcShippingFreeLimitPrice] = useState(0);

  const [inputFee, setInputFee] = useState({
    thresholdInput: "0",
    shippingInput: "0",
  });

  // Regional shipping fees (9 regions)
  const [regionalFees, setRegionalFees] = useState({
    hokkaido: {
      shippingCostId: 1,
      fees: "0",
    },
    tohoku: {
      shippingCostId: 2,
      fees: "0",
    },
    kanto: {
      shippingCostId: 3,
      fees: "0",
    },
    chubu: {
      shippingCostId: 4,
      fees: "0",
    },
    kinki: {
      shippingCostId: 5,
      fees: "0",
    },
    chugoku: {
      shippingCostId: 6,
      fees: "0",
    },
    shikoku: {
      shippingCostId: 7,
      fees: "0",
    },
    kyushu: {
      shippingCostId: 8,
      fees: "0",
    },
    okinawa: {
      shippingCostId: 9,
      fees: "0",
    },
  });

  const regions = [
    { id: 1, key: "hokkaido", name: "北海道" },
    { id: 2, key: "tohoku", name: "東北" },
    { id: 3, key: "kanto", name: "関東" },
    { id: 4, key: "chubu", name: "中部" },
    { id: 5, key: "kinki", name: "近畿" },
    { id: 6, key: "chugoku", name: "中国" },
    { id: 7, key: "shikoku", name: "四国" },
    { id: 8, key: "kyushu", name: "九州" },
    { id: 9, key: "okinawa", name: "沖縄" },
  ];

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      const threshold = data.data[0].shippingFreeLimitUser;
      const shipping = data.data[0].shippingFreeLimitFc;

      setUserShippingFreeLimitPrice(threshold);
      setFcShippingFreeLimitPrice(shipping);

      setInputFee({
        thresholdInput: threshold.toString(),
        shippingInput: shipping.toString(),
      });
    }

    if (shippingCost?.data && shippingCost?.data?.length > 0) {
      const updatedRegionalFees = { ...regionalFees };

      shippingCost?.data.forEach((cost) => {
        const region = regions.find((r) => r.id === cost.shippingCostId);
        if (region) {
          updatedRegionalFees[region.key as keyof typeof regionalFees] = {
            shippingCostId: cost.shippingCostId,
            fees: cost.fees.toString(),
          };
        }
      });

      setRegionalFees(updatedRegionalFees);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, shippingCost]);

  const handleSave = () => {
    // Add guard clause to prevent accessing undefined data
    if (!data?.data || data.data.length === 0) {
      toast.error("配送設定データが見つかりません");
      return;
    }

    mutateAsync(
      {
        id: data.data[0].settingId,
        data: {
          shippingFreeLimitUser: userShippingFreeLimitPrice,
          shippingFreeLimitFc: fcShippingFreeLimitPrice,
        },
      },
      {
        onSuccess: () => {
          mutateUpdateShippingCost(
            Object.values(regionalFees).map((item) => ({
              shippingCostId: item.shippingCostId,
              fees: Number(item.fees),
            })),
            {
              onSuccess: () => toast.success("配送設定を保存しました"),
              onError: () => toast.error("配送設定の更新に失敗しました"),
            },
          );
        },
        onError: () => toast.error("配送設定の更新に失敗しました"),
      },
    );
  };

  const handleThresholdChange = (value: string) => {
    setUserShippingFreeLimitPrice(Number(value));
    setInputFee((prevState) => ({ ...prevState, thresholdInput: value }));
  };

  const handleShippingChange = (value: string) => {
    setFcShippingFreeLimitPrice(Number(value));
    setInputFee((prevState) => ({ ...prevState, shippingInput: value }));
  };

  const handleRegionalFeeChange = (regionKey: string, value: string) => {
    setRegionalFees((prevState) => {
      if (!(regionKey in prevState)) {
        return prevState; // or throw an error
      }

      return {
        ...prevState,
        [regionKey]: {
          shippingCostId:
            prevState[regionKey as keyof typeof prevState].shippingCostId,
          fees: value,
        },
      };
    });
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2">
            <h2>配送設定</h2>
          </div>
        </div>

        {/* Shipping Settings Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-1/4 px-6 py-3 uppercase font-bold text-black text-xs">
                  顧客タイプ
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  配送設定
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* General Customer */}
              <TableRow className="border-b border-black/10 hover:bg-black/2">
                <TableCell className="px-6 py-3 font-medium align-top">
                  一般顧客
                </TableCell>
                <TableCell className="px-6 py-3">
                  <div className=" flex items-center ">
                    {/* Below threshold */}
                    <div className="flex items-center  gap-2">
                      <Input
                        type="number"
                        value={inputFee.thresholdInput}
                        onChange={(e) => handleThresholdChange(e.target.value)}
                        className="w-20 px-3 py-2 border border-black/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />

                      <span>
                        万円以上の場合、 <span>送料無料</span>
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              {/* FC Customer */}
              <TableRow className="border-b border-black/10 hover:bg-black/2">
                <TableCell className="px-6 py-3 font-medium align-top">
                  代理店
                </TableCell>
                <TableCell className="px-6 py-3">
                  <div className=" flex items-center ">
                    {/* Below threshold */}
                    <div className="flex items-center  gap-2">
                      <Input
                        type="number"
                        value={inputFee.shippingInput}
                        onChange={(e) => handleShippingChange(e.target.value)}
                        className="w-20 px-3 py-2 border border-black/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />

                      <span>
                        万円以上の場合、 <span>送料無料</span>
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Regional Shipping Fees Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10 mt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-1/4 px-6 py-3 uppercase font-bold text-black text-xs">
                  地方
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  送料（円）
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region) => (
                <TableRow
                  key={region.key}
                  className="border-b border-black/10 hover:bg-black/2"
                >
                  <TableCell className="px-6 py-3 font-medium">
                    {region.name}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <Input
                      type="number"
                      value={
                        regionalFees[region.key as keyof typeof regionalFees]
                          .fees
                      }
                      onChange={(e) =>
                        handleRegionalFeeChange(region.key, e.target.value)
                      }
                      className="w-32 px-3 py-2 border border-black/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button
            className="bg-primary hover:bg-primary/80 text-white px-8 py-2 rounded-md"
            onClick={handleSave}
            disabled={isPending || isPendingUpdateShippingCost}
          >
            {isPending || isPendingUpdateShippingCost ? (
              <LoadingIndicator size="sm" />
            ) : (
              "保存"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShippingSettingsPage;
