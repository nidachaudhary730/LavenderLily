import founders from "@/assets/founders.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedText from "../animations/AnimatedText";
import AnimatedImage from "../animations/AnimatedImage";

const EditorialSection = () => {
  return <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 max-w-[630px]">
          <AnimatedText animation="fadeUp" delay={0}>
            <h2 className="text-2xl font-normal text-foreground leading-tight md:text-xl">
              Beautiful Girls Clothing for Every Occasion
            </h2>
          </AnimatedText>
          <AnimatedText animation="fadeUp" delay={0}>
            <p className="text-sm font-light text-foreground leading-relaxed">LavenderLily was founded by Nida Mohammed Chaudhari with a passion for creating beautiful, elegant clothing that celebrates femininity and style. We believe that every girl deserves to feel confident and beautiful in clothes that are both timeless and contemporary.</p>
          </AnimatedText>
          <AnimatedText animation="fadeUp" delay={0}>
            <Link to="/about/our-story" className="inline-flex items-center gap-1 text-sm font-light text-foreground hover:text-foreground/80 transition-colors duration-200">
              <span>Read our full story</span>
              <ArrowRight size={12} />
            </Link>
          </AnimatedText>
        </div>
        
        <div className="order-first md:order-last">
          <div className="w-full aspect-square overflow-hidden">
            <AnimatedImage
              src={founders}
              alt="Nida Mohammed Chaudhari - Founder of LavenderLily"
              className="w-full h-full object-cover"
              animation="fadeIn"
              delay={0}
            />
          </div>
        </div>
      </div>
    </section>;
};
export default EditorialSection;