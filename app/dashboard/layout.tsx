import { ReactNode } from "react"

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {

    return (
        <div className="max-w-350 mx-auto p-5 md:p-15">
            {children}
        </div>
    )
}