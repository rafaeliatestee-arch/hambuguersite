import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu as MenuIcon, ShoppingBag, X } from 'lucide-react';

const nav = [
  { label: 'Início', href: '#inicio' },
  { label: 'Nossa essência', href: '#essencia' },
  { label: 'Cardápio', href: '#cardapio' },
  { label: 'Experiência', href: '#experiencia' },
];

export function Navbar({ cartCount, openCart }: { cartCount: number; openCart: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a className="brand" href="#inicio" aria-label="BRASA, voltar ao início" onClick={() => setOpen(false)}>
        <span className="brand__mark">B<span>.</span></span>
        <span className="brand__name">BRASA<sup>®</sup></span>
      </a>
      <nav className={`navbar__links ${open ? 'navbar__links--open' : ''}`} aria-label="Navegação principal">
        {nav.map(item => <a key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
        <button className="navbar__mobile-order" onClick={() => { setOpen(false); openCart(); }}>Meu pedido <ArrowUpRight size={16} /></button>
      </nav>
      <div className="navbar__actions">
        <button className="nav-cart" aria-label={`Abrir meu pedido com ${cartCount} itens`} onClick={openCart}>
          <ShoppingBag size={19} strokeWidth={1.7} />
          {cartCount > 0 && <span className="nav-cart__count">{cartCount}</span>}
        </button>
        <button className="nav-order" onClick={openCart}>PEDIR AGORA <ArrowUpRight size={17} /></button>
        <button className="nav-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X size={24} /> : <MenuIcon size={24} />}</button>
      </div>
    </header>
  );
}
