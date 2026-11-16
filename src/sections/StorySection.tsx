import { ArrowDownRight, ArrowUpRight, Flame, Leaf, UtensilsCrossed } from 'lucide-react';

const chapters = [
  {
    number: '01',
    eyebrow: 'O CARÁTER',
    title: 'O FOGO\nÉ O COMEÇO.',
    body: 'Selado no ponto. Uma crosta intensa, um interior suculento e o sabor que só a brasa entrega.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1100&q=86',
    icon: Flame,
    alt: 'Hambúrguer artesanal suculento'
  },
  {
    number: '02',
    eyebrow: 'A ORIGEM',
    title: 'FRESCOR\nSEM ATALHOS.',
    body: 'A textura da alface, a acidez do tomate, o detalhe de cada ingrediente. Nada aqui é por acaso.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=86',
    icon: Leaf,
    alt: 'Hambúrguer com ingredientes frescos'
  },
  {
    number: '03',
    eyebrow: 'A ASSINATURA',
    title: 'O ÚLTIMO\nDETALHE.',
    body: 'O cheddar encontra a carne. O molho abraça o pão. Tudo se encaixa em uma mordida.',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=1100&q=86',
    icon: UtensilsCrossed,
    alt: 'Hambúrguer com queijo derretido'
  }
];

export function StorySection() {
  return (
    <section id="essencia" className="story-section">
      <div className="story-intro container">
        <p className="eyebrow eyebrow--number reveal">02 / NOSSA ESSÊNCIA</p>
        <div className="story-intro__grid">
          <h2 className="story-title reveal">NÃO FABRICAMOS<br />HAMBÚRGUERES<span className="accent">.</span><br /><em>CRIAMOS</em> MOMENTOS<span className="accent">.</span></h2>
          <div className="story-intro__aside reveal">
            <span className="story-spark">✳</span>
            <p>Existe um instante em que fogo, textura e intenção se tornam uma coisa só.</p>
            <a className="text-link" href="#cardapio">CONHEÇA NOSSO CARDÁPIO <ArrowUpRight size={18} /></a>
          </div>
        </div>
      </div>
      <div className="story-photo" role="img" aria-label="Hambúrguer artesanal em fotografia cinematográfica">
        <div className="story-photo__image" />
        <div className="story-photo__overlay">
          <span>ARTESANAL POR NATUREZA</span>
          <strong>FEITO PARA<br />SER SENTIDO.</strong>
          <span>DESDE A PRIMEIRA MORDIDA <ArrowDownRight size={16}/></span>
        </div>
      </div>
      <div className="macro-wrap container">
        <div className="macro-heading">
          <p className="eyebrow eyebrow--number reveal">UM OLHAR MAIS DE PERTO</p>
          <p>TRÊS DETALHES.<br />UMA OBSESSÃO.</p>
        </div>
        <div className="macro-grid">
          {chapters.map((chapter) => (
            <article className="macro-card reveal" key={chapter.number}>
              <div className="macro-card__photo"><img src={chapter.image} alt={chapter.alt} loading="lazy" /></div>
              <div className="macro-card__line"><span>{chapter.number} / {chapter.eyebrow}</span><chapter.icon size={20} strokeWidth={1.4} /></div>
              <h3>{chapter.title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h3>
              <p>{chapter.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
