'use client'

import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";

const Navbar = () => {

    const router = useRouter();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    const [search, setSearch] = useState('');

    // ✅ Safe Redux
    const cartCount = useSelector(state => state?.cart?.total || 0);

    // 🔍 Search
    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/shop?search=${search}`);
    };

    // 🛒 Cart
    const handleCartClick = () => {
        if (!user) {
            openSignIn({ afterSignInUrl: "/cart" });
            return;
        }

        if (cartCount === 0) {
            alert("Your cart is empty 🛒");
            return;
        }

        router.push("/cart");
    };

    // 📦 Orders
    const handleOrdersClick = () => {
        if (!user) {
            openSignIn({ afterSignInUrl: "/orders" });
            return;
        }

        router.push("/orders");
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="mx-4 sm:mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4">

                    {/* 🔹 Logo */}
                    <Link href="/" className="relative text-3xl sm:text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart
                        <span className="text-green-600 text-4xl sm:text-5xl">.</span>

                        <p className="absolute text-[10px] sm:text-xs font-semibold -top-1 -right-6 sm:-right-8 px-2 sm:px-3 py-0.5 rounded-full text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* 🔹 Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-5 lg:gap-8 text-slate-600 text-sm">

                        <Link href="/" className="hover:text-black">Home</Link>
                        <Link href="/shop" className="hover:text-black">Shop</Link>

                        {/* 📦 Orders */}
                        <button onClick={handleOrdersClick} className="hover:text-black">
                            Orders
                        </button>

                        <Link href="/" className="hover:text-black">About</Link>
                        <Link href="/" className="hover:text-black">Contact</Link>

                        {/* 🔍 Search */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden xl:flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
                        >
                            <Search size={18} />
                            <input
                                className="w-full bg-transparent outline-none"
                                type="text"
                                placeholder="Search products"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>

                        {/* 🛒 Cart */}
                        <button onClick={handleCartClick} className="relative flex items-center gap-2 hover:text-black">
                            <ShoppingCart size={18} />
                            Cart
                            <span className="absolute -top-1 left-3 text-[10px] text-white bg-slate-600 w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        </button>

                        {/* 🔐 Auth with Orders inside dropdown */}
                        {user ? (
                            <UserButton afterSignOutUrl="/">
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label="📦 My Orders"
                                        onClick={() => router.push("/orders")}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <button
                                onClick={() => openSignIn()}
                                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* 🔹 Mobile */}
                    <div className="sm:hidden flex items-center gap-3">

                        <button onClick={handleOrdersClick} className="text-sm">
                            Orders
                        </button>

                        <button onClick={handleCartClick} className="relative">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-1 -right-2 text-[10px] text-white bg-slate-600 w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        </button>

                        {user ? (
                            <UserButton afterSignOutUrl="/">
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label="📦 My Orders"
                                        onClick={() => router.push("/orders")}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <button
                                onClick={() => openSignIn()}
                                className="px-4 py-1.5 bg-indigo-500 text-white text-sm rounded-full"
                            >
                                Login
                            </button>
                        )}
                    </div>

                </div>
            </div>

            <hr className="border-gray-200" />
        </nav>
    );
};

export default Navbar;