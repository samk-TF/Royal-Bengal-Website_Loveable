import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShoppingBasket, Menu as MenuIcon, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuData, categories } from "@/data/menuData";
import { CartItem } from "@/types/menu";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("LITTLE THINGS");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableInfo, setTableInfo] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<typeof menuData[0] | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

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

  const handleAddToCart = (item: typeof menuData[0], quantity: number = 1) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
    
    toast.success("Added to basket");
    setSelectedItem(null);
    setItemQuantity(1);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleItemClick = (item: typeof menuData[0]) => {
    setSelectedItem(item);
    setItemQuantity(1);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-semibold flex items-center gap-2"
            >
              <ShoppingBasket className="w-4 h-4" />
              Basket ({totalItems})
            </button>
            <img src="https://flagcdn.com/w40/fr.png" alt="French" className="w-8 h-6" />
            <button 
              onClick={() => setIsSettingsMenuOpen(true)}
              className="text-2xl"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-[65px] z-40 bg-background border-b border-border overflow-x-auto">
        <div className="flex gap-1 px-4 py-3 max-w-7xl mx-auto">
          <button 
            onClick={() => setIsCategoryMenuOpen(true)}
            className="p-2 hover:bg-secondary rounded-lg shrink-0"
          >
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
                onClick={() => handleItemClick(item)}
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

      {/* Category Menu Drawer */}
      <Sheet open={isCategoryMenuOpen} onOpenChange={setIsCategoryMenuOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetClose className="absolute right-4 top-4 rounded-full bg-secondary w-10 h-10 flex items-center justify-center hover:bg-secondary/80">
              <X className="h-5 w-5" />
            </SheetClose>
          </SheetHeader>
          <div className="py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsCategoryMenuOpen(false);
                }}
                className="w-full text-left px-6 py-3 hover:bg-secondary/50 transition-colors font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Settings Menu Drawer */}
      <Sheet open={isSettingsMenuOpen} onOpenChange={setIsSettingsMenuOpen}>
        <SheetContent side="right" className="w-80 p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border">
            <SheetClose className="absolute left-4 top-4 rounded-sm opacity-70 hover:opacity-100">
              <X className="h-5 w-5" />
            </SheetClose>
          </SheetHeader>
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">English</span>
              <button className="text-sm text-muted-foreground">▼</button>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6">
              Sign up or sign in
            </Button>
            <button 
              onClick={() => {
                setIsSettingsMenuOpen(false);
                navigate("/");
              }}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
          <div className="border-t border-border p-6 space-y-2 text-sm text-muted-foreground">
            <div>Terms of Sale</div>
            <div>Terms of Use</div>
            <div>Privacy Policy</div>
            <div>Legal Notice</div>
          </div>
          <div className="p-4 text-xs text-muted-foreground text-center">
            Powered by DOOD
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Drawer */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border">
            <SheetClose className="absolute left-4 top-4">
              <ArrowLeft className="h-6 w-6" />
            </SheetClose>
            <SheetTitle className="text-center">My order</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-6">My order</h2>
              
              <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-2xl mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    🏪
                  </div>
                  <span className="font-medium">Table service</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                  <div className="w-8 h-8 bg-primary/20 rounded-full" />
                  <span className="font-medium">{tableInfo}</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>

              <div className="bg-secondary/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Overview</h3>
                
                {cart.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-sm mb-4">
                    Your cart is empty.
                  </div>
                ) : (
                  <div className="space-y-4 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 bg-background p-4 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/64x64/00a8e8/ffffff?text=" + item.id;
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">€{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full py-6"
                  disabled={cart.length === 0}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-10 h-10 flex items-center justify-center">
            <X className="h-5 w-5" />
          </DialogClose>
          
          {selectedItem && (
            <div>
              <div className="relative">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full aspect-square object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/400x400/00a8e8/ffffff?text=" + selectedItem.id;
                  }}
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{selectedItem.description}</p>
                  <p className="text-lg font-semibold">€{selectedItem.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-secondary hover:bg-secondary flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-lg">{itemQuantity}</span>
                    <button
                      onClick={() => setItemQuantity(itemQuantity + 1)}
                      className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(selectedItem, itemQuantity)}
                    className="flex-1 ml-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full py-6"
                  >
                    Open at 7:00pm
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
