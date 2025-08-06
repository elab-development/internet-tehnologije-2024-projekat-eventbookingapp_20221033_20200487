// src/hooks/useImage.js
import { useState, useEffect } from "react";
import axios from "axios";

const useImage = (query) => {
  const [imageUrl, setImageUrl] = useState("/assets/default.jpg");

  useEffect(() => {
    const fetchRandomImage = async () => {
      const API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
      if (!API_KEY) return;

      const perPage    = 15;
      const randomPage = Math.floor(Math.random() * 10) + 1;

      try {
        const res = await axios.get("https://api.pexels.com/v1/search", {
          headers: { Authorization: API_KEY },
          params: {
            query,
            per_page: perPage,
            page:     randomPage,
          },
        });

        const photos = res.data.photos;
        if (photos.length > 0) {
          const randomIndex = Math.floor(Math.random() * photos.length);
          // use the landscape variant for a wider image
          setImageUrl(photos[randomIndex].src.landscape);
        }
      } catch (err) {
        console.error(`Greška pri dohvaćanju slike (${query}):`, err);
      }
    };

    fetchRandomImage();
  }, [query]);

  return imageUrl;
};

export default useImage;
