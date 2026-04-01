'use client';
import {type ReactNode, useEffect, useState} from "react";

type FormProps = {
    resource: string;
    children?: ReactNode;
};

type FieldMeta = {
    type: string;
    label: string;
    required?: boolean;
    options?: Record<string, string>;
};
type FormSchema = {
    fields: Record<string, FieldMeta>;
};


const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getData(resource: string) {
    const res = await fetch(`${API_BASE}/api/${resource}/schema`);
    return await res.json();
}
function renderControl(key: string, arrFields: FieldMeta) {
    const id = `form-field-${key}`;
    let inputElement;
    switch (arrFields.type) {
        case "string":
            inputElement = (
                <input
                    id={id}
                    name={key}
                    type="text"
                />
            );
            break;
        case "number":
            inputElement = (
                <input
                    id={id}
                    name={key}
                    type="number"
                    step="any"
                />
            );
            break;
        case "select":
            inputElement = (
                <select id={id} name={key}>
                    <option key={0} value=''>
                        Пусто
                    </option>
                    {arrFields.options && Object.entries(arrFields.options).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            );
            break;
        case "image":
            inputElement = (
                <input
                    id={id}
                    name={key}
                    type="file"
                    accept="image/*"
                />
            );
            break;
    }

    return (
        <div className="form-field" key={key}>
            <label htmlFor={id}>{arrFields.label}</label>
            {inputElement}
        </div>
    );
}

export function Form({resource, children}: FormProps) {
    const [schema, setSchema] = useState<FormSchema | null>(null);
    useEffect(() => {
        getData(resource).then(setSchema).catch(console.error);
    }, [resource]);
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await fetch(`${API_BASE}/api/${resource}`, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
        });
    }

    return (
        <div className="admin-form">
            {!schema && <p>Загрузка схемы…</p>}
            {schema && (
                <form onSubmit={handleSubmit}>
                    {Object.entries(schema.fields).map(([key, field]) =>
                        renderControl(key, field)
                    )}
                    <button type="submit">
                        click
                    </button>
                </form>
            )}
            {children}
        </div>
    );
}