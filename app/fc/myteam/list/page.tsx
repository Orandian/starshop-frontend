"use client";

import ImageComponent from "@/components/fc/ImageComponent";
import MobileTableCard from "@/components/fc/MobileTableCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";
import { useTeamListByLevel, useTeamPeriodList } from "@/hooks/fc/useTeam";
import Graph from "@/public/fc/graph.svg";
import { TeamLevelData } from "@/types/fc/team.type";
import { encodeShortString, formatDate2 } from "@/utils";
import { FcUserRole } from "@/utils/fc/fc-user-roles";
import { Copy, List } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const FCMyTeamPage = () => {
  const [period, setPeriod] = useState("all");
  const { data, isLoading } = useTeamListByLevel(period);
  const { data: teamPeriodList } = useTeamPeriodList();
  const { userDetail } = useFullUserDetail();

  // Use actual API data
  const teamData = data?.data || [];

  // Group team data by level
  const groupTeamDataByLevel = useMemo(
    () => (data: TeamLevelData[]) => {
      const grouped: { [key: number]: TeamLevelData[] } = {};

      data.forEach((item) => {
        if (!grouped[item.level]) {
          grouped[item.level] = [];
        }
        grouped[item.level].push(item);
      });

      return grouped;
    },
    [],
  );

  const membersByLevel = groupTeamDataByLevel(teamData);
  const levels = Object.keys(membersByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  // Separate level 1 and other levels
  const level1Members = membersByLevel[1] || [];
  const otherLevels = levels.filter((level) => level > 1);
  const totalOtherMembers = otherLevels.reduce(
    (sum, level) => sum + membersByLevel[level].length,
    0,
  );

  const handleCopyLink = (id: number) => {
    const referLink = `${origin}/partner/${encodeShortString(id.toString())}`;
    navigator.clipboard
      .writeText(referLink)
      .then(() => {
        toast.success("リンクをコピーしました");
      })
      .catch((error) => {
        console.error("Failed to copy link: ", error);
        toast.error("コピーに失敗しました");
      });
  };

  const handlePeriodChange = (selectedPeriod: string) => {
    return () => {
      setPeriod(selectedPeriod);
    };
  };

  return (
    <section className="w-full">
      <div className="w-full px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="my-4 font-bold">私のチーム</h2>
          <div className="flex justify-center items-center gap-2">
            <Link
              href="/fc/myteam/graph"
              className="cursor-pointer bg-foreground hover:bg-dark/50 px-4 py-2 rounded-lg"
            >
              <ImageComponent
                imgURL={Graph.src}
                imgName="graph"
                className="size-4.5"
              />
            </Link>
            <Link
              href="/fc/myteam/list"
              className="cursor-pointer bg-black text-white hover:bg-dark/50 px-4 py-2 rounded-lg"
            >
              <List className="size-5" />
            </Link>
          </div>
        </div>

        <div className="w-full   bg-white h-auto">
          <div className="flex gap-4  items-center">
            <Button
              onClick={handlePeriodChange("all")}
                            className={`w-14 md:w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-dark ${period === "all" ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}

            >
              All
            </Button>
            {teamPeriodList?.data?.map((p) => (
              <Button
                key={p.fcYearMonth}
                onClick={handlePeriodChange(p.fcYearMonth)}
                                className={`w-18 md:w-28   flex justify-center items-center   text-white rounded-full text-sm hover:bg-dark ${period === p.fcYearMonth ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}

              >
                {p.fcYearMonth}
              </Button>
            ))}
          </div>
        </div>

        {/* Dynamic Hierarchical Team Structure */}
        <div className="space-y-8">
          {/* Level 1: 直属パートナー */}
          {level1Members.length > 0 && (
            <div className="">
              <div className="px-3 md:px-6 py-3">
                <h3 className="font-bold text-sm">
                  直属パートナー　{level1Members.length}人
                </h3>
              </div>

              <div className="p-0 md:p-4">
                <div className="overflow-x-auto border border-gray-200 rounded-lg hidden md:block">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          NO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          レベル
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          氏名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          契約日
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          契約プラン
                        </th>
                        <th className="px-6 py-3 text-end text-xs font-bold text-black uppercase tracking-wider">
                          回数
                        </th>
                        <th className="px-6 py-3 text-end text-xs font-bold text-black uppercase tracking-wider">
                          購入金額（税別）
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          提携パートナー（人数）
                        </th>
                        <th className="px-6 py-3 text-end text-xs font-bold text-black uppercase tracking-wider">
                          お祝金
                        </th>
                        {userDetail?.data?.currentPlan.fcPlanMasterId !==
                          FcUserRole.NORMAL && (
                          <th className="px-6 py-3 text-end text-xs font-bold text-black uppercase tracking-wider">
                            管理金
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          紹介リンク
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <TableRow
                              key={index}
                              className="border-b border-black/10"
                            >
                              <TableCell
                                colSpan={11}
                                className="h-10 text-center"
                              >
                                <Skeleton className="w-full h-full bg-white-bg" />
                              </TableCell>
                            </TableRow>
                          ))
                        : level1Members.map((member, memberIndex) => (
                            <tr key={memberIndex} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {memberIndex + 1}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {member.level}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {member.buyerName}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {formatDate2(member.contractStartDate)}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {member.buyerPlanName}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-end">
                                {member.totalOrderCount}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-end">
                                ¥
                                {member.buyerTotalAmount.toLocaleString(
                                  "ja-JP",
                                )}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                                {member.buyerTotalMember}人
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-end">
                                ¥
                                {Number(
                                  member.buyerTotalMemberFee,
                                ).toLocaleString("ja-JP")}
                              </td>

                              {userDetail?.data?.currentPlan.fcPlanMasterId !==
                                FcUserRole.NORMAL && (
                                <td className="px-6 py-4 whitespace-nowrap text-end text-sm ">
                                  ¥
                                  {Number(member.buyerAdminFee).toLocaleString(
                                    "ja-JP",
                                  )}
                                </td>
                              )}

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">
                                <Copy
                                  size={20}
                                  className="opacity-50 hover:opacity-85 cursor-pointer"
                                  onClick={() => handleCopyLink(member.userId)}
                                />
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Style */}
                <div className="sm:hidden">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-32 my-2 w-full text-center">
                        <Skeleton className="w-full h-full bg-white-bg" />
                      </div>
                    ))
                  ) : level1Members.length > 0 ? (
                    level1Members.map((member, memberIndex) => {
                      const items = [
                        { label: "NO", value: memberIndex + 1 },
                        { label: "レベル", value: member.level || "-" },
                        {
                          label: "氏名",
                          value: member.buyerName,
                        },
                        {
                          label: "契約日",
                          value: formatDate2(member.contractStartDate),
                        },
                        {
                          label: "契約プラン",
                          value: member.buyerPlanName,
                        },
                        {
                          label: "回数",
                          value: member.totalOrderCount,
                        },
                        {
                          label: "購入金額（税別）",
                          value: `¥${member.buyerTotalAmount.toLocaleString(
                            "ja-JP",
                          )}`,
                        },
                        {
                          label: "提携パートナー（人数）",
                          value: member.buyerTotalMember + "人",
                        },
                        {
                          label: "お祝金",
                          value: `¥${Number(
                            member.buyerTotalMemberFee,
                          ).toLocaleString("ja-JP")}`,
                        },
                      ];

                      // Conditionally add the admin fee item if user is not NORMAL
                      if (
                        userDetail?.data?.currentPlan.fcPlanMasterId !==
                        FcUserRole.NORMAL
                      ) {
                        items.push({
                          label: "紹介リンク",
                          value: `¥${Number(
                            member.buyerAdminFee,
                          ).toLocaleString("ja-JP")}`,
                        });
                      }

                      return (
                        <MobileTableCard key={memberIndex} items={items} />
                      );
                    })
                  ) : (
                    <div>
                      <div className="px-6 py-3 text-center text-sm text-gray-500">
                        レコードがありません
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other Levels: 提携パートナー */}
          {otherLevels.length > 0 && (
            <div className="">
              <div className="px-6 py-3">
                <h3 className="font-bold text-sm">
                  提携パートナー　{totalOtherMembers}人
                </h3>
              </div>

              <div className="p-4 space-y-6 hidden md:block">
                {otherLevels.map((level) => {
                  const members = membersByLevel[level];

                  return (
                    <div key={level}>
                      <div className="mb-2">
                        <span className="text-black font-semibold text-sm">
                          {level}レベル
                        </span>
                      </div>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                NO
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                レベル
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                氏名
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                契約日
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                契約プラン
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                回数
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                購入金額（税別）
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                提携パートナー（人数）
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                お祝金
                              </th>
                              {userDetail?.data?.currentPlan.fcPlanMasterId !==
                                FcUserRole.NORMAL && (
                                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                  管理金
                                </th>
                              )}
                              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                紹介リンク
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading
                              ? Array.from({ length: 5 }).map((_, index) => (
                                  <TableRow
                                    key={index}
                                    className="border-b border-black/10"
                                  >
                                    <TableCell
                                      colSpan={11}
                                      className="h-10 text-center"
                                    >
                                      <Skeleton className="w-full h-full bg-white-bg" />
                                    </TableCell>
                                  </TableRow>
                                ))
                              : members.map((member, memberIndex) => (
                                  <tr
                                    key={memberIndex}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {memberIndex + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {member.level}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {member.buyerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {formatDate2(member.contractStartDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {member.buyerPlanName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {member.totalOrderCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {member.buyerTotalAmount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {member.buyerTotalMember}人
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {member.buyerTotalMemberFee}
                                    </td>
                                    {userDetail?.data?.currentPlan
                                      .fcPlanMasterId !== FcUserRole.NORMAL && (
                                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {member.buyerAdminFee}
                                      </td>
                                    )}

                                    {/* TODO: referlink */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">
                                      <Copy
                                        size={20}
                                        className="opacity-50 hover:opacity-85 cursor-pointer"
                                        onClick={() =>
                                          handleCopyLink(member.userId)
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Card Style */}
              <div className="sm:hidden">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-32 my-2 w-full text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </div>
                  ))
                ) : otherLevels.length > 0 ? (
                  <>
                    {otherLevels.map((level) => {
                      const members = membersByLevel[level];

                      return members.length > 0 ? (
                        <div key={level}>
                          <div className="mb-2 px-6 py-3">
                            <span className="text-black font-semibold text-sm">
                              {level}レベル
                            </span>
                          </div>
                          {members.map((member, memberIndex) => {
                            const items = [
                              { label: "No.", value: memberIndex + 1 },
                              { label: "レベル", value: member.level || "-" },
                              {
                                label: "氏名",
                                value: member.buyerName,
                              },
                              {
                                label: "契約日",
                                value: formatDate2(member.contractStartDate),
                              },
                              {
                                label: "契約プラン",
                                value: member.buyerPlanName,
                              },
                              {
                                label: "回数",
                                value: member.totalOrderCount,
                              },
                              {
                                label: "購入金額（税別）",
                                value: `¥${member.buyerTotalAmount.toLocaleString(
                                  "ja-JP",
                                )}`,
                              },
                              {
                                label: "提携パートナー（人数）",
                                value: member.buyerTotalMember + "人",
                              },
                              {
                                label: "お祝金",
                                value: `¥${Number(
                                  member.buyerTotalMemberFee,
                                ).toLocaleString("ja-JP")}`,
                              },
                            ];

                            // Conditionally add the admin fee item if user is not NORMAL
                            if (
                              userDetail?.data?.currentPlan.fcPlanMasterId !==
                              FcUserRole.NORMAL
                            ) {
                              items.push({
                                label: "紹介リンク",
                                value: `¥${Number(
                                  member.buyerAdminFee,
                                ).toLocaleString("ja-JP")}`,
                              });
                            }

                            return (
                              <MobileTableCard
                                key={memberIndex}
                                items={items}
                              />
                            );
                          })}
                        </div>
                      ) : null;
                    })}
                  </>
                ) : (
                  <div>
                    <div className="px-6 py-3 text-center text-sm text-gray-500">
                      レコードがありません
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FCMyTeamPage;
