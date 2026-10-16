'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSeedState, HostelSession, Role, storageKeys } from '@/lib/hostel-data';
import { Icon } from '@/components/ui/icon';

export default function LoginPanel({ role }: { role: Role }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState('student-aanya');
  const [email, setEmail] = useState('admin@hostelhub.local');
  const [password, setPassword] = useState('hostel123');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const seed = getSeedState();
    const student = seed.students.find((candidate) => candidate.id === studentId.trim());
    if (role === 'student' && !student) {
      setError('Use a valid student ID, such as student-aanya.');
      return;
    }
    if (!password.trim()) {
      setError('Enter your password.');
      return;
    }
    const session: HostelSession = role === 'student'
      ? { role, studentId: student?.id, displayName: student?.name ?? 'Student' }
      : { role, displayName: email.trim() || 'Admin' };
    window.localStorage.setItem(storageKeys.session, JSON.stringify(session));
    router.push('/');
  }

  return <main className="login-page"><section className="login-art"><div className="login-brand"><div className="brand-stamp">H</div><strong>Hostel<span>Hub</span></strong></div><span className="eyebrow">Hostel management</span><h1>{role === 'student' ? 'Your hostel, in one place.' : 'Keep the hostel running.'}</h1><p>{role === 'student' ? 'Check your room, complaints, meals, and notices.' : 'Manage rooms, complaints, meals, and notices.'}</p><div className="login-lines"><span /><span /><span /></div></section><section className="login-card-wrap"><div className="login-card"><div className="login-card-top"><span className="section-kicker">{role === 'student' ? 'Student login' : 'Admin login'}</span><button className="login-back" onClick={() => router.push('/login')}>Change <Icon name="arrow" size={13} /></button></div><h2>Welcome back.</h2><p className="login-lead">Enter your details to continue.</p><form className="login-form" onSubmit={submit}>{role === 'student' ? <label>Student ID<input value={studentId} onChange={(event) => setStudentId(event.target.value)} placeholder="student-aanya" autoComplete="username" /></label> : <label>Admin email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@hostelhub.local" autoComplete="username" /> </label>}<label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" autoComplete="current-password" /></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="button button-ink login-submit" type="submit">Continue <Icon name="arrow" size={15} /></button></form><p className="login-note">Frontend sign-in for HostelHub.</p></div></section></main>;
}
