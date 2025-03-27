import React, { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

export default function SideBar({ tabs, activeTab, setActiveTab }) {
    function handleTabClick(tabId, e) {
        e.preventDefault()
        setActiveTab(tabId)
    }
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={`fixed md:relative top-0 left-0 h-full w-64 p-8 border-r border-orange-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} z-40`}>
                <div className="logo flex items-center space-x-4 mb-8">
                    <span className="font-bold text-xl">
                        Winner<span className="text-orange-500">Fast</span>
                    </span>
                </div>
                <div className="menu flex flex-col gap-3">
                    {tabs.map((tab, index) => (
                        <div key={index} onClick={(e) => handleTabClick(tab.id, e)} className={`menuItem flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === tab.id ? "bg-orange-500 text-white" : "text-gray-800 hover:bg-[#ffcb79]"}`}>
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.title}</span>
                        </div>
                    ))}

                    <div className="flex items-center space-x-3 p-2 mt-8 cursor-pointer text-gray-800 hover:bg-pink-100">
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)}/>
            )}
            <button className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-orange-500 text-white" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </>
    );
}
