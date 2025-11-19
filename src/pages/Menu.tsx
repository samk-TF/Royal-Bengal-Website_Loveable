import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBasket, Menu as MenuIcon, X, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// Remove static imports of menu data. We'll source categories and items from a custom hook.
import { useMenuData } from "@/hooks/useMenuData";
import { MenuItem } from "@/types/menu";
import { CartItem } from "@/types/menu";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

// Language support
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("LITTLE THINGS");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableInfo, setTableInfo] = useState<string>("");
  // selectedItem uses the MenuItem type from our dynamic menu data
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const categoryButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const isManualScrolling = useRef(false);

  // Service selection dialog state for switching between takeaway and table service
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [selectedTableOption, setSelectedTableOption] = useState<string>("");
  // List of available tables for selection. Duplicate of landing page tables.
  const tables = [
    "TERRACE - 101",
    "TERRACE - 102",
    "TERRACE - 103",
    "TERRACE - 104",
    "TERRACE - 105",
    "TERRACE - 106",
    "TERRACE - 107",
    "TERRACE - 108",
    "INSIDE - 201",
    "INSIDE - 202",
    "INSIDE - 203",
    "INSIDE - 204",
  ];

  // use language hook for translations
  const [language, toggleLanguage] = useLanguage();
  const t = translations[language];

  // Use custom hook to fetch dynamic menu items and categories
  const { menuData, categories } = useMenuData();

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

  // Observe category sections and update active category on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -60% 0px', // Focus on top portion of viewport
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Skip observer updates during manual scrolling
      if (isManualScrolling.current) return;
      
      // Get all currently intersecting sections with their positions
      const intersectingSections = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => ({
          category: entry.target.getAttribute('data-category'),
          top: entry.boundingClientRect.top,
          intersectionRatio: entry.intersectionRatio
        }))
        .filter(section => section.category);
      
      if (intersectingSections.length === 0) return;
      
      // Find the section whose top edge is closest to the top of the viewport (after accounting for header)
      // The section with the smallest positive top value is the one we're viewing
      const topSection = intersectingSections.reduce((closest, current) => {
        const closestTop = Math.abs(closest.top);
        const currentTop = Math.abs(current.top);
        return currentTop < closestTop ? current : closest;
      });
      
      if (topSection.category) {
        setActiveCategory(topSection.category);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all category sections
    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories]);

  // Update indicator position when active category changes
  useEffect(() => {
    const activeButton = categoryButtonRefs.current[activeCategory];
    if (activeButton) {
      const containerRect = activeButton.parentElement?.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      if (containerRect) {
        setIndicatorStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width
        });
      }
    }
  }, [activeCategory, categories]);

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
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

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setItemQuantity(1);
  };

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      // Disable observer during manual scroll
      isManualScrolling.current = true;
      
      const offset = 130; // Account for sticky headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveCategory(category);
      
      // Re-enable observer after scroll completes
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 800);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background w-full max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side: back button and brand name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden sm:block text-xl font-royal text-foreground leading-tight ml-1">
              Royal<br />Bengal
            </div>
          </div>
          {/* Right side: service selection, cart, language and settings */}
          <div className="flex items-center gap-3">
            {/* Clickable service/table pill */}
            <div
              onClick={() => setShowServiceDialog(true)}
              className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full cursor-pointer"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm">
                🏪
              </div>
              <span className="text-sm font-medium">
                {tableInfo === 'TAKEAWAY'
                  ? (language === 'en' ? 'To-go' : 'Mitnehmen')
                  : t.tableService}
              </span>
            </div>
            <div
              onClick={() => setShowServiceDialog(true)}
              className="bg-secondary px-4 py-2 rounded-full font-medium text-sm cursor-pointer"
            >
              {tableInfo}
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-semibold flex items-center gap-2"
            >
              <ShoppingBasket className="w-4 h-4" />
              {t.basket(totalItems)}
            </button>
            {/* Language toggle flag */}
            <img
              src={language === 'en' ? 'https://flagcdn.com/w40/de.png' : 'https://flagcdn.com/w40/gb.png'}
              alt={language === 'en' ? 'Deutsch' : 'English'}
              className="w-8 h-6 cursor-pointer"
              onClick={toggleLanguage}
            />
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
      <div className="sticky top-[65px] z-40 bg-background border-b border-border">
        <div className="relative flex gap-1 px-4 py-3 max-w-7xl mx-auto">
          <button 
            onClick={() => setIsCategoryMenuOpen(true)}
            className="p-2 hover:bg-secondary rounded-lg shrink-0"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          {categories.map((category) => (
            <button
              key={category}
              ref={(el) => categoryButtonRefs.current[category] = el}
              onClick={() => scrollToCategory(category)}
              className={`px-4 py-2 whitespace-nowrap font-medium transition-colors shrink-0 ${
                activeCategory === category
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
          {/* Sliding indicator */}
          <div 
            className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
            style={{ 
              left: `${indicatorStyle.left}px`, 
              width: `${indicatorStyle.width}px` 
            }}
          />
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {categories.map((category) => {
          const categoryItems = menuData.filter(item => item.category === category);
          
          return (
            <section 
              key={category}
              ref={(el) => categoryRefs.current[category] = el}
              data-category={category}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8">{category}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex h-40 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  >
                    {/* Left side: details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base leading-snug mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                      <p className="font-semibold mt-2">€{item.price.toFixed(2)}</p>
                    </div>
                    {/* Right side: image as button */}
                    <button
                      onClick={() => handleItemClick(item)}
                      className="w-32 sm:w-36 h-full flex-shrink-0 bg-accent hover:bg-accent/90 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/400x400/00a8e8/ffffff?text=" + item.id;
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Category Menu Drawer */}
      <Sheet open={isCategoryMenuOpen} onOpenChange={setIsCategoryMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 [&>button]:hidden">
          {/* Header without close icon */}
          <SheetHeader className="p-4 border-b border-border" />
          <div className="py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  scrollToCategory(category);
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
        <SheetContent side="right" className="w-80 p-0 flex flex-col [&>button]:hidden">
          {/* Remove the default close icon and leave header empty */}
          <SheetHeader className="p-4 border-b border-border">
            {/* intentionally left empty to remove the 'X' close icon */}
          </SheetHeader>
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{language === 'en' ? 'English' : 'Deutsch'}</span>
              {/* Toggle language button shows the other language as the option */}
              <button
                onClick={toggleLanguage}
                className="text-sm text-muted-foreground hover:underline"
              >
                {language === 'en' ? 'Deutsch' : 'English'}
              </button>
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
            <Link to="/terms-of-sale" onClick={() => setIsSettingsMenuOpen(false)} className="hover:underline block">
              Terms of Sale
            </Link>
            <Link to="/terms-of-use" onClick={() => setIsSettingsMenuOpen(false)} className="hover:underline block">
              Terms of Use
            </Link>
            <Link to="/privacy-policy" onClick={() => setIsSettingsMenuOpen(false)} className="hover:underline block">
              Privacy Policy
            </Link>
            <Link to="/legal-notice" onClick={() => setIsSettingsMenuOpen(false)} className="hover:underline block">
              Legal Notice
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Drawer */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col [&>button]:hidden">
          <SheetHeader className="p-4 border-b border-border">
            <SheetClose className="absolute left-4 top-4">
              <ArrowLeft className="h-6 w-6" />
            </SheetClose>
            <SheetTitle className="text-center">{t.myOrder}</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-6">{t.myOrder}</h2>
              
              <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-2xl mb-6">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    🏪
                  </div>
                  <span className="font-medium">{t.tableService}</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                  <div className="w-8 h-8 bg-primary/20 rounded-full" />
                  <span className="font-medium">{tableInfo}</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>

              <div className="bg-secondary/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">{t.orderOverview}</h3>
                
                {cart.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-sm mb-4">
                    {t.emptyCart}
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
                  {t.continue}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Service Selection Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        {/* Hide the default dialog close button in this dialog */}
        <DialogContent className="sm:max-w-md p-0 [&>button]:hidden">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'Choose service mode' : 'Servicemodus wählen'}
            </h3>
            {/* Takeaway option */}
            <Button
              onClick={() => {
                navigate('/menu?mode=takeaway');
                setShowServiceDialog(false);
              }}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full py-3 font-medium"
            >
              {language === 'en' ? 'To-go' : 'Mitnehmen'}
            </Button>
            {/* Table selection */}
            <Select value={selectedTableOption} onValueChange={setSelectedTableOption}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder={t.selectTable} />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                if (selectedTableOption) {
                  navigate(`/menu?table=${selectedTableOption}`);
                }
                setShowServiceDialog(false);
              }}
              disabled={!selectedTableOption}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full"
            >
              {t.validate}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                    {t.addToBasket}
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
