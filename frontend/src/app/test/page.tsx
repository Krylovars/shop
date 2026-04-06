"use client";

import {apiFetch} from "@lib/api"
import React, {useEffect, useState} from "react";

type User = {
    id: number;
    name: string;
    email: string
};

export default function TestHomePage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [name, setName] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tokenKey = "api_token";

    async function loadMe(token: string) {
        try {
            const response = (await apiFetch(`/api/user`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })) as { id?: number; name?: string; email?: string };

            if (!response.id) {
                localStorage.removeItem(tokenKey);
                setUser(null);
                return;
            }
            setUser(response as User);
        } catch {
            localStorage.removeItem(tokenKey);
            setUser(null);
        }
    }

    useEffect(() => {
        const t = localStorage.getItem(tokenKey);
        if (t) void loadMe(t);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (mode === "register") {
                const res = await apiFetch(`/api/register`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        password_confirmation: passwordConfirmation,
                    }),
                });
                const data = res as { token: string };
                localStorage.setItem(tokenKey, data.token);
                await loadMe(data.token);
            } else {
                const res = await apiFetch(`/api/login`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, password}),
                });
                const data = res as { token: string };
                console.log(data);
                localStorage.setItem(tokenKey, data.token);
                await loadMe(data.token);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка");
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        const t = localStorage.getItem(tokenKey);
        if (t) {
            try {
                await apiFetch(`/api/logout`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${t}`,
                    },
                });
            } catch {
                /* сеть / 401 — всё равно выходим локально */
            }
        }
        localStorage.removeItem(tokenKey);
        setUser(null);
    }

    return (
        <div className="container">
            <h1>Тест</h1>

            {user ? (
                <p>
                    Вошёл как: <strong>{user.email}</strong> ({user.name})
                </p>
            ) : (
                <p>Не авторизован</p>
            )}

            {user ? (
                <button type="button" onClick={() => void logout()}>
                    Выйти
                </button>
            ) : (
                <>
                    <div>
                        <button type="button" onClick={() => setMode("login")}>
                            Вход
                        </button>
                        <button type="button" onClick={() => setMode("register")}>
                            Регистрация
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {mode === "register" && (
                            <div>
                                <label>
                                    Имя
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                        )}
                        <div>
                            <label>
                                Email
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Пароль
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        {mode === "register" && (
                            <div>
                                <label>
                                    Пароль ещё раз
                                    <input
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                        )}
                        {error && <p style={{color: "red"}}>{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? "…" : mode === "login" ? "Войти" : "Зарегистрироваться"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}