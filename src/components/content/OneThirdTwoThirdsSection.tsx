import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";
import AnimatedImage from "../animations/AnimatedImage";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedSection animation="fadeUp" stagger={0.05} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link to="/category/pants" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <AnimatedImage
                src="/Lavender-Lily( Images )/IMG_4159.PNG"
                alt="Pants collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                animation="fadeIn"
                delay={0}
              />
            </div>
          </Link>
          <div className="">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-sm font-normal text-foreground mb-1">
                Pants
              </h3>
            </AnimatedText>
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-sm font-light text-foreground">
                Comfortable and stylish pants for every day
              </p>
            </AnimatedText>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Link to="/category/co-ord-set" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <AnimatedImage
                src="/Lavender-Lily( Images )/IMG_4161.PNG"
                alt="Co-ord set collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                animation="fadeIn"
                delay={0}
              />
            </div>
          </Link>
          <div className="">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-sm font-normal text-foreground mb-1">
                Co-ord Sets
              </h3>
            </AnimatedText>
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-sm font-light text-foreground">
                Perfectly matched sets for effortless style
              </p>
            </AnimatedText>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default OneThirdTwoThirdsSection;