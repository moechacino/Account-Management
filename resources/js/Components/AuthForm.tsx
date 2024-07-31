import {ChangeEvent, FormEvent, useState, useEffect} from 'react';
import Eye from "@/Components/Assets/Eye";
import EyeSlash from "@/Components/Assets/EyeSlash";
import {LoginForm, RegisterForm} from "@/Models/FormModel";
import {router, usePage} from "@inertiajs/react";

export default function AuthForm({userEmail}: { userEmail?: string }) {
    const {errors} = usePage().props
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
    const [isEmailConflict, setIsEmailConflict] = useState<boolean | undefined>(undefined);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState<boolean | undefined>(undefined);
    const [isCredentialsInvalid, setIsCredentialsInvalid] = useState<boolean | undefined>(undefined);
    const [emailError, setEmailError] = useState<string|null>()
    useEffect(() => {
        const isError: boolean = Object.keys(errors).length !== 0
        if (errors && isError) {
            if (errors.email) {
                setEmailError(errors.email)
            }
            setIsEmailConflict(errors.email === "The email has already been taken.");
            setIsPasswordInvalid(errors.password === "The password field must be at least 8 characters.");
            setIsCredentialsInvalid(errors.email === "These credentials do not match our records.");
        } else {
            resetData()
        }
    }, [errors]);

    const [loginFormInput, setLoginFormInput] = useState<LoginForm>({
        email: "",
        password: ""
    });

    const [registerFormInput, setRegisterFormInput] = useState<RegisterForm>({
        name: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        if (userEmail) {
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000);
        }
    }, [userEmail]);

    function handleLoginInputChange(e: ChangeEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement;
        setLoginFormInput({
            ...loginFormInput,
            [target.name]: target.value
        });
    }

    function handleRegisterInputChange(e: ChangeEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement;
        setRegisterFormInput({
            ...registerFormInput,
            [target.name]: target.value
        });
    }

    function resetData() {
        setRegisterFormInput({
            name: "",
            email: "",
            password: ""
        });
        setLoginFormInput({
            email: "",
            password: ""
        });
        setIsEmailConflict(undefined);
        setIsPasswordInvalid(undefined);
        setIsCredentialsInvalid(undefined);
    }

    function toggleViewForm() {
        setIsLogin(!isLogin);
        setIsRegister(!isRegister);
        resetData();
        setEmailError(null)
        setIsEmailConflict(false)
        setIsPasswordInvalid(false)
        setIsCredentialsInvalid(false)
    }

    function handleSubmit(e: FormEvent, type: "registerForm" | "loginForm") {
        e.preventDefault()
        if (type === "registerForm") {
            router.post('/register', registerFormInput);
        } else if (type === "loginForm") {
            router.post('/login', loginFormInput);
        }
    }

    function togglePassword() {
        setIsHidden(!isHidden);
    }

    return (
        <div
            className="flex flex-col sm:flex-row bg-gc-ocean-green rounded-2xl shadow-lg w-full h-auto sm:min-h-96 sm:h-fit p-5">
            {/* Popup for successful registration */}
            {showSuccessPopup && (
                <div className="absolute top-4 right-4 bg-gc-ocean-green text-white p-4 rounded-md shadow-md">
                    Registration Successful!
                </div>
            )}

            {/* Login Section */}
            <div
                className={isLogin ? "hidden" : "flex flex-col mt-5 sm:mt-0 sm:w-1/2 px-8 text-white sm:ml-1 border rounded-2xl p-2 justify-center"}>
                <div className="flex flex-col justify-center w-full text-center text-sm">
                    <h2 className="font-bold text-xl">
                        You ndue akun ?
                    </h2>
                    <p className="mb-5">
                        Langsung login aja
                    </p>
                </div>
                <div className="flex justify-center">
                    <button onClick={toggleViewForm}
                            className="border text-lg w-1/2 border-white text-white py-2 rounded-2xl">LOGIN
                    </button>
                </div>
            </div>

            <div className={isLogin ? "sm:w-1/2 px-8 text-white border sm:mr-1 rounded-2xl p-2" : "hidden"}>
                <h2 className="font-bold text-2xl">Login</h2>
                <p className="text-sm mt-4">Lek wes ndue akun login wae</p>

                <form onSubmit={(e) => handleSubmit(e, "loginForm")} className="flex flex-col text-black text-md">

                    <p className={isCredentialsInvalid || emailError ? "px-4 mt-10 font-bold text-white tracking-widest" : "hidden"}>
                        { isCredentialsInvalid ? "EMAIL OR PASSWORD IS WRONG" : emailError ? emailError : "" }
                    </p>

                    <div>
                        <input
                            className={`w-full py-2  mb-4 border rounded-2xl ${isCredentialsInvalid || emailError ? 'bg-red-200 mt-1' : 'mt-10'}`}
                            name="email" onChange={handleLoginInputChange}
                            value={loginFormInput.email} type="email" placeholder="Email" required/>
                    </div>
                    <div className="relative">
                        <input
                            className={`w-full py-2 mb-4 border rounded-2xl ${isCredentialsInvalid ? 'bg-red-200' : ''}`}
                            name="password" onChange={handleLoginInputChange}
                            value={loginFormInput.password} type={isHidden ? "password" : "text"} placeholder="Password"
                            required/>
                        <button type="button" onClick={togglePassword}>
                            {isHidden ? <Eye className="absolute top-1/4 right-3"/> :
                                <EyeSlash className="absolute top-1/4 right-3"/>}
                        </button>
                    </div>
                    <button type="submit" className="bg-gc-yellow py-2 text-yellow-800 rounded-2xl">Login</button>
                </form>
            </div>

            {/* Register Section */}
            <div
                className={isRegister ? "hidden" : "flex flex-col mt-5 sm:mt-0 sm:w-1/2 px-8 text-white sm:ml-1 border rounded-2xl p-2 justify-center"}>
                <div className="flex flex-col justify-center w-full text-center text-sm">
                    <h2 className="font-bold text-xl">
                        Don't have an account?
                    </h2>
                    <p className="mb-5">
                        Register here to njajal aplikasi iki
                    </p>
                </div>
                <div className="flex justify-center">
                    <button onClick={toggleViewForm}
                            className="border text-lg w-1/2 border-white text-white py-2 rounded-2xl">TRY HERE
                    </button>
                </div>
            </div>

            <div
                className={isRegister ? "mt-5 sm:mt-0 sm:w-1/2 px-8 text-white sm:ml-1 border rounded-2xl p-2" : "hidden"}>
                <h2 className="font-bold text-2xl">Register</h2>
                <p className="text-sm mt-4">Try Out This Application !</p>

                <form className="flex flex-col text-black text-md" onSubmit={(e) => handleSubmit(e, "registerForm")}>
                    <input className="py-2 mt-10 mb-4 border rounded-2xl" name="name"
                           onChange={handleRegisterInputChange}
                           value={registerFormInput.name} type="text" placeholder="Name" required/>
                    <input className={`py-2 border rounded-2xl ${isEmailConflict ? 'bg-red-200 mb-0' : 'mb-4'}`}
                           name="email" onChange={handleRegisterInputChange}
                           value={registerFormInput.email} type="email" placeholder="Email" required/>
                    <p className={isEmailConflict ? `text-white px-2` : "hidden"}>
                        Email sudah terdaftar. Golek liyane bro
                    </p>
                    <div className="relative">
                        <input
                            className={`w-full py-2 border rounded-2xl ${isPasswordInvalid ? 'bg-red-200 mb-0' : 'mb-4'}`}
                            name="password"
                            onChange={handleRegisterInputChange}
                            value={registerFormInput.password} type={isHidden ? "password" : "text"}
                            placeholder="Password" required/>
                        <button type="button" onClick={togglePassword}>
                            {isHidden ? <Eye className="absolute top-1/4 right-3"/> :
                                <EyeSlash className="absolute top-1/4 right-3"/>}
                        </button>
                        <p className={isPasswordInvalid ? `text-white px-2` : "hidden"}>
                            Password minimal 8 karakter
                        </p>
                    </div>
                    <button type="submit" className="bg-gc-yellow py-2 text-yellow-800 rounded-2xl">Register</button>
                </form>
            </div>
        </div>
    );
}
