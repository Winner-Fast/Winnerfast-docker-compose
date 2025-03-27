import { Pen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

export default function SellsTable() {
    const [allsells, setAllSells] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [addSellModal, setAddSellModal] = useState(null)
    const [quantity, setQuantity] = useState(0)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sellToDelete, setSellToDelete] = useState(null)
    const [modalDelete, setModalDelete] = useState(false)
    const [sellToUpdate, setSellToUpdate] = useState(null)
    const [modalUpdate, setModalUpdate] = useState(false)

    const { handleSubmit, reset, register, formState: { errors } } = useForm({ mode: "onChange" })


    useEffect(() => {
        async function getSells() {
            try {
                let sells = await axios.get("http://localhost:3000/sell", {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                })
                setAllSells(sells.data)
                console.log("sells", sells?.data)
                console.log("sells", sells)
            } catch (e) {
                console.log("sells", sells)
                console.log("there's an error", e)
            }
        }
        getSells()
    },[])
    async function AddNewOperation(data) {
        console.log("my data", data)
        const { operationName, quantity, totalAmount, productIds } = data;
        const updatedData = {
            operationName,
            quantity: Number(quantity),
            totalAmount: Number(totalAmount),
            productIds: Number(productIds),
        };
        try {
            let results = await axios.post("http://localhost:3000/sell", updatedData, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            console.log("results are", results)
            if (results.request.status == 201) {
                setAllSells((prevState) => [...prevState, { ...results.data }])
                setAddSellModal(false)
                reset()
                toast.success('The sell was added successfully')

            }
        } catch (e) {
            console.log("post does not work", e)
            if (e.response && e.response.request.response) {
                const responseData = JSON.parse(e.response.request.response);
                console.log(responseData.message);
                toast.error(responseData.message)
            } else {
                toast.error("Ops try again")
            }
        }
    }

    async function handleAddclick() {
        setAddSellModal(true)
        try {
            let products = await axios.get("http://localhost:3000/product", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            setAllProducts(products.data)
            console.log("products", products?.data)
            console.log("products", products)
        } catch (e) {
            console.log("products", products)
            console.log("there's an error", e)
        }
    }
    function handleDeleteClick(sell) {
        setModalDelete(true)
        setSellToDelete(sell)
    }
    async function deleteSell() {
        try {
            let result = await axios.delete(`http://localhost:3000/sell/${sellToDelete.id}`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                }
            )
            console.log("results", result)
            if (result.status === 200) {
                setallsuppliers(prevState =>
                    prevState.filter(sell => sell.id !== sellToDelete.id)
                );
                setModalDelete(false);
                toast.success('sell deleted successfully');
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
    function handleUpdateClick(sell) {
        console.log("Info sells ", sell)
        setSellToUpdate(sell);
        setModalUpdate(true);
    }
    async function updateSell(data) {

    }
    return (
        <>
            <Toaster position="bottom-right" />
            <div className='flex justify-end'><button className='bg-orange-500 px-2 text-white border py-3 rounded' onClick={() => handleAddclick()}>New sell</button></div>
            <div className="bg-white rounded-lg">
                <div >
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left ">
                                <th className="px-6 text-sm font-semibold text-gray-900">operationName</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Total Amount</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Quantity</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Product</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">modify</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Delete</th>

                            </tr>
                        </thead>
                        <tbody className="border-b-1 divide-gray-200">
                            {(allsells.length == 0 && (
                                <tr>
                                    <td colSpan="100%" className="text-center py-4">
                                        No sells yet
                                    </td>
                                </tr>
                            ))}
                            {(allsells.length > 0 && (
                                (allsells.map((sell, index) => (
                                    <tr key={index} className="border-b-1 border-gray-200">
                                        <td className="px-6 py-4 text-sm text-gray-900">{sell.operationName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{sell.totalAmount}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{sell.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{sell.products[0].name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button onClick={() => handleUpdateClick(sell)}><Pen /></button></td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button><Trash2 onClick={() => handleDeleteClick(sell)} /></button></td>
                                    </tr>
                                )))


                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            {addSellModal && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Add New Operation
                        </h1>
                        <form onSubmit={handleSubmit(AddNewOperation)} className="w-full">
                            <div className="pb-2 pt-2">
                                <input {...register('operationName', { required: "Operation name is required", minLength: { value: 3, message: "Operation name must be at least 3 characters long" }, maxLength: { value: 20, message: "Operation name must be less than 30 characters" } })} type="text" name="operationName" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Operation Name" />
                            </div>
                            {errors.operationName && <span>{errors.operationName.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register('quantity', { required: "Quantity is required", min: { value: 1, message: "Quantity must be at least 1" }, valueAsNumber: true })} min="1" type="number" name="quantity" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Quantity" required />
                            </div>
                            {errors.quantity && <span>{errors.quantity.message}</span>}

                            <div className="pb-2 pt-2">
                                {(allProducts.length == 0 && (
                                    <p>You don't have any products please make sure you have products before adding new sell</p>
                                ))}

                                {allProducts.length > 0 && (
                                    <select {...register('productIds', { required: "Product is required", })} name="productIds" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700" onChange={(e) => { const selectedProduct = allProducts.find(p => p.id == Number(e.target.value)); setSelectedProduct(selectedProduct); setValue('productIds', selectedProduct?.id); }}>                                        <option value="">Select Product</option>
                                        {allProducts.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                )}


                            </div>
                            {errors.productIds && <span>{errors.productIds.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register('totalAmount', { required: "Total amount is required" })} type="number" name="totalAmount" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700" placeholder="Total Amount" defaultValue={quantity && selectedProduct ? quantity * selectedProduct.price : ''} />
                            </div>
                            {errors.totalAmount && <span>{errors.totalAmount.message}</span>}

                            <div className="flex justify-between mt-4">
                                <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setAddSellModal(false)}>
                                    Cancel
                                </button>
                                {allProducts.length == 0 && (
                                    <button className="px-4 py-2 bg-gray-300 text-gray-800rounded-md hover:bg-orange-700">
                                        You can't Add new sell
                                    </button>
                                )}
                                {allProducts.length > 0 && (
                                    <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                        Add Sell
                                    </button>
                                )}

                            </div>
                        </form>
                    </div>
                </div>
            )}
            {modalDelete && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Delete supplier
                        </h1>
                        <p className="mb-4">
                            Are you sure you want to delete this product:
                            <span className="font-semibold ml-1">
                                {sellToDelete?.operationName}
                            </span>?
                        </p>
                        <div className="flex justify-between">
                            <button onClick={() => setModalDelete(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                                Cancel
                            </button>
                            <button onClick={deleteSell} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {modalUpdate && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Update Sell Operation
                        </h1>
                        <form onSubmit={handleSubmit(updateSell)} className="w-full">
                            <div className="pb-2 pt-2">
                                <input {...register('operationName', { required: "Operation name is required", minLength: { value: 3, message: "Operation name must be at least 3 characters long" }, maxLength: { value: 20, message: "Operation name must be less than 30 characters" } })} defaultValue={sellToUpdate.operationName} type="text" name="operationName" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Operation Name"/>
                            </div>
                            {errors.operationName && <span>{errors.operationName.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register('quantity', { required: "Quantity is required", min: { value: 1, message: "Quantity must be at least 1" }, valueAsNumber: true})} defaultValue={sellToUpdate?.quantity} min="1" type="number" name="quantity" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Quantity"/>
                            </div>
                            {errors.quantity && <span>{errors.quantity.message}</span>}

                            <div className="pb-2 pt-2">

                                {allProducts.length > 0 && (
                                    <select {...register('productIds', { required: "Product is required" })} name="productIds" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700" defaultValue={sellToUpdate?.productIds} onChange={(e) => { const selectedProduct = allProducts.find(p => p.id === Number(e.target.value)); setSelectedProduct(selectedProduct); setValue('productIds', selectedProduct?.id);}}>
                                        <option value="">Select Product</option>
                                        {allProducts.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            {errors.productIds && <span>{errors.productIds.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register('totalAmount', { required: "Total amount is required" })} type="number" name="totalAmount" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700" placeholder="Total Amount" defaultValue={quantity && selectedProduct ? quantity * selectedProduct.price : ''}/>
                            </div>
                            {errors.totalAmount && <span>{errors.totalAmount.message}</span>}

                            <div className="flex justify-between mt-4">
                            <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setModalUpdate(false)}>
                                    Cancel
                                </button>
                                {allProducts.length > 0 && (
                                    <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                        Update Sell
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    )
}