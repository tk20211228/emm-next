import { RouteParams } from "@/app/types/enterprise";
import { HardwareBatteryTemperatureChart } from "./components/charts/hardware-battery-temperature-chart";
import { HardwareCpuUsagesChart } from "./components/charts/hardware-cpu-chart";
import { HardwareCpuTemperatureChart } from "./components/charts/hardware-cpu-temperature-chart";
import { HardwareGpuTemperatureChart } from "./components/charts/hardware-gpu-temperature-chart";
import { HardwareSkinTemperatureChart } from "./components/charts/hardware-skin-temperature-chart";
import { HardwareTemperaturesAverageChart } from "./components/charts/hardware-temperature-chart";
import DisplaysTable from "./components/displays-table";
import HardwareInfoTable from "./components/hardware-info-table";
import { getHardwareInfo } from "./data/hardware";
import { getHardwareStatus } from "./data/hardware-status";
import { HardwareFanSpeedsChart } from "./components/charts/hardware-fan-speeds-chart";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;
  const hardwareInfo = await getHardwareInfo({
    enterpriseId,
    deviceIdentifier,
  });
  const hardwareStatus = await getHardwareStatus({
    enterpriseId,
    deviceIdentifier,
  });
  return (
    <div className="mx-1.5 grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="flex flex-col gap-2">
        <HardwareInfoTable hardwareInfo={hardwareInfo} />
        <DisplaysTable hardwareInfo={hardwareInfo} />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <HardwareTemperaturesAverageChart hardwareStatus={hardwareStatus} />
        <HardwareCpuUsagesChart hardwareStatus={hardwareStatus} />
        <HardwareCpuTemperatureChart hardwareStatus={hardwareStatus} />
        <HardwareGpuTemperatureChart hardwareStatus={hardwareStatus} />
        <HardwareSkinTemperatureChart hardwareStatus={hardwareStatus} />
        <HardwareBatteryTemperatureChart hardwareStatus={hardwareStatus} />
        <HardwareFanSpeedsChart hardwareStatus={hardwareStatus} />
      </div>
    </div>
  );
}
