import ReceiverSidebar from "@/components/ReceiverSidebar";

export default function ReceiverLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full h-full">
            <ReceiverSidebar />
            {children}
        </div>
    );
}
