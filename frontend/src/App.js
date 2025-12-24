import React, { useState, useRef } from 'react';
import axios from 'axios';

const styles = {
  // Modern Design System
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '48px 32px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#1e293b',
    lineHeight: 1.6,
  },
  mainCard: {
    background: '#ffffff',
    borderRadius: 20,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  header: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    padding: '48px 40px',
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
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.025em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: 1,
  },
  subtitle: {
    fontSize: '1.125rem',
    fontWeight: 400,
    margin: '12px 0 0 0',
    opacity: 0.9,
    position: 'relative',
    zIndex: 1,
  },
  formContainer: {
    padding: '40px 32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  section: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  sectionHover: {
    ':hover': {
      borderColor: '#667eea',
      boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.15)',
      transform: 'translateY(-2px)',
    },
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: 24,
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    color: '#667eea',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    marginBottom: 20,
  },
  full: {
    width: '100%',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: 20,
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: 8,
    color: '#475569',
    display: 'block',
    letterSpacing: '0.025em',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: 12,
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    color: '#1e293b',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
      backgroundColor: '#fefefe',
    },
    ':hover': {
      borderColor: '#cbd5e0',
    },
    '::placeholder': {
      color: '#94a3b8',
    },
  },
  dateInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: 12,
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    color: '#1e293b',
    cursor: 'pointer',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
    ':hover': {
      borderColor: '#cbd5e0',
    },
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: 12,
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    minHeight: 120,
    resize: 'vertical',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    color: '#1e293b',
    lineHeight: 1.6,
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
      backgroundColor: '#fefefe',
    },
    ':hover': {
      borderColor: '#cbd5e0',
    },
    '::placeholder': {
      color: '#94a3b8',
    },
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: 12,
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    color: '#1e293b',
    cursor: 'pointer',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
    ':hover': {
      borderColor: '#cbd5e0',
    },
  },
  button: {
    padding: '14px 24px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 14px 0 rgba(6, 182, 212, 0.3)',
    letterSpacing: '0.025em',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px 0 rgba(6, 182, 212, 0.4)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  addButton: {
    padding: '12px 20px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px 0 rgba(16, 185, 129, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.4)',
    },
  },
  removeButton: {
    padding: '8px 16px',
    borderRadius: 8,
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    alignSelf: 'flex-start',
    marginLeft: 12,
    ':hover': {
      background: '#dc2626',
      color: '#ffffff',
      borderColor: '#dc2626',
    },
  },
  actions: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    marginTop: 40,
    flexWrap: 'wrap',
  },
  secondaryButton: {
    padding: '14px 24px',
    borderRadius: 12,
    background: '#f8fafc',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      background: '#f1f5f9',
      borderColor: '#cbd5e0',
      color: '#475569',
    },
  },
  previewWrap: {
    marginTop: 40,
    padding: '40px 0',
  },
  previewCard: {
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 8px 22px -6px rgba(15,23,42,0.08)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    padding: 0,
  },
  previewHeader: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '24px 32px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  previewTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  },
  previewIcon: {
    width: 20,
    height: 20,
    color: '#667eea',
  },
  previewBox: {
    padding: 32,
    background: '#ffffff',
    maxHeight: '700px',
    overflow: 'auto',
    lineHeight: 1.7,
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid #e2e8f0',
    borderRadius: '50%',
    borderTopColor: '#667eea',
    animation: 'spin 1s ease-in-out infinite',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
  // Modern Design System Styles
  sectionCard: {
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
    marginBottom: 28,
    overflow: 'visible',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
      transform: 'translateY(-2px)',
    },
  },
  sectionHeader: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '24px 32px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sectionBody: {
    padding: '24px 32px 32px 32px',
  },
  sectionIcon: {
    width: 24,
    height: 24,
    color: '#667eea',
  },
  entryCard: {
    background: '#f8fafc',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    border: '1px solid #e2e8f0',
    position: 'relative',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      background: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    marginBottom: 20,
  },
  twoColCompact: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    marginBottom: 20,
    alignItems: 'start',
  },
  smallGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: 8,
    color: '#475569',
    display: 'block',
    letterSpacing: '0.025em',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: 12,
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    color: '#1e293b',
    cursor: 'pointer',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
    ':hover': {
      borderColor: '#cbd5e0',
    },
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
    padding: '40px 32px',
    borderTop: '1px solid #e2e8f0',
    marginTop: 24,
  },
  buttonGroup: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '16px 32px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    color: '#ffffff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 14px 0 rgba(6, 182, 212, 0.3)',
    letterSpacing: '0.025em',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px 0 rgba(6, 182, 212, 0.4)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  successButton: {
    padding: '16px 32px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
    letterSpacing: '0.025em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px 0 rgba(16, 185, 129, 0.4)',
    },
  },
  clearIcon: {
    fontSize: '1.1rem',
  },
  downloadIcon: {
    fontSize: '1.1rem',
  },
  generateIcon: {
    fontSize: '1.1rem',
  },
  emptyPreview: {
    padding: '64px 32px',
    textAlign: 'center',
    color: '#64748b',
  },
  emptyIcon: {
    fontSize: '3.5rem',
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '1.05rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  previewContainer: {
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 8px 22px -6px rgba(15,23,42,0.08)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    marginTop: 32,
  },
  previewContent: {
    padding: 32,
    background: '#ffffff',
    maxHeight: '700px',
    overflow: 'auto',
    lineHeight: 1.7,
  },
  footer: {
    marginTop: 48,
    padding: '32px 24px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderTop: '2px solid #e2e8f0',
    borderRadius: '16px 16px 0 0',
  },
  footerText: {
    fontSize: '0.95rem',
    color: '#64748b',
    fontWeight: 500,
    margin: 0,
  },
  footerLink: {
    color: '#06b6d4',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'color 0.2s',
    ':hover': {
      color: '#3b82f6',
    },
  },
  aiSection: {
    padding: '32px 32px 40px 32px',
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
    marginBottom: 40,
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    color: '#1e293b',
    fontWeight: 700,
    fontSize: '1.25rem',
  },
  aiTextarea: {
    width: '100%',
    minHeight: 120,
    padding: 16,
    borderRadius: 12,
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    marginBottom: 20,
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
    },
  },
  aiButton: {
    width: '100%',
    padding: '16px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    color: '#ffffff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px 0 rgba(99, 102, 241, 0.4)',
    },
    ':disabled': {
      opacity: 0.7,
      cursor: 'wait',
      transform: 'none',
    },
  },
};

