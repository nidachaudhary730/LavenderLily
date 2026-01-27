import AnimatedText from "../animations/AnimatedText";
import AnimatedSection from "../animations/AnimatedSection";

interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ContentSection = ({ title, children, className = "" }: ContentSectionProps) => {
  return (
    <section className={`pr-6 py-16 ${className}`}>
      {title && (
        <AnimatedText animation="fadeUp" delay={0}>
          <h2 className="text-3xl font-light text-foreground mb-8">
            {title}
          </h2>
        </AnimatedText>
      )}
      <AnimatedSection animation="fadeUp" stagger={0.03}>
        {children}
      </AnimatedSection>
    </section>
  );
};

export default ContentSection;