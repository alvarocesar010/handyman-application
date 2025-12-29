import Image from "next/image";

export type CategoryImage = {
  src: string;
  alt: string;
};

export type CategoriesMap = Record<string, string[]>;
export type CategoryImagesMap = Partial<Record<string, CategoryImage>>;

type CategoriesGridProps = {
  title: string;
  categories: CategoriesMap;
  categoryImages?: CategoryImagesMap;
  sectionClassName?: string;
};

export function CategoriesGrid({
  title,
  categories,
  categoryImages,
  sectionClassName = "space-y-4",
}: CategoriesGridProps) {
  const entries = Object.entries(categories);

  if (entries.length === 0) return null;

  return (
    <section className={sectionClassName}>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map(([group, items]) => {
          const img = categoryImages?.[group];

          return (
            <div
              key={group}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-sm"
            >
              {img && (
                <div className="relative w-full aspect-[16/9] bg-slate-50">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-fill"
                    priority={false}
                  />
                </div>
              )}

              <div className="p-5">
                <h4 className="font-medium text-slate-900">{group}</h4>

                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
