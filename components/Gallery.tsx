import Image from "next/image";
import { gallery } from "@/app/gallery";

export default function Gallery() {
  return (
    // `columns-*` répartit les photos en colonnes verticales : chacune garde
    // sa hauteur naturelle, ce qui donne l'effet mosaïque. `gap` + `mb` gèrent
    // l'espacement entre colonnes et entre photos.
    <div className="columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
      {gallery.map((photo) => (
        <Image
          key={photo.src.src}
          src={photo.src}
          alt={photo.alt}
          className="w-full rounded-2xl"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
      ))}
    </div>
  );
}
