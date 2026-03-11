import { useState, useEffect, useRef } from 'react'

const trackClick = (label) => {
  window.gtag('event', 'cta_click', {
    cta_name: label,
    page_path: window.location.pathname,
  });
};

const PARAM_KEYS = [
  "UTM_NAME",
  "UTM_COMPANY",
  "UTM_INDUSTRY",
  "UTM_SOURCE",
  "UTM_MEDIUM",
  "UTM_CAMPAIGN",
  "UTM_TERM",
  "UTM_CONTENT"
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [params, setParams] = useState({});
  const [hrName, setHrName] = useState(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const collected = {};

    PARAM_KEYS.forEach((key) => {
      const value = sp.get(key);

      // define ALL params, even if missing
      collected[key] = value ?? null;

      // store only if it exists
      if (value) {
        localStorage.setItem(key, value);
      }
    });

    setParams(collected);
    setHrName(collected.UTM_NAME);
  }, []);

  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    // Use requestAnimationFrame for smoother visual updates
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isMoving = false;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateCursorPosition);
      }
    };

    const updateCursorPosition = () => {
      // Simple linear interpolation (lerp) for smoother follow, or direct assignment for instant
      // For "laggy" complaints, direct assignment is often better unless they want a "trailing" effect.
      // Let's stick to direct assignment but inside rAF to sync with refresh rate.
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      isMoving = false;
    };

    const addHoverClass = () => cursor.classList.add("hovered");
    const removeHoverClass = () => cursor.classList.remove("hovered");

    window.addEventListener("mousemove", moveCursor);

    // Optimized delegation for hover effects
    const handleHover = (e) => {
      // Check if target or any parent is clickable
      const clickable = e.target.closest('a, button, .project-card, .skill-pill');
      if (clickable) {
        addHoverClass();
      } else {
        removeHoverClass();
      }
    };

    document.addEventListener('mouseover', handleHover);
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('a, button, .project-card, .skill-pill')) {
        removeHoverClass();
      }
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener('mouseover', handleHover);
      document.removeEventListener('mouseout', handleHover); // Clean up both
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const videoRef = useRef(null);

  useEffect(() => {
    // Force video to play to ensure autoplay works
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo">E<span className="dot"></span>P<span className="dot"></span></div>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`} >
            <li><a href="#hero" onClick={() => setIsMenuOpen(false)}>Home</a></li>
            <li><a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a></li>
            <li><a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a></li>
            <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
            <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="section hero-section">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          id="background-video"
        >
          <source src="https://video.wixstatic.com/video/11062b_b02d1b7883d5447fb2453acb93a5102b/1080p/mp4/file.mp4" type="video/mp4" />
        </video>
        <div className="container">
          {hrName ? (
            <div style={{ marginBottom: "0.5rem" }}>
              <span className="hero-label-name">
                Hello {hrName}
              </span>
              <div><span className="hero-label">I'm Eduard</span></div>
            </div>
          ) : <span className="hero-label">Hi, I'm Eduard</span>}
          {/* <span className="hero-label">Hi, I'm Eduard</span> */}
          <h1>Junior Web Developer with<br />Real Client Experience</h1>
          <p>
            I build fast, conversion-focused websites for small businesses using HTML, CSS, JavaScript, Wix and WordPress. Available for junior roles.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary" onClick={() => trackClick('View My Work')}>View My Work</a>
            <a href="https://drive.google.com/file/d/1hTPlhg2UMx7bTVQPdtSEdACCwe1YmShg/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" onClick={() => trackClick('Download My CV')}>Download My CV</a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section projects-section">
        <div className="container">
          <h2>Projects</h2>
          <div className="projects-grid">
            {/* Project ProveIt */}
            <div className="project-card">
              <h3>Lead-Generation & Automation Platform</h3>
              <ul>
                <li>Develop and maintain a platform serving 10k+ monthly users, processing 50+ daily leads</li>
                <li>Designed backend workflows and automation pipelines connecting platform data with CRMs and third-party APIs</li>
                <li>Developed a financial claim qualification calculator including UI, backend logic, and API integrations</li>
                <li>Led an automated database migration system using batch-processing to update 27,000+ existing records</li>
              </ul>
              <br />
              <div className="tech-stack">
                <span className="tech-tag">Wix Velo</span>
                <span className="tech-tag">REST API</span>
                <span className="tech-tag">Webhooks</span>
                <span className="tech-tag">Zapier</span>
                <span className="tech-tag">JavaScript</span>
              </div>
            </div>

            {/* Project 1 */}
            <div className="project-card">
              <h3>Hospitality Booking System</h3>
              <ul>
                <li>Custom booking system built with a hybrid Wix + custom code approach</li>
                <li>Dynamic pricing based on age criteria and capacity rules</li>
                <li>Payment validation to confirm or cancel bookings automatically</li>
                <li>Automated slot release via cron jobs for unconfirmed holds</li>
              </ul>
              {/* <p>Created a booking system for a hospitality business with on demands UX. The booking system has been developed in a hybrid apporach which means it was built using Wix's existing booking calendar, with custom code to manipulate the booking price based on age crietion, to accept and cancel bookings based on payment validation and to allow multiples users booking the same slot until it gets booked out.
                The payment required API integrations. The system also benefits of a cron job to release slotsl that are on hold and niether declined or confirmed  </p> */}
              <br />
              <div className="tech-stack">
                <span className="tech-tag">Wix</span>
                <span className="tech-tag">Wix CMS</span>
                <span className="tech-tag">Wix Velo(JS)</span>
                <span className="tech-tag">RESTful API</span>
              </div>
              <a href="https://www.thebusstop.scot/experiences" className="project-link" onClick={() => trackClick('View TheBusStop')}>View Project &rarr;</a>
            </div>
            {/* Project 2 */}
            <div className="project-card">
              <h3>E-commerce Startup</h3>
              <ul>
                <li>Built a reseller e-commerce website with a strong focus on UX</li>
                <li>Smooth journey from product discovery to checkout</li>
                <li>Implemented product categorisation, secure payments, and inventory management</li>
              </ul>
              {/* <p>Developed a e-commerce site for a reseller, focusing on a seamless UX from browsing to checkout. Implemented key features including categorization, secure payment, and inventory management.</p> */}
              <br />
              <div className="tech-stack">
                <span className="tech-tag">Wix</span>
                <span className="tech-tag">Wix CMS</span>
                <span className="tech-tag">Figma</span>
                <span className="tech-tag">JS</span>
              </div>
              <a href="https://www.auraprocosmetics.com/" className="project-link" onClick={() => trackClick('View AuraProCosmetics')}>View Project &rarr;</a>
            </div>

            {/* Project 3 */}
            <div className="project-card">
              <h3>Creative Design Agency</h3>
              <ul>
                <li>Designed a bold, modern website focused on visual storytelling</li>
                <li>Large imagery, subtle animations, and clean grid-based layout</li>
                <li>Optimised to showcase projects and creative work</li>
              </ul>
              {/* <p>Developed a visually bold website that highlights work through large imagery, subtle animations, and a modern, grid-based layout.</p> */}
              <br />
              <div className="tech-stack">
                <span className="tech-tag">Framer</span>
                <span className="tech-tag">Figma</span>
                <span className="tech-tag">CSS</span>
              </div>
              <a href="https://www.txengo.com/" className="project-link" onClick={() => trackClick('View Txengo')}>View Project &rarr;</a>
            </div>

            {/* Project 4 */}
            <div className="project-card">
              <h3>Events Company 1</h3>
              <ul>
                <li>Redesigned the website with a modern, elegant layout</li>
                <li>Improved content flow for galleries and service discovery</li>
                <li>Enabled direct online enquiries and bookings</li>
              </ul>
              {/* <p>Redesigned the site with a modern, elegant layout focused on visuals and simplicity — helping clients explore photo booth options, view real event galleries, and book directly online with ease.</p> */}
              <br />
              <div className="tech-stack">
                <span className="tech-tag">Wix</span>
                <span className="tech-tag">Wix CMS</span>
                <span className="tech-tag">UX Pilot</span>
              </div>
              <a href="https://www.thememorycorners.co.uk/" className="project-link" onClick={() => trackClick('View TheMemoryCorners')}>View Project &rarr;</a>
            </div>
            {/* Project 5 */}
            <div className="project-card">
              <h3>Events Company 2</h3>
              <ul>
                <li>Soft, romantic visual direction with modern UI details</li>
                <li>Focus on testimonials, galleries, and conversion flow</li>
                <li>Currently under development...</li>
              </ul>
              {/* <p>Developed a soft, romantic design with modern touches that highlights testimonials, services, and past events — making it easy for couples to connect and start planning their big day.</p> */}
              <br />
              <div className="tech-stack">
                <span className="tech-tag">WordPress</span>
                <span className="tech-tag">Figma</span>
                <span className="tech-tag">phpMyAdmin</span>
              </div>
              <a href="https://www.sayidoweddings.co.uk/home" className="project-link" onClick={() => trackClick('View SayidoWeddings')}>View Project &rarr;</a>
            </div>

          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section skills-section">
        <div className="container skills-container">
          <div className="skills-intro">
            <h2>Technical Skills</h2>
            <p>
              I constantly learn new technologies and tools to keep my skills sharp. Here are some of the key areas I focus on.
            </p>
            <a href="#contact" className="btn btn-primary" onClick={() => trackClick('Let\'s Talk')}>Let's Talk</a>
          </div>
          <div className="skills-grid">
            <div className="skills-category">
              <h3>Languages</h3>
              <div className="skills-list">
                <span className="skill-pill">JavaScript</span>
                <span className="skill-pill">HTML</span>
                <span className="skill-pill">CSS</span>
                <span className="skill-pill">Python (working knowledge)</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Frontend</h3>
              <div className="skills-list">
                <span className="skill-pill">DOM manipulation</span>
                <span className="skill-pill">Responsive design</span>
                <span className="skill-pill">Flexbox</span>
                <span className="skill-pill">CSS animations</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Backend & APIs</h3>
              <div className="skills-list">
                <span className="skill-pill">Node.js concepts</span>
                <span className="skill-pill">REST APIs</span>
                <span className="skill-pill">Webhooks</span>
                <span className="skill-pill">Backend automation logic</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Databases</h3>
              <div className="skills-list">
                <span className="skill-pill">MySQL</span>
                <span className="skill-pill">MSSQL</span>
                <span className="skill-pill">Wix Data Collections</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Platforms & CMS</h3>
              <div className="skills-list">
                <span className="skill-pill">Wix Velo</span>
                <span className="skill-pill">WordPress</span>
                <span className="skill-pill">Framer</span>
                <span className="skill-pill">Squarespace</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Automation & Integrations</h3>
              <div className="skills-list">
                <span className="skill-pill">Zapier</span>
                <span className="skill-pill">API integrations</span>
                <span className="skill-pill">Webhooks</span>
                <span className="skill-pill">Google Apps Script</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Tools</h3>
              <div className="skills-list">
                <span className="skill-pill">Git</span>
                <span className="skill-pill">GitHub</span>
                <span className="skill-pill">VS Code</span>
                <span className="skill-pill">Postman</span>
                <span className="skill-pill">Figma</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Analytics & Tracking</h3>
              <div className="skills-list">
                <span className="skill-pill">Google Analytics 4</span>
                <span className="skill-pill">Google Search Console</span>
                <span className="skill-pill">Microsoft Clarity</span>
                <span className="skill-pill">schema.org structured data</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container about-container">
          <div className="about-text">
            <h2>About Me.</h2>
            <p>
              I'm a Full-Stack Developer focused on building automation-driven web systems and integrations. I enjoy designing solutions that connect platforms, automate workflows, and transform complex business processes into scalable software.
            </p>
            <p>
              I have experience developing production systems used by thousands of users, integrating APIs, and building automation pipelines that reduce manual work and improve data flow.
            </p>
            <p>
              My journey started with self-taught coding and evolved into building real-world systems for businesses and startups. I enjoy solving technical problems, optimizing workflows, and turning ideas into reliable digital products.
            </p>
            <p>
              Outside development, I enjoy exploring new technologies, automation tools, and AI-assisted development.
            </p>
          </div>
          {/* <div className="about-image">
            <div className="about-image-placeholder"></div>
          </div> */}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <h2>Let's Work Together</h2>
          <p>
            I'm currently available for junior developer roles. If you're looking for someone who is eager to learn and ready to contribute, I'd love to hear from you.
          </p>
          <div className="contact-links">
            <a href="mailto:eduard.proca93@gmail.com" className="btn btn-primary" onClick={() => trackClick('Email Me')}>Email Me</a>
            <a href="Https://www.linkedin.com/in/eduard-p-34a06b232" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" onClick={() => trackClick('Connect on LinkedIn')}>Connect on LinkedIn</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Eduard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
