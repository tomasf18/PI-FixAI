import { 
  HomeSectionImage,
  MobileAppInitialPage,
  MobileAppCamera,
  MobileAppReportProblem,
  MobileAppMap,
  MobileAppListReports,
  MobileAppReportDetails,
} from "../../assets";

import { useLanguage } from "../../contexts/LanguageContext";

import {
  ReportFastComponent
} from "../index";

export default function FeatureSection() {
  const { traduction } = useLanguage();
  return (
    <div>
      {/* Section 1 */}
      <section className="flex flex-col items-center bg-gray-100 p-16">
        
        <h2 className="text-5xl md:text-6xl font-bold text-gray-800 text-center mb-10">
          {traduction("feature_section_title")}
        </h2>

        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-6">
          
          <div className="flex-1 flex items-start gap-4">
            
            <h1 className="text-[14rem] md:text-[16rem] font-bold text-[#A3ADDB] leading-none tracking-wider">
              1
            </h1>
            <div className="flex">
              <div className="flex flex-col text-left justify-center pt-7">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
                  {traduction("feature_section1_title_1")} <br /> {traduction("feature_section1_title_2")}
                </h2>
                <p className="text-2xl text-gray-600 mt-3">
                  {traduction("feature_section1_question_1")}
                </p>
                <p className="text-2xl text-gray-600">
                  {traduction("feature_section1_question_2")}
                </p>
                <p className="text-2xl text-gray-600">
                  {traduction("feature_section1_question_3")}
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-[0.8] flex justify-center items-center">
            <img
              src={MobileAppInitialPage}
              alt="Interface da Aplicação"
              className="w-[180px] md:w-[200px] lg:w-[220px] object-contain"
            />
          </div>

        </div>
        
      </section>

      {/* Section 2 */}
      <section className="flex flex-col items-center p-16">
            
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-6">


          <div className="flex flex-[0.8] flex justify-center items-center gap-16">
            <img
              src={MobileAppCamera}
              alt="Interface da Aplicação"
              className="w-[180px] md:w-[200px] lg:w-[220px] object-contain"
            />
            <img
              src={MobileAppReportProblem}
              alt="Interface da Aplicação"
              className="w-[180px] md:w-[200px] lg:w-[220px] object-contain"
            />
          </div>
          
          <div className="flex-1 flex items-start gap-4">    
            <h1 className="text-[14rem] md:text-[16rem] font-bold text-[#A3ADDB] leading-none tracking-wider">
              2
            </h1>

            <div className="flex flex-col text-left pt-7">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
                {traduction("feature_section2_title_1")}
              </h2>
              <p className="text-2xl text-gray-600 mt-3">
                {traduction("feature_section2_desc_1")}
              </p>
              <p className="text-2xl text-gray-600">
                {traduction("feature_section2_desc_2")}
              </p>
              <p className="text-2xl text-gray-600">
                {traduction("feature_section2_desc_3")}
              </p>

              <div className="mt-12">
                <ReportFastComponent
                  icon={
                    <div className="w-12 h-12 flex justify-center items-center rounded-full bg-gradient-to-r from-blue-700 to-orange-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                      </svg>
                    </div>
                  }
                  mainText={traduction("report_fast_component_main_text")}
                  subText={traduction("report_fast_component_secondary_text")}
                />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Section 3 */}
      <section className="flex flex-col items-center bg-gray-100 p-16">

        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-6">
          
          <div className="flex-1 flex items-start gap-4">
            
            <h1 className="text-[14rem] md:text-[16rem] font-bold text-[#A3ADDB] leading-none tracking-wider">
              3
            </h1>

            <div className="flex flex-col text-left pt-7">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
                {traduction("feature_section3_title_1")}
              </h2>
              <p className="text-2xl text-gray-600 mt-3">
                {traduction("feature_section3_desc_1")}
              </p>
              <p className="text-2xl text-gray-600">
                {traduction("feature_section3_desc_2")}
              </p>
            </div>

          </div>

          <div className="flex flex-[0.8] flex justify-center items-center gap-16">
            <img
              src={MobileAppMap}
              alt="Interface da Aplicação"
              className="w-[180px] md:w-[200px] lg:w-[220px] object-contain"
            />
            <img
              src={MobileAppListReports}
              alt="Interface da Aplicação"
              className="w-[180px] md:w-[200px] lg:w-[220px] object-contain"
            />
            <img
              src={MobileAppReportDetails}
              alt="Interface da Aplicação"
              className="w-[180px] md:w-[200px] lg:w-[220px] object-contain"
            />
          </div>

        </div>
      </section>

      {/* Section 4 */}
      <section className="flex flex-col items-center p-16">
            
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-6">


          <div className="flex-1 flex justify-center items-center">
            <img
              src={HomeSectionImage}
              alt="Data Graph Illustration"
              className="max-w-sm md:max-w-md lg:max-w-lg object-contain"
            />
          </div>
          
          <div className="flex-1 flex items-start gap-4">    
            <h1 className="text-[14rem] md:text-[16rem] font-bold text-[#A3ADDB] leading-none tracking-wider">
              4
            </h1>

            <div className="flex flex-col text-left pt-7">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
                {traduction("feature_section4_title_1")}
              </h2>
              <p className="text-2xl text-gray-600 mt-3">
                {traduction("feature_section4_desc_1")}
              </p>
              <p className="text-2xl text-gray-600">
                {traduction("feature_section4_desc_2")}
              </p>
              <p className="text-2xl text-gray-600">
                {traduction("feature_section4_desc_3")}
              </p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
