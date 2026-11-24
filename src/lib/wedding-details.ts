export const weddingDetails = {
  bride: "Olivia",
  groom: "Daniel",
  dateISO: "2027-11-22T15:00:00",
  venue: {
    name: "Villa Podere",
    address: "Val d’Orcia, Tuscany, Italy",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Villa+Podere+Val+d%27Orcia+Tuscany+Italy",
  },
  events: [
    { time: "15:00", title: "Guest Arrival", icon: "rings" },
    { time: "15:30", title: "Canapés & Refreshments", icon: "refreshments" },
    { time: "16:00", title: "Ceremony", icon: "ceremony" },
    { time: "16:30", title: "Photo Session", icon: "photos" },
    { time: "18:00", title: "Banquet", icon: "banquet" },
    { time: "20:30", title: "Dinner & Speeches", icon: "speeches" },
    { time: "23:00", title: "End of Evening", icon: "farewell" },
  ],
  dressPalette: [
    { name: "Ivory", className: "swatch-ivory" },
    { name: "Sage", className: "swatch-sage" },
    { name: "Olive", className: "swatch-olive" },
    { name: "Soft rose", className: "swatch-rose" },
    { name: "Forest", className: "swatch-forest" },
  ],
  dressDescription:
    "Our most important gift is your presence. Muted, garden-inspired colours will feel right at home.",
} as const;