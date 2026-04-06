"use client";

import { type FormEvent, type ReactNode } from "react";
import { apiFetch } from "@lib/api";
import { useFetch } from "@lib/useFetch";

type FormProps = {
    resource: string;
    children?: ReactNode;
    /** Вызов после успешного сохранения (например обновить таблицу). */
    onSuccess?: () => void;
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

function renderControl(key: string, arrFields: FieldMeta) {
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

export function Form({ resource, children, onSuccess }: FormProps) {
    const schemaUrl = resource ? `/api/${resource}/schema` : null;
    const {
        data: schema,
        loading: schemaLoading,
        error: schemaError,
        refetch: refetchSchema,
    } = useFetch<FormSchema>(schemaUrl);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const data = (await apiFetch(`/api/${resource}`, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData,
            })) as { success?: boolean };

            if (data.success) {
                form.reset();
                onSuccess?.();
            }
        } catch {
            /* ошибка уже в apiFetch */
        }
    }

    return (
        <div className="admin-form">
            {schemaLoading && <p>Загрузка схемы…</p>}

            {schemaError && (
                <div>
                    <p>{schemaError.message}</p>
                    <button type="button" onClick={() => refetchSchema()}>
                        Повторить
                    </button>
                </div>
            )}

            {schema && !schemaError && (
                <form onSubmit={(e) => void handleSubmit(e)}>
                    {Object.entries(schema.fields).map(([key, field]) =>
                        renderControl(key, field)
                    )}
                    <button type="submit">Сохранить</button>
                </form>
            )}
            {children}
        </div>
    );
}
