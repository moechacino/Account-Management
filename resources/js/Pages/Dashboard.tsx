import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router, usePage} from '@inertiajs/react';
import {PageProps} from '@/types';
import PlusSquare from "@/Components/Assets/PlusSquare";
import FunnellFill from "@/Components/Assets/FunnellFill";
import FolderPlus from "@/Components/Assets/FolderPlus";
import PencilSquare from "@/Components/Assets/PencilSquare";
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import Checklist from "@/Components/Assets/Checklist";
import {AccountData} from "@/Models/AccountModel";
import PlusCircleDotted from "@/Components/Assets/PlusCircleDotted";

interface DashboardPageProps extends PageProps {
    data: {
        accounts: AccountData[]
        types: string[]
    }
    flash: {
        message: string
    }
}

export default function Dashboard() {
    const {auth, data, flash} = usePage<DashboardPageProps>().props
    const {accounts, types} = data
    const [filterToggle, setFilterToggle] = useState<boolean>(false)
    const [typeToggle, setTypeToggle] = useState<boolean>(false)
    const [addAccountToggle, setAddAccountToggle] = useState<boolean>(false)
    const [showAddAccountForm, setShowAddAccountForm] = useState<boolean>(false)
    const [showWrongPasswordAlert, setShowWrongPasswordAlert] = useState<boolean>(false)
    const [editToggle, setEditToggle] = useState<boolean>(false)
    const [detailToggle, setDetailToggle] = useState<boolean>(false)

    const [unlockedPassword, setUnlockedPassword] = useState<string>("")
    const [showDetailToggle, setShowDetailToggle]=useState<boolean>(false)
    const [passwordInput, setPasswordInput] = useState<string>("")
    const [typeInput, setTypeInput] = useState<string>("")
    const [addAccountForm, setAddAccountForm] = useState<AccountData>(
        {
            title: "",
            credential: "",
            password: "",
            type: "",
            note: ""
        }
    )

    const [updateAccountForm, setUpdateAccountForm] = useState<AccountData>({
        title: '',
        type: "",
        note: "",
        password: ""
    })
    const [currentType, setCurrentType] = useState<string>("")
    const [filteredData, setFilteredData] = useState<AccountData[] | null>()

    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [dataDetail, setDataDetail] = useState<AccountData | undefined>()

    const dropdownFilterRef = useRef<HTMLDivElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const popUpTypeRef = useRef<HTMLDivElement>(null);
    const popUpAddAccountRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLDivElement>(null);
    const showDetailRef = useRef<HTMLDivElement>(null)
    const wrongPasswordRef = useRef<HTMLDivElement>(null)
    const editRef = useRef<HTMLDivElement>(null)

    function handleFilterToggle(): void {
        setFilterToggle(!filterToggle)
    }

    function handleAddAccountToggle() {
        if (passwordInput) {
            checkPassword()
        } else {
            setAddAccountToggle(!addAccountToggle)
        }
    }

    function handleTypeToggle(): void {
        setTypeToggle(!typeToggle)
    }


    function handlePasswordInput(e: ChangeEvent<HTMLInputElement>) {
        setPasswordInput(e.target.value)
    }

    function checkPassword() {
        router.post('/check-password', {password: passwordInput}, {
            onSuccess: (page: any) => {
                if (page.props.flash.message === "password match") {
                    setShowAddAccountForm(true)
                } else {
                    setShowWrongPasswordAlert(true)
                    setPasswordInput("")
                }
            }
        });
    }

    function handleCheckPassword(e: FormEvent) {
        if (passwordInput) {
            checkPassword()
        }
        setAddAccountToggle(false)
    }

    function handleDetailToggle(e: React.MouseEvent<HTMLButtonElement>) {
        const id = Number(e.currentTarget.id)
        const selectedAccount = data?.accounts.filter(account => account.id === id)[0]
        setDataDetail(selectedAccount)
        setDetailToggle(!detailToggle)
        setSelectedId(id)
    }

    function handleUnlockPassword(e: FormEvent) {
        e.preventDefault()
        router.post('/unlock-password', {
            encryptedPassword: dataDetail?.password,
            keyPassword: passwordInput
        }, {
            onSuccess: (page: any) => {
                    setUnlockedPassword(page.props.flash.showedPassword)
                    setShowDetailToggle(true)
            }
        })
    }

    function handleEditToggle(e: React.MouseEvent<HTMLButtonElement>) {
        const id = Number(e.currentTarget.id)
        const selectedAccount = data?.accounts.filter(account => account.id === id)[0]
        setDataDetail(selectedAccount)
        setSelectedId(id)
        setEditToggle(!editToggle)
    }

    function handleEditAccountInput(e: ChangeEvent) {
        const target = e.target as HTMLInputElement;
        setUpdateAccountForm({
            ...updateAccountForm,
            [target.name]: target.value
        })
    }

    function handleSubmitEditAccount(e: FormEvent) {
        e.preventDefault()
        if (!updateAccountForm.title) {
            updateAccountForm.title = dataDetail?.title
        }
        if (!updateAccountForm.password) {
            updateAccountForm.password = dataDetail?.password
        }
        if (!updateAccountForm.type) {
            if (!dataDetail?.type) {
                updateAccountForm.type = 'others'
            } else {
                updateAccountForm.type = dataDetail?.type
            }
        }
        router.patch(`/dashboard/account/${selectedId}`, updateAccountForm, {
            onSuccess: () => {
                setEditToggle(false)
                setUpdateAccountForm({
                    title: "",
                    type: "",
                    note: "",
                    password: ""
                })
            },
            onError: () => alert("failed. check internet connection"),
        })
    }

    function handleDeleteAccount() {
        if (selectedId) {
            router.delete(`/dashboard/account/${selectedId}`, {
                onSuccess: () => {
                    setEditToggle(false)
                    setUpdateAccountForm({
                        title: "",
                        type: "",
                        note: "",
                        password: ""
                    })
                },
                onError: () => alert("failed. check internet connection"),
            })
        }
    }

    function handleClickOutside(e: MouseEvent) {
        if (dropdownFilterRef.current &&
            filterButtonRef.current &&
            !dropdownFilterRef.current.contains(e.target as Node) &&
            !filterButtonRef.current.contains(e.target as Node)) {
            setFilterToggle(false);
        }
        if (popUpAddAccountRef.current && !popUpAddAccountRef.current.contains(e.target as Node)) {
            setAddAccountToggle(false);
            setShowAddAccountForm(false)
            setPasswordInput("")
        }
        if (popUpTypeRef.current && !popUpTypeRef.current.contains(e.target as Node)) {
            setTypeToggle(false);
        }
        if (detailRef.current && !detailRef.current.contains(e.target as Node)) {
            setDetailToggle(false)
            setPasswordInput("")
        }

        if (showDetailRef.current && !showDetailRef.current.contains(e.target as Node)) {
            setShowDetailToggle(false)
            setSelectedId(null)
            setPasswordInput("")
        }
        if (wrongPasswordRef.current && !wrongPasswordRef.current.contains(e.target as Node)) {
            setShowWrongPasswordAlert(false)
        }
        if (editRef.current && !editRef.current.contains(e.target as Node)) {
            setEditToggle(false)
            setUpdateAccountForm({
                title: "",
                type: "",
                note: "",
                password: ""
            })
        }
    }

    function handleAddAccountFormInput(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const target = e.target as HTMLInputElement;
        setAddAccountForm({
            ...addAccountForm,
            [target.name]: target.value
        });
    }

    function handleSubmitAddAccount(e: FormEvent) {
        e.preventDefault()
        router.post('/dashboard/account', {
            ...addAccountForm,
            keyPassword: passwordInput
        }, {
            onSuccess: () => {
                setAddAccountForm({
                    title: "",
                    credential: "",
                    password: "",
                    type: "",
                    note: ""
                })
            },
            onError: () => {
                alert("Internet Error")
            }
        })
        setShowAddAccountForm(false)
    }

    function handleSubmitNewType(e: FormEvent) {
        if (typeInput) {
            router.post('/dashboard/type', {
                type: typeInput
            }, {
                onError: () => alert("failed. check your internet")
            })
        }
        setTypeToggle(!typeToggle)
        setTypeInput("")
    }

    function handleFilter(e: React.MouseEvent<HTMLButtonElement>) {
        const value = e.currentTarget.value
        // router.get('/dashboard', {type: value},)
        filterByType(value)
        setCurrentType(value)
    }

    function filterByType(type: string) {
        if (type === "") {
            setFilteredData(null)
        } else {
            const filteredData = accounts.filter((account) => account.type === type)
            setFilteredData(filteredData);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    function maskPassword(password: string | undefined): string {
        return password ? '*'.repeat(password.length) : ""
    }

    function formatDate(dateString: string) {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dashboard"/>
            {
                showAddAccountForm && (<>
                        <div className="fixed h-full mt-16 w-full z-20 bg-black opacity-25">
                        </div>
                        <div className="fixed flex flex-col justify-center items-center h-full w-full z-30">
                            <div ref={popUpAddAccountRef}
                                 className="bg-white border-2 rounded-2xl border-gc-gamboge h-fit w-4/5 sm:w-2/3 lg:w-1/2">
                                <form onSubmit={handleSubmitAddAccount}
                                      className="flex flex-col items-center justify-between h-full space-y-4" action="">
                                    <div className="w-full">
                                        <div className="mt-4 mx-4 font-mono">
                                            <div className="flex flex-col">
                                                <label htmlFor="title">Title</label>
                                                <input value={addAccountForm.title} onChange={handleAddAccountFormInput}
                                                       className="text-sm rounded-md" name="title" type="text"
                                                       placeholder="Akun Game Ternak Lele 999" required/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="credential">Credential</label>
                                                <input
                                                    value={addAccountForm.credential} onChange={handleAddAccountFormInput}
                                                    className="text-sm rounded-md" name="credential" type="text"
                                                    placeholder="Username or Email , ah whatever" required/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="password">Password (Optional)</label>
                                                <input
                                                    value={addAccountForm.password} onChange={handleAddAccountFormInput}
                                                    className="text-sm rounded-md" name="password" type="text"
                                                    placeholder="Password teh nani?"/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="type">Type</label>
                                                <select value={addAccountForm.type} onChange={handleAddAccountFormInput}
                                                        className="text-sm rounded-md" name="type" required>
                                                    <option value="">Select an Type</option>
                                                    {data && types && types.length !== 0 ?
                                                        types.map((type, i) => (
                                                            <option className="uppercase" key={i}
                                                                    value={type}>{type}</option>
                                                        ))
                                                        :
                                                        <option className="uppercase"
                                                                value="others">others</option>
                                                    }

                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="note">Note (Optional)</label>
                                                <textarea value={addAccountForm.note} onChange={handleAddAccountFormInput}
                                                          className="text-sm rounded-md" name="note"
                                                          placeholder="Just optional note, dont worry you can skip iki"/>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit"
                                            className="mb-4 rounded-b-xl  bg-gc-gamboge w-full h-10 font-bold text-white font-mono tracking-widest">
                                        SAVE
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                )
            }
            {
                addAccountToggle && (<>
                        <div className="fixed h-full mt-16 w-full z-20 bg-black opacity-25">
                        </div>
                        <div className="fixed flex flex-col justify-center items-center h-full w-full z-30">
                            <div ref={popUpAddAccountRef}
                                 className="bg-white border-2 rounded-2xl border-gc-gamboge h-fit w-4/5 sm:w-2/3 lg:w-1/2">
                                <form onSubmit={handleCheckPassword}
                                      className="flex flex-col items-center justify-between h-full space-y-4">
                                    <div className="w-full">
                                        <div className="mt-4 mx-4 font-mono">
                                            <div className="flex flex-col">
                                                <label htmlFor="newType">Password</label>
                                                <input value={passwordInput} onChange={handlePasswordInput}
                                                       className="text-sm rounded-md" name="newType" type="text"
                                                       placeholder="Enter your password to continue." required/>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit"
                                            className="mb-4 rounded-b-xl  bg-gc-gamboge w-full h-10 font-bold text-white font-mono tracking-widest">
                                        NEXT
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                )
            }


            {
                showWrongPasswordAlert && (<>
                        <div className="fixed h-full mt-16 w-full z-20 bg-black opacity-25">
                        </div>
                        <div className="fixed flex flex-col justify-center items-center h-full w-full z-30">
                            <div ref={wrongPasswordRef}
                                 className="bg-white border-2 rounded-2xl border-gc-gamboge h-fit w-fit">
                                <div onSubmit={handleCheckPassword}
                                     className="flex flex-col items-center justify-between h-full space-y-4">

                                    <div className="mt-4 mx-4 font-mono font-bold">
                                        WRONG PASSWORD
                                    </div>

                                    <button onClick={() => setShowWrongPasswordAlert(false)}
                                            className="mb-4 rounded-b-xl  bg-gc-gamboge w-full h-10 font-bold text-white font-mono tracking-widest">
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
            {
                typeToggle && (<>
                        <div className="fixed h-full mt-16 w-full z-20 bg-black opacity-25">
                        </div>
                        <div className="fixed flex flex-col justify-center items-center h-full w-full z-30">
                            <div ref={popUpTypeRef}
                                 className="bg-white border-2 rounded-2xl border-gc-gamboge h-fit w-4/5 sm:w-2/3 lg:w-1/2">
                                <form onSubmit={handleSubmitNewType}
                                      className="flex flex-col items-center justify-between h-full space-y-4" action="">
                                    <div className="w-full">
                                        <div className="mt-4 mx-4 font-mono">
                                            <div className="flex flex-col">
                                                <label htmlFor="newType">New Type</label>
                                                <input required value={typeInput}
                                                       onChange={(e) => setTypeInput(e.target.value)}
                                                       className="text-sm rounded-md" name="newType" type="text"
                                                       placeholder="Insert Type Anyar"/>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit"
                                            className="mb-4 rounded-b-xl  bg-gc-gamboge w-full h-10 font-bold text-white font-mono tracking-widest">
                                        ADD NEW TYPE
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                )
            }
            {
                editToggle && (<>
                        <div className="fixed h-full mt-16 w-full z-20 bg-black opacity-25">
                        </div>
                        <div className="fixed flex flex-col justify-center items-center h-full w-full z-30">
                            <div ref={editRef}
                                 className="bg-white border-2 rounded-2xl border-gc-gamboge h-fit w-4/5 sm:w-2/3 lg:w-1/2">
                                <form onSubmit={handleSubmitEditAccount}
                                      className="flex flex-col items-center justify-between h-full space-y-4" action="">
                                    <div className="w-full">
                                        <div className="mt-4 mx-4 font-mono">
                                            <div className="flex flex-col">
                                                <label htmlFor="title">Title</label>
                                                <input value={updateAccountForm.title} onChange={handleEditAccountInput}
                                                       className="text-sm rounded-md" name="title" type="text"
                                                       placeholder={dataDetail?.title}/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="credential">Credential</label>
                                                <input
                                                    value={dataDetail?.credential} disabled
                                                    className="text-sm rounded-md bg-gray-300" name="credential" type="text"
                                                    placeholder="Username or Email , ah whatever"/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="password">Password (Optional)</label>
                                                <input
                                                    value={updateAccountForm.password} onChange={handleEditAccountInput}
                                                    className="text-sm rounded-md" name="password" type="text"
                                                    placeholder={dataDetail?.password}/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="type">Type</label>
                                                <select value={updateAccountForm.type} onChange={handleEditAccountInput}
                                                        className="text-sm rounded-md" name="type">
                                                    <option disabled value="">{dataDetail?.type}</option>
                                                    {data && types && types.length !== 0 ?
                                                        types.map((type, i) => (
                                                            <option className="uppercase" key={i}
                                                                    value={type}>{type}</option>
                                                        ))
                                                        :
                                                        <option className="uppercase"
                                                                value="others">others</option>
                                                    }

                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="note">Note (Optional)</label>
                                                <textarea value={updateAccountForm.note} onChange={handleEditAccountInput}
                                                          className="text-sm rounded-md" name="note"
                                                          placeholder={dataDetail?.note}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full h-10 font-bold font-mono">
                                        <button type="submit"
                                                className="rounded-bl-xl  bg-gc-gamboge w-3/4 h-full font-bold text-white tracking-widest">
                                            SAVE
                                        </button>
                                        <button onClick={handleDeleteAccount} type="button"
                                                className="rounded-br-xl  bg-red-600 w-1/4 h-full font-bold text-white  tracking-widest">
                                            DELETE
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )
            }

            {
                detailToggle && (<>
                        <div className="fixed h-full mt-16 w-full z-20 bg-black opacity-25">
                        </div>
                        <div className="fixed flex flex-col justify-center items-center h-full w-full z-30">
                            <div ref={detailRef}
                                 className="bg-white border-2 rounded-2xl border-gc-gamboge h-fit w-4/5 sm:w-2/3 lg:w-1/2">
                                <form onSubmit={handleUnlockPassword}
                                      className="flex flex-col items-center justify-between h-full space-y-4">
                                    <div className="w-full">
                                        <div className="mt-4 mx-4 font-mono">
                                            <div className="flex flex-col">
                                                <label htmlFor="newType">Password</label>
                                                <input value={passwordInput} onChange={handlePasswordInput}
                                                       className="text-sm rounded-md" name="newType" type="text"
                                                       placeholder="Enter your password to continue." required/>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit"
                                            className="mb-4 rounded-b-xl  bg-gc-gamboge w-full h-10 font-bold text-white font-mono tracking-widest">
                                        NEXT
                                    </button>
                                </form>
                            </div>
                        </div>


                    </>
                )
            }
            {showDetailToggle &&
                <>
                    <div className="fixed h-full mt-16 w-full z-20 bg-black opacity-25">
                    </div>
                    <div className="fixed flex  flex-col justify-center items-center h-full w-full z-30">
                        <div ref={showDetailRef}
                             className="bg-white border-2 rounded-2xl border-gc-gamboge h-fit w-4/5 sm:w-2/3 lg:w-1/2">
                            <div className=" mt-4 flex flex-col items-center justify-between h-full">
                                <div className="overflow-y-scroll w-full max-w-full max-h-96 no-scrollbar">
                                    <div className="max-w-full text-justify mb-2 mx-4 font-mono">
                                        <p className="text-sm">
                                            if your <span className="font-bold">
                                            PASSWORD
                                        </span>  is un-readable (raiso diwoco), then the password you entered is incorrect
                                        </p>
                                    </div>
                                    <div className="max-w-full flex flex-col mb-2 mx-4 font-mono">
                                        <h1 className="font-bold ">
                                            Title
                                        </h1>
                                        <p>
                                            {dataDetail && dataDetail.title}
                                        </p>
                                    </div>
                                    <div className="max-w-full flex flex-col mb-2 mx-4 font-mono">
                                        <h1 className="font-bold ">
                                            Credential
                                        </h1>
                                        <p>
                                            {dataDetail && dataDetail.credential}
                                        </p>
                                    </div>
                                    <div className="max-w-full flex flex-col mb-2 mx-4 font-mono">
                                        <h1 className="font-bold ">
                                            Password
                                        </h1>
                                        <p>
                                            {unlockedPassword}
                                        </p>
                                    </div>
                                    <div className="max-w-full flex flex-col mb-2 mx-4 font-mono">
                                        <h1 className="font-bold">
                                            Type
                                        </h1>
                                        <p>
                                            {dataDetail && dataDetail.type}
                                        </p>
                                    </div>
                                    <div
                                        className="max-w-full max-h-full flex flex-col mb-2 mx-4 font-mono">
                                        <h1 className="font-bold">
                                            Note
                                        </h1>
                                        <p>
                                            {
                                                dataDetail && dataDetail.note
                                            }
                                        </p>
                                    </div>
                                    <div
                                        className="max-w-full max-h-full flex flex-col mb-0 mx-4 font-mono">
                                        <h1 className="font-bold">
                                            Last Edited
                                        </h1>
                                        <p>
                                            {
                                                dataDetail && dataDetail.updated_at ? formatDate(dataDetail.updated_at) : ""
                                            }
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => {
                                    setSelectedId(null)
                                   setShowDetailToggle(false)
                                    setPasswordInput("")
                                }} type="submit"
                                        className="mb-4 bg-gc-gamboge rounded-b-xl  w-full h-10 font-bold text-white font-mono tracking-widest">
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            }
            <div className="flex flex-col py-12 min-h-screen h-full items-center">
                <div
                    className="max-w-7xl mt-16 mx-4 sm:px-6 lg:px-8 min-w-80 min-[390px]:min-w-96 sm:min-w-[640px] lg:min-w-[1080px] z-0">
                    <div className="bg-gc-ocean-green rounded-2xl p-4 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="mx-4 flex justify-between">
                            <button onClick={handleAddAccountToggle}
                                    className="flex items-center  p-1 rounded-md hover:bg-gc-green">
                                <PlusSquare fill="white" width="25" height="25"/>
                                <p className="pl-2 text-white text-sm">Add Account</p>
                            </button>
                            <button onClick={handleTypeToggle}
                                    className="flex items-center p-1 rounded-md hover:bg-gc-green">
                                <FolderPlus fill="white" width="25" height="25"/>
                                <p className="pl-2 text-white text-sm">New Type</p>
                            </button>
                            <button ref={filterButtonRef}
                                    className={`flex items-center p-1 rounded-md sm:hover:bg-gc-green `}
                                    onClick={handleFilterToggle}>
                                {
                                    filterToggle ? <FunnellFill fill="green" width="25" height="25"/> :
                                        <FunnellFill fill="white" width="25" height="25"/>
                                }
                            </button>
                        </div>
                    </div>
                </div>
                {filterToggle && (
                    <>
                        <div
                            className="absolute flex justify-end max-w-7xl mt-32 mx-2 sm:px-6 lg:px-8 min-w-80 min-[390px]:min-w-96 sm:min-w-[640px] lg:min-w-[1080px] z-20">
                            <div ref={dropdownFilterRef}
                                 className=" flex bg-gc-ocean-green max-w-full w-fit rounded-2xl text-white font-bold font-mono">
                                <ul>
                                    <li className=" px-4 py-2 hover:bg-gc-green cursor-pointer">
                                        <button
                                            onClick={handleFilter}
                                            value=""
                                            className="flex justify-between items-center w-full max-h-16 overflow-hidden">
                                            <p className="w-4/5 mr-4 uppercase tracking-widest text-left">
                                                all
                                            </p>
                                            {
                                                currentType === "" &&
                                                <Checklist width="20" height="20"/>
                                            }

                                        </button>
                                    </li>
                                    <li className=" px-4 py-2 hover:bg-gc-green cursor-pointer">
                                        <button
                                            onClick={handleFilter}
                                            value="others"
                                            className="flex justify-between items-center w-full max-h-16 overflow-hidden">
                                            <p className="w-4/5 mr-4 uppercase tracking-widest text-left">
                                                others
                                            </p>
                                            {
                                                currentType === "others" &&
                                                <Checklist width="20" height="20"/>
                                            }

                                        </button>
                                    </li>
                                    {data && types && types.length !== 0 ?
                                        types.map((type, i) => (
                                            <li key={i} className=" px-4 py-2 hover:bg-gc-green cursor-pointer">
                                                <button
                                                    onClick={handleFilter}
                                                    value={type}
                                                    className="flex justify-between items-center w-full max-h-16 overflow-hidden">
                                                    <p className="w-4/5 mr-4 uppercase tracking-widest text-left">
                                                        {type}
                                                    </p>
                                                    {
                                                        currentType === type &&
                                                        <Checklist width="20" height="20"/>
                                                    }
                                                </button>
                                            </li>
                                        ))
                                        :
                                        <li className=" px-4 py-2 hover:bg-gc-green cursor-pointer">
                                            <button
                                                className="flex justify-between items-center w-full max-h-16 overflow-hidden">
                                                <p className="w-4/5 mr-4">
                                                    Others
                                                </p>
                                            </button>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </div>

                    </>

                )}

                {
                    filteredData ?
                        (<div
                            className="relative flex flex-col h-full  justify-start min-w-80 min-[390px]:min-w-96 sm:min-w-[640px] lg:min-w-[1080px] sm:px-6 lg:px-8 pt-5 max-w-80 min-[390px]:max-w-96 mx-2 z-0">
                            {filteredData?.map((account: AccountData, i) => (
                                <div key={i} className="relative mb-4 flex h-fit w-full items-center">
                                    <button
                                        className="z-0 flex flex-col text-left bg-gc-yellow h-fit w-full rounded-2xl px-6 py-4"
                                        onClick={handleDetailToggle} key={i} id={account.id?.toString()}>
                                        <h1 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-black font-bold font-sans text-sm tracking-tighter">
                                            {account.title}
                                        </h1>
                                        <div className=" max-w-full flex items-center justify-between">
                                            <div className="max-w-full flex flex-col text-left text-lg font-mono">
                                                <div className="max-w-60 min-[390px]:max-w-72 sm:max-w-96 mb-4">
                                                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">{account.credential}</p>
                                                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">***********</p>
                                                </div>
                                                <h1 className="max-w-60 min-[390px]:max-w-72 sm:max-w-96 overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 font-bold font-sans uppercase text-sm tracking-widest">
                                                    {account.type}
                                                </h1>
                                            </div>
                                        </div>
                                    </button>
                                    <button onClick={handleEditToggle} id={account.id?.toString()}
                                            className="absolute z-10 right-3 bg-gc-ocean-green p-1 h-fit rounded-md flex flex-col">
                                        <PencilSquare fill="white" width="30" height="30"/>
                                    </button>
                                </div>
                            ))}
                        </div>)
                        :
                        data && accounts && accounts.length !== 0 ?
                            (<div
                                className="relative flex flex-col h-full  justify-start min-w-80 min-[390px]:min-w-96 sm:min-w-[640px] lg:min-w-[1080px] sm:px-6 lg:px-8 pt-5 max-w-80 min-[390px]:max-w-96 mx-2 z-0">
                                {data?.accounts.map((account: AccountData, i) => (
                                    <div key={i} className="relative mb-4 flex h-fit w-full items-center">
                                        <button
                                            className="z-0 flex flex-col text-left bg-gc-yellow h-fit w-full rounded-2xl px-6 py-4"
                                            onClick={handleDetailToggle} key={i} id={account.id?.toString()}>
                                            <h1 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-black font-bold font-sans text-sm tracking-tighter">
                                                {account.title}
                                            </h1>
                                            <div className=" max-w-full flex items-center justify-between">
                                                <div className="max-w-full flex flex-col text-left text-lg font-mono">
                                                    <div className="max-w-60 min-[390px]:max-w-72 sm:max-w-96 mb-4">
                                                        <p className="overflow-hidden text-ellipsis whitespace-nowrap">{account.credential}</p>
                                                        <p className="overflow-hidden text-ellipsis whitespace-nowrap">***********</p>
                                                    </div>
                                                    <h1 className="max-w-60 min-[390px]:max-w-72 sm:max-w-96 overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 font-bold font-sans uppercase text-sm tracking-widest">
                                                        {account.type}
                                                    </h1>
                                                </div>

                                            </div>
                                        </button>
                                        <button onClick={handleEditToggle} id={account.id?.toString()}
                                                className="absolute z-10 right-3 bg-gc-ocean-green p-1 h-fit rounded-md flex flex-col">
                                            <PencilSquare fill="white" width="30" height="30"/>
                                        </button>
                                    </div>
                                ))}
                            </div>)
                            :
                            (
                                <div className="flex flex-col h-full w-full items-center my-auto justify-center">
                                    <p className="mb-5 opacity-50 text-xl text-gray-400">
                                        You Haven't Added Any Account
                                    </p>
                                    <button onClick={handleAddAccountToggle}>
                                        <PlusCircleDotted width="200" height="200" fill="gray" opacity="0.2"/>
                                    </button>
                                </div>
                            )
                }
            </div>
        </AuthenticatedLayout>
    );
}
