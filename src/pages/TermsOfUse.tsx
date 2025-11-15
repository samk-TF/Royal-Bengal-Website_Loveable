import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfUse = () => {
  const [language] = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {language === "en" ? "Back" : "Zurück"}
      </button>
      {language === "en" ? (
        <>
          <h1 className="text-2xl font-bold mb-2">Terms of Use</h1>
          <p className="mb-2">
            Use of this website constitutes acceptance of these terms. The
            website is provided as-is without warranty. We are not liable for the
            accuracy or completeness of information provided. External links are
            included for convenience; we do not assume responsibility for their
            content. Misuse of this site may result in denial of access.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2">Nutzungsbedingungen</h1>
          <p className="mb-2">
            Die Nutzung dieser Website setzt die Akzeptanz dieser Bedingungen
            voraus. Die Website wird ohne Gewähr bereitgestellt. Wir übernehmen
            keine Haftung für die Richtigkeit oder Vollständigkeit der Angaben.
            Externe Links dienen der Bequemlichkeit; wir übernehmen keine
            Verantwortung für deren Inhalte. Missbrauch der Website kann zum
            Ausschluss führen.
          </p>
        </>
      )}
    </div>
  );
};

export default TermsOfUse;