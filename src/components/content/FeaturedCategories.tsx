import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";

const featuredCategories = [
  {
    name: "New Arrivals",
    slug: "new-in",
    image: "/Lavender-Lily( Images )/IMG_3926.PNG",
    hoverImage: "/Lavender-Lily( Images )/IMG_4159.PNG",
    description: "Discover our latest collection"
  },
  {
    name: "Best Sellers",
    slug: "shop",
    image: "/Lavender-Lily( Images )/IMG_3927.PNG",
    hoverImage: "/Lavender-Lily( Images )/IMG_4161.PNG",
    description: "Shop our most loved pieces"
  },
  {
    name: "Ethnic Collection",
    slug: "ethnic",
    image: "/Lavender-Lily( Images )/IMG_4060.PNG",
    hoverImage: "/Lavender-Lily( Images )/IMG_4164.PNG",
    description: "Traditional elegance reimagined"
  },
  {
    name: "Casual Wear",
    slug: "shop",
    image: "/Lavender-Lily( Images )/IMG_4158.PNG",
    hoverImage: "/Lavender-Lily( Images )/IMG_4165.PNG",
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
