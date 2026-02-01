import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import LargeHero from "../components/content/LargeHero";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import EditorialSection from "../components/content/EditorialSection";
import CategoryGrid from "../components/content/CategoryGrid";
import FeaturedCategories from "../components/content/FeaturedCategories";
import ThreeColumnSection from "../components/content/ThreeColumnSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <FiftyFiftySection />
        <CategoryGrid />
        <ProductCarousel />
        <LargeHero />
        <FeaturedCategories />
        <OneThirdTwoThirdsSection />
        <ThreeColumnSection />
        <EditorialSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
