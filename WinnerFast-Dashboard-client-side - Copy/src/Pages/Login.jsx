import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Login() {
    const Navigate= useNavigate();
    const{register, handleSubmit, formState: {errors}}= useForm();
    async function handleLogin(data){
        try{
            console.log("weeeee",data);
            let response =await axios.post('http://localhost:3000/auth/login', data)
            if(!response){
                return "smth went wrong"
            }
            toast.success("You have logged in successfully");
            localStorage.setItem("UserToken", response.data.token);
            setTimeout(()=>Navigate('/'), 1000)
        }catch(e){
            if (e.response && e.response.request.response) {
                const responseData = JSON.parse(e.response.request.response);
                console.log(responseData.message); 
                console.log(responseData.message);
                toast.error(responseData.message) 
            }else{
                toast.error("Ops try again!");
            }
        }
    }
  return (
   <>
        <Toaster position="bottom-right" />
        <section className="min-h-screen flex items-center justify-center text-gray-900">
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h1 className="my-6 font-bold text-2xl text-center text-gray-800">
                       Winner<span className="text-orange-500">Fast</span>
                    </h1>

                    <form onSubmit={handleSubmit(handleLogin)} className="w-full">
                        <div className="pb-2 pt-4">
                            <input {...register('email', {required:true, pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email address"}})} type="email" name="email" id="email" placeholder="Email" className="block w-full p-3 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500"/>
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>
                        <div className="pb-2 pt-4">
                            <input {...register('password', {required:true, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/, message: "Password must be strong and at least 8 characters"}})} className="block w-full p-3 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500" type="password" name="password" id="password" placeholder="Password"/>
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>
                        <div className="text-right text-gray-600">
                            <Link to ="/register">You don't have an account? <span className="hover:underline hover:text-orange-500">Sign up</span></Link>
                        </div>
                        <div className="pb-2 pt-4 flex justify-center">
                            <button className="block w-full p-2 px-3 text-white rounded-lg hover:bg-orange-600 focus:outline-none  bg-orange-500">Sign In</button>
                        </div>
                    </form>
                </div>
        </section>
   </>
  );
}