// import { FaChartLine, FaUsers, FaBullseye, FaRunning } from "react-icons/fa";


import { AiOutlineUsergroupAdd } from "react-icons/ai"; // Pessoas em fila, estilo moderno

import { AiOutlineStar } from "react-icons/ai"; // Estrela contornada

import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsExclamationTriangle } from "react-icons/bs";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ProductSection() {
  const { traduction } = useLanguage();
  return (
    <div className="grid grid-cols-10">
    <div></div>
    <section className="col-span-8 flex flex-col bg-gray-100 rounded-3xl border-gray-300 items-center p-20 mt-12 relative">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 flex flex-col gap-10 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-800">
            <span>{traduction("product_section5_title_1")}</span>
            <br />
            <span>{traduction("product_section5_title_2")}</span>
            <span className="text-blue-800">{traduction("product_section5_title_3")}</span>
          </h1>
          <p className="text-gray-600 text-2xl">
            {traduction("product_section5_title_4")}
          </p>
        </div>

        {/* Grid de ícones e textos */}
        <div className="flex-1 grid grid-cols-2 gap-8">
          {/* Item 1 */}
          <div className="flex items-center p-4 rounded-lg shadow-lg">
            <AiOutlineUsergroupAdd className="text-blue-800 text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">261,328</h2>
              <p className="text-xl text-gray-600">{traduction("product_section5_text_1")}</p>
            </div>
          </div>

          {/* Item 2 */}
            <div className="flex items-center p-4 rounded-lg shadow-lg">
            <AiOutlineExclamationCircle className="text-blue-800 text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">1,245,341</h2>
              <p className="text-xl text-gray-600">{traduction("product_section5_text_2")}</p>
            </div>
            </div>

          {/* Item 3 */}
          <div className="flex items-center p-4 rounded-lg shadow-lg">
            <AiOutlineStar className="text-blue-800 text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">4.7</h2>
              <p className="text-xl text-gray-600">{traduction("product_section5_text_3")}</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center p-4 rounded-lg shadow-lg">
            <BsExclamationTriangle className="text-blue-800 text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">2,926,436</h2>
              <p className="text-xl text-gray-600">{traduction("product_section5_text_4")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