function makeHtml(form) {
  const esc = s => (typeof s === 'string' ? s : '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const bullets = (items) => {
    if (!Array.isArray(items) || items.length === 0) return '';
    return `<ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  };
  const para = (text) => typeof text === 'string' && text.trim() ? `<div style="margin:6px 0">${esc(text).replace(/\n/g, '<br/>')}</div>` : '';

  const contactLine = [form.email, form.phone, form.linkedin, form.github, form.website].filter(Boolean).map(esc).join(' | ');

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#111; max-width:800px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:6px;">
      <div style="font-size:36px; font-weight:900; letter-spacing:1px;">${esc(form.name)}</div>
      <div style="font-size:14px; margin-top:6px; font-weight:700; color:#2d3748">${esc(form.summaryTitle || '')}</div>
      <div style="font-size:12px; margin-top:8px; color:#333">${contactLine}</div>
      ${form.address ? `<div style="font-size:12px; margin-top:4px; color:#333">${esc(form.address)}</div>` : ''}
      ${form.dob || form.nationality ? `<div style="font-size:12px; margin-top:4px; color:#333">${[form.dob, form.nationality].filter(Boolean).map(esc).join(' | ')}</div>` : ''}
    </div>

    ${form.objective ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">OBJECTIVE</h3>${para(form.objective)}` : ''}

    ${form.summaryParagraph ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">PROFESSIONAL SUMMARY</h3>${para(form.summaryParagraph)}` : ''}

    ${form.experience.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">WORK EXPERIENCE</h3>${form.experience.map(exp => `${exp.position ? `<div style="font-weight:700;margin:8px 0 4px 0">${esc(exp.position)}</div>` : ''}${exp.company || exp.startDate || exp.endDate || exp.type ? `<div style="color:#666;font-size:12px;margin-bottom:6px">${[exp.type, exp.company, [exp.startDate, exp.endDate].filter(Boolean).join(' – ')].filter(Boolean).join(', ')}</div>` : ''}${exp.description ? para(exp.description) : ''}`).join('')}` : ''}

    ${form.education.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">EDUCATION</h3>${form.education.map(edu => `${edu.degree ? `<div style="font-weight:700;margin:8px 0 4px 0">${esc(edu.degree)}</div>` : ''}${edu.name || edu.year ? `<div style="color:#666;font-size:12px;margin-bottom:6px">${[edu.name, edu.year].filter(Boolean).join(' — ')}</div>` : ''}${edu.result ? `<div style="margin:4px 0">${esc(edu.result)}</div>` : ''}`).join('')}` : ''}

    ${form.skills.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">SKILLS</h3>${bullets(form.skills.filter(s => typeof s === 'string' && s.trim()))}` : ''}

    ${form.certifications.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">CERTIFICATIONS</h3>${bullets(form.certifications.filter(c => typeof c === 'string' && c.trim()))}` : ''}

    ${form.languages.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">LANGUAGES</h3>${bullets(form.languages.filter(l => typeof l === 'string' && l.trim()))}` : ''}

    ${form.projects.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">PROJECTS</h3>${form.projects.filter(p => p.name || p.description).map(p => `${p.name ? `<div style="font-weight:700;margin:8px 0 4px 0">${esc(p.name)}</div>` : ''}${p.description ? para(p.description) : ''}`).join('')}` : ''}

    ${form.achievements.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">ACHIEVEMENTS</h3>${form.achievements.filter(a => typeof a === 'string' && a.trim()).map(a => para(a)).join('')}` : ''}

    ${form.volunteer.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">VOLUNTEER EXPERIENCE</h3>${form.volunteer.filter(v => typeof v === 'string' && v.trim()).map(v => para(v)).join('')}` : ''}

    ${form.awards.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">AWARDS</h3>${bullets(form.awards.filter(a => typeof a === 'string' && a.trim()))}` : ''}

    ${form.publications.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">PUBLICATIONS</h3>${form.publications.filter(p => typeof p === 'string' && p.trim()).map(p => para(p)).join('')}` : ''}

    ${form.hobbies.length > 0 ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">HOBBIES / INTERESTS</h3>${bullets(form.hobbies.filter(h => typeof h === 'string' && h.trim()))}` : ''}

    ${form.references ? `<h3 style="margin-top:18px;border-bottom:1px solid #dfe6ee;padding-bottom:6px;font-size:13px;">REFERENCES</h3>${para(form.references)}` : ''}
  </div>
  `;
}

export default function App() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
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
    references: '',
  });
  const [cvHtml, setCvHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const previewRef = useRef(null);

  const handleGenerateFromPrompt = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
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
    setCvHtml(makeHtml(form));
    setLoading(false);
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

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerPattern}></div>
          <h1 style={styles.title}>CV Generator</h1>
          <p style={styles.subtitle}>Create professional CVs with modern design</p>
        </div>

        {/* Form Section */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* AI Auto-Fill Section */}
            <div style={styles.aiSection}>
              <div style={styles.aiHeader}>
                <span>✨ AI Auto-Fill</span>
              </div>
              <textarea
                style={styles.aiTextarea}
                placeholder="Paste your LinkedIn bio, resume summary, or just describe yourself here... (e.g., 'I am a Senior Developer with 5 years of experience in React and Node.js...')"
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

            {/* Personal Information */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>👤 Personal Information</div>
              </div>

              <div style={styles.sectionBody}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Full Name</label>
                  <input
                    name="name"
                    style={styles.input}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>

                <div style={styles.twoColCompact}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Email</label>
                    <input
                      name="email"
                      type="email"
                      style={styles.input}
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      style={styles.input}
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Address</label>
                  <input
                    name="address"
                    style={styles.input}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>

                <div style={styles.twoColCompact}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>LinkedIn</label>
                    <input
                      name="linkedin"
                      style={styles.input}
                      value={form.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>GitHub</label>
                    <input
                      name="github"
                      style={styles.input}
                      value={form.github}
                      onChange={handleChange}
                      placeholder="github.com/johndoe"
                    />
                  </div>
                </div>

                <div style={styles.twoColCompact}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Website</label>
                    <input
                      name="website"
                      style={styles.input}
                      value={form.website}
                      onChange={handleChange}
                      placeholder="johndoe.com"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Date of Birth</label>
                    <input
                      name="dob"
                      type="date"
                      style={styles.dateInput}
                      value={form.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Nationality</label>
                  <input
                    name="nationality"
                    style={styles.input}
                    value={form.nationality}
                    onChange={handleChange}
                    placeholder="American"
                  />
                </div>
              </div>
            </div>


            {/* Professional Summary */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Professional Summary</div>
                <div style={styles.sectionIcon}>📝</div>
              </div>
              <div style={styles.sectionBody}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Professional Summary Title</label>
                  <input
                    name="summaryTitle"
                    style={styles.input}
                    value={form.summaryTitle}
                    onChange={handleChange}
                    placeholder="e.g., Digital Marketing | SEO | SEM"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Professional Summary</label>
                  <textarea
                    name="summaryParagraph"
                    style={styles.textarea}
                    value={form.summaryParagraph}
                    onChange={handleChange}
                    placeholder="Write a compelling summary of your professional background and key strengths..."
                  />
                </div>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Career Objective</div>
                <div style={styles.sectionIcon}>🎯</div>
              </div>
              <div style={styles.sectionBody}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Career Objective</label>
                  <textarea
                    name="objective"
                    style={styles.textarea}
                    value={form.objective}
                    onChange={handleChange}
                    placeholder="Describe your career goals and what you hope to achieve..."
                  />
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
                      <button type="button" onClick={() => removeItem('experience', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.formGrid}>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Position</label>
                        <input placeholder="e.g. Software Engineer" value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Company</label>
                        <input placeholder="e.g. Tech Corp" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Employment Type</label>
                        <select value={exp.type} onChange={(e) => handleArrayChange('experience', index, 'type', e.target.value)} style={styles.select}>
                          <option value="">Select Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Contract">Contract</option>
                          <option value="Volunteer">Volunteer</option>
                        </select>
                      </div>
                    </div>
                    <div style={styles.smallGrid}>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Start Date</label>
                        <input placeholder="e.g. Jan 2020" value={exp.startDate} onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)} style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>End Date</label>
                        <input placeholder="e.g. Present" value={exp.endDate} onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)} style={styles.input} />
                      </div>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Description</label>
                      <textarea placeholder="Describe your responsibilities, achievements, and key contributions..." value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} style={styles.textarea} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '', type: '' })} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Experience
                </button>
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
                      <button type="button" onClick={() => removeItem('education', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.formGrid}>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Degree</label>
                        <input placeholder="e.g. Bachelor of Science" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Institution</label>
                        <input placeholder="e.g. University of Technology" value={edu.name} onChange={(e) => handleArrayChange('education', index, 'name', e.target.value)} style={styles.input} />
                      </div>
                    </div>
                    <div style={styles.formGrid}>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Year</label>
                        <input placeholder="e.g. 2020" value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Result/GPA</label>
                        <input placeholder="e.g. 3.8/4.0" value={edu.result} onChange={(e) => handleArrayChange('education', index, 'result', e.target.value)} style={styles.input} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('education', { name: '', degree: '', year: '', result: '' })} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Education
                </button>
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
                      <button type="button" onClick={() => removeItem('skills', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Skill</label>
                      <input placeholder="e.g. JavaScript, React, Node.js" value={skill} onChange={(e) => handleArrayChange('skills', index, null, e.target.value)} style={styles.input} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('skills', '')} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Skill
                </button>
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
                      <button type="button" onClick={() => removeItem('certifications', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Certification</label>
                      <input placeholder="e.g. AWS Certified Developer" value={cert} onChange={(e) => handleArrayChange('certifications', index, null, e.target.value)} style={styles.input} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('certifications', '')} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Certification
                </button>
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
                      <button type="button" onClick={() => removeItem('languages', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Language</label>
                      <input placeholder="e.g. English (Native), Spanish (Intermediate)" value={lang} onChange={(e) => handleArrayChange('languages', index, null, e.target.value)} style={styles.input} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('languages', '')} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Language
                </button>
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
                      <button type="button" onClick={() => removeItem('projects', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Project Name</label>
                      <input placeholder="e.g. E-commerce Website" value={proj.name} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Description</label>
                      <textarea placeholder="Describe the project, technologies used, and your role..." value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} style={styles.textarea} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('projects', { name: '', description: '' })} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Project
                </button>
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
                      <button type="button" onClick={() => removeItem('achievements', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Achievement</label>
                      <textarea placeholder="Describe your achievement, award, or recognition..." value={ach} onChange={(e) => handleArrayChange('achievements', index, null, e.target.value)} style={styles.textarea} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('achievements', '')} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Achievement
                </button>
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
                      <button type="button" onClick={() => removeItem('volunteer', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Volunteer Experience</label>
                      <textarea placeholder="Describe your volunteer work, organization, and impact..." value={vol} onChange={(e) => handleArrayChange('volunteer', index, null, e.target.value)} style={styles.textarea} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('volunteer', '')} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Volunteer Experience
                </button>
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
                      <button type="button" onClick={() => removeItem('awards', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Award</label>
                      <input placeholder="e.g. Employee of the Month, Best Project Award" value={award} onChange={(e) => handleArrayChange('awards', index, null, e.target.value)} style={styles.input} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('awards', '')} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Award
                </button>
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
                      <button type="button" onClick={() => removeItem('publications', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Publication</label>
                      <textarea placeholder="Describe your publication, article, or research..." value={pub} onChange={(e) => handleArrayChange('publications', index, null, e.target.value)} style={styles.textarea} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('publications', '')} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Publication
                </button>
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
                      <button type="button" onClick={() => removeItem('hobbies', index)} style={styles.removeButton}>
                        <span style={styles.removeIcon}>×</span>
                      </button>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Hobby / Interest</label>
                      <input placeholder="e.g. Reading, Photography, Hiking" value={hobby} onChange={(e) => handleArrayChange('hobbies', index, null, e.target.value)} style={styles.input} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('hobbies', '')} style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Hobby
                </button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>References</div>
                <div style={styles.sectionIcon}>📞</div>
              </div>
              <div style={styles.sectionBody}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>References</label>
                  <textarea name="references" style={styles.textarea} value={form.references} onChange={handleChange} placeholder="Available upon request or list your references here..." />
                </div>
              </div>
            </div>

            <div style={styles.actionSection}>
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.primaryButton} disabled={loading}>
                  {loading ? (
                    <>
                      <span style={styles.loadingSpinner}>⟳</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span style={styles.generateIcon}>⚡</span>
                      Generate CV
                    </>
                  )}
                </button>
                <button type="button" onClick={() => { setCvHtml(''); }} style={styles.secondaryButton}>
                  <span style={styles.clearIcon}>🗑️</span>
                  Clear
                </button>
                {cvHtml && (
                  <button type="button" onClick={handlePrint} style={styles.successButton}>
                    <span style={styles.downloadIcon}>📄</span>
                    Save / Print PDF
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div style={styles.previewContainer}>
          <div style={styles.previewHeader}>
            <div style={styles.previewTitle}>CV Preview</div>
            <div style={styles.previewIcon}>👁️</div>
          </div>
          {cvHtml ? (
            <div ref={previewRef} style={styles.previewContent} dangerouslySetInnerHTML={{ __html: cvHtml }} />
          ) : (
            <div style={styles.emptyPreview}>
              <div style={styles.emptyIcon}>📋</div>
              <div style={styles.emptyText}>Generated CV preview will appear here after you click Generate CV.</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          © 2025 Mahmudul Hasan Sheepu. | All Rights Reserved
        </p>
      </div>
    </div>
  );
}

