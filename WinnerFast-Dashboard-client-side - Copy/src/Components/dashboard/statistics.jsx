import React from "react";
import { CircleDollarSign, Wallet, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
export default function Statistics() {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalSells, setTotalSells] = useState(0);

    useEffect(() => {
        async function getSells() {
            try {
                let sells = await axios.get("http://localhost:3000/sell", {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                })
                const totalSellAmount = sells.data.reduce((acc, sell) => {
                    return acc + parseFloat(sell.totalAmount)
                }, 0)
                setTotalSells(totalSellAmount)

                console.log("sells", sells?.data)
                console.log("sells", sells)
            } catch (e) {
                console.log("sells", sells)
                console.log("there's an error", e)
            }
        }
        getSells()
        async function getExpense() {
            try {
                let expenses = await axios.get("http://localhost:3000/expenses", {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                })
                const totalExpenseAmount = expenses.data.reduce((acc, expense) => {
                    return acc + parseFloat(expense.amount)
                }, 0)
                setTotalExpenses(totalExpenseAmount)
            } catch (e) {
                console.log("expenses", expensees)
                console.log("there's an error", e)
            }
        }
        getExpense()
    },[])
    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div  className="w-full">
                    <div className="p-6 rounded-lg bg-gradient-to-b from-[#bb67ff] to-[#c484f3] text-black">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Sells</h2>
                            <CircleDollarSign className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-2">{totalSells}</p>
                        <p className="text-sm opacity-80">Total</p>
                    </div>

                </div>
                <div  className="w-full">
                    <div className="p-6 rounded-lg bg-gradient-to-b from-[#F8D49A] to-[#FFCA71] text-black">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Expense</h2>
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-2">{totalExpenses}</p>
                        <p className="text-sm opacity-80">Total</p>
                    </div>

                </div>
                <div className="w-full">
                    <div className="p-6 rounded-lg bg-gradient-to-b from-[#FF919D] to-[#FC929D] text-black">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Revenue</h2>
                            <Wallet className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-2">{totalSells - totalExpenses}</p>
                        <p className="text-sm opacity-80">Total</p>
                    </div>

                </div>
            </div>
        </div>
    )
}


