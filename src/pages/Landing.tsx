import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

const Landing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");

  // language hook to handle German/English translations
  const [language, toggleLanguage] = useLanguage();
  const t = translations[language];

  // Check for QR code parameters
  const tableParam = searchParams.get("table");
  const modeParam = searchParams.get("mode");

  // Auto-navigate if QR code has table or takeaway mode
  if (tableParam) {
    navigate(`/menu?table=${tableParam}`);
    return null;
  }

  if (modeParam === "takeaway") {
    navigate("/menu?mode=takeaway");
    return null;
  }

  // When the user chooses table service, open the table selection dialog
  const handleTableServiceClick = () => {
    setShowTableDialog(true);
  };

  // When the user chooses takeaway, navigate directly to the menu in takeaway mode
  const handleToGoClick = () => {
    navigate("/menu?mode=takeaway");
  };

  const handleValidate = () => {
    if (selectedTable) {
      navigate(`/menu?table=${selectedTable}`);
    }
  };

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

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 md:p-6">
          <div className="text-3xl md:text-4xl font-royal text-foreground leading-tight">
            Royal<br />Bengal
          </div>
          <div className="flex items-center gap-4">
            {/* Show the alternate flag as a language toggle */}
            <img
              src={language === 'en' ? 'https://flagcdn.com/w40/de.png' : 'https://flagcdn.com/w40/gb.png'}
              alt={language === 'en' ? 'Deutsch' : 'English'}
              className="w-8 h-6 cursor-pointer"
              onClick={toggleLanguage}
            />
            <button className="text-3xl">☰</button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
          <h1 className="text-3xl md:text-5xl font-bold text-center text-foreground mb-16 max-w-4xl leading-tight">
            {t.slogan}
          </h1>

          <div className="flex flex-col items-center gap-8">
            {/* Button to choose table service and select a table */}
            <button
              onClick={handleTableServiceClick}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl md:text-3xl transition-transform hover:scale-105"
            >
              {t.tableService}
            </button>
            {/* Button to choose takeaway mode and navigate directly to the menu */}
            <button
              onClick={handleToGoClick}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl md:text-3xl transition-transform hover:scale-105"
            >
              {t.takeaway}
            </button>
          </div>
        </main>
      </div>

      {/* Table Selection Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-6 py-4">
            <div className="text-center bg-secondary/30 py-3 rounded-lg">
              <h2 className="text-lg font-medium text-muted-foreground">{t.tableService}</h2>
            </div>

            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-full h-12 text-base">
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
              onClick={handleValidate}
              disabled={!selectedTable}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
            >
              {t.validate}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Landing;
