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
  // Map special category slugs to display names
  const getCategoryDisplayName = (slug: string) => {
    const specialCategories: Record<string, string> = {
      'shop': 'All Products',
      'new-in': 'New In',
      'new-arrivals': 'New Arrivals',
      'pre-orders': 'Pre-Orders',
      'limited-edition': 'Limited Edition',
    };
    
    if (specialCategories[slug]) {
      return specialCategories[slug];
    }
    
    // Convert slug to title case
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const displayName = getCategoryDisplayName(category);
  
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
                <BreadcrumbPage>{displayName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AnimatedText>
      </div>
      
      <div>
        <AnimatedText animation="fadeUp" split delay={0.2}>
          <h1 className="text-3xl md:text-4xl font-light text-foreground">
            {displayName}
          </h1>
        </AnimatedText>
      </div>
    </section>
  );
};

export default CategoryHeader;
