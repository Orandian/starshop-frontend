"use client";

import ComponentLayout from "@/components/layouts/ComponentLayout";
import DateRangePickerComponent from "@/components/admin/DateRangePickerComponent";

const DateRangePickerPage = () => {
  return (
    <ComponentLayout
      componentTitle="Date Range Picker"
      componentPath="@/components/admin/DateRangePickerComponent.tsx"
      params={[
        {
          name: "defaultFrom",
          type: "Date",
        },
        {
          name: "defaultTo",
          type: "Date",
        },
      ]}
    >
      <div className="">
        <DateRangePickerComponent
          defaultFrom={new Date()}
          defaultTo={new Date()}
          onChange={() => {}}
        />
      </div>
    </ComponentLayout>
  );
};

export default DateRangePickerPage;
