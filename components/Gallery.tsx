import { gallery } from "@/app/gallery";
import GalleryItem from "./GalleryItem";

export default function Gallery() {
  return (
    // `columns-*` répartit les photos en colonnes verticales : chacune garde
    // sa hauteur naturelle, ce qui donne l'effet mosaïque.
    <div className="columns-2 gap-4 lg:columns-3">
      {gallery.map((photo, index) => (
        <GalleryItem key={photo.src.src} photo={photo} index={index} />
      ))}
    </div>
  );
}
