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
          <h3 className="text-sm font-normal text-foreground uppercase tracking-wider mb-4">Our Heritage</h3>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
            A Story of Grace and Elegance
          </h2>
          <p className="text-sm font-light text-foreground/70 leading-relaxed mb-8">
            Founded with a passion for timeless style, Lavender Lily brings together modern design and classic elegance. Every piece in our collection is carefully curated to offer the perfect blend of comfort and sophistication for the modern girl.
          </p>
          <p className="text-sm font-light text-foreground leading-relaxed">We believe that every girl deserves to feel confident and beautiful in clothes that are both timeless and contemporary.</p>
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
            alt="Nida Chaudhary - Founder of LavenderLily"
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