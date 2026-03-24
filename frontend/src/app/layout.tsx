import {fonts} from "@/config/fonts";
import "@styles/globals.scss";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className={fonts.variable}>
        <body>{children}</body>
        </html>
    );
}
