"use client"

import DashNavbar from "@/components/DashNavbar"
import { BASE_TABS } from "@/lib/consts"
import { ReactNode } from "react"

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {

    return (
        <div className="max-w-[1600px] mx-auto p-5 md:px-25">
            <DashNavbar tabs={BASE_TABS} businessName="Chiringuito"/>
            {children}
        </div>
    )
}