import "./Burger.scss";
import Link from "next/link";

type NavLink = {
  href: string;
  label: string;
};

type BurgerProps = {
  isOpen: boolean;
  onToggle: () => void;
  links: NavLink[];
};

export function Burger({ isOpen, onToggle, links }: BurgerProps) {
  return (
    <div className="burger__container">
      <button
        type="button"
        className={`burger ${isOpen ? "burger--open" : ""}`}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
        onClick={() => {
          onToggle();
        }}
      >
        <span className="burger__line" />
        <span className="burger__line" />
        <span className="burger__line" />
      </button>
      {isOpen && (
        <div className="burger__menu">
          <nav className="burger__list">
            {links.map((link) => (
                <Link key={link.href} href={link.href} className="burger__link">
                  {link.label}
                </Link>

            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

