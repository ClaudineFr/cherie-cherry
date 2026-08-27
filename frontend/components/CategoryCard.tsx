import Image, { type StaticImageData } from "next/image";

type CategoryCardProps = {
  image: StaticImageData;
  title: string;
  description: string;
  //  Si true, l'image sera chargée prioritairement.
  priority?: boolean;
};

export default function CategoryCard({
  image,
  title,
  description,
  priority = false,
}: CategoryCardProps) {
  return (
    <div className="category-card flex flex-col overflow-hidden rounded-2xl bg-pink-soft text-center">
      <Image
        src={image}
        alt={title}
        className="category-card-image h-40 w-full object-cover"
        priority={priority}
      />
      <div className="category-card-content flex flex-col gap-2 px-6 py-6">
        <h3 className="category-card-title font-serif text-xl text-green">{title}</h3>
        <p className="category-card-description text-sm text-ink/70">{description}</p>
      </div>
    </div>
  );
}
