import { HomeSectionImage } from "../../assets";
import { useLanguage } from "../../contexts/LanguageContext";

export default function HomeSection() {
  const { traduction } = useLanguage();
  return (
    <section className="flex flex-col items-center bg-gray-100 p-16 pb-8 relative">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 flex flex-col gap-10 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-800">
            <span className="text-blue-800">{traduction("home_section_title_1")}</span>
            <br />
            <span>{traduction("home_section_title_2")}</span>
            <br />
            <span>{traduction("home_section_title_3")}</span>
          </h1>
            <p className="text-2xl text-gray-600">
              <strong>{traduction("home_section_description1")}</strong> {traduction("home_section_description2")}
            </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src={HomeSectionImage}
            alt="Data Graph Illustration"
            className="max-w-sm md:max-w-md lg:max-w-lg object-contain"
          />
        </div>
      </div>
      <div className="w-1/12 h-1 bg-green-primary mt-16" />
    </section>
  );
}
