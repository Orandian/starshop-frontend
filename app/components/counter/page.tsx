"use client";

import ComponentLayout from "@/components/layouts/ComponentLayout";
import CounterComponent from "@/components/app/public/CounterComponent";
import { useState } from "react";

const CounterPage = () => {
  const [count, setCount] = useState(0);
  return (
    <ComponentLayout
      componentTitle="Counter"
      componentPath="@/components/app/public/CounterComponent.tsx"
      params={CounterComponent.Params}
    >
      <CounterComponent count={count} setCount={setCount} />
    </ComponentLayout>
  );
};

export default CounterPage;
