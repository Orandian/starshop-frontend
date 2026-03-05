"use client";

import ChartComponent from "@/components/admin/ChartComponent";
import DashboardCardComponent from "@/components/admin/DashboardCardComponent";
import DateRangePickerComponent from "@/components/admin/DateRangePickerComponent";
import ImageComponent from "@/components/fc/ImageComponent";
import {
  useAdminActivity,
  useDateRangeSalesTotal,
  useFcTotal,
  useOrder,
  useStatistic,
  useThisMonthSalesTotal,
  useYearlySalesTotal
} from "@/hooks/admin/useDashboard";
import { useEffect, useState } from "react";

import {
  encryptString,
  formatDate,
  formatOrderDate,
  getOrderStatus,
  getOrderStatusClass,
  getPublicUrl,
  userType,
} from "@/utils";

import { Activity } from "@/types/admin/dashboard.type";
import { Order } from "@/types/admin/order.type";
import { User } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  const today = new Date(); // today
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // first day of month

  const page = 1;
  const pageSize = 5;
  const activityPage = 1;
  const activityPageSize = 5;
  const { data: thisMonthSalesTotal } = useThisMonthSalesTotal();
  const { data: yearlySalesTotal } = useYearlySalesTotal();
  const { data: statistic } = useStatistic();


  const [dateRange, setDateRange] = useState({
    from: firstDayOfMonth,
    to: today,
  }); // date range

  const { data: chartData } = useDateRangeSalesTotal(
    dateRange.from.toLocaleDateString("sv-SE"),
    dateRange.to.toLocaleDateString("sv-SE")
  ); // chart data

  // recent orders
  const { data: ordersData, isLoading: isLoadingOrder } = useOrder(
    page,
    pageSize,
    -1
  ); // default 5 orders only
  const [orders, setOrders] = useState<Order[]>(ordersData?.data?.data || []);

  const { data: fcTotal } = useFcTotal();
  const { data: activities, isLoading: isLoadingActivities } = useAdminActivity(
    activityPage,
    activityPageSize
  );

  // keep local orders in sync with query results
  useEffect(() => {
    setOrders(ordersData?.data?.data || []);
  }, [ordersData, fcTotal, activities]);



  // Calculate FC percentages
  const calculateFcPercentage = (count: number) => {
    const total = fcTotal?.data?.total ?? 0;
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <section className="w-full">
      {/* 売上 Cards */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 justify-between">
        <DashboardCardComponent
          value={statistic?.data?.purchasesThisMonth ?? 0}
          description="今月仕入高"
          isCurrency
        />
        <DashboardCardComponent
          value={statistic?.data?.purchasesThisYear ?? 0}
          description="年間の仕入高"
          isCurrency
        />
        <DashboardCardComponent
          value={statistic?.data?.profit ?? 0}
          description="利益"
          isCurrency
        />
        <DashboardCardComponent
          value={thisMonthSalesTotal?.data?.total ?? 0}
          description="今月売上"
          isCurrency
        />
        <DashboardCardComponent
          value={yearlySalesTotal?.data?.total ?? 0}
          description="年間売上"
          isCurrency
        />
        <DashboardCardComponent
          value={statistic?.data?.unProcessOrder ?? 0}
          description="未処理注文"
        />
        <DashboardCardComponent
          value={statistic?.data?.thisMonthRegisterCustomer ?? 0}
          description="新規顧客"
        />
        <DashboardCardComponent
          value={statistic?.data?.outOfStockItem ?? 0}
          description="在庫切れ商品"
        />
      </div>

      {/* 売上Chart */}
      <div className="mt-10 w-full px-4 py-6 md:px-10 md:py-12 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex flex-wrap justify-between mb-10 gap-3">
          <div className="text-left">
            <h2>売上</h2>
          </div>
          <div className="justify-items-end">
            <DateRangePickerComponent
              defaultFrom={firstDayOfMonth}
              defaultTo={today}
              onChange={(from, to) => setDateRange({ from, to })}
            />
          </div>
        </div>
        <ChartComponent chartData={chartData?.data ?? []} />
      </div>

      {/* 最近の注文と最近のアクティビティ */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div className="col-span-2 w-full mt-8 px-8 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto ">
          <div className="flex justify-between items-center mt-8 mb-6">
            <h3 className="text-lg font-semibold">最近の注文</h3>
            <Link
              href={"/admin/orders"}
              className="text-sm text-[#3020E0] underline"
            >
              すべて表示
            </Link>
          </div>
          {/* <div className="w-full   bg-white h-auto">
            <div className="flex gap-4  items-center mb-4">
              <Button
                onClick={() => handelOrderChange(-1)}
                className={`flex px-2 py-1 justify-between items-center  text-white rounded-full text-sm hover:bg-dark ${orderBy === -1 ? "bg-black" : "bg-disabled opacity-60"}`}
              >
                <span>All</span>
                <span className="ml-2 text-xs py-1 px-2 flex justify-center items-center rounded-full bg-white text-black">
                  {userOrderCountByType?.data?.all ?? 0}
                </span>
              </Button>
              <Button
                onClick={() => handelOrderChange(3)}
                className={`flex px-2 py-1 justify-between items-center  text-white rounded-full text-sm hover:bg-dark ${orderBy === 3 ? "bg-black" : "bg-disabled opacity-60"}`}
              >
                <span>一般</span>
                <span className="ml-2 text-xs py-1 px-2 flex justify-center items-center rounded-full bg-white text-black">
                  {userOrderCountByType?.data?.user ?? 0}
                </span>
              </Button>
              <Button
                onClick={() => handelOrderChange(2)}
                className={`flex px-2 py-1 justify-between items-center  text-white rounded-full text-sm hover:bg-dark ${orderBy === 2 ? "bg-black" : "bg-disabled opacity-60"}`}
              >
                <span>代理店</span>
                <span className="ml-2 text-xs py-1 px-2 flex justify-center items-center rounded-full bg-white text-black">
                  {userOrderCountByType?.data?.fc ?? 0}
                </span>
              </Button>
            </div>
          </div> */}

          <div className="bg-white rounded-lg mb-6 shadow overflow-hidden">
            {!isLoadingOrder ? (
              <div className="overflow-x-auto">
                <div className="min-w-[800px] md:w-full">
                  <table className="min-w-full divide-y divide-gray-200 border border-disabled/20">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-right text-xs  tracking-wider w-10">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider min-w-[120px]">
                          氏名
                        </th>
                        <th className="px-6 py-3 text-center text-xs uppercase tracking-wider min-w-[120px]">
                          購入日
                        </th>
                        <th className="px-6 py-3 text-right text-xs uppercase tracking-wider min-w-[120px]">
                          購入金額（税別）
                        </th>

                        {/* <th className="px-6 py-3 text-left text-xs uppercase tracking-wider min-w-[120px]">
                        転送伝票番号
                      </th> */}
                        <th className="px-6 py-3 text-center text-xs uppercase tracking-wider min-w-[120px]">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-center text-xs uppercase tracking-wider min-w-[120px]">
                          操作
                        </th>

                        {/* <th className="px-6 py-3 text-left text-xs uppercase tracking-wider min-w-[120px]">
                        送料
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider min-w-[120px]">
                        合計金額
                      </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length > 0 ? (
                        orders.slice(0, 5).map((order, index) => (
                          <tr
                            key={order.orderId}
                            className="hover:bg-gray-50 group"
                          >
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 cursor-pointer"
                              // onClick={() => handleViewOrder(order.orderId)}
                            >
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer">
                              <div className="flex justify-start items-center">
                                <div>
                                  {order.user.userPhoto ? (
                                    <ImageComponent
                                      imgURL={
                                        order.user.userPhoto
                                          ? getPublicUrl(order.user.userPhoto)
                                          : ""
                                      }
                                      imgName={order.user.username.slice(0, 2)}
                                      className="rounded-full object-cover w-10 h-10 mr-3"
                                    ></ImageComponent>
                                  ) : (
                                    <User className=" bg-gray-200 text-white rounded-full  w-10 h-10  mr-3 " />
                                  )}
                                </div>
                                <div>
                                  <p className="mb-2">{order.user.username}</p>
                                  <p>
                                    {order.user.userType === 2
                                      ? userType(order.fc.role)
                                      : "一般"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 cursor-pointer"
                              // onClick={() => handleViewOrder(order.orderId)}
                            >
                              {formatOrderDate(order.orderDate)}
                            </td>
                            {/* <td
                            className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer group-hover:bg-gray-50"
                            // onClick={() => handleViewOrder(order.orderId)}
                          >
                            {order.orderItems.slice(0, 1).map((item) => (
                              <div
                                key={item.orderDetailId}
                                className="flex items-center gap-3 mb-2"
                              >
                                <div className="shrink-0 w-10 h-10">
                                  <ImageComponent
                                    imgURL={
                                      getPublicUrl(
                                        item.product.images?.[0]?.imageUrl
                                      ) || ""
                                    }
                                    imgName="product"
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div className="flex flex-col text-gray-500">
                                  <span className="text-gray-900 font-medium">
                                    {item.productName}
                                  </span>
                                  <span>
                                    {" "}
                                    ¥
                                    {Number(
                                      item.priceAtPurchase
                                    ).toLocaleString("ja-JP")}{" "}
                                    * {item.quantity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </td> */}

                            {/* <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                            // onClick={() => handleViewOrder(order.orderId)}
                          >
                            <span className="text-blue-600">
                              {order.shippingCompany === 1
                                ? "ヤマト運輸"
                                : order.shippingCompany === 2
                                  ? "佐川急便"
                                  : order.shippingCompany === 3
                                    ? "日本郵便"
                                    : order.shippingCompany === 4
                                      ? "DHL"
                                      : order.shippingCompany === 5
                                        ? "FedEx"
                                        : "未設定"}
                            </span>
                            <br />
                            <a href="" className="underline text-blue-600">
                              {order.trackingNumber}
                            </a>
                          </td> */}
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right cursor-pointer"
                              // onClick={() => handleViewOrder(order.orderId)}
                            >
                              {"¥" +
                                (order?.totalPriceNoTax?.toLocaleString(
                                  "ja-JP"
                                ) ?? "0")}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-center cursor-pointer"
                              // onClick={() => handleViewOrder(order.orderId)}
                            >
                              <span
                                className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full py-1 ${getOrderStatusClass(order.orderStatus)}`}
                              >
                                {getOrderStatus(order.orderStatus)}
                              </span>
                            </td>
                            {/* <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                            // onClick={() => handleViewOrder(order.orderId)}
                          >
                            {"¥" + order.shippingCost}
                          </td> */}

                            <td
                              className="px-6 py-4 whitespace-nowrap text-center cursor-pointer"
                              // onClick={() => handleViewOrder(order.orderId)}
                            >
                              <Link
                                href={`/admin/orders/${encryptString(
                                  order.orderId.toString()
                                )}`}
                                className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                              >
                                詳細
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-3 text-center text-sm text-gray-500"
                          >
                            レコードがありません
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">読み込み中...</div>
            )}
          </div>
        </div>
        <div className="w-full mt-8 px-8 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
          {/* Activity */}
          <div className="py-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">最近のアクティビティ</h3>
              <Link
                href={"/admin/support/activities"}
                className="text-sm text-[#3020E0] underline"
              >
                すべて表示
              </Link>
            </div>
            <div className="space-y-4">
              {isLoadingActivities ? (
                <div className="p-6 text-center text-gray-500">
                  読み込み中...
                </div>
              ) : activities?.data && activities.data.length > 0 ? (
                activities.data.map((activity: Activity) => (
                  <div
                    key={activity.activityId}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.message}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  アクティビティがありません
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 代理店情報 */}
      <div className="w-full mt-8 px-8 py-6 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">代理店活動状況</h3>
          <Link
            href={"/admin/fc-functions/dashboard"}
            className="text-sm text-[#3020E0] underline"
          >
            代理店ダッシュボードへ
          </Link>
        </div>

        {/* 代理店統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary mb-2">
              {fcTotal?.data?.total ?? 0}
            </p>
            <p className="text-sm text-gray-600">代理店総数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary mb-2">
              ¥{fcTotal?.data?.thisMonthSales.toLocaleString("ja-JP")}
            </p>
            <p className="text-sm text-gray-600">今月の代理店売上</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary mb-2">
              ¥{fcTotal?.data?.thisMonthBonus.toLocaleString("ja-JP")}
            </p>
            <p className="text-sm text-gray-600">今月のボーナス支給額</p>
          </div>
        </div>

        {/* 代理店種別分析 */}
        <div className="mt-8">
          <h4 className="text-base font-semibold mb-4">代理店種別分析</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 代理店マネージャー */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">
                  代理店マネージャー
                </span>
                <span className="text-sm font-semibold ">
                  {fcTotal?.data?.manager ?? 0}名
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${calculateFcPercentage(fcTotal?.data?.manager ?? 0)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 代理店コンサルタント */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">
                  代理店コンサルタント
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {fcTotal?.data?.consultant ?? 0}名
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${calculateFcPercentage(fcTotal?.data?.consultant ?? 0)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 代理店リーダー */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">代理店リーダー</span>
                <span className="text-sm font-semibold text-gray-900">
                  {fcTotal?.data?.leader ?? 0}名
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${calculateFcPercentage(fcTotal?.data?.leader ?? 0)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 代理店スペシャリスト */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">
                  代理店スペシャリスト
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {fcTotal?.data?.specialist ?? 0}名
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${calculateFcPercentage(fcTotal?.data?.specialist ?? 0)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 代理店メンバー */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">代理店メンバー</span>
                <span className="text-sm font-semibold text-gray-900">
                  {fcTotal?.data?.member ?? 0}名
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${calculateFcPercentage(fcTotal?.data?.member ?? 0)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
