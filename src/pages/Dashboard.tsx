import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMenuData } from "@/hooks/useMenuData";
import { useAuth } from "@/hooks/useAuth";
import { MenuItem } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X, Trash2, Plus as PlusIcon, Edit, Calculator, Pencil } from "lucide-react";

/**
 * Dashboard page mimicking the menu UI but with drag-and-drop category
 * management and item editing/creation. Requires authentication via
 * useAuth. Categories can be reordered, added, and removed via the
 * top tab bar. Items can be added within each category by clicking
 * the plus card. Clicking an existing item opens a modal to edit
 * its details. When a category is removed, its items move to the
 * "Others" category automatically (handled by useMenuData). The page
 * redirects to the login page if not authenticated.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { authenticated, logout } = useAuth();
  const {
    menuData,
    categories,
    addCategory,
    removeCategory,
    reorderCategories,
    addItem,
    updateItem,
    reorderItems,
  } = useMenuData();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authenticated) {
      navigate("/login");
    }
  }, [authenticated, navigate]);

  // Active category for scrolling highlight
  const [activeCategory, setActiveCategory] = useState<string>("");
  // Drag state for categories
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  
  // Drag state for items
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);
  const [dragItemCategory, setDragItemCategory] = useState<string | null>(null);

  // Refs for category positions for scrolling
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Dialog state for adding/editing items
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formCategory, setFormCategory] = useState<string>("");
  const [formName, setFormName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formPrice, setFormPrice] = useState<string>("");
  const [formImage, setFormImage] = useState<string>("");

  // Category editing state
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>("");

  // Update active category when categories list changes
  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0] || "");
    }
  }, [categories, activeCategory]);

  // Scroll to category when activeCategory changes
  useEffect(() => {
    const el = categoryRefs.current[activeCategory];
    if (el) {
      const offset = 120;
      const position = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: position, behavior: "smooth" });
    }
  }, [activeCategory]);

  /**
   * Initialize form fields for editing or creating an item.
   */
  const openItemDialog = (item: MenuItem | null, category: string) => {
    setEditingItem(item);
    if (item) {
      // editing existing
      setFormCategory(item.category);
      setFormName(item.name);
      setFormDescription(item.description);
      setFormPrice(item.price.toString());
      setFormImage(item.image);
    } else {
      // adding new item
      setFormCategory(category);
      setFormName("");
      setFormDescription("");
      setFormPrice("");
      setFormImage("");
    }
    setItemDialogOpen(true);
  };

  /**
   * Reset form and close dialog without saving.
   */
  const closeItemDialog = () => {
    setEditingItem(null);
    setFormCategory("");
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormImage("");
    setItemDialogOpen(false);
  };

  /**
   * Save changes from the item form. If editingItem is null, create a
   * new item; otherwise update the existing one.
   */
  const handleSaveItem = () => {
    if (!formName.trim() || !formCategory) {
      return;
    }
    const priceNumber = parseFloat(formPrice);
    const itemBase = {
      name: formName.trim(),
      description: formDescription.trim(),
      price: isNaN(priceNumber) ? 0 : priceNumber,
      image: formImage.trim() || `https://placehold.co/400x400/00a8e8/ffffff?text=${encodeURIComponent(formName)}`,
      category: formCategory,
    };
    if (editingItem) {
      const updated: MenuItem = { id: editingItem.id, ...itemBase };
      updateItem(updated);
    } else {
      addItem(itemBase);
    }
    closeItemDialog();
  };

  /**
   * Prompt for adding a new category. Uses a simple browser prompt
   * for simplicity. If the user provides input, a new category is
   * created via addCategory.
   */
  const handleAddCategory = () => {
    const name = window.prompt("Enter new category name:");
    if (name) {
      addCategory(name.trim());
    }
  };

  /**
   * Prompt user to change the image URL for the current item form.
   */
  const handleChangePhoto = () => {
    const url = window.prompt("Enter image URL:", formImage || "");
    if (url !== null) {
      setFormImage(url.trim());
    }
  };

  /**
   * Prompt user to edit the price via a calculator-like prompt. The
   * value supports decimal inputs.
   */
  const handleEditPrice = () => {
    const current = formPrice || "0";
    const input = window.prompt("Enter price:", current);
    if (input !== null) {
      setFormPrice(input.trim());
    }
  };

  /**
   * Start editing a category name
   */
  const startEditingCategory = (category: string) => {
    if (category === "Others") return; // Don't allow editing "Others"
    setEditingCategory(category);
    setEditCategoryName(category);
  };

  /**
   * Save the edited category name
   */
  const saveEditedCategory = () => {
    if (!editCategoryName.trim() || !editingCategory) return;
    // This would need to be implemented in useMenuData hook
    // For now, just close the editing mode
    setEditingCategory(null);
    setEditCategoryName("");
  };

  // Build a lookup of items by category to avoid repeated filtering
  const itemsByCategory: { [key: string]: MenuItem[] } = {};
  categories.forEach((cat) => {
    itemsByCategory[cat] = [];
  });
  menuData.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/")} className="bg-secondary hover:bg-secondary/80">
            Back
          </Button>
          <Button onClick={() => { logout(); navigate("/login"); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Logout
          </Button>
        </div>
      </div>

      {/* Category bar */}
      <div className="sticky top-[64px] z-40 bg-background border-b border-border overflow-x-auto">
        <div className="flex gap-2 px-4 py-3" style={{ minHeight: "48px" }}>
          {categories.map((cat, index) => (
            <div
              key={cat}
              draggable={cat !== "Others"} // don't allow dragging "Others"
              onDragStart={(e) => {
                // only allow dragging if not the + button and not Others
                setDragIndex(index);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                if (dragIndex !== null && dragIndex !== index) {
                  e.preventDefault();
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null && dragIndex !== index) {
                  reorderCategories(dragIndex, index);
                  setDragIndex(null);
                }
              }}
              className={`flex items-center border border-border rounded-full px-3 py-1 gap-2 cursor-pointer ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"}`}
            >
              <span onClick={() => setActiveCategory(cat)}>{cat}</span>
              {cat !== "Others" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(cat);
                  }}
                  className="text-xs"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {/* Add Category Button */}
          <button
            onClick={handleAddCategory}
            className="flex items-center justify-center w-8 h-8 border border-dashed border-border rounded-full text-lg hover:bg-secondary"
          >
            +
          </button>
        </div>
      </div>

      {/* Item sections */}
      <main className="flex-1 px-4 py-8 space-y-16">
        {categories.map((cat) => (
          <section
            key={cat}
            ref={(el) => (categoryRefs.current[cat] = el)}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              {editingCategory === cat ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="text-3xl font-bold h-12"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditedCategory();
                      if (e.key === "Escape") setEditingCategory(null);
                    }}
                    autoFocus
                  />
                  <Button
                    onClick={saveEditedCategory}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditingCategory(null)}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold">{cat}</h2>
                  {cat !== "Others" && (
                    <button
                      onClick={() => startEditingCategory(cat)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Edit category name"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {itemsByCategory[cat] &&
                itemsByCategory[cat].map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation();
                      setDragItemIndex(index);
                      setDragItemCategory(cat);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (dragItemIndex !== null && dragItemCategory === cat && dragItemIndex !== index) {
                        reorderItems(cat, dragItemIndex, index);
                      }
                      setDragItemIndex(null);
                      setDragItemCategory(null);
                    }}
                    onDragEnd={() => {
                      setDragItemIndex(null);
                      setDragItemCategory(null);
                    }}
                    onClick={() => openItemDialog(item, cat)}
                    className={`cursor-move flex h-40 overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow ${
                      dragItemIndex === index && dragItemCategory === cat ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex-1 p-4 flex flex-col justify-between pointer-events-none">
                      <div>
                        <h3 className="font-bold text-base leading-snug mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                      <p className="font-semibold mt-2">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="w-32 sm:w-36 h-full flex-shrink-0 bg-accent pointer-events-none">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/400x400/00a8e8/ffffff?text=${item.id}`;
                        }}
                      />
                    </div>
                  </div>
                ))}
              {/* Add item card */}
              <button
                onClick={() => openItemDialog(null, cat)}
                className="h-40 flex items-center justify-center border border-dashed border-border rounded-2xl text-4xl text-muted-foreground hover:bg-secondary"
              >
                +
              </button>
            </div>
          </section>
        ))}
      </main>

      {/* Item Add/Edit Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={(open) => { if (!open) closeItemDialog(); }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-border bg-secondary">
            <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
          </div>
          {/* Image preview and change button */}
          <div className="p-6 space-y-4">
            {formImage && (
              <img
                src={formImage}
                alt="preview"
                className="w-full h-48 object-cover rounded-lg border border-border"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/400x400/00a8e8/ffffff?text=${formName || "Image"}`;
                }}
              />
            )}
            <Button onClick={handleChangePhoto} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
              {formImage ? "Change Photo" : "Add/Replace Photo"}
            </Button>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Item name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Item description"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                Price (€)
                <button
                  type="button"
                  onClick={handleEditPrice}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Calculator className="w-4 h-4" />
                </button>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder="e.g. 9.99"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveItem} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;