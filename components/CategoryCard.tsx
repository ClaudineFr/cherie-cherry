type CategoryCardProps = {
  emoji: string;
  title: string;
  description: string;
};

export default function CategoryCard({
  emoji,
  title,
  description,
}: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-pink-soft px-6 py-8 text-center">
      <span className="text-4xl">{emoji}</span>
      <h3 className="font-serif text-xl text-green">{title}</h3>
      <p className="text-sm text-ink/70">{description}</p>
    </div>
  );
}
