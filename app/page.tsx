
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const WEDDING_DATE = new Date("2026-11-20T04:30:00+05:30").getTime();

const VENUE_URL =
  "https://www.google.com/maps/search/?api=1&query=Sowdeshwari+Mahal+Ammapet+Salem+636003";

const events = [
  {
    title: "Reception",
    weekday: "THURSDAY",
    day: "19",
    time: "7:00 PM – 10:30 PM",
  },
  {
    title: "Wedding Ceremony",
    weekday: "FRIDAY",
    day: "20",
    time: "4:30 AM – 5:30 AM",
  },
];

function FloralDecor({ className = "" }: { className?: string }) {
  return (
    <div className={`floral-decor ${className}`} aria-hidden="true">
      <span className="floral f1">✿</span>
      <span className="floral f2">❀</span>
      <span className="floral f3">✿</span>
      <span className="floral f4">❧</span>
      <span className="floral f5">✧</span>
      <span className="floral f6">✦</span>
    </div>
  );
}

function Lantern({ className = "" }: { className?: string }) {
  return (
    <div className={`lantern ${className}`} aria-hidden="true">
      <span className="lantern-string" />
      <span className="lantern-cap" />
      <span className="lantern-body">
        <span className="lantern-flame" />
        <span className="lantern-star">✦</span>
      </span>
      <span className="lantern-base" />
    </div>
  );
}

/* Falling blossom overlay: starts only after the button is clicked. */
function FallingBlossoms() {
  const petals = Array.from({ length: 42 }, (_, i) => i);

  return (
    <div className="blossom-overlay" aria-hidden="true">
      {petals.map((i) => {
        const symbols = ["✿", "❀", "✧", "✦", "❋"];
        const colors = ["pink", "plum", "gold", "cream"];
        return (
          <span
            key={i}
            className={`blossom-petal blossom-${colors[i % colors.length]}`}
            style={
              {
                "--left": `${(i * 47 + 3) % 100}%`,
                "--delay": `${(i % 14) * -0.55}s`,
                "--duration": `${7 + (i % 7) * 1.2}s`,
                "--size": `${12 + (i % 5) * 5}px`,
                "--sway": `${((i * 17) % 120) - 60}px`,
                "--spin": `${i % 2 === 0 ? 540 : -540}deg`,
              } as React.CSSProperties
            }
          >
            {symbols[i % symbols.length]}
          </span>
        );
      })}
    </div>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const updateCountdown = () => {
      const difference = Math.max(0, WEDDING_DATE - Date.now());

      setRemaining([
        Math.floor(difference / 86400000),
        Math.floor((difference / 3600000) % 24),
        Math.floor((difference / 60000) % 60),
        Math.floor((difference / 1000) % 60),
      ]);
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="countdown-grid">
      {["Days", "Hours", "Minutes", "Seconds"].map((label, index) => (
        <div className="countdown-box" key={label}>
          <strong>{String(remaining[index]).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="reveal-section"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reduceMotion = useReducedMotion();

  function openInvitation(event: React.MouseEvent<HTMLButtonElement>) {
    if (opened) return;

    event.currentTarget.blur();
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Reveal the invitation immediately without waiting for music.
    setOpened(true);

    const audio = audioRef.current;
    if (audio) {
      void audio
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    }
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    } else {
      audio.pause();
      setMusicOn(false);
    }
  }

  return (
    <main className="wedding-page">
      <audio
        ref={audioRef}
        src="/music/wedding-music.mp3"
        loop
        preload="auto"
        onPlay={() => setMusicOn(true)}
        onPause={() => setMusicOn(false)}
      />

      {/* Blossom animation appears after opening and floats over the page. */}
      {opened && <FallingBlossoms />}

      <AnimatePresence
        onExitComplete={() => {
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }}
      >
        {!opened && (
          <motion.div
            key="invitation-cover"
            className="opening-screen"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: reduceMotion ? 0.1 : 0.45,
                ease: "easeOut",
              },
            }}
          >
            <motion.div
              className="cover-background"
              exit={{
                opacity: 0,
                scale: reduceMotion ? 1 : 1.04,
                transition: { duration: reduceMotion ? 0.1 : 0.5 },
              }}
            />

            <motion.div
              className="cover-border"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            />

            <FloralDecor className="cover-florals" />
            <Lantern className="cover-lantern cover-lantern-left" />
            <Lantern className="cover-lantern cover-lantern-right" />

            <motion.div
              className="cover-content"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              exit={{
                opacity: 0,
                y: -12,
                transition: { duration: 0.2 },
              }}
            >
              <p className="eyebrow">TOGETHER WITH OUR FAMILIES</p>

              <div className="monogram">
                M<span>&amp;</span>R
              </div>

              <div className="ornament">
                <span>✦</span>
              </div>

              <h1 className="cover-names">
                <span>Manivannan</span>
                <i>&amp;</i>
                <span>Rajalakshmi</span>
              </h1>

              <p className="cover-message">
                Joyfully invite you to celebrate
                <br />
                the beginning of their forever.
              </p>

              <div className="date-panel">
                <span className="date-label">SAVE THE DATES</span>

                <div className="date-numbers">
                  <div>
                    <strong>19</strong>
                    <small>THU</small>
                  </div>
                  <i>&amp;</i>
                  <div>
                    <strong>20</strong>
                    <small>FRI</small>
                  </div>
                </div>

                <span className="date-rule" />
                <strong className="date-month">NOVEMBER 2026</strong>
                <span className="date-place">SALEM · TAMIL NADU</span>
              </div>

              <p className="cover-quote">
                A new chapter begins,
                <br />
                with our families’ blessings.
              </p>

              <motion.button
                type="button"
                className="open-button"
                onClick={openInvitation}
                whileHover={{ scale: 1.035, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Open Our Invitation <span>↗</span>
              </motion.button>

              <p className="cover-footer">
                A PROMISE OF LOVE · A LIFETIME OF TOGETHERNESS
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="site-header">
        <a href="#home" className="header-logo">
          M<span>&amp;</span>R
        </a>
        <span className="header-middle">THE WEDDING INVITATION</span>
        <span className="header-right">NOV · 2026</span>
      </header>

      <button
        type="button"
        className="music-button"
        onClick={toggleMusic}
        aria-label={musicOn ? "Pause wedding music" : "Play wedding music"}
      >
        <span className="music-note">{musicOn ? "♫" : "♪"}</span>
        {musicOn ? "Music On" : "Music Off"}
        <span>{musicOn ? "Ⅱ" : "▶"}</span>
      </button>

      <section className="hero-section" id="home">
        <FloralDecor className="hero-florals" />
        <Lantern className="hero-lantern hero-lantern-left" />
        <Lantern className="hero-lantern hero-lantern-right" />

        <div className="hero-copy">
          <p className="eyebrow">A CELEBRATION OF LOVE</p>
          <h2>
            Two hearts,
            <br />
            <em>one forever.</em>
          </h2>
          <div className="ornament">✦</div>

          <p className="hero-names">
            Manivannan <span>&amp;</span> Rajalakshmi
          </p>

          <p className="hero-description">
            With the love and blessings of our families, we invite you to
            celebrate the beginning of our life together.
          </p>

          <div className="hero-date">
            <span>OUR WEDDING DATES</span>
            <strong>
              19 <i>—</i> 20
            </strong>
            <b>NOVEMBER 2026</b>
            <small>SALEM · TAMIL NADU</small>
          </div>

          <a href="#celebrations" className="gold-button">
            Explore Our Celebration <span>↓</span>
          </a>
        </div>

        <div className="couple-photo">
          <div className="photo-frame">
            <img
              src="/images/couple.jpg"
              alt="Manivannan and Rajalakshmi together"
            />
          </div>
          <p>A moment to cherish, a lifetime to share.</p>
        </div>

        <p className="hero-bottom">WITH LOVE · WITH BLESSINGS · WITH YOU</p>
      </section>

      <Reveal>
        <section className="message-section">
          <FloralDecor className="light-florals" />
          <p className="eyebrow">A NOTE FROM OUR HEARTS</p>
          <span className="section-flower">❀</span>
          <h2>
            Your presence
            <br />
            <em>makes it complete.</em>
          </h2>
          <p className="message-copy">
            Some moments become treasured memories, and some beginnings
            become a lifetime of happiness. With the blessings of our
            families, we would be honoured to have you with us as we begin
            our journey together.
          </p>
          <p className="signature">
            Manivannan <span>&amp;</span> Rajalakshmi
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="countdown-section">
          <FloralDecor className="light-florals" />
          <p className="eyebrow">THE COUNTDOWN TO OUR FOREVER</p>
          <h2>
            Our forever
            <br />
            <em>begins soon.</em>
          </h2>
          <p className="countdown-copy">
            Every moment brings us closer to the day we celebrate our love
            with all of you.
          </p>
          <Countdown />
          <p className="countdown-caption">
            COUNTING DOWN TO 20 NOVEMBER 2026
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="events-section" id="celebrations">
          <FloralDecor className="light-florals" />
          <p className="eyebrow">SAVE THESE DATES</p>
          <h2>
            Our <em>celebrations</em>
          </h2>
          <p className="section-intro">
            Two beautiful occasions, one unforgettable beginning.
          </p>

          <div className="events-grid">
            {events.map((event) => (
              <motion.article
                className="event-card"
                key={event.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <span className="event-icon">✧</span>
                <p className="eyebrow">{event.weekday}</p>
                <h3>{event.title}</h3>
                <strong className="event-date">{event.day}</strong>
                <p className="event-month">NOVEMBER 2026</p>
                <span className="event-divider">✦</span>
                <p className="event-time">{event.time}</p>
                <p className="event-venue">Sowdeshwari Mahal</p>
                <p className="event-address">Ammapet, Salem – 636003</p>
              </motion.article>
            ))}
          </div>

          <p className="events-note">
            Both celebrations will be held at Sowdeshwari Mahal, Ammapet.
          </p>

          <a
            className="gold-button"
            href={VENUE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Get Venue Directions <span>↗</span>
          </a>
        </section>
      </Reveal>

      <Reveal>
        <section className="venue-section">
          <FloralDecor className="venue-florals" />
          <Lantern className="venue-lantern venue-lantern-left" />
          <Lantern className="venue-lantern venue-lantern-right" />
          <p className="eyebrow">WHERE OUR MEMORIES BEGIN</p>
          <h2>
            Meet us in <em>Salem.</em>
          </h2>

          <div className="venue-card">
            <span className="venue-symbol">⌖</span>
            <p className="eyebrow">THE CELEBRATION VENUE</p>
            <h3>Sowdeshwari Mahal</h3>
            <p>Ammapet, Salem – 636003</p>
            <p>Tamil Nadu, India</p>
            <a
              className="gold-button"
              href={VENUE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions <span>↗</span>
            </a>
          </div>
        </section>
      </Reveal>

      <section className="closing-section">
        <FloralDecor className="closing-florals" />
        <Lantern className="closing-lantern closing-lantern-left" />
        <Lantern className="closing-lantern closing-lantern-right" />
        <div className="closing-content">
          <span className="section-flower">❀</span>
          <p className="eyebrow">WITH LOVE AND GRATITUDE</p>
          <h2>
            Your blessings
            <br />
            <em>are our greatest gift.</em>
          </h2>
          <p>We look forward to celebrating with you.</p>
          <div className="closing-logo">
            M<span>&amp;</span>R
          </div>
          <p className="closing-names">MANIVANNAN &amp; RAJALAKSHMI</p>
          <p className="closing-date">19 · 20 NOVEMBER 2026</p>
        </div>
      </section>

      <footer className="site-footer">
        <a href="#home" className="header-logo">
          M<span>&amp;</span>R
        </a>
        <p>Made with love for our favourite people.</p>
        <a href="#home" className="back-top">
          Back to top ↑
        </a>
        <span>WEDDING INVITATION · 2026</span>
      </footer>
    </main>
  );
}
