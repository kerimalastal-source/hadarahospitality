// Source content for every product page under /products.
// Add a new product by adding an entry to PRODUCTS below — Astro generates
// its page automatically at build time (src/pages/products/[slug].astro).
// No separate generator script or manual HTML file needed.

export type CategoryKey = 'towels' | 'robes' | 'bed-linen' | 'pillows' | 'protectors' | 'amenities';

export interface Category {
  label: string;
  formCategory: string;
  /** Category-level placeholder figures shown on every product page in this
   * category (src/views/ProductView.astro's spec table) until the owner
   * confirms real per-category numbers — see the "tentative" note shown
   * alongside them (productDetail.moqNote in the dictionary). Never treat
   * these as confirmed pricing/ordering terms. */
  moq: string;
  leadTime: string;
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  towels: { label: 'Towels & Bath', formCategory: 'Towels & bath', moq: '100 pieces per style', leadTime: '3–4 weeks' },
  robes: { label: 'Robes & Slippers', formCategory: 'Robes & slippers', moq: '50 pieces per style', leadTime: '4–5 weeks' },
  'bed-linen': { label: 'Bed Linen', formCategory: 'Bed linen & bedding', moq: '100 sets per style', leadTime: '4–5 weeks' },
  pillows: { label: 'Pillows & Duvets', formCategory: 'Pillows & duvets', moq: '100 pieces per style', leadTime: '3–4 weeks' },
  protectors: { label: 'Mattress & Pillow Protectors', formCategory: 'Mattress protectors', moq: '100 pieces per style', leadTime: '3–4 weeks' },
  amenities: { label: 'Hotel Amenities', formCategory: 'Other hospitality essentials', moq: '500 pieces per style', leadTime: '3–5 weeks' },
};

// Category display order used on the products listing page and the jump nav.
export const CATEGORY_ORDER: CategoryKey[] = [
  'towels',
  'robes',
  'bed-linen',
  'pillows',
  'protectors',
  'amenities',
];

export interface Product {
  slug: string;
  name: string;
  category: CategoryKey;
  material: string;
  suitableFor: string;
  specLabel: string;
  specValues: string[];
  customization: string[];
  overview: string;
  features: string[];
  /** Main product photo URL. Empty string when no photography exists yet. */
  main: string;
  gallery: string[];
}

