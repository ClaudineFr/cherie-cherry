import { fetchGallery } from "@/app/gallery";
import GalleryItem from "./GalleryItem";

export default async function Gallery() {
  const gallery = await fetchGallery();

  return (
    // `columns-*` répartit les photos en colonnes verticales : chacune garde
    // sa hauteur naturelle, ce qui donne l'effet mosaïque.
    <div className="gallery columns-2 gap-4 lg:columns-3">
      {gallery.map((photo, index) => (
        <GalleryItem key={photo.src} photo={photo} index={index} />
      ))}
    </div>
  );
}
