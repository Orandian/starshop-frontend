"use client";

import ImageComponent from "@/components/fc/ImageComponent";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserDetailById } from "@/hooks/fc";
import { useTeam } from "@/hooks/fc/useTeam";
import { getUser } from "@/lib/api/auth";
import Graph from "@/public/fc/graph.svg";
import { TeamList } from "@/types/fc";
import { formatDate2, getPublicUrl } from "@/utils";
import { FcUserRole } from "@/utils/fc/fc-user-roles";
import { Crown, List, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";

// User Detail Panel Component using Shadcn Sheet
const UserDetailPanel = ({
  user,
  open,
  onClose,
}: {
  user: TeamList | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="bg-white w-[400px] sm:w-[400px] p-6">
        <SheetHeader>
          <SheetTitle className="text-center">メンバー詳細</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center pt-4 ">
          {/* User Photo */}
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gray-200">
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
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* User Name */}
          <h3 className="text-lg font-bold mb-6">{user.memberName}</h3>

          {/* User Details */}
          <div className="w-full space-y-0 bg-gray-200 p-4 rounded-md">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">契約プラン</span>
              <span className="font-medium">{user.planName}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">契約日</span>
              <span className="font-medium">
                {formatDate2(user.contractDate)}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">下のメンバー</span>
              <span className="font-medium">{user.underMemberCount}人</span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">累計ボーナス</span>
              <span className="font-medium">
                ¥{user.bonusAmount?.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">今月の購入額</span>
              <span className="font-medium">
                ¥{user.thisMonthOrderAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// User card component
const UserCard = ({
  user,
  onClick,
  shouldBlur,
  rootParentUser,
}: {
  user: TeamList;
  onClick: () => void;
  uid: number;
  shouldBlur: boolean;
  rootParentUser: TeamList | null;
}) => (
  <div
    className="flex flex-col items-center  relative cprursor-pointer hover:opacity-80 transition-opacity mt-4"
    onClick={onClick}
  >
    <div className="bg-white relative rounded-lg shadow-md border border-gray-200 p-4 min-w-[150px] max-w-[200px]">
      {/* Crown icon for top performer - show if they have many members */}

      {/* Role/Plan name */}
      <div className="text-center mb-2">
        <h3 className="text-sm flex justify-center gap-2 font-bold text-gray-900">
          {user.memberName}
          {user.contractPlan === 2 && (
            <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          )}{" "}
        </h3>
      </div>

      {/* {user.contractPlan === 2 && (
      <div className="absolute -top-3">
        <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
      </div>
    )} */}

      {/* User avatar */}
      <div className="flex justify-center mb-0">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-gray-200">
          {user.userPhoto &&
          user.userPhoto.trim() !== "" &&
          user.userPhoto.length > 4 &&
          !shouldBlur &&
          (user.userPhoto.startsWith("http://") ||
            user.userPhoto.startsWith("https://") ||
            user.userPhoto.startsWith("/")) ? (
            <ImageComponent
              imgURL={getPublicUrl(user.userPhoto)}
              imgName={user.memberName}
              className={`object-cover w-full h-full ${shouldBlur ? "blur-md" : ""}`}
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-500">
              <User className={`w-10 h-10 ${shouldBlur ? "blur-md" : ""}`} />
            </div>
          )}
        </div>
      </div>

      

       {/* Role */}
      {/* <div className="text-center mb-2">
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
      </div> */}

      {/* Contract plan or member count */}
      {rootParentUser?.fcId !== user.fcId && (
        <div
          className={`text-sm  bg-gray-200 p-2 rounded-md  ${shouldBlur ? "blur-xs" : ""}`}
        >
          ¥{shouldBlur ? "0" : user.totalOrderAmount?.toLocaleString("ja-JP")}
        </div>
      )}
    </div>
  </div>
);

// Build tree recursively
const buildTree = (
  users: TeamList[],
  parentId: number | null = null,
  onUserClick: (user: TeamList) => void,
  uid: number,
  shouldBlurUser: (user: TeamList) => boolean,
  rootParentUser: TeamList | null,
): JSX.Element[] => {
  const children = users.filter((user) => user.referrerId === parentId);

  return children.map((user) => {
    const descendants = buildTree(
      users,
      user.fcId,
      onUserClick,
      uid,
      shouldBlurUser,
      rootParentUser,
    );

    if (descendants.length > 0) {
      return (
        <TreeNode
          key={user.fcId}
          label={
            <UserCard
              user={user}
              onClick={() => (shouldBlurUser(user) ? "" : onUserClick(user))}
              uid={uid}
              shouldBlur={shouldBlurUser(user)}
              rootParentUser={rootParentUser}
            />
          }
        >
          {descendants}
        </TreeNode>
      );
    }

    return (
      <TreeNode
        key={user.fcId}
        label={
          <UserCard
            user={user}
            onClick={() => (shouldBlurUser(user) ? "" : onUserClick(user))}
            uid={uid}
            shouldBlur={shouldBlurUser(user)}
            rootParentUser={rootParentUser}
          />
        }
      />
    );
  });
};

const FCMyTeamPage = () => {
  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState<TeamList | null>(null);

  const { data: teamList, isLoading } = useTeam();
  const [uid, setUserId] = useState<number>();

  const users: TeamList[] =
    teamList?.data && Array.isArray(teamList?.data) ? teamList.data : [];
  const rootUser = users.find((user) => user.fcId === uid) || users[0];

  const { data } = useUserDetailById(rootUser?.referrerId?.toString());

  const rootParentUser = useMemo(() => {
    if (!data?.data?.fcId || !data?.data?.role) {
      return null;
    }

    return {
      fcId: data.data.fcId,
      referrerId: data.data.referrerId,
      role: data.data.role,
      planName: data.data.currentPlan.planName ?? "",
      memberName: data.data.user.username ?? "",
      userPhoto: data.data.user.userPhoto ?? null,
      contractDate: formatDate2(data.data.contractStartDt) || "",
      contractPlan: data.data.contractPlan.fcPlanMasterId ?? 0,
      bonusAmount: 0,
      thisMonthOrderAmount: 0,
      underMemberCount: 0,
      totalOrderAmount: 0,
    };
  }, [data]);

  const allUsers = rootParentUser ? [rootParentUser, ...users] : users;

  const shouldBlurUser = (user: TeamList) => {
    if (!rootUser) return false;

    // Get the hierarchy level (0 for root's parent or root, 1 for children, etc.)
    const getLevel = (targetUser: TeamList, currentLevel = 0): number => {
      if (targetUser.fcId === (rootParentUser?.fcId || rootUser?.fcId))
        return currentLevel;

      // Search in both users array and rootParentUser for the parent
      let parent = users.find((u) => u.fcId === targetUser.referrerId);
      if (
        !parent &&
        rootParentUser &&
        targetUser.referrerId === rootParentUser.fcId
      ) {
        parent = rootParentUser;
      }
      if (!parent) return currentLevel;

      return getLevel(parent, currentLevel + 1);
    };
    const userLevel = getLevel(user);

    // Blur when current user role is 4 (no access) AND level is 3 or higher
    const shouldBlur = rootUser.role === FcUserRole.NORMAL && userLevel >= 3;
    return shouldBlur;
  };

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (user?.userId) {
        setUserId(Number(user.userId));
      }
    };

    loadUser();
  }, [router]);

  return (
    <section className="w-full">
      <div className="w-full px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto  ">
        {/* 契約書 */}
        <div className="flex flex-col justify-between items-center mb-4">
          <div className="w-full flex justify-between items-center">
            <h2 className="my-4 font-bold">私のチーム</h2>
            <div className="flex justify-center items-center gap-2">
              <Link
                href="/fc/myteam/graph"
                className="cursor-pointer bg-black hover:bg-dark/50 px-4 py-2 rounded-lg"
              >
                <ImageComponent
                  imgURL={Graph.src}
                  imgName="graph"
                  className="size-4.5 text-white"
                />
              </Link>
              <Link
                href="/fc/myteam/list"
                className=" cursor-pointer bg-foreground text-disabled hover:bg-dark/50  px-4 py-2 rounded-lg "
              >
                <List className="size-5" />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-center">
                {/* Root user skeleton */}
                <div className="flex flex-col items-center mb-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-full shadow-sm">
                    <Skeleton className="w-12 h-12 rounded-full bg-white-bg" />
                  </div>

                  {/* Child level 1 skeletons */}
                  <div className="flex space-x-8 mt-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-full shadow-sm  mt-2">
                          <Skeleton className="w-10 h-10 rounded-full bg-white-bg" />
                        </div>

                        {/* Child level 2 skeletons */}
                        <div className="flex space-x-20 mt-2">
                          {[1, 2].map((j) => (
                            <div key={j} className="flex flex-col items-center">
                              <div className="flex items-center space-x-2 p-2 bg-white rounded-full shadow-sm  mt-2">
                                <Skeleton className="w-8 h-8 rounded-full bg-white-bg" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              {rootUser && uid !== undefined ? (
                <Tree
                  lineWidth={"1px"}
                  lineColor={"gray"}
                  lineBorderRadius={"5px"}
                  label={
                    <UserCard
                      user={rootParentUser || rootUser}
                      onClick={() =>
                        !rootParentUser && setSelectedUser(rootUser)
                      }
                      uid={uid}
                      shouldBlur={shouldBlurUser(rootParentUser || rootUser)}
                      rootParentUser={rootParentUser}
                    />
                  }
                >
                  {buildTree(
                    allUsers,
                    rootParentUser?.fcId || rootUser.fcId,
                    setSelectedUser,
                    uid,
                    shouldBlurUser,
                    rootParentUser,
                  )}
                </Tree>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  チームメンバーがいません
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Detail Panel */}
      <UserDetailPanel
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </section>
  );
};

export default FCMyTeamPage;
