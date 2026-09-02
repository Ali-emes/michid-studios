import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Circle,
  Download,
  Instagram,
  Linkedin,
  Menu,
  MoveDown,
  Phone,
  Send,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

const projects = [
  {
    number: "01",
    name: "Mantra Chicago",
    discipline: "Web Design · Menu Experience",
    statement: "A menu that feels as considered as the table.",
    description:
      "A restrained dine-in menu experience that turns a late-night decision into an effortless one.",
    image: "/manus-storage/mantra-table_2a091e0c.jpg",
    tone: "red",
    details: ["Dine-in UI", "Mobile first", "Food direction"],
  },
  {
    number: "02",
    name: "Besbarmak",
    discipline: "Social Presence · Content System",
    statement: "A heritage story, made social.",
    description:
      "A content language that gives a beloved Kazakh restaurant a consistent, craveable digital rhythm.",
    image: "/manus-storage/besbarmak-social_7b31d7bb.jpg",
    tone: "gold",
    details: ["Content pillars", "Post templates", "Social launch"],
  },
  {
    number: "03",
    name: "Afterhours Auto",
    discipline: "Brand World · Lead Generation",
    statement: "For a service built on reflection.",
    description:
      "A detail-first brand and lead flow for a detailing studio where every surface makes the case.",
    image: "/manus-storage/detail-auto_6e78fac2.jpg",
    tone: "slate",
    details: ["Brand system", "Lead capture", "Photo direction"],
  },
  {
    number: "04",
    name: "Miras Tires",
    discipline: "Family Business · Social Commerce",
    statement: "A family business built to move Mongolia.",
    description:
      "Imported tires from Russia and China, turned into a trusted digital storefront for drivers across Ulaanbaatar and beyond.",
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
        <div className="menu-window" aria-hidden="true" style={{backgroundColor: '#ffbd61'}}>
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
        <div className="social-window" aria-hidden="true" style={{backgroundColor: '#ffd5b3'}}>
          <div className="social-window__bar"><Circle size={8} fill="currentColor" /> <span>besbarmak.kazakh</span><b>Follow</b></div>
          <div className="social-window__body"><span>01</span><p>Traditional comfort.<br />A new conversation.</p><i>CHICAGO, IL</i></div>
        </div>
      )}
      {project.number === "03" && (
        <div className="auto-mark" aria-hidden="true"><span>AFTER</span><strong>HOURS</strong><i>DETAILING STUDIO</i></div>
      )}
      {project.number === "04" && (
        <div className="tire-proof" aria-hidden="true"><span>MIRAS TIRES</span><strong>11K+</strong><i>FACEBOOK FOLLOWERS</i><b>FAMILY BUSINESS / MONGOLIA</b></div>
      )}
      <div className="project-art__badge"><span>{project.number}</span><span>CASE STUDY</span></div>
    </div>
  );
}

