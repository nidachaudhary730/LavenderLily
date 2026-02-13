import AnimatedImage from "../animations/AnimatedImage";
import AnimatedText from "../animations/AnimatedText";

const LargeHero = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="w-full overflow-hidden">
        <AnimatedImage
          src="/images/categories/party-wear/1.png"
          alt="Modern clothing collection"
          className="w-full h-auto"
          animation="fadeIn"
          delay={0}
        />
      </div>
      <div className="">
        <AnimatedText animation="fadeUp" delay={0}>
          <h2 className="text-sm font-normal text-foreground mb-1">
            Modern Elegance
          </h2>
        </AnimatedText>
        <AnimatedText animation="fadeUp" delay={0}>
          <p className="text-sm font-light text-foreground">
            Contemporary clothing crafted with timeless elegance
          </p>
        </AnimatedText>
      </div>
    </section>
  );
};

export default LargeHero;