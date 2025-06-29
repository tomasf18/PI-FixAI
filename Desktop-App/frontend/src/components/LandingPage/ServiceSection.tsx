import { Card } from "../../components";
import { RiUser3Line } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineConnectedTv } from "react-icons/md"; // Conectividade, IoT e tecnologia
import { useLanguage } from "../../contexts/LanguageContext";

export default function ServiceSection() {
  const { traduction } = useLanguage();

  return (
    <section className="flex flex-col items-center p-16 space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
        <span>{traduction("service_section_title_1")}</span>
        <br />
        <span>{traduction("service_section_title_2")}</span>
      </h2>
      <p className="text-gray-600 text-xl text-center max-w-lg">
        {traduction("service_section_question")}
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-8 text-2xl w-full max-w-6xl">
        <Card
          icon={
            <RiUser3Line className="text-3xl  " />
          }
          title={traduction("service_section_first_entity")}
          description={traduction("service_section_first_entity_desc")}
        />
        <Card
          icon={<FaUserTie className=" text-3xl mb-2 " />}
          title={traduction("service_section_second_entity")}
          description={traduction("service_section_second_entity_desc")}
        />
        <Card
          icon={<MdOutlineConnectedTv className="text-3xl  mb-2 " />}
          title={traduction("service_section_third_entity")}
          description={traduction("service_section_third_entity_desc")}
        />
      </div>
    </section>
  );
}
