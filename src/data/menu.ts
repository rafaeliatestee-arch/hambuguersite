export type BurgerCategory = 'Todos' | 'Clássicos' | 'Especiais';
export type MenuItem = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string[];
  price: number;
  category: Exclude<BurgerCategory, 'Todos'>;
  photo: string;
  accent: string;
};

export const siteConfig = {
  whatsapp: '', // Ex.: 5594999999999. Sem número não simulamos um pedido.
  instagram: '',
  address: 'Endereço a definir · Brasil',
  hours: 'Horários a definir',
};

export const menu: MenuItem[] = [
  {
    id: 'original',
    name: 'BRASA ORIGINAL',
    tagline: 'A essência da casa.',
    description: 'Blend artesanal selado no fogo, cheddar cremoso, alface fresca, tomate e nosso molho da casa.',
    ingredients: ['Brioche tostado', 'Blend 180g', 'Cheddar', 'Alface', 'Tomate', 'Molho BRASA'],
    price: 38.9,
    category: 'Clássicos',
    photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=84',
    accent: '#c6763a',
  },
  {
    id: 'double',
    name: 'DOUBLE EMBER',
    tagline: 'Duas vezes memorável.',
    description: 'Duas carnes na brasa, queijo derretido em dobro e cebola roxa para quem não aceita menos.',
    ingredients: ['Brioche amanteigado', '2 blends de 150g', 'Cheddar duplo', 'Cebola roxa', 'Molho especial'],
    price: 52.9,
    category: 'Especiais',
    photo: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=1100&q=84',
    accent: '#a7512e',
  },
  {
    id: 'smoke',
    name: 'SMOKE HOUSE',
    tagline: 'Fumaça. Fogo. Sabor.',
    description: 'Carne suculenta, bacon crocante e uma camada de sabor defumado que permanece na memória.',
    ingredients: ['Pão brioche', 'Blend 180g', 'Bacon artesanal', 'Cheddar', 'Molho defumado'],
    price: 47.9,
    category: 'Especiais',
    photo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1100&q=84',
    accent: '#99502e',
  },
  {
    id: 'golden',
    name: 'GOLDEN MELT',
    tagline: 'O prazer de derreter.',
    description: 'Queijo abundante envolvendo o blend, picles e molho dourado de assinatura.',
    ingredients: ['Brioche macio', 'Blend 180g', 'Cheddar extra', 'Picles', 'Molho golden'],
    price: 44.9,
    category: 'Clássicos',
    photo: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1100&q=84',
    accent: '#c78b40',
  },
];

export const brl = (value: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(value);

export function orderLink(item?: MenuItem) {
  if (!siteConfig.whatsapp) return null;
  const message = item
    ? `Olá! Quero pedir um ${item.name} (${brl(item.price)}). Podemos conversar?`
    : 'Olá! Quero fazer um pedido na BRASA.';
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
