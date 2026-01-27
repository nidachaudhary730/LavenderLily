import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import ImageTextBlock from "../../components/about/ImageTextBlock";
import AboutSidebar from "../../components/about/AboutSidebar";
import AnimatedText from "../../components/animations/AnimatedText";

const OurStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader 
            title="Our Story" 
            subtitle="A journey of passion, craftsmanship, and timeless elegance"
          />
          
          <ContentSection>
            <ImageTextBlock
              image="/founders.png"
              imageAlt="Nida Mohammed Chaudhari - Founder of LavenderLily"
              title="Founded on Passion"
              content="LavenderLily was born from the vision of our founder, Nida Mohammed Chaudhari, who believed in creating beautiful, elegant clothing for girls that celebrates femininity and style. With a passion for timeless design and contemporary fashion, Nida established LavenderLily with a commitment to creating clothing that makes every girl feel confident and beautiful. Every piece tells a story - your story."
              imagePosition="left"
            />
          </ContentSection>

          <ContentSection title="Our Heritage">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <AnimatedText animation="fadeUp" delay={0}>
                  <h3 className="text-xl font-light text-foreground">Quality Craftsmanship</h3>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-muted-foreground leading-relaxed">
                    Every piece in our collection is carefully selected and designed with attention to detail. We work with skilled manufacturers who share our commitment to quality, ensuring each garment meets our exacting standards for fit, fabric, and finish. From elegant dresses to comfortable everyday wear, every item reflects our dedication to excellence.
                  </p>
                </AnimatedText>
              </div>
              <div className="space-y-6">
                <AnimatedText animation="fadeUp" delay={0}>
                  <h3 className="text-xl font-light text-foreground">Our Mission</h3>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-muted-foreground leading-relaxed">
                    Founded by Nida Mohammed Chaudhari, LavenderLily is dedicated to providing beautiful, stylish clothing that empowers girls to express their unique personalities. We believe that fashion should be accessible, comfortable, and make every girl feel confident and beautiful, whether she's dressing for a special occasion or everyday life.
                  </p>
                </AnimatedText>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Our Values">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <AnimatedText animation="fadeUp" delay={0}>
                  <h3 className="text-lg font-light text-foreground">Excellence</h3>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-muted-foreground">
                    We pursue perfection in every detail, from the initial design concept to the final polish.
                  </p>
                </AnimatedText>
              </div>
              <div className="space-y-4">
                <AnimatedText animation="fadeUp" delay={0}>
                  <h3 className="text-lg font-light text-foreground">Authenticity</h3>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-muted-foreground">
                    Each piece reflects genuine craftsmanship and tells an authentic story of artistry and care.
                  </p>
                </AnimatedText>
              </div>
              <div className="space-y-4">
                <AnimatedText animation="fadeUp" delay={0}>
                  <h3 className="text-lg font-light text-foreground">Innovation</h3>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-muted-foreground">
                    We continuously evolve our designs and techniques while honoring timeless aesthetic principles.
                  </p>
                </AnimatedText>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default OurStory;