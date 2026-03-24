import "./ProductCard.scss"


type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    author: string;
    image_url: string;
};


export default function productCard({product}: { product: Product }) {
    return (
        <div className="container container__product-card" key={product.id}>
            <div className="product-card" key={product.id}>
                <img className="product-card__image" src={product.image_url} alt={product.name}/>
                <p className="product-card__author">{product.author}</p>
                <p className="product-card__name">{product.name}</p>
                <p className="product-card__description">{product.description}</p>
                <p className="product-card__price">{product.price} руб</p>
                <button className="product-card__button" data-id={product.id}>Купить</button>
            </div>
        </div>
    );
}