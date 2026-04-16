"use client";

import "./Table.scss";
import { Drawer } from "@components/admin/drawer/Drawer";
import { Form } from "@components/admin/form/Form";
import { useState } from "react";
import { useApiRequest } from "@lib/http/useApiRequest";
import { httpClient } from "@lib/http/httpClient";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    author: string;
    img: string;
};

type ProductsResponse = { data: Product[] };

export default function Table() {
    const { data, loading, error } = useApiRequest(
        () => httpClient<ProductsResponse>('/api/products')
    );

    const rows: Product[] = data?.data ?? [];
    let headers: (keyof Product)[] = []

    if (rows.length !== 0) {
        headers = Object.keys(rows[0]) as (keyof Product)[]
    }

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    if (loading) {
        return <p>Загрузка…</p>;
    }
    if (error) {
        return (
            <div>
                <p>{error.message}</p>
            </div>
        );
    }
    return (
        <>
            <div className="btn">
                <button
                    className="btn__add"
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    Add
                </button>
            </div>
            <table className="table">
                <caption>Table</caption>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row: Product) => (
                        <tr key={row.id}>
                            {headers.map((header) => (
                                <td key={header}>{String(row[header])}</td>
                            ))}
                            <td>
                                <div className="btn">
                                    <a
                                        className="btn__edit"
                                        href={`/product/${row.id}/edit`}
                                    >
                                        Edit
                                    </a>
                                    <a
                                        className="btn__delete"
                                        href={`/product/${row.id}/delete`}
                                    >
                                        Delete
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >

                <Form resource="products" />
            </Drawer>
        </>
    );
}
