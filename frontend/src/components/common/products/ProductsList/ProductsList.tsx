import React from "react";
import "./ProductsList.scss";
import Link from "next/link";
import Image from "next/image";
import {apiFetch} from "@lib/api"

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    author: string;
    img: string;
};

const API_IMG_PRODUCT = process.env.URL_API_IMG_PRODUCT;

async function GetProductsList() {
    const data = await apiFetch<{ data: Product[] }>(`/api/products`);
    return data.data;
}


function formatRub(value: number | string): number {
    return parseInt(value.toString())
}

function buildProductImageUrl(
    img: string,
    baseUrl: string = API_IMG_PRODUCT ?? ""
): string {
    return `${baseUrl}${img}`;
}

export default async function ProductsList() {
    const products = await GetProductsList();

    const productsArr = products.map((p: Product) => ({
        ...p,
        img: buildProductImageUrl(p.img),
        price: formatRub(p.price),
    }));

    return (
        <div className="container container__products-list">
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
        </div>
    );
}
