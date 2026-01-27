import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";
import AnimatedImage from "../animations/AnimatedImage";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedSection animation="fadeUp" stagger={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link to="/category/dresses" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <AnimatedImage
                src="/Lavender-Lily( Images )/IMG_3823.PNG"
                alt="Dresses collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                animation="fadeIn"
                delay={0}
              />
            </div>
          </Link>
          <div className="">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-sm font-normal text-foreground mb-1">
                Dresses
              </h3>
            </AnimatedText>
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-sm font-light text-foreground">
                Elegant dresses for every occasion
              </p>
            </AnimatedText>
          </div>
        </div>

        <div>
          <Link to="/category/tops-shirts" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <AnimatedImage
                src="/Lavender-Lily( Images )/IMG_3826.PNG"
                alt="Tops and shirts collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                animation="fadeIn"
                delay={0}
              />
            </div>
          </Link>
          <div className="">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-sm font-normal text-foreground mb-1">
                Tops & Shirts
              </h3>
            </AnimatedText>
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-sm font-light text-foreground">
                Stylish tops and shirts for everyday elegance
              </p>
            </AnimatedText>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default FiftyFiftySection;