import type {Metadata} from "next";
import ProductsList from "@components/common/products/ProductsList/ProductsList";

export const metadata: Metadata = {
    title: "Shop",
    description: "Магазин",
};

export default function HomePage() {
    return <ProductsList/>;
}
