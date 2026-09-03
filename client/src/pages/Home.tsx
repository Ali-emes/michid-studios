import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  Check,
  Download,
  Globe2,
  Instagram,
  Linkedin,
  Megaphone,
  Menu,
  MoveDown,
  Nfc,
  Phone,
  PenTool,
  Send,
  X,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const projects = [
  {
    number: "01",
    name: "Mantra Chicago",
    discipline: "Web design · Menu experience",
    statement: "A menu that feels as considered as the table.",
    description: "A restrained dine-in menu experience that turns a late-night decision into an effortless one.",
    image: "/manus-storage/mantra-table_2a091e0c.jpg",
    tone: "red",
    details: ["Dine-in UI", "Mobile first", "Food direction"],
  },
  {
    number: "02",
    name: "Besbarmak",
    discipline: "Social presence · Content system",
    statement: "A heritage story, made social.",
    description: "A content language that gives a beloved Kazakh restaurant a consistent, craveable digital rhythm.",
    image: "/manus-storage/besbarmak-social_7b31d7bb.jpg",
    tone: "gold",
    details: ["Content pillars", "Post templates", "Social launch"],
  },
  {
    number: "03",
    name: "Afterhours Auto",
    discipline: "Brand world · Lead generation",
    statement: "For a service built on reflection.",
    description: "A detail-first brand and lead flow for a detailing studio where every surface makes the case.",
    image: "/manus-storage/detail-auto_6e78fac2.jpg",
    tone: "slate",
    details: ["Brand system", "Lead capture", "Photo direction"],
  },
  {
    number: "04",
    name: "Miras Tires",
    discipline: "Family business · Social commerce",
    statement: "A family business built to move Mongolia.",
    description: "Imported tires from Russia and China, turned into a trusted digital storefront for drivers across Ulaanbaatar and beyond.",
    image: "/manus-storage/733975029_1761908731967782_325471598797480933_n_70945693.jpg",
    tone: "tire",
    details: ["11K Facebook followers", "$1M+ business", "Social commerce"],
  },
];

const gallery = [
  { src: "/manus-storage/portrait-studio_0557b47f.jpg", label: "Studio studies / 01", span: "tall" },
  { src: "/manus-storage/mantra-table_2a091e0c.jpg", label: "Mantra / 02", span: "square" },
  { src: "/manus-storage/ads-sculpture_7043b359.jpg", label: "Campaign objects / 03", span: "square" },
  { src: "/manus-storage/besbarmak-social_7b31d7bb.jpg", label: "Besbarmak / 04", span: "wide" },
];

const capabilities: { number: string; title: string; copy: string; Icon: LucideIcon }[] = [
  { number: "01", title: "Digital menus + QR / NFC", copy: "A menu guests can actually use, and a system you can update without reprinting.", Icon: Nfc },
  { number: "02", title: "Website design", copy: "Fast, mobile-first sites that make the next step obvious — book, order, call, or visit.", Icon: Globe2 },
  { number: "03", title: "Photography + video", copy: "Food, drinks, rooms, people, and short-form edits captured to be used, not shelved.", Icon: Camera },
  { number: "04", title: "Graphic design + branding", copy: "Posters, menus, and brand systems that make everyday touchpoints feel like one world.", Icon: PenTool },
  { number: "05", title: "Social + ad management", copy: "A clear content rhythm and focused Meta campaigns, reported in plain language.", Icon: Megaphone },
];

