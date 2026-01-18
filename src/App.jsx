import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Moon, Sun, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, ChevronDown, Code, Database, Cloud, Zap, Award, Briefcase, GraduationCap, Download, Send, Menu, X, Check, TrendingUp, ArrowUp, Copy, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

// Particle class for the particle network animation
class Particle {
  constructor(canvas, ctx, theme) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.theme = theme;
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
    this.opacity = Math.random() * 0.6 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.canvas.width) this.x = 0;
    if (this.x < 0) this.x = this.canvas.width;
    if (this.y > this.canvas.height) this.y = 0;
    if (this.y < 0) this.y = this.canvas.height;
  }

  draw() {
    this.ctx.fillStyle = this.theme === 'dark' 
      ? `rgba(96, 165, 250, ${this.opacity})` 
      : `rgba(59, 130, 246, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = this.theme === 'dark' ? '#60a5fa' : '#3b82f6';
  }
}

// FloatingShape class for the 3D floating shapes animation
class FloatingShape {
  constructor(canvas, ctx, theme) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.theme = theme;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 120 + 60;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.speedY = Math.random() * 0.4 - 0.2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.008 - 0.004;
    this.opacity = Math.random() * 0.12 + 0.03;
    this.type = Math.random() > 0.5 ? 'circle' : 'square';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    if (this.x > this.canvas.width + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = this.canvas.width + this.size;
    if (this.y > this.canvas.height + this.size) this.y = -this.size;
    if (this.y < -this.size) this.y = this.canvas.height + this.size;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.rotation);
    
    const gradient = this.ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
    if (this.theme === 'dark') {
      gradient.addColorStop(0, `rgba(96, 165, 250, ${this.opacity})`);
      gradient.addColorStop(0.5, `rgba(168, 85, 247, ${this.opacity})`);
      gradient.addColorStop(1, `rgba(59, 130, 246, ${this.opacity})`);
    } else {
      gradient.addColorStop(0, `rgba(59, 130, 246, ${this.opacity})`);
      gradient.addColorStop(0.5, `rgba(147, 51, 234, ${this.opacity})`);
      gradient.addColorStop(1, `rgba(37, 99, 235, ${this.opacity})`);
    }
    
    this.ctx.fillStyle = gradient;
    
    if (this.type === 'circle') {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    }
    
    this.ctx.restore();
  }
}

export default function Portfolio() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const canvasRef = useRef(null);
  const heroCanvasRef = useRef(null);
  const formRef = useRef(null);

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particle Network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, ctx, theme));
    }

    function connectParticles() {
      particles.forEach((particle, index) => {
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.25;
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(96, 165, 250, ${opacity})` 
              : `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  // 3D Floating Shapes
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const shapes = Array.from({ length: 10 }, () => new FloatingShape(canvas, ctx, theme));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText('arul5780612@gmail.com');
    setEmailCopied(true);
    toast.success('Email copied to clipboard!', {
      icon: '✉️',
      style: {
        borderRadius: '10px',
        background: theme === 'dark' ? '#1e293b' : '#fff',
        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
      },
    });
    setTimeout(() => setEmailCopied(false), 2000);
  }, [theme]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // EmailJS configuration - REPLACE WITH YOUR CREDENTIALS
      // Get from https://www.emailjs.com/
      await emailjs.send(
        'YOUR_SERVICE_ID',  // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject || 'Portfolio Contact',
          message: formData.message,
          to_name: 'B. Arul',
        },
        'YOUR_PUBLIC_KEY'     // Replace with your EmailJS public key
      );

      toast.success('Message sent successfully! I\'ll get back to you soon.', {
        duration: 5000,
        icon: '🚀',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to send message. Please email me directly at arul5780612@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';

  const projects = [
    {
      id: 1,
      title: "Insurance-Suite Application",
      subtitle: "Enterprise Insurance Platform",
      description: "Comprehensive full-stack insurance platform with 20+ modules including underwriting, claims processing, policy management, product builder, CRM, and admin dashboard.",
      tech: ["Node.js", "React", "PostgreSQL", "TypeScript", "Prisma", "Express.js", "Docker"],
      image: "images/project-insurance.png",
      metrics: [
        { label: "Performance Gain", value: "50%", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Response Time", value: "<500ms", icon: <Zap className="w-4 h-4" /> },
        { label: "Policy Records", value: "100K+", icon: <Database className="w-4 h-4" /> }
      ],
      impact: "Delivered all modules on schedule with zero critical production incidents. Optimized system architecture for 50% performance improvement.",
      gradient: "from-blue-500 via-cyan-500 to-blue-600",
      bgPattern: "radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.3) 0%, transparent 50%)"
    },
    {
      id: 2,
      title: "Enterprise Task Management",
      subtitle: "Workflow Automation System",
      description: "Backend-driven task management platform for enterprise operations with automated tracking, escalations, and workflow optimization.",
      tech: ["PL/SQL", "Java", "Oracle 12c", "JDBC", "Enterprise Integration"],
      image: "images/project-task.png",
      metrics: [
        { label: "Time Saved", value: "35%", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Automation", value: "100%", icon: <Zap className="w-4 h-4" /> },
        { label: "Load Reduction", value: "35%", icon: <Database className="w-4 h-4" /> }
      ],
      impact: "35% reduction in processing time. Improved efficiency by automating manual workflows across enterprise operations.",
      gradient: "from-purple-500 via-pink-500 to-purple-600",
      bgPattern: "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)"
    },
    {
      id: 3,
      title: "Hotel Reservation System",
      subtitle: "Real-time Booking Platform",
      description: "Full-stack booking and billing management system with real-time availability updates, payment gateway integration, and comprehensive reporting.",
      tech: ["PL/SQL", "Spring Boot", "Java", "Payment APIs", "Real-time Processing"],
      image: "images/project-hotel.png",
      metrics: [
        { label: "Error Reduction", value: "80%", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Daily Transactions", value: "500+", icon: <Zap className="w-4 h-4" /> },
        { label: "Success Rate", value: "99%", icon: <Check className="w-4 h-4" /> }
      ],
      impact: "80% reduction in booking errors. Processed 500+ transactions daily with significantly shorter response times.",
      gradient: "from-orange-500 via-red-500 to-orange-600",
      bgPattern: "radial-gradient(circle at 50% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)"
    },
    {
      id: 4,
      title: "Event Management Platform",
      subtitle: "Ticketing & Attendee System",
      description: "Event ticketing and attendee management platform with secure payment processing, real-time event tracking, and analytics dashboard.",
      tech: ["PL/SQL", "Spring Boot", "Java", "Payment Security", "Analytics"],
      image: "images/project-event.png",
      metrics: [
        { label: "Concurrent Events", value: "50+", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Success Rate", value: "98%", icon: <Check className="w-4 h-4" /> },
        { label: "Revenue Impact", value: "High", icon: <Award className="w-4 h-4" /> }
      ],
      impact: "Managed 50+ concurrent events with 98% successful transaction rate. Generated notable annual revenue.",
      gradient: "from-green-500 via-emerald-500 to-green-600",
      bgPattern: "radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)"
    }
  ];

  const skills = [
    {
      category: "Backend Development",
      items: [
        { name: "Node.js", level: 90 },
        { name: "Express.js", level: 90 },
        { name: "Spring Boot", level: 85 },
        { name: "RESTful APIs", level: 95 },
        { name: "GraphQL", level: 75 }
      ],
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Frontend Development",
      items: [
        { name: "React.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "JavaScript", level: 95 },
        { name: "HTML5/CSS3", level: 90 },
        { name: "Responsive Design", level: 90 }
      ],
      icon: <Code className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "Database & ORM",
      items: [
        { name: "PostgreSQL", level: 90 },
        { name: "Oracle PL/SQL", level: 95 },
        { name: "MySQL", level: 85 },
        { name: "Prisma ORM", level: 85 },
        { name: "Query Optimization", level: 95 }
      ],
      icon: <Database className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      category: "DevOps & Cloud",
      items: [
        { name: "Docker", level: 85 },
        { name: "Git/GitHub", level: 90 },
        { name: "Azure", level: 80 },
        { name: "AWS", level: 80 },
        { name: "CI/CD", level: 85 }
      ],
      icon: <Cloud className="w-8 h-8" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  const certifications = [
    { 
      title: "Oracle PL/SQL Performance Tuning",
      issuer: "Self-directed",
      date: "2024",
      icon: <Award className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Agile Methodology & Scrum Fundamentals",
      issuer: "Professional Training",
      date: "2023",
      icon: <Award className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    { 
      title: "Full-Stack Web Development",
      issuer: "Self-directed",
      date: "2023",
      icon: <Award className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    { 
      title: "AWS Cloud Basics",
      issuer: "In Progress",
      date: "2026",
      icon: <Award className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Toast Notifications */}
      <Toaster position="top-right" />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-slate-800 z-50">
        <div 
          className={`h-full bg-gradient-to-r ${isDark ? 'from-blue-500 via-purple-500 to-pink-500' : 'from-blue-600 via-purple-600 to-pink-600'} transition-all duration-300`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isDark ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white`}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 backdrop-blur-xl transition-all duration-300 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-gray-200'} border-b shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className={`text-2xl font-bold bg-gradient-to-r ${isDark ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
            B.ARUL
          </div>
          
          <div className="hidden md:flex gap-8">
            {['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize transition-all duration-300 font-medium ${
                  activeSection === section 
                    ? isDark ? 'text-blue-400 scale-110' : 'text-blue-600 scale-110'
                    : isDark ? 'text-slate-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full ${isDark ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${isDark ? 'border-slate-800' : 'border-gray-200'} shadow-2xl`}>
            <div className="flex flex-col gap-2 p-6">
              {['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'].map(section => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section
                      ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                      : isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 px-6 overflow-hidden">
        <canvas ref={heroCanvasRef} className="absolute inset-0 z-0" />
        
        <div className="max-w-5xl mx-auto text-center z-10 space-y-8">
          <div className={`inline-block px-6 py-2 rounded-full border ${isDark ? 'border-blue-500/50 bg-blue-500/10' : 'border-blue-600/50 bg-blue-50'} backdrop-blur-sm animate-fade-in`}>
            <span className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-2`}>
              <Zap className="w-4 h-4" />
              Full-Stack Software Engineer
            </span>
          </div>
          
          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black mb-6 bg-gradient-to-r ${isDark ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent animate-fade-in-up leading-tight`}
              style={{ animationDelay: '0.2s' }}>
            B. ARUL
          </h1>
          
          <p className={`text-xl md:text-2xl lg:text-3xl ${isDark ? 'text-slate-300' : 'text-gray-700'} max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up`}
             style={{ animationDelay: '0.4s' }}>
            Crafting <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>scalable</span> and <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>high-performance</span> applications across legacy and modern tech stacks
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up`} style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => scrollToSection('projects')}
              className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white flex items-center gap-2`}
            >
              View My Work
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/resume.pdf"
              download="B_Arul_Resume.pdf"
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border-2 ${isDark ? 'border-purple-400 text-purple-400 hover:bg-purple-400/10' : 'border-purple-600 text-purple-600 hover:bg-purple-50'} flex items-center gap-2`}
            >
              <Download className="w-5 h-5" />
              Download Resume
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border-2 ${isDark ? 'border-blue-400 text-blue-400 hover:bg-blue-400/10' : 'border-blue-600 text-blue-600 hover:bg-blue-50'} flex items-center gap-2`}
            >
              <Send className="w-5 h-5" />
              Get In Touch
            </button>
          </div>

          <div className={`grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12 animate-fade-in-up`} style={{ animationDelay: '0.8s' }}>
            {[
              { number: "3+", label: "Years" },
              { number: "50+", label: "Clients" },
              { number: "99.8%", label: "Uptime" }
            ].map((stat, index) => (
              <div key={index} className={`text-center p-4 rounded-xl ${isDark ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-sm border ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stat.number}
                </div>
                <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollToSection('about')}
            className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
          >
            <ChevronDown className="w-10 h-10" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-24 px-6 relative z-10 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              About Me
            </h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Building the future, one line of code at a time
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Profile Photo Column */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 flex justify-center"
            >
              <div className={`relative group`}>
                <div className={`absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500`}></div>
                <img
                  src="images/profile.png"
                  alt="B. Arul - Full Stack Developer"
                  className={`relative w-full max-w-sm rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105 ${isDark ? 'border-4 border-slate-700' : 'border-4 border-gray-200'}`}
                />
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                I'm a <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>full-stack software engineer</span> with 3+ years of experience delivering enterprise-grade applications that serve millions of users. My expertise spans from maintaining <span className="font-semibold">legacy Oracle/PL/SQL</span> systems to architecting cutting-edge <span className="font-semibold">Node.js/React/PostgreSQL</span> platforms.
              </p>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                I thrive on solving complex technical challenges and have a proven track record of shipping <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>multimillion-dollar features</span>, optimizing database performance, and independently owning full product lifecycles from concept to production.
              </p>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Currently, I'm focused on building scalable insurance platforms and exploring innovations in system design, workflow automation, and cloud architecture. I'm passionate about <span className="font-semibold">creating resilient solutions</span> that drive measurable business value.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                {['System Design', 'Performance Tuning', 'Cloud Architecture', 'Agile Development'].map((skill, index) => (
                  <span 
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16"
          >
              {[
                { number: "3+", label: "Years Experience", icon: <Briefcase className="w-6 h-6" /> },
                { number: "50+", label: "Enterprise Clients", icon: <Award className="w-6 h-6" /> },
                { number: "99.8%", label: "System Uptime", icon: <TrendingUp className="w-6 h-6" /> },
                { number: "20+", label: "Modules Built", icon: <Code className="w-6 h-6" /> },
                { number: "45%", label: "Incident Reduction", icon: <Check className="w-6 h-6" /> },
                { number: "60%", label: "Performance Gain", icon: <Zap className="w-6 h-6" /> }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400'}`}
                >
                  <div className={`mb-3 flex justify-center ${isDark ? 'text-blue-400' : 'text-blue-600'} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              Technical Expertise
            </h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Mastering technologies across the full stack
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skillGroup, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400'}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${skillGroup.color} text-white group-hover:scale-110 transition-transform`}>
                    {skillGroup.icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {skillGroup.category}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {skillGroup.items.map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                          {skill.name}
                        </span>
                        <span className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-full bg-gradient-to-r ${skillGroup.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-24 px-6 relative z-10 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              Featured Projects
            </h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Building solutions that drive real business impact
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'}`}
              >
                {/* Project Image Header */}
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-30 group-hover:opacity-20 transition-opacity duration-500`}></div>
                </div>

                <div className="p-8">
                  <div className="mb-4">
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                      {project.title}
                    </h3>
                    <p className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {project.subtitle}
                    </p>
                  </div>

                  <p className={`mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {project.metrics.map((metric, i) => (
                      <div 
                        key={i}
                        className={`p-3 rounded-xl text-center ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}
                      >
                        <div className={`flex justify-center mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {metric.icon}
                        </div>
                        <div className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {metric.value}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Impact */}
                  <div className={`p-4 rounded-xl border-l-4 ${isDark ? 'bg-green-500/10 border-green-500' : 'bg-green-50 border-green-500'}`}>
                    <div className={`text-sm font-semibold mb-1 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      💡 Key Impact
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      {project.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              Professional Journey
            </h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Building enterprise solutions at scale
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                period: "2025 – Present",
                title: "Full-Stack Developer & Solo Entrepreneur",
                company: "Insurance-Suite Project",
                location: "Chennai, India",
                type: "Entrepreneurship",
                achievements: [
                  "Architected comprehensive insurance application with 20+ modules serving multiple business units",
                  "Optimized PostgreSQL queries achieving <500ms response times for 100K+ policy records",
                  "Built RESTful APIs with Express.js handling complex business workflows and multi-currency support",
                  "Containerized application using Docker for consistent deployment across environments",
                  "Delivered 50% performance improvement with zero critical production incidents"
                ],
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                period: "February 2023 – Present",
                title: "Software Engineer - Developer",
                company: "Azentio Software",
                location: "Chennai, India",
                type: "Full-time",
                achievements: [
                  "Managed enterprise PL/SQL systems serving 50+ banking clients with 99.8% uptime",
                  "Reduced production incidents by 45% through proactive monitoring and optimization",
                  "Delivered 15+ feature enhancements contributing to multimillion-dollar revenue stream",
                  "Improved query execution times by 40-60% and system load by 35% through performance tuning",
                  "Built automated alert system reducing incident response time from 2 hours to 15 minutes",
                  "Achieved 98% test coverage and 100% first-time fix rate on critical production issues"
                ],
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((exp, index) => (
              <div
                key={index}
                className={`relative pl-12 pb-8 ${index !== 1 ? 'border-l-2' : ''} ${isDark ? 'border-blue-500' : 'border-blue-600'}`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-0 top-0 w-6 h-6 rounded-full -translate-x-[13px] bg-gradient-to-br ${exp.gradient} border-4 ${isDark ? 'border-slate-950' : 'border-gray-50'} shadow-lg`} />
                
                <div className={`p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'}`}>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                      {exp.period}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${isDark ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                      {exp.type}
                    </span>
                  </div>
                  
                  <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {exp.title}
                  </h3>
                  
                  <div className={`flex items-center gap-2 mb-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{exp.company}</span>
                    <span>•</span>
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                  
                  <ul className="space-y-3">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className={`flex gap-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className={`py-24 px-6 relative z-10 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              Certifications & Learning
            </h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Continuous growth and professional development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'}`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {cert.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                  {cert.title}
                </h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {cert.issuer}
                </p>
                <p className={`text-xs font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {cert.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              Let's Connect
            </h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Open to exciting opportunities and collaborations
            </p>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`p-8 md:p-12 rounded-2xl ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'} shadow-2xl mb-12`}
          >
            <h3 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
              Send me a message
            </h3>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'} border-2 focus:outline-none`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'} border-2 focus:outline-none`}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'} border-2 focus:outline-none`}
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'} border-2 focus:outline-none resize-none`}
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Quick Contact Links */}
          <div className={`p-8 md:p-12 rounded-2xl ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'} shadow-2xl mb-12`}>
            <p className={`text-lg text-center mb-8 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              I'm currently open to <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>remote/hybrid opportunities</span> in Full-Stack Development, Enterprise Architecture, or Backend Engineering. Let's build something amazing together!
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="mailto:arul5780612@gmail.com"
                className={`group flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-blue-500' : 'bg-white border border-gray-200 hover:border-blue-400'}`}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white group-hover:scale-110 transition-transform`}>
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>Email</div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>arul5780612@gmail.com</div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/arul-balasundaram-0052a1246"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-blue-500' : 'bg-white border border-gray-200 hover:border-blue-400'}`}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white group-hover:scale-110 transition-transform`}>
                  <Linkedin className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>LinkedIn</div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Connect with me</div>
                </div>
              </a>

              <a
                href="tel:+919629025634"
                className={`group flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-blue-500' : 'bg-white border border-gray-200 hover:border-blue-400'}`}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white group-hover:scale-110 transition-transform`}>
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>Phone</div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>+91 96290 25634</div>
                </div>
              </a>
            </div>

            <div className={`mt-8 flex items-center justify-center gap-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Coimbatore, Tamil Nadu, India</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 text-center border-t ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm">
            &copy; 2026 <span className="font-semibold">B. Arul</span>. Crafted with passion and precision.
          </p>
          <p className="text-xs mt-2">
            Full-Stack Software Engineer | Building scalable solutions
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}