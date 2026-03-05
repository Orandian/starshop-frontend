"use client"

import { MoveLeft } from 'lucide-react';
import { useRouter } from "next/navigation";

const BackToMenu = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push("/components");
    }
  return (
    <div onClick={handleClick} className="flex-row-center gap-2 cursor-pointer">
        <MoveLeft />
        <p>Back to components menu</p>
    </div>
  )
}

export default BackToMenu