import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import AboutSidebar from "../../components/about/AboutSidebar";

const CustomerCare = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader
            title="Customer Care"
            subtitle="We're here to help you with all your clothing needs"
          />

          <ContentSection title="Contact Information">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Phone</h3>
                <p className="text-muted-foreground">+971 58 836 6059</p>
                <p className="text-sm text-muted-foreground">Mon-Sat: 10:00 AM - 9:00 PM<br />UAE Time</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Email</h3>
                <p className="text-muted-foreground">lavenderlilyuae@gmail.com</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Store Location</h3>
                <p className="text-muted-foreground">Al Nasr Square, Block B<br />Shop No 11, Oud Maitha<br />Dubai, UAE</p>
                <a href="https://share.google/P63kc5rS6Cc7HtroZ" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-none mt-2">
                    Get Directions
                  </Button>
                </a>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Frequently Asked Questions">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="shipping" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  What are your shipping options and timeframes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We offer free standard shipping (3-5 business days) on orders over AED 500. Express shipping (1-2 business days) is available for AED 30. All orders are carefully tracked and signature confirmed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  What is your return and exchange policy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We offer a 30-day return policy for unworn items in original condition. Custom and engraved pieces are final sale. Returns are free with our prepaid return label.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="warranty" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  What warranty do you offer on your clothing?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Every Lavender Lily piece comes with a quality guarantee against manufacturing defects. We take pride in our craftsmanship and will assist with repairs or replacements for any quality-related issues.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sizing" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  Can I request alterations after purchase?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, we offer professional alteration services for a perfect fit. Please contact our support team within 14 days of receiving your item to discuss your requirements. Some items may not be suitable for alteration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="care" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  How should I care for my Lavender Lily clothing?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Follow the specific care labels on each garment. We generally recommend dry cleaning for our delicate pieces and cold gentle wash for everyday items. Store in a cool, dry place.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="authentication" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  How can I verify the authenticity of my clothing?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Every Lavender Lily piece features our signature labels and tags. You can verify authenticity by contacting our customer care team with your order details and photos of the garment tags.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ContentSection>

          <ContentSection title="Contact Form">
            <div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-light text-foreground">First Name</label>
                    <Input className="rounded-none" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-light text-foreground">Last Name</label>
                    <Input className="rounded-none" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">Email</label>
                  <Input type="email" className="rounded-none" placeholder="Enter your email" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">Order Number (Optional)</label>
                  <Input className="rounded-none" placeholder="Enter your order number if applicable" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">How can we help you?</label>
                  <Textarea
                    className="rounded-none min-h-[120px]"
                    placeholder="Please describe your inquiry in detail"
                  />
                </div>

                <Button type="submit" className="w-full rounded-none">
                  Send Message
                </Button>
              </form>
            </div>
          </ContentSection>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerCare;