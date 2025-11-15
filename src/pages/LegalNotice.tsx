import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LegalNotice = () => {
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
          <h1 className="text-2xl font-bold mb-2">Legal Notice</h1>
          <p className="mb-2">
            Royal&nbsp;Bengal<br />
            Example Street&nbsp;1, 20095&nbsp;Hamburg<br />
            Telephone: +49&nbsp;40&nbsp;12345678<br />
            Email: info@royalbengal.de<br />
            Represented by: Samk&nbsp;TF<br />
            VAT&nbsp;ID: DE123456789
          </p>
          <p className="mb-2">
            Responsible for content according to §&nbsp;55&nbsp;RStV: Samk&nbsp;TF, address as above.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2">Impressum</h1>
          <p className="mb-2">
            Royal&nbsp;Bengal<br />
            Musterstraße&nbsp;1, 20095&nbsp;Hamburg<br />
            Telefon: +49&nbsp;40&nbsp;12345678<br />
            E‑Mail: info@royalbengal.de<br />
            Vertreten durch: Samk&nbsp;TF<br />
            Umsatzsteuer‑ID: DE123456789
          </p>
          <p className="mb-2">
            Verantwortlich für den Inhalt nach §&nbsp;55&nbsp;RStV: Samk&nbsp;TF, Anschrift wie oben.
          </p>
        </>
      )}
    </div>
  );
};

export default LegalNotice;