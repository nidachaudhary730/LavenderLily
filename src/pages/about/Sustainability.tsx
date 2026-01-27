import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import AboutSidebar from "../../components/about/AboutSidebar";
import AnimatedText from "../../components/animations/AnimatedText";
import AnimatedSection from "../../components/animations/AnimatedSection";

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Sustainability" 
          subtitle="Creating beautiful jewelry while protecting our planet for future generations"
        />
        
        <ContentSection title="Our Environmental Commitment">
          <AnimatedSection animation="fadeUp" stagger={0.03} className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <AnimatedText animation="fadeUp" delay={0}>
                <h3 className="text-xl font-light text-foreground">Ethical Sourcing</h3>
              </AnimatedText>
              <AnimatedText animation="fadeUp" delay={0}>
                <p className="text-muted-foreground leading-relaxed">
                  We partner only with suppliers who share our commitment to ethical practices. Every gemstone and precious metal in our collection is sourced responsibly, with full transparency in our supply chain.
                </p>
              </AnimatedText>
            </div>
            <div className="space-y-6">
              <AnimatedText animation="fadeUp" delay={0}>
                <h3 className="text-xl font-light text-foreground">Recycled Materials</h3>
              </AnimatedText>
              <AnimatedText animation="fadeUp" delay={0}>
                <p className="text-muted-foreground leading-relaxed">
                  Over 80% of our precious metals come from recycled sources, reducing the environmental impact of mining while maintaining the highest quality standards for our jewelry.
                </p>
              </AnimatedText>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" stagger={0.03} className="bg-muted/10 rounded-lg p-8">
            <AnimatedText animation="fadeUp" delay={0}>
              <h3 className="text-2xl font-light text-foreground mb-6">Our Impact Goals</h3>
            </AnimatedText>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <AnimatedText animation="fadeIn" delay={0}>
                  <div className="text-3xl font-light text-primary mb-2">100%</div>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-sm text-muted-foreground">Carbon neutral operations by 2025</p>
                </AnimatedText>
              </div>
              <div>
                <AnimatedText animation="fadeIn" delay={0}>
                  <div className="text-3xl font-light text-primary mb-2">90%</div>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-sm text-muted-foreground">Recycled packaging materials</p>
                </AnimatedText>
              </div>
              <div>
                <AnimatedText animation="fadeIn" delay={0}>
                  <div className="text-3xl font-light text-primary mb-2">Zero</div>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-sm text-muted-foreground">Waste to landfill policy</p>
                </AnimatedText>
              </div>
            </div>
          </AnimatedSection>
        </ContentSection>

        <ContentSection title="Circular Economy">
          <AnimatedSection animation="fadeUp" stagger={0.03} className="space-y-8">
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe in the power of circular design - creating jewelry that can be treasured, repaired, and eventually recycled into new pieces.
              </p>
            </AnimatedText>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <AnimatedText animation="fadeUp" delay={0}>
                  <h3 className="text-lg font-light text-foreground">Lifetime Care</h3>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-muted-foreground">
                    Every piece comes with our lifetime care promise, including professional cleaning, repairs, and resizing services.
                  </p>
                </AnimatedText>
              </div>
              <div className="space-y-4">
                <AnimatedText animation="fadeUp" delay={0}>
                  <h3 className="text-lg font-light text-foreground">Take-Back Program</h3>
                </AnimatedText>
                <AnimatedText animation="fadeUp" delay={0}>
                  <p className="text-muted-foreground">
                    When you're ready for something new, we'll take back your LINEA jewelry to be recycled into future pieces.
                  </p>
                </AnimatedText>
              </div>
            </div>
          </AnimatedSection>
        </ContentSection>

        <ContentSection title="Certifications & Partnerships">
          <AnimatedSection animation="fadeUp" stagger={0.03} className="space-y-8">
            <AnimatedText animation="fadeUp" delay={0}>
              <p className="text-muted-foreground leading-relaxed">
                Our commitment to sustainability is verified through partnerships with leading organizations and certifications that hold us accountable to the highest standards.
              </p>
            </AnimatedText>
            
            <AnimatedSection animation="fadeIn" stagger={0.02} className="grid md:grid-cols-4 gap-8 items-center">
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">RJC Certified</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">B Corp</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">SCS Certified</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Fair Trade</span>
              </div>
            </AnimatedSection>
          </AnimatedSection>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Sustainability;