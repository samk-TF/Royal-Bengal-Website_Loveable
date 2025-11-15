import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button as UIButton } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Button imported as UIButton to avoid confusion with other buttons
// across the file when adding the settings sheet

import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Landing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");

  // State for the settings sheet on the landing page (triggered by the hamburger menu)
  const [isLandingSettingsOpen, setIsLandingSettingsOpen] = useState(false);

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
            <button
              className="text-3xl"
              onClick={() => setIsLandingSettingsOpen(true)}
            >
              ☰
            </button>
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

            <UIButton
              onClick={handleValidate}
              disabled={!selectedTable}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
            >
              {t.validate}
            </UIButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings sheet for the landing page */}
      <Sheet open={isLandingSettingsOpen} onOpenChange={setIsLandingSettingsOpen}>
        <SheetContent side="right" className="w-80 p-0 flex flex-col [&>button]:hidden">
          {/* Remove default close button */}
          <SheetHeader className="p-4 border-b border-border" />
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{language === 'en' ? 'English' : 'Deutsch'}</span>
              <button
                onClick={toggleLanguage}
                className="text-sm text-muted-foreground hover:underline"
              >
                {language === 'en' ? 'Deutsch' : 'English'}
              </button>
            </div>
            <UIButton className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6">
              Sign up or sign in
            </UIButton>
            <button
              onClick={() => {
                setIsLandingSettingsOpen(false);
                navigate('/');
              }}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
          <div className="border-t border-border p-6 space-y-2 text-sm text-muted-foreground">
            <Link
              to="/terms-of-sale"
              onClick={() => setIsLandingSettingsOpen(false)}
              className="hover:underline block"
            >
              Terms of Sale
            </Link>
            <Link
              to="/terms-of-use"
              onClick={() => setIsLandingSettingsOpen(false)}
              className="hover:underline block"
            >
              Terms of Use
            </Link>
            <Link
              to="/privacy-policy"
              onClick={() => setIsLandingSettingsOpen(false)}
              className="hover:underline block"
            >
              Privacy Policy
            </Link>
            <Link
              to="/legal-notice"
              onClick={() => setIsLandingSettingsOpen(false)}
              className="hover:underline block"
            >
              Legal Notice
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Landing;
