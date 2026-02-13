import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedSection animation="fadeUp" stagger={0.05} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link to="/category/party-collection" className="block group">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/images/categories/party-wear/1.png"
                alt="Party Collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/images/categories/party-wear/2.png"
                alt="Party Collection - alternate view"
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
              />
            </div>
          </Link>
          <div className="">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-sm font-normal text-foreground mb-1">
                Party Collection
              </h3>
            </AnimatedText>
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-sm font-light text-foreground">
                Glamorous styles for every celebration
              </p>
            </AnimatedText>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Link to="/category/co-ord-set" className="block group">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src="/images/categories/co-ords/1.png"
                alt="Co-ord set collection"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src="/images/categories/co-ords/2.png"
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