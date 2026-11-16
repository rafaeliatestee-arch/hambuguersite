import { ArrowUpRight, Instagram, MoveUpRight } from 'lucide-react';
import { siteConfig } from '../data/menu';

export function FinalSection({ openCart }: { openCart: () => void }) {
  return (
    <>
      <section className="final-cta" id="pedir">
        <div className="final-cta__photo" aria-hidden="true" />
        <div className="final-cta__shade" />
        <div className="final-cta__content container">
          <p className="eyebrow reveal">04 / SUA PRÓXIMA HISTÓRIA COMEÇA AQUI</p>
          <h2 className="final-cta__headline reveal">A FOME PASSA<span className="accent">.</span><br /><em>A EXPERIÊNCIA</em><br />FICA<span className="accent">.</span></h2>
          <button className="button button--amber button--large" onClick={openCart}>PEÇA SEU BRASA <ArrowUpRight size={20} /></button>
          <span className="final-cta__side">FOGO. SABOR. MEMÓRIA. <MoveUpRight size={17}/></span>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <a className="footer__logo" href="#inicio">BRASA<span>®</span></a>
            <p>MAIS DO QUE UMA REFEIÇÃO.<br />UMA SENSAÇÃO QUE FICA.</p>
            <nav aria-label="Links do rodapé"><a href="#inicio">INÍCIO</a><a href="#essencia">ESSÊNCIA</a><a href="#cardapio">CARDÁPIO</a><button onClick={openCart}>MEU PEDIDO</button></nav>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} BRASA. PROJETO CONCEITUAL.</span>
            <span>{siteConfig.address} · {siteConfig.hours}</span>
            {siteConfig.instagram ? <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={17}/> INSTAGRAM</a> : <span>FEITO COM FOGO E INTENÇÃO.</span>}
            <a href="#inicio">VOLTAR AO TOPO ↑</a>
          </div>
        </div>
      </footer>
    </>
  );
}
