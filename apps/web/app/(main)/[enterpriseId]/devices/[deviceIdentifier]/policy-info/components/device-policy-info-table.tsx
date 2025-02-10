"use client";

import {
  AndroidManagementDevice,
  DevicePolicyInfoType,
  HardwareInfoSourceType,
  PolicyDisplayNameType,
} from "@/app/types/device";
import CopyButton from "@/components/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import LoadingWithinPageSkeleton from "@/app/(main)/[enterpriseId]/components/loading-within-page-sleleton";
import InformationTooltip from "@/components/information-tooltip";
import useSWRImmutable from "swr/immutable";
import { getDevicePolicyInfo, getHardwareInfo } from "../../actions/device";
import { Badge } from "@/components/ui/badge";

export function DevicePolicyInfoTable({
  deviceSource,
  enterpriseId,
  deviceIdentifier,
}: {
  deviceSource: DevicePolicyInfoType;
  enterpriseId: string;
  deviceIdentifier: string;
}) {
  // const key = `/api/devices/${enterpriseId}/${deviceIdentifier}`;
  // const { data, error, isLoading, isValidating } =
  //   useSWRImmutable<DevicePolicyInfoType>(
  //     key,
  //     () => {
  //       return getDevicePolicyInfo({ enterpriseId, deviceIdentifier });
  //     }
  //     // {
  //     //   fallbackData: deviceSource,
  //     // }
  //   );
  // if (error) return <div>エラーが発生しました</div>;
  // if (isLoading || isValidating) return <LoadingWithinPageSkeleton />;
  // if (!data) return null;
  // const policyDisplayName = data.currentPolicy?.policyDisplayName;
  // const requestedPolicyDisplayName =
  //   data.requestedPolicy?.requestedPolicyDisplayName;
  // const deviceData = data.device as AndroidManagementDevice;
  const policyDisplayName = deviceSource?.currentPolicy?.policyDisplayName;
  const requestedPolicyDisplayName =
    deviceSource?.requestedPolicy?.requestedPolicyDisplayName;
  const deviceData = deviceSource?.device as AndroidManagementDevice;
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>ポリシー情報</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">項目</TableHead>
              <TableHead className="w-2/3">値</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">適用済みポリシー</span>
                  <InformationTooltip
                    tooltip={"現在、適用されているポリシーを表示します。"}
                  />
                </div>
              </TableCell>
              <TableCell>
                {policyDisplayName ? (
                  <div className="flex items-center gap-2">
                    <span>{policyDisplayName}</span>
                    {policyDisplayName !== requestedPolicyDisplayName && (
                      <>
                        <Badge className="bg-yellow-500 text-white">
                          適用待ち
                        </Badge>
                        <span className="text-muted-foreground">
                          {`現在、「${requestedPolicyDisplayName}」にポリシー変更のリクエストがされています。`}
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">MACアドレス</span>
                  <InformationTooltip
                    tooltip={
                      "Wi-FiのMACアドレスを表示します。例 : 7c:11:11:11:11:11"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {deviceData?.networkInfo?.wifiMacAddress ? (
                  <div className="flex items-center gap-2">
                    <span>{deviceData.networkInfo.wifiMacAddress}</span>
                    <CopyButton value={deviceData.networkInfo.wifiMacAddress} />
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            {deviceData.networkInfo?.telephonyInfos ? (
              deviceData.networkInfo?.telephonyInfos.map(
                (telephonyInfo, index) => (
                  <TableRow key={`telephony-info-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">SIM{index + 1}</span>
                        <InformationTooltip
                          tooltip={
                            "デバイスに搭載されているSIMの情報を表示します。Android API レベル 23 以降の管理モード「デバイスオーナー」のデバイスのみサポートしています。"
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {telephonyInfo.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <span>電話番号 : {telephonyInfo.phoneNumber}</span>
                            <CopyButton value={telephonyInfo.phoneNumber} />
                          </div>
                        )}
                        {telephonyInfo.carrierName && (
                          <div className="flex items-center gap-2">
                            <span>
                              キャリア情報 : {telephonyInfo.carrierName}
                            </span>
                          </div>
                        )}
                        {telephonyInfo.iccId && (
                          <div className="flex items-center gap-2">
                            <span>ICCID : {telephonyInfo.iccId}</span>
                            <CopyButton value={telephonyInfo.iccId} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">SIM</span>
                    <InformationTooltip
                      tooltip={
                        "デバイスに搭載されているSIMの情報を表示します。Android API レベル 23 以降の管理モード「デバイスオーナー」のデバイスのみサポートしています。"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">-</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
