import { useState, useEffect, useRef } from 'react'
import ChatInterface from './components/ChatInterface'
import ChatWidget from './components/ChatWidget'
import ProjectsSection from './components/ProjectsSection'
import { getPublishedProjects } from './lib/projects'

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
  const searchParams =
    typeof window === 'undefined' ? null : new URLSearchParams(window.location.search)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hrName] = useState(searchParams?.get('UTM_NAME') ?? null);
  const [projects, setProjects] = useState([]);
  const [projectsError, setProjectsError] = useState(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);

    PARAM_KEYS.forEach((key) => {
      const value = sp.get(key);

      // store only if it exists
      if (value) {
        localStorage.setItem(key, value);
      }
    });
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return undefined;
    }

    document.body.classList.add('dev-performance-mode');

    return () => {
      document.body.classList.remove('dev-performance-mode');
    };
  }, []);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldEnableCustomCursor =
      import.meta.env.PROD && isFinePointer && !prefersReducedMotion;

    if (!shouldEnableCustomCursor) {
      document.body.classList.remove('custom-cursor-enabled');
      return;
    }

    document.body.classList.add('custom-cursor-enabled');

    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    // Use requestAnimationFrame for smoother visual updates
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    const CLICKABLE_SELECTOR =
      'a, button, .portfolio-card, .portfolio-dialog-close, .skill-pill';

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

    const handleMouseOut = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest(CLICKABLE_SELECTOR)) {
        removeHoverClass();
      }
    };

    // Optimized delegation for hover effects
    const handleHover = (e) => {
      // Check if target or any parent is clickable
      const clickable = e.target.closest(CLICKABLE_SELECTOR);
      if (clickable) {
        addHoverClass();
      } else {
        removeHoverClass();
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener('mouseover', handleHover);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener('mouseover', handleHover);
      document.removeEventListener('mouseout', handleMouseOut);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const videoRef = useRef(null);

  useEffect(() => {
    // Force video to play to ensure autoplay works
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const publishedProjects = await getPublishedProjects();
        if (isMounted) {
          setProjects(publishedProjects);
          setProjectsError(null);
        }
      } catch (error) {
        if (isMounted) {
          setProjectsError('Could not load projects from Supabase. Showing fallback projects.');
        }
        console.error('Projects loading failed:', error);
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo">E<span className="dot"></span>P<span className="dot"></span></div>
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="primary-nav"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
          <ul id="primary-nav" className={`nav-links ${isMenuOpen ? 'active' : ''}`} >
            <li><a href="#hero" onClick={() => setIsMenuOpen(false)}>Home</a></li>
            <li><a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a></li>
            <li><a href="#chat" onClick={() => setIsMenuOpen(false)}>Chat</a></li>
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
          preload="metadata"
        >
          <source src="https://video.wixstatic.com/video/11062b_b02d1b7883d5447fb2453acb93a5102b/1080p/mp4/file.mp4" type="video/mp4" />
        </video>
        <div className="container hero-content">
          <div className="hero-copy">
            {hrName ? (
              <div style={{ marginBottom: "0.5rem" }}>
                <span className="hero-label-name">
                  Hello {hrName}
                </span>
                <div><span className="hero-label">I'm Eduard</span></div>
              </div>
            ) : <span className="hero-label">Hi, I'm Eduard</span>}
            <h1>Web Developer with<br />Real Client Experience</h1>
            <p>
              I build fast, conversion-focused web products using JavaScript/TypeScript, React,
              Next.js, APIs, AI Agents, and Automations across custom builds, Wix, and
              WordPress. Available for developer roles.
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary" onClick={() => trackClick('View My Work')}>View My Work</a>
              <a href="https://drive.google.com/file/d/1t-5qDGBRsIXQrkA0qR1p5bfNoavDY_kn/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" onClick={() => trackClick('Download My CV')}>Download My CV</a>
            </div>
          </div>
          <div id="chat" className="hero-chat">
            <p className="hero-chat-kicker">Ask My AI</p>
            <ChatInterface />
          </div>
        </div>
      </section>

      <ProjectsSection projects={projects} projectsError={projectsError} trackClick={trackClick} />

      {/* Skills Section */}
      <section id="skills" className="section skills-section">
        <div className="container skills-container">
          <div className="skills-intro">
            <h2>Technical Skills</h2>
            <p>
              Here’s the stack I’m currently using across AI-powered web applications, client
              builds, and automation-led systems.
            </p>
            <a href="#contact" className="btn btn-primary" onClick={() => trackClick('Let\'s Talk')}>Let's Talk</a>
          </div>
          <div className="skills-grid">
            <div className="skills-category">
              <h3>Languages</h3>
              <div className="skills-list">
                <span className="skill-pill">JavaScript</span>
                <span className="skill-pill">TypeScript</span>
                <span className="skill-pill">HTML</span>
                <span className="skill-pill">CSS</span>
                <span className="skill-pill">Python (working knowledge)</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Frontend</h3>
              <div className="skills-list">
                <span className="skill-pill">React</span>
                <span className="skill-pill">Next.js 14 (App Router)</span>
                <span className="skill-pill">Tailwind CSS</span>
                <span className="skill-pill">DOM manipulation</span>
                <span className="skill-pill">Responsive design</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Backend & APIs</h3>
              <div className="skills-list">
                <span className="skill-pill">Node.js</span>
                <span className="skill-pill">Supabase (PostgreSQL)</span>
                <span className="skill-pill">REST APIs</span>
                <span className="skill-pill">Webhooks</span>
                <span className="skill-pill">Google Calendar API</span>
                <span className="skill-pill">Stripe API</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>AI & Agents</h3>
              <div className="skills-list">
                <span className="skill-pill">AI agent architecture</span>
                <span className="skill-pill">System Prompt Engineering</span>
                <span className="skill-pill">MCP servers</span>
                <span className="skill-pill">Twilio SMS/voice integration</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Databases</h3>
              <div className="skills-list">
                <span className="skill-pill">Supabase</span>
                <span className="skill-pill">MySQL</span>
                <span className="skill-pill">MSSQL</span>
                <span className="skill-pill">Wix Data Collections</span>
              </div>
            </div>

            <div className="skills-category">
              <h3>Platforms & CMS</h3>
              <div className="skills-list">
                <span className="skill-pill">Vercel</span>
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
                <span className="skill-pill">Claude Code</span>
                <span className="skill-pill">Codex</span>
                <span className="skill-pill">Google AI Studio</span>
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
              I'm a UK-based developer with hands-on experience building AI-powered products,
              client websites, and automation-led digital systems. My work sits across frontend
              development, API integrations, and practical solutions that help businesses operate
              more efficiently.
            </p>
            <p>
              My strongest recent project is Resevia, an AI-powered reception agent for beauty
              salons built with Next.js, Supabase, Gemini 2.5 Pro, and iCal.eu booking flows.
              Twilio infrastructure is in place and currently moving through go-live rollout. It
              pushed me beyond UI work into system design, prompt engineering, integration
              architecture, and shipping around a real business problem.
            </p>
            <p>
              Before that, through EZWebOne, I delivered websites and CMS builds for small business
              clients, including custom Wix/Velo work, Stripe integrations, and internal
              documentation so non-technical teams could manage their sites confidently after
              launch.
            </p>
            <p>
              I'm now looking for a developer role where I can keep building,
              learn from experienced engineers, and contribute to a team working on meaningful
              products, especially where AI is part of the workflow or product itself.
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
            I'm currently available for developer roles. If you're looking for someone who is eager to learn and ready to contribute, I'd love to hear from you.
          </p>
          <div className="contact-links">
            <a href="mailto:eduard.proca93@gmail.com" className="btn btn-primary" onClick={() => trackClick('Email Me')}>Email Me</a>
            <a href="https://www.linkedin.com/in/eduard-p-34a06b232" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" onClick={() => trackClick('Connect on LinkedIn')}>Connect on LinkedIn</a>
            <a href="https://github.com/EduardP19" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" onClick={() => trackClick('View GitHub')}>View GitHub</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Eduard. All rights reserved.</p>
        </div>
      </footer>
      <ChatWidget />
    </div>
  )
}

export default App
