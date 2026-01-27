import AnimatedText from "../animations/AnimatedText";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <header className="pr-6 py-16 border-b border-border">
      <AnimatedText animation="fadeUp" delay={0}>
        <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
          {title}
        </h1>
      </AnimatedText>
      {subtitle && (
        <AnimatedText animation="fadeUp" delay={0}>
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        </AnimatedText>
      )}
    </header>
  );
};

export default PageHeader;