import { useState, useEffect } from "react";
import axios from "axios";

const useImage = (query, count = 50) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = () => {
      const API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

      if (API_KEY) {
        axios
          .get("https://api.pexels.com/v1/search", {
            headers: { Authorization: API_KEY },
            params: { query, per_page: count },
          })
          .then((res) => {
            if (res.data && Array.isArray(res.data.photos) && res.data.photos.length > 0) {
              setImages(res.data.photos.map(photo => photo.src.medium));
            } else {
              setImages(["/assets/default.jpg"]); // Fallback
            }
          })
          .catch((err) => {
            console.error(`Greška pri dohvaćanju slike (${query}):`, err);
            setImages(["/assets/default.jpg"]);
          });
      }
    };

    fetchImages();
  }, [query]);

  return images;
};

export default useImage;
