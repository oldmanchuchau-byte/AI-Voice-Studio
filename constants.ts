
import { Voice } from './types';

export const VOICES_BY_LANGUAGE: Record<string, { male: Voice[], female: Voice[] }> = {
  vi: {
    female: [
      { id: 'vi-female-1', apiId: 'Kore', name: 'Mai Linh (Miền Bắc)', description: 'Giọng nữ miền Bắc, ấm áp, truyền cảm.' },
      { id: 'vi-female-2', apiId: 'Zephyr', name: 'Thảo Vy (Miền Nam)', description: 'Giọng nữ miền Nam, trẻ trung, trong trẻo.' },
      // New Voices
      { id: 'vi-female-3', apiId: 'Kore', name: 'Nữ Tướng Trưng Vương', description: 'Giọng nữ hào hùng, uy nghiêm, hiệu triệu ba quân.' },
      { id: 'vi-female-4', apiId: 'Zephyr', name: 'Mẫu Nghi Thiên Hạ', description: 'Giọng hiền hậu, bao dung, đầy quyền uy của bậc mẫu nghi.' },
      { id: 'vi-female-5', apiId: 'Zephyr', name: 'Tiên Nữ Giáng Trần', description: 'Giọng trong trẻo, bay bổng, thoát tục tựa sương khói.' },
      { id: 'vi-female-6', apiId: 'Kore', name: 'Nữ Sĩ Cung Đình', description: 'Giọng thanh tao, văn vẻ, thích hợp ngâm thơ cổ.' },
      { id: 'vi-female-7', apiId: 'Zephyr', name: 'Cô Tấm (Kể chuyện)', description: 'Giọng ngọt ngào, dịu dàng, kể chuyện cổ tích.' },
      { id: 'vi-female-8', apiId: 'Kore', name: 'Bà Kể Chuyện Xưa', description: 'Giọng trầm ổn, chậm rãi, hoài niệm về quá khứ.' },
      { id: 'vi-female-9', apiId: 'Zephyr', name: 'Công Chúa Kiêu Sa', description: 'Giọng đài các, sang trọng, mang nét kiêu kỳ quý tộc.' },
      { id: 'vi-female-10', apiId: 'Kore', name: 'Thôn Nữ Dân Dã', description: 'Giọng mộc mạc, chân chất, vui tươi nơi thôn dã.' },
      { id: 'vi-female-11', apiId: 'Zephyr', name: 'Ca Nương Phố Cổ', description: 'Giọng luyến láy, nghệ thuật, đậm chất ca trù thăng long.' },
      { id: 'vi-female-12', apiId: 'Kore', name: 'Nữ Hiệp Giang Hồ', description: 'Giọng lạnh lùng, dứt khoát, bí ẩn và sắc bén.' }
    ],
    male: [
      { id: 'vi-male-1', apiId: 'Puck', name: 'Minh Quang (Miền Bắc)', description: 'Giọng nam miền Bắc, rõ ràng, dứt khoát.' },
      { id: 'vi-male-2', apiId: 'Charon', name: 'Hoàng Dũng (Miền Nam)', description: 'Giọng nam miền Nam, trầm ấm, đáng tin cậy.' },
      { id: 'vi-male-3', apiId: 'Fenrir', name: 'Bảo Long (Miền Bắc)', description: 'Giọng nam miền Bắc, trung tính, tự nhiên.' },
      // New Voices
      { id: 'vi-male-4', apiId: 'Charon', name: 'Lão Tướng Bạch Đằng', description: 'Giọng già dặn, uy nghiêm, dày dạn sương gió chiến trường.' },
      { id: 'vi-male-5', apiId: 'Fenrir', name: 'Hào Kiệt Lam Sơn', description: 'Giọng tráng sĩ, hào hùng, vang vọng như tiếng trống trận.' },
      { id: 'vi-male-6', apiId: 'Charon', name: 'Quân Vương Thăng Long', description: 'Giọng quyền lực, đanh thép, ra chiếu chỉ thiên hạ.' },
      { id: 'vi-male-7', apiId: 'Fenrir', name: 'Sử Gia Đại Việt', description: 'Giọng trầm mặc, sâu lắng, kể chuyện ngàn năm văn hiến.' },
      { id: 'vi-male-8', apiId: 'Puck', name: 'Tiểu Tướng Tiên Phong', description: 'Giọng trẻ trung, nhiệt huyết, xông pha trận mạc.' },
      { id: 'vi-male-9', apiId: 'Fenrir', name: 'Đạo Sĩ Ẩn Danh', description: 'Giọng hư ảo, thoát tục, bí ẩn nơi thâm sơn cùng cốc.' },
      { id: 'vi-male-10', apiId: 'Puck', name: 'Thuyết Khách Mưu Sĩ', description: 'Giọng lanh lợi, thuyết phục, sắc sảo như Khổng Minh.' },
      { id: 'vi-male-11', apiId: 'Charon', name: 'Võ Tướng Hét Ra Lửa', description: 'Giọng ồm ồm, mạnh mẽ, áp đảo kẻ thù.' },
      { id: 'vi-male-12', apiId: 'Puck', name: 'Thư Sinh Nho Nhã', description: 'Giọng nhẹ nhàng, văn vẻ, ngâm vịnh thơ phú.' },
      { id: 'vi-male-13', apiId: 'Charon', name: 'Ngư Tiều Canh Mục', description: 'Giọng mộc mạc, từng trải của người ẩn dật chốn quê.' }
    ]
  },
  en: {
    female: [
      { id: 'en-female-1', apiId: 'Kore', name: 'Kore', description: 'A standard, clear female voice.' },
      { id: 'en-female-2', apiId: 'Zephyr', name: 'Zephyr', description: 'A warm and friendly female voice.' },
    ],
    male: [
      { id: 'en-male-1', apiId: 'Puck', name: 'Puck', description: 'A youthful and energetic male voice.' },
      { id: 'en-male-2', apiId: 'Charon', name: 'Charon', description: 'A deep and authoritative male voice.' },
      { id: 'en-male-3', apiId: 'Fenrir', name: 'Fenrir', description: 'A mature and calm male voice.' },
    ]
  },
  zh: {
    female: [
      { id: 'zh-female-1', apiId: 'Kore', name: '小美 (Xiǎo Měi)', description: '标准女声，清晰甜美。' },
      { id: 'zh-female-2', apiId: 'Zephyr', name: '静怡 (Jìng Yí)', description: '温柔亲切的女声。' },
    ],
    male: [
      { id: 'zh-male-1', apiId: 'Puck', name: '浩然 (Hàorán)', description: '年轻活力的男声。' },
      { id: 'zh-male-2', apiId: 'Charon', name: '文博 (Wénbó)', description: '深沉稳重的男声。' },
    ]
  },
  es: {
    female: [
      { id: 'es-female-1', apiId: 'Kore', name: 'Sofía', description: 'Voz femenina estándar y clara.' },
      { id: 'es-female-2', apiId: 'Zephyr', name: 'Isabella', description: 'Voz femenina cálida y amigable.' },
      { id: 'es-female-3', apiId: 'Zephyr', name: 'Valentina', description: 'Voz femenina expresiva y moderna.' }
    ],
    male: [
      { id: 'es-male-1', apiId: 'Puck', name: 'Mateo', description: 'Voz masculina joven y enérgica.' },
      { id: 'es-male-2', apiId: 'Charon', name: 'Alejandro', description: 'Voz masculina profunda y autoritaria.' },
      { id: 'es-male-3', apiId: 'Fenrir', name: 'Diego', description: 'Voz masculina madura y tranquila.' },
      { id: 'es-male-4', apiId: 'Fenrir', name: 'Rodrigo', description: 'Voz masculina resonante y envolvente.' }
    ]
  },
  fr: {
    female: [{ id: 'fr-female-1', apiId: 'Kore', name: 'Chloé', description: 'Voix féminine standard et claire.' }],
    male: [{ id: 'fr-male-1', apiId: 'Puck', name: 'Lucas', description: 'Voix masculine jeune et énergique.' }]
  },
  de: {
    female: [{ id: 'de-female-1', apiId: 'Kore', name: 'Hanna', description: 'Standardmäßige, klare weibliche Stimme.' }],
    male: [{ id: 'de-male-1', apiId: 'Puck', name: 'Lukas', description: 'Junge und energische männliche Stimme.' }]
  },
  it: {
    female: [{ id: 'it-female-1', apiId: 'Kore', name: 'Sofia', description: 'Voce femminile standard e chiara.' }],
    male: [{ id: 'it-male-1', apiId: 'Puck', name: 'Leonardo', description: 'Voce maschile giovane ed energica.' }]
  },
  pt: {
    female: [{ id: 'pt-female-1', apiId: 'Kore', name: 'Alice', description: 'Voz feminina padrão e clara.' }],
    male: [{ id: 'pt-male-1', apiId: 'Puck', name: 'Miguel', description: 'Voz masculina jovem e energética.' }]
  },
  ru: {
    female: [{ id: 'ru-female-1', apiId: 'Kore', name: 'София (Sofia)', description: 'Стандартный, чистый женский голос.' }],
    male: [{ id: 'ru-male-1', apiId: 'Puck', name: 'Артём (Artyom)', description: 'Молодой и энергичный мужской голос.' }]
  },
  ja: {
    female: [{ id: 'ja-female-1', apiId: 'Kore', name: 'さくら (Sakura)', description: '標準的でクリアな女性の声。' }],
    male: [{ id: 'ja-male-1', apiId: 'Puck', name: 'ひろと (Hiroto)', description: '若々しくエネルギッシュな男性の声。' }]
  },
  ko: {
    female: [{ id: 'ko-female-1', apiId: 'Kore', name: '서아 (Seo-ah)', description: '표준적이고 선명한 여성 목소리.' }],
    male: [{ id: 'ko-male-1', apiId: 'Puck', name: '도윤 (Do-yun)', description: '젊고 활기찬 남성 목소리.' }]
  },
  ar: {
    female: [{ id: 'ar-female-1', apiId: 'Kore', name: 'فاطمة (Fatima)', description: 'صوت أنثوي قياسي وواضح.' }],
    male: [{ id: 'ar-male-1', apiId: 'Puck', name: 'محمد (Mohammed)', description: 'صوت ذكوري شاب وحيوي.' }]
  },
  hi: {
    female: [{ id: 'hi-female-1', apiId: 'Kore', name: 'साची (Sachi)', description: 'एक मानक, स्पष्ट महिला आवाज।' }],
    male: [{ id: 'hi-male-1', apiId: 'Puck', name: 'आरव (Aarav)', description: 'एक युवा और ऊर्जावान पुरुष आवाज।' }]
  },
  bn: {
    female: [{ id: 'bn-female-1', apiId: 'Kore', name: 'অনন্যা (Ananya)', description: 'একটি আদর্শ, স্পষ্ট মহিলা কণ্ঠস্বর।' }],
    male: [{ id: 'bn-male-1', apiId: 'Puck', name: 'আয়ান (Ayan)', description: 'একটি তরুণ এবং শক্তিশালী পুরুষ কণ্ঠস্বর।' }]
  },
  id: {
    female: [{ id: 'id-female-1', apiId: 'Kore', name: 'Adira', description: 'Suara wanita standar dan jelas.' }],
    male: [{ id: 'id-male-1', apiId: 'Puck', name: 'Bagas', description: 'Suara pria muda dan energik.' }]
  },
  tr: {
    female: [{ id: 'tr-female-1', apiId: 'Kore', name: 'Zeynep', description: 'Standart, net bir kadın sesi.' }],
    male: [{ id: 'tr-male-1', apiId: 'Puck', name: 'Yusuf', description: 'Genç ve enerjik bir erkek sesi.' }]
  },
  nl: {
    female: [{ id: 'nl-female-1', apiId: 'Kore', name: 'Emma', description: 'Een standaard, duidelijke vrouwenstem.' }],
    male: [{ id: 'nl-male-1', apiId: 'Puck', name: 'Noah', description: 'Een jeugdige en energieke mannenstem.' }]
  },
  pl: {
    female: [{ id: 'pl-female-1', apiId: 'Kore', name: 'Zuzanna', description: 'Standardowy, czysty głos kobiecy.' }],
    male: [{ id: 'pl-male-1', apiId: 'Puck', name: 'Antoni', description: 'Młody i energiczny głos męski.' }]
  },
  sv: {
    female: [{ id: 'sv-female-1', apiId: 'Kore', name: 'Alice', description: 'En standard, tydlig kvinnoröst.' }],
    male: [{ id: 'sv-male-1', apiId: 'Puck', name: 'William', description: 'En ungdomlig och energisk mansröst.' }]
  },
  no: {
    female: [{ id: 'no-female-1', apiId: 'Kore', name: 'Nora', description: 'En standard, klar kvinnestemme.' }],
    male: [{ id: 'no-male-1', apiId: 'Puck', name: 'Jakob', description: 'En ungdommelig og energisk mannsstemme.' }]
  },
  da: {
    female: [{ id: 'da-female-1', apiId: 'Kore', name: 'Ida', description: 'En standard, klar kvindestemme.' }],
    male: [{ id: 'da-male-1', apiId: 'Puck', name: 'William', description: 'En ungdommelig og energisk mandsstemme.' }]
  },
  fi: {
    female: [{ id: 'fi-female-1', apiId: 'Kore', name: 'Aino', description: 'Tavallinen, selkeä naisääni.' }],
    male: [{ id: 'fi-male-1', apiId: 'Puck', name: 'Leo', description: 'Nuorekas ja energinen miesääni.' }]
  },
  el: {
    female: [{ id: 'el-female-1', apiId: 'Kore', name: 'Μαρία (Maria)', description: 'Μια τυπική, καθαρή γυναικεία φωνή.' }],
    male: [{ id: 'el-male-1', apiId: 'Puck', name: 'Γιώργος (Giorgos)', description: 'Μια νεανική και ενεργητική ανδρική φωνή.' }]
  },
  cs: {
    female: [{ id: 'cs-female-1', apiId: 'Kore', name: 'Eliška', description: 'Standardní, čistý ženský hlas.' }],
    male: [{ id: 'cs-male-1', apiId: 'Puck', name: 'Jakub', description: 'Mladý a energický mužský hlas.' }]
  },
  hu: {
    female: [{ id: 'hu-female-1', apiId: 'Kore', name: 'Hanna', description: 'Standard, tiszta női hang.' }],
    male: [{ id: 'hu-male-1', apiId: 'Puck', name: 'Bence', description: 'Fiatalos és energikus férfihang.' }]
  },
  ro: {
    female: [{ id: 'ro-female-1', apiId: 'Kore', name: 'Maria', description: 'O voce feminină standard, clară.' }],
    male: [{ id: 'ro-male-1', apiId: 'Puck', name: 'Andrei', description: 'O voce masculină tânără și energică.' }]
  },
  th: {
    female: [{ id: 'th-female-1', apiId: 'Kore', name: 'มะลิ (Mali)', description: 'เสียงผู้หญิงมาตรฐานและชัดเจน' }],
    male: [{ id: 'th-male-1', apiId: 'Puck', name: 'อาร์ม (Arm)', description: 'เสียงผู้ชายที่อ่อนเยาว์และกระฉับกระเฉง' }]
  },
  he: {
    female: [{ id: 'he-female-1', apiId: 'Kore', name: 'תמר (Tamar)', description: 'קול נשי סטנדרטי וברור.' }],
    male: [{ id: 'he-male-1', apiId: 'Puck', name: 'דניאל (Daniel)', description: 'קול גברי צעיר ואנרגטי.' }]
  },
  uk: {
    female: [{ id: 'uk-female-1', apiId: 'Kore', name: 'Софія (Sofiia)', description: 'Стандартний, чистий жіночий голос.' }],
    male: [{ id: 'uk-male-1', apiId: 'Puck', name: 'Артем (Artem)', description: 'Молодий та енергійний чоловічий голос.' }]
  },
  ms: {
    female: [{ id: 'ms-female-1', apiId: 'Kore', name: 'Aisyah', description: 'Suara wanita yang standard dan jelas.' }],
    male: [{ id: 'ms-male-1', apiId: 'Puck', name: 'Adam', description: 'Suara lelaki yang muda dan bertenaga.' }]
  },
  fa: {
    female: [{ id: 'fa-female-1', apiId: 'Kore', name: 'فاطمه (Fatemeh)', description: 'صدای زنانه استاندارد و واضح.' }],
    male: [{ id: 'fa-male-1', apiId: 'Puck', name: 'امیرعلی (Amir Ali)', description: 'صدای مردانه جوان و پرانرژی.' }]
  },
  fil: {
    female: [{ id: 'fil-female-1', apiId: 'Kore', name: 'Althea', description: 'Isang standard at malinaw na boses ng babae.' }],
    male: [{ id: 'fil-male-1', apiId: 'Puck', name: 'Nathaniel', description: 'Isang bata at masiglang boses ng lalaki.' }]
  },
  af: {
    female: [{ id: 'af-female-1', apiId: 'Kore', name: 'Mia', description: "'n Standaard, duidelike vroulike stem." }],
    male: [{ id: 'af-male-1', apiId: 'Puck', name: 'Liam', description: "'n Jeugdige en energieke manlike stem." }]
  },
  bg: {
    female: [{ id: 'bg-female-1', apiId: 'Kore', name: 'Виктория (Viktoria)', description: 'Стандартен, ясен женски глас.' }],
    male: [{ id: 'bg-male-1', apiId: 'Puck', name: 'Александър (Aleksandar)', description: 'Младежки и енергичен мъжки глас.' }]
  },
  ca: {
    female: [{ id: 'ca-female-1', apiId: 'Kore', name: 'Júlia', description: 'Veu femenina estàndard i clara.' }],
    male: [{ id: 'ca-male-1', apiId: 'Puck', name: 'Marc', description: 'Veu masculina jove i energètica.' }]
  },
  hr: {
    female: [{ id: 'hr-female-1', apiId: 'Kore', name: 'Mia', description: 'Standardni, jasan ženski glas.' }],
    male: [{ id: 'hr-male-1', apiId: 'Puck', name: 'Luka', description: 'Mladenački i energičan muški glas.' }]
  },
  et: {
    female: [{ id: 'et-female-1', apiId: 'Kore', name: 'Mia', description: 'Standardne, selge naise hääl.' }],
    male: [{ id: 'et-male-1', apiId: 'Puck', name: 'Robin', description: 'Nooruslik ja energiline mehe hääl.' }]
  },
  gl: {
    female: [{ id: 'gl-female-1', apiId: 'Kore', name: 'Sofía', description: 'Unha voz feminina estándar e clara.' }],
    male: [{ id: 'gl-male-1', apiId: 'Puck', name: 'Mateo', description: 'Unha voz masculina xuvenil e enérxica.' }]
  },
  is: {
    female: [{ id: 'is-female-1', apiId: 'Kore', name: 'Embla', description: 'Stöðluð, skýr kvenrödd.' }],
    male: [{ id: 'is-male-1', apiId: 'Puck', name: 'Aron', description: 'Ungleg og kraftmikil karlmannsrödd.' }]
  },
  lt: {
    female: [{ id: 'lt-female-1', apiId: 'Kore', name: 'Emilija', description: 'Standartinis, aiškus moteriškas balsas.' }],
    male: [{ id: 'lt-male-1', apiId: 'Puck', name: 'Lukas', description: 'Jaunatviškas ir energingas vyriškas balsas.' }]
  },
  lv: {
    female: [{ id: 'lv-female-1', apiId: 'Kore', name: 'Sofija', description: 'Standarta, skaidra sieviešu balss.' }],
    male: [{ id: 'lv-male-1', apiId: 'Puck', name: 'Roberts', description: 'Jaunīga un enerģiska vīriešu balss.' }]
  },
  mk: {
    female: [{ id: 'mk-female-1', apiId: 'Kore', name: 'Јана (Jana)', description: 'Стандарден, јасен женски глас.' }],
    male: [{ id: 'mk-male-1', apiId: 'Puck', name: 'Лука (Luka)', description: 'Младешки и енергичен машки глас.' }]
  },
  sk: {
    female: [{ id: 'sk-female-1', apiId: 'Kore', name: 'Sofia', description: 'Štandardný, čistý ženský hlas.' }],
    male: [{ id: 'sk-male-1', apiId: 'Puck', name: 'Jakub', description: 'Mladý a energický mužský hlas.' }]
  },
  sl: {
    female: [{ id: 'sl-female-1', apiId: 'Kore', name: 'Ema', description: 'Standarden, jasen ženski glas.' }],
    male: [{ id: 'sl-male-1', apiId: 'Puck', name: 'Luka', description: 'Mladosten in energičen moški glas.' }]
  },
  sr: {
    female: [{ id: 'sr-female-1', apiId: 'Kore', name: 'Софија (Sofija)', description: 'Стандардан, јасан женски глас.' }],
    male: [{ id: 'sr-male-1', apiId: 'Puck', name: 'Лука (Luka)', description: 'Младалачки и енергичан мушки глас.' }]
  },
  sw: {
    female: [{ id: 'sw-female-1', apiId: 'Kore', name: 'Asha', description: 'Sauti ya kawaida na wazi ya kike.' }],
    male: [{ id: 'sw-male-1', apiId: 'Puck', name: 'Juma', description: 'Sauti ya kiume ya ujana na nguvu.' }]
  },
  ur: {
    female: [{ id: 'ur-female-1', apiId: 'Kore', name: 'فاطمہ (Fatima)', description: 'ایک معیاری، واضح زنانہ آواز۔' }],
    male: [{ id: 'ur-male-1', apiId: 'Puck', name: 'علی (Ali)', description: 'ایک جوان اور توانا مردانہ آواز۔' }]
  },
  gu: {
    female: [{ id: 'gu-female-1', apiId: 'Kore', name: 'આરાધ્યા (Aaradhya)', description: 'એક પ્રમાણભૂત, સ્પષ્ટ સ્ત્રી અવાજ.' }],
    male: [{ id: 'gu-male-1', apiId: 'Puck', name: 'આરવ (Aarav)', description: 'એક યુવાન અને મહેનતુ પુરુષ અવાજ.' }]
  },
  kn: {
    female: [{ id: 'kn-female-1', apiId: 'Kore', name: 'ಸಾನ್ವಿ (Saanvi)', description: 'ಒಂದು ಗುಣಮಟ್ಟದ, ಸ್ಪಷ್ಟವಾದ ಸ್ತ್ರೀ ಧ್ವನಿ.' }],
    male: [{ id: 'kn-male-1', apiId: 'Puck', name: 'ಆರವ್ (Aarav)', description: 'ಒಂದು ಯುವ ಮತ್ತು ಶಕ್ತಿಯುತ ಪುರುಷ ಧ್ವನಿ.' }]
  },
  ml: {
    female: [{ id: 'ml-female-1', apiId: 'Kore', name: 'ഇഷ (Isha)', description: 'ഒരു സാധാരണ, വ്യക്തമായ സ്ത്രീ ശബ്ദം.' }],
    male: [{ id: 'ml-male-1', apiId: 'Puck', name: 'ആരവ് (Aarav)', description: 'ചെറുപ്പവും ഊർജ്ജസ്വലവുമായ പുരുഷ ശബ്ദം.' }]
  },
  mr: {
    female: [{ id: 'mr-female-1', apiId: 'Kore', name: 'सान्वी (Saanvi)', description: 'एक मानक, स्पष्ट स्त्री आवाज.' }],
    male: [{ id: 'mr-male-1', apiId: 'Puck', name: 'आरव (Aarav)', description: 'एक तरुण आणि उत्साही पुरुष आवाज.' }]
  },
  ta: {
    female: [{ id: 'ta-female-1', apiId: 'Kore', name: 'இனியா (Iniya)', description: 'ஒரு நிலையான, தெளிவான பெண் குரல்.' }],
    male: [{ id: 'ta-male-1', apiId: 'Puck', name: 'ஆரவ் (Aarav)', description: 'ஒரு இளமையான மற்றும் ஆற்றல்மிக்க ஆண் குரல்.' }]
  },
  te: {
    female: [{ id: 'te-female-1', apiId: 'Kore', name: 'సాన్వి (Saanvi)', description: 'ఒక ప్రామాణిక, స్పష్టమైన మహిళా స్వరం.' }],
    male: [{ id: 'te-male-1', apiId: 'Puck', name: 'ఆరవ్ (Aarav)', description: 'ఒక యువ మరియు శక్తివంతమైన పురుష స్వరం.' }]
  },
  jv: {
    female: [{ id: 'jv-female-1', apiId: 'Kore', name: 'Sari', description: 'Swara wadon standar lan cetha.' }],
    male: [{ id: 'jv-male-1', apiId: 'Puck', name: 'Budi', description: 'Swara lanang enom lan energik.' }]
  }
};

export const BANNED_WORDS = ["example_banned_word", "profanity"];
export const TOKEN_PER_CHAR = 1;
export const PRICE_PER_1K_TOKENS = 0.000015; // Example pricing
