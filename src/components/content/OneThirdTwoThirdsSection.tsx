import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedSection animation="fadeUp" stagger={0.05} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link to="/category/pants" className="block group">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/dropdown-images/IMG_4159.PNG"
                alt="Pants collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/dropdown-images/IMG_3827.PNG"
                alt="Pants collection - alternate view"
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
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
          <Link to="/category/co-ord-set" className="block group">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/dropdown-images/IMG_4161.PNG"
                alt="Co-ord set collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/dropdown-images/IMG_3830.PNG"
                alt="Co-ord set collection - alternate view"
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
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