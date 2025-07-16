import { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css'
import { format } from 'date-fns';

function SplashScreen() {
  return (
    <div className="splash-container">
      <img src="/Eventmories-logo.svg" alt="Eventmories Logo" className="splash-logo" />
      <h1 className="splash-title">Eventmories</h1>
    </div>
  );
}

function EyeIcon({ visible }) {
  return visible ? (
    // Eye-off SVG
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 0 1 2.06-3.28M6.1 6.1A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 0 1-2.06 3.28M1 1l22 22" /><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-5.97" /></svg>
  ) : (
    // Eye SVG
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3.5" /></svg>
  );
}

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setError('Check your email for a confirmation link!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMsg('');
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) setError(error.message);
    else setResetMsg('Password reset email sent! Check your inbox.');
    setLoading(false);
  };

  if (showForgot) {
  return (
      <div className="auth-container">
        <div className="auth-box">
          <img src="/Eventmories-logo.svg" alt="Eventmories Logo" className="auth-logo" />
          <h2>Reset your password</h2>
          <form className="auth-form" onSubmit={handleReset}>
            <input type="email" placeholder="Email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
          </form>
          {resetMsg && <div style={{ color: '#388e3c', marginTop: 8, fontSize: '0.98rem' }}>{resetMsg}</div>}
          {error && <div style={{ color: '#d32f2f', marginTop: 8, fontSize: '0.98rem' }}>{error}</div>}
          <div className="auth-footer">
            <a href="#" onClick={e => { e.preventDefault(); setShowForgot(false); }}>Back to sign in</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src="/Eventmories-logo.svg" alt="Eventmories Logo" className="auth-logo" />
        <h2>{isSignUp ? 'Create your account.' : 'Welcome Back!'}</h2>
        <form className="auth-form" onSubmit={handleAuth}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="password-input"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(v => !v)}
              className="eye-toggle-btn"
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          <button type="submit" disabled={loading}>{loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Continue')}</button>
        </form>
        {!isSignUp && (
          <div style={{ width: '100%', textAlign: 'right', marginTop: 4 }}>
            <a href="#" style={{ fontSize: '0.95rem', color: '#FBD157' }} onClick={e => { e.preventDefault(); setShowForgot(true); }}>Forgot password?</a>
          </div>
        )}
        <div className="auth-divider">or</div>
        <button className="google-btn" onClick={handleGoogle} disabled={loading}>Continue with Google</button>
        {error && <div style={{ color: '#d32f2f', marginTop: 8, fontSize: '0.98rem' }}>{error}</div>}
        <div className="auth-footer">
          {isSignUp ? (
            <>
              <span>Already have an account?</span> <a href="#" onClick={e => { e.preventDefault(); setIsSignUp(false); }}>Sign in</a>
            </>
          ) : (
            <>
              <span>Don't have an account?</span> <a href="#" onClick={e => { e.preventDefault(); setIsSignUp(true); }}>Sign up</a>
            </>
          )}
      </div>
      </div>
    </div>
  );
}

