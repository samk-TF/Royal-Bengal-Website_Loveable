import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
          <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
          <p className="mb-2">
            We collect personal data only to the extent necessary to process your
            order. Your data will not be sold and will only be shared with
            partners who assist us in delivering our services (e.g., payment
            processors). We use cookies to improve the user experience. By using
            this website you consent to the collection and use of your data as
            described.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2">Datenschutzerklärung</h1>
          <p className="mb-2">
            Wir erheben personenbezogene Daten nur in dem Umfang, der für die
            Bearbeitung Ihrer Bestellung notwendig ist. Ihre Daten werden nicht
            verkauft und nur mit Partnern geteilt, die uns bei der Bereitstellung
            unserer Dienstleistungen unterstützen (z.&nbsp;B. Zahlungsanbieter).
            Wir verwenden Cookies, um die Benutzererfahrung zu verbessern. Durch
            die Nutzung dieser Website erklären Sie sich mit der Erhebung und
            Nutzung Ihrer Daten wie beschrieben einverstanden.
          </p>
        </>
      )}
    </div>
  );
};

export default PrivacyPolicy;