export const translations = {
  en: {
    slogan: "The best way to reach the heart is through the stomach",
    menuButton: "Menu",
    payButton: "Pay",
    tableService: "Table service",
    selectTable: "Select your table",
    validate: "Validate",
    basket: (count: number) => `Basket (${count})`,
    myOrder: "My order",
    addToBasket: "Add to basket",
    orderOverview: "Overview",
    emptyCart: "Your cart is empty.",
    continue: "Continue",
  },
  de: {
    slogan: "Der beste Weg zum Herzen führt durch den Magen",
    menuButton: "Menü",
    payButton: "Bezahlen",
    tableService: "Tischservice",
    selectTable: "Wähle deinen Tisch",
    validate: "Bestätigen",
    basket: (count: number) => `Warenkorb (${count})`,
    myOrder: "Meine Bestellung",
    addToBasket: "Zum Warenkorb",
    orderOverview: "Übersicht",
    emptyCart: "Dein Warenkorb ist leer.",
    continue: "Weiter",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;