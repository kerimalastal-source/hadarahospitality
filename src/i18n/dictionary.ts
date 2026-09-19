export interface FaqItem {
  q: string;
  a: string;
}

export interface Dictionary {
  common: {
    announcement: { location: string; tagline: string };
    nav: {
      products: string;
      approach: string;
      process: string;
      about: string;
      blog: string;
      contact: string;
      search: string;
      requestQuote: string;
      openMenu: string;
      closeMenu: string;
    };
    footer: {
      tagline: string;
      explore: string;
      getInTouch: string;
      contactUs: string;
      requestQuote: string;
      emailTeam: string;
      location: string;
      copyright: string;
      privacyPolicy: string;
      backToTop: string;
    };
    whatsappLabel: string;
    searchLabel: string;
    readArticle: string;
    requestTailoredQuote: string;
    home: string;
    categoryLabels: Record<string, string>;
  };
  home: {
    title: string;
    description: string;
    hero: { eyebrow: string; heading1: string; heading2: string; lead: string; explore: string; requestQuote: string };
    openingBanner: { eyebrow: string; heading1: string; heading2: string; cta: string };
    catalogs: { eyebrow: string; heading1: string; heading2: string; body: string; productCatalog: string; techSpecs: string };
    intro: { eyebrow: string; heading1: string; heading2: string; body: string; moreAboutUs: string };
    collections: {
      eyebrow: string;
      heading1: string;
      heading2: string;
      body: string;
      viewAll: string;
      bedLinenSmall: string;
      bedLinenBig: string;
      towelsSmall: string;
      towelsBig: string;
      robesSmall: string;
      robesBig: string;
      tags: { bedLinen: string; towels: string; robes: string; slippers: string; pillows: string; protectors: string; amenities: string };
    };
    featured: { eyebrow: string; heading1: string; heading2: string; body: string; more: string };
    approach: {
      eyebrow: string;
      heading1: string;
      heading2: string;
      body: string;
      cta: string;
      items: { title: string; body: string }[];
    };
    process: { eyebrow: string; heading1: string; heading2: string; body: string; steps: { title: string; body: string }[] };
    cta: { eyebrow: string; heading1: string; heading2: string };
  };
  about: {
    title: string;
    description: string;
    hero: { eyebrow: string; headingLead: string; headingEmphasis: string };
    intro: { eyebrow: string; heading1: string; heading2: string; paragraphs: string[] };
    partnerships: { eyebrow: string; heading1: string; heading2: string; paragraphs: string[] };
    outro: { eyebrow: string; heading1: string; heading2: string; paragraph: string; cta: string };
  };
  productsPage: {
    title: string;
    description: string;
    hero: { eyebrow: string; heading1: string; heading2: string; body: string };
    categoryBodies: Record<string, string>;
    cta: string;
    sourcingHeading1: string;
    sourcingHeading2: string;
    tailoredQuote: string;
    selection: {
      addLabel: string;
      selectedCount: string;
      clear: string;
      requestQuote: string;
    };
  };
  productDetail: {
    overview: string;
    builtFor1: string;
    builtFor2: string;
    material: string;
    category: string;
    suitableFor: string;
    customization: string;
    moq: string;
    leadTime: string;
    moqNote: string;
    requestQuoteFor: string;
    specifications: string;
    technicalDetails1: string;
    technicalDetails2: string;
    productionSupply: string;
    productionSupplyBody: string;
    downloadSheet: string;
    youMayAlsoLike: string;
    moreFrom: string;
    completeTheRoom: string;
    lookingFor1: string;
    lookingFor2: string;
  };
  blogPage: { title: string; description: string; hero: { eyebrow: string; heading1: string; heading2: string; body: string }; questionHeading1: string; questionHeading2: string };
  articleDetail: { by: string; youMayAlsoLike: string; moreFrom: string; readyToTalk1: string; readyToTalk2: string };
  getAQuote: {
    title: string;
    description: string;
    hero: { eyebrow: string; heading1: string; heading2: string; body: string };
    trust: string[];
    form: {
      eyebrow: string;
      heading1: string;
      heading2: string;
      body: string;
      title: string;
      selectedProductLabel: string;
      removeProduct: string;

      section1: string;
      fullName: string;
      workEmail: string;
      phone: string;
      companyName: string;
      propertyType: string;
      propertyTypePlaceholder: string;
      propertyTypeOptions: string[];
      hotelCategory: string;
      hotelCategoryPlaceholder: string;
      hotelCategoryOptions: string[];
      rooms: string;
      roomsHelp: string;
      country: string;
      countryPlaceholder: string;
      city: string;
      cityPlaceholderLocked: string;
      cityPlaceholderReady: string;
      preferredContact: string;
      preferredContactOptions: string[];

      section2: string;
      productsRequired: string;
      productCategories: string[];
      estimatedQuantity: string;
      estimatedQuantityPlaceholder: string;

      section3: string;
      projectType: string;
      projectTypePlaceholder: string;
      projectTypeOptions: string[];
      deliveryCountry: string;
      deliveryCountryPlaceholder: string;
      deliveryCity: string;
      targetDeliveryDate: string;
      customBranding: string;
      customBrandingOptions: string[];
      sampleRequired: string;
      sampleRequiredOptions: string[];

      section4: string;
      notes: string;
      notesPlaceholder: string;
      uploadHeading: string;
      uploadHelp: string;
      uploadDrag: string;
      uploadBrowse: string;
      uploadAccepted: string;
      uploadRemove: string;
      uploadErrorType: string;
      uploadErrorSize: string;
      uploadErrorFailed: string;
      additionalMessage: string;
      additionalMessagePlaceholder: string;

      submit: string;
      submitting: string;
      note: string;
      errorRequired: string;
      errorEmail: string;
      errorProducts: string;
      errorGeneric: string;
      specificProductsLabel: string;

      successHeading: string;
      successMessage: string;
      successReferenceLabel: string;
      successNote: string;
      backToProducts: string;
      returnHome: string;
    };
  };
  contact: {
    title: string;
    description: string;
    hero: { eyebrow: string; heading1: string; heading2: string; body: string };
    trust: string[];
    form: { eyebrow: string; heading1: string; heading2: string; body: string; title: string; name: string; email: string; subject: string; message: string; submit: string; note: string };
    findUs: { eyebrow: string; heading1: string; heading2: string };
  };
  faq: { title: string; description: string; hero: { eyebrow: string; heading1: string; heading2: string; body: string }; items: FaqItem[]; ctaEyebrow: string; ctaHeading1: string; ctaHeading2: string; contactUs: string };
  privacyPolicy: { title: string; description: string; hero: { eyebrow: string; heading1: string; heading2: string; body: string }; sections: { heading: string; body: string }[]; ctaEyebrow: string; ctaHeading1: string; ctaHeading2: string };
  search: { title: string; description: string; hero: { eyebrow: string; heading1: string; heading2: string; body: string }; placeholder: string; searchButton: string };
  hotelOpening: {
    title: string;
    description: string;
    hero: { label: string; eyebrow: string; heading1: string; heading2: string; body: string; cta: string };
    contents: { eyebrow: string; heading1: string; heading2: string; body: string; comingSoon: string };
    benefits: { eyebrow: string; heading1: string; heading2: string; body: string; cta: string; items: { title: string; body: string }[] };
    process: { eyebrow: string; heading1: string; heading2: string; body: string; steps: { title: string; body: string }[] };
    cta: { eyebrow: string; heading1: string; heading2: string; button: string };
  };
  fabricGuide: {
    title: string;
    description: string;
    hero: { label: string; eyebrow: string; heading1: string; heading2: string; body: string };
    gsm: {
      eyebrow: string;
      heading1: string;
      heading2: string;
      body: string;
      ourRange: string;
      scaleMin: string;
      scaleMax: string;
      tiers: { title: string; range: string; body: string }[];
    };
    tc: {
      eyebrow: string;
      heading1: string;
      heading2: string;
      body: string;
      ourRange: string;
      scaleMin: string;
      scaleMax: string;
      tiers: { title: string; range: string; body: string }[];
    };
    cta: { eyebrow: string; heading1: string; heading2: string; button: string };
  };
  notFound: {
    title: string;
    description: string;
    eyebrow: string;
    heading1: string;
    heading2: string;
    body: string;
    searchPlaceholder: string;
    searchButton: string;
    links: { title: string; body: string }[];
  };
}

export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Deep-merges a partial translation over the full English dictionary, so any untranslated key falls back to English rather than breaking the build. */
export function mergeDictionary(base: Dictionary, partial: DeepPartial<Dictionary>): Dictionary {
  const merge = (a: unknown, b: unknown): unknown => {
    if (isPlainObject(a) && isPlainObject(b)) {
      const out: Record<string, unknown> = { ...a };
      for (const key of Object.keys(b)) out[key] = merge(a[key], b[key]);
      return out;
    }
    return b === undefined ? a : b;
  };
  return merge(base, partial) as Dictionary;
}
