import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";
import AnimatedImage from "../animations/AnimatedImage";

const categories = [
  {
    name: "Dresses",
    slug: "dresses",
    image: "/Lavender-Lily( Images )/IMG_3823.PNG",
    description: "Elegant dresses for every occasion"
  },
  {
    name: "Tops / Shirts",
    slug: "tops-shirts",
    image: "/Lavender-Lily( Images )/IMG_3826.PNG",
    description: "Stylish tops and shirts"
  },
  {
    name: "Pants",
    slug: "pants",
    image: "/Lavender-Lily( Images )/IMG_3827.PNG",
    description: "Comfortable and stylish"
  },
  {
    name: "Skirts",
    slug: "skirts",
    image: "/Lavender-Lily( Images )/IMG_3829.PNG",
    description: "Feminine and versatile"
  },
  {
    name: "Co-ord Set",
    slug: "co-ord-set",
    image: "/Lavender-Lily( Images )/IMG_3830.PNG",
    description: "Perfectly matched sets"
  },
  {
    name: "Ethnic",
    slug: "ethnic",
    image: "/Lavender-Lily( Images )/IMG_3832.PNG",
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
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <AnimatedImage
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                animation="fadeIn"
                delay={0}
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
