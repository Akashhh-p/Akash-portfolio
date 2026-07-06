import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContactMessage } from '../lib/supabase';

const LINKS = [
  { icon: Github,   label: 'GitHub',   href: 'https://github.com/Akashhh-p',                     value: 'github.com/Akashhh-p' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/akash-pentakota/',      value: 'akash-pentakota' },
  { icon: Mail,     label: 'Email',    href: 'mailto:akashp3620@gmail.com',                        value: 'akashp3620@gmail.com' },
  { icon: Phone,    label: 'Phone',    href: 'tel:+919912169094',                                  value: '+91 9912169094' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

const inputBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(215,226,234,0.15)',
  borderRadius: 12,
  padding: '0.85rem 1.1rem',
  color: '#D7E2EA',
  fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)',
  fontFamily: "'Kanit', sans-serif",
  fontWeight: 300,
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
      await submitContactMessage({
        name:    form.name.trim(),
        email:   form.email.trim(),
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      });
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="px-6 md:px-10 lg:px-14 py-24 md:py-36 flex flex-col relative z-10 overflow-hidden"
      style={{ background: '#120000' }}
    >
      {/* Large background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-black uppercase"
          style={{
            fontSize: 'clamp(8rem, 20vw, 22rem)',
            color: 'rgba(180,0,0,0.04)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.05em',
          }}
        >
          CONNECT
        </span>
      </div>

      <div className="relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-16 md:mb-20"
        >
          <div style={{ width: 24, height: 1, background: 'rgba(215,226,234,0.3)' }} />
          <span className="font-light uppercase tracking-widest text-[#D7E2EA] opacity-40" style={{ fontSize: '0.6rem' }}>
            Get In Touch
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          className="hero-heading font-black uppercase leading-none tracking-tight mb-16 md:mb-20"
          style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
        >
          Let&apos;s Build<br />Something<br />Intelligent.
        </motion.h2>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-28">
          {/* Left — form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-40" style={{ fontSize: '0.55rem' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  style={inputBase}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,0,0,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(215,226,234,0.15)')}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-40" style={{ fontSize: '0.55rem' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  style={inputBase}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,0,0,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(215,226,234,0.15)')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-40" style={{ fontSize: '0.55rem' }}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                style={inputBase}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(200,0,0,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(215,226,234,0.15)')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-40" style={{ fontSize: '0.55rem' }}>
                Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project, opportunity, or just say hi..."
                required
                rows={6}
                style={{ ...inputBase, resize: 'vertical', minHeight: 140 }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(200,0,0,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(215,226,234,0.15)')}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className="inline-flex items-center gap-2 rounded-full font-medium uppercase tracking-widest
                  text-white transition-all duration-200 hover:opacity-85 disabled:opacity-50"
                style={{
                  fontSize: '0.7rem',
                  background: 'linear-gradient(123deg, #1a0000 7%, #cc0000 37%, #8b0000 72%, #ff4500 100%)',
                  boxShadow: '0px 4px 20px rgba(200,0,0,0.3)',
                  padding: '0.85rem 2rem',
                }}
              >
                {status === 'sending' ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent' }}
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    Send Message
                  </>
                )}
              </button>

              {/* Feedback */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={15} className="text-green-400" />
                  <span className="text-green-400 font-light" style={{ fontSize: '0.75rem' }}>
                    Message sent — I&apos;ll reply soon!
                  </span>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <AlertCircle size={15} className="text-red-400" />
                  <span className="text-red-400 font-light" style={{ fontSize: '0.75rem' }}>
                    {errorMsg}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.form>

          {/* Right — links + note */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="flex flex-col justify-between gap-10"
          >
            <div>
              <p
                className="text-[#D7E2EA] font-light leading-relaxed mb-10"
                style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', opacity: 0.55, maxWidth: '40ch' }}
              >
                Whether you have an internship opportunity, a project idea, or just want to connect —
                fill out the form and I&apos;ll get back to you as soon as possible.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {LINKS.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, y: 16 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                      className="flex items-center gap-3 group"
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        className="flex items-center justify-center rounded-xl flex-shrink-0"
                        style={{
                          width: 40,
                          height: 40,
                          border: '1px solid rgba(215,226,234,0.15)',
                          background: 'rgba(255,255,255,0.03)',
                          transition: 'border-color 0.2s, background 0.2s',
                        }}
                      >
                        <Icon size={16} className="text-[#D7E2EA] group-hover:text-red-400 transition-colors duration-200" />
                      </div>
                      <div>
                        <p className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-35 mb-0.5" style={{ fontSize: '0.5rem' }}>
                          {link.label}
                        </p>
                        <p className="text-[#D7E2EA] font-medium group-hover:text-red-300 transition-colors duration-200" style={{ fontSize: 'clamp(0.65rem, 1vw, 0.78rem)' }}>
                          {link.value}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Availability note */}
            <div
              className="p-5 rounded-2xl"
              style={{ border: '1px solid rgba(200,0,0,0.2)', background: 'rgba(200,0,0,0.05)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)', display: 'inline-block' }} />
                <span className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.6rem' }}>
                  Currently Available
                </span>
              </div>
              <p className="text-[#D7E2EA] font-light leading-relaxed" style={{ fontSize: '0.8rem', opacity: 0.55 }}>
                Open to internships, part-time roles, and interesting AI/ML project collaborations.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(215,226,234,0.08)', marginBottom: '2rem' }} />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-25" style={{ fontSize: '0.55rem' }}>
            &copy; 2026 Akash Pentakota &mdash; B.Tech CS &amp; Machine Learning
          </p>
          <p className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-25" style={{ fontSize: '0.55rem' }}>
            Centurion University
          </p>
        </div>
      </div>
    </section>
  );
}
