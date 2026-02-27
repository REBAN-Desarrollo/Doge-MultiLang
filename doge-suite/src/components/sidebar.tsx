"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    Image as ImageIcon,
    Mic,
    Globe,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Definición de módulos de navegación
const NAV_ITEMS = [
    {
        label: "Overview",
        href: "/",
        icon: LayoutDashboard,
        color: "text-zinc-400",
    },
    {
        label: "Guión",
        href: "/guion",
        icon: FileText,
        color: "text-blue-400",
    },
    {
        label: "Assets",
        href: "/assets",
        icon: ImageIcon,
        color: "text-emerald-400",
    },
    {
        label: "Audio",
        href: "/audio",
        icon: Mic,
        color: "text-amber-400",
    },
    {
        label: "Localización",
        href: "/localization",
        icon: Globe,
        color: "text-violet-400",
        badge: "MVP",
    },
] as const;

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "flex h-screen flex-col border-r border-sidebar-border",
                "bg-sidebar transition-all duration-300 ease-in-out",
                collapsed ? "w-[68px]" : "w-[240px]"
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
                <NextImage
                    src="/logo.png"
                    alt="DOGE Suite"
                    width={36}
                    height={36}
                    className="shrink-0 rounded-lg"
                />
                {!collapsed && (
                    <div className="animate-fade-in overflow-hidden">
                        <h1 className="text-sm font-bold tracking-tight">
                            DOGE Suite
                        </h1>
                        <p className="text-[10px] text-muted-foreground">
                            Creative Pipeline
                        </p>
                    </div>
                )}
            </div>

            {/* Navegación */}
            <nav className="flex-1 space-y-1 p-3">
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" &&
                            pathname.startsWith(item.href));

                    return (
                        <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-lg",
                                        "px-3 py-2.5 text-sm font-medium",
                                        "transition-all duration-200",
                                        isActive
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground hover:bg-accent/50 " +
                                            "hover:text-foreground"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-4.5 w-4.5 shrink-0 transition-colors",
                                            isActive
                                                ? item.color
                                                : "text-muted-foreground " +
                                                "group-hover:" + item.color
                                        )}
                                    />
                                    {!collapsed && (
                                        <span className="animate-fade-in truncate">
                                            {item.label}
                                        </span>
                                    )}
                                    {!collapsed &&
                                        "badge" in item &&
                                        item.badge && (
                                            <span
                                                className={cn(
                                                    "ml-auto rounded-full px-1.5 py-0.5",
                                                    "text-[10px] font-semibold",
                                                    "bg-violet-500/20 text-violet-300"
                                                )}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                </Link>
                            </TooltipTrigger>
                            {collapsed && (
                                <TooltipContent side="right">
                                    {item.label}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    );
                })}
            </nav>

            {/* Botón de colapsar */}
            <div className="border-t border-sidebar-border p-3">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "flex w-full items-center justify-center",
                        "rounded-lg py-2 text-muted-foreground",
                        "transition-colors hover:bg-accent/50",
                        "hover:text-foreground"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
            </div>
        </aside>
    );
}
