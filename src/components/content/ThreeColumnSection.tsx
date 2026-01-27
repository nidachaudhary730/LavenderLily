import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";

const ThreeColumnSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedSection animation="fadeUp" stagger={0.05} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Link to="/category/skirts" className="block group">
            <div className="w-full aspect-[3/4] mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/Lavender-Lily( Images )/IMG_4162.PNG"
                alt="Skirts collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/Lavender-Lily( Images )/IMG_3829.PNG"
                alt="Skirts collection - alternate view"
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
              />
            </div>
          </Link>
          <div className="">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-sm font-normal text-foreground mb-1">
                Skirts
              </h3>
            </AnimatedText>
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-sm font-light text-foreground">
                Feminine and versatile pieces
              </p>
            </AnimatedText>
          </div>
        </div>

        <div>
          <Link to="/category/ethnic" className="block group">
            <div className="w-full aspect-[3/4] mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/Lavender-Lily( Images )/IMG_4164.PNG"
                alt="Ethnic collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/Lavender-Lily( Images )/IMG_3832.PNG"
                alt="Ethnic collection - alternate view"
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
              />
            </div>
          </Link>
          <div className="">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-sm font-normal text-foreground mb-1">
                Ethnic
              </h3>
            </AnimatedText>
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-sm font-light text-foreground">
                Traditional elegance reimagined
              </p>
            </AnimatedText>
          </div>
        </div>

        <div>
          <Link to="/category/shop" className="block group">
            <div className="w-full aspect-[3/4] mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/Lavender-Lily( Images )/IMG_4165.PNG"
                alt="Shop all collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/Lavender-Lily( Images )/IMG_4172.PNG"
                alt="Shop all collection - alternate view"
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
              />
            </div>
          </Link>
          <div className="">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-sm font-normal text-foreground mb-1">
                Shop All
              </h3>
            </AnimatedText>
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-sm font-light text-foreground">
                Explore our complete collection
              </p>
            </AnimatedText>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default ThreeColumnSection;
