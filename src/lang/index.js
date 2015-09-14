import * as languages from './languages.js';

function encodeText(text, ...param) {
  param.forEach((value, key) => {
    text = text.replace(new RegExp('\\$' + (key + 1), 'g'), value);
  });
  return text;
}

export const translate = (lang = 'en') => {
  const translations = languages[lang];
  return (key, ...param) => encodeText(translations[key], param);
};

export default translate;
