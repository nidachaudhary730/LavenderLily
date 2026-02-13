import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedSection animation="fadeUp" stagger={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link to="/category/dresses" className="block group">
            <div className="w-full aspect-square mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/images/categories/dresses/1.png"
                alt="Dresses collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/images/categories/dresses/2.png"
                alt="Dresses collection - alternate view"
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
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
          <Link to="/category/tops-shirts" className="block group">
            <div className="w-full aspect-square mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/images/categories/tops/1.png"
                alt="Tops and shirts collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/images/categories/tops/2.png"
                alt="Tops and shirts collection - alternate view"
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
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