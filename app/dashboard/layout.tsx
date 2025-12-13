"use client"

import DashNavbar from "@/components/DashNavbar"
import { BASE_TABS } from "@/lib/consts"
import { ReactNode } from "react"

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {

    return (
        <div className="max-w-350 mx-auto p-5 md:p-15">
            <DashNavbar tabs={BASE_TABS} businessName="Chiringuito"/>
            {children}
        </div>
    )
}