const offers = [
  {
    name: "Appetizer",
    price: "$199",
    label: "One-time",
    description: "Your digital menu, ready to scan.",
    features: ["Custom digital menu design", "QR code + NFC tag setup", "3 months of menu updates", "Always mobile-optimized"],
  },
  {
    name: "Main Course",
    price: "$349",
    label: "per month",
    description: "Your presence, professionally maintained.",
    featured: true,
    features: ["Everything in Appetizer", "8 photo + video pieces / month", "Full social posting + management", "Monthly content calendar"],
  },
  {
    name: "Full Course",
    price: "$649",
    label: "per month + ad spend",
    description: "Your growth engine, built around one clear offer.",
    features: ["Everything in Main Course", "Meta campaign setup + management", "Monthly performance report", "Priority support + strategy calls"],
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Logo() {
  return (
    <button className="wordmark" onClick={() => scrollToSection("top")} aria-label="Back to top">
      MICHID <b>MEDIA</b><span>®</span>
    </button>
  );
}

function ProjectArt({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className={`project-art project-art--${project.tone}`}>
      <img src={project.image} alt="" />
      <div className="project-art__shade" />
      {project.number === "01" && (
        <div className="menu-window" aria-hidden="true">
          <div className="menu-window__top"><span>MANTRA</span><span>×</span></div>
          <div className="menu-window__content">
            <p>DINNER / CHICAGO</p>
            <h4>Share the<br />whole table.</h4>
            <div className="menu-line"><span>Spicy rigatoni</span><b>18</b></div>
            <div className="menu-line"><span>Wood-fire carrots</span><b>12</b></div>
            <div className="menu-line"><span>Cherry old fashioned</span><b>15</b></div>
          </div>
        </div>
      )}
      {project.number === "02" && (
        <div className="social-window" aria-hidden="true">
          <div className="social-window__bar"><span>●</span><span>besbarmak.kazakh</span><b>Follow</b></div>
          <div className="social-window__body"><span>01</span><p>Traditional comfort.<br />A new conversation.</p><i>CHICAGO, IL</i></div>
        </div>
      )}
      {project.number === "03" && (
        <div className="auto-mark" aria-hidden="true"><span>AFTER</span><strong>HOURS</strong><i>DETAILING STUDIO</i></div>
      )}
      {project.number === "04" && (
        <div className="tire-proof" aria-hidden="true"><span>MIRAS TIRES</span><strong>11K+</strong><i>FACEBOOK FOLLOWERS</i><b>FAMILY BUSINESS / MONGOLIA</b></div>
      )}
      <div className="project-art__badge"><span>{project.number}</span><span>SELECTED WORK</span></div>
    </div>
  );
}

export default function Home() {
  const { data: uploadedGallery = [] } = trpc.gallery.list.useQuery();
  const galleryItems = useMemo(
    () => [...gallery, ...uploadedGallery.map((asset) => ({ src: asset.fileUrl, label: asset.title, span: "square" as const }))],
    [uploadedGallery],
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".case-card");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveProject(Number((entry.target as HTMLElement).dataset.index));
      }),
      { threshold: 0.56 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Thanks — your project note is ready to send.", {
      description: "This preview form is ready to connect to your inbox at launch.",
    });
    event.currentTarget.reset();
  };

  const downloadGuide = () => {
    const guide = `MICHID MEDIA — STARTING POINTS\n\nDIGITAL PRESENCE\nA sharp landing page, offer clarity, and a lead-capture path.\n\nCONTENT SYSTEM\nA tailored visual direction, photo/video edits, and templates built to be used.\n\nCAMPAIGN LAUNCH\nAd creative, campaign structure, and reporting built around a clear offer.\n\nEvery project is scoped around the business, not a fixed bundle.\nStart the conversation: hello@michid.studio`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([guide], { type: "text/plain" }));
    link.download = "MICHID-Media-Starting-Points.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Starting points downloaded.");
  };

  return (
    <main id="top" className="site-shell">
      <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
        <Logo />
        <nav className="nav__links" aria-label="Primary navigation">
          <button onClick={() => scrollToSection("work")}>Work</button>
          <button onClick={() => scrollToSection("services")}>Capabilities</button>
          <button onClick={() => scrollToSection("offers")}>Offers</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
        </nav>
        <button className="nav__cta" onClick={() => scrollToSection("contact")}><span>Start a project</span><ArrowUpRight size={15} /></button>
        <button className="nav__menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mobile-menu__head"><Logo /><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={24} /></button></div>
            {["Work", "Capabilities", "Offers", "Contact"].map((item) => (
              <button key={item} onClick={() => { scrollToSection(item === "Capabilities" ? "services" : item.toLowerCase()); setMenuOpen(false); }}>{item}<ArrowUpRight size={20} /></button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__grain" />
        <div className="hero__eyebrow"><span className="pulse" /> Independent digital studio <span className="hero__eyebrow-separator">·</span> Chicago <span className="hero__eyebrow-separator">·</span> Mongolia</div>
        <div className="hero__main">
          <motion.h1 id="hero-heading" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}>
            Make the first<br /><em>impression</em> count.
          </motion.h1>
          <motion.aside className="hero__aside" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.55 }}>
            <span className="hero__aside-label">MICHID / 001</span>
            <p>Websites, campaigns, and content systems for businesses with something to say.</p>
            <button onClick={() => scrollToSection("contact")}><span>Tell us what matters</span><ArrowDownRight size={17} /></button>
          </motion.aside>
        </div>
        <motion.div className="hero__bottom" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}>
          <div className="hero__proof"><strong>Built for the moment that matters.</strong><span>A booking. A menu choice. A message. A sale.</span></div>
          <button className="scroll-prompt" onClick={() => scrollToSection("work")}><span>Explore selected work</span><MoveDown size={17} /></button>
        </motion.div>
        <div className="hero-sun" /><div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" /><span className="hero__coordinate">47°55′N / 106°55′E</span>
      </section>

      <section id="work" className="work-section" aria-labelledby="work-heading">
        <div className="section-kicker"><span>01 — Selected work</span><span>{String(activeProject + 1).padStart(2, "0")} / 04</span></div>
        <div className="work-intro"><div><span className="eyebrow-dark">A small studio with a clear point of view.</span><h2 id="work-heading">Digital work with<br /><em>an aftertaste.</em></h2></div><p>Every project starts with the real-world moment that matters: a booking, a menu choice, a message, a sale.</p></div>
        <div className="case-stack">
          {projects.map((project, index) => (
            <article className="case-card" data-index={index} key={project.number} style={{ "--card-index": index } as React.CSSProperties}>
              <div className="case-card__copy">
                <div className="case-card__meta"><span>{project.number}</span><span>{project.discipline}</span></div>
                <h3>{project.name}</h3>
                <p className="case-card__statement">{project.statement}</p>
                <p className="case-card__description">{project.description}</p>
                <div className="tag-row">{project.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
                <button className="case-card__link" onClick={() => toast("Detailed case studies can be added as client approvals arrive.")}><span>View direction</span><ArrowDownRight size={18} /></button>
                {project.number === "01" && <div className="case-links"><a href="https://www.mantrachicago.com/" target="_blank" rel="noreferrer">Visit Mantra <ArrowUpRight size={13} /></a></div>}
                {project.number === "02" && <div className="case-links"><a href="https://www.instagram.com/besbarmak_kazakh_restaurant/" target="_blank" rel="noreferrer"><Instagram size={13} /> Instagram</a><a href="https://www.facebook.com/BesbarmakKazakhRestaurant/" target="_blank" rel="noreferrer"><span className="facebook-letter">f</span> Facebook</a></div>}
                {project.number === "04" && <div className="case-links"><a href="https://www.instagram.com/mirastires/" target="_blank" rel="noreferrer"><Instagram size={13} /> Instagram</a><a href="https://www.facebook.com/100044460162053/" target="_blank" rel="noreferrer"><span className="facebook-letter">f</span> Facebook</a></div>}
              </div>
              <ProjectArt project={project} />
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto-section" aria-label="Studio point of view">
        <div className="manifesto__marker">*</div>
        <p>Good work should be <em>felt</em> before it gets explained.</p>
        <div className="manifesto__footer"><div className="manifesto__rule" /><span>From first click to first order</span></div>
        <div className="manifesto__orbit" />
      </section>

      <section className="gallery-section" aria-labelledby="gallery-heading">
        <div className="section-kicker"><span>02 — Visual language</span><span>Scroll / Tap to expand</span></div>
        <div className="gallery-intro"><div><span className="eyebrow-dark">The details do the talking.</span><h2 id="gallery-heading">The work<br />between the work.</h2></div><p>Photography, posters, and visual systems that give everyday businesses a sharper point of view.</p></div>
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <button className={`gallery-item gallery-item--${item.span}`} onClick={() => setLightbox(index)} key={item.label} aria-label={`Open ${item.label}`}>
              <img src={item.src} alt={item.label} /><div className="gallery-item__overlay"><span>{item.label}</span><ArrowUpRight size={20} /></div>
            </button>
          ))}
        </div>
      </section>

      <section id="services" className="services-section" aria-labelledby="services-heading">
        <div className="services-section__head"><div><div className="section-kicker"><span>03 — Capabilities</span><span>Built around the business</span></div><h2 id="services-heading">Not more noise.<br /><em>More signal.</em></h2></div><p>One studio for the pieces that shape how a customer finds you, understands you, and decides to act.</p></div>
        <div className="capability-grid">
          {capabilities.map(({ number, title, copy, Icon }) => (
            <article className="capability-card" key={number}><div className="capability-card__top"><span>{number}</span><Icon size={20} strokeWidth={1.5} /></div><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="service-note"><span>01</span><p>Good systems compound. A menu becomes a first impression. A content system becomes a habit. A clear offer becomes a reason to click.</p><button onClick={() => scrollToSection("contact")}>Build the right system <ArrowUpRight size={16} /></button></div>
      </section>

      <section className="process-section" aria-labelledby="process-heading">
        <div className="process-section__intro"><span className="section-label">04 — How we work</span><h2 id="process-heading">A clear path<br /><em>from idea to action.</em></h2><p>No template shop, no black box. We make the work visible, test it on a real phone, and keep the next move clear.</p></div>
        <div className="process-list">
          {["Discover", "Design", "Launch", "Grow"].map((step, index) => (
            <div className="process-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step}</h3><p>{["A short conversation about the business, the customer, and what is not working online today.", "Menu, content, or ad creative gets built around the brand — nothing generic, nothing off the shelf.", "The new digital menu, site, or campaign goes live, tested on an actual phone before anything ships.", "Ongoing content and ad performance get reviewed and adjusted every month, not left on autopilot."][index]}</p></div><ArrowUpRight size={18} /></div>
          ))}
        </div>
        <div className="report-card"><div><span className="eyebrow-dark">What you see every month</span><h3>Plain-language reporting.<br /><em>Useful next moves.</em></h3></div><div className="report-metrics"><div><span>Reach</span><strong>—</strong></div><div><span>Engagement</span><strong>—</strong></div><div><span>Spend</span><strong>—</strong></div><div><span>Next move</span><strong>→</strong></div></div></div>
      </section>

      <section id="offers" className="offers-section" aria-labelledby="offers-heading">
        <div className="section-kicker"><span>05 — Starting points</span><span>No add-on maze</span></div>
        <div className="offers-intro"><div><span className="eyebrow-dark">Simple enough to decide on the spot.</span><h2 id="offers-heading">Choose your<br /><em>next course.</em></h2></div><div><p>Three straightforward ways to get moving. Every business is different, so each plan can be shaped around the real need and the budget.</p><button className="download-link" onClick={downloadGuide}>Download starting points <Download size={16} /></button></div></div>
        <div className="offers-grid">
          {offers.map((offer) => (
            <article className={`offer-card ${offer.featured ? "offer-card--featured" : ""}`} key={offer.name}>
              {offer.featured && <span className="offer-card__badge">Chef’s pick</span>}
              <span className="offer-card__label">{offer.name}</span><div className="offer-card__price">{offer.price}<small>{offer.label}</small></div><p>{offer.description}</p>
              <div className="offer-card__rule" />
              <ul>{offer.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
              <button onClick={() => scrollToSection("contact")} className="offer-card__link">Start with {offer.name} <ArrowUpRight size={16} /></button>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section" aria-labelledby="contact-heading">
        <div className="contact-section__top"><span>06 — Start a conversation</span><span>Available for select projects</span></div>
        <div className="contact-section__grid">
          <div><span className="contact-section__kicker">Your next customer is already looking.</span><h2 id="contact-heading">Your business<br />already has a story.<br /><em>Let’s sharpen it.</em></h2><p className="about-note">MICHID means the Pleiades in Mongolian — a small constellation, a clear point of view. We’re an independent studio working between Kazakh and Mongolian cultures, Chicago and Ulaanbaatar.</p><a className="email-link" href="mailto:hello@michid.studio">hello@michid.studio <ArrowUpRight size={20} /></a></div>
          <form onSubmit={submitContact} className="contact-form">
            <label>Your name<input required name="name" placeholder="How should I call you?" /></label>
            <label>Email address<input required type="email" name="email" placeholder="you@business.com" /></label>
            <label>What are we making?<textarea required name="message" placeholder="A new site, a campaign, a better digital presence..." rows={3} /></label>
            <button type="submit" className="submit-button"><span>Send project note</span><Send size={16} /></button>
          </form>
        </div>
        <footer className="footer"><Logo /><div className="footer__socials"><a href="https://www.instagram.com/ali_emes/" target="_blank" rel="noreferrer"><Instagram size={15} /> @ali_emes</a><a href="mailto:hello@michid.studio"><Send size={14} /> Email</a><a href="tel:+13093502260" className="footer__contact"><Phone size={14} /> +1 309 350 2260</a><Link href="/manage" className="footer__manage">Owner access</Link></div><span>© {new Date().getFullYear()} MICHID MEDIA</span></footer>
      </section>

      <AnimatePresence>
        {lightbox !== null && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}><button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Close image"><X size={21} /></button><motion.img src={galleryItems[lightbox].src} alt={galleryItems[lightbox].label} initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={(event) => event.stopPropagation()} /></motion.div>}
      </AnimatePresence>
    </main>
  );
}
