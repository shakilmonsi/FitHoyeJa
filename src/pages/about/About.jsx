import { MdDoubleArrow, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";

const ListItem = ({ title, desc, isRTL }) => {
  const Icon = isRTL ? MdKeyboardDoubleArrowLeft : MdDoubleArrow;

  return (
    <li
      className={`flex items-start gap-2 ${
        isRTL ? "flex-row text-right" : "text-left"
      }`}
    >
      <span className="mt-1">
        <Icon className="text-[var(--color-primary-400)]" />
      </span>
      <span>
        <b>{title}:</b> {desc}
      </span>
    </li>
  );
};

const SimpleItem = ({ text, isRTL }) => {
  const Icon = isRTL ? MdKeyboardDoubleArrowLeft : MdDoubleArrow;

  return (
    <li
      className={`flex items-start gap-2 ${
        isRTL ? "flex-row text-right" : "text-left"
      }`}
    >
      <span className="mt-1">
        <Icon className="text-[var(--color-primary-400)]" />
      </span>
      <span>{text}</span>
    </li>
  );
};

export default function About() {
  const { isRTL, t } = useLanguage();

  return isRTL ? (
    <div className="container mx-auto max-w-2xl px-4" dir="rtl">
      <div className="h-2"></div>

      <h1 className="mt-6 text-2xl font-bold">
        <strong>عن بوشملان</strong>
      </h1>

      <p className="my-3 text-gray-700">
        بوشملان هو أكبر موقع وتطبيق عقاري مجاني في الكويت. يعمل كمحرك بحث
        وإعلانات عقارية يسهل التواصل بين البائع والمشتري أو بين المالك والمستأجر
        عبر الموقع{" "}
        <a
          href="https://www.mr-aqar.com/ar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          www.mr-aqar.com/ar
        </a>{" "}
        أو عبر تطبيقاته في متجر آبل أو جوجل بلاي. يحتوي بوشملان على آلاف
        الإعلانات العقارية المختلفة المعروضة للبيع أو الإيجار أو المقايضة في
        أقسام متنوعة مثل الشقق، المنازل، الفلل، الأراضي، المباني، المحلات،
        المكاتب التجارية وحتى المزارع وغيرها. يمكن لبوشملان أن يصل بباحثي
        العقارات إلى خصائص غير مدرجة في المنصات التقليدية مثل الصحف أو اللوحات
        الإعلانية. في السنوات الأخيرة، اتجه غالبية ملاك العقارات والمكاتب لعرض
        ممتلكاتهم على بوشملان نظرًا لكفاءته وقدرته على الوصول لجمهور أكبر. في
        الكويت، تجاوزنا الأرقام التالية:
      </p>

      <ul className="my-3 list-disc pr-5 text-gray-700">
        <li className="mb-1">500 ألف تحميل للتطبيق</li>
        <li className="mb-1">25 ألف مستخدم مسجل</li>
        <li className="mb-1">90 ألف مستخدم نشط شهريًا</li>
        <li className="mb-1">5 آلاف إعلان جديد شهريًا</li>
        <li>3500 مكالمة يوميًا</li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">
        <strong>تاريخنا</strong>
      </h2>

      <p className="my-3 text-gray-700">
        بدأت بو شملان نشاطها في صيف 2016 مقرها الكويت. بعد زيادة عدد الزوار،
        تطور العقارات والنجاح الذي تجاوز التوقعات، بادرنا بالتوسع تحت اسم واحد
        "بوشملان" ليكون الدليل العقاري الأول في الخليج العربي. في صيف 2018،
        بدأنا في قطر وسلطنة عمان. في نفس العام، تم دمج المواقع الثلاثة تحت اسم
        واحد "بوشملان"، ليكون بداية توسعنا الدولي. ثم في أبريل 2019، افتتح
        بوشملان في الإمارات العربية المتحدة ومملكة البحرين.
      </p>

      <h2 className="mt-6 text-xl font-bold">
        <strong>هدفنا</strong>
      </h2>

      <p className="my-3 text-gray-700">
        يمثل القطاع العقاري في الكويت عنصرًا أساسيًا في اقتصاد البلاد حيث نما
        بشكل مطرد على مر السنين ومن المتوقع أن يستمر في النمو في المستقبل،
        مدفوعًا بمبادرات الحكومة ومشاريع البنية التحتية. ورغم بعض التحديات، يبدو
        مستقبل القطاع العقاري في الكويت واعدًا. يسعى بوشملان لتسهيل التواصل بين
        البائع والمشتري أو بين المالك والمستأجر، بشكل مباشر أو غير مباشر عبر
        الوكالات العقارية. لذلك نحن ملتزمون بخطة تسويقية فعالة ومستمرة وحملات
        إعلانية لجذب آلاف الزوار والملاك الراغبين في بيع أو تأجير عقاراتهم،
        ولقاء الراغبين في شراء أو استئجار هذه العقارات. صمم بوشملان بطريقة بسيطة
        وعملية لمساعدة الملاك أو السماسرة في الإعلان مجانًا وبسهولة. يمكنهم
        أيضًا عرض إعلاناتهم مزودة بالصور و/أو مقاطع الفيديو، بالإضافة إلى جميع
        التفاصيل الأخرى التي تسهل على المشتري أو المستأجر اتخاذ القرار المناسب.
      </p>

      <p className="my-3 text-gray-700">
        كما نسعى لتعزيز موقعنا الأول كأكبر منصة تسويقية عقارية في الكويت، وتحسين
        تجربة زوارنا من خلال استخدامنا لأكثر لغات وتقنيات البرمجة تقدمًا
        وفعالية، وتقديم مستوى عالٍ من الدعم والحلول الفعالة التي تلبي احتياجاتهم
        ومتطلباتهم بما يتوافق مع متغيرات وتطورات السوق العقاري في الكويت.
      </p>

      <div className="h-8"></div>
    </div>
  ) : (
    <div className="container mx-auto max-w-2xl px-4">
      <div className="h-2"></div>

      <h1 className="mt-6 text-2xl font-bold">
        <strong>About Mr. Real Estate</strong>
      </h1>

      <p className="my-3 text-gray-700">
        Mr. Real Estate is the largest free real estate website and application
        in Kuwait. It is a real estate search and advertising engine that
        facilitates the meeting of the seller with the buyer or the landlord
        with the tenant through the website{" "}
        <a
          href="https://www.mr-aqar.com/en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          www.mr-aqar.com/en
        </a>{" "}
        or its applications in the Apple Store or Google Play. Mr. Real Estate
        contains thousands of different real estate ads displayed for the
        purpose of sale, rent or exchange in different sections such as
        apartments, houses, villas, lands, buildings, shops, commercial offices
        and even farms, etc. Mr. Real Estate enables real estate seekers to
        access properties not listed on traditional platforms such as newspapers
        or billboards. In recent years, the majority of real estate and office
        owners have turned to displaying their properties on Mr. Real Estate for
        its efficiency and ability to reach a larger audience. In Kuwait, We
        have exceeded the following numbers:
      </p>

      <ul className="my-3 list-disc pl-5 text-gray-700">
        <li className="mb-1">500k downloads of the application</li>
        <li className="mb-1">25k registered users</li>
        <li className="mb-1">90k active monthly users</li>
        <li className="mb-1">5k new ads per month</li>
        <li>3500 calls per day</li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">
        <strong>Our History</strong>
      </h2>

      <p className="my-3 text-gray-700">
        Bo Shamlan started its activities in the summer of 2016 based in Kuwait.
        After the increase in the number of visitors, Properties developments
        and success that exceeded expectations, we took the initiative to expand
        under one name "Mr. Real Estate" to be the first real estate guide in
        the Arabian Gulf. In the summer of 2018, we started in Qatar and
        Sultanate of Oman. In the same year, the three sites were merged under
        one name "Mr. Real Estate", to be the beginning of our international
        expansion. Then in April 2019, Mr. Real Estate opened in United Arab
        Emirates and Kingdom of Bahrain.
      </p>

      <h2 className="mt-6 text-xl font-bold">
        <strong>Our Goal</strong>
      </h2>

      <p className="my-3 text-gray-700">
        The real estate sector in Kuwait is an essential component of the
        country's economy which has grown steadily over the years and is
        expected to continue to grow in the future, driven by government
        initiatives and infrastructure projects. Despite some challenges, the
        future of the real estate sector in Kuwait looks promising. Mr. Real
        Estate seeks to facilitate the meeting of the seller with the buyer or
        the owner with the tenant, directly or indirectly, through real estate
        agencies. Therefore, we are committed to an effective and continuous
        marketing plan and advertising campaigns to attract thousands of
        visitors and owners wishing to sell or rent their real estate, and to
        meet with those wishing to buy or rent these real estate. Mr. Real
        Estate has been designed in a simple and practical way to help owners or
        brokers advertise for free and with ease. They can also display their
        ads attached with pictures and/or videos, as well as all other details
        that make it easier for the buyer or tenant to make the appropriate
        decision.
      </p>

      <p className="my-3 text-gray-700">
        We also seek to enhance our first position as the largest real estate
        marketing platform in Kuwait, and to improve the experience of our
        visitors through our use of the most advanced and effective programming
        languages and technologies, and to provide a high level of support and
        effective solutions that meet their needs and requirements in line with
        the variables and developments of the real estate market in Kuwait.
      </p>

      <div className="h-8"></div>
    </div>
  );
}
