import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";

const featuredCategories = [
  {
    name: "New Arrivals",
    slug: "new-in",
    image: "/images/categories/dresses/1.png",
    hoverImage: "/images/categories/dresses/2.png",
    description: "Discover our latest collection"
  },
  {
    name: "Best Sellers",
    slug: "shop",
    image: "/images/categories/party-wear/1.png",
    hoverImage: "/images/categories/party-wear/2.png",
    description: "Shop our most loved pieces"
  },
  {
    name: "Ethnic Collection",
    slug: "ethnic",
    image: "/images/categories/ethnic-wear/1.png",
    hoverImage: "/images/categories/ethnic-wear/2.png",
    description: "Traditional elegance reimagined"
  },
  {
    name: "Casual Wear",
    slug: "shop",
    image: "/images/categories/co-ords/1.png",
    hoverImage: "/images/categories/co-ords/2.png",
    description: "Comfort meets style"
  }
];

const FeaturedCategories = () => {
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedText animation="fadeUp" delay={0}>
        <h2 className="text-sm font-light text-foreground mb-6 px-2">Featured Collections</h2>
      </AnimatedText>
      <AnimatedSection animation="fadeUp" stagger={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCategories.map((category) => (
          <Link key={category.name} to={`/category/${category.slug}`} className="group">
            <div className="w-full aspect-[4/5] mb-3 overflow-hidden relative">
              {/* Primary image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
              />
              {/* Secondary image on hover */}
              <img
                src={category.hoverImage}
                alt={`${category.name} - alternate view`}
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
              />
              <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
            </div>
            <div className="">
              <AnimatedText animation="fadeUp" delay={0}>
                <h3 className="text-sm font-normal text-foreground mb-1">
                  {category.name}
                </h3>
              </AnimatedText>
              <AnimatedText animation="fadeUp" delay={0}>
                <p className="text-sm font-light text-muted-foreground">
                  {category.description}
                </p>
              </AnimatedText>
            </div>
          </Link>
        ))}
      </AnimatedSection>
    </section>
  );
};

export default FeaturedCategories;
