export const weddingDetails = {
  bride: "Akila Antony",
  groom: "Michael ",
  dateISO: "2026-12-22T11:30:00",
  invitation: {
    eyebrow: "The wedding of",
    groomParents: "Mr. Siluvai Antony / Mrs. Shyla Antony",
    brideParents: "Mr. Antony / Mrs. Lueis Mary",
    together: "Together with their families",
    date: "Tuesday, December 22, 2026",
    time: "11:30 AM onwards",
    church: "Villa Podere",
  },
  venue: {
    name: "Villa Podere",
    address: "Siluvaipuram",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=St.+John+Of+The+Cross+Church+Siluvaipuram",
  },
  events: [
    { time: "11:30", title: "Guest Arrival", icon: "rings" },
    { time: "12:00", title: "Ceremony", icon: "ceremony" },
    { time: "13:00", title: "Photo Session", icon: "photos" },
    { time: "14:00", title: "Reception", icon: "banquet" },
    { time: "16:00", title: "Dinner & Speeches", icon: "speeches" },
    { time: "19:00", title: "End of Evening", icon: "farewell" },
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