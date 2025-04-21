// ———————————————————————————————————
// /lib/filtering.js
// ———————————————————————————————————

const POSITIVE_KEYWORDS = [
  'skincare', 'moisturizer', 'cleanser', 'serum', 'toner', 'exfoliant',
  'facial oil', 'eye cream', 'face mist', 'essence', 'night cream', 'day cream',
  'hydrating', 'brightening', 'anti-aging', 'sunscreen', 'spf', 'face mask',
  'peel', 'cleansing balm', 'micellar water', 'retinol', 'vitamin c',
  'hyaluronic acid', 'niacinamide', 'aha', 'bha', 'salicylic acid',
  'acne treatment', 'blemish control', 'dark spots', 'hyperpigmentation',
  'pore minimizer', 'blackheads', 'whiteheads', 'skin barrier', 'glow', 'radiance',
  'sensitive skin', 'eczema', 'psoriasis', 'rosacea', 'redness',
  'dry skin', 'oily skin', 'combination skin', 'itchy skin', 'flaky skin',
  'irritation', 'inflammation', 'breakouts', 'skin concern', 'soothing',
  'foundation', 'concealer', 'tinted moisturizer', 'bb cream', 'cc cream',
  'lip balm', 'lip tint', 'lip mask', 'blush', 'highlighter', 'bronzer',
  'setting spray', 'makeup remover', 'primer', 'powder',
  'clean beauty', 'green beauty', 'natural skincare', 'vegan skincare',
  'cruelty-free', 'plant-based', 'sustainable beauty', 'zero waste',
  'ethical sourcing', 'non-toxic', 'eco-friendly', 'recyclable packaging',
  'minimal ingredients', 'paraben-free', 'fragrance-free', 'alcohol-free',
  'k-beauty', 'j-beauty', 'ayurvedic skincare', 'korean skincare',
  'skinimalism', 'skincycling', 'biome-friendly', 'microbiome',
  'probiotic skincare', 'dermatologist recommended', 'derm-approved',
  'the ordinary', 'cerave', "paula's choice", 'drunk elephant',
  'innisfree', 'glossier', 'elf cosmetics', 'biossance',
  'youth to the people', 'tatcha', 'fenty skin', 'true botanicals'
];

const NEGATIVE_KEYWORDS = [
  'game', 'marvel', 'crypto', 'vaccine', 'politics', 'IPO', 'stock', 'investor', 'market',
  'finance', 'currency', 'shingles', 'brain', 'dementia', 'cancer treatment', 'venom', 
  'comic', 'gaming', 'plastic surgery', 'celebrity real estate', 'apple accessories',
  'sex tape', 'porn', 'vibrator', 'adult toy', 'stripper', 'xxx',
  'gummy', 'gummies', 'chewing', 'toothpaste', 'dentifrice', 'supplement', 'vitamin', 'pharma', 'food', 'drink', 'mouthwash'
];

exports.isRelevantArticle = (article) => {
  const text = (article.title + ' ' + article.description).toLowerCase();
  return POSITIVE_KEYWORDS.some((kw) => text.includes(kw)) &&
         !NEGATIVE_KEYWORDS.some((kw) => text.includes(kw));
};
