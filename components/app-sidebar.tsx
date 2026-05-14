"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    ReceiptDollarIcon,
    Folder01Icon,
    DocumentCodeIcon,
} from "@hugeicons/core-free-icons"
import { usePathname } from "next/navigation"
import { UserButton, useUser, useClerk } from "@clerk/nextjs"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname() || ""
    const { user, isSignedIn } = useUser()
    const { signOut } = useClerk()

    return (
        <Sidebar collapsible="icon" {...props}>
            {/* Header - Company/Org */}
            <SidebarHeader className="pt-6 pb-4 px-4">
                <div className="flex items-center gap-3">
                    <div className="flex aspect-square -ml-2 size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path d="M5.25 2.25a3 3 0 0 0-3 3v13.5a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V8.25l-6-6H5.25ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" />
                        </svg>
                    </div>
                    <div className="grid flex-1 text-left text-2xl leading-tight">
                        <span className="truncate tracking-tight font-serif">Invoicely</span>
                    </div>
                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent className="px-2 space-y-4">
                {/* Navigation Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground/80 font-medium tracking-wide">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/invoices")} className="h-10">
                                    <Link href="/invoices">
                                        <HugeiconsIcon icon={DocumentCodeIcon} size={20} strokeWidth={2.5} />
                                        <span className="text-sm font-medium">Invoices</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/assets")} className="h-10">
                                    <Link href="/assets">
                                        <HugeiconsIcon icon={Folder01Icon} size={20} strokeWidth={2.5} />
                                        <span className="text-sm font-medium">Manage Assets</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Create Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground/80 font-medium tracking-wide">
                        Create
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/templates")} className="h-10">
                                    <Link href="/templates">
                                        <HugeiconsIcon icon={Folder01Icon} size={20} strokeWidth={2.5} />
                                        <span className="text-sm font-medium">Templates</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/create")} className="h-10">
                                    <Link href="/create">
                                        <HugeiconsIcon icon={ReceiptDollarIcon} size={20} strokeWidth={2.5} />
                                        <span className="text-sm font-medium">Create Invoice</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="p-4 space-y-4">
                {isSignedIn ? (
                    <div className="flex items-center gap-3 rounded-xl bg-accent/50 px-3 py-3">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "size-8",
                                },
                            }}
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                            <span className="truncate font-medium">{user?.fullName || user?.firstName || "User"}</span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user?.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                        <button
                            onClick={() => signOut({ redirectUrl: "/sign-in" })}
                            title="Sign out"
                            className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors group-data-[collapsible=icon]:hidden"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 rounded-2xl dark:bg-[#1c1c1e] bg-white/10 p-5 shadow-sm ring-1 ring-white/5">
                        <h3 className="font-serif text-xl font-medium tracking-tight dark:text-white text-black">Login</h3>
                        <p className="text-sm font-medium leading-relaxed text-muted-foreground/80">
                            Login to your account to save your data and access your data anywhere
                        </p>
                        <Link
                            href="/sign-in"
                            className="self-start rounded-lg bg-indigo-500 hover:bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors mt-1"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
