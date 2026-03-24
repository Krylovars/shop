"use client"


import './Header.scss';
import Link from "next/link";
import Image from "next/image";
import { CartIcon } from "@components/common/icons/CartIcon";
import { Burger } from "@components/common/burger/Burger";
import { useEffect, useState } from "react";

export default function Header() {
    const links = [
        {
            href: "/",
            label: "Главная"
        },
        {
            href: "/about",
            label: "О нас"
        }
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    return (
        <header className="header">
            <div className="container header__container">
                <div className="header__left">
                    <Link href="/" className="logo">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={143}
                            height={35}
                            loading="eager"/>
                    </Link>
                </div>
                <div className="header__right">
                    <Burger
                        isOpen={isMenuOpen}
                        onToggle={() => setIsMenuOpen((prev) => !prev)}
                        links={links}
                    />
                    <nav className="nav">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <Link href="/" className="cart">
                        <CartIcon />
                    </Link>
                </div>


            </div>
        </header>
    );
}