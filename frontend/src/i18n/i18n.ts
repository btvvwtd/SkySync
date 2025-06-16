import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import de from './de.json';
import uk from './uk.json';
import fr from './fr.json';
import es from './es.json';
import ru from './ru.json';
import id from './id.json';
// import ms from './ms.json';
// import da from './da.json';
// import enGB from './en-GB.json';
// import esLA from './es-LA.json';
// import frCA from './fr-CA.json';
// import it from './it.json';
// import nl from './nl.json';
// import nb from './nb.json';
import pl from './pl.json';
// import ptBR from './pt-BR.json';
// import sv from './sv.json';
// import th from './th.json';
// import zhCN from './zh-CN.json';
// import zhTW from './zh-TW.json';
// import ja from './ja.json';
// import ko from './ko.json';

const resources = {
  en: { translation: en },
  de: { translation: de },
  uk: { translation: uk },
  fr: { translation: fr },
  es: { translation: es },
  ru: { translation: ru },
  id: { translation: id },
  // ms: { translation: ms },
  // da: { translation: da },
  // 'en-GB': { translation: enGB },
  // 'es-LA': { translation: esLA },
  // 'fr-CA': { translation: frCA },
  // it: { translation: it },
  // nl: { translation: nl },
  // nb: { translation: nb },
  pl: { translation: pl },
  // 'pt-BR': { translation: ptBR },
  // sv: { translation: sv },
  // th: { translation: th },
  // 'zh-CN': { translation: zhCN },
  // 'zh-TW': { translation: zhTW },
  // ja: { translation: ja },
  // ko: { translation: ko },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;