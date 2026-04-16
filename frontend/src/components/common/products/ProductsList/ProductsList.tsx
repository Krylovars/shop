"use client";
import { useMemo } from "react";
import "./ProductsList.scss";
import Link from "next/link";
import Image from "next/image";
import { useApiRequest } from "@lib/http/useApiRequest";
import {httpClient} from "@lib/http/httpClient";
type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    author: string;
    img: string;
};
type ProductsResponse = { data: Product[] };
const API_IMG_PRODUCT = process.env.NEXT_PUBLIC_URL_API_IMG_PRODUCT;
function formatRub(value: number | string): number {
    return parseInt(value.toString())
}
function buildProductImageUrl(
    img: string,
    baseUrl: string = API_IMG_PRODUCT ?? ""
): string {
    return `${baseUrl}${img}`;
}
export default function ProductsList() {
    const { data, loading, error } = useApiRequest(
        () => httpClient<ProductsResponse>("/api/products")
    );

    const productsArr = useMemo(
        () =>
            (data?.data ?? []).map((p: Product) => ({
                ...p,
                img: buildProductImageUrl(p.img),
                price: formatRub(p.price),
            })),
        [data]
    );

    if (loading) {
        return <p>Загрузка…</p>;
    }

    if (error) {
        return <p>Ошибка: {error.message}</p>;
    }
    return (
        <>
            <h2 className="products-list__title">Репродукции</h2>
            <div className="products-list__row">
                {productsArr.map((product: Product) => (
                    <div className="product-item" key={product.id}>
                        <Link href={`/product/${product.id}`}>
                            <Image
                                className="product-item__image"
                                src={product.img}
                                alt={product.name}
                                unoptimized
                                width={300}
                                height={400}
                            />
                            <p className="product-item__author">{product.author}</p>
                            <p className="product-item__name">{product.name}</p>
                            <p className="product-item__description">{product.description}</p>
                            <p className="product-item__price">{product.price} руб</p>
                        </Link>
                        <button className="product-item__button" data-id={product.id}>Купить</button>
                    </div>
                ))}
            </div>
        </>
    );
}
