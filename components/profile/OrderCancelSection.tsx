import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { getOrderStatus } from "@/utils";

interface OrderCancelSectionProps {
  orderDate: string;
  paymentMethod: string;
  isLoading: boolean;
  handleUpdateOrderStatus: (notes: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  orderStatus: number;
  reason: string;
  setReason: (reason: string) => void;
}

const OrderCancelSection = ({
  orderDate,
  paymentMethod,
  isLoading,
  handleUpdateOrderStatus,
  open,
  setOpen,
  orderStatus,
  reason,
  setReason,
}: OrderCancelSectionProps) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between">
        <p className="md:text-sm text-xs">
          {/* {convertToLocaleDateTime(orderDate, "Asia/Tokyo")} {paymentMethod} */}
          {orderDate} {paymentMethod === "stripe" ? "クレジットカード支払い済み" : paymentMethod }
        </p>

        {/* <DialogTrigger asChild>
          <Button
            className={
              getOrderStatus(orderStatus) === "キャンセル"
                ? "rounded-full bg-black/50 text-white-bg md:px-6 px-2 text-xs"
                : "rounded-full bg-secondary text-white-bg md:px-6 px-2 text-xs cursor-pointer hover:bg-secondary/80"
            }
            onClick={() => {
              if (getOrderStatus(orderStatus) === "キャンセル") {
                return;
              }
              setOpen(true);
            }}
          >
            {getOrderStatus(orderStatus) === "キャンセル"
              ? "注文をキャンセルしました"  
              : "注文をキャンセルする"}
          </Button>
        </DialogTrigger> */}
      </div>

      <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
        <DialogHeader>
          <DialogTitle>注文キャンセル</DialogTitle>
          <DialogDescription className="mt-2">
            <span className="text-xs">理由</span>
            <textarea
              className="w-full h-24 border border-white-bg rounded-md p-2 mt-2 resize-none focus:outline-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={getOrderStatus(orderStatus) === "キャンセル"}
            />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
            onClick={() => handleUpdateOrderStatus(reason)}
            disabled={isLoading || getOrderStatus(orderStatus) === "キャンセル"}
          >
            {isLoading ? "キャンセル中..." : "OK"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderCancelSection;
