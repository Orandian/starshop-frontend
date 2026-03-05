"use client";

import DashboardCardComponent from "@/components/admin/DashboardCardComponent";

interface CardItem {
  label: string;
  value: string;
  count: number;
}

const cards: CardItem[] = [
  {
    label: "一般顧客",
    value: "0",
    count: 0,
  },
  {
    label: "代理店マネージャー",
    value: "1",
    count: 0,
  },
  {
    label: "代理店コンサルタント",
    value: "2",
    count: 0,
  },
  {
    label: "代理店リーダー",
    value: "3",
    count: 0,
  },
  {
    label: "代理店スペシャリスト",
    value: "4",
    count: 0,
  },
  {
    label: "代理店メンバー",
    value: "5",
    count: 0,
  },
];

const AdminCustomerHeader = ({
  UserCount,
}: {
  UserCount: Record<string, number> | undefined;
}) => {
  cards[0].count = UserCount?.["GENERAL"] || 0;
  cards[1].count = UserCount?.["FC_ROLE_1"] || 0;
  cards[2].count = UserCount?.["FC_ROLE_2"] || 0;
  cards[3].count = UserCount?.["FC_ROLE_3"] || 0;
  cards[4].count = UserCount?.["FC_ROLE_4"] || 0;
  cards[5].count = UserCount?.["FC_ROLE_5"] || 0;
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 justify-between">
        {cards.map((card) => (
          <DashboardCardComponent
            key={card.value}
            value={card.count}
            description={card.label}
          />
        ))}
      </div>
    </section>
  );
};

export default AdminCustomerHeader;
