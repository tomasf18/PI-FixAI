import { SecuritySectionImage } from "../../assets";
import { useLanguage } from "../../contexts/LanguageContext";

export default function SecuritySection() {
  const { traduction } = useLanguage();
  return (
    <section className="flex flex-col items-center p-16 pb-8 relative">
      <div className="container mx-auto flex flex-col lg:flex-row-reverse items-center gap-8">
        <div className="flex-1 flex flex-col gap-10 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-800">
            <span>{traduction("security_section6_title_1")}</span>
            <br />
            <span>{traduction("security_section6_title_2")}</span>
            <br />
            <span className="text-blue-800">{traduction("security_section6_title_3")}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            {traduction("security_section6_desc_1")}
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src={SecuritySectionImage}
            alt="Data Graph Illustration"
            className="max-w-sm md:max-w-md lg:max-w-lg object-contain"
          />
        </div>
      </div>
    </section>
  );
}
