import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AnimatedText from "../animations/AnimatedText";

interface CategoryHeaderProps {
  category: string;
}

const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  return (
    <section className="w-full px-6 mb-8">
        <div className="mb-6">
          <AnimatedText animation="fadeIn" delay={0.1}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{capitalizedCategory}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </AnimatedText>
        </div>
        
        <div>
          <AnimatedText animation="fadeUp" split delay={0.2}>
            <h1 className="text-3xl md:text-4xl font-light text-foreground">
              {capitalizedCategory}
            </h1>
          </AnimatedText>
        </div>
    </section>
  );
};

export default CategoryHeader;