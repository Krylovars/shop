export default function Test({
children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="test">
            <main className="test__main">{children}</main>
        </div>
    );
}