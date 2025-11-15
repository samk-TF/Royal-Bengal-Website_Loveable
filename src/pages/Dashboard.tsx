import { useState } from "react";
import { useMenuData } from "@/hooks/useMenuData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem } from "@/types/menu";
import { Link, useNavigate } from "react-router-dom";

/**
 * Dashboard page for managing menu categories and items.
 * This page provides basic forms to add/remove categories and to
 * create, edit and delete menu items. All data is synced with
 * localStorage via the useMenuData hook.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const {
    categories,
    menuData,
    addCategory,
    removeCategory,
    renameCategory,
    addItem,
    removeItem,
    updateItem,
  } = useMenuData();

  // New category input state
  const [newCategory, setNewCategory] = useState("");

  // Item form state for creating/editing
  const [formCategory, setFormCategory] = useState<string>("");
  const [formName, setFormName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formPrice, setFormPrice] = useState<string>("");
  const [formImage, setFormImage] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Handler to submit a new category
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  // Handler for submitting the item form (both create and update)
  const handleSubmitItem = () => {
    if (!formName.trim() || !formCategory || !formPrice.trim()) {
      return;
    }
    const priceNumber = parseFloat(formPrice);
    if (isNaN(priceNumber)) {
      return;
    }
    const itemBase = {
      name: formName.trim(),
      description: formDescription.trim(),
      price: priceNumber,
      image: formImage.trim() || "https://placehold.co/400x400/00a8e8/ffffff?text=" + formName.trim(),
      category: formCategory,
    };
    if (editingId) {
      // Update existing item
      const updated: MenuItem = { id: editingId, ...itemBase };
      updateItem(updated);
    } else {
      // Create new item
      addItem(itemBase);
    }
    // Reset form fields
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormImage("");
    setFormCategory("");
    setEditingId(null);
  };

  // Start editing an existing item by populating the form
  const startEditItem = (item: MenuItem) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormDescription(item.description);
    setFormPrice(item.price.toString());
    setFormImage(item.image);
    setFormCategory(item.category);
  };

  // Cancel editing and clear the form
  const cancelEdit = () => {
    setEditingId(null);
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormImage("");
    setFormCategory("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-10 max-w-5xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate("/")} className="bg-secondary hover:bg-secondary/80">Back to Home</Button>
      </header>

      {/* Categories management */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Manage Categories</h2>
        <div className="flex gap-4">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <Button onClick={handleAddCategory} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Add Category
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {categories.map((cat) => (
            <li key={cat} className="flex items-center justify-between py-2 border-b border-border">
              <span>{cat}</span>
              <div className="flex gap-2">
                {/*
                  The dashboard currently only supports deletion of categories.
                  You could add rename functionality here by using an input field and
                  calling renameCategory(oldName, newName).
                */}
                <Button
                  onClick={() => removeCategory(cat)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Item management */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{editingId ? "Edit Item" : "Add New Item"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Item name"
            />
            <Textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Item description"
            />
            <Input
              type="number"
              step="0.01"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              placeholder="Price (e.g. 5.00)"
            />
            <Input
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="Image URL (optional)"
            />
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
            <div className="flex gap-4">
              <Button
                onClick={handleSubmitItem}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {editingId ? "Update Item" : "Add Item"}
              </Button>
              {editingId && (
                <Button onClick={cancelEdit} className="bg-muted text-foreground">
                  Cancel
                </Button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-border">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="p-2 border-b border-border">Name</th>
                  <th className="p-2 border-b border-border">Category</th>
                  <th className="p-2 border-b border-border">Price (€)</th>
                  <th className="p-2 border-b border-border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuData.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="p-2 whitespace-nowrap">{item.name}</td>
                    <td className="p-2 whitespace-nowrap">{item.category}</td>
                    <td className="p-2 whitespace-nowrap">{item.price.toFixed(2)}</td>
                    <td className="p-2 whitespace-nowrap flex gap-2">
                      <Button
                        onClick={() => startEditItem(item)}
                        className="bg-secondary hover:bg-secondary/80 text-foreground"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => removeItem(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {menuData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                      No items added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;