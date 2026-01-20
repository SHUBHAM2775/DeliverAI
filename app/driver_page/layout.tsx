import DriverSidebar from "@/components/DriverSidebar";

export default function DriverLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full h-full">
            <DriverSidebar />
            {children}
        </div>
    );
}
