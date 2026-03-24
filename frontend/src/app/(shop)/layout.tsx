import Header from "@components/common/layout/header/Header";
import {Footer} from "@components/common/layout/footer/Footer";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="app">
            <Header/>
            <main className="app__main">{children}</main>
            <Footer/>
        </div>
    );
}
