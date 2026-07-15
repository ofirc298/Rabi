"use client";

import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ contact: [], volunteer: [] });
  const [activeTab, setActiveTab] = useState('volunteer'); // 'volunteer' or 'contact'
  const [search, setSearch] = useState('');

  // Load token from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    if (saved) {
      setToken(saved);
      fetchData(saved);
    }
  }, []);

  async function fetchData(pwd) {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: { 'Authorization': `Bearer ${pwd}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setToken(pwd);
        sessionStorage.setItem('admin_token', pwd);
        setError('');
      } else if (res.status === 401) {
        setError('סיסמה שגויה. גישה נדחתה.');
        setToken(null);
        sessionStorage.removeItem('admin_token');
      } else {
        setError('שגיאת שרת בקריאת הנתונים.');
      }
    } catch (err) {
      setError('שגיאת תקשורת עם השרת.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!password.trim()) {
      setError('אנא הזן סיסמה');
      return;
    }
    fetchData(password);
  }

  function handleLogout() {
    setToken(null);
    setPassword('');
    setData({ contact: [], volunteer: [] });
    sessionStorage.removeItem('admin_token');
  }

  async function handleDelete(type, id) {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק פנייה זו?')) return;
    try {
      const res = await fetch(`/api/admin/submissions?type=${type}&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        // Refresh data
        fetchData(token);
      } else {
        alert('מחיקה נכשלה.');
      }
    } catch (err) {
      alert('שגיאת תקשורת במחיקה.');
    }
  }

  // Export table data to CSV with Excel Hebrew compatibility (BOM)
  function exportCSV() {
    const isVol = activeTab === 'volunteer';
    const rows = isVol ? data.volunteer : data.contact;
    const filtered = rows.filter(item => {
      const q = search.toLowerCase();
      if (isVol) {
        return (
          item.firstName?.toLowerCase().includes(q) ||
          item.lastName?.toLowerCase().includes(q) ||
          item.phone?.includes(q) ||
          item.source?.toLowerCase().includes(q)
        );
      } else {
        return (
          item.name?.toLowerCase().includes(q) ||
          item.phone?.includes(q) ||
          item.message?.toLowerCase().includes(q)
        );
      }
    });

    let csvContent = '\uFEFF'; // Add UTF-8 BOM for Hebrew compatibility in Excel
    if (isVol) {
      csvContent += 'שם פרטי,שם משפחה,טלפון,איך הגיע אלינו,תאריך הרשמה\n';
      filtered.forEach(item => {
        csvContent += `"${item.firstName || ''}","${item.lastName || ''}","${item.phone || ''}","${item.source || ''}","${new Date(item.createdAt).toLocaleString('he-IL')}"\n`;
      });
    } else {
      csvContent += 'שם מלא,טלפון,הודעה,תאריך פנייה\n';
      filtered.forEach(item => {
        csvContent += `"${item.name || ''}","${item.phone || ''}","${(item.message || '').replace(/"/g, '""')}","${new Date(item.createdAt).toLocaleString('he-IL')}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${isVol ? 'volunteers' : 'contacts'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Login view
  if (!token) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, oklch(0.26 0.04 250), oklch(0.20 0.02 250))',
        fontFamily: 'Heebo, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <img src="/assets/logo.png" alt="אהל ישעיה" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid oklch(0.65 0.09 75)', padding: '6px', marginBottom: '20px' }} />
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>אהל ישעיה</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '32px' }}>כניסה למערכת ניהול פניות מתנדבים וצור קשר</p>

          <form onSubmit={handleLogin}>
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <label htmlFor="admin-pass" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '500', marginBottom: '8px', letterSpacing: '0.05em' }}>סיסמת מנהל</label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הזן סיסמה..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  textAlign: 'left'
                }}
              />
            </div>
            {error && <div style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '20px', textAlign: 'right' }}>⚠️ {error}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                background: 'oklch(0.65 0.09 75)',
                color: 'oklch(0.26 0.04 250)',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'מתחבר...' : 'כניסה למערכת'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard view
  const isVol = activeTab === 'volunteer';
  const rawRows = isVol ? data.volunteer : data.contact;
  const filteredRows = rawRows.filter(item => {
    const q = search.toLowerCase();
    if (isVol) {
      return (
        item.firstName?.toLowerCase().includes(q) ||
        item.lastName?.toLowerCase().includes(q) ||
        item.phone?.includes(q) ||
        item.source?.toLowerCase().includes(q)
      );
    } else {
      return (
        item.name?.toLowerCase().includes(q) ||
        item.phone?.includes(q) ||
        item.message?.toLowerCase().includes(q)
      );
    }
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'oklch(0.98 0.005 75)',
      fontFamily: 'Heebo, sans-serif',
      color: 'oklch(0.20 0.02 250)',
      direction: 'rtl'
    }}>
      {/* Header */}
      <header style={{
        background: 'oklch(0.26 0.04 250)',
        color: '#fff',
        padding: '18px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '4px solid oklch(0.65 0.09 75)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/assets/logo.png" alt="אהל ישעיה" style={{ width: '42px', height: '42px', borderRadius: '50%' }} />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>אהל ישעיה</h1>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>פאנל ניהול פניות</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          יציאה ומנעול 🔐
        </button>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid oklch(0.90 0.01 250)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', color: 'oklch(0.36 0.015 250)', fontWeight: '600', marginBottom: '8px' }}>הרשמות מתנדבים (סה״כ)</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'oklch(0.26 0.04 250)' }}>{data.volunteer?.length || 0}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid oklch(0.90 0.01 250)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', color: 'oklch(0.36 0.015 250)', fontWeight: '600', marginBottom: '8px' }}>פניות קשר חדשות</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'oklch(0.26 0.04 250)' }}>{data.contact?.length || 0}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid oklch(0.90 0.01 250)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', color: 'oklch(0.36 0.015 250)', fontWeight: '600', marginBottom: '8px' }}>סה״כ פניות במערכת</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'oklch(0.65 0.09 75)' }}>{(data.volunteer?.length || 0) + (data.contact?.length || 0)}</div>
          </div>
        </div>

        {/* Dashboard Box */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid oklch(0.90 0.01 250)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}>
          {/* Controls Bar */}
          <div style={{
            background: 'oklch(0.97 0.005 250)',
            padding: '16px 24px',
            borderBottom: '1px solid oklch(0.90 0.01 250)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => { setActiveTab('volunteer'); setSearch(''); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  background: activeTab === 'volunteer' ? '#fff' : 'transparent',
                  color: activeTab === 'volunteer' ? 'oklch(0.26 0.04 250)' : 'oklch(0.36 0.015 250)',
                  boxShadow: activeTab === 'volunteer' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                🙋‍♂️ הרשמות להתנדבות ({data.volunteer?.length || 0})
              </button>
              <button
                onClick={() => { setActiveTab('contact'); setSearch(''); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  background: activeTab === 'contact' ? '#fff' : 'transparent',
                  color: activeTab === 'contact' ? 'oklch(0.26 0.04 250)' : 'oklch(0.36 0.015 250)',
                  boxShadow: activeTab === 'contact' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                ✉️ פניות קשר ({data.contact?.length || 0})
              </button>
            </div>

            {/* Actions (Search & Export) */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש מהיר..."
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid oklch(0.85 0.01 250)',
                  fontSize: '14px',
                  outline: 'none',
                  minWidth: '200px'
                }}
              />
              <button
                onClick={exportCSV}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'oklch(0.65 0.09 75)',
                  color: 'oklch(0.26 0.04 250)',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📥 ייצוא ל-Excel (CSV)
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto', minHeight: '300px' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', fontSize: '15px' }}>
                טוען פניות מהמערכת...
              </div>
            ) : filteredRows.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'oklch(0.36 0.015 250)' }}>
                <span style={{ fontSize: '40px', marginBottom: '12px' }}>📂</span>
                <span style={{ fontSize: '15px', fontWeight: '500' }}>{search ? 'לא נמצאו תוצאות לחיפוש שלך' : 'אין פניות רשומות עדיין'}</span>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'oklch(0.97 0.005 250)', borderBottom: '1.5px solid oklch(0.90 0.01 250)', color: 'oklch(0.36 0.015 250)' }}>
                    {isVol ? (
                      <>
                        <th style={{ padding: '16px 24px', fontWeight: '600' }}>שם מתנדב</th>
                        <th style={{ padding: '16px 24px', fontWeight: '600' }}>טלפון</th>
                        <th style={{ padding: '16px 24px', fontWeight: '600' }}>איך הגיע אלינו</th>
                        <th style={{ padding: '16px 24px', fontWeight: '600' }}>תאריך הרשמה</th>
                      </>
                    ) : (
                      <>
                        <th style={{ padding: '16px 24px', fontWeight: '600' }}>שם פונה</th>
                        <th style={{ padding: '16px 24px', fontWeight: '600' }}>טלפון</th>
                        <th style={{ padding: '16px 24px', fontWeight: '600' }}>תוכן הפנייה</th>
                        <th style={{ padding: '16px 24px', fontWeight: '600' }}>תאריך פנייה</th>
                      </>
                    )}
                    <th style={{ padding: '16px 24px', fontWeight: '600', width: '80px', textAlign: 'center' }}>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((item, idx) => (
                    <tr key={item.id} style={{
                      borderBottom: '1px solid oklch(0.92 0.005 250)',
                      background: idx % 2 === 0 ? '#fff' : 'oklch(0.99 0.002 250)',
                      transition: 'background 0.15s'
                    }}>
                      {isVol ? (
                        <>
                          <td style={{ padding: '16px 24px', fontWeight: '600' }}>{item.firstName} {item.lastName}</td>
                          <td style={{ padding: '16px 24px' }}>
                            <a href={`tel:${item.phone}`} style={{ color: 'oklch(0.34 0.04 250)', textDecoration: 'none' }}>{item.phone}</a>
                          </td>
                          <td style={{ padding: '16px 24px', color: 'oklch(0.36 0.015 250)' }}>{item.source}</td>
                          <td style={{ padding: '16px 24px', fontSize: '13px', color: 'oklch(0.36 0.015 250)' }}>{new Date(item.createdAt).toLocaleString('he-IL')}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '16px 24px', fontWeight: '600' }}>{item.name}</td>
                          <td style={{ padding: '16px 24px' }}>
                            <a href={`tel:${item.phone}`} style={{ color: 'oklch(0.34 0.04 250)', textDecoration: 'none' }}>{item.phone}</a>
                          </td>
                          <td style={{ padding: '16px 24px', maxWidth: '400px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{item.message}</td>
                          <td style={{ padding: '16px 24px', fontSize: '13px', color: 'oklch(0.36 0.015 250)' }}>{new Date(item.createdAt).toLocaleString('he-IL')}</td>
                        </>
                      )}
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(activeTab, item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
                          }}
                          title="מחיקת פנייה"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
