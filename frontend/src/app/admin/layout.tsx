export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="admin">
            <main className="admin__main">{children}</main>
        </div>
    );
}