function SidebarMenuPopup({ open, onClose, onThemeChange, theme, onLogout }) {
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        left: window.innerWidth < 700 ? 'auto' : 80,
        right: window.innerWidth < 700 ? 30 : 'auto',
        bottom: window.innerWidth < 700 ? 'auto' : 70,
        zIndex: 2000,
        marginTop: 5,
      }}
    >
      <div ref={ref} style={{ minWidth: 220, background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', padding: 0, overflow: 'hidden', border: '1px solid #eee' }}>
        <div style={{ padding: '18px 20px 10px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: 16, color:'#000' }}>Appearance</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 18px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <button
            style={{ flex: 1, background: theme === 'light' ? '#FBD157' : '#f8f8f8', color: '#222', border: 'none', borderRadius: 10, padding: '10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer', outline:'none' }}
            onClick={() => onThemeChange('light')}
          >
            <img src="/light.svg" alt="Light" style={{ width: 20, height: 20, verticalAlign: 'middle' }} />
        </button>
          <button
            style={{ flex: 1, background: theme === 'dark' ? '#FBD157' : '#f8f8f8', color: '#222', border: 'none', borderRadius: 10, padding: '10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer', outline:'none' }}
            onClick={() => onThemeChange('dark')}
          >
            <img src="/dark.svg" alt="Dark" style={{ width: 20, height: 20, verticalAlign: 'middle' }} />
          </button>
          <button
            style={{ flex: 1, background: theme === 'auto' ? '#FBD157' : '#f8f8f8', color: '#222', border: 'none', borderRadius: 10, padding: '10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer', outline:'none' }}
            onClick={() => onThemeChange('auto')}
          >
            <span role="img" aria-label="Auto">Auto</span>
          </button>
      </div>
        <button
          style={{ width: '100%', background: 'none', border: 'none', color: '#d32f2f', fontWeight: 700, fontSize: 16, padding: '18px 0', cursor: 'pointer' }}
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

// UserAvatar: displays avatar, initials, or Google avatar
function UserAvatar({ src, name, size = 38, style = {} }) {
  if (src) {
    return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', background: '#FBD157', ...style }} />;
  }
  // Fallback: initials
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#FBD157', color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.45, ...style }}>
      {getInitials(name)}
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto');
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);
  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [user]);

  useEffect(() => {
    function applyTheme(t) {
      if (t === 'auto') {
        document.body.classList.remove('theme-dark', 'theme-light');
      } else if (t === 'dark') {
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
      } else {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
      }
    }
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (t) => setTheme(t);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    window.location.reload();
  };

  // Get avatar src: profile.avatar_url, Google avatar, or null
  let avatarSrc = profile?.avatar_url || user?.user_metadata?.avatar_url || null;
  let displayName = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/Eventmories-logo.svg" alt="Logo" />
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-icon${location.pathname === '/' ? ' active' : ''}`} title="Home">
          <img src="/home.svg" alt="Home" width={28} height={28} />
        </Link>
        <Link to="/search" className={`sidebar-icon${location.pathname === '/search' ? ' active' : ''}`} title="Search">
          <img src="/search.svg" alt="Search" width={28} height={28} />
        </Link>
        <Link to="/feed" className={`sidebar-icon${location.pathname === '/feed' ? ' active' : ''}`} title="Feed">
          <img src="/feed.svg" alt="Feed" width={28} height={28} />
        </Link>
        <Link to="/notifications" className={`sidebar-icon${location.pathname === '/notifications' ? ' active' : ''}`} title="Notifications">
          <img src="/notification.svg" alt="Notifications" width={28} height={28} />
        </Link>
        <Link to="/profile" className={`sidebar-icon${location.pathname === '/profile' ? ' active' : ''}`} title="Profile">
          <UserAvatar src={avatarSrc} name={displayName} size={32} />
        </Link>
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-icon" title="Menu" onClick={() => setShowMenu(v => !v)}>
          <img src="/menu.svg" alt="Menu" width={28} height={28} />
        </button>
        <SidebarMenuPopup
          open={showMenu}
          onClose={() => setShowMenu(false)}
          onThemeChange={handleThemeChange}
          theme={theme}
          onLogout={handleLogout}
        />
      </div>
    </aside>
  );
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('recentSearches') || '[]'));
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearching(true);
    setHasSearched(true);
    
    // Add to recent searches
    const newRecent = [query.trim(), ...recent.filter(t => t !== query.trim())].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    try {
      // Search through posts content
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          image_url,
          video_url,
          created_at,
          user_name,
          user_pic,
          feeds (
            id,
            name
          )
        `)
        .ilike('content', `%${query.trim()}%`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } else {
        setSearchResults(postsData || []);
      }
    } catch (err) {
      console.error('Search exception:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  // Function to highlight search terms in text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ backgroundColor: '#FBD157', padding: '0 2px', borderRadius: '2px' }}>
          {part}
        </mark>
      ) : part
    );
  };

  // Function to truncate text for preview
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return format(date, 'MMM d, yyyy');
      }
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="search-layout">
      <div className="search-panel">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={searching || !query.trim()}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {query && (
          <button onClick={clearSearch} className="clear-search-btn">
            Clear
          </button>
        )}
        
        {!hasSearched && recent.length > 0 && (
          <>
            <div className="recent-label">/ Recent searches</div>
            <div className="recent-list">
              {recent.map((term, index) => (
                <div
                  key={index}
                  className="recent-item"
                  onClick={() => {
                    setQuery(term);
                    // Auto-search when clicking recent item
                    const event = new Event('submit', { bubbles: true });
                    document.querySelector('.search-form').dispatchEvent(event);
                  }}
                >
                  {term}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="search-main">
        {hasSearched && (
          <div className="search-results">
            <div className="search-results-header">
              <h3>Search Results</h3>
              {searching ? (
                <div className="search-loading">Searching...</div>
              ) : (
                <div className="search-count">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>
            
            {!searching && searchResults.length === 0 && (
              <div className="search-empty">
                <p>No posts found matching "{query}"</p>
                <p>Try searching with different keywords</p>
              </div>
            )}
            
            {!searching && searchResults.length > 0 && (
              <div className="search-results-list">
                {searchResults.map(post => (
                  <div 
                    key={post.id} 
                    className="search-result-item"
                    onClick={() => {
                      // Navigate to feed page with this feed selected
                      window.location.href = `/feed?feedId=${post.feeds.id}`;
                    }}
                  >
                    <div className="search-result-content">
                      <div className="search-result-header">
                        <div className="search-result-user">
                          <UserAvatar src={post.user_pic} name={post.user_name} size={32} />
                          <div className="search-result-user-info">
                            <div className="search-result-username">{post.user_name}</div>
                            <div className="search-result-feed">in {post.feeds.name}</div>
                          </div>
                        </div>
                        <div className="search-result-date">{formatDate(post.created_at)}</div>
                      </div>
                      
                      <div className="search-result-text">
                        {highlightText(truncateText(post.content), query)}
                      </div>
                      
                      {post.image_url && (
                        <div className="search-result-media">
                          <img src={post.image_url} alt="Post" className="search-result-image" />
                        </div>
                      )}
                      
                      {post.video_url && (
                        <div className="search-result-media">
                          <video controls className="search-result-video">
                            <source src={post.video_url} type="video/mp4" />
                          </video>
                        </div>
                      )}
                    </div>
                    
                    <div className="search-result-actions">
                      <button 
                        className="search-result-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/feed?feedId=${post.feeds.id}`;
                        }}
                      >
                        View in Feed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function AddPostModal({ open, onClose, onPost, loading }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const fileInputRef = useRef();
  const videoInputRef = useRef();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onPost({ text, image, video });
    setText('');
    setImage(null);
    setVideo(null);
  };
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ minWidth: 340, maxWidth: 420, padding: 0, overflow: 'hidden' }}>
        <form onSubmit={handleSubmit} style={{ padding: 24, marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <textarea
            className="feed-post-input"
            placeholder="What's happening?"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            style={{ resize: 'none', fontSize: '1.1rem', border: '1px solid #FBD157', outline:'none', background: 'transparent', color:'#000' }}
            required={!image && !video}
          />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              style={{ background: 'none', border: '1px solid #000', cursor: 'pointer', padding: '5px 10px' }}
              title="Attach image"
            >
              <img src="/image.svg" alt="Attach image" width={28} height={28} />
            </button>
            <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageChange} />
            <button
              type="button"
              onClick={() => videoInputRef.current.click()}
              style={{ background: 'none', border: '1px solid #000', cursor: 'pointer', padding: '5px 10px' }}
              title="Attach video"
            >
              <img src="/video.svg" alt="Attach video" width={28} height={28} />
            </button>
            <input type="file" accept="video/*" style={{ display: 'none' }} ref={videoInputRef} onChange={handleVideoChange} />
            {image && <span style={{ fontSize: 13, color: '#888' }}>{image.name}</span>}
            {video && <span style={{ fontSize: 13, color: '#888' }}>{video.name}</span>}
            <div style={{ flex: 1 }} />
            <button type="submit" className="feed-post-btn" disabled={loading || (!text && !image && !video)}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
        <button className="modal-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ minWidth: 320, maxWidth: 380, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 28, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 12 }}>Delete Post?</div>
          <div style={{ color: '#888', fontSize: '1rem', marginBottom: 24 }}>
            Are you sure you want to delete this post? This action cannot be undone.
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button
              className="feed-post-btn"
              style={{
                background: '#eee',
                color: '#222',
                outline: 'none',
                transition: 'background 0.18s, color 0.18s',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#ddd';
                e.currentTarget.style.color = '#111';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#eee';
                e.currentTarget.style.color = '#222';
              }}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="feed-post-btn"
              style={{ background: '#F44336', color: '#fff', outline: 'none', transition: 'background 0.18s, color 0.18s', cursor: 'pointer' }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#d32f2f';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#F44336';
                e.currentTarget.style.color = '#fff';
              }}
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentModal({ open, onClose, post, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [commentProfiles, setCommentProfiles] = useState({});

  useEffect(() => {
    if (!open || !post) return;
    console.log('CommentModal: Fetching comments for post:', post.id);
    async function fetchComments() {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      console.log('CommentModal: Fetched comments:', data, 'Error:', error);
      setComments(data || []);
      setLoading(false);
    }
    fetchComments();
  }, [open, post]);

  useEffect(() => {
    async function fetchProfiles() {
      if (!comments.length) return;
      const userIds = Array.from(new Set(comments.map(c => c.user_id)));
      const { data } = await supabase
        .from('user_profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);
      const map = {};
      (data || []).forEach(p => { map[p.id] = p; });
      setCommentProfiles(map);
    }
    fetchProfiles();
  }, [comments]);

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setPosting(true);
    const userName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User';
    const userPic = user.user_metadata?.avatar_url || null;
    const commentData = {
      post_id: post.id,
      user_id: user.id,
      content: newComment.trim(),
      user_name: userName,
      user_pic: userPic
    };
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select();
      if (error) {
        alert('Failed to add comment: ' + error.message);
        setPosting(false);
        return;
      }
      setNewComment('');
      // Insert notification if not commenting on own post
      if (post.user_id !== user.id) {
        await supabase.from('notifications').insert([
          {
            user_id: post.user_id,
            from_user_id: user.id,
            from_user_name: userName,
            from_user_pic: userPic,
            post_id: post.id,
            type: 'comment',
            extra: JSON.stringify({ comment: newComment.trim() })
          }
        ]);
      }
      // Refresh comments
      const { data: refreshData } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      setComments(refreshData || []);
    } catch (err) {
      alert('Failed to add comment: ' + err.message);
    } finally {
      setPosting(false);
    }
  }

  if (!open || !post) return null;
  console.log('CommentModal: Rendering with comments:', comments);
  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ minWidth: 340, maxWidth: 420, padding: 0, overflow: 'hidden', maxHeight: '70vh'}}>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 500, minHeight: 320 }}>
          <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, color: '#000' }}>Comments</div>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: 8,
              // Hide scrollbars but allow scrolling
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE 10+
            }}
            className="hide-scrollbar"
          >
            {loading ? (
              <div style={{ color: '#bbb' }}>Loading...</div>
            ) : comments.length === 0 ? (
              <div style={{ color: '#bbb' }}>No comments yet.</div>
            ) : (
              comments.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                  <Link to={c.user_id === user.id ? '/profile' : `/profile/${c.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <UserAvatar src={commentProfiles[c.user_id]?.avatar_url || c.user_pic} name={commentProfiles[c.user_id]?.name || c.user_name} size={32} />
                  </Link>
                  <div>
                    <Link to={c.user_id === user.id ? '/profile' : `/profile/${c.user_id}`} style={{ fontWeight: 600, color: '#222', textAlign:'left', fontSize: 14, textDecoration: 'none' }}>{commentProfiles[c.user_id]?.name || c.user_name}</Link>
                    <div style={{ color: '#888', textAlign:'left', fontSize: 12 }}>{new Date(c.created_at).toLocaleString()}</div>
                    <div style={{ color: '#222', textAlign:'left', fontSize: 15, marginTop: 2 }}>{c.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{ flex: 1, borderRadius: 8, border: '1px solid #eee', padding: 8, fontSize: 15 }}
              disabled={posting}
            />
            <button className="feed-post-btn" type="submit" disabled={posting || !newComment.trim()} style={{ padding: '8px 18px', fontSize: 15 }}>
              {posting ? '...' : 'Send'}
            </button>
          </form>
        </div>
        <button className="modal-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}

function FeedPage({ user }) {
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [loadingFeeds, setLoadingFeeds] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [likeStatus, setLikeStatus] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [commentPost, setCommentPost] = useState(null);
  const [showFeedsDropdown, setShowFeedsDropdown] = useState(false);
  const postsListRef = useRef();
  const [profile, setProfile] = useState(null);
  const [saveStatus, setSaveStatus] = useState({});

  // Fetch user profile for latest avatar
  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [user]);

  // Get feed ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const feedIdFromUrl = urlParams.get('feedId');

  // Fetch feeds the user is in
  useEffect(() => {
    async function fetchFeeds() {
      setLoadingFeeds(true);
      const { data, error } = await supabase
        .from('feed_members')
        .select('feed_id, joined_at, feeds (id, name, code)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });
      const feedsList = (data || []).map(fm => ({
        ...fm.feeds,
        joined_at: fm.joined_at
      })).filter(Boolean);
      setFeeds(feedsList);
      
      // Select feed based on URL parameter or default to first feed
      if (feedIdFromUrl) {
        const feedFromUrl = feedsList.find(f => f.id === feedIdFromUrl);
        setSelectedFeed(feedFromUrl || feedsList[0] || null);
        // Clear URL parameter after selecting
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setSelectedFeed(feedsList[0] || null);
      }
      
      setLoadingFeeds(false);
    }
    fetchFeeds();
  }, [user.id, feedIdFromUrl]);

  // Fetch posts for selected feed
  useEffect(() => {
    if (!selectedFeed) return;
    async function fetchPostsAndLikes() {
      setLoadingPosts(true);
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .eq('feed_id', selectedFeed.id)
        .order('created_at', { ascending: false });
      setPosts(postsData || []);
      setLoadingPosts(false);
      // Fetch likes for all posts
      if (postsData && postsData.length > 0) {
        const postIds = postsData.map(p => p.id);
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id, user_id')
          .in('post_id', postIds);
        // Count likes per post
        const counts = {};
        const status = {};
        postIds.forEach(id => {
          counts[id] = 0;
          status[id] = false;
        });
        (likesData || []).forEach(like => {
          counts[like.post_id] = (counts[like.post_id] || 0) + 1;
          if (like.user_id === user.id) status[like.post_id] = true;
        });
        setLikeCounts(counts);
        setLikeStatus(status);
        // Fetch saves for all posts
        const { data: savesData } = await supabase
          .from('post_saves')
          .select('post_id, user_id')
          .in('post_id', postIds);
        const saveStatusObj = {};
        postIds.forEach(id => {
          saveStatusObj[id] = false;
        });
        (savesData || []).forEach(save => {
          if (save.user_id === user.id) saveStatusObj[save.post_id] = true;
        });
        setSaveStatus(saveStatusObj);
      } else {
        setLikeCounts({});
        setLikeStatus({});
        setSaveStatus({});
      }
    }
    fetchPostsAndLikes();
  }, [selectedFeed, user.id]);

  // Scroll to post if postId is in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    if (postId && posts.length > 0) {
      // Wait for DOM update
      setTimeout(() => {
        const el = document.getElementById(`feed-post-${postId}`);
        if (el && postsListRef.current) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [posts]);

  // Handle new post (text, image, video)
  async function handlePost({ text, image, video }) {
    setPosting(true);
    let image_url = null;
    let video_url = null;
    const userName =
      profile?.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User';
    const userPic = profile?.avatar_url || user.user_metadata?.avatar_url || null;

    // Upload image if present
    if (image) {
      const fileExt = image.name.split('.').pop();
      const filePath = `images/${user.id}_${Date.now()}.${fileExt}`;
      const { error: imgErr } = await supabase.storage.from('post-media').upload(filePath, image, { upsert: true });
      if (!imgErr) {
        const { data } = supabase.storage.from('post-media').getPublicUrl(filePath);
        image_url = data.publicUrl;
      }
    }
    // Upload video if present
    if (video) {
      const fileExt = video.name.split('.').pop();
      const filePath = `videos/${user.id}_${Date.now()}.${fileExt}`;
      const { error: vidErr } = await supabase.storage.from('post-media').upload(filePath, video, { upsert: true });
      if (!vidErr) {
        const { data } = supabase.storage.from('post-media').getPublicUrl(filePath);
        video_url = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from('posts')
      .insert([{
        feed_id: selectedFeed.id,
        user_id: user.id,
        content: text,
        image_url,
        video_url,
        user_name: userName,
        user_pic: userPic
      }]);
    if (error) {
      alert('Error posting: ' + error.message);
      setPosting(false);
      return;
    }
    setPosting(false);
    setShowAddModal(false);
    // Refresh posts
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('feed_id', selectedFeed.id)
      .order('created_at', { ascending: false });
    setPosts(data || []);
  }

  // Handle delete post
  async function handleDelete(postId) {
    await supabase.from('posts').delete().eq('id', postId);
    setPosts(posts.filter(p => p.id !== postId));
    setDeletePostId(null);
  }

  // Toggle like
  async function handleToggleLike(postId) {
    const liked = likeStatus[postId];
    const post = posts.find(p => p.id === postId);
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('post_likes').insert([{ post_id: postId, user_id: user.id }]);
      // Insert notification if not liking own post
      if (post && post.user_id !== user.id) {
        const userName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'User';
        const userPic = user.user_metadata?.avatar_url || null;
        await supabase.from('notifications').insert([
          {
            user_id: post.user_id,
            from_user_id: user.id,
            from_user_name: userName,
            from_user_pic: userPic,
            post_id: postId,
            type: 'like',
            extra: null
          }
        ]);
      }
    }
    // Refresh likes
    const { data: likesData } = await supabase
      .from('post_likes')
      .select('post_id, user_id')
      .eq('post_id', postId);
    setLikeCounts(likeCounts => ({ ...likeCounts, [postId]: (likesData || []).length }));
    setLikeStatus(likeStatus => ({ ...likeStatus, [postId]: !liked }));
  }

  // Toggle save/bookmark
  async function handleToggleSave(postId) {
    const saved = saveStatus[postId];
    if (saved) {
      await supabase.from('post_saves').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('post_saves').insert([{ post_id: postId, user_id: user.id }]);
    }
    // Refresh saves for this post
    const { data: savesData } = await supabase
      .from('post_saves')
      .select('post_id, user_id')
      .eq('post_id', postId);
    setSaveStatus(saveStatus => ({ ...saveStatus, [postId]: !saved }));
  }

  // TODO: Comment, save logic

  return (
    <div className="feed-layout">
      <Sidebar />
      <div className="feed-main">
        {selectedFeed ? (
          <>
            <div className="feed-main-header">
              <div className="feed-header-content">
                <div className="feed-main-title">{selectedFeed.name}</div>
                <button 
                  className="feed-dropdown-btn"
                  onClick={() => setShowFeedsDropdown(!showFeedsDropdown)}
                  title="Show feeds"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showFeedsDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
              </div>
              {showFeedsDropdown && (
                <div className="feed-dropdown-panel">
                  <div className="feed-dropdown-title">Feeds</div>
                  {loadingFeeds ? (
                    <div className="feed-dropdown-loading">Loading feeds...</div>
                  ) : feeds.length === 0 ? (
                    <div className="feed-dropdown-empty">You are not in any feeds yet.</div>
                  ) : (
                    feeds.map(feed => (
                      <div
                        key={feed.id}
                        className={`feed-dropdown-item${selectedFeed && feed.id === selectedFeed.id ? ' selected' : ''}`}
                        onClick={() => {
                          setSelectedFeed(feed);
                          setShowFeedsDropdown(false);
                        }}
                      >
                        <div className="feed-dropdown-name">{feed.name}</div>
                        <div className="feed-dropdown-date">{format(new Date(feed.joined_at), 'MMM d, yyyy')}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <button className="feed-add-btn" title="Add post" onClick={() => setShowAddModal(true)}>
              <span style={{ fontSize: 32, color: '#fff', lineHeight: 1 }}>+</span>
            </button>
            <AddPostModal open={showAddModal} onClose={() => setShowAddModal(false)} onPost={handlePost} loading={posting} />
            <DeleteConfirmModal
              open={!!deletePostId}
              onCancel={() => setDeletePostId(null)}
              onConfirm={() => handleDelete(deletePostId)}
            />
            <CommentModal open={!!commentPost} onClose={() => {
              console.log('FeedPage: Closing comment modal');
              setCommentPost(null);
            }} post={commentPost} user={user} />
            <div className="feed-posts-scroll">
              <div className="feed-posts-list" ref={postsListRef}>
                {loadingPosts ? (
                  <div className="feed-list-loading">Loading posts...</div>
                ) : posts.length === 0 ? (
                  <div className="feed-list-empty">No posts yet. Be the first to post!</div>
                ) : (
                  posts.map(post => (
                    <FeedPostItem
                      key={post.id}
                      post={post}
                      user={user}
                      onDelete={() => setDeletePostId(post.id)}
                      onToggleLike={() => handleToggleLike(post.id)}
                      liked={!!likeStatus[post.id]}
                      likeCount={likeCounts[post.id] || 0}
                      onComment={() => {
                        console.log('FeedPage: Opening comment modal for post:', post.id);
                        setCommentPost(post);
                      }}
                      onToggleSave={() => handleToggleSave(post.id)}
                      saved={!!saveStatus[post.id]}
                      id={`feed-post-${post.id}`}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="feed-list-empty">Select a feed to view posts.</div>
        )}
      </div>
      <div className="feed-list-panel feed-list-panel-right">
        <div className="feed-list-title">Feeds</div>
        {loadingFeeds ? (
          <div className="feed-list-loading">Loading feeds...</div>
        ) : feeds.length === 0 ? (
          <div className="feed-list-empty">You are not in any feeds yet.</div>
        ) : (
          feeds.map(feed => (
            <div
              key={feed.id}
              className={`feed-list-item${selectedFeed && feed.id === selectedFeed.id ? ' selected' : ''}`}
              onClick={() => setSelectedFeed(feed)}
            >
              <div className="feed-list-name">{feed.name}</div>
              <div className="feed-list-date">{format(new Date(feed.joined_at), 'MMM d, yyyy')}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FeedPostItem({ post, user, onDelete, onToggleLike, liked, likeCount, onComment, id, onToggleSave, saved, feedId }) {
  // Always fetch latest profile for post.user_id
  const [profile, setProfile] = useState(undefined); // undefined means 'loading', null means 'not found'
  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', post.user_id)
        .single();
      if (isMounted) setProfile(data ?? null);
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, [post.user_id]);

  let posterName = (profile !== undefined && profile !== null) ? (profile.name || 'User') : (post.user_name || 'User');
  let posterPic = (profile !== undefined && profile !== null) ? (profile.avatar_url || null) : (post.user_pic || null);

  const isOwner = post.user_id === user.id;

  // Format date using real post.created_at value
  let dateString = '';
  try {
    const dateObj = new Date(post.created_at);
    if (!isNaN(dateObj.getTime())) {
      // Use toLocaleString for real local time
      dateString = dateObj.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } else {
      dateString = '';
    }
  } catch {
    dateString = '';
  }

  const [commentCount, setCommentCount] = useState(post.comment_count || 0);
  useEffect(() => {
    async function fetchCommentCount() {
      console.log('FeedPostItem: Fetching comment count for post:', post.id);
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      console.log('FeedPostItem: Comment count result:', count, 'Error:', error);
      setCommentCount(count || 0);
    }
    fetchCommentCount();
  }, [post.id]);

  const navigate = useNavigate ? useNavigate() : null;

  // Only make the main post area clickable, not the action buttons
  const handleNavigateToFeed = (e) => {
    // Prevent navigation if clicking on a button or link
    if (
      e.target.closest('.feed-post-action-btn') ||
      e.target.tagName === 'BUTTON' ||
      e.target.tagName === 'A' ||
      e.target.closest('button')
    ) return;
    if (navigate && post.feed_id && post.id) {
      navigate(`/feed?feedId=${post.feed_id}&postId=${post.id}`);
    } else {
      window.location.href = `/feed?feedId=${post.feed_id}&postId=${post.id}`;
    }
  };

  return (
    <div className="feed-post-item" id={id} style={{ cursor: feedId ? 'pointer' : 'default' }} onClick={feedId ? handleNavigateToFeed : undefined}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to={post.user_id === user.id ? '/profile' : `/profile/${post.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <UserAvatar src={posterPic} name={posterName} size={38} />
            <div>
              <div style={{ fontWeight: 600, color: '#222', textAlign:'start' }}>{posterName}</div>
              <div style={{ color: '#aaa', fontSize: 13 }}>{dateString}</div>
            </div>
          </Link>
        </div>
        {isOwner && (
          <div style={{ position: 'relative' }}>
            <button
              className="feed-post-menu-btn"
              title="Delete post"
              onClick={onDelete}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline:'none' }}
            >
              <img src="/delete.svg" alt="Delete" style={{ width: 22, height: 22, display: 'inline-block', filter: 'grayscale(1) brightness(0.5)' }} />
        </button>
          </div>
        )}
      </div>
      {/* Move text above media */}
      <div className="feed-post-content" style={{textAlign:'start', marginLeft:'50px'}}>{post.content}</div>
      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post"
          style={{
            width: '80%',
            borderRadius: 12,
            margin: '10px 0 8px 50px',
          }}
        />
      )}
      {post.video_url && (
        <video
          src={post.video_url}
          controls
          style={{
            width: '80%',
            borderRadius: 12,
            margin: '18px 0 8px 50px',
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          marginTop: 8,
        }}
        onClick={e => e.stopPropagation()} // Prevent action bar clicks from triggering navigation
      >
        <span
          className="feed-post-action-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: liked ? '#F44336' : '#888',
            fontSize: 15,
            cursor: 'pointer',
            userSelect: 'none',
            padding: '8px 4px',
            borderRadius: '8px',
            transition: 'background 0.2s',
            minHeight: '44px',
            minWidth: '44px',
            justifyContent: 'center'
          }}
          onClick={onToggleLike}
          onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? '#F44336' : 'none'} stroke="#F44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          {likeCount}
        </span>
        <span
          className="feed-post-action-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#888',
            fontSize: 15,
            cursor: 'pointer',
            userSelect: 'none',
            padding: '8px 4px',
            borderRadius: '8px',
            transition: 'background 0.2s',
            minHeight: '44px',
            minWidth: '44px',
            justifyContent: 'center'
          }}
          onClick={onComment}
          onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <img
            src="/comment.svg"
            alt="comment"
            style={{ width: 20, height: 20, display: 'inline-block' }}
          />{' '}
          {commentCount}
        </span>
        <span
          className="feed-post-action-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: saved ? '#FBD157' : '#888',
            fontSize: 15,
            cursor: 'pointer',
            userSelect: 'none',
            padding: '8px 4px',
            borderRadius: '8px',
            transition: 'background 0.2s',
            minHeight: '44px',
            minWidth: '44px',
            justifyContent: 'center'
          }}
          onClick={onToggleSave}
          onMouseEnter={e => e.target.style.background = '#f0f0f0'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
        >
          <img
            src={saved ? "/save-filled.svg" : "/save.svg"}
            alt="save"
            style={{ width: 20, height: 20, display: 'inline-block' }}
          />
        </span>
      </div>
    </div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    async function fetchNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setLoading(false);
      // Mark all as read
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
    }
    fetchNotifications();
  }, [user]);

  function renderMessage(n) {
    if (n.type === 'like') {
      return <span><b>{n.from_user_name || 'Someone'}</b> liked your post.</span>;
    }
    if (n.type === 'comment') {
      let comment = '';
      try {
        comment = JSON.parse(n.extra)?.comment || '';
      } catch {}
      return <span><b>{n.from_user_name || 'Someone'}</b> commented: "{comment}"</span>;
    }
    return <span>New notification</span>;
  }

  function handleNotificationClick(n) {
    // Navigate to feed page with feedId and postId
    navigate(`/feed?feedId=${n.feed_id || n.post_id}&postId=${n.post_id}`);
  }

  return (
    <div className="feed-layout">
      <div className="feed-main" style={{ maxWidth: 420, margin: 'auto', padding: 24 }}>
        <h2 style={{ textAlign: 'left', marginBottom: 24, color: '#000' }}>Notifications</h2>
        {loading ? (
          <div style={{ color: '#888', textAlign: 'center' }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center' }}>No notifications yet.</div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              maxHeight: '70vh',
              overflowY: 'auto',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE 10+
            }}
            className="hide-scrollbar"
          >
            {notifications.map(n => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: n.read ? '#fff' : '#f8f8f8',
                  borderRadius: 12,
                  padding: '12px 10px',
                  border: '1px solid #eee',
                  cursor: 'pointer'
                }}
                onClick={() => handleNotificationClick(n)}
              >
                <UserAvatar src={n.from_user_pic || '/profile.svg'} name={n.from_user_name || 'Someone'} size={36} />
                <div style={{ flex: 1, textAlign: 'left', color:'#000' }}>
                  {renderMessage(n)}
                  <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{new Date(n.created_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Add a ProfileEditModal component
function ProfileEditModal({ open, form, avatarUrl, onChange, onAvatarChange, onSave, onCancel, saving }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{ zIndex: 1000 }}>
      <div className="modal-box" style={{ minWidth: 340, maxWidth: 420, padding: 0, overflow: 'hidden', borderRadius: 20, background: '#fff', maxHeight:'100vh'}}>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <UserAvatar src={avatarUrl || '/profile.svg'} name={form.name || 'User'} size={110} />
            <label htmlFor="avatar-upload" style={{ position: 'absolute', right: 0, bottom: 0, background: '#FBD157', borderRadius: '50%', padding: 6, display: 'flex', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff' }}>
              <img src="/image.svg" alt="Edit" style={{ width: 24, height: 24 }} />
              <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={onAvatarChange} />
            </label>
          </div>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            style={{ fontWeight: 700, fontSize: 28, textAlign: 'center', border: '1.5px solid #000', marginBottom: 8, background: 'transparent', outline: 'none', color: '#000', width: '100%' }}
            maxLength={40}
            placeholder="Name"
          />
          <div style={{ display: 'flex', gap: 18, color: '#888', fontSize: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['instagram', 'linkedin', 'twitter'].map(social => (
              <input
                key={social}
                name={social}
                value={form[social]}
                onChange={onChange}
                placeholder={social.charAt(0).toUpperCase() + social.slice(1)}
                style={{ border: '1.5px solid #000', background: 'transparent', outline: 'none', color: 'var(--text)', fontSize: 15, width: 120, marginRight: 8 }}
                maxLength={40}
              />
            ))}
          </div>
          <textarea
            name="bio"
            value={form.bio}
            onChange={onChange}
            placeholder="Bio"
            rows={2}
            style={{ width: '100%', border: '1.5px solid #000', borderRadius: 8, padding: 8, fontSize: 15, background: 'transparent', color: '#000', resize: 'none' }}
            maxLength={160}
          />
          <div style={{ display: 'flex', gap: 16, marginTop: 12, width: '100%', justifyContent: 'flex-end' }}>
            <button className="feed-post-btn" style={{ background: '#eee', color: '#222' }} onClick={onCancel} disabled={saving}>Cancel</button>
            <button className="feed-post-btn" style={{ background: '#FBD157', color: '#222' }} onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', instagram: '', linkedin: '', twitter: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchProfile() {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setForm({
        name: data?.name || '',
        bio: data?.bio || '',
        instagram: data?.instagram || '',
        linkedin: data?.linkedin || '',
        twitter: data?.twitter || ''
      });
      setAvatarUrl(data?.avatar_url || '');
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Fetch posts by user
    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPosts(data || []);
      if (data && data.length) {
        // Fetch like counts for these posts
        const postIds = data.map(p => p.id);
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .in('post_id', postIds);
        const counts = {};
        postIds.forEach(id => {
          counts[id] = (likesData || []).filter(l => l.post_id === id).length;
        });
        setLikeCounts(counts);
      } else {
        setLikeCounts({});
      }
    }
    // Fetch liked posts
    async function fetchLikes() {
      const { data: likesData } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);
      const postIds = (likesData || []).map(l => l.post_id);
      if (postIds.length) {
        const { data: likedPosts } = await supabase
          .from('posts')
          .select('*')
          .in('id', postIds)
          .order('created_at', { ascending: false });
        setLikes(likedPosts || []);
        // Fetch like counts for these posts
        const { data: likesDataAll } = await supabase
          .from('post_likes')
          .select('post_id')
          .in('post_id', postIds);
        const counts = {};
        postIds.forEach(id => {
          counts[id] = (likesDataAll || []).filter(l => l.post_id === id).length;
        });
        setLikeCounts(lc => ({ ...lc, ...counts }));
      } else {
        setLikes([]);
      }
    }
    // Fetch bookmarks (saved posts)
    async function fetchBookmarks() {
      const { data: savedData } = await supabase
        .from('post_saves')
        .select('post_id')
        .eq('user_id', user.id);
      const postIds = (savedData || []).map(s => s.post_id);
      if (postIds.length) {
        const { data: savedPosts } = await supabase
          .from('posts')
          .select('*')
          .in('id', postIds)
          .order('created_at', { ascending: false });
        setBookmarks(savedPosts || []);
        // Fetch like counts for these posts
        const { data: likesDataAll } = await supabase
          .from('post_likes')
          .select('post_id')
          .in('post_id', postIds);
        const counts = {};
        postIds.forEach(id => {
          counts[id] = (likesDataAll || []).filter(l => l.post_id === id).length;
        });
        setLikeCounts(lc => ({ ...lc, ...counts }));
      } else {
        setBookmarks([]);
      }
    }
    fetchPosts();
    fetchLikes();
    fetchBookmarks();
  }, [user]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: profile?.name || '',
      bio: profile?.bio || '',
      instagram: profile?.instagram || '',
      linkedin: profile?.linkedin || '',
      twitter: profile?.twitter || ''
    });
    setAvatarFile(null);
    setAvatarUrl(profile?.avatar_url || '');
  };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleAvatarChange = e => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleSave = async () => {
    setSaving(true);
    let newAvatarUrl = profile?.avatar_url || '';
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${user.id}_${Date.now()}.${fileExt}`;
      // Remove previous avatar if needed (optional)
      // await supabase.storage.from('avatars').remove([profile?.avatar_url]);
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
      if (!uploadErr) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        newAvatarUrl = data.publicUrl;
      } else {
        alert('Failed to upload avatar.');
        setSaving(false);
        return;
      }
    }
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        name: form.name,
        bio: form.bio,
        instagram: form.instagram,
        linkedin: form.linkedin,
        twitter: form.twitter,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString()
      });
    if (!error) {
      // Re-fetch profile to ensure latest avatar is loaded
      const { data: updatedProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(updatedProfile);
      setAvatarUrl(updatedProfile?.avatar_url || '');
      setEditMode(false);
      setAvatarFile(null);
    }
    setSaving(false);
  }

  if (loading) return <div className="feed-layout"><div className="feed-main" style={{ margin: 'auto', textAlign: 'center' }}>Loading...</div></div>;
  if (!user) return <div className="feed-layout"><div className="feed-main" style={{ margin: 'auto', textAlign: 'center' }}>Not signed in.</div></div>;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, background: 'var(--bg)' }}>
      <div className="profile-card" style={{ minWidth:420, maxWidth: 720, margin: '20px auto', background: 'var(--card)', borderRadius: 24, border: '1.5px solid #727272', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minHeight: 320 }}>
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <UserAvatar src={avatarUrl || '/profile.svg'} name={profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'} size={window.innerWidth < 500 ? 70 : 110} />
        </div>
        <div style={{ fontWeight: 700, fontSize: window.innerWidth < 500 ? 18 : 28, color: '#000', marginBottom: 8 }}>{profile?.name || 'No Name'}</div>
        <div style={{ display: 'flex', gap: window.innerWidth < 500 ? 8 : 18, marginBottom: 10, color: '#888', fontSize: window.innerWidth < 500 ? 13 : 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['instagram', 'linkedin', 'twitter'].map(social => (
            profile?.[social] && <a key={social} href={profile[social]} target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none', fontWeight: 500 }}>{social.charAt(0).toUpperCase() + social.slice(1)}</a>
          ))}
        </div>
        <div style={{ color: '#666', fontSize: window.innerWidth < 500 ? 13 : 16, marginBottom: 12, textAlign: 'center', minHeight: 24 }}>{profile?.bio || 'No bio yet.'}</div>
        <div style={{ display: 'flex', gap: window.innerWidth < 500 ? 8 : 18, marginBottom: window.innerWidth < 500 ? 10 : 18, borderBottom: '1.5px solid #FBD157', width: '100%', justifyContent:'space-evenly' }}>
          {['posts', 'likes', 'bookmarks'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ background: 'none', borderRadius: 0, border: 'none', fontWeight: 600, fontSize: window.innerWidth < 500 ? 14 : 17, color: tab === t ? '#000' : '#888', borderBottom: tab === t ? '3px solid #FBD157' : 'none', padding: window.innerWidth < 500 ? '6px 0' : '8px 0', cursor: 'pointer', outline: 'none' }}
            >
              {t === 'posts' ? 'My posts' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="hide-scrollbar" style={{ width: '100%', minHeight: 480, maxHeight: window.innerWidth < 500 ? 120 : 400, overflowY: 'auto', marginBottom: 8 }}>
          {tab === 'posts' && posts.map(post => (
            <FeedPostItem key={post.id} post={post} user={user} likeCount={likeCounts[post.id] || 0} feedId={post.feed_id} />
          ))}
          {tab === 'likes' && likes.map(post => (
            <FeedPostItem key={post.id} post={post} user={user} likeCount={likeCounts[post.id] || 0} liked={true} feedId={post.feed_id} />
          ))}
          {tab === 'bookmarks' && bookmarks.map(post => (
            <FeedPostItem key={post.id} post={post} user={user} likeCount={likeCounts[post.id] || 0} saved={true} onToggleSave={() => {}} feedId={post.feed_id} />
          ))}
          {(['posts','likes','bookmarks'].map((t, i) => tab === t && [posts, likes, bookmarks][i].length === 0 ? (
            <div key={t} style={{ color: '#bbb', textAlign: 'center', marginTop: 32 }}>No posts yet.</div>
          ) : null))}
        </div>
      </div>
      {/* Floating edit button outside the card */}
      {!editMode && (
        <button
          className="profile-edit-fab"
          style={{
            position: 'fixed',
            right: window.innerWidth < 500 ? 12 : 32,
            bottom: window.innerWidth < 500 ? 12 : 32,
            width: window.innerWidth < 500 ? 40 : 48,
            height: window.innerWidth < 500 ? 40 : 48,
            borderRadius: '50%',
            background: '#FBD157',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3000
          }}
          onClick={handleEdit}
          title="Edit Profile"
        >
          <img src="/pen.svg" alt="Edit" style={{ width: window.innerWidth < 500 ? 20 : 24, height: window.innerWidth < 500 ? 20 : 24 }} />
        </button>
      )}
      {/* Profile edit modal */}
      <ProfileEditModal
        open={editMode}
        form={form}
        avatarUrl={avatarUrl}
        onChange={handleChange}
        onAvatarChange={handleAvatarChange}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}

function HomePage({ user }) {
  // Always fetch latest name from user_profiles
  const [profile, setProfile] = useState(undefined); // undefined when its loading
  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      const { data } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      if (isMounted) setProfile(data ?? null);
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, [user.id]);
  const name = (profile !== undefined && profile !== null) ? (profile.name || 'User') : (user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User');
  const hour = new Date().getHours();
  const greeting = (
    <span style={{ color: '#000', fontFamily: 'Work Sans, Arial, sans-serif' }}>
      {hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'}
    </span>
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  let displayName = 'User';
  if (profile === undefined) {
    displayName = '...'; // or 'User' or a spinner
  } else if (profile !== null) {
    displayName = profile.name || 'User';
  } else {
    displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  }

  return (
    <div className="home-layout">
      <Sidebar />
      <CreateFeedModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <JoinFeedModal open={showJoinModal} onClose={() => setShowJoinModal(false)} user={user} />
      <SearchPanel open={showSearchPanel} onClose={() => setShowSearchPanel(false)} />
      <main className="home-main">
        <div className="home-center" style={{ color: '#000', fontFamily: "'Work Sans', Arial, sans-serif" }}>
          <h1
            style={{
              fontWeight: 700,
              fontSize: '2.2rem',
              marginBottom: 8,
              textAlign: 'center',
              color: '#000',
              fontFamily: "'Work Sans', Arial, sans-serif"
            }}
          >
            {greeting}, {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
          </h1>
          <h2
            style={{
              fontWeight: 600,
              fontSize: '2rem',
              marginBottom: 32,
              textAlign: 'center',
              color: '#000',
              fontFamily: "'Work Sans', Arial, sans-serif"
            }}
          >
            What is the Event?
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="home-btn" onClick={() => setShowCreateModal(true)}>Create Feed</button>
            <button className="home-btn" onClick={() => setShowJoinModal(true)}>Join Feed</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function CreateFeedModal({ open, onClose, onFeedCreated }) {
  const [feedName, setFeedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdFeed, setCreatedFeed] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCopied(false);
    const code = generateFeedCode();
    // Insert feed into Supabase
    const { data, error } = await supabase
      .from('feeds')
      .insert([{ name: feedName, code }])
      .select()
      .single();
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setCreatedFeed(data);
      onFeedCreated && onFeedCreated(data);
    }
  };

  const handleCopy = () => {
    if (createdFeed?.code) {
      navigator.clipboard.writeText(createdFeed.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ padding:'32px 28px 24px', color:'#000', maxWidth: '320px' }}>
        {!createdFeed ? (
          <>
            <h2 style={{ marginBottom: 18, fontWeight: 700 }}>Create Feed</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Name Your Feed"
                value={feedName}
                onChange={e => setFeedName(e.target.value)}
                required
                // style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', fontSize: '1.1rem' }}
              />
              <button type="submit" className="createfeed-btn" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Creating...' : 'Create'}
              </button>
            </form>
            {error && <div style={{ color: '#d32f2f', marginTop: 8 }}>{error}</div>}
            <button className="modal-close" onClick={onClose}>&times;</button>
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: 12, fontWeight: 700 }}>Feed Created!</h2>
            <div style={{ marginBottom: 10 }}>Share this code to invite others:</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>{createdFeed.code}</div>
            <button className="copycode-btn" onClick={handleCopy} style={{ width: '100%' }}>
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button className="modal-close" onClick={onClose} style={{ marginTop: 12 }}>&times;</button>
          </>
        )}
      </div>
    </div>
  );
}

function JoinFeedModal({ open, onClose, user }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    // 1. Check if feed exists
    const { data: feed, error: feedError } = await supabase
      .from('feeds')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .single();
    if (feedError || !feed) {
      setError('Feed not found!');
      setLoading(false);
      return;
    }
    // 2. Check if user is already a member
    const { data: member, error: memberError } = await supabase
      .from('feed_members')
      .select('*')
      .eq('feed_id', feed.id)
      .eq('user_id', user.id)
      .maybeSingle();
    if (member) {
      setError("You're already in this feed!");
      setLoading(false);
      return;
    }
    // 3. If not, add user to feed_members
    const { error: joinError } = await supabase
      .from('feed_members')
      .insert([{ feed_id: feed.id, user_id: user.id }]);
    if (joinError) {
      setError('Failed to join feed.');
    } else {
      setSuccess('Successfully joined the feed!');
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{padding:'32px 28px 24px', color:'#000', maxWidth: '320px' }}>
        <h2 style={{ marginBottom: 18, fontWeight: 700 }}>Join Feed</h2>
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="text"
            placeholder="Enter Feed Code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
          <button type="submit" className="joinfeed-btn" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Joining...' : 'Join'}
          </button>
        </form>
        {error && <div style={{ color: '#d32f2f', marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: '#388e3c', marginTop: 8 }}>{success}</div>}
        <button className="modal-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}

function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('recentSearches') || '[]'));
  const panelRef = useRef();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const newRecent = [query.trim(), ...recent.filter(t => t !== query.trim())].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    setQuery('');
    // TODO: Show search results
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search-overlay">
      <div className="search-panel" ref={panelRef}>
        <form className="search-form" onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/search.svg"
            alt="Search"
            width={22}
            height={22}
            style={{ marginRight: 8, opacity: 0.7 }}
          />
          <input
            className="search-input"
            type="text"
            placeholder="Search anything..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </form>
        <div className="recent-label">Recently Searched</div>
        <div className="recent-list">
          {recent.length === 0 ? (
            <span className="recent-empty">No recent searches</span>
          ) : (
            recent.map((term, i) => (
              <div key={i} className="recent-item">{term}</div>
            ))
          )}
        </div>
        <button className="modal-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}

// generate a 6-character alphanumeric code
function generateFeedCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchProfile() {
      setLoading(true);
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();
      setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  if (loading) return <div className="feed-layout"><div className="feed-main" style={{ margin: 'auto', textAlign: 'center' }}>Loading...</div></div>;
  if (!profile) return <div className="feed-layout"><div className="feed-main" style={{ margin: 'auto', textAlign: 'center', color:'#000', fontSize:'18px', justifyContent:'center' }}>"This profile is private because the user hasn't set it up yet."</div></div>;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, background: 'var(--bg)' }}>
      <div className="profile-card" style={{ maxWidth: 720, margin: '20px auto', background: 'var(--card)', borderRadius: 24, border: '1.5px solid #727272', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minHeight: 320 }}>
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <UserAvatar src={profile?.avatar_url || '/profile.svg'} name={profile?.name || 'User'} size={window.innerWidth < 500 ? 70 : 110} />
        </div>
        <div style={{ fontWeight: 700, fontSize: window.innerWidth < 500 ? 18 : 28, color: '#000', marginBottom: 8 }}>{profile?.name || 'No Name'}</div>
        <div style={{ display: 'flex', gap: window.innerWidth < 500 ? 8 : 18, marginBottom: 10, color: '#888', fontSize: window.innerWidth < 500 ? 13 : 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['instagram', 'linkedin', 'twitter'].map(social => (
            profile?.[social] && <a key={social} href={profile[social]} target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none', fontWeight: 500 }}>{social.charAt(0).toUpperCase() + social.slice(1)}</a>
          ))}
        </div>
        <div style={{ color: '#666', fontSize: window.innerWidth < 500 ? 13 : 16, marginBottom: 12, textAlign: 'center', minHeight: 24 }}>{profile?.bio || 'No bio yet.'}</div>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    // Get current user on mount
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data?.user || null);
      // Ensure user_profiles row exists
      if (data?.user) {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
        if (!profile) {
          // Insert a new profile row
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            avatar_url: data.user.user_metadata?.avatar_url || '',
            bio: '',
            instagram: '',
            linkedin: '',
            twitter: ''
          });
        }
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div style={{ display: 'flex' }}>
      {user && <Sidebar />}
      <Routes>
        <Route path="/" element={user ? <HomePage user={user} /> : <AuthPage />} />
        <Route path="/search" element={user ? <SearchPage /> : <AuthPage />} />
        <Route path="/feed" element={user ? <FeedPage user={user} /> : <AuthPage />} />
        <Route path="/notifications" element={user ? <NotificationsPage /> : <AuthPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <AuthPage />} />
        <Route path="/profile/:id" element={user ? <PublicProfilePage /> : <AuthPage />} />
      </Routes>
    </div>
  );
}

export default App
