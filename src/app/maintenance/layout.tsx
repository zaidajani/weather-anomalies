import { AppShell } from "@/components/app-shell";
export default function Layout({children}:{children:React.ReactNode}) { return <AppShell portal="maintenance">{children}</AppShell>; }
