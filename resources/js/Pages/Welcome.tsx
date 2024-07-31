import React, {useEffect, useState} from "react";
import {Head, router, usePage} from '@inertiajs/react';

import Footer from "@/Components/Footer";
import AuthForm from "@/Components/AuthForm";
import {PageProps} from "@/types";

interface WelcomeProps {
    event: {
        userEmail: string
    },
    auth: PageProps
}

export default function Welcome({event, auth}: WelcomeProps) {
    useEffect(() => {
        if(auth.user){
            router.get('/dashboard');
        }
    }, []);

    return (
        <>
            <Head>
                <title>Welcome</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </Head>
            <main className="flex flex-col h-screen w-screen">
                <header>
                    <div className={`flex flex-col h-1/5 w-full justify-start text-center p-0 text-sm font-mono mb-0`}>
                        <h2 className={`font-bold text-3xl`}>
                            Aplikasi Manajemen Akun
                        </h2>
                        <p>
                            Sebaiknya jangan gegabah
                        </p>
                        <p>
                            Akun yang disimpan di list tidak akan bocor karena data dienkripsi dengan algoritma AES-256
                        </p>
                        <p>
                            (source: trustme bro)
                        </p>
                        <p>
                            Aman kok bro santai aja.
                        </p>
                        <p>
                            Pengembang tidak akan bisa melihat akun anda. Percayalah mwhehe
                        </p>

                    </div>
                </header>
                <section className="flex flex-col h-full bg-white p-2 ">
                    <div className="flex flex-row justify-center">
                        <div className="w-full sm:max-w-[1080px]">
                            {event ?
                                <AuthForm userEmail={event.userEmail as string}/>
                                :
                                <AuthForm/>
                            }
                        </div>
                    </div>
                </section>

                <Footer/>

            </main>


            {/*<nav className="-mx-3 flex flex-1 justify-end">*/}
            {/*    {auth.user ? (*/}
            {/*        <Link*/}
            {/*            href={route('dashboard')}*/}
            {/*            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"*/}
            {/*        >*/}
            {/*            Dashboard*/}
            {/*        </Link>*/}
            {/*    ) : (*/}
            {/*        <>*/}
            {/*            <Link*/}
            {/*                href={route('login')}*/}
            {/*                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"*/}
            {/*            >*/}
            {/*                Log in*/}
            {/*            </Link>*/}
            {/*            <Link*/}
            {/*                href={route('register')}*/}
            {/*                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"*/}
            {/*            >*/}
            {/*                Register*/}
            {/*            </Link>*/}
            {/*        </>*/}
            {/*    )}*/}
            {/*</nav>*/}
        </>


    );
}
