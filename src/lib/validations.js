import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Informe o nome do produto."),
  category: z.string().min(2, "Selecione uma categoria."),
  description: z.string().min(10, "Descreva melhor o produto."),
  price: z.string().optional(),
  image: z.string().url("Use uma URL valida.").optional().or(z.literal("")),
  imageFile: z.any().optional(),
  featured: z.coerce.boolean().optional(),
});

export const recipeSchema = z.object({
  title: z.string().min(3, "Informe o titulo da receita."),
  category: z.string().min(2, "Selecione uma categoria."),
  description: z.string().min(10, "Descreva melhor a receita."),
  prepTime: z.string().min(2, "Informe o tempo de preparo."),
  difficulty: z.string().min(2, "Informe a dificuldade."),
  ingredients: z.string().min(8, "Liste os ingredientes."),
  instructions: z.string().min(12, "Descreva o modo de preparo."),
  image: z.string().url("Use uma URL valida.").optional().or(z.literal("")),
  imageFile: z.any().optional(),
  featured: z.coerce.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

export const contactSchema = z.object({
  name: z.string().min(3, "Informe seu nome."),
  email: z.string().email("Informe um e-mail valido."),
  message: z.string().min(10, "Conte um pouco mais sobre o contato."),
});

export const highlightSchema = z.object({
  titleLeft: z.string().min(2, "Informe o título esquerdo."),
  subtitleLeft: z.string().min(2, "Informe o subtítulo esquerdo."),
  textRight: z.string().min(2, "Informe o texto de destaque direito."),
  badge: z.string().min(2, "Informe o texto da tag."),
  image: z.string().url("Use uma URL válida.").optional().or(z.literal("")),
  imageFile: z.any().optional(),
});
