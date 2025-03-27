import { Pen, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from "sonner";

export default function SupplierOfTable() {
    const [allSuppliers, setallsuppliers] = useState([])
    const [addSupplierModal, setAddSupplierModal] = useState(false)
    const [supplierToDelete, setSupplierToDelete] = useState(null)
    const [supplierToUpdate, setsupplierToUpdate] = useState(null)
    const [ModalDelete, setModalDelete] = useState(false)
    const [modalUpdate, setModalUpdate] = useState(false)
    const { handleSubmit, register, reset, formState: { errors } } = useForm({ mode: "onChange" })
    useEffect(() => {
        async function getSuppliers() {
            try {
                let suppliers = await axios.get("http://localhost:3000/supplier", {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                })
                setallsuppliers(suppliers.data)
                console.log("suppliers", suppliers?.data)
            } catch (e) {
                console.log("there's an error", e)
            }
        }
        getSuppliers()
    }, [])
    async function addNewSeller(data) {
        try {
            let results = await axios.post("http://localhost:3000/supplier", data, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            console.log("products ++", results)
            if (results.request.status == 201) {
                setallsuppliers((prevState) => [...prevState, { ...results.data }])
                setAddSupplierModal(false)
                reset()
                toast.success('the product was added successfully')

            }
        } catch (e) {
            console.log("post does not work", e)
            if (e.response && e.response.request.response) {
                const responseData = JSON.parse(e.response.request.response);
                console.log(responseData.message)
                toast.error(responseData.message)
            }
        }
    }
    function handleDeleteClick(supplier) {
        setModalDelete(true)
        setSupplierToDelete(supplier)
    }
    function handleUpdateClick(supplier) {
        setsupplierToUpdate(supplier);
        setModalUpdate(true);
    }
    async function deleteSupplier() {
        try {
            let result = await axios.delete(`http://localhost:3000/supplier/${supplierToDelete.id}`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                }
            )
            console.log("results", result)
            if (result.status === 200) {
                setallsuppliers(prevState =>
                    prevState.filter(supplier => supplier.id !== supplierToDelete.id)
                );
                setModalDelete(false);
                toast.success('Supplier deleted successfully');
            }
        } catch (e) {
            if (e.response && e.response.request.response) {
                const responseData = JSON.parse(e.response.request.response);
                console.log(responseData.message);
                console.log(responseData.message[0]);
                toast.error(responseData.message)
            }
            console.log("error delete", e)
        }
    }
    async function updateSeller(data) {
        try {
            let results = await axios.put(`http://localhost:3000/supplier/${supplierToUpdate.id}`, data, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            console.log("THE RESULTS", results)
            if (results.request.status == 200) {
                setallsuppliers((prevState) =>
                    prevState.map(supplier =>
                        supplier.id === supplierToUpdate.id ? results.data : supplier
                    )
                )
                setModalUpdate(false)
                reset()
                toast.success('the product was updated successfully')

            }
        } catch (e) {
            console.log("post does not work", e)
        }
    }
    return (
        <>
            <Toaster position="bottom-right" />

            <div className='flex justify-end'><button className='bg-orange-500 px-2 text-white border py-3 rounded' onClick={() => setAddSupplierModal(true)}>Add Supplier</button></div>
            <div className="bg-white rounded-lg">
                <div >
                    <table className="min-w-full">
                        <thead className="bg-gray-50"><tr className="text-left ">
                            <th className="px-6 text-sm font-semibold text-gray-900">Name</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900">Phone number</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900">Quality service</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900">Delivery Time</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900">modify</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900">Delete</th>
                        </tr>
                        </thead>
                        <tbody className="border-b-1 divide-gray-200">
                            {(allSuppliers.length == 0) && (
                                <tr>
                                    <td colSpan="100%" className="text-center py-4">
                                        No products yet
                                    </td>
                                </tr>
                            )}
                            {(allSuppliers.length > 0) && (
                                (allSuppliers.map((supplier, index) => (
                                    <tr key={index} className="border-b-1 border-gray-200">
                                        <td className="px-6 py-4 text-sm text-gray-900">{supplier.name} </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{supplier.phoneNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{supplier.qualityService}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{supplier.deliveryTime}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button onClick={() => handleUpdateClick(supplier)}><Pen /></button></td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button onClick={() => handleDeleteClick(supplier)}><Trash2 /></button></td>
                                    </tr>
                                )))

                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {addSupplierModal && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Add New Seller
                        </h1>
                        <form onSubmit={handleSubmit(addNewSeller)} className="w-full">
                            <div className="pb-2 pt-2">
                                <input {...register("name", { required: "Seller name is required", minLength: { value: 3, message: "Name must be at least 3 characters long" }, maxLength: { value: 50, message: "Name must be less than 50 characters" } })} type="text" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Seller Name" />
                            </div>
                            {errors.name && <span>{errors.name.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register("phoneNumber", { required: "Phone number is required", pattern: { value: /^\+?\d{10,15}$/, message: "Phone number must be in this format (exemple +212636666666)" } })} type="text" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Phone Number" />
                            </div>
                            {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register("address", { required: "Address is required" })} type="text" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Address" />
                            </div>
                            {errors.address && <span>{errors.address.message}</span>}

                            <div className="pb-2 pt-2">
                                <select {...register("qualityService", { required: "Quality of service is required" })} className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 bg-white">
                                    <option value="" selected>Select Quality of Service</option>
                                    <option value="satisfied">Satisfied</option>
                                    <option value="Not satisfied">Not satisfied</option>
                                    <option value="the best">The Best</option>
                                    <option value="Medium">Medium</option>
                                    <option value="first experience">First Experience</option>
                                </select>
                            </div>
                            {errors.qualityService && <span>{errors.qualityService.message}</span>}

                            <div className="pb-2 pt-2">
                                <select {...register("deliveryTime", { required: "Delivery time is required" })} className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 bg-white">
                                    <option value="" selected>Select Delivery Time</option>
                                    <option value="same day">Same Day</option>
                                    <option value="1 day">1 Day</option>
                                    <option value="2 days">2 Days</option>
                                    <option value="3 days">3 Days</option>
                                    <option value="4 days">4 Days</option>
                                    <option value="1 week">1 Week</option>
                                    <option value="more than 1 week">More than 1 Week</option>
                                </select>
                            </div>
                            {errors.deliveryTime && <span>{errors.deliveryTime.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register("totalOrders", { required: "Total orders is required", min: { value: 0, message: "Total orders cannot be negative" }, valueAsNumber: true })} type="number" min="0" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Total Orders" />
                            </div>
                            {errors.totalOrders && <span>{errors.totalOrders.message}</span>}

                            <div className="flex justify-between mt-4">
                                <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setAddSupplierModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                    Add Seller
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {ModalDelete && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Delete supplier
                        </h1>
                        <p className="mb-4">
                            Are you sure you want to delete this product:
                            <span className="font-semibold ml-1">
                                {supplierToDelete?.name}
                            </span>?
                        </p>
                        <div className="flex justify-between">
                            <button onClick={() => setModalDelete(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                                Cancel
                            </button>
                            <button onClick={deleteSupplier} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {modalUpdate && (
                <div className="fixed inset-0 flex justify-center items-center ">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Update Seller
                        </h1>
                        <form onSubmit={handleSubmit(updateSeller)} className="w-full">
                            <div className="pb-2 pt-2">
                                <input {...register("name", { required: "Seller name is required", minLength: { value: 3, message: "Name must be at least 3 characters long" }, maxLength: { value: 50, message: "Name must be less than 50 characters" } })} defaultValue={supplierToUpdate?.name} type="text" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Seller Name" />
                            </div>
                            {errors.name && <span>{errors.name.message}</span>}

                            <div className="pb-2 pt-2">
                                <input  {...register("phoneNumber", { required: "Phone number is required", pattern: { value: /^\+?\d{10,15}$/, message: "Phone number must be in this format (ex: +212636666666)" } })} defaultValue={supplierToUpdate?.phoneNumber} type="text" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Phone Number" />
                            </div>
                            {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}

                            <div className="pb-2 pt-2">
                                <input  {...register("address", { required: "Address is required" })} defaultValue={supplierToUpdate?.address} type="text" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Address" />
                            </div>
                            {errors.address && <span>{errors.address.message}</span>}

                            <div className="pb-2 pt-2">
                                <select {...register("qualityService", { required: "Quality of service is required" })} className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 bg-white" defaultValue={supplierToUpdate?.qualityService}>
                                    <option value="" disabled>Select Quality of Service</option>
                                    <option value="satisfied">Satisfied</option>
                                    <option value="Not satisfied">Not satisfied</option>
                                    <option value="the best">The Best</option>
                                    <option value="Medium">Medium</option>
                                    <option value="first experience">First Experience</option>
                                </select>
                            </div>
                            {errors.qualityService && <span>{errors.qualityService.message}</span>}

                            <div className="pb-2 pt-2">
                                <select {...register("deliveryTime", { required: "Delivery time is required" })} className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 bg-white" defaultValue={supplierToUpdate?.deliveryTime}>
                                    <option value="" disabled>Select Delivery Time</option>
                                    <option value="same day">Same Day</option>
                                    <option value="1 day">1 Day</option>
                                    <option value="2 days">2 Days</option>
                                    <option value="3 days">3 Days</option>
                                    <option value="4 days">4 Days</option>
                                    <option value="1 week">1 Week</option>
                                    <option value="more than 1 week">More than 1 Week</option>
                                </select>
                            </div>
                            {errors.deliveryTime && <span>{errors.deliveryTime.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register("totalOrders", { required: "Total orders is required", min: { value: 0, message: "Total orders cannot be negative" }, valueAsNumber: true })} defaultValue={supplierToUpdate?.totalOrders} type="number" min="0" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Total Orders" />
                            </div>
                            {errors.totalOrders && <span>{errors.totalOrders.message}</span>}

                            <div className="flex justify-between mt-4">
                                <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setModalUpdate(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                                    Update Seller
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    )
}

