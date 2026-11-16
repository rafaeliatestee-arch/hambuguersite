import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Flame, MoveDownRight } from 'lucide-react';
import { SmoothScroll } from './components/animations/SmoothScroll';
import { Navbar } from './components/layout/Navbar';
import { CartDrawer, type Cart } from './components/layout/CartDrawer';
import { BurgerStage } from './components/three/BurgerStage';
import { MenuSection } from './sections/MenuSection';
import { StorySection } from './sections/StorySection';
import { FinalSection } from './sections/FinalSection';
import type { MenuItem } from './data/menu';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { number: '01', title: 'TODA OBRA-PRIMA\nCOMEÇA POR UMA BASE.', detail: 'BRIOCHE DOURADO / UM NOVO COMEÇO' },
  { number: '02', title: 'FRESCOR EM\nCADA DETALHE.', detail: 'MOLHO DA CASA / ALFACE FRESCA' },
  { number: '03', title: 'INGREDIENTES\nDE VERDADE.', detail: 'TOMATE MADURO / CEBOLA ROXA' },
  { number: '04', title: 'O CORAÇÃO\nDA BRASA.', detail: 'BLEND ARTESANAL / SELADO NO FOGO' },
  { number: '05', title: 'INTENSAMENTE\nIRRESISTÍVEL.', detail: 'CHEDDAR CREMOSO / SEM MODERAÇÃO' },
  { number: '06', title: 'CAMADAS DE\nPERSONALIDADE.', detail: 'BACON CROCANTE / SABOR DEFUMADO' },
  { number: '07', title: 'CAMADA POR CAMADA.\nPERFEIÇÃO.', detail: 'A CRIAÇÃO ESTÁ COMPLETA' }
];
function currentStep(p: number) {
  if (p < .17) return 0;
  if (p < .28) return 1;
  if (p < .42) return 2;
  if (p < .59) return 3;
  if (p < .72) return 4;
  if (p < .85) return 5;
  return 6;
}

export default function App() {
  const showcaseRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [phase, setPhase] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({});
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }));
  }, []);
  const updateQuantity = useCallback((id: string, change: number) => {
    setCart(prev => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + change) }));
  }, []);
  const cartCount = Object.values(cart).reduce((count, qty) => count + qty, 0);

  useLayoutEffect(() => {
    if (!showcaseRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: showcaseRef.current,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: ({ progress }) => {
        progressRef.current = progress;
        const assemblyP = Math.max(0, Math.min(1, (progress - .20) / .78));
        setHeroVisible(old => old === (progress < .162) ? old : progress < .162);
        setPhase(old => old === currentStep(assemblyP) ? old : currentStep(assemblyP));
        if (barRef.current) barRef.current.style.transform = `scaleY(${assemblyP})`;
      },
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    const animations: gsap.core.Tween[] = [];
    const elements = gsap.utils.toArray<HTMLElement>('.reveal');
    elements.forEach(element => {
      const tween = gsap.fromTo(element, { y: 34, opacity: .5 }, {
        y: 0, opacity: 1, ease: 'power2.out', duration: 1.1,
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      });
      animations.push(tween);
    });
    return () => { animations.forEach(animation => { animation.scrollTrigger?.kill(); animation.kill(); }); };
  }, []);

  return (
    <SmoothScroll>
      <Navbar cartCount={cartCount} openCart={openCart} />
      <main>
        <section id="inicio" className="showcase" ref={showcaseRef}>
          <span id="experiencia" className="assembly-anchor" aria-hidden="true" />
          <div className="showcase__sticky">
            <div className="showcase__atmosphere" />
            <div className="showcase__halo" />
            <div className="showcase__word" aria-hidden="true">BRASA</div>
            <div className="showcase__model"><BurgerStage progressRef={progressRef} /></div>
            <div className={`hero-copy ${heroVisible ? '' : 'hero-copy--hidden'}`}>
              <p className="eyebrow hero-copy__eyebrow"><span className="eyebrow__dash" /> ARTESANAL. INTENSO. INESQUECÍVEL.</p>
              <h1><span className="hero-copy__line">NÃO É SÓ</span><span className="hero-copy__line">UM BURGER<span className="accent">.</span></span><span className="hero-copy__line hero-copy__line--outline">É UMA</span><span className="hero-copy__line">EXPERIÊNCIA<span className="accent">.</span></span></h1>
              <p className="hero-copy__description">Camada por camada, criamos algo impossível de esquecer.</p>
              <div className="hero-copy__actions">
                <a className="button button--amber" href="#cardapio">EXPLORAR O CARDÁPIO <ArrowUpRight size={19} /></a>
                <a className="button button--outline" href="#experiencia">DESCUBRA A EXPERIÊNCIA <ArrowDownRight size={19} /></a>
              </div>
              <div className="hero-copy__footer"><span>01 — 04 / THE BRASA EXPERIENCE</span><span>CRIADO PARA SENTIR</span></div>
            </div>
            <div className={`assembly-copy ${heroVisible ? '' : 'assembly-copy--visible'}`} aria-live="off">
              <div className="assembly-copy__top"><span className="eyebrow"><Flame size={15} /> O RITUAL DA BRASA</span><span className="assembly-copy__index">FASE {steps[phase].number} / 07</span></div>
              <div key={phase} className="assembly-copy__text">
                <p>{steps[phase].detail}</p>
                <h2>{steps[phase].title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
              </div>
              <div className="assembly-copy__bottom"><p>CADA INGREDIENTE TEM UMA HISTÓRIA.<br />CONTINUE ROLANDO PARA DESCOBRIR.</p><span className="assembly-copy__stage">0{phase + 1} <span>/</span> 07</span></div>
            </div>
            <div className="showcase__aside" aria-hidden="true"><span>100% ARTESANAL</span><span className="showcase__aside-line" /><span>01 / ORIGINAL</span></div>
            <div className="showcase__scroll" aria-hidden="true"><div className="showcase__scroll-track"><div ref={barRef} /></div><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></div>
            <div className="showcase__bottomline" aria-hidden="true"><span>THE ART OF THE BURGER</span><MoveDownRight size={20} /></div>
          </div>
        </section>
        <div className="section-transition"><div className="section-transition__line" /><span>01 / FIM DO RITUAL</span><strong>O EXTRAORDINÁRIO<br />ESTÁ NOS DETALHES.</strong><ArrowDownRight size={25} /></div>
        <StorySection />
        <MenuSection addToCart={addToCart} />
        <FinalSection openCart={openCart} />
      </main>
      <CartDrawer open={cartOpen} onClose={closeCart} cart={cart} updateQuantity={updateQuantity} />
    </SmoothScroll>
  );
}
