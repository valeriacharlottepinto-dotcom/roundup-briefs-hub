const CATEGORIES = ["ALLE", "POLITIK", "KULTUR", "WIRTSCHAFT", "SPORT", "GESELLSCHAFT"];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => (
  <div className="border-b border-border">
    <div className="max-w-[1200px] mx-auto px-6">
      <ul className="flex items-center gap-7 py-2">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onCategoryChange(cat)}
              className={`text-[0.6rem] font-bold font-sans tracking-[0.15em] pb-1.5 border-b-2 transition-colors ${
                activeCategory === cat
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default CategoryTabs;