export const PRODUCTS: Product[] = [
  {
    slug: 'hotel-quality-bath-towel-600-gsm',
    name: 'Hotel Quality Bath Towel – 600 GSM',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: '4★ & 5★ hotel segments',
    specLabel: 'GSM',
    specValues: ['500 GSM', '600 GSM', '700 GSM'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel-quality bath towel designed for luxury hospitality environments, including hotels, resorts, and spa facilities. Manufactured from high-quality cotton fabrics to provide exceptional softness, absorbency, and operational durability for professional hospitality use.',
    features: ['600 GSM premium hospitality quality', 'High absorbency & soft-touch texture', 'Durable for commercial laundry operations', 'Suitable for 4★ & 5★ hotel segments', 'Elegant hospitality presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_383c86f602ab4db3a9aa1a04ed0fe7f9~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_383c86f602ab4db3a9aa1a04ed0fe7f9~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_d4c7ad29d236402c80bb9349656237ed~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_845509d74baf4444b6504ffd68c458bd~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_0eef6acf5bef4ef9bdbe4b0749564c7d~mv2.jpg'],
  },
  {
    // No product photography yet — same placeholder-gallery treatment as
    // the rest of this file's unphotographed entries.
    slug: 'hotel-bath-sheet-700-gsm',
    name: 'Hotel Bath Sheet',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: '4★ & 5★ hotel segments',
    specLabel: 'GSM',
    specValues: ['500 GSM', '600 GSM', '700 GSM'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium oversized bath sheet designed for luxury hospitality environments, including hotels, resorts, and spa facilities. Larger than a standard bath towel, manufactured from high-quality cotton fabrics to provide full-body coverage, exceptional softness, and lasting absorbency for professional hospitality use.',
    features: ['Oversized full-body coverage', '600 GSM premium hospitality quality', 'High absorbency & soft-touch texture', 'Durable for commercial laundry operations', 'Suitable for 4★ & 5★ hotel segments'],
    main: '',
    gallery: [],
  },
  {
    slug: 'hotel-hand-towel',
    name: 'Hotel Hand Towel',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: '3★, 4★ & 5★ hotel segments',
    specLabel: 'GSM',
    specValues: ['450 GSM', '500 GSM', '600 GSM'],
    customization: ['Custom Size Request', 'Custom Logo Embroidery', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel hand towel designed for daily hospitality operations. Manufactured from high-absorbency cotton fabrics to provide softness, durability, and long-lasting performance for hotels, resorts, and serviced apartments.',
    features: ['500 GSM hospitality-grade quality', 'High absorbency & soft texture', 'Durable for commercial laundry use', 'Suitable for 3★, 4★ & 5★ hotel segments', 'Elegant white hotel presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_f5a729c9431149ae8f641be71a3501f3~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_f5a729c9431149ae8f641be71a3501f3~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_b3d102dd3280479a9908c43cb1fed4b4~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_caf67c93160c42438f5a052da7d9eabd~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_4b7f368e88b540119cbeb6890afc2423~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_bd1f6d42c36e4d9c9e90cf45c5aa7f42~mv2.jpg'],
  },
  {
    slug: 'hotel-face-towel-2-pack',
    name: 'Hotel Face Towel',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'GSM',
    specValues: ['450 GSM', '500 GSM', '600 GSM'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel face towel developed for hospitality bathrooms, spa facilities, and guest room operations. Manufactured from high-quality cotton fabrics to provide softness, absorbency, and long-lasting durability for professional hotel use.',
    features: ['500 GSM hospitality-grade quality', 'Soft-touch & high absorbency', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments', 'Elegant white hospitality presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_5e83f411e37e4dcd942f23465c007250~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_5e83f411e37e4dcd942f23465c007250~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_5771c7b23a614390bd7b2f8551003ba1~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_b910500fa875415db60b4945ff730c67~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_cd269d83c63c47dc9225cc7840f04d79~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_1e2e6c22b4884042b07badab80e43ab1~mv2.jpg'],
  },
  {
    // No product photography yet — same placeholder-gallery treatment as
    // the rest of this file's unphotographed entries.
    slug: 'hotel-washcloth',
    name: 'Hotel Washcloth',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'GSM',
    specValues: ['350 GSM', '400 GSM', '450 GSM'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Compact hotel washcloth developed for hospitality bathrooms and guest room operations. Manufactured from high-quality cotton fabrics to provide a soft, practical everyday essential for washing and cleansing during a stay.',
    features: ['Compact everyday cotton essential', '400 GSM hospitality-grade quality', 'Soft-touch & absorbent texture', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments'],
    main: '',
    gallery: [],
  },
  {
    slug: 'hotel-pool-towel-600-gsm',
    name: 'Hotel Pool Towel',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: 'Hotels, resorts & pool facilities',
    specLabel: 'GSM',
    specValues: ['500 GSM', '600 GSM', '700 GSM'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel pool towel designed for resorts, pool facilities, beach clubs, and luxury hospitality environments. Manufactured from high-quality cotton fabrics to provide excellent absorbency, softness, and long-lasting operational durability.',
    features: ['600 GSM hospitality-grade quality', 'Soft-touch & high absorbency', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & pool facilities', 'Elegant hospitality presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_c90468973de44605827e1822d0abe614~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_c90468973de44605827e1822d0abe614~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_976a76c5299e4bbfa7dced432b5289e0~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_bff24c63f0a2438e83cc812463bb60c0~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_792b5c788b1d45a0b9577cfdd596b20e~mv2.jpg'],
  },
  {
    slug: 'luxury-spa-towel-700-gsm',
    name: 'Luxury Spa Towel',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: 'Luxury hotels, resorts & spa facilities',
    specLabel: 'GSM',
    specValues: ['600 GSM', '700 GSM', '800 GSM'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium luxury spa towel designed for wellness centers, spa facilities, luxury resorts, and high-end hospitality environments. Manufactured from high-quality cotton fabrics to provide exceptional softness, absorbency, and premium guest comfort.',
    features: ['700 GSM luxury hospitality quality', 'Ultra-soft & high absorbency', 'Durable for commercial laundry operations', 'Suitable for luxury hotels, resorts & spa facilities', 'Elegant premium hospitality presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_9408505de6554d6ab16b78b7ae8fc02d~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_9408505de6554d6ab16b78b7ae8fc02d~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_b3556f5ce2804306a8969ec3f0167913~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_2e8c8d52d7044181903aad951a21b63b~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_726c0826d58e43cbb6c99d8a067c9383~mv2.jpg'],
  },
  {
    slug: 'hotel-bath-mat-700-gsm',
    name: 'Hotel Bath Mat',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: 'Hotels, resorts & spa facilities',
    specLabel: 'GSM',
    specValues: ['600 GSM', '700 GSM', '800 GSM'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel bath mat designed for luxury hospitality bathrooms, spa facilities, and resort guest experiences. Manufactured from high-quality cotton fabrics to provide exceptional absorbency, softness, and operational durability for professional hotel use.',
    features: ['700 GSM luxury hospitality quality', 'High absorbency & soft-touch texture', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & spa facilities', 'Elegant luxury hospitality presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_2bd1dc505b3d49f3a39ac7f5956649ee~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_2bd1dc505b3d49f3a39ac7f5956649ee~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_effbcdd670bd4dfd833d43321a487b47~mv2.jpg'],
  },
  {
    slug: 'hotel-foot-towel-500-gsm',
    name: 'Hotel Foot Towel',
    category: 'towels',
    material: '100% hospitality-grade cotton',
    suitableFor: 'Hotels, resorts & spa facilities',
    specLabel: 'GSM',
    specValues: ['450 GSM', '500 GSM', '600 GSM'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel foot towel designed for hospitality bathrooms, guest room operations, and spa environments. Manufactured from high-quality cotton fabrics to provide softness, absorbency, and operational durability for professional hotel use.',
    features: ['500 GSM hospitality-grade quality', 'High absorbency & soft-touch texture', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & spa facilities', 'Elegant hospitality presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_60836fe9acba43e781af2e5312a7cc83~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_60836fe9acba43e781af2e5312a7cc83~mv2.jpg'],
  },
  {
    slug: 'luxury-terry-bathrobe',
    name: 'Luxury Terry Bathrobe',
    category: 'robes',
    material: 'Premium terry cotton',
    suitableFor: 'Hotels, resorts & spa facilities',
    specLabel: 'Model',
    specValues: ['Shawl Collar', 'Kimono Style', 'Luxury Spa Style'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium terry bathrobe designed for luxury hotels, resorts, spa facilities, and wellness hospitality environments. Manufactured from high-quality cotton fabrics to provide superior softness, comfort, and operational durability for professional hospitality use.',
    features: ['Premium terry cotton quality', 'Soft-touch & highly absorbent texture', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & spa facilities', 'Elegant luxury hospitality presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_c149a939b7cd40ddb717033660ab0a5c~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_c149a939b7cd40ddb717033660ab0a5c~mv2.jpg'],
  },
  {
    slug: 'luxury-waffle-bathrobe',
    name: 'Luxury Waffle Bathrobe',
    category: 'robes',
    material: 'Premium waffle fabric',
    suitableFor: 'Hotels, resorts & spa facilities',
    specLabel: 'Model',
    specValues: ['Kimono Style', 'Shawl Collar', 'Luxury Spa Style'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium waffle bathrobe designed for luxury hotels, spa facilities, wellness centers, and resort hospitality environments. Manufactured from lightweight and breathable waffle fabrics to provide elegant comfort and refined guest experiences.',
    features: ['Premium waffle fabric quality', 'Lightweight & breathable structure', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & spa facilities', 'Elegant spa-inspired hospitality presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_d0d5af94559848feaa9da1204445b52f~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_d0d5af94559848feaa9da1204445b52f~mv2.jpg'],
  },
  {
    slug: 'luxury-hotel-slippers',
    name: 'Luxury Hotel Slippers',
    category: 'robes',
    material: 'Premium hospitality-grade materials',
    suitableFor: 'Hotels, resorts & spa facilities',
    specLabel: 'Model',
    specValues: ['Closed Toe', 'Open Toe', 'Luxury Spa Style'],
    customization: ['Custom Logo Embroidery', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel slippers designed for luxury hotels, resorts, spa facilities, and guest hospitality environments. Manufactured from comfortable and durable materials to provide elegant guest comfort and refined hospitality presentation.',
    features: ['Premium hospitality-quality materials', 'Soft & comfortable structure', 'Durable for hospitality operations', 'Suitable for hotels, resorts & spa facilities', 'Elegant guest room presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_956e8bf269e44a6d809c7d5ca0f88039~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_956e8bf269e44a6d809c7d5ca0f88039~mv2.jpg'],
  },
  {
    slug: 'luxury-duvet-cover-300-tc',
    name: 'Luxury Duvet Cover – 300 TC',
    category: 'bed-linen',
    material: 'Premium hospitality-grade fabric',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Fabric Quality',
    specValues: ['250 TC', '300 TC', '350 TC'],
    customization: ['Custom Size Request', 'Custom Embroidery', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium duvet cover designed for luxury hotels, resorts, and hospitality guest room environments. Manufactured from high-quality hospitality fabrics to provide elegant bedding presentation, softness, and operational durability for professional hotel use.',
    features: ['300 TC luxury hospitality fabric', 'Soft-touch & breathable structure', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments', 'Elegant premium bedding presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_b8f104a0ec244582bbaefcba949370ad~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_b8f104a0ec244582bbaefcba949370ad~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_b6b891020ae9452fae26436f37e57c9f~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_75455d80534a44edbc31c2b668614627~mv2.jpg'],
  },
  {
    slug: 'luxury-hotel-bedsheet-250-tc',
    name: 'Luxury Hotel Bedsheet – 250 TC',
    category: 'bed-linen',
    material: 'Premium hospitality-grade fabric',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Fabric Quality',
    specValues: ['200 TC', '250 TC', '300 TC'],
    customization: ['Custom Size Request', 'Custom Embroidery', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel bedsheet designed for luxury hotels, resorts, and hospitality guest room environments. Manufactured from high-quality hospitality fabrics to provide softness, durability, and refined bedding comfort for professional hotel operations.',
    features: ['250 TC premium hospitality fabric', 'Soft-touch & breathable structure', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments', 'Elegant luxury bedding presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_4928cbc2283e42138f3bcf999e3c4faf~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_4928cbc2283e42138f3bcf999e3c4faf~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_3323b58ffec74a19b29be890fbf9b061~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_b5dcd096900744fa9ec5a4d37a60cec1~mv2.jpg'],
  },
  {
    slug: 'luxury-hotel-pillowcase-250-tc',
    name: 'Luxury Hotel Pillowcase – 250 TC',
    category: 'bed-linen',
    material: 'Premium hospitality-grade fabric',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Fabric Quality',
    specValues: ['200 TC', '250 TC', '300 TC'],
    customization: ['Custom Size Request', 'Custom Embroidery', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel pillowcase designed for luxury hotels, resorts, and hospitality guest room environments. Manufactured from high-quality hospitality fabrics to provide softness, durability, and elegant bedding presentation for professional hotel use.',
    features: ['250 TC premium hospitality fabric', 'Soft-touch & breathable texture', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments', 'Elegant luxury bedding presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_2e20426e9db2480691f32aac420443da~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_2e20426e9db2480691f32aac420443da~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_afda1e59439d4a878c9ad4f1818ea7b3~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_db79943c4f5442f28ef3c56165021f92~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_b5f4236ce10d4c1eb245feb1529b6a03~mv2.jpg'],
  },
  {
    // No product photography yet — see the "Hotel Amenities" note below;
    // same placeholder-gallery treatment applies here.
    slug: 'luxury-hotel-fitted-sheet-250-tc',
    name: 'Luxury Hotel Fitted Sheet – 250 TC',
    category: 'bed-linen',
    material: 'Premium hospitality-grade fabric',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Fabric Quality',
    specValues: ['200 TC', '250 TC', '300 TC'],
    customization: ['Custom Size Request', 'Custom Embroidery', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium fitted sheet designed for luxury hotels, resorts, and hospitality guest room environments. Manufactured from high-quality hospitality fabrics with a deep, elasticized pocket for a secure, wrinkle-free fit on hotel-depth mattresses.',
    features: ['250 TC premium hospitality fabric', 'Deep elasticized pocket for hotel mattress depths', 'Soft-touch & breathable structure', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments'],
    main: '',
    gallery: [],
  },
  {
    // No product photography yet — same placeholder-gallery treatment as
    // the rest of this file's unphotographed entries.
    slug: 'luxury-hotel-bed-blanket',
    name: 'Luxury Hotel Bed Blanket',
    category: 'bed-linen',
    material: 'Premium cotton-blend fabric',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Weight',
    specValues: ['Lightweight', 'Medium Weight', 'Heavyweight'],
    customization: ['Custom Size Request', 'Custom Embroidery', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium bed blanket designed for luxury hotels, resorts, and hospitality guest room environments. Manufactured from soft cotton-blend fabric to provide an extra warmth layer alongside the duvet, with reliable performance through repeated commercial laundering.',
    features: ['Soft cotton-blend fabric', 'Available in multiple weights for warmth', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments', 'Elegant guest room presentation'],
    main: '',
    gallery: [],
  },
  {
    // No product photography yet — same placeholder-gallery treatment as
    // the rest of this file's unphotographed entries.
    slug: 'decorative-bed-runner',
    name: 'Decorative Bed Runner',
    category: 'bed-linen',
    material: 'Premium decorative fabric',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Style',
    specValues: ['Solid', 'Textured', 'Quilted'],
    customization: ['Custom Size Request', 'Custom Embroidery', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: "Decorative bed runner designed to finish the guest room bed presentation for luxury hotels, resorts, and hospitality environments. Placed across the foot of the bed for an elevated, boutique-style finish that complements the room's overall bedding.",
    features: ['Elegant decorative bed accent', 'Available in multiple styles & finishes', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments', 'Boutique-style guest room presentation'],
    main: '',
    gallery: [],
  },
  {
    slug: 'luxury-hotel-duvet-microfiber',
    name: 'Luxury Hotel Duvet – Microfiber',
    category: 'pillows',
    material: 'Premium microfiber filling',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Weight',
    specValues: ['Lightweight', 'Medium Weight', 'Luxury Comfort'],
    customization: ['Custom Size Request', 'Custom Labeling', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel duvet designed for luxury hotels, resorts, and hospitality guest room environments. Manufactured with high-quality microfiber filling to provide warmth, softness, and long-lasting comfort for professional hospitality operations.',
    features: ['Premium microfiber filling', 'Soft-touch & breathable comfort', 'Lightweight & comfortable structure', 'Suitable for hotels, resorts & serviced apartments', 'Elegant luxury bedding presentation'],
    main: 'https://static.wixstatic.com/media/3510f9_57f05d28565b47d9a1e67129e0e8196e~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_57f05d28565b47d9a1e67129e0e8196e~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_76ac4aed0ed14c18b271b0e110a25a97~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_7ac4f09490fd436099eeb716f14d7ce7~mv2.jpg'],
  },
  {
    slug: 'luxury-hotel-pillow-microfiber',
    name: 'Luxury Hotel Pillow – Microfiber',
    category: 'pillows',
    material: 'Premium microfiber filling',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Comfort Level',
    specValues: ['Soft Comfort', 'Medium Comfort', 'Firm Comfort'],
    customization: ['Custom Size Request', 'Custom Labeling', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium hotel pillow designed for luxury hotels, resorts, and hospitality guest room environments. Manufactured with high-quality microfiber filling to provide exceptional comfort, softness, and long-lasting operational durability for professional hospitality use.',
    features: ['Premium microfiber filling', 'Soft-touch & breathable comfort', 'Durable for hospitality operations', 'Suitable for hotels, resorts & serviced apartments', 'Elegant luxury sleep experience'],
    main: 'https://static.wixstatic.com/media/3510f9_aed304b1825d48ae8bcef3e2da00b4f3~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_aed304b1825d48ae8bcef3e2da00b4f3~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_5a17dd20c565442ba925a1f833da32cd~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_2e7bbf7cbc934c6ba1cd0ede5d25233f~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_38fc496a3fe7450db6630c2772a2bc1a~mv2.jpg'],
  },
  {
    slug: 'waterproof-mattress-protector',
    name: 'Waterproof Mattress Protector',
    category: 'protectors',
    material: 'Waterproof & breathable structure',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Type',
    specValues: ['Waterproof', 'Breathable', 'Quilted Comfort'],
    customization: ['Custom Size Request', 'Custom Labeling', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Premium waterproof mattress protector designed for hotels, resorts, and hospitality guest room environments. Manufactured with breathable and protective materials to provide mattress hygiene, durability, and long-lasting hospitality performance.',
    features: ['Waterproof & breathable structure', 'Hospitality-grade protection', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments', 'Long-lasting mattress protection'],
    main: 'https://static.wixstatic.com/media/3510f9_1b16cf4752f548279969376473721ab3~mv2.jpg',
    gallery: ['https://static.wixstatic.com/media/3510f9_1b16cf4752f548279969376473721ab3~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_078056a0a70e4302ba7f495493deb3c6~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_9107a234593345f9abd26328f523bdcf~mv2.jpg', 'https://static.wixstatic.com/media/3510f9_754a4169933f4f7882a7a421360ce344~mv2.jpg'],
  },
  {
    // No product photography yet — same placeholder-gallery treatment as
    // "Hotel Amenities" below.
    slug: 'waterproof-pillow-protector',
    name: 'Waterproof Pillow Protector',
    category: 'protectors',
    material: 'Waterproof & breathable structure',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Type',
    specValues: ['Waterproof', 'Breathable', 'Zippered Closure'],
    customization: ['Custom Size Request', 'Custom Labeling', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Waterproof pillow protector designed for hotels, resorts, and hospitality guest room environments. Manufactured with breathable, protective materials and a secure zippered closure to safeguard pillows and extend their hospitality service life.',
    features: ['Waterproof & breathable structure', 'Secure zippered closure', 'Hospitality-grade protection', 'Durable for commercial laundry operations', 'Suitable for hotels, resorts & serviced apartments'],
    main: '',
    gallery: [],
  },
  // Hotel Amenities — no product photography yet; pages render a clean
  // placeholder gallery until real photos are supplied (main/gallery left empty).
  {
    slug: 'guest-welcome-amenity-set',
    name: 'Guest Welcome Amenity Set',
    category: 'amenities',
    material: 'Travel-size guest-care bottles & soap',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Set Includes',
    specValues: ['Shampoo', 'Conditioner', 'Shower Gel', 'Body Lotion', 'Soap Bar'],
    customization: ['Custom Labeling', 'Custom Fragrance Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Guest welcome amenity set bringing together the daily essentials guests expect in a hotel or resort bathroom. Bottles and packaging can be labeled to match your property’s brand.',
    features: ['Travel-size guest-care bottles & soap bar', 'Consistent presentation across guest rooms', 'Available in various bottle formats', 'Suitable for hotels, resorts & serviced apartments', 'Custom labeling for brand presentation'],
    main: '',
    gallery: [],
  },
  {
    slug: 'guest-shower-cap',
    name: 'Guest Shower Cap',
    category: 'amenities',
    material: 'Waterproof guest-care film',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Format',
    specValues: ['Individually Wrapped', 'Bulk Pack'],
    customization: ['Custom Labeling', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Individually wrapped shower cap prepared for hotel bathroom amenity sets, offering guests a simple, hygienic bathing accessory during their stay.',
    features: ['Waterproof guest-care material', 'Individually wrapped for hygiene', 'Compact guest room presentation', 'Suitable for hotels, resorts & serviced apartments', 'Available for bulk production'],
    main: '',
    gallery: [],
  },
  {
    slug: 'guest-sewing-kit',
    name: 'Guest Sewing Kit',
    category: 'amenities',
    material: 'Compact guest-care sewing essentials',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Set Includes',
    specValues: ['Needle', 'Assorted Thread Colors', 'Safety Pin', 'Spare Button'],
    customization: ['Custom Labeling', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Compact guest sewing kit prepared for hotel guest rooms, offering a small and practical fix-it essential during a stay.',
    features: ['Compact guest-care essentials', 'Individually packaged for guest rooms', 'Practical addition to amenity sets', 'Suitable for hotels, resorts & serviced apartments', 'Available for bulk production'],
    main: '',
    gallery: [],
  },
  {
    slug: 'guest-shoe-shine-kit',
    name: 'Guest Shoe Shine Kit',
    category: 'amenities',
    material: 'Guest-care shoe care essentials',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Format',
    specValues: ['Shoe Shine Sponge', 'Shoe Mitt'],
    customization: ['Custom Labeling', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Guest room shoe care essential prepared for hotel amenity sets, giving guests a quick way to freshen up their footwear during a stay.',
    features: ['Compact guest-care format', 'Individually packaged for guest rooms', 'Practical addition to amenity sets', 'Suitable for hotels, resorts & serviced apartments', 'Available for bulk production'],
    main: '',
    gallery: [],
  },
  {
    slug: 'hospitality-laundry-bag',
    name: 'Hospitality Laundry Bag',
    category: 'amenities',
    material: 'Woven or non-woven fabric',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Format',
    specValues: ['Drawstring Bag', 'Flat Bag'],
    customization: ['Custom Logo Printing', 'Custom Size Request', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Guest room laundry bag developed for hotel valet and laundry services, giving guests a simple way to collect items for cleaning during their stay.',
    features: ['Durable guest room fabric', 'Suitable for valet & laundry operations', 'Available in drawstring or flat formats', 'Suitable for hotels, resorts & serviced apartments', 'Available for bulk production'],
    main: '',
    gallery: [],
  },
  {
    slug: 'bathrobe-towel-hanger-set',
    name: 'Bathrobe & Towel Hanger Set',
    category: 'amenities',
    material: 'Hospitality-grade hanger materials',
    suitableFor: 'Hotels, resorts & spa facilities',
    specLabel: 'Set Includes',
    specValues: ['Bathrobe Hanger', 'Towel Hook'],
    customization: ['Custom Logo Engraving', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Bathroom hanger set designed for hotel and spa guest rooms, giving robes and towels a tidy place between uses.',
    features: ['Hospitality-grade hanger construction', 'Suitable for bathrobes & towels', 'Elegant guest room presentation', 'Suitable for hotels, resorts & spa facilities', 'Available for bulk production'],
    main: '',
    gallery: [],
  },
  {
    slug: 'guest-dental-kit',
    name: 'Guest Dental Kit',
    category: 'amenities',
    material: 'Individually wrapped dental essentials',
    suitableFor: 'Hotels, resorts & serviced apartments',
    specLabel: 'Set Includes',
    specValues: ['Toothbrush', 'Travel-size Toothpaste'],
    customization: ['Custom Labeling', 'Hospitality Packaging', 'Bulk Order Production'],
    overview: 'Individually wrapped guest dental kit prepared for hotel bathroom amenity sets, offering a simple and hygienic essential during a stay.',
    features: ['Individually wrapped for hygiene', 'Travel-size guest essentials', 'Consistent amenity set presentation', 'Suitable for hotels, resorts & serviced apartments', 'Available for bulk production'],
    main: '',
    gallery: [],
  },
];

/** Maps each "Product Categories" chip on /get-a-quote (the exact English
 * strings in en.getAQuote.form.productCategories) to the specific catalog
 * products a customer can pick from once they check that chip. Most chips
 * are just a CategoryKey filter, but "Towels & Bath Linen"/"Pool & Beach
 * Towels" split the `towels` category and "Bathrobes"/"Hotel Slippers"
 * split `robes` — finer than CategoryKey can express — so those four are
 * hand-curated by slug instead. 'Other' intentionally has no products (a
 * free-text catch-all chip). Read by GetAQuoteView.astro to render each
 * chip's product picker server-side — see the "Specific products under
 * each RFQ category" note in CLAUDE.md. */
const POOL_AND_SPA_TOWEL_SLUGS = ['hotel-pool-towel-600-gsm', 'luxury-spa-towel-700-gsm'];
const BATHROBE_SLUGS = ['luxury-terry-bathrobe', 'luxury-waffle-bathrobe'];
const SLIPPER_SLUGS = ['luxury-hotel-slippers'];

function slugsFor(category: CategoryKey, exclude: string[] = []): string[] {
  return PRODUCTS.filter((p) => p.category === category && !exclude.includes(p.slug)).map((p) => p.slug);
}

export const RFQ_CATEGORY_PRODUCTS: Record<string, string[]> = {
  'Bed Linen': slugsFor('bed-linen'),
  'Towels & Bath Linen': slugsFor('towels', POOL_AND_SPA_TOWEL_SLUGS),
  'Bathrobes': BATHROBE_SLUGS,
  'Hotel Slippers': SLIPPER_SLUGS,
  'Pillows & Duvets': slugsFor('pillows'),
  'Mattress Protectors': slugsFor('protectors'),
  'Pool & Beach Towels': POOL_AND_SPA_TOWEL_SLUGS,
  'Guest Room Accessories': slugsFor('amenities'),
  Other: [],
};

const SLUG_TO_RFQ_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(RFQ_CATEGORY_PRODUCTS).flatMap(([category, slugs]) => slugs.map((slug) => [slug, category])),
);

/** The RFQ form's product-category chip a given product slug actually falls
 * under — precise for the categories RFQ_CATEGORY_PRODUCTS splits finer
 * than CategoryKey (towels -> "Towels & Bath Linen" / "Pool & Beach
 * Towels", robes -> "Bathrobes" / "Hotel Slippers"), unlike the coarser
 * CATEGORIES[key].formCategory -> LEGACY_CATEGORY_TO_RFQ_CATEGORY mapping
 * (src/lib/rfq.ts) used for a single product page's `?category=` hand-off.
 * Used by the products listing page's multi-select ("Request a quote for
 * selected products") to pre-check the exact right chip and panel. */
export function getRfqCategoryForSlug(slug: string): string | undefined {
  return SLUG_TO_RFQ_CATEGORY[slug];
}

// Categories to pull from when a product's own category doesn't have enough
// other products to fill "You may also like" (see getRelatedProducts below)
// — pairs the natural "guest room" groupings (bedroom vs. bathroom) rather
// than falling back to an arbitrary/unrelated category. `pillows` and
// `protectors` are the ones that actually need this today (2 products
// each), but every category has a sensible fallback in case the catalog
// changes.
const COMPLEMENTARY_CATEGORIES: Record<CategoryKey, CategoryKey[]> = {
  'bed-linen': ['pillows', 'protectors'],
  pillows: ['bed-linen', 'protectors'],
  protectors: ['bed-linen', 'pillows'],
  towels: ['robes', 'amenities'],
  robes: ['towels', 'amenities'],
  amenities: ['towels', 'robes'],
};

/** First number found across a product's specValues (e.g. "600 GSM" -> 600),
 * averaged when there are several (a product's specValues is the range it's
 * offered in, e.g. ['500 GSM','600 GSM','700 GSM']) — a rough but useful
 * stand-in for "quality tier" so related products can be ranked by how
 * close a match they are, not just catalog order. Returns null for
 * non-numeric spec types (Model, Style, Format, ...), which just falls
 * back to catalog order below. */
function specTier(product: Product): number | null {
  const numbers = product.specValues.join(' ').match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  return numbers.reduce((sum, n) => sum + Number(n), 0) / numbers.length;
}

/** "You may also like" for a product page — same-category products ranked
 * by closest quality tier first (so a 600 GSM towel surfaces other
 * mid-to-high GSM towels before an entry-level one), topped up from
 * complementary categories when the product's own category doesn't have
 * enough others on its own (e.g. pillows/protectors only have 2 products
 * each today). */
export function getRelatedProducts(product: Product, count = 3): Product[] {
  const targetTier = specTier(product);
  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug);
  const ranked = targetTier === null
    ? sameCategory
    : [...sameCategory].sort((a, b) => {
        const tierA = specTier(a);
        const tierB = specTier(b);
        if (tierA === null && tierB === null) return 0;
        if (tierA === null) return 1;
        if (tierB === null) return -1;
        return Math.abs(tierA - targetTier) - Math.abs(tierB - targetTier);
      });

  const related = [...ranked];
  if (related.length < count) {
    for (const category of COMPLEMENTARY_CATEGORIES[product.category] ?? []) {
      if (related.length >= count) break;
      const fromCategory = PRODUCTS.filter((p) => p.category === category && !related.includes(p))
        .sort((a, b) => (b.main ? 1 : 0) - (a.main ? 1 : 0)); // photographed products first
      related.push(...fromCategory.slice(0, count - related.length));
    }
  }
  return related.slice(0, count);
}
