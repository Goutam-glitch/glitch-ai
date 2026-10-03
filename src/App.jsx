import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowDown, ArrowLeft, ArrowUp, Atom, AudioLines, Bolt, Check, ChevronDown, CircleHelp, Clock3, Command, Copy, Cpu, Download, Globe2, Layers3, Menu, Mic, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Plus, Radio, Search, Send, Settings2, Shield, Sparkles, SquarePen, ThumbsDown, ThumbsUp, WandSparkles, X, Zap } from 'lucide-react';

const starters = [
  { icon: Atom, title: 'Explain something', text: 'Break down a complex topic in a simple way' },
  { icon: WandSparkles, title: 'Make something', text: 'Help me write, create, or brainstorm' },
  { icon: Layers3, title: 'Get a plan', text: 'Turn a big goal into small steps' },
  { icon: Bolt, title: 'Solve a problem', text: 'Work through a challenge with me' },
];
const initialChats = ['Untitled conversation'];

function Brand({ small = false }) { return <div className={`brand ${small ? 'brand-small' : ''}`}><div className="brand-mark"><span>G</span><i /></div><span className="brand-name">glitch<span>ai</span></span></div>; }
function Avatar({ mini = false }) { return <div className={`avatar ${mini ? 'avatar-mini' : ''}`}><span>G</span><i /></div>; }

