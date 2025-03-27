import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Package, BarChart3, CircleDollarSign, HandCoins, Wallet, LogOut } from 'lucide-react';
import SideBar from "../Components/sideBar"
import Statistics from "../Components/dashboard/statistics"
import SupplierOfTable from '../Components/suppliers/supplierOfTable';
import Products from '../Components/products/products';
import SellsTable from '../Components/sells/sellsTable';
import ExpensesTable from '../Components/expenses/expensesTable';
import WalletSection from '../Components/wallet/wallet';


const tabs = [
    { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
    { id: "suppliers", title: "My suppliers", icon: Users },
    { id: "products", title: "Product", icon: Package },
    { id: "sells", title: "Sell", icon: CircleDollarSign },
    { id: "expenses", title: "Expense", icon: HandCoins },
    { id: "wallet", title: "Wallet", icon: Wallet },
    { id: "statistics", title: "analytics", icon: BarChart3 },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    return (
        <div className="h-full flex flex-col">
            <div className="h-screen flex items-center justify-center bg-gradient-to-r from-[#ffe1bc] via-[#ffcfd1] to-[#f3c6f1] text-black font-inter">
                <div className="grid h-[97%] w-[97%] bg-[rgba(255,255,255,0.54)] rounded-2xl overflow-hidden grid-cols-[auto_1fr] md:grid-cols-[auto_1fr] sm:grid-cols-1">
                    <SideBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="p-8 overflow-y-auto">
                        {activeTab === "dashboard" && (
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome to your Dashboard
                                </h1>
                                <Statistics />
                            </div>
                        )}
                        {activeTab === "suppliers" && (
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome to Suppliers section
                                </h1>
                                <SupplierOfTable />
                            </div>
                        )
                        }
                        {activeTab === "products" && (
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome to Products section
                                </h1>
                                <Products />
                            </div>
                        )
                        }
                        {activeTab == "sells" && (
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome to sells section
                                </h1>
                                <SellsTable />
                            </div>
                        )
                        }
                        {activeTab == "expenses" && (
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome to expense section
                                </h1>
                                <ExpensesTable />
                            </div>
                        )
                        }
                        {activeTab == "wallet" && (
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome to WALLET section
                                </h1>
                                <WalletSection/>
                            </div>
                        )
                        }




                    </div>
                </div>
            </div>
        </div>
    );
}
