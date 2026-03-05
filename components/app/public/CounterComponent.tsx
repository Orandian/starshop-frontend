import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
interface CounterComponentProps {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  min?: number;
  max?: number;
  handleToClick?: (quantity: number) => void;
  isMinusDisabled?: boolean;
}

const Params = [
  {
    name: "count",
    type: "number",
  },
  {
    name: "setCount",
    type: "Dispatch<SetStateAction<number>>",
  },
  {
    name: "min?",
    type: "number",
  },
  {
    name: "max?",
    type: "number",
  },
  {
    name: "handleToClick?",
    type: "() => void",
  },
];

const CounterComponent = ({
  count,
  setCount,
  min = 0,
  max = 10,
  handleToClick,
  isMinusDisabled = false,
}: CounterComponentProps) => {
  const [open, setOpen] = useState(false);
  const handleDecrement = () => {
    if (count === 1) {
      if(!isMinusDisabled){
        setOpen(true);
      }
      return;
    }

    if (count === min) {
      toast("最小値は" + min + "です");
      setOpen(true);
      return;
    }
    if (count === 1 && !isMinusDisabled) {
      setOpen(true);
      return;
    }
    setCount(count - 1);
    handleToClick?.(count - 1);
  };

  const handleIncrement = () => {
    if (count >= max) {
      toast("最大値は" + max + "です");
      return;
    }
    setCount(count + 1);
    handleToClick?.(count + 1);
  };

  return (
    <div className="w-[120px] flex-row-center gap-2 border border-white-bg bg-white/50">
      <Button
        className="w-1/4 rounded-none bg-white border-r-[1px] border-white-bg cursor-pointer hover:bg-white-bg"
        onClick={handleDecrement}
      >
        -
      </Button>
      <p className="w-1/2 text-center text-normal">{count}</p>
      <Button
        className="w-1/4 rounded-none bg-white border-l-[1px] border-white-bg cursor-pointer hover:bg-white-bg"
        onClick={handleIncrement}
      >
        +
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border border-white-bg rounded-md">
          <DialogHeader>
            <DialogTitle>この商品をカートから削除しますか？</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogFooter className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-[100px] cursor-pointer"
              >
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  setCount(0);
                  handleToClick?.(0);
                }}
                className="text-white w-[100px] cursor-pointer"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

CounterComponent.Params = Params;

export default CounterComponent;
