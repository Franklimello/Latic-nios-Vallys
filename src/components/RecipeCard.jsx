import Image from "next/image";
import Link from "next/link";
import { Clock, CookingPot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RecipeCard({ recipe }) {
  return (
    <Link 
      href={`/receitas?id=${recipe.id}`}
      className="grid overflow-hidden rounded-[8px] border border-border bg-white shadow-sm md:grid-cols-[0.85fr_1.15fr] hover:shadow-md transition-shadow cursor-pointer duration-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-accent/5 md:aspect-auto">
        <Image
          src={recipe.image || "/globe.svg"}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, 350px"
          className="object-cover"
        />
      </div>
      <div className="grid gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{recipe.category}</Badge>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
            <Clock size={14} />
            {recipe.prepTime}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
            <CookingPot size={14} />
            {recipe.difficulty}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-accent transition-colors">{recipe.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            {recipe.description}
          </p>
        </div>
        <p className="line-clamp-2 text-sm text-muted">
          <strong className="text-foreground">Ingredientes:</strong>{" "}
          {Array.isArray(recipe.ingredients)
            ? recipe.ingredients.join(", ")
            : recipe.ingredients}
        </p>
      </div>
    </Link>
  );
}
