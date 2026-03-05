"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate2, getPublicUrl, encryptString } from "@/utils";
import ImageComponent from "@/components/fc/ImageComponent";
import { List, User } from "lucide-react";
import Link from "next/link";
import Graph from "@/public/fc/graph.svg";
import { useTeam, TeamList } from "@/hooks/admin/useTeam";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AdminFCTeamListPage = () => {
  const router = useRouter(); // Router
  const { data: teamList, isLoading } = useTeam();
  const users: TeamList[] = Array.isArray(teamList) ? teamList : [];

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-5rem)]">
        <Skeleton className="w-full h-full !bg-gray-100!" />
      </div>
    );
  }

  return (
    <section className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
      <div className="flex justify-between items-center mb-4">
        <h2>代理店組織一覧</h2>
      </div>

      <div className="flex justify-end items-center gap-2">
        <Link
          href="/admin/customers/fc-organization/"
          className="cursor-pointer bg-foreground hover:bg-dark/50 px-4 py-2 rounded-lg"
        >
          <ImageComponent
            imgURL={Graph.src}
            imgName="graph"
            className="size-4.5 text-white"
          />
        </Link>
        <Link
          href="/admin/customers/fc-organization/list"
          className=" cursor-pointer bg-black  text-disabled hover:bg-dark/50  px-4 py-2 rounded-lg "
        >
          <List className="size-5" />
        </Link>
      </div>

      <div className="border border-disabled/20  rounded-lg ">
        <div className="w-full bg-white h-auto px-4"></div>
        <div className=" overflow-x-auto">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] md:w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[20px] text-black ">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[100px] text-black ">
                      レベル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[250px] text-black ">
                      氏名
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[120px] text-black">
                      契約日
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[120px] text-black">
                      契約プラン
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[120px] text-black">
                      下のメンバー
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[150px] text-black">
                      稼いだボーナス
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[150px] text-black">
                      今月の購入金額
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[150px] text-black">
                      明細
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center space-y-2"
                      >
                        {/* <LoadingIndicator size="lg" /> */}
                        <Skeleton className="w-full h-5 bg-disabled" />
                        <Skeleton className="w-full h-5 bg-disabled" />
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 group">
                        <td className={`px-6 py-4 whitespace-nowrap  text-sm `}>
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap  text-sm ">
                          {user.level}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap  text-sm `}>
                          <div className="flex items-center gap-3">
                            <div className={`shrink-0 h-10 w-10 `}>
                              {user.userPhoto ? (
                                <ImageComponent
                                  imgURL={getPublicUrl(user.userPhoto) || ""}
                                  imgName="user"
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-disabled/20 flex items-center justify-center">
                                  <User className="text-disabled/80 size-6" />
                                </div>
                              )}
                            </div>
                            <div className={`text-gray-900 font-medium `}>
                              {user.memberName}
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                          {formatDate2(user.contractDate)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm `}>
                          {user.planName}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm `}>
                          {user.underMemberCount}人
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium `}
                        >
                          ¥{user.bonusAmount.toLocaleString() || 0}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium `}
                        >
                          ¥{user.thisMonthBonusAmount?.toLocaleString() || 0}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium `}
                        >
                          <Button
                            onClick={() =>
                              router.push(
                                `/admin/customers/${encryptString(user.fcId.toString())}`,
                              )
                            }
                            className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                          >
                            詳細
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        レコードがありません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* </A4DocumentTemplate> */}
      {/* </div> */}
    </section>
  );
};

export default AdminFCTeamListPage;
