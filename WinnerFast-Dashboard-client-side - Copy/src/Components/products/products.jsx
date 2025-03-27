import { Pen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";


export default function Products() {
    const [allProducts, setallProducts] = useState([])
    const [addNewProductModal, setAddNewProductModal] = useState(false)
    const [productToDelete,setProductToDelete]= useState(null)
    const [productToUpdate,setProductToUpdate]=useState(null)
    const [ModalDelete, setModalDelete]=useState(false)
    const [modalUpdate, setModalUpdate]=useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: "onChange" })

    useEffect(() => {
        async function getProducts() {
            try {
                let products = await axios.get("http://localhost:3000/product", {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                })
                setallProducts(products.data)
                console.log("products", products?.data)
                console.log("products", products)
            } catch (e) {
                console.log("products", products)
                console.log("there's an error", e)
            }
        }
        getProducts()
    }, [])
    async function addNewProduct(data) {
        try {
            let results = await axios.post("http://localhost:3000/product", data, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            console.log("products ++", results)
            if (results.request.status == 201) {
                setallProducts((prevState) => [...prevState, {...results.data}])
                setAddNewProductModal(false)
                reset()
                toast.success('the product was added successfully')

            }
        } catch (e) {
            console.log("post does not work", e)
            toast.error("Ops try again")
        }
    }
    function handleDeleteClick(product){
        setModalDelete(true)
        setProductToDelete(product)
    }
    function handleUpdateClick(product){
        setProductToUpdate(product);
        setModalUpdate(true);
    }
    async function deleteProduct(){
        try{
            let result = await axios.delete(`http://localhost:3000/product/${productToDelete.id}`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('UserToken')}`
                    }
                }
            )
            console.log("results", result)
            if (result.status === 200) {
                setallProducts(prevProduct => 
                    prevProduct.filter(product => product.id !== productToDelete.id)
                );
                setModalDelete(false);
                toast.success('Product deleted successfully');
            }
        }catch(e){
            if (e.response && e.response.request.response) {
                const responseData = JSON.parse(e.response.request.response);
                console.log(responseData.message); 
                console.log(responseData.message[0]);
                toast.error(responseData.message) 
            }
            console.log("error delete", e)
        }
    }
    async function updateProduct(data){
        try {
            let results = await axios.put(`http://localhost:3000/product/${productToUpdate.id}`, data, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('UserToken')}`
                }
            })
            console.log("THE RESULTS", results)
            if (results.request.status == 200) {
                setallProducts((prevState) => 
                    prevState.map(product => 
                        product.id === productToUpdate.id ? results.data : product
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
            <div className='flex justify-end'><button className='bg-orange-500 px-2 text-white border py-3 rounded' onClick={() => setAddNewProductModal(true)}>Add product</button></div>
            <div className="bg-white rounded-lg">
                <div >
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left ">
                                <th className="px-6 text-sm font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Price</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">stock</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">modify</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Delete</th>

                            </tr>
                        </thead>
                        <tbody className="border-b-1 divide-gray-200">
                            {(allProducts.length == 0) && (
                                <tr>
                                    <td colSpan="100%" className="text-center py-4">
                                        No products yet
                                    </td>
                                </tr>
                            )}
                            {(allProducts.length > 0) && (
                                (allProducts.map((product, index) => (
                                    <tr key={index} className="border-b-1 border-gray-200">
                                        <td className="px-6 py-4 text-sm text-gray-900">{product.name} </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{product.price}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500"> <span className="bg-red-200 px-7 rounded-full text-red-700">{product.stock}</span></td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button onClick={()=>handleUpdateClick(product)}><Pen /></button></td>
                                        <td className="px-6 py-4 text-sm text-gray-500"><button onClick={() => handleDeleteClick(product)}><Trash2 /></button></td>
                                    </tr>
                                )))

                            )}

                        </tbody>
                    </table>
                </div>
            </div>
            {addNewProductModal && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                        <h1 className="my-4 font-bold text-xl text-center text-gray-800">
                            Add New Product
                        </h1>
                        <form onSubmit={handleSubmit(addNewProduct)} className="w-full">
                            <div className="pb-2 pt-2">
                                <input {...register("name", { required: "Product name is required", minLength: { value: 3, message: "Name must be at least 3 characters long" }, maxLength: { value: 50, message: "Name must be less than 50 characters" } })} type="text" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Product Name" />
                            </div>
                            {errors.name && <span>{errors.name.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be at least 1" }, valueAsNumber: true })} type="number" min="1" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Price" />
                            </div>
                            {errors.price && <span>{errors.price.message}</span>}

                            <div className="pb-2 pt-2">
                                <input {...register("stock", { required: "Stock is required", min: { value: 0, message: "Stock cannot be negative" }, valueAsNumber: true })} type="number" min="0" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Stock" />
                            </div>
                            {errors.stock && <span>{errors.stock.message}</span>}
                            <div className="flex justify-between mt-4">
                                <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setAddNewProductModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                    Add Product
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
                                        Add New Expense
                                    </h1>
                                    <p className="mb-4">
                                        Are you sure you want to delete this product:
                                        <span className="font-semibold ml-1">
                                            {productToDelete?.name}
                                        </span>?
                                    </p>
                                    <div className="flex justify-between">
                                        <button onClick={() => setModalDelete(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                                            Cancel
                                        </button>
                                        <button onClick={deleteProduct} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
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
                        Update Product
                    </h1>
                    <form onSubmit={handleSubmit(updateProduct)} className="w-full">
                        <div className="pb-2 pt-2">
                            <input {...register("name", { required: "Product name is required", minLength: { value: 3, message: "Name must be at least 3 characters long" }, maxLength: { value: 50, message: "Name must be less than 50 characters" } })} defaultValue={productToUpdate?.name} type="text" className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" placeholder="Product Name" />
                        </div>
                        {errors.name && <span>{errors.name.message}</span>}
            
                        <div className="pb-2 pt-2">
                            <input  {...register("price", {required: "Price is required",  min: { value: 1, message: "Price must be at least 1" },  valueAsNumber: true })}  defaultValue={productToUpdate?.price}  type="number"  min="1"  className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500"  placeholder="Price" />
                        </div>
                        {errors.price && <span>{errors.price.message}</span>}
            
                        <div className="pb-2 pt-2">
                            <input {...register("stock", {required: "Stock is required",  min: { value: 0, message: "Stock cannot be negative" },  valueAsNumber: true })}  defaultValue={productToUpdate?.stock}  type="number"  min="0"  className="block w-full p-2 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500"  placeholder="Stock" />
                        </div>
                        {errors.stock && <span>{errors.stock.message}</span>}
            
                        <div className="flex justify-between mt-4">
                            <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setModalUpdate(false)}>
                                Cancel
                            </button>
                            <button  type="submit"  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                                Update Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            )}
        </>
    )
}