import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useGetCart } from "@/hooks/fc";
import { useRouter } from "next/navigation";
import LoadingIndicator from "../ui/LoadingIndicator";

export const CartIcon = ({className=""}) => {
  const router = useRouter();
  const { data: cart, isLoading } = useGetCart();

  
  return (
    <Button
      className={`w-18 bg-disabled cursor-pointer text-white rounded-full text-sm hover:bg-dark ${className}`}
      onClick={() => router.push("/fc/purchase/cart")}
      disabled={cart?.data?.length === 0}
    >
      <ShoppingCart />
      <p className="size-6 bg-white rounded-full text-dark flex justify-center items-center">
        {isLoading ? <LoadingIndicator size="sm" /> : cart?.data?.length ?? 0}
      </p>
    </Button>
  );
};
