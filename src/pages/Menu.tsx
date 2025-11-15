import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShoppingBasket, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuData, categories } from "@/data/menuData";
import { CartItem } from "@/types/menu";
import { toast } from "sonner";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("LITTLE THINGS");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableInfo, setTableInfo] = useState<string>("");

  useEffect(() => {
    const table = searchParams.get("table");
    const mode = searchParams.get("mode");
    
    if (table) {
      setTableInfo(table);
    } else if (mode === "takeaway") {
      setTableInfo("TAKEAWAY");
    } else {
      // Redirect back if no valid params
      navigate("/");
    }
  }, [searchParams, navigate]);

  const handleAddToCart = (item: typeof menuData[0]) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast.success("Added to basket");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredItems = menuData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm">
                🏪
              </div>
              <span className="text-sm font-medium">Table service</span>
            </div>
            
            <div className="bg-secondary px-4 py-2 rounded-full font-medium text-sm">
              {tableInfo}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-semibold flex items-center gap-2">
              <ShoppingBasket className="w-4 h-4" />
              Basket ({totalItems})
            </button>
            <img src="https://flagcdn.com/w40/fr.png" alt="French" className="w-8 h-6" />
            <button className="text-2xl">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-[65px] z-40 bg-background border-b border-border overflow-x-auto">
        <div className="flex gap-1 px-4 py-3 max-w-7xl mx-auto">
          <button className="p-2 hover:bg-secondary rounded-lg shrink-0">
            <MenuIcon className="w-5 h-5" />
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 whitespace-nowrap font-medium transition-colors shrink-0 ${
                activeCategory === category
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">{activeCategory}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-bold text-base leading-tight">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                <p className="font-semibold">€{item.price.toFixed(2)}</p>
              </div>
              
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full aspect-square rounded-3xl bg-accent hover:bg-accent/90 transition-colors overflow-hidden relative group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/400x400/00a8e8/ffffff?text=" + item.id;
                  }}
                />
                <div className="absolute inset-0 bg-accent/20 group-hover:bg-accent/30 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Menu;
