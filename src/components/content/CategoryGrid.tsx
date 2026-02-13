import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";

const categories = [
  {
    name: "Dresses",
    slug: "dresses",
    image: "/images/categories/dresses/1.png",
    hoverImage: "/images/categories/dresses/2.png",
    description: "Elegant dresses for every occasion"
  },
  {
    name: "Tops & Shirts",
    slug: "tops-shirts",
    image: "/images/categories/tops/1.png",
    hoverImage: "/images/categories/tops/2.png",
    description: "Stylish tops and shirts"
  },
  {
    name: "Party Collection",
    slug: "party-collection",
    image: "/images/categories/party-wear/1.png",
    hoverImage: "/images/categories/party-wear/2.png",
    description: "Shine at every event"
  },
  {
    name: "Skirts",
    slug: "skirts",
    image: "/images/categories/skirts/1.png",
    hoverImage: "/images/categories/skirts/2.png",
    description: "Feminine and versatile"
  },
  {
    name: "Co-ord Sets",
    slug: "co-ord-sets",
    image: "/images/categories/co-ords/1.png",
    hoverImage: "/images/categories/co-ords/2.png",
    description: "Perfectly matched sets"
  },
  {
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    image: "/images/categories/ethnic-wear/1.png",
    hoverImage: "/images/categories/ethnic-wear/2.png",
    description: "Traditional elegance"
  }
];

const CategoryGrid = () => {
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedText animation="fadeUp" delay={0}>
        <h2 className="text-sm font-light text-foreground mb-6 px-2">Shop by Category</h2>
      </AnimatedText>
      <AnimatedSection animation="fadeUp" stagger={0.03} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link key={category.slug} to={`/category/${category.slug}`} className="group">
            <div className="w-full aspect-square mb-3 overflow-hidden relative">
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
            </div>
            <div className="">
              <AnimatedText animation="fadeUp" delay={0}>
                <h3 className="text-sm font-normal text-foreground mb-1">
                  {category.name}
                </h3>
              </AnimatedText>
              <AnimatedText animation="fadeUp" delay={0}>
                <p className="text-xs font-light text-muted-foreground">
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

export default CategoryGrid;
