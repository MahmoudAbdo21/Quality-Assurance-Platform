'use client';

import { loginAction } from '../../actions/admin';
import { useState, FormEvent } from 'react';

export default function AdminLogin() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            const res = await loginAction(formData);
            if (res?.error) {
                setError(res.error);
            }
        } catch (err) {
            // Next.js redirect throws an error which we should ignore
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="interactive-card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', marginBottom: '20px' }}>تسجيل دخول الإدارة</h2>
                
                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                        <label>اسم المستخدم</label>
                        <input type="text" name="username" required placeholder="اسم المستخدم" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    </div>
                    <div className="form-group">
                        <label>كلمة المرور</label>
                        <input type="password" name="password" required placeholder="كلمة المرور" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    </div>
                    <button type="submit" className="action-btn" disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? 'جاري التحقق...' : 'دخول'}
                    </button>
                </form>
            </div>
        </div>
    );
}
