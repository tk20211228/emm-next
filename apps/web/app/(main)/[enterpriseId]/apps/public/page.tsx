import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import PublicAppsContent from "./components/public-apps-content";
import PublicAppsIframe from "./components/public-apps-iframe";
import { RouteParams } from "@/app/types/enterprise";
import { getApps } from "../data/fetch-enterprise-apps";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const appType = "PUBLIC";
  const data = await getApps(enterpriseId, appType);
  return (
    <div className="flex flex-row h-dvh space-x-1">
      <div className=" rounded-lg hidden lg:block py-1 pl-1">
        <Suspense fallback={<div>Loading...</div>}>
          <PublicAppsContent
            enterpriseId={enterpriseId}
            data={data}
            appType={appType}
          />
        </Suspense>
      </div>
      <div className="flex-1 py-1 pr-1">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2Icon className="animate-spin size-10 text-muted-foreground/30" />
          </div>
          <PublicAppsIframe enterpriseId={enterpriseId} appType={appType} />
        </div>
      </div>
    </div>
  );
}
