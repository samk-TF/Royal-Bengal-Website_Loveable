import { useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";
// Import the default data and categories to seed localStorage the first time.
import { menuData as defaultMenuData, categories as defaultCategories } from "@/data/menuData";

/**
 * Custom hook to manage menu categories and items.  
 * This hook synchronizes state with localStorage so that edits made
 * through the dashboard persist across page reloads. On initial mount
 * it falls back to the predefined categories and menuData exports if
 * nothing has been stored yet.
 */
export function useMenuData() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Load data from localStorage on mount. If nothing is stored yet,
  // initialize with the default data from the data folder.
  useEffect(() => {
    try {
      const storedMenu = localStorage.getItem("menuData");
      const storedCategories = localStorage.getItem("menuCategories");
      if (storedMenu) {
        setMenuData(JSON.parse(storedMenu));
      } else {
        setMenuData(defaultMenuData);
      }
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(defaultCategories);
      }
    } catch (err) {
      // In case parsing fails for whatever reason, fall back to defaults.
      setMenuData(defaultMenuData);
      setCategories(defaultCategories);
    }
  }, []);

  // Helper to save the current menu items to localStorage and state.
  const saveMenu = (items: MenuItem[]) => {
    setMenuData(items);
    localStorage.setItem("menuData", JSON.stringify(items));
  };

  // Helper to save the current categories to localStorage and state.
  const saveCategories = (cats: string[]) => {
    setCategories(cats);
    localStorage.setItem("menuCategories", JSON.stringify(cats));
  };

  // Add a new category if it doesn't already exist.
  const addCategory = (categoryName: string) => {
    const trimmed = categoryName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      saveCategories([...categories, trimmed]);
    }
  };

  // Remove a category and any menu items assigned to it.
  const removeCategory = (categoryName: string) => {
    const filteredCats = categories.filter((c) => c !== categoryName);
    const filteredItems = menuData.filter((item) => item.category !== categoryName);
    saveCategories(filteredCats);
    saveMenu(filteredItems);
  };

  // Rename an existing category and update all items that referenced it.
  const renameCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    const updatedCats = categories.map((c) => (c === oldName ? trimmed : c));
    const updatedItems = menuData.map((item) =>
      item.category === oldName ? { ...item, category: trimmed } : item
    );
    saveCategories(updatedCats);
    saveMenu(updatedItems);
  };

  // Generate a unique ID for new items. This uses the current timestamp
  // and a random component to avoid collisions.
  const generateId = (category: string) => {
    const randomPart = Math.random().toString(36).substring(2, 5);
    return `${category.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-5)}-${randomPart}`;
  };

  // Add a new item to the menu. Automatically assigns a unique id.
  const addItem = (item: Omit<MenuItem, "id">) => {
    const id = generateId(item.category);
    const newItem: MenuItem = { id, ...item };
    saveMenu([...menuData, newItem]);
  };

  // Remove an item by its id.
  const removeItem = (itemId: string) => {
    const filtered = menuData.filter((item) => item.id !== itemId);
    saveMenu(filtered);
  };

  // Update an existing item. Looks up by id and replaces it.
  const updateItem = (updatedItem: MenuItem) => {
    const updated = menuData.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    saveMenu(updated);
  };

  return {
    menuData,
    categories,
    addCategory,
    removeCategory,
    renameCategory,
    addItem,
    removeItem,
    updateItem,
  };
}