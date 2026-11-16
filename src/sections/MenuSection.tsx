import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { brl, menu, type BurgerCategory, type MenuItem } from '../data/menu';

const categories: BurgerCategory[] = ['Todos', 'Clássicos', 'Especiais'];

export function MenuSection({ addToCart }: { addToCart: (item: MenuItem) => void }) {
  const [active, setActive] = useState<BurgerCategory>('Todos');
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const filtered = menu.filter(item => active === 'Todos' || item.category === active);
  useEffect(() => {
    if (!selected) return;
    const handler = (ev: KeyboardEvent) => { if (ev.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selected]);
  function choose(item: MenuItem) {
    addToCart(item);
    setAdded(item.id);
    window.setTimeout(() => setAdded(current => current === item.id ? null : current), 1500);
  }
  return (
    <section className="menu-section section-pad" id="cardapio">
      <div className="section-heading container">
        <div><p className="eyebrow eyebrow--number">03 / A COLEÇÃO</p><h2 className="section-display reveal">ESCOLHA SEU<br /><em>PRÓXIMO VÍCIO.</em></h2></div>
        <div className="menu-intro"><p>QUATRO CRIAÇÕES. INFINITAS SENSAÇÕES.</p><span>Não existem atalhos para o sabor. Aqui, cada detalhe tem um motivo.</span></div>
      </div>
      <div className="container">
        <div className="menu-toolbar" role="group" aria-label="Filtrar hambúrgueres">
          <div className="menu-filters">{categories.map(category => (
            <button key={category} className={active === category ? 'is-active' : ''} onClick={() => setActive(category)} aria-pressed={active === category}>{category}</button>
          ))}</div>
          <span className="menu-count">0{filtered.length} CRIAÇÕES <ArrowDownRight size={16} /></span>
        </div>
        <motion.div className="menu-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.article key={item.id} className="menu-item" layout initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: .38, delay: i * .045 }}>
                <button className="menu-item__image" onClick={() => setSelected(item)} aria-label={`Ver detalhes de ${item.name}`}>
                  <img src={item.photo} alt={`Hambúrguer ${item.name}`} loading="lazy" />
                  <span className="menu-item__number">0{i + 1} / BRASA</span>
                  <span className="menu-item__view">EXPLORAR <ArrowUpRight size={16} /></span>
                </button>
                <div className="menu-item__text">
                  <div><p>{item.tagline}</p><h3>{item.name}</h3></div>
                  <span>{brl(item.price)}</span>
                </div>
                <div className="menu-item__bottom"><p>{item.description}</p><button onClick={() => choose(item)} className="menu-add" aria-label={`Adicionar ${item.name} ao pedido`}><Plus size={20} /><span>{added === item.id ? 'ADICIONADO' : 'ADICIONAR'}</span></button></div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div className="product-modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-heading" initial={{ y: 38, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}>
              <button className="product-modal__close icon-button" onClick={() => setSelected(null)} aria-label="Fechar detalhes"><X size={22} /></button>
              <img className="product-modal__photo" src={selected.photo} alt={selected.name} />
              <div className="product-modal__info">
                <p className="eyebrow">{selected.category.toUpperCase()} / BRASA</p>
                <h3 id="product-heading">{selected.name}</h3>
                <p>{selected.description}</p>
                <strong className="product-modal__price">{brl(selected.price)}</strong>
                <p className="product-modal__label">O QUE VAI DENTRO</p>
                <div className="ingredient-tags">{selected.ingredients.map(ingredient => <span key={ingredient}>{ingredient}</span>)}</div>
                <button className="button button--amber button--full" onClick={() => { choose(selected); setSelected(null); }}>ADICIONAR AO PEDIDO <Plus size={17} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
