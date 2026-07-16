import { Volume2 } from "lucide-react";
type Props = {
  title?: string;
  description: string;
  size?: number
};

export default function ScreenReaderButton({
  title ="",
  description,
  size = 20, // Default size
}: Props)  {
  const speak = () => {
    const speech = new SpeechSynthesisUtterance(
      `${title}. ${description}`
    );

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="group relative inline-block">
  <button
    onClick={speak}
    aria-label="Read this section"
    className="rounded-full p-2 border-2 border-r-taupe-900 hover:bg-gray-100"
  >
    <Volume2 size={20} />
  </button> 

  <span
    className="
      absolute left-1/2 top-full mt-2
      -translate-x-1/2
      rounded-md bg-black px-3 py-1
      text-xs font-medium text-white
      opacity-0 transition-opacity
      group-hover:opacity-100
      whitespace-nowrap
    "
  >
    Read this section
  </span>
</div>
  );
}