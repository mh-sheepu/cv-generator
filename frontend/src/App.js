import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function makeHtml(form, selectedTemplate, photo) {
  const esc = s => (typeof s === 'string' ? s : '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const para = (text) => typeof text === 'string' && text.trim() ? `<div style="margin:6px 0">${esc(text).replace(/\n/g, '<br/>')}</div>` : '';
  const bullets = (items) => {
    if (!Array.isArray(items) || items.length === 0) return '';
    return `<ul style="margin:6px 0 0 18px">${items.map(item => `<li>${esc(item)}`).join('')}</ul>`;
  };
  const contactLine = [form.email, form.phone, form.linkedin, form.github, form.website].filter(Boolean).map(esc).join(' | ');
  if (selectedTemplate === 'modern') {
    return `
    <div style="font-family: Arial, Helvetica, sans-serif; color:#222; max-width:900px; margin:0 auto; background:#fff; border-radius:16px; box-shadow:0 2px 16px #0001; overflow:hidden;">
      <div style="background:#f9a825; height:16px; width:100%;"></div>
      <div style="display:flex; flex-wrap:wrap;">
        <div style="flex:2; padding:32px 32px 32px 40px; min-width:320px;">
          <div style="font-size:2.2rem; font-weight:900; letter-spacing:1px; margin-bottom:8px;">${esc(form.name)}</div>
          ${form.summaryParagraph ? `<div style="margin-bottom:24px;"><div style="font-weight:700; color:#f9a825; font-size:1.1rem; margin-bottom:6px;">PROFESSIONAL SUMMARY</div><div style="border-top:2px solid #eee; margin-bottom:8px;"></div>${para(form.summaryParagraph)}</div>` : ''}
          ${form.experience.length > 0 ? `<div style="margin-bottom:24px;"><div style="font-weight:700; color:#f9a825; font-size:1.1rem; margin-bottom:6px;">EXPERIENCE</div><div style="border-top:2px solid #eee; margin-bottom:8px;"></div>${form.experience.map(exp => `<div style="margin-bottom:10px;"><div style="font-weight:700;">${esc(exp.position)}</div><div style="color:#666;font-size:0.95rem;">${[exp.company, exp.type, [exp.startDate, exp.endDate].filter(Boolean).join(' – ')].filter(Boolean).join(', ')}</div>${exp.description ? para(exp.description) : ''}</div>`).join('')}</div>` : ''}
          ${form.education.length > 0 ? `<div style="margin-bottom:24px;"><div style="font-weight:700; color:#f9a825; font-size:1.1rem; margin-bottom:6px;">EDUCATION</div><div style="border-top:2px solid #eee; margin-bottom:8px;"></div>${form.education.map(edu => `<div style="margin-bottom:10px;"><div style="font-weight:700;">${esc(edu.degree)}</div><div style="color:#666;font-size:0.95rem;">${[edu.name, edu.year].filter(Boolean).join(' — ')}</div>${edu.result ? `<div style="margin:4px 0">${esc(edu.result)}</div>` : ''}</div>`).join('')}</div>` : ''}
        </div>
        <div style="flex:1; background:#f5f5f5; padding:32px 24px; min-width:220px;">
          <div style="font-weight:700; color:#f9a825; font-size:1.1rem; margin-bottom:6px;">CONTACT</div>
          <div style="font-size:0.98rem; margin-bottom:8px;">${esc(form.address)}</div>
          <div style="font-size:0.98rem; margin-bottom:8px;">${contactLine}</div>
          ${form.skills.length > 0 ? `<div style="margin:18px 0 0 0;"><div style="font-weight:700; color:#f9a825; font-size:1.1rem; margin-bottom:6px;">CORE QUALIFICATIONS</div><div style="border-top:2px solid #eee; margin-bottom:8px;"></div>${bullets(form.skills.filter(s => typeof s === 'string' && s.trim()))}</div>` : ''}
          ${form.languages.length > 0 ? `<div style="margin:18px 0 0 0;"><div style="font-weight:700; color:#f9a825; font-size:1.1rem; margin-bottom:6px;">LANGUAGES</div><div style="border-top:2px solid #eee; margin-bottom:8px;"></div>${bullets(form.languages.filter(l => typeof l === 'string' && l.trim()))}</div>` : ''}
          ${form.certifications.length > 0 ? `<div style="margin:18px 0 0 0;"><div style="font-weight:700; color:#f9a825; font-size:1.1rem; margin-bottom:6px;">ADDITIONAL INFORMATION</div><div style="border-top:2px solid #eee; margin-bottom:8px;"></div>${bullets(form.certifications.filter(c => typeof c === 'string' && c.trim()))}</div>` : ''}
          ${form.hobbies.length > 0 ? `<div style="margin:18px 0 0 0;"><div style="font-weight:700; color:#f9a825; font-size:1.1rem; margin-bottom:6px;">INTERESTS</div><div style="border-top:2px solid #eee; margin-bottom:8px;"></div>${bullets(form.hobbies.filter(h => typeof h === 'string' && h.trim()))}</div>` : ''}
        </div>
      </div>
    </div>
    `;
  }
  if (selectedTemplate === 'classic') {
    // Classic template based on provided example
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; color:#222; max-width:800px; margin:0 auto; background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; padding:32px;">
        <div style="display:flex; align-items:flex-start; gap:32px;">
          <div style="flex:2;">
            <h1 style="font-size:2rem; font-weight:900; margin-bottom:8px;">CV</h1>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
              <div>
                <div style="margin-bottom:8px;"><strong>Name</strong><br/>${form.name}</div>
                <div style="margin-bottom:8px;"><strong>Address</strong><br/>${form.address}</div>
                <div style="margin-bottom:8px;"><strong>Email</strong><br/>${form.email}</div>
              </div>
              <div>
                <div style="margin-bottom:8px;"><strong>Birthday</strong><br/>${form.dob}</div>
                <div style="margin-bottom:8px;"><strong>Phone</strong><br/>${form.phone}</div>
              </div>
            </div>
          </div>
          <div style="flex:1; text-align:right;">
            ${photo ? `<img src='${photo}' alt='Profile' style='width:120px; border-radius:8px;' />` : ''}
          </div>
        </div>
        <div style="margin-top:24px;">
          <div style="font-weight:700; background:#e0e0e0; padding:6px 12px; border-radius:4px; margin-bottom:8px;">Career</div>
          ${form.experience.map((exp, i) => `<div style="background:${i%2===0?'#f5f5f5':'#fff'}; margin-bottom:8px; padding:8px 12px; border-radius:4px;"><div style="font-weight:700;">${exp.position}</div><div>${exp.company} (${exp.startDate} - ${exp.endDate})</div><div>${exp.description || ''}</div></div>`).join('')}
        </div>
        <div style="margin-top:24px;">
          <div style="font-weight:700; background:#e0e0e0; padding:6px 12px; border-radius:4px; margin-bottom:8px;">Education</div>
          ${form.education.map((edu, i) => `<div style="background:${i%2===0?'#f5f5f5':'#fff'}; margin-bottom:8px; padding:8px 12px; border-radius:4px;"><div style="font-weight:700;">${edu.degree}</div><div>${edu.name} (${edu.year})</div></div>`).join('')}
        </div>
        <div style="margin-top:24px;">
          <div style="font-weight:700; background:#e0e0e0; padding:6px 12px; border-radius:4px; margin-bottom:8px;">Skills and Interests</div>
          <div><strong>Language skills</strong>: ${form.languages.join(', ')}</div>
          <div><strong>Computer skills</strong>: ${form.skills.join(', ')}</div>
          <div><strong>Interests</strong>: ${form.hobbies.join(', ')}</div>
        </div>
        <div style="margin-top:24px;">
          <div style="font-weight:700; background:#e0e0e0; padding:6px 12px; border-radius:4px; margin-bottom:8px;">Certifications</div>
          ${form.certifications.length > 0 ? `<div style="background:#f5f5f5; margin-bottom:8px; padding:8px 12px; border-radius:4px;">${form.certifications.join(', ')}</div>` : '<div style="color:#888;">None</div>'}
        </div>
        <div style="margin-top:24px;">
          <div style="font-weight:700; background:#e0e0e0; padding:6px 12px; border-radius:4px; margin-bottom:8px;">Awards</div>
          ${form.awards.length > 0 ? `<div style="background:#f5f5f5; margin-bottom:8px; padding:8px 12px; border-radius:4px;">${form.awards.join(', ')}</div>` : '<div style="color:#888;">None</div>'}
        </div>
        <div style="margin-top:24px;">
          <div style="font-weight:700; background:#e0e0e0; padding:6px 12px; border-radius:4px; margin-bottom:8px;">Publications</div>
          ${form.publications.length > 0 ? `<div style="background:#f5f5f5; margin-bottom:8px; padding:8px 12px; border-radius:4px;">${form.publications.join(', ')}</div>` : '<div style="color:#888;">None</div>'}
        </div>
        <div style="margin-top:24px;">
          <div style="font-weight:700; background:#e0e0e0; padding:6px 12px; border-radius:4px; margin-bottom:8px;">Volunteer Experience</div>
          ${form.volunteer.length > 0 ? `<div style="background:#f5f5f5; margin-bottom:8px; padding:8px 12px; border-radius:4px;">${form.volunteer.join(', ')}</div>` : '<div style="color:#888;">None</div>'}
        </div>
        <div style="margin-top:24px;">
          <div style="font-weight:700; background:#e0e0e0; padding:6px 12px; border-radius:4px; margin-bottom:8px;">Additional Info</div>
          <div><strong>Nationality</strong>: ${form.nationality}</div>
          <div><strong>LinkedIn</strong>: ${form.linkedin}</div>
          <div><strong>GitHub</strong>: ${form.github}</div>
          <div><strong>Website</strong>: ${form.website}</div>
        </div>
        <div style="margin-top:32px; font-size:0.95rem; color:#666;">London, 1st January 2023</div>
        <div style="margin-top:12px; font-size:1.2rem; color:#666;">${form.references ? form.references : ''}</div>
      </div>
    `;
  }
  if (selectedTemplate === 'ats') {
    // ATS template based on provided example
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; color:#222; max-width:800px; margin:0 auto; background:#fff; border-radius:8px; box-shadow:0 2px 8px #0001; padding:32px;">
        <div style="text-align:center; margin-bottom:8px;">
          <h1 style="font-size:2.2rem; font-weight:900; margin-bottom:4px;">${form.name}</h1>
          <div style="font-size:1.1rem; font-weight:700; margin-bottom:4px;">${form.summaryTitle || ''}</div>
          <div style="font-size:1rem; color:#444; margin-bottom:8px;">${[form.address, form.email, form.phone, form.linkedin].filter(Boolean).join(' | ')}</div>
        </div>
        <div style="margin-bottom:18px;">
          <div style="font-weight:700; text-transform:uppercase; font-size:1.1rem; margin-bottom:2px;">Professional Summary</div>
          <hr style="border:0; border-top:2px solid #222; margin:4px 0 8px 0;" />
          <div>${form.summaryParagraph || ''}</div>
        </div>
        <div style="margin-bottom:18px;">
          <div style="font-weight:700; text-transform:uppercase; font-size:1.1rem; margin-bottom:2px;">Work Experience</div>
          <hr style="border:0; border-top:2px solid #222; margin:4px 0 8px 0;" />
          ${form.experience.map(exp => `<div style="margin-bottom:12px;"><div style="font-weight:700;">${exp.position}</div><div>${exp.company} | ${exp.startDate} – ${exp.endDate}</div><ul>${exp.description ? exp.description.split('\n').map(line => `<li>${line}</li>`).join('') : ''}</ul></div>`).join('')}
        </div>
        <div style="margin-bottom:18px;">
          <div style="font-weight:700; text-transform:uppercase; font-size:1.1rem; margin-bottom:2px;">Education</div>
          <hr style="border:0; border-top:2px solid #222; margin:4px 0 8px 0;" />
          ${form.education.map(edu => `<div style="margin-bottom:12px;"><div style="font-weight:700;">${edu.degree}</div><div>${edu.name} | Graduated: ${edu.year}</div></div>`).join('')}
        </div>
        <div style="margin-bottom:18px;">
          <div style="font-weight:700; text-transform:uppercase; font-size:1.1rem; margin-bottom:2px;">Skills</div>
          <hr style="border:0; border-top:2px solid #222; margin:4px 0 8px 0;" />
          <ul>${form.skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
        </div>
        <div style="margin-bottom:18px;">
          <div style="font-weight:700; text-transform:uppercase; font-size:1.1rem; margin-bottom:2px;">Certifications</div>
          <hr style="border:0; border-top:2px solid #222; margin:4px 0 8px 0;" />
          <ul>${form.certifications.map(cert => `<li>${cert}</li>`).join('')}</ul>
        </div>
      </div>
    `;
  }
  // ...existing code for other templates...
}

export default function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [template, setTemplate] = useState({ value: 'modern', label: 'Modern' });
  const templateOptions = [
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' },
    { value: 'ats', label: 'ATS (Stock)' }
  ];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const styles = {
    container: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: isMobile ? '16px 12px' : '48px 32px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#1e293b',
      lineHeight: 1.6,
    },
    mainCard: {
      background: '#ffffff',
      borderRadius: isMobile ? 12 : 20,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      border: '1px solid rgba(148, 163, 184, 0.1)',
    },
    header: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      padding: isMobile ? '32px 20px' : '48px 40px',
      textAlign: 'center',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    },
    headerPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    title: {
      fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 3.5rem)',
      fontWeight: 800,
      margin: 0,
      letterSpacing: '-0.025em',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 1,
    },
    subtitle: {
      fontSize: isMobile ? '1rem' : '1.125rem',
      fontWeight: 400,
      margin: '12px 0 0 0',
      opacity: 0.9,
      position: 'relative',
      zIndex: 1,
    },
    formContainer: {
      padding: isMobile ? '24px 16px' : '40px 32px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? 16 : 24,
    },
    sectionCard: {
      background: '#ffffff',
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e2e8f0',
      marginBottom: isMobile ? 20 : 28,
      overflow: 'visible',
    },
    sectionHeader: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: isMobile ? '16px 20px' : '24px 32px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      fontWeight: 700,
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    sectionBody: {
      padding: isMobile ? '16px' : '24px 32px 32px 32px',
    },
    sectionIcon: {
      width: 24,
      height: 24,
      color: '#667eea',
    },
    entryCard: {
      background: '#f8fafc',
      borderRadius: 12,
      padding: isMobile ? 16 : 24,
      marginBottom: 20,
      border: '1px solid #e2e8f0',
      position: 'relative',
    },
    entryHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    entryNumber: {
      background: '#667eea',
      color: '#ffffff',
      width: 28,
      height: 28,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: 700,
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: isMobile ? 16 : 20,
      marginBottom: 20,
    },
    twoColCompact: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: isMobile ? 16 : 20,
      marginBottom: 20,
    },
    smallGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? 16 : 20,
      marginBottom: 20,
    },
    inputGroup: {
      position: 'relative',
      marginBottom: isMobile ? 16 : 20,
    },
    inputLabel: {
      fontSize: '0.875rem',
      fontWeight: 600,
      marginBottom: 8,
      color: '#475569',
      display: 'block',
      letterSpacing: '0.025em',
    },
    input: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: 12,
      fontSize: '0.95rem',
      fontFamily: 'inherit',
      backgroundColor: '#ffffff',
      outline: 'none',
      color: '#1e293b',
      boxSizing: 'border-box',
    },
    dateInput: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: 12,
      fontSize: '0.95rem',
      fontFamily: 'inherit',
      backgroundColor: '#ffffff',
      outline: 'none',
      color: '#1e293b',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: 12,
      fontSize: '0.95rem',
      fontFamily: 'inherit',
      backgroundColor: '#ffffff',
      minHeight: isMobile ? 100 : 120,
      resize: 'vertical',
      outline: 'none',
      color: '#1e293b',
      lineHeight: 1.6,
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: 12,
      fontSize: '0.95rem',
      fontFamily: 'inherit',
      backgroundColor: '#ffffff',
      outline: 'none',
      color: '#1e293b',
      cursor: 'pointer',
      boxSizing: 'border-box',
    },
    addButton: {
      padding: isMobile ? '10px 16px' : '12px 20px',
      borderRadius: 10,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: 8,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: '0 4px 12px 0 rgba(16, 185, 129, 0.3)',
    },
    removeButton: {
      padding: '6px 12px',
      borderRadius: 8,
      background: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fecaca',
      fontSize: '0.75rem',
      fontWeight: 600,
      cursor: 'pointer',
    },
    removeIcon: {
      fontSize: '1.2rem',
      lineHeight: 1,
    },
    addIcon: {
      fontSize: '1.1rem',
      fontWeight: 700,
    },
    actionSection: {
      padding: isMobile ? '32px 16px' : '40px 32px',
      borderTop: '1px solid #e2e8f0',
      marginTop: 24,
    },
    buttonGroup: {
      display: 'flex',
      gap: isMobile ? 12 : 20,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    primaryButton: {
      width: isMobile ? '100%' : 'auto',
      padding: '16px 32px',
      borderRadius: 12,
      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      color: '#ffffff',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 14px 0 rgba(6, 182, 212, 0.3)',
      letterSpacing: '0.025em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    secondaryButton: {
      width: isMobile ? '100%' : 'auto',
      padding: '16px 32px',
      borderRadius: 12,
      background: '#f8fafc',
      color: '#64748b',
      border: '2px solid #e2e8f0',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    successButton: {
      width: isMobile ? '100%' : 'auto',
      padding: '16px 32px',
      borderRadius: 12,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center',
    },
    previewContainer: {
      background: '#ffffff',
      borderRadius: 16,
      boxShadow: '0 8px 22px -6px rgba(15,23,42,0.08)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginTop: 32,
    },
    previewHeader: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: isMobile ? '16px 20px' : '24px 32px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    previewTitle: {
      fontSize: isMobile ? '1.1rem' : '1.125rem',
      fontWeight: 700,
      color: '#1e293b',
      margin: 0,
    },
    previewIcon: {
      width: 20,
      height: 20,
      color: '#667eea',
    },
    previewContent: {
      padding: isMobile ? 16 : 32,
      background: '#ffffff',
      maxHeight: isMobile ? '500px' : '700px',
      overflow: 'auto',
      lineHeight: 1.7,
      fontSize: isMobile ? '0.85rem' : '1rem',
    },
    emptyPreview: {
      padding: isMobile ? '40px 20px' : '64px 32px',
      textAlign: 'center',
      color: '#64748b',
    },
    emptyIcon: {
      fontSize: isMobile ? '2.5rem' : '3.5rem',
      marginBottom: 20,
      opacity: 0.5,
    },
    emptyText: {
      fontSize: isMobile ? '0.9rem' : '1.05rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    footer: {
      marginTop: isMobile ? 32 : 48,
      padding: isMobile ? '24px 16px' : '32px 24px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderTop: '2px solid #e2e8f0',
      borderRadius: '16px 16px 0 0',
    },
    footerText: {
      fontSize: isMobile ? '0.85rem' : '0.95rem',
      color: '#64748b',
      fontWeight: 500,
      margin: 0,
    },
    aiSection: {
      padding: isMobile ? '20px' : '32px 32px 40px 32px',
      background: '#ffffff',
      borderRadius: 16,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      marginBottom: isMobile ? 24 : 40,
    },
    aiHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
      color: '#1e293b',
      fontWeight: 700,
      fontSize: isMobile ? '1.1rem' : '1.25rem',
    },
    aiTextarea: {
      width: '100%',
      minHeight: isMobile ? 80 : 120,
      padding: 12,
      borderRadius: 12,
      border: '2px solid #e2e8f0',
      fontSize: '0.9rem',
      fontFamily: 'inherit',
      marginBottom: 16,
      resize: 'vertical',
      boxSizing: 'border-box',
      outline: 'none',
    },
    aiButton: {
      width: '100%',
      padding: '14px',
      borderRadius: 12,
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      color: '#ffffff',
      border: 'none',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '18px',
      height: '18px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: '50%',
      borderTopColor: '#ffffff',
      animation: 'spin 1s linear infinite',
    },
    clearIcon: { fontSize: '1.1rem' },
    downloadIcon: { fontSize: '1.1rem' },
    generateIcon: { fontSize: '1.1rem' },
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: '',
    dob: '',
    nationality: '',
    summaryTitle: '',
    summaryParagraph: '',
    objective: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    achievements: [],
    volunteer: [],
    awards: [],
    publications: [],
    hobbies: [],
    references: ''
  });

  const [loading, setLoading] = useState(false);
  const [cvHtml, setCvHtml] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [cvList, setCvList] = useState([]);

  const previewRef = useRef(null);

  // Save each generated CV to localStorage
  useEffect(() => {
    if (cvHtml) {
      const allCVs = JSON.parse(localStorage.getItem('cvList') || '[]');
      allCVs.push(cvHtml);
      localStorage.setItem('cvList', JSON.stringify(allCVs));
      setCvList(allCVs);
    }
  }, [cvHtml]);

  // Load CVs on admin login
  useEffect(() => {
    if (adminLoggedIn) {
      const allCVs = JSON.parse(localStorage.getItem('cvList') || '[]');
      setCvList(allCVs);
    }
  }, [adminLoggedIn]);

  // Deployment-friendly API URL
  const apiUrl = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://cv-generator-backend.vercel.app' // Change to your Vercel backend URL
    : (process.env.REACT_APP_API_URL || 'http://localhost:5001');

  const handleGenerateFromPrompt = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const response = await axios.post(`${apiUrl}/generate-from-prompt`, { prompt: aiPrompt });
      setForm(prev => ({ ...prev, ...response.data }));
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating from prompt:', error);
      alert('Failed to generate CV from prompt. Please try again.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...form[field]];
    if (key === null) {
      newArray[index] = value;
    } else {
      newArray[index][key] = value;
    }
    setForm({ ...form, [field]: newArray });
  };

  const addItem = (field, template) => {
    const newItem = typeof template === 'object' && template !== null ? { ...template } : template;
    setForm({ ...form, [field]: [...form[field], newItem] });
  };

  const removeItem = (field, index) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCvHtml(makeHtml(form, template.value, photo));
    setLoading(false);
    setTimeout(() => {
      downloadCV();
    }, 500);
  };

  const handlePrint = () => {
    if (!cvHtml) return;
    const w = window.open('', '_blank');
    const printCss = `
      <style>
        body{font-family: Arial, Helvetica, sans-serif; color:#111;}
        h3{font-size:13px; margin:18px 0 8px 0; padding-bottom:6px; border-bottom:1px solid #dfe6ee}
        ul{margin:6px 0 0 18px}
      </style>
    `;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8">${printCss}</head><body>${cvHtml}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  const downloadCV = (cvHtml, template) => {
    if (!cvHtml) return;
    const blob = new Blob([cvHtml], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cv-${template.value || template}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add photo to form state
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'sheepu@2025') {
      setAdminLoggedIn(true);
      setAdminError('');
    } else {
      setAdminError('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      {/* Admin Button and Modal */}
      <div style={{ position: 'absolute', top: 16, right: 32, zIndex: 1000 }}>
        <button onClick={() => setShowAdmin(true)} style={{ padding: '10px 20px', borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Admin</button>
      </div>
      {showAdmin && !adminLoggedIn && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleAdminLogin} style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px #0002', minWidth: 320 }}>
            <h2 style={{ marginBottom: 18 }}>Admin Login</h2>
            <input type="text" placeholder="Username" value={adminUser} onChange={e => setAdminUser(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
            <input type="password" placeholder="Password" value={adminPass} onChange={e => setAdminPass(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
            {adminError && <div style={{ color: 'red', marginBottom: 10 }}>{adminError}</div>}
            <button type="submit" style={{ padding: '10px 20px', borderRadius: 8, background: '#10b981', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%' }}>Login</button>
            <button type="button" onClick={() => setShowAdmin(false)} style={{ marginTop: 10, padding: '8px 20px', borderRadius: 8, background: '#eee', color: '#333', fontWeight: 500, border: 'none', cursor: 'pointer', width: '100%' }}>Cancel</button>
          </form>
        </div>
      )}
      {showAdmin && adminLoggedIn && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2000, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px #0002', minWidth: 400, maxWidth: 900, marginTop: 40 }}>
            <h2 style={{ marginBottom: 18 }}>Admin Dashboard</h2>
            <div style={{ marginBottom: 18, fontWeight: 700 }}>Total CVs Generated: {cvList.length}</div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 12, background: '#fafafa' }}>
              {cvList.length === 0 ? <div>No CVs generated yet.</div> : cvList.map((cv, idx) => (
                <div key={idx} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>CV #{idx + 1}</div>
                  <div dangerouslySetInnerHTML={{ __html: cv }} />
                </div>
              ))}
            </div>
            <button type="button" onClick={() => { setAdminLoggedIn(false); setShowAdmin(false); }} style={{ marginTop: 18, padding: '10px 20px', borderRadius: 8, background: '#dc2626', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      )}
      <div style={styles.mainCard}>
        <div style={styles.header}>
          <div style={styles.headerPattern}></div>
          <h1 style={styles.title}>CV Generator</h1>
          <p style={styles.subtitle}>Create professional CVs with modern design</p>
        </div>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.aiSection}>
              <div style={styles.aiHeader}>
                <span>✨ AI Auto-Fill</span>
              </div>
              <textarea
                style={styles.aiTextarea}
                placeholder="Paste your LinkedIn bio, resume summary, or just describe yourself here..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button
                type="button"
                onClick={handleGenerateFromPrompt}
                disabled={isAiGenerating || !aiPrompt.trim()}
                style={styles.aiButton}
              >
                {isAiGenerating ? 'Generating...' : '✨ Auto-Fill CV with AI'}
              </button>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>👤 Personal Information</div>
              </div>
              <div style={styles.sectionBody}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Full Name</label>
                  <input name="name" style={styles.input} value={form.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div style={styles.twoColCompact}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Email</label>
                    <input name="email" type="email" style={styles.input} value={form.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Phone</label>
                    <input name="phone" type="tel" style={styles.input} value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Address</label>
                  <input name="address" style={styles.input} value={form.address} onChange={handleChange} placeholder="123 Main St, City, State, ZIP" />
                </div>
                <div style={styles.twoColCompact}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>LinkedIn</label>
                    <input name="linkedin" style={styles.input} value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/johndoe" />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>GitHub</label>
                    <input name="github" style={styles.input} value={form.github} onChange={handleChange} placeholder="github.com/johndoe" />
                  </div>
                </div>
                <div style={styles.twoColCompact}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Website</label>
                    <input name="website" style={styles.input} value={form.website} onChange={handleChange} placeholder="johndoe.com" />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Date of Birth</label>
                    <input name="dob" type="date" style={styles.dateInput} value={form.dob} onChange={handleChange} />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Nationality</label>
                  <input name="nationality" style={styles.input} value={form.nationality} onChange={handleChange} placeholder="American" />
                </div>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Professional Summary</div>
                <div style={styles.sectionIcon}>📝</div>
              </div>
              <div style={styles.sectionBody}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Title</label>
                  <input name="summaryTitle" style={styles.input} value={form.summaryTitle} onChange={handleChange} placeholder="e.g., Software Engineer" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Summary</label>
                  <textarea name="summaryParagraph" style={styles.textarea} value={form.summaryParagraph} onChange={handleChange} placeholder="Summary..." />
                </div>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Work Experience</div>
                <div style={styles.sectionIcon}>💼</div>
              </div>
              <div style={styles.sectionBody}>
                {form.experience.map((exp, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('experience', index)} style={styles.removeButton}>×</button>
                    </div>
                    <div style={styles.formGrid}>
                      <input placeholder="Position" value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} style={styles.input} />
                      <input placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <textarea placeholder="Description" value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} style={styles.textarea} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '', type: '' })} style={styles.addButton}>+ Add Experience</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Education</div>
                <div style={styles.sectionIcon}>🎓</div>
              </div>
              <div style={styles.sectionBody}>
                {form.education.map((edu, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('education', index)} style={styles.removeButton}>×</button>
                    </div>
                    <div style={styles.formGrid}>
                      <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} style={styles.input} />
                      <input placeholder="Institution" value={edu.name} onChange={(e) => handleArrayChange('education', index, 'name', e.target.value)} style={styles.input} />
                    </div>
                    <div style={styles.smallGrid}>
                      <input placeholder="Year" value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} style={styles.input} />
                      <input placeholder="Result/GPA" value={edu.result} onChange={(e) => handleArrayChange('education', index, 'result', e.target.value)} style={styles.input} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('education', { name: '', degree: '', year: '', result: '' })} style={styles.addButton}>+ Add Education</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Skills</div>
                <div style={styles.sectionIcon}>⚡</div>
              </div>
              <div style={styles.sectionBody}>
                {form.skills.map((skill, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('skills', index)} style={styles.removeButton}>×</button>
                    </div>
                    <input placeholder="e.g. JavaScript" value={skill} onChange={(e) => handleArrayChange('skills', index, null, e.target.value)} style={styles.input} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('skills', '')} style={styles.addButton}>+ Add Skill</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Certifications</div>
                <div style={styles.sectionIcon}>🏆</div>
              </div>
              <div style={styles.sectionBody}>
                {form.certifications.map((cert, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('certifications', index)} style={styles.removeButton}>×</button>
                    </div>
                    <input placeholder="Certification" value={cert} onChange={(e) => handleArrayChange('certifications', index, null, e.target.value)} style={styles.input} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('certifications', '')} style={styles.addButton}>+ Add Certification</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Languages</div>
                <div style={styles.sectionIcon}>🌍</div>
              </div>
              <div style={styles.sectionBody}>
                {form.languages.map((lang, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('languages', index)} style={styles.removeButton}>×</button>
                    </div>
                    <input placeholder="Language" value={lang} onChange={(e) => handleArrayChange('languages', index, null, e.target.value)} style={styles.input} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('languages', '')} style={styles.addButton}>+ Add Language</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Projects</div>
                <div style={styles.sectionIcon}>🚀</div>
              </div>
              <div style={styles.sectionBody}>
                {form.projects.map((proj, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('projects', index)} style={styles.removeButton}>×</button>
                    </div>
                    <input placeholder="Project Name" value={proj.name} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} style={styles.input} />
                    <textarea placeholder="Description" value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} style={styles.textarea} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('projects', { name: '', description: '' })} style={styles.addButton}>+ Add Project</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Achievements</div>
                <div style={styles.sectionIcon}>🏅</div>
              </div>
              <div style={styles.sectionBody}>
                {form.achievements.map((ach, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('achievements', index)} style={styles.removeButton}>×</button>
                    </div>
                    <textarea placeholder="Achievement" value={ach} onChange={(e) => handleArrayChange('achievements', index, null, e.target.value)} style={styles.textarea} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('achievements', '')} style={styles.addButton}>+ Add Achievement</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Volunteer Experience</div>
                <div style={styles.sectionIcon}>🤝</div>
              </div>
              <div style={styles.sectionBody}>
                {form.volunteer.map((vol, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('volunteer', index)} style={styles.removeButton}>×</button>
                    </div>
                    <textarea placeholder="Volunteer Experience" value={vol} onChange={(e) => handleArrayChange('volunteer', index, null, e.target.value)} style={styles.textarea} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('volunteer', '')} style={styles.addButton}>+ Add Volunteer Experience</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Awards</div>
                <div style={styles.sectionIcon}>🎖️</div>
              </div>
              <div style={styles.sectionBody}>
                {form.awards.map((award, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('awards', index)} style={styles.removeButton}>×</button>
                    </div>
                    <input placeholder="Award" value={award} onChange={(e) => handleArrayChange('awards', index, null, e.target.value)} style={styles.input} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('awards', '')} style={styles.addButton}>+ Add Award</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Publications</div>
                <div style={styles.sectionIcon}>📚</div>
              </div>
              <div style={styles.sectionBody}>
                {form.publications.map((pub, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('publications', index)} style={styles.removeButton}>×</button>
                    </div>
                    <textarea placeholder="Publication" value={pub} onChange={(e) => handleArrayChange('publications', index, null, e.target.value)} style={styles.textarea} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('publications', '')} style={styles.addButton}>+ Add Publication</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Hobbies / Interests</div>
                <div style={styles.sectionIcon}>🎨</div>
              </div>
              <div style={styles.sectionBody}>
                {form.hobbies.map((hobby, index) => (
                  <div key={index} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <div style={styles.entryNumber}>{index + 1}</div>
                      <button type="button" onClick={() => removeItem('hobbies', index)} style={styles.removeButton}>×</button>
                    </div>
                    <input placeholder="Hobby" value={hobby} onChange={(e) => handleArrayChange('hobbies', index, null, e.target.value)} style={styles.input} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem('hobbies', '')} style={styles.addButton}>+ Add Hobby</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>References</div>
                <div style={styles.sectionIcon}>📞</div>
              </div>
              <div style={styles.sectionBody}>
                <textarea name="references" style={styles.textarea} value={form.references} onChange={handleChange} placeholder="References..." />
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Upload Photo</div>
              </div>
              <div style={styles.sectionBody}>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                {photo && (
                  <img src={photo} alt="Profile" style={{ marginTop: 12, maxWidth: 120, borderRadius: 8 }} />
                )}
              </div>
            </div>

            <div style={styles.actionSection}>
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.primaryButton} disabled={loading}>
                  {loading ? 'Generating...' : '⚡ Generate CV'}
                </button>
                <button type="button" onClick={() => setCvHtml('')} style={styles.secondaryButton}>🗑️ Clear</button>
                {cvHtml && (
                  <button type="button" onClick={() => downloadCV(cvHtml, template)} style={styles.successButton}>📄 Save / Print</button>
                )}
              </div>
              <div style={{ marginTop: 24, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
                <label style={{ ...styles.inputLabel, marginBottom: 6 }}>CV Template</label>
                <Select
                  options={templateOptions}
                  value={template}
                  onChange={setTemplate}
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: '100%',
                      borderRadius: 12,
                      fontSize: '1rem',
                      borderColor: '#e2e8f0',
                      boxShadow: 'none',
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: 12,
                      fontSize: '1rem',
                    })
                  }}
                />
              </div>
            </div>
          </form>
        </div>

        <div style={styles.previewContainer}>
          <div style={styles.previewHeader}><div style={styles.previewTitle}>CV Preview</div></div>
          {cvHtml ? (
            <div ref={previewRef} style={styles.previewContent} dangerouslySetInnerHTML={{ __html: cvHtml }} />
          ) : (
            <div style={styles.emptyPreview}><div style={styles.emptyText}>Preview will appear here...</div></div>
          )}
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>© 2025 Mahmudul Hasan Sheepu. | All Rights Reserved</p>
      </div>
    </div>
  );
}
