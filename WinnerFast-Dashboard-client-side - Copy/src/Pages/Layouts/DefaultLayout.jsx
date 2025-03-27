import { Outlet } from 'react-router-dom'

export function DefaultLayout() {
    return (
        <div>
            <main>
            <div className="h-full flex flex-col">
            <div className="h-screen flex items-center justify-center bg-gradient-to-r from-[#ffe1bc] via-[#ffcfd1] to-[#f3c6f1] text-black font-inter">
                <div className="grid h-[97%] w-[97%] bg-[rgba(255,255,255,0.54)] rounded-2xl overflow-hidden grid-cols-[auto_1fr] md:grid-cols-[auto_1fr] sm:grid-cols-1">
                <Outlet />
                    </div></div></div>
            </main>
        </div>
    )
}