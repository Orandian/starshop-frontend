"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Crown, User, Printer, List } from "lucide-react";
import { Tree, TreeNode } from "react-organizational-chart";
import ImageComponent from "@/components/fc/ImageComponent"; //ToDo: recheck and replace if needed
import { useTeam, TeamList } from "@/hooks/admin/useTeam";
import { getPublicUrl } from "@/utils";
import Graph from "@/public/fc/graph.svg";
import Link from "next/link";

// User card component
const UserCard = ({ user }: { user: TeamList; uid: number }) => (
  <div className="flex flex-col items-center relative hover:opacity-90 transition-opacity">
    {/* Card container */}
    <div className="bg-white relative rounded-lg shadow-md border border-gray-200 p-4 min-w-[150px] max-w-[200px]">
      {/* Crown icon for special users */}

      {/* Role/Plan name */}
      <div className="text-center mb-2">
        <h3 className="text-sm flex justify-center gap-2 font-bold text-gray-900">
          {user.planName}
          {user.contractPlan === 2 && (
            <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          )}{" "}
        </h3>
      </div>

      {/* User avatar */}
      <div className="flex justify-center mb-0">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
          {user.userPhoto &&
          user.userPhoto.trim() !== "" &&
          user.userPhoto.length > 4 &&
          (user.userPhoto.startsWith("http://") ||
            user.userPhoto.startsWith("https://") ||
            user.userPhoto.startsWith("/")) ? (
            <ImageComponent
              imgURL={getPublicUrl(user.userPhoto)}
              imgName={user.memberName}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-500">
              <User />
            </div>
          )}
        </div>
      </div>

      {/* User name */}
      <div className="text-center mb-1">
        <p className="text-sm font-medium text-gray-900">{user.memberName}</p>
      </div>

      {/* Role */}
      <div className="text-center mb-2">
        <p className="text-xs font-bold text-gray-900">
          {user.role === 1
            ? "代理店マネージャー"
            : user.role === 2
              ? "代理店コンサルタント"
              : user.role === 3
                ? "代理店リーダー"
                : user.role === 4
                  ? "代理店スペシャリスト"
                  : "代理店メンバー"}
        </p>
      </div>
    </div>
  </div>
);

// Build tree recursively
const buildTree = (
  users: TeamList[],
  parentId: number | null = null,
  uid: number,
): JSX.Element[] => {
  const children = users.filter((user) => user.referrerId === parentId);

  return children.map((user) => {
    const descendants = buildTree(users, user.fcId, uid);
    if (descendants.length > 0) {
      return (
        <TreeNode key={user.fcId} label={<UserCard user={user} uid={uid} />}>
          {descendants}
        </TreeNode>
      );
    }

    return (
      <TreeNode key={user.fcId} label={<UserCard user={user} uid={uid} />} />
    );
  });
};

const AdminCustomerTeamPage = () => {
  const { data: teamList, isLoading } = useTeam();
  const uid = teamList?.find((user) => user.referrerId === null)?.fcId;
  const users: TeamList[] = Array.isArray(teamList) ? teamList : [];
  const rootUser = users.find((user) => user.fcId === uid);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-5rem)]">
        <Skeleton className="w-full h-full bg-gray-100!" />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          /* Set landscape orientation */
          @page {
            size: landscape;
            margin: 15mm;
          }

          /* Hide everything except the printable content */
          body * {
            visibility: hidden;
          }
          #printable-content,
          #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Hide the print button when printing */
          .print-button {
            display: none !important;
          }
          /* Remove padding/margin for print */
          #printable-content {
            padding: 20px;
          }
        }
      `}</style>

      <section className="px-4 md:px-10  md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        {/* back */}
        <div className="flex justify-between items-center mb-4">
          <h2>代理店組織図</h2>
        </div>

        <div className="flex justify-end items-center gap-2">
          <Link
            href="/admin/customers/fc-organization/"
            className="cursor-pointer bg-black hover:bg-dark/50 px-4 py-2 rounded-lg"
          >
            <ImageComponent
              imgURL={Graph.src}
              imgName="graph"
              className="size-4.5 text-white"
            />
          </Link>
          <Link
            href="/admin/customers/fc-organization/list"
            className=" cursor-pointer bg-foreground text-disabled hover:bg-dark/50  px-4 py-2 rounded-lg "
          >
            <List className="size-5" />
          </Link>
        </div>

        <Button
          onClick={handlePrint}
          className="print-button  float-end bg-primary hover:bg-primary/80 text-white flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          印刷
        </Button>

        {/* <div ref={formRef}> */}
        {/* <A4DocumentTemplate mode="landscape"> */}
        {/* 契約書 */}
        <div id="printable-content">
          <div className="flex flex-col justify-between items-center mb-4 clear-both">
            <div className="w-full overflow-x-auto">
              {rootUser && uid !== undefined ? (
                <Tree
                  lineWidth={"1px"}
                  lineColor={"gray"}
                  lineBorderRadius={"5px"}
                  label={<UserCard user={rootUser} uid={uid} />}
                >
                  {buildTree(users, rootUser.fcId, uid)}
                </Tree>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  チームメンバーがいません
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminCustomerTeamPage;