function RichText({ text }) {
  const safeText = typeof text === 'string' ? text : 'Glitch could not read the response. Please try again.';
  const lines = safeText.split('\n');
  return <>{lines.map((line, i) => <p key={i}>{line.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, j) => part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part.startsWith('`') ? <code key={j}>{part.slice(1, -1)}</code> : part)}</p>)}</>;
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [mode, setMode] = useState('Glitch 1.0');
  const [modelMenu, setModelMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(-1);
  const [activeChat, setActiveChat] = useState(0);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 2400); return () => clearTimeout(timer); } }, [toast]);

  const send = async (raw = value) => {
    const content = raw.trim();
    if (!content || loading) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next); setValue(''); setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) });
      const data = await response.json().catch(() => null);
      const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
      const errorMessage = typeof data?.error === 'string' ? data.error : '';
      if (response.ok && reply) setMessages([...next, { role: 'assistant', content: reply }]);
      else setMessages([...next, { role: 'assistant', content: errorMessage || 'The hosted AI returned an empty response. Please try again.', error: true }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Could not reach the hosted AI service. Check your internet connection and try again.', error: true }]);
    } finally { setLoading(false); }
  };
  const newChat = () => { setMessages([]); setMobileSidebar(false); setActiveChat(0); };
  const copyMessage = async (text, index) => { await navigator.clipboard?.writeText(text); setCopied(index); setToast('Copied to clipboard'); setTimeout(() => setCopied(-1), 1400); };
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
    {mobileSidebar && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileSidebar(false)} />}
    <aside className={`sidebar ${mobileSidebar ? 'mobile-open' : ''}`}>
      <div className="sidebar-top"><Brand /><button className="icon-button sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">{sidebarOpen ? <PanelLeftClose size={18}/> : <PanelLeftOpen size={18}/>}</button></div>
      <button className="new-chat" onClick={newChat}><SquarePen size={17}/><span>New chat</span><kbd>⌘ K</kbd></button>
      <button className="search-btn" onClick={() => setToast('Search is coming soon')}><Search size={16}/><span>Search chats</span><kbd>⌘ /</kbd></button>
      <div className="side-label">WORKSPACE</div>
      <button className="nav-item active"><div className="nav-glyph"><AudioLines size={16}/></div><span>AI Assistant</span><span className="live-dot"/></button>
      <button className="nav-item" onClick={() => setToast('Explore is coming soon')}><div className="nav-glyph"><Layers3 size={16}/></div><span>Explore</span></button>
      <div className="history-head"><span className="side-label">RECENT</span><button className="icon-button tiny" onClick={newChat} aria-label="Add conversation"><Plus size={15}/></button></div>
      <div className="history-list">{initialChats.map((chat, i) => <button key={chat} className={`history-item ${activeChat === i ? 'selected' : ''}`} onClick={() => {setActiveChat(i); setMessages([]);}}><Clock3 size={14}/><span>{chat}</span><MoreHorizontal size={15} className="history-more"/></button>)}</div>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-glow"/><div className="upgrade-icon"><Zap size={14}/></div><strong>Your ideas, accelerated.</strong><p>Unlock more power with Glitch Pro.</p><button onClick={() => setToast('Glitch Pro is coming soon')}>Explore plans <ArrowDown size={13}/></button></div><button className="profile-row" onClick={() => setToast('Profile settings are coming soon')}><div className="user-avatar">S</div><span className="profile-name">Saigo</span><span className="profile-tier">Free</span><MoreHorizontal size={17}/></button></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileSidebar(true)} aria-label="Open menu"><Menu size={19}/></button><button className="model-switch" onClick={() => setModelMenu(!modelMenu)}><span className="model-sigil"><Sparkles size={13}/></span><span>{mode}</span><span className="model-pro">BETA</span><ChevronDown size={15} className="muted-icon"/></button>{modelMenu && <div className="model-dropdown"><button onClick={() => {setMode('Glitch 1.0');setModelMenu(false)}}><Sparkles size={15}/><span><strong>Glitch 1.0</strong><small>Balanced for everything</small></span>{mode === 'Glitch 1.0' && <Check size={15}/>}</button><button onClick={() => {setMode('Glitch Reason');setModelMenu(false);setToast('Reasoning mode is coming soon')}}><Cpu size={15}/><span><strong>Glitch Reason</strong><small>Deeper thinking mode</small></span></button></div>}</div><div className="topbar-right"><div className="status-pill"><span className="status-pulse"/> All systems normal</div><button className="icon-button top-help" onClick={() => setToast('Ask me anything — I’m always here.')} aria-label="Help"><CircleHelp size={17}/></button><button className="share-button" onClick={() => setToast('Start a conversation to share it')}>Share</button><button className="icon-button top-more" onClick={() => setToast('More options are coming soon')} aria-label="More options"><MoreHorizontal size={19}/></button></div></header>

      <div className={`conversation ${messages.length ? 'has-messages' : ''}`}>
        {messages.length === 0 ? <section className="welcome">
          <div className="welcome-orbit orbit-one"/><div className="welcome-orbit orbit-two"/>
          <div className="welcome-emblem"><Avatar/><div className="emblem-ring"/><div className="emblem-ring inner"/><span className="emblem-spark spark-a">✳</span><span className="emblem-spark spark-b">✦</span></div>
          <div className="eyebrow"><span/> YOUR THINKING PARTNER</div><h1>Good to have you here<span>.</span></h1><p className="welcome-subtitle">I’m Glitch. Your ideas, questions, and half-formed thoughts<br className="desktop-break"/> are all welcome here.</p>
          <div className="starter-grid">{starters.map(({icon:Icon,title,text})=><button className="starter-card" key={title} onClick={()=>send(text)}><span className="starter-icon"><Icon size={16}/></span><span className="starter-copy"><strong>{title}</strong><small>{text}</small></span><ArrowUp size={14} className="starter-arrow"/></button>)}</div>
          <div className="welcome-foot"><span><Shield size={13}/> Your chats stay private</span><i/><span><Bolt size={12}/> Built for curious minds</span></div>
        </section> : <section className="message-list">{messages.map((msg, i) => <div className={`message-row ${msg.role}`} key={`${i}-${msg.content.slice(0,10)}`}>{msg.role === 'assistant' ? <Avatar mini/> : <div className="user-avatar message-avatar">S</div>}<div className="message-content"><div className="message-name">{msg.role === 'assistant' ? 'Glitch' : 'You'}{msg.demo && <span className="demo-tag">DEMO</span>}</div><div className={`message-text ${msg.error ? 'error-text' : ''}`}><RichText text={msg.content}/></div>{msg.role === 'assistant' && <div className="message-actions"><button onClick={()=>copyMessage(msg.content,i)} aria-label="Copy response">{copied===i?<Check size={14}/>:<Copy size={14}/>}</button><button onClick={()=>setToast('Thanks for the feedback')} aria-label="Good response"><ThumbsUp size={14}/></button><button onClick={()=>setToast('Feedback noted')} aria-label="Bad response"><ThumbsDown size={14}/></button></div>}</div></div>)}{loading&&<div className="message-row assistant"><Avatar mini/><div className="message-content"><div className="message-name">Glitch</div><div className="typing-indicator"><span/><span/><span/></div></div></div>}<div ref={bottomRef}/></section>}
      </div>

      <footer className="composer-wrap"><div className="composer"><textarea ref={textareaRef} value={value} onChange={e=>{setValue(e.target.value);e.target.style.height='auto';e.target.style.height=`${Math.min(e.target.scrollHeight,160)}px`;}} onKeyDown={handleKeyDown} placeholder="Ask me anything..." rows={1} aria-label="Message Glitch AI"/><div className="composer-toolbar"><div className="composer-tools"><button className="tool-button add-tool" onClick={()=>setToast('Attachments are coming soon')} aria-label="Attach"><Plus size={17}/></button><span className="composer-divider"/><button className="tool-button mode-tool" onClick={()=>setToast('Web search is coming soon')}><Globe2 size={14}/><span>Web search</span><span className="off-label">OFF</span></button></div><div className="composer-right"><button className="tool-button voice-tool" onClick={()=>setToast('Voice input is coming soon')} aria-label="Voice input"><Mic size={16}/></button><button className={`send-button ${value.trim() ? 'ready' : ''}`} disabled={!value.trim()||loading} onClick={()=>send()} aria-label="Send message"><ArrowUp size={17}/></button></div></div></div><div className="composer-caption">Glitch can make mistakes. <button onClick={()=>setToast('Check important information with trusted sources.')}>Keep that in mind.</button></div></footer>
      <div className="ambient-status"><span><Radio size={12}/> SECURE CONNECTION</span><i/><span>GLITCH AI <b>v1.0.4</b></span></div>
    </main>
    {toast && <div className="toast"><Check size={15}/>{toast}</div>}
  </div>;
}

