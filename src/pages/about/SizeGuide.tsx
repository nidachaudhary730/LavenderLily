import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader
            title="Size Guide"
            subtitle="Find your perfect fit with our international clothing size guide"
          />

          <ContentSection title="Womenswear Sizing">
            <div className="space-y-8">
              <div className="bg-muted/10 p-8">
                <h3 className="text-xl font-light text-foreground mb-6">Standard International Mappings</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Please note that sizing can vary slightly between different styles. Our pieces are generally designed with a premium, tailored fit.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted/20">
                      <th className="border border-border p-4 text-left font-light uppercase tracking-wider text-xs">UK Size</th>
                      <th className="border border-border p-4 text-left font-light uppercase tracking-wider text-xs">US Size</th>
                      <th className="border border-border p-4 text-left font-light uppercase tracking-wider text-xs">EU Size</th>
                      <th className="border border-border p-4 text-left font-light uppercase tracking-wider text-xs">Alpha Size</th>
                      <th className="border border-border p-4 text-left font-light uppercase tracking-wider text-xs">Bust (cm)</th>
                      <th className="border border-border p-4 text-left font-light uppercase tracking-wider text-xs">Waist (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { uk: "6", us: "2", eu: "34", alpha: "XS", bust: "80-82", waist: "62-64" },
                      { uk: "8", us: "4", eu: "36", alpha: "S", bust: "84-86", waist: "66-68" },
                      { uk: "10", us: "6", eu: "38", alpha: "S/M", bust: "88-90", waist: "70-72" },
                      { uk: "12", us: "8", eu: "40", alpha: "M", bust: "92-94", waist: "74-76" },
                      { uk: "14", us: "10", eu: "42", alpha: "L", bust: "96-98", waist: "78-80" },
                      { uk: "16", us: "12", eu: "44", alpha: "XL", bust: "100-104", waist: "82-86" }
                    ].map((size, index) => (
                      <tr key={index} className="hover:bg-muted/10 transition-colors">
                        <td className="border border-border p-4 text-sm">{size.uk}</td>
                        <td className="border border-border p-4 text-sm">{size.us}</td>
                        <td className="border border-border p-4 text-sm">{size.eu}</td>
                        <td className="border border-border p-4 text-sm font-medium">{size.alpha}</td>
                        <td className="border border-border p-4 text-sm text-muted-foreground">{size.bust}</td>
                        <td className="border border-border p-4 text-sm text-muted-foreground">{size.waist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="How to Measure">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest font-medium">Bust</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Measure around the fullest part of your chest, keeping the tape horizontal and snug but not tight.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest font-medium">Waist</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Measure around the narrowest part of your waistline (typically where your body bends side to side).
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest font-medium">Hips</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Measure around the fullest part of your hips, keeping your feet together and the tape horizontal.
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Tailored Assistance">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Still unsure about the perfect fit? Our stylists are available for virtual consultations to help you find the ideal silhouette for your body type.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="outline" className="rounded-none border-foreground uppercase tracking-widest text-[10px] h-12 px-8">
                  Request Measurements
                </Button>
                <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-[10px] h-12 px-8">
                  Styling Consultation
                </Button>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SizeGuide;