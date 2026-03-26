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

    const cartCount = useSelector(state => state?.cart?.total || 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/shop?search=${search}`);
    };

    const handleCartClick = () => {
        if (!user) {
            openSignIn({ afterSignInUrl: "/cart" });
            return;
        }
        router.push("/cart");
    };

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

                    {/* Logo */}
                    <Link href="/" className="text-3xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart
                    </Link>

                    {/* Desktop */}
                    <div className="hidden sm:flex items-center gap-6 text-sm">

                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>

                        <button onClick={handleOrdersClick}>
                            Orders
                        </button>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex items-center bg-gray-100 px-3 py-1 rounded">
                            <Search size={16} />
                            <input
                                className="bg-transparent outline-none ml-2"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                            />
                        </form>

                        {/* Cart */}
                        <button onClick={handleCartClick} className="relative">
                            <ShoppingCart size={18} />
                            <span className="absolute -top-2 -right-2 text-xs bg-black text-white px-1 rounded">
                                {cartCount}
                            </span>
                        </button>

                        {/* Auth */}
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
                                className="bg-indigo-500 text-white px-4 py-1 rounded"
                            >
                                Login
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;