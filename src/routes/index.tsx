import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Heart,
  MapPin,
  Mic2,
  Quote,
  Sparkles,
  Utensils,
  Wine,
  X,
  type LucideIcon,
} from "lucide-react";
import * as QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import couplePhoto from "@/assets/wedding-couple.jpg.asset.json";
import detailPhoto from "@/assets/wedding-details.jpg.asset.json";
import floralGarland from "@/assets/wedding-florals.jpg.asset.json";
import receptionPhoto from "@/assets/wedding-reception.jpg.asset.json";
import venuePhoto from "@/assets/wedding-venue.jpg.asset.json";
import { weddingDetails } from "@/lib/wedding-details";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Olivia & Daniel | A Garden Wedding Invitation" },
      {
        name: "description",
        content:
          "Join Olivia and Daniel for a garden wedding at Villa Podere on November 22, 2027. Explore the day’s programme, venue, and gallery.",
      },
      { property: "og:title", content: "Olivia & Daniel | A Garden Wedding Invitation" },
      {
        property: "og:description",
        content: "A little invitation to a day filled with flowers, family, and forever.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeddingPage,
});

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

const eventIcons: Record<(typeof weddingDetails.events)[number]["icon"], LucideIcon> = {
  rings: Heart,
  refreshments: Wine,
  ceremony: Flower2,
  photos: Camera,
  banquet: Utensils,
  speeches: Mic2,
  farewell: Sparkles,
};

const galleryPhotos = [
  { src: venuePhoto.url, alt: "The villa and garden prepared for the wedding" },
  { src: receptionPhoto.url, alt: "Candlelit tables beneath the evening lights" },
  { src: couplePhoto.url, alt: "Olivia and Daniel together in the garden" },
  { src: detailPhoto.url, alt: "Ivory roses and wedding rings" },
];

function WeddingPage() {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [qrImage, setQrImage] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const activePhoto = lightboxIndex === null ? undefined : galleryPhotos[lightboxIndex];

  const weddingDate = new Date(weddingDetails.dateISO);
  const longDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(weddingDate);

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = Math.max(0, weddingDate.getTime() - Date.now());
      setCountdown({
        days: Math.floor(remaining / 86_400_000),
        hours: Math.floor((remaining % 86_400_000) / 3_600_000),
        minutes: Math.floor((remaining % 3_600_000) / 60_000),
        seconds: Math.floor((remaining % 60_000) / 1_000),
      });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(interval);
  }, [weddingDate]);

  useEffect(() => {
    let isCurrent = true;
    void QRCode.toDataURL(window.location.href, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: "M",
    })
      .then((dataUrl) => {
        if (isCurrent) setQrImage(dataUrl);
      })
      .catch(() => {
        if (isCurrent) setQrImage("");
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return () => root.classList.remove("motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? null : (current - 1 + galleryPhotos.length) % galleryPhotos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? null : (current + 1) % galleryPhotos.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const [yearPart, monthPart, dayPart] = weddingDetails.dateISO
    .slice(0, 10)
    .split("-")
    .map(Number);
  const year = yearPart ?? 2027;
  const month = monthPart ?? 11;
  const weddingDay = dayPart ?? 22;
  const dayCount = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const calendarCells: Array<number | string> = [
    ...Array.from({ length: firstWeekday }, (_, index) => `empty-${index}`),
    ...Array.from({ length: dayCount }, (_, index) => index + 1),
  ];
  const visiblePhotos = showAllPhotos ? galleryPhotos : galleryPhotos.slice(0, 3);

  return (
    <main className="wedding-page">
      <div className="wedding-frame">
        <header className="page-header">
          <div className="header-monogram" aria-hidden="true">
            <span>O</span>
            <Heart size={13} fill="currentColor" />
            <span>D</span>
          </div>
          <p className="header-label">A garden celebration</p>
          <p className="header-date">{longDate}</p>
        </header>

        <div className="invitation-grid">
          <section className="invitation-column invitation-column--left" aria-labelledby="invite-title">
            <div className="invitation-opening reveal">
              <p className="eyebrow">Together with their families</p>
              <span className="tiny-divider" aria-hidden="true">
                <span />
                <Heart size={12} fill="currentColor" />
                <span />
              </span>
              <h1 id="invite-title" className="couple-names">
                <span>{weddingDetails.bride}</span>
                <span className="names-and">and</span>
                <span>{weddingDetails.groom}</span>
              </h1>
              <p className="invitation-line">Invite you to their wedding</p>
            </div>

            <figure className="couple-portrait reveal">
              <img src={couplePhoto.url} alt="A couple sharing a quiet moment in a garden" />
            </figure>

            <div className="invitation-copy reveal">
              <p className="script-heading">We are getting</p>
              <h2 className="section-heading">Married</h2>
              <span className="tiny-divider" aria-hidden="true">
                <span />
                <Heart size={12} fill="currentColor" />
                <span />
              </span>
              <p className="body-copy">
                We would be delighted if you joined us for a day of love, laughter, and a little
                garden magic.
              </p>
            </div>

            <div className="date-block reveal">
              <p className="eyebrow date-eyebrow">Save the date</p>
              <p className="date-large">
                {weddingDate.getDate()} <span>·</span> {String(weddingDate.getMonth() + 1).padStart(2, "0")} <span>·</span>{" "}
                {weddingDate.getFullYear()}
              </p>
              <p className="date-weekday">
                {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(weddingDate)}
              </p>

              <div className="countdown" aria-label="Countdown to the wedding">
                {([
                  [countdown.days, "days"],
                  [countdown.hours, "hours"],
                  [countdown.minutes, "minutes"],
                  [countdown.seconds, "seconds"],
                ] as const).map(([value, label]) => (
                  <div className="countdown-unit" key={label}>
                    <span className="countdown-number">{String(value).padStart(2, "0")}</span>
                    <span className="countdown-label">{label}</span>
                  </div>
                ))}
              </div>

              <MiniCalendar
                year={year}
                month={month}
                weddingDay={weddingDay}
                cells={calendarCells}
              />
            </div>

            <footer className="column-footer column-footer--photo reveal">
              <img src={receptionPhoto.url} alt="An intimate candlelit reception at the villa" />
              <div className="footer-photo-shade" />
              <div className="footer-signoff">
                <p className="script-heading">With love</p>
                <p>{weddingDetails.bride} &amp; {weddingDetails.groom}</p>
              </div>
            </footer>
          </section>

          <section className="invitation-column invitation-column--center" aria-labelledby="program-title">
            <div className="program-intro reveal">
              <img className="floral-canopy" src={floralGarland.url} alt="White roses and trailing greenery" />
              <Flower2 className="botanical-mark" size={26} strokeWidth={1.2} aria-hidden="true" />
              <p className="eyebrow">A day to remember</p>
              <h2 id="program-title" className="program-title">
                <span>Wedding</span>
                <span className="script-heading">Program</span>
              </h2>
              <span className="tiny-divider" aria-hidden="true">
                <span />
                <Heart size={12} fill="currentColor" />
                <span />
              </span>
            </div>

            <ol className="timeline">
              {weddingDetails.events.map((event, index) => {
                const EventIcon = eventIcons[event.icon];
                return (
                  <li className="timeline-item reveal" key={`${event.time}-${event.title}`}>
                    <div className="timeline-marker" aria-hidden="true">
                      <span className="timeline-icon">
                        <EventIcon size={21} strokeWidth={1.45} />
                      </span>
                      {index < weddingDetails.events.length - 1 && <span className="timeline-line" />}
                    </div>
                    <div className="timeline-copy">
                      <p className="timeline-time">{event.time}</p>
                      <p className="timeline-title">{event.title}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <section className="dress-panel reveal" aria-labelledby="dress-code-title">
              <p className="eyebrow">A note on attire</p>
              <h3 id="dress-code-title" className="dress-title">Dress code</h3>
              <span className="tiny-divider tiny-divider--light" aria-hidden="true">
                <span />
                <Heart size={12} fill="currentColor" />
                <span />
              </span>
              <div className="dress-swatches" aria-label="Suggested wedding colours">
                {weddingDetails.dressPalette.map((color) => (
                  <span
                    key={color.name}
                    className={`dress-swatch ${color.className}`}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
              <p className="dress-copy">
                {weddingDetails.dressDescription}
              </p>
              <p className="dress-note">Garden formal · muted tones encouraged</p>
            </section>

            <section className="quote-section reveal" aria-label="A wedding thought">
              <img className="quote-florals" src={floralGarland.url} alt="" aria-hidden="true" />
              <Quote className="quote-mark" size={26} fill="currentColor" aria-hidden="true" />
              <blockquote>
                A successful marriage requires falling in love many times, always with the same
                person.
              </blockquote>
              <span className="tiny-divider" aria-hidden="true">
                <span />
                <Heart size={12} fill="currentColor" />
                <span />
              </span>
            </section>
          </section>

          <section className="invitation-column invitation-column--right" aria-labelledby="venue-title">
            <section className="venue-section reveal" aria-labelledby="venue-title">
              <p className="eyebrow">Gather with us</p>
              <h2 id="venue-title" className="section-heading">Venue</h2>
              <span className="tiny-divider" aria-hidden="true">
                <span />
                <Heart size={12} fill="currentColor" />
                <span />
              </span>
              <figure className="venue-photo">
                <img src={venuePhoto.url} alt="Villa Podere surrounded by cypress trees and gardens" />
              </figure>
              <p className="script-heading venue-name">{weddingDetails.venue.name}</p>
              <p className="venue-address">
                <MapPin size={14} aria-hidden="true" />
                <span>{weddingDetails.venue.address}</span>
              </p>
              <Button asChild className="wedding-action">
                <a href={weddingDetails.venue.mapUrl} target="_blank" rel="noreferrer">
                  View on map <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </Button>
            </section>

            <section className="gallery-section reveal" aria-labelledby="gallery-title">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">Little moments</p>
                  <h2 id="gallery-title" className="section-heading">Gallery</h2>
                </div>
                <Flower2 className="gallery-flower" size={27} strokeWidth={1.2} aria-hidden="true" />
              </div>
              <div className="gallery-grid">
                {visiblePhotos.map((photo) => {
                  const photoIndex = galleryPhotos.indexOf(photo);
                  return (
                    <Button
                      key={photo.src}
                      type="button"
                      variant="ghost"
                      className={`gallery-photo gallery-photo--${photoIndex + 1}`}
                      onClick={() => setLightboxIndex(photoIndex)}
                      aria-label={`Open photo: ${photo.alt}`}
                    >
                      <img src={photo.src} alt={photo.alt} />
                    </Button>
                  );
                })}
              </div>
              <Button
                type="button"
                className="wedding-action gallery-more"
                onClick={() => setShowAllPhotos((current) => !current)}
              >
                {showAllPhotos ? "Show fewer photos" : "View more photos"}
              </Button>
            </section>

            <section className="website-section reveal" aria-labelledby="website-title">
              <p className="eyebrow">Keep the day close</p>
              <h2 id="website-title" className="section-heading">Visit our website</h2>
              <p className="body-copy">
                Scan for the latest wedding details and a little more about our story.
              </p>
              <a className="qr-link" href={typeof window === "undefined" ? "/" : window.location.href}>
                {qrImage ? (
                  <img className="qr-image" src={qrImage} alt="QR code linking to this wedding website" />
                ) : (
                  <span className="qr-placeholder" aria-label="Preparing QR code" />
                )}
              </a>
              <p className="qr-caption">A little keepsake for your camera roll</p>
            </section>

            <section className="thank-you reveal" aria-label="Thank you">
              <img src={couplePhoto.url} alt="Olivia and Daniel in the garden at golden hour" />
              <div className="thank-you-shade" />
              <div className="thank-you-copy">
                <p className="script-heading">Thank you!</p>
                <p>We can’t wait to celebrate with you.</p>
                <Heart size={13} fill="currentColor" aria-hidden="true" />
              </div>
            </section>
          </section>
        </div>

        <footer className="page-bottom">
          <span>With love, {weddingDetails.bride} &amp; {weddingDetails.groom}</span>
          <span>{longDate}</span>
        </footer>
      </div>

      {activePhoto && lightboxIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Wedding photo viewer"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lightbox-close"
            aria-label="Close photo viewer"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={22} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lightbox-arrow lightbox-arrow--left"
            aria-label="Previous photo"
            onClick={() =>
              setLightboxIndex((current) =>
                current === null ? null : (current - 1 + galleryPhotos.length) % galleryPhotos.length,
              )
            }
          >
            <ChevronLeft size={26} />
          </Button>
          <figure className="lightbox-figure">
            <img src={activePhoto.src} alt={activePhoto.alt} />
            <figcaption>{activePhoto.alt}</figcaption>
          </figure>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lightbox-arrow lightbox-arrow--right"
            aria-label="Next photo"
            onClick={() =>
              setLightboxIndex((current) =>
                current === null ? null : (current + 1) % galleryPhotos.length,
              )
            }
          >
            <ChevronRight size={26} />
          </Button>
        </div>
      )}
    </main>
  );
}

function MiniCalendar({
  year,
  month,
  weddingDay,
  cells,
}: {
  year: number;
  month: number;
  weddingDay: number;
  cells: Array<number | string>;
}) {
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(year, month - 1, 1),
  );

  return (
    <div className="mini-calendar" aria-label={`${monthName} ${year} calendar`}>
      <p className="calendar-month">{monthName} {year}</p>
      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((day) => (
          <span
            key={typeof day === "number" ? `day-${day}` : day}
            className={day === weddingDay ? "calendar-day calendar-day--wedding" : "calendar-day"}
          >
            {typeof day === "number" ? day : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
