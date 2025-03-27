import { Pen, Trash2 } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";


export default function ExpensesTable() {
    const [expensees, setExpenses] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [expenseToDelete, setExpenseToDelete] = useState(null)
    const [expenseToUpdate, setExpenseToUpdate] = useState(null)
    const [updateModal, setUpdateModal]= useState(false)
    const { register, handleSubmit, reset, formState: {errors}} = useForm({ mode: "onChange" })
    async function AddNewExpense(data) {
        try {
            let results = await axios.post("http://localhost:3000/expenses", data, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            console.log("THE RESULTS", results)
            if (results.request.status == 201) {
                setExpenses((prevState) => [...prevState, { ...data, date: data.date.toISOString() }])
                setShowModal(false)
                reset()
                toast.success('the expense was added successfully')

            }
        } catch (e) {
            console.log("post does not work", e)
        }
    }

    async function UpdateExpense(data){
        try {
            let results = await axios.put(`http://localhost:3000/expenses/${expenseToUpdate.id}`, data, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            console.log("THE RESULTS", results)
            if (results.request.status == 200) {
                setExpenses((prevState) => 
                    prevState.map(expense => 
                        expense.id === expenseToUpdate.id ? results.data : expense
                    )
                )
                setUpdateModal(false)
                reset()
                toast.success('the expense was updated successfully')

            }
        } catch (e) {
            console.log("post does not work", e)
        }
    }

    async function deleteExpense(){
        try{
            let result = await axios.delete(`http://localhost:3000/expenses/${expenseToDelete.id}`,{
                headers: {
                    authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            console.log("results", result)
            if (result.status === 200) {
                setExpenses(prevExpenses => 
                    prevExpenses.filter(expense => expense.id !== expenseToDelete.id)
                );
                setShowDeleteModal(false);
            toast.success('Expense deleted successfully');
          }
        }catch(e){
            console.log("error in delete",e)
            toast.error('Ops try again')
        }
    }


    function handleDeleteClick(expense){
        setExpenseToDelete(expense);
        setShowDeleteModal(true);
    }
    function handleUpdateClick(expense){
        setExpenseToUpdate(expense);
        setUpdateModal(true);
    }

      

    useEffect(() => {
        async function getExpense() {
            try {
                let expenses = await axios.get("http://localhost:3000/expenses", {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                })
                setExpenses(expenses?.data)
                console.log("expenses", expenses?.data)
                console.log("expenses", expensees)
            } catch (e) {
                console.log("expenses", expensees)
                console.log("there's an error", e)
            }
        }
        getExpense()
    }, [])
    return (
        <>
            <Toaster position="bottom-right" />
            <div className='flex justify-end'><button className='bg-orange-500 px-2 text-white border py-3 rounded' onClick={() => setShowModal(true)}>New expense</button></div>
            <div className="bg-white rounded-lg">
                <div >
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left ">
                                <th className="px-6 text-sm font-semibold text-gray-900">Operation Name</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">type</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Amount</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">date</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Details</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">modify</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Delete</th>

                            </tr>
                        </thead>
                        <tbody className="border-b-1 divide-gray-200">
                            {(expensees.length == 0 && (
                                <tr>
                                    <td colSpan="100%" className="text-center py-4">
                                        No expenses yet
                                    </td>
                                </tr>

                            ))}
                            {(expensees.length > 0 && (
                                (expensees.map((expense, index) => (
                                    <tr key={index} className="border-b-1 border-gray-200">
                                        <td className="px-6 py-4 text-sm text-gray-900">{expense.operationName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{expense.type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{expense.amount}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{expense.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300">See more</button></td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button onClick={()=>handleUpdateClick(expense)}><Pen /></button></td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button onClick={() => handleDeleteClick(expense)}><Trash2 /></button></td>
                                    </tr>
                                )))
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Add New Expense
                        </h1>

                        <form onSubmit={handleSubmit(AddNewExpense)} className="w-full">
                            <div className="pb-2 pt-2">
                                <input {...register('operationName', { required: "Operation name is required", minLength: { value: 3, message: "Operation name must be at least 3 characters long" }, maxLength: { value: 20, message: "Operation name must be less than 30 characters" } })} type="text" name="operationName" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Operation Name" />
                            </div>
                            {errors.operationName && <span>{errors.operationName.message}</span>}

                            <div className="pb-2 pt-2">
                                <select {...register('type', { required: "Type is required" })} name="type" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500">
                                    <option value="">Select Type</option>
                                    <option value="variable">Variable</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                            </div>
                            {errors.type && <span>{errors.type.message}</span>}


                            <div className="pb-2 pt-2">
                                <input {...register('amount', { required: "Kindly enter the amount", min: { value: 1, message: 'Amount must be at least 1' }, valueAsNumber: true })} min="1" type="number" name="amount" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Amount" required />
                            </div>
                            {errors.amount && <span>{errors.amount.message}</span>}
                            <div className="pb-2 pt-2">
                                <input type="date" id="date"  {...register('date', { required: 'the date is required and should be valid', valueAsDate: true })} className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" />
                            </div>
                            {errors.date && <span>{errors.date.message}</span>}

                            <div className="pb-2 pt-2">
                                <textarea {...register("description", { required: 'enter your description' })} name="description" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Description" />
                            </div>
                            {errors.description && <span>{errors.description.message}</span>}


                            <div className="pb-2 pt-2">
                                <input {...register('category', {
                                    minLength: { value: 3, message: "Category must be at least 3 characters long" }, pattern: {
                                        value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/, message: "Your category must be a valid name composed with 2 words max"
                                    }
                                },)} type="text" name="category" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Category" />
                            </div>
                            {errors.category && <span>{errors.category.message}</span>}


                            <div className="flex justify-between mt-4">
                                <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                    Add Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            )}
            {showDeleteModal && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Add New Expense
                        </h1>
                        <p className="mb-4">
                            Are you sure you want to delete the expense:
                            <span className="font-semibold ml-1">
                                {expenseToDelete?.operationName}
                            </span>?
                        </p>
                        <div className="flex justify-between">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                                Cancel
                            </button>
                            <button onClick={deleteExpense} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {updateModal && (
                                <div className="fixed inset-0 flex justify-center items-center">
                                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                                    <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                                        Update Expense
                                    </h1>
            
                                    <form onSubmit={handleSubmit(UpdateExpense)} className="w-full">
                                        <div className="pb-2 pt-2">
                                            <input  defaultValue={expenseToUpdate?.operationName}  {...register('operationName', { required: "Operation name is required", minLength: { value: 3, message: "Operation name must be at least 3 characters long" }, maxLength: { value: 20, message: "Operation name must be less than 30 characters" } })} type="text" name="operationName" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Operation Name" />
                                        </div>
                                        {errors.operationName && <span>{errors.operationName.message}</span>}
            
                                        <div className="pb-2 pt-2">
                                            <select defaultValue={expenseToUpdate?.type}  {...register('type', { required: "Type is required" })} name="type" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500">
                                                <option value="">Select Type</option>
                                                <option value="variable">Variable</option>
                                                <option value="fixed">Fixed</option>
                                            </select>
                                        </div>
                                        {errors.type && <span>{errors.type.message}</span>}
            
            
                                        <div className="pb-2 pt-2">
                                            <input defaultValue={expenseToUpdate?.amount}  {...register('amount', { required: "Kindly enter the amount", min: { value: 1, message: 'Amount must be at least 1' }, valueAsNumber: true })} min="1" type="number" name="amount" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Amount" required />
                                        </div>
                                        {errors.amount && <span>{errors.amount.message}</span>}
                                        <div className="pb-2 pt-2">
                                            <input defaultValue={expenseToUpdate?.date}  type="date" id="date"  {...register('date', { required: 'the date is required and should be valid', valueAsDate: true })} className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" />
                                        </div>
                                        {errors.date && <span>{errors.date.message}</span>}
            
                                        <div className="pb-2 pt-2">
                                            <textarea defaultValue={expenseToUpdate?.description} {...register("description", { required: 'enter your description' })} name="description" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Description" />
                                        </div>
                                        {errors.description && <span>{errors.description.message}</span>}
            
            
                                        <div className="pb-2 pt-2">
                                            <input  defaultValue={expenseToUpdate?.category} {...register('category', {
                                                minLength: { value: 3, message: "Category must be at least 3 characters long" }, pattern: {
                                                    value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/, message: "Your category must be a valid name composed with 2 words max"
                                                }
                                            },)} type="text" name="category" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Category" />
                                        </div>
                                        {errors.category && <span>{errors.category.message}</span>}
            
            
                                        <div className="flex justify-between mt-4">
                                            <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setUpdateModal(false)}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                                Update Expense
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
            )}
        </>
    )
}