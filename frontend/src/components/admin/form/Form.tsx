"use client";

import { type FormEvent, type ReactNode } from "react";
import { useApiRequest } from "@lib/http/useApiRequest";
import {httpClient} from "@lib/http/httpClient";

type FormField = {
    type: string;
    label: string;
    required?: boolean;
    options?: Record<string, string>;
};

type Schema = {
    fields: Record<string, FormField>;
};

function renderControl(key: string, arrFields: FormField) {
    const id = `form-field-${key}`;
    let inputElement: ReactNode = null;
    switch (arrFields.type) {
        case "string":
            inputElement = <input id={id} name={key} type="text" />;
            break;
        case "number":
            inputElement = (
                <input id={id} name={key} type="number" step="any" />
            );
            break;
        case "select":
            inputElement = (
                <select id={id} name={key}>
                    <option value="">Пусто</option>
                    {arrFields.options &&
                        Object.entries(arrFields.options).map(([value, label]) => (
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
        default:
            inputElement = (
                <span className="form-field__unknown">
                    Неизвестный тип поля: {arrFields.type}
                </span>
            );
    }

    return (
        <div className="form-field" key={key}>
            <label htmlFor={id}>{arrFields.label}</label>
            {inputElement}
        </div>
    );
}

export function Form(data: { resource: string }) {
    const schemaUrl = `/api/${data.resource}/schema`;
    const { data: schema, loading, error } = useApiRequest(
        () => httpClient<Schema>(schemaUrl)
    );

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        const urlForm = `/api/${data.resource}`;
        await httpClient (urlForm, {
            method: "POST",
            body: fd,
        });
    }

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

    const fields = schema?.fields ?? {};

    return (
        <div className="admin-form">
            <form onSubmit={(e) => void handleSubmit(e)}>
                {Object.entries(fields).map(([key, arrFields]) =>
                    renderControl(key, arrFields)
                )}
                <button type="submit" >
                    Сохранить
                </button>
            </form>
        </div>
    );
}