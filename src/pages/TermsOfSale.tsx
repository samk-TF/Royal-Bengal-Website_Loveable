import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfSale = () => {
  const [language] = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {/* Back button to return to previous page */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {language === "en" ? "Back" : "Zurück"}
      </button>
      {language === "en" ? (
        <>
          <h1 className="text-2xl font-bold mb-2">Terms of Sale</h1>
          <p className="mb-2">
            All prices include statutory VAT and may change. Dishes may contain
            allergens; please consult our staff before ordering. Payment is due
            immediately upon ordering. Returns or exchanges are not possible once
            preparation has started. We reserve the right to modify menu items
            and prices without notice.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2">Verkaufsbedingungen</h1>
          <p className="mb-2">
            Alle Preise verstehen sich inklusive gesetzlicher Mehrwertsteuer und
            können sich ändern. Gerichte können Allergene enthalten; bitte
            informieren Sie sich vor der Bestellung bei unserem Personal. Die
            Zahlung ist unmittelbar nach Bestellung fällig. Rücknahme oder
            Umtausch sind nach Beginn der Zubereitung ausgeschlossen. Wir
            behalten uns das Recht vor, Speisen und Preise ohne Vorankündigung zu
            ändern.
          </p>
        </>
      )}
    </div>
  );
};

export default TermsOfSale;