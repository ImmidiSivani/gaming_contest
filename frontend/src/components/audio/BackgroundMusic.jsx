import { useEffect } from "react";
import { Howl } from "howler";

export default function BackgroundMusic() {
  useEffect(() => {
    const sound = new Howl({
      src: ["/sounds/ambient.mp3"],
      loop: true,
      volume: 0.3,
      autoplay: true,
    });

    return () => {
      sound.stop();
    };
  }, []);

  return null;
}