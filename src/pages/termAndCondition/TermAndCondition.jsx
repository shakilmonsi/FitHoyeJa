import { useLanguage } from "../../context/LanguageContext";

const TermAndCondition = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto mt-10 mb-10 max-w-3xl px-4"
    >
      <section className="container mx-auto max-w-7xl space-y-8">
        {Object.entries(t.termsAndConditions.sections).map(([key, section]) => (
          <div key={key} className="space-y-4">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            {section.paragraphs.map((para, i) => (
              // Use dangerouslySetInnerHTML to render HTML content from your JSON
              <p key={i} dangerouslySetInnerHTML={{ __html: para }}></p>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
};

export default TermAndCondition;
