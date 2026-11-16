import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, Copy, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { brl, menu, siteConfig } from '../../data/menu';

export type Cart = Record<string, number>;
export function CartDrawer({
  open, onClose, cart, updateQuantity,
}: {
  open: boolean;
  onClose: () => void;
  cart: Cart;
  updateQuantity: (id: string, change: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const items = useMemo(() => menu.filter(item => (cart[item.id] ?? 0) > 0), [cart]);
  const total = items.reduce((sum, item) => sum + (cart[item.id] ?? 0) * item.price, 0);
  const message = `Olá, BRASA! Gostaria de fazer este pedido:\n${items.map(i => `• ${cart[i.id]}x ${i.name} — ${brl(i.price * cart[i.id])}`).join('\n')}\nTotal: ${brl(total)}\n\nPodem confirmar a disponibilidade?`;
  useEffect(() => {
    if (!open) return;
    const escape = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onClose(); };
    document.addEventListener('keydown', escape);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', escape); document.body.style.overflow = overflow; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="drawer-backdrop" onMouseDown={ev => { if (ev.target === ev.currentTarget) onClose(); }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer-head">
          <div><p className="eyebrow">SELEÇÃO AUTORAL</p><h2 id="cart-title">SEU PEDIDO<span className="accent">.</span></h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar pedido"><X size={22} /></button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty"><ShoppingBag size={44} strokeWidth={1} /><h3>AINDA ESTÁ VAZIO.</h3><p>O primeiro passo para algo extraordinário está no cardápio.</p><button className="button button--amber" onClick={() => { onClose(); document.querySelector('#cardapio')?.scrollIntoView({ behavior: 'smooth' }); }}>EXPLORAR CARDÁPIO <ArrowUpRight size={17} /></button></div>
          ) : items.map(item => (
            <div className="cart-line" key={item.id}>
              <img src={item.photo} alt={item.name} loading="lazy" />
              <div className="cart-line__body">
                <h3>{item.name}</h3>
                <span>{brl(item.price)}</span>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.id, -1)} aria-label={`Remover uma unidade de ${item.name}`}><Minus size={13} /></button>
                  <strong>{cart[item.id]}</strong>
                  <button onClick={() => updateQuantity(item.id, 1)} aria-label={`Adicionar uma unidade de ${item.name}`}><Plus size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-summary">
            <div className="cart-total"><span>TOTAL DO PEDIDO</span><strong>{brl(total)}</strong></div>
            {siteConfig.whatsapp ? (
              <a className="button button--amber button--full" href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
                PEDIR PELO WHATSAPP <ArrowUpRight size={19} />
              </a>
            ) : (
              <>
                <p className="cart-notice">Esta é uma hamburgueria fictícia. O WhatsApp comercial ainda não foi configurado; você pode copiar sua seleção.</p>
                <button className="button button--amber button--full" onClick={async () => {
                  try { await navigator.clipboard.writeText(message); setCopied(true); window.setTimeout(() => setCopied(false), 2200); }
                  catch { window.prompt('Copie seu pedido:', message); }
                }}>{copied ? <>PEDIDO COPIADO <Check size={18} /></> : <>COPIAR MEU PEDIDO <Copy size={17} /></>}</button>
              </>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
