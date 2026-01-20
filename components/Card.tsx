import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className = "", ...props }: CardProps) {
    return (
        <div
            className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