export default function Home() {
  const { data: uploadedGallery = [] } = trpc.gallery.list.useQuery();
  const galleryItems = [...gallery, ...uploadedGallery.map((asset) => ({ src: asset.fileUrl, label: asset.title, span: "square" as const }))];
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
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) setActiveProject(Number(target.dataset.index));
      }),
      { threshold: 0.56 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Thanks — your project note is ready to send.", {
      description: "This demo form can be connected to your inbox when the site goes live.",
    });
    event.currentTarget.reset();
  };

  const downloadGuide = () => {
    const guide = `MICHID STUDIOS — STARTING POINTS\n\nDIGITAL PRESENCE\nA sharp landing page, offer clarity, and a lead-capture path.\n\nCONTENT SYSTEM\nA tailored visual direction, photo/video edits, and templates built to be used.\n\nCAMPAIGN LAUNCH\nAd creative, campaign structure, and reporting built around a clear offer.\n\nEvery project is scoped around the business, not a fixed bundle.\nStart the conversation: hello@michid.studio`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([guide], { type: "text/plain" }));
    link.download = "MICHID-Studio-Starting-Points.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Pricing guide downloaded.");
  };

  return (
    <main id="top" className="site-shell">
      <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
        <Logo />
        <nav className="nav__links" aria-label="Primary navigation">
          <button onClick={() => scrollToSection("work")}>Work</button>
          <button onClick={() => scrollToSection("services")}>Capabilities</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
        </nav>
        <button className="nav__cta" onClick={() => scrollToSection("contact")}><span>Start a project</span><ArrowUpRight size={15} /></button>
        <button className="nav__menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mobile-menu__head"><Logo /><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={24} /></button></div>
            {["Work", "Capabilities", "Contact"].map((item) => (
              <button key={item} onClick={() => { scrollToSection(item === "Work" ? "work" : item === "Capabilities" ? "services" : "contact"); setMenuOpen(false); }}>{item}<ArrowUpRight size={20} /></button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__grain" />
        <motion.div className="hero__eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <span className="pulse" /> Independent digital studio · Chicago · Mongolia
        </motion.div>
        <motion.h1 id="hero-heading" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          Make the first<br /><em>impression</em> count.
        </motion.h1>
        <motion.div className="hero__bottom" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.62 }}>
          <p>Websites, campaigns, and content systems<br />for businesses with something to say.</p>
          <button className="scroll-prompt" onClick={() => scrollToSection("work")}><span>Explore selected work</span><MoveDown size={17} /></button>
        </motion.div>
        <div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" /><div className="hero-sun" />
      </section>

      <section id="work" className="work-section" aria-labelledby="work-heading">
        <div className="section-kicker"><span>01 — Selected work</span><span>{String(activeProject + 1).padStart(2, "0")} / 04</span></div>
        <div className="work-intro"><h2 id="work-heading">Digital work with<br /><em>an aftertaste.</em></h2><p>Every project starts with the real-world moment that matters: a booking, a menu choice, a message, a sale.</p></div>
        <div className="case-stack">
          {projects.map((project, index) => (
            <article className="case-card" data-index={index} key={project.number} style={{ "--card-index": index } as React.CSSProperties}>
              <div className="case-card__copy" style={{backgroundColor: '#000000'}}>
                <div className="case-card__meta"><span>{project.number}</span><span>{project.discipline}</span></div>
                <h3 style={{fontFamily: '"Times", sans-serif'}}>{project.name}</h3>
                <p className="case-card__statement">{project.statement}</p>
                <p className="case-card__description">{project.description}</p>
                <div className="tag-row">{project.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
                <button className="case-card__link" onClick={() => toast("Case-study details can be added as your client approvals arrive.")}><span>View direction</span><ArrowDownRight size={18} /></button>
                {project.number === "01" && <div className="case-links"><a href="https://www.mantrachicago.com/" target="_blank" rel="noreferrer">Visit Mantra <ArrowUpRight size={13} /></a></div>}
                {project.number === "02" && <div className="case-links"><a href="https://www.instagram.com/besbarmak_kazakh_restaurant/" target="_blank" rel="noreferrer"><Instagram size={13} /> Instagram</a><a href="https://www.facebook.com/BesbarmakKazakhRestaurant/" target="_blank" rel="noreferrer"><span className="facebook-letter">f</span> Facebook</a></div>}
                {project.number === "04" && <div className="case-links"><a href="https://www.instagram.com/mirastires/" target="_blank" rel="noreferrer"><Instagram size={13} /> Instagram</a><a href="https://www.facebook.com/100044460162053/" target="_blank" rel="noreferrer"><span className="facebook-letter">f</span> Facebook</a></div>}
              </div>
              <ProjectArt project={project} />
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto-section">
        <div className="manifesto__marker">*</div>
        <p>Good work should be <em>felt</em> before it gets explained.</p>
        <div className="manifesto__rule" /><span>From first click to first order</span>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-heading">
        <div className="section-kicker"><span>02 — Visual language</span><span>Scroll / Tap to expand</span></div>
        <div className="gallery-intro"><h2 id="gallery-heading">The work<br />between the work.</h2><p>Photography, Canva posters, and visual systems that give everyday businesses a sharper point of view.</p></div>
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <button className={`gallery-item gallery-item--${item.span}`} onClick={() => setLightbox(index)} key={item.label}>
              <img src={item.src} alt={item.label} /><div className="gallery-item__overlay"><span>{item.label}</span><ArrowUpRight size={20} /></div>
            </button>
          ))}
        </div>
      </section>

      <section id="services" className="ads-section" aria-labelledby="ads-heading">
        <div className="ads-section__visual"><img src="/manus-storage/ads-sculpture_7043b359.jpg" alt="Amber glass campaign styling" /><div className="ads-section__circle" /><span className="visual-caption">CAMPAIGN<br />STRUCTURE<br />IS CREATIVE.</span><div className="ad-example"><div className="ad-example__top"><span><span className="ad-avatar">M</span> MICHID MEDIA</span><span>Sponsored · · ·</span></div><div className="ad-example__photo"><span>YOUR<br />AD<br />HERE</span></div><div className="ad-example__bottom"><strong>Turn attention into action.</strong><span>Learn more <ArrowUpRight size={12} /></span></div></div></div>
        <div className="ads-section__copy">
          <div className="section-kicker"><span>03 — Meta ads & marketing</span><span>Meta · Facebook · Instagram</span></div>
          <h2 id="ads-heading">Make the<br /><em>offer</em> obvious.</h2>
          <p>Campaigns built around attention, clarity, and an offer people can act on — not a dashboard full of noise. Built for the way people discover businesses now.</p>
          <div className="platform-lockup" aria-label="Meta, Facebook and Instagram platforms">
            <span className="platform-mark platform-mark--meta">∞</span><span>Meta</span>
            <span className="platform-mark platform-mark--facebook">f</span><span>Facebook</span>
            <Instagram className="platform-mark platform-mark--instagram" size={17} /><span>Instagram</span>
          </div>
          <div className="service-list">
            {[
              ["01", "Campaign structure", "A focused path from audience to action."],
              ["02", "Creative direction", "Ads that look native, not generic."],
              ["03", "Simple reporting", "Reach, engagement, spend, and the next move."],
            ].map(([number, title, copy]) => <div className="service-list__item" key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}
          </div>
          <button className="text-button" onClick={downloadGuide}>Download starting points <Download size={16} /></button>
        </div>
      </section>

      <section className="principles-section">
        <span>What gets made here</span>
        <div className="principles-list"><p>01 / Websites that do their job</p><p>02 / Content people remember</p><p>03 / Ads with a reason to click</p></div>
      </section>

      <section id="contact" className="contact-section" aria-labelledby="contact-heading">
        <div className="contact-section__top"><span>04 — Start a conversation</span><span>Available for select projects</span></div>
        <div className="contact-section__grid">
          <div><h2 id="contact-heading">Your business<br />already has a story.<br /><em>Let’s sharpen it.</em></h2><p className="about-note">MICHID means the Pleiades in Mongolian — a small constellation, a clear point of view. We’re a studio / media agency based in Mongolia, working between Kazakh and Mongolian cultures.</p><a className="email-link" href="mailto:hello@michid.studio">hello@michid.studio <ArrowUpRight size={20} /></a></div>
          <form onSubmit={submitContact} className="contact-form">
            <label>Your name<input required name="name" placeholder="How should I call you?" /></label>
            <label>Email address<input required type="email" name="email" placeholder="you@business.com" /></label>
            <label>What are we making?<textarea required name="message" placeholder="A new site, a campaign, a better digital presence..." rows={3} /></label>
            <button type="submit" className="submit-button"><span>Send project note</span><Send size={16} /></button>
          </form>
        </div>
        <footer className="footer"><Logo /><div className="footer__socials"><button onClick={() => toast("Add your Instagram URL here before launch.")}><Instagram size={17} /> Instagram</button><button onClick={() => toast("Add your LinkedIn URL here before launch.")}><Linkedin size={17} /> LinkedIn</button><a href="tel:+13093502260" className="footer__contact"><Phone size={14} /> +1 309 350 2260</a><a href="https://www.instagram.com/ali_emes/" target="_blank" rel="noreferrer" className="footer__contact"><Instagram size={14} /> @ali_emes</a><Link href="/manage" className="footer__manage">Owner access</Link></div><span>© {new Date().getFullYear()} MICHID MEDIA</span></footer>
      </section>

      <AnimatePresence>
        {lightbox !== null && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}><button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Close image"><X size={21} /></button><motion.img src={galleryItems[lightbox].src} alt={galleryItems[lightbox].label} initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={(e) => e.stopPropagation()} /></motion.div>}
      </AnimatePresence>
    </main>
  );
}
