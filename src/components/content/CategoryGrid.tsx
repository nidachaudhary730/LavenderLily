import { Link } from "react-router-dom";
import AnimatedSection from "../animations/AnimatedSection";
import AnimatedText from "../animations/AnimatedText";

const categories = [
  {
    name: "Dresses",
    slug: "dresses",
    image: "/dropdown-images/IMG_3823.PNG",
    hoverImage: "/dropdown-images/IMG_3926.PNG",
    description: "Elegant dresses for every occasion"
  },
  {
    name: "Tops / Shirts",
    slug: "tops-shirts",
    image: "/dropdown-images/IMG_3826.PNG",
    hoverImage: "/dropdown-images/IMG_3927.PNG",
    description: "Stylish tops and shirts"
  },
  {
    name: "Pants",
    slug: "pants",
    image: "/dropdown-images/IMG_3827.PNG",
    hoverImage: "/dropdown-images/IMG_4159.PNG",
    description: "Comfortable and stylish"
  },
  {
    name: "Skirts",
    slug: "skirts",
    image: "/dropdown-images/IMG_3829.PNG",
    hoverImage: "/dropdown-images/IMG_4162.PNG",
    description: "Feminine and versatile"
  },
  {
    name: "Co-ord Set",
    slug: "co-ord-set",
    image: "/dropdown-images/IMG_3830.PNG",
    hoverImage: "/dropdown-images/IMG_4161.PNG",
    description: "Perfectly matched sets"
  },
  {
    name: "Ethnic",
    slug: "ethnic",
    image: "/dropdown-images/IMG_3832.PNG",
    hoverImage: "/dropdown-images/IMG_4164.PNG",
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
