import SenderSidebar from "@/components/SenderSidebar";

export default function SenderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full h-full">
            <SenderSidebar />
            {children}
        </div>
    );
}
