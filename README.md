# BRASA® — Cinematic Burger Experience

Experiência visual para uma hamburgueria **fictícia**. Construída para contar uma história de produto com WebGL e scroll, não como um template de restaurante.

## Tecnologias

React 19 · TypeScript · Vite · Three.js · React Three Fiber · GSAP ScrollTrigger · Lenis · Motion · CSS moderno.

## O que está implementado

- Hero com iluminação quente, tipografia editorial, hambúrguer 3D e animações de entrada.
- **Hambúrguer autoral modelado proceduralmente em malhas 3D**, com nove conjuntos animáveis: pão inferior, molho, alface, tomate, cebola, carne, queijo, bacon e pão superior. Cada camada entra de uma direção e profundidade diferente.
- Gergelim 3D instanciado, pão de perfil orgânico, relevo na carne, alface ondulada, queijo com bordas caídas e bacon curvo com cores de gordura.
- Sequência 3D controlada por progresso de scroll, com reversão ao rolar para cima. O palco ocupa cerca de 5,5 telas de rolagem efetiva além da abertura.
- Câmera e posição dos ingredientes controladas em tempo real pela mesma timeline; suporte mobile, WebGL fallback e `prefers-reduced-motion`.
- Seções de storytelling, detalhes macro, cardápio com filtro, modais de ingredientes, carrinho e WhatsApp configurável.

**Nota de qualidade:** as malhas atuais são **procedurais, exclusivas e renderizadas em tempo real**. Não são modelos GLB fotorrealistas esculpidos e texturizados em Blender. Para atingir nível publicitário de food photography, o próximo passo é substituir/complementar essas malhas com GLBs de alta resolução, materiais PBR escaneados e iluminação HDRI. A arquitetura separa cada ingrediente justamente para isso. Fotos editoriais de apoio são carregadas via Unsplash; um projeto comercial deve revisar e fixar seus arquivos/autorizações.

## Rodar localmente

```bash
npm install
npm run dev
```

Verificação e build de produção:

```bash
npm run typecheck
npm run build
npm run preview
```

## Configurações

Edite `src/data/menu.ts` para modificar nomes, preços, ingredientes e imagens. No objeto `siteConfig`:

- `whatsapp: '5594XXXXXXXXX'` habilita finalizar o pedido pelo WhatsApp. **Sem número configurado**, o carrinho permite selecionar e copiar o pedido, e explica que o checkout não está conectado.
- `instagram` recebe uma URL de perfil válida.
- `address` e `hours` são textos editáveis para rodapé.

**Nenhum checkout, estoque ou pagamento é simulado como integração real.**

## Organização

- `src/components/three/geometry.ts`: geração de geometrias orgânicas.
- `src/components/three/BurgerModel.tsx`: ingredientes independentes e interpolação de posições.
- `src/components/three/BurgerStage.tsx`: câmera, iluminação, render e fallback.
- `src/App.tsx`: timeline central de scroll e composição das seções.
- `src/sections/`: storytelling, cardápio e última chamada.
- `src/components/layout/`: navegação e carrinho.
- `src/styles.css`: identidade, transições e responsividade.

## Publicação

Este projeto gera arquivos estáticos no diretório `dist/`, prontos para serviços como Vercel, Netlify ou hospedagem estática. A publicação não acontece apenas por adicionar os arquivos ao GitHub. Ative um deploy no provedor desejado.

---

Conceito BRASA — identidade fictícia e conteúdo demonstrativo.
