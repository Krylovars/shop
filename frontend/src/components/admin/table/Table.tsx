'use client';

import './Table.scss';
import {Drawer} from '@components/admin/drawer/Drawer';
import {useState, useEffect} from 'react';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    author: string;
    img: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const API_IMG_PRODUCT = process.env.URL_API_IMG_PRODUCT;

async function GetProductsList() {
    const res = await fetch(`${API_BASE}/api/products`);

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
}

export default function Table() {
    const [rows, setRows] = useState<Product[]>([]);
    const [headers, setHeaders] = useState<(keyof Product)[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        GetProductsList().then(data => {
            setRows(data);
            if (data.length > 0) {
                setHeaders(Object.keys(data[0]) as (keyof Product)[]);
            }
        });
    }, []);

    return (
        <>
            <div className="btn">
                <button className="btn__add" onClick={() => setIsDrawerOpen(true)}>Add</button>
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
                            <td key={header}>{row[header]}</td>
                        ))}
                        <td>
                            <div className="btn">
                                <a className="btn__edit" href={`/product/${row.id}/edit`}>Edit</a>
                                <a className="btn__delete" href={`/product/${row.id}/delete`}>Delete</a>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <p>Drawer content</p>
            </Drawer>
        </>
    );
}
