import type { Metadata } from "next";
import { PolicySidebar } from "./components/policy-sidebar";
import { PolicyFormProvider } from "../providers/policy-form-provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh">
      <PolicyFormProvider>
        <PolicySidebar />
        {/* <PolicySidebarR1 className="hidden xl:block bg-sidebar" /> */}
        {/* <PolicySidebarR2 className="hidden xl:block" /> */}
        <div className="flex-1 min-w-0">{children}</div>
      </PolicyFormProvider>
    </div>
  );
}
