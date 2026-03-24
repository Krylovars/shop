type ProductPageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProductPage({params}: ProductPageProps) {
    const {id} = await params;
    return <p>Product {id}</p>;
}
