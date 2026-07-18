export const productCategories = [
  "Queijos",
  "Bebidas Lácteas",
  "Manteigas",
];

export const categoryStyles = {
  "Leites": {
    text: "text-blue-500 group-hover:text-blue-600",
    textStatic: "text-blue-500",
    icon: "text-blue-500 group-hover:text-blue-600",
    line: "bg-blue-300 group-hover:bg-blue-400",
    lineStatic: "bg-blue-200",
    badge: "bg-blue-50 text-blue-600",
    buttonActive: "border-blue-500 bg-blue-500 text-white shadow-sm",
    cardBg: "bg-sky-500",
  },
  "Queijos": {
    text: "text-blue-600 group-hover:text-blue-700",
    textStatic: "text-blue-600",
    icon: "text-blue-600 group-hover:text-blue-700",
    line: "bg-blue-300 group-hover:bg-blue-400",
    lineStatic: "bg-blue-200",
    badge: "bg-blue-50 text-blue-600",
    buttonActive: "border-blue-600 bg-blue-600 text-white shadow-sm",
    cardBg: "bg-blue-600",
  },
  "Bebidas Lácteas": {
    text: "text-pink-700 group-hover:text-pink-800",
    textStatic: "text-pink-700",
    icon: "text-pink-700 group-hover:text-pink-800",
    line: "bg-pink-300 group-hover:bg-pink-400",
    lineStatic: "bg-pink-200",
    badge: "bg-pink-50 text-pink-700",
    buttonActive: "border-pink-700 bg-pink-700 text-white shadow-sm",
    cardBg: "bg-pink-700",
  },
  "Doces": {
    text: "text-orange-700 group-hover:text-orange-800",
    textStatic: "text-orange-700",
    icon: "text-orange-700 group-hover:text-orange-800",
    line: "bg-orange-300 group-hover:bg-orange-400",
    lineStatic: "bg-orange-200",
    badge: "bg-orange-50 text-orange-700",
    buttonActive: "border-orange-700 bg-orange-700 text-white shadow-sm",
    cardBg: "bg-orange-600",
  },
  "Manteigas": {
    text: "text-indigo-600 group-hover:text-indigo-700",
    textStatic: "text-indigo-600",
    icon: "text-indigo-600 group-hover:text-indigo-700",
    line: "bg-indigo-300 group-hover:bg-indigo-400",
    lineStatic: "bg-indigo-200",
    badge: "bg-indigo-50 text-indigo-600",
    buttonActive: "border-indigo-600 bg-indigo-600 text-white shadow-sm",
    cardBg: "bg-indigo-600",
  },
};

export function getCategoryStyle(category) {
  let cat = category;
  if (cat === "Iogurtes") {
    cat = "Bebidas Lácteas";
  }
  return categoryStyles[cat] || {
    text: "text-amber-500 group-hover:text-amber-600",
    textStatic: "text-amber-500",
    icon: "text-amber-500 group-hover:text-amber-600",
    line: "bg-gray-300 group-hover:bg-gray-400",
    lineStatic: "bg-gray-200",
    badge: "bg-orange-50 text-orange-600",
    buttonActive: "border-orange-500 bg-orange-500 text-white shadow-sm",
    cardBg: "bg-sky-500",
  };
}

export const recipeCategories = [
  "Cafe da manha",
  "Lanches",
  "Sobremesas",
  "Pratos quentes",
];

export const demoProducts = [];

export const demoRecipes = [
  {
    id: "pao-com-manteiga-vallys",
    title: "Pão com Manteiga Vallys na Chapa",
    category: "Cafe da manha",
    description:
      "O clássico pão francês quentinho e tostado uniformemente com o sabor irresistível da Manteiga com Sal Vallys.",
    prepTime: "10 min",
    difficulty: "Facil",
    ingredients: "2 pães franceses, 2 colheres de sopa de Manteiga com Sal Vallys.",
    instructions:
      "Corte os pães ao meio. Espalhe uma colher de sopa de Manteiga Vallys em cada pão. Aqueça uma frigideira ou chapa em fogo médio. Coloque o pão com a parte da manteiga voltada para baixo. Deixe dourar até formar uma casquinha crocante. Sirva quentinho com café!",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "pizza-mussarela-vallys",
    title: "Pizza Suprema de Mussarela Vallys",
    category: "Pratos quentes",
    description:
      "Massa artesanal coberta com o derretimento perfeito da Mussarela Vallys e bordas recheadas de Requeijão Cremoso Vallys.",
    prepTime: "30 min",
    difficulty: "Media",
    ingredients: "1 disco de massa de pizza pré-assado, 300g de Mussarela Vallys ralada, 150g de Requeijão Cremoso Vallys, 4 colheres de molho de tomate caseiro, orégano a gosto.",
    instructions:
      "Preaqueça o forno a 220°C. Com a bisnaga de Requeijão Vallys, faça uma linha de recheio ao redor da borda da massa e dobre a massa sobre o requeijão, pressionando para selar. Espalhe o molho de tomate no centro da massa. Distribua a Mussarela Vallys por cima. Polvilhe orégano e asse por 15 minutos até gratinar.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "escondidinho-carne-seca-vallys",
    title: "Escondidinho de Carne Seca com Requeijão Vallys",
    category: "Pratos quentes",
    description:
      "Purê cremoso de mandioca recheado com carne seca refogada e uma camada generosa de Requeijão e Mussarela Vallys para gratinar.",
    prepTime: "45 min",
    difficulty: "Media",
    ingredients: "1kg de mandioca cozida e espremida, 500g de carne seca dessalgada e desfiada, 1 pote de Requeijão Cremoso Vallys, 200g de Mussarela Vallys ralada, 1 colher de Manteiga Vallys, 1 cebola.",
    instructions:
      "Refogue a cebola e a carne seca na Manteiga Vallys. Misture a mandioca espremida com um pouco de leite para fazer o purê. Em um refratário, coloque metade do purê, a carne seca, espalhe o Requeijão Vallys e cubra com o restante do purê. Finalize cobrindo com a Mussarela Vallys ralada e asse a 200°C por 20 minutos até dourar.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
];

export const demoHighlights = [
  {
    id: "mussarela-vallys",
    image: "/hero/img1.png",
    titleLeft: "Mussarela Vallys",
    subtitleLeft: "Derretimento Perfeito",
    textRight: "QUALIDADE QUE DERRETE",
    badge: "100% Puro & Natural",
  },
  {
    id: "requeijao-cremoso",
    image: "/hero/img2.png",
    titleLeft: "Requeijão Cremoso",
    subtitleLeft: "Bisnaga de 1.8kg",
    textRight: "MAIS SABOR NAS RECEITAS",
    badge: "Qualidade Premium",
  },
  {
    id: "requeijao-de-pote",
    image: "/hero/img4.png",
    titleLeft: "Requeijão de Pote",
    subtitleLeft: "Cremoso & Suave",
    textRight: "O VERDADEIRO REQUEIJÃO",
    badge: "Muito mais Sabor",
  },
];
