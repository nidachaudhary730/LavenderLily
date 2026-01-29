import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Define types
export interface FilterState {
  categories: string[];
  priceRanges: string[];
  materials: string[];
}

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;
  sortBy: string;
  setSortBy: (sort: string) => void;
  activeFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  sortBy,
  setSortBy,
  activeFilters,
  onApplyFilters
}: FilterSortBarProps) => {
  // Local state for pending filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>(activeFilters.categories);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(activeFilters.priceRanges);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(activeFilters.materials);

  // Sync local state when activeFilters change (e.g. cleared externally)
  // But only if sheet is closed or just opened? For simplicity, we can sync when sheet opens.
  // Actually, standard pattern is initializing state, and then maybe re-initializing if props forcing change.
  // For now, let's just initialize.

  // Filter options populated with static data for now
  const [categories] = useState<string[]>([
    "Dresses", "Tops / Shirts", "Pants", "Skirts", "Co-ord set", "Ethnic"
  ]);
  const [priceRanges] = useState<string[]>([
    "Under AED 100", "AED 100 - AED 200", "AED 200 - AED 500", "AED 500+"
  ]);
  const [materials] = useState<string[]>([
    "Cotton", "Silk", "Linen", "Polyester", "Wool"
  ]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      priceRanges: selectedPriceRanges,
      materials: selectedMaterials
    });
    setFiltersOpen(false);
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedMaterials([]);
    onApplyFilters({
      categories: [],
      priceRanges: [],
      materials: []
    });
    setFiltersOpen(false);
  };

  return (
    <>
      <section className="w-full px-6 mb-8 border-b border-border pb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-light text-muted-foreground">
            {itemCount} items
          </p>

          <div className="flex items-center gap-4">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-light hover:bg-transparent"
                >
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-none shadow-none h-full flex flex-col">
                <SheetHeader className="mb-6 border-b border-border pb-4">
                  <SheetTitle className="text-lg font-light">Filters</SheetTitle>
                  <SheetDescription className="hidden">Filter products</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto pr-6 -mr-6 pl-1">
                  <div className="space-y-8 pb-8">
                    {/* Category Filter */}
                    <div>
                      <h3 className="text-sm font-light mb-4 text-foreground">Category</h3>
                      {categories.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No categories available.</p>
                      ) : (
                        <div className="space-y-3">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-3">
                              <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                              />
                              <Label htmlFor={category} className="text-sm font-light text-foreground cursor-pointer">
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator className="border-border" />

                    {/* Price Filter */}
                    <div>
                      <h3 className="text-sm font-light mb-4 text-foreground">Price</h3>
                      {priceRanges.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No price ranges available.</p>
                      ) : (
                        <div className="space-y-3">
                          {priceRanges.map((range) => (
                            <div key={range} className="flex items-center space-x-3">
                              <Checkbox
                                id={range}
                                checked={selectedPriceRanges.includes(range)}
                                onCheckedChange={() => togglePriceRange(range)}
                                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                              />
                              <Label htmlFor={range} className="text-sm font-light text-foreground cursor-pointer">
                                {range}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator className="border-border" />

                    {/* Material Filter */}
                    <div>
                      <h3 className="text-sm font-light mb-4 text-foreground">Material</h3>
                      {materials.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No materials available.</p>
                      ) : (
                        <div className="space-y-3">
                          {materials.map((material) => (
                            <div key={material} className="flex items-center space-x-3">
                              <Checkbox
                                id={material}
                                checked={selectedMaterials.includes(material)}
                                onCheckedChange={() => toggleMaterial(material)}
                                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                              />
                              <Label htmlFor={material} className="text-sm font-light text-foreground cursor-pointer">
                                {material}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-border mt-auto bg-background">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full border-none hover:bg-transparent hover:underline font-normal text-left justify-start"
                    onClick={handleApply}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full border-none hover:bg-transparent hover:underline font-light text-left justify-start"
                    onClick={handleClear}
                  >
                    Clear All
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-auto border-none bg-transparent text-sm font-light shadow-none rounded-none pr-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="shadow-none border-none rounded-none bg-background">
                <SelectItem value="featured" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Featured</SelectItem>
                <SelectItem value="price-low" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: High to Low</SelectItem>
                <SelectItem value="newest" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Newest</SelectItem>
                <SelectItem value="name" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </>
  );
};

export default FilterSortBar;