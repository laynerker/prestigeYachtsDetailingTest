import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  // This typically comes from the route params in App Router [locale]
  // Ideally we should match the locale requested
  
  if (!locale || !['en', 'es'].includes(locale as string)) {
    locale = 'en';
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
