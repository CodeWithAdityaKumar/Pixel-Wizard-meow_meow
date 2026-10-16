'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';

export default function LoginPage() {
  const router = useRouter();
  return <main className="login-page login-choice-page"><section className="login-art"><div className="login-brand"><div className="brand-stamp">H</div><strong>Hostel<span>Hub</span></strong></div><span className="eyebrow">Hostel management</span><h1>Start with your view.</h1><p>Choose how you want to enter HostelHub.</p><div className="login-lines"><span /><span /><span /></div></section><section className="login-card-wrap"><div className="login-card"><span className="section-kicker">Sign in</span><h2>Choose a login.</h2><p className="login-lead">Use the view you need today.</p><div className="login-choice-list"><button onClick={() => router.push('/login/student')}><span><strong>Student</strong><small>Room, complaints, meals, notices</small></span><Icon name="arrow" size={16} /></button><button onClick={() => router.push('/login/admin')}><span><strong>Admin</strong><small>Rooms, complaints, meals, notices</small></span><Icon name="arrow" size={16} /></button></div></div></section></main>;
}
