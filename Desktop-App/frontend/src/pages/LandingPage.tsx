import { useEffect } from "react";
import {
  Header,
  Footer,
  HomeSection,
  ServiceSection,
  FeatureSection,
  ProductSection,
  SecuritySection,
} from "../components";
import { useLanguage } from "../contexts/LanguageContext";

export default function LandingPage() {
  const { traduction } = useLanguage();

  const links = [
    { href: "#home", label: traduction("navbar_label1") },
    { href: "#service", label: traduction("navbar_label2") },
    { href: "#feature", label: traduction("navbar_label3") },
    { href: "#product", label: traduction("navbar_label4") },
    { href: "#security", label: traduction("navbar_label5") },
  ];

  // Add smooth scrolling behavior
  useEffect(() => {
    const handleSmoothScroll = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.hash) {
        event.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleSmoothScroll);
    return () => document.removeEventListener("click", handleSmoothScroll);
  }, []);

  const buttons: {
    to: string;
    label: string;
    color: "primary" | "secondary";
    className?: string;
  }[] = [  
    { to: "/", label: traduction("download_app"), color: "secondary", className: "bg-blue-800 text-white" },
    { 
      to: "/login", 
      label: traduction("sign_in"), 
      color: "primary", 
      className: "bg-white border border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white" 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header links={links} buttons={buttons} />

      <main className="flex-grow">
        <div className="transform origin-top">
          <section id="home">
            <HomeSection />
          </section>
          <section id="service">
            <ServiceSection />
          </section>
          <section id="feature">
            <FeatureSection />
          </section>
          <section id="product">
            <ProductSection />
          </section>
          <section id="security">
            <SecuritySection />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
