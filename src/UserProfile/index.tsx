import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Account } from "@/types";
import { BuyerTab, isBuyerTab } from "./Buyer/buyerTabs";
import { SellerTab, isSellerTab } from "./Seller/sellerTabs";
import { useDebouncedValue } from "./Shared/useDebouncedValue";
import { useOrderFilterWorker } from "./Order/useOrderFilterWorker";
import { useVirtualPagination } from "./Shared/useVirtualPagination";
import { useUserProfileUIStore } from "./Core/useUserProfileUIStore";
import { UserProfileProvider, useUserProfile } from "./Core/UserProfileContext";

const BuyerConsole = lazy(() => import("./Buyer/BuyerConsole"));
const SellerConsole = lazy(() => import("./Seller/SellerConsole"));
const ProfileHeader = lazy(() => import("./Shared/components/organisms/ProfileHeader"));

interface UserProfileProps {
  onNavigate: (view: string, params?: any) => void;
  currentAccount: Account;
  initialParams?: { tab?: string; conversationId?: string };
  extraAssets?: any[];
  globalOrders?: any[];
  globalResources?: any[];
  onUpgrade?: (orderId: string, planDetails: any) => void;
  onUpdateOrder?: (orderId: string, updates: any) => void;
  onUpdateResource?: (resourceId: string, updates: any) => void;
  onAddResource?: (resource: any) => void;
}

const UserProfileContent: React.FC<UserProfileProps> = ({
  currentAccount,
  initialParams,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const displayAccount = useMemo(
    () => ({
      ...currentAccount,
      displayName: currentAccount.role === "developer" ? "COMMANDER_01" : currentAccount.name,
      orgInfo: "宝信软件 (Baosight) · ID: 88293910",
    }),
    [currentAccount]
  );

  const [consoleMode, setConsoleMode] = useState<"buyer" | "seller">(
    currentAccount.role === "viewer" ? "buyer" : "seller"
  );

  const navigateBuyerTab = useCallback((tab: BuyerTab) => {
    setConsoleMode("buyer");
    navigate(`/profile/buyer/${tab}`);
  }, [navigate]);

  const navigateSellerTab = useCallback((tab: SellerTab) => {
    if (currentAccount.role === "viewer") {
      navigate("/profile/buyer/dashboard", { replace: true });
      return;
    }
    setConsoleMode("seller");
    navigate(`/profile/seller/${tab}`);
  }, [currentAccount.role, navigate]);

  useEffect(() => {
    if (initialParams?.tab && !location.pathname.startsWith("/profile/buyer/") && !location.pathname.startsWith("/profile/seller/")) {
      if (initialParams.tab === "assets") {
        navigateSellerTab("assets");
      } else if (initialParams.tab === "orders") {
        navigateBuyerTab("orders");
      } else if (isBuyerTab(initialParams.tab)) {
        navigateBuyerTab(initialParams.tab);
      } else if (isSellerTab(initialParams.tab)) {
        navigateSellerTab(initialParams.tab);
      } else {
        navigateBuyerTab("dashboard");
      }
      return;
    }
    const queryTab = searchParams.get("tab");
    if (queryTab) {
      if (queryTab === "assets") {
        navigateSellerTab("assets");
      } else if (queryTab === "orders") {
        navigateBuyerTab("orders");
      } else if (isBuyerTab(queryTab)) {
        navigateBuyerTab(queryTab);
      } else if (isSellerTab(queryTab)) {
        navigateSellerTab(queryTab);
      } else {
        navigateBuyerTab("dashboard");
      }
      return;
    }
    if (location.pathname === "/profile" || location.pathname === "/profile/") {
      if (currentAccount.role === "viewer") {
        navigate("/profile/buyer/dashboard", { replace: true });
      } else {
        navigate("/profile/seller/assets", { replace: true });
      }
      return;
    }
    const pathParts = location.pathname.split("/").filter(Boolean);
    const routeMode = pathParts[1];
    const routeTab = pathParts[2];
    if (routeMode === "buyer" && routeTab && isBuyerTab(routeTab)) {
      setConsoleMode("buyer");
      return;
    }
    if (routeMode === "seller" && routeTab && isSellerTab(routeTab)) {
      if (currentAccount.role === "viewer") {
        navigate("/profile/buyer/dashboard", { replace: true });
        return;
      }
      setConsoleMode("seller");
      return;
    }
    if (currentAccount.role === "viewer") {
      navigate("/profile/buyer/dashboard", { replace: true });
    } else {
      navigate("/profile/seller/assets", { replace: true });
    }
  }, [initialParams, location.pathname, searchParams, currentAccount.role]);

  const handleConsoleModeChange = useCallback((mode: "buyer" | "seller") => {
    if (mode === "buyer") {
      navigateBuyerTab("dashboard");
      return;
    }
    navigateSellerTab("assets");
  }, [navigateBuyerTab, navigateSellerTab]);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-6 md:p-8 relative">
      <div className="max-w-6xl mx-auto pb-20">
        <Suspense fallback={<div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">加载中...</div>}>
          <ProfileHeader
            displayAccount={displayAccount}
            consoleMode={consoleMode}
            onConsoleModeChange={handleConsoleModeChange}
            role={currentAccount.role}
          />
        </Suspense>
        <Suspense fallback={<div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">工作台加载中...</div>}>
          <Routes>
          <Route
            path="buyer/*"
            element={
              <BuyerConsole />
            }
          />
          <Route
            path="seller/*"
            element={
              <SellerConsole />
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={currentAccount.role === "viewer" ? "buyer/dashboard" : "seller/assets"}
                replace
              />
            }
          />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

const UserProfile: React.FC<UserProfileProps> = (props) => {
  return (
    <UserProfileProvider {...props} consoleMode={props.currentAccount.role === "viewer" ? "buyer" : "seller"}>
      <UserProfileContent {...props} />
    </UserProfileProvider>
  );
};

export default UserProfile;
