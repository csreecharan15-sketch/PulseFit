import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowLeft,
  Heart,
  Copy,
  Check,
  Plus,
  Flame,
  Maximize2,
  X,
  Image as ImageIcon,
  Upload,
  Trash2,
  Camera,
} from 'lucide-react';
import { MotivationalPost } from '../types';

interface PostsScreenProps {
  posts: MotivationalPost[];
  onBack: () => void;
  onLikePost: (postId: string) => void;
  onAddPost: (post: Omit<MotivationalPost, 'id' | 'likesCount' | 'isLiked' | 'timeAgo'>) => void;
}

const PRESET_POSTERS = [
  { url: '/assets/aistudio/48687_b919e13e.jpg', label: 'Break Limits (Broly)' },
  { url: '/assets/aistudio/48682_73638201.jpg', label: 'Sweat Today' },
  { url: '/assets/aistudio/48681_02625c19.jpg', label: 'Inner Titan' },
  { url: '/assets/aistudio/48684_1ede427b.jpg', label: 'Focus & Fire' },
  { url: '/assets/aistudio/48683_0dda7d1d.jpg', label: 'Discipline' },
];

export const PostsScreen: React.FC<PostsScreenProps> = ({
  posts,
  onBack,
  onLikePost,
  onAddPost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<MotivationalPost | null>(null);

  // Form states for user's own post
  const [title, setTitle] = useState('');
  const [slogan, setSlogan] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MotivationalPost['category']>('Motivational Posters');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    'All',
    'Motivational Posters',
    'Daily Slogans',
    'Fitness Habits',
    'Indian Nutrition',
    'Yoga & Mind',
  ];

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const handleCopySlogan = (id: string, text: string) => {
    navigator.clipboard.writeText(`"${text}" — PulseMind India`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Please choose an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setCategory('Motivational Posters');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slogan.trim()) return;

    onAddPost({
      author: 'You (PulseMind Champion)',
      authorRole: 'Active Fitness Member',
      avatarBg: 'bg-emerald-600',
      title: title.trim(),
      slogan: slogan.trim(),
      content: content.trim() || slogan.trim(),
      category: imagePreview ? 'Motivational Posters' : category,
      imageUrl: imagePreview || undefined,
      imageAlt: title.trim(),
      gradient: 'from-teal-600 via-emerald-600 to-cyan-700',
    });

    setTitle('');
    setSlogan('');
    setContent('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowCreateModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="p-4 sm:p-5 flex flex-col gap-4 text-slate-800 dark:text-slate-100"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Return to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              Motivational Feed
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Daily slogans, posters & fitness thoughts
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Thought</span>
        </button>
      </div>

      {/* Featured Daily Slogan Banner with tailored Dark Mode Gradient */}
      <div className="p-4 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-600 dark:from-amber-950 dark:via-orange-950 dark:to-slate-950 dark:border dark:border-amber-500/30 text-white shadow-md flex flex-col gap-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            Today's Indian Fitness Mantra
          </span>
          <span className="text-[10px] bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-semibold">
            Health Is Wealth
          </span>
        </div>

        <blockquote className="text-base font-extrabold text-white leading-snug z-10 mt-1">
          "Swasth Raho, Mast Raho! Every step in the morning breeze is a blessing for your heart."
        </blockquote>

        <p className="text-xs text-amber-100/90 dark:text-amber-200/90 z-10 leading-normal">
          Keep your PulseBack Clip active, drink clean water, and stay consistent.
        </p>
      </div>

      {/* Category Pills / Filter bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts List / News Feed */}
      <div className="flex flex-col gap-3.5">
        {filteredPosts.map((post) => {
          const isCopied = copiedId === post.id;
          return (
            <article
              key={post.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Motivational Poster Image if present */}
              {post.imageUrl ? (
                <div
                  onClick={() => setSelectedPoster(post)}
                  className="relative w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
                >
                  {/* Subtle blurred ambient backdrop to give atmospheric glow */}
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                  />
                  {/* Poster Image: object-contain with high max-height ensures NO CROPPING of top/bottom slogans and characters */}
                  <div className="relative z-10 w-full flex items-center justify-center p-1 sm:p-2">
                    <img
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      className="w-full max-h-[420px] sm:max-h-[460px] object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white/95 border border-white/10">
                      {post.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-white flex items-center gap-1.5 font-semibold opacity-90 group-hover:opacity-100 transition-opacity border border-white/15">
                    <Maximize2 className="w-3 h-3 text-amber-300" />
                    <span>View Full Poster</span>
                  </div>
                </div>
              ) : (
                /* Top Graphic Poster Banner with Slogan for text-only posts */
                <div
                  className={`p-4 bg-gradient-to-tr ${post.gradient} text-white flex flex-col gap-2 relative`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-md text-white/90">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-white/80">{post.timeAgo}</span>
                  </div>

                  <div className="py-2">
                    <h3 className="text-lg font-black tracking-tight text-white leading-snug drop-shadow-xs">
                      "{post.slogan}"
                    </h3>
                  </div>
                </div>
              )}

              {/* Post Body and Author Info */}
              <div className="p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full ${post.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-2xs`}
                    >
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {post.author}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {post.authorRole}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{post.timeAgo}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {post.content}
                </p>

                {/* Bottom Interactive Bar (Like & Copy Slogan) */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      post.isLiked
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                      }`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => handleCopySlogan(post.id, post.slogan)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Slogan Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Share Slogan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Create New Motivational Post Modal with Photo Attachment */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Post a Motivational Thought or Poster
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="mt-4 flex flex-col gap-3">
                {/* Photo Attachment Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Attach Poster or Workout Photo
                    </span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </label>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative w-full rounded-2xl bg-black border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col items-center justify-center p-2 group">
                      <img
                        src={imagePreview}
                        alt="Post Preview"
                        className="w-full max-h-48 object-contain rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-md"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="mt-1 text-[10px] text-slate-300 text-center">
                        Photo attached · Will display with full aspect ratio in feed
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold">Upload Photo from Device</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 8MB</span>
                      </button>

                      {/* Quick Anime / Indian Fitness Poster Presets */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          Or select an anime motivation poster:
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                          {PRESET_POSTERS.map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() => {
                                setImagePreview(preset.url);
                                setCategory('Motivational Posters');
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                            >
                              + {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Post Heading
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Morning Motivation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Short Fitness Slogan / Quote
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10,000 steps today keeps fatigue away!"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Motivational Posters">Motivational Posters</option>
                    <option value="Daily Slogans">Daily Slogans</option>
                    <option value="Fitness Habits">Fitness Habits</option>
                    <option value="Indian Nutrition">Indian Nutrition</option>
                    <option value="Yoga & Mind">Yoga & Mind</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Description / Personal Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share a quick tip with fellow PulseMind members..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Slogan & Photo to Feed</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-Screen High-Res Poster Lightbox Modal */}
      <AnimatePresence>
        {selectedPoster && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative max-w-lg w-full max-h-[92vh] flex flex-col items-center justify-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPoster(null)}
                className="absolute -top-12 right-0 sm:-right-2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition-colors cursor-pointer z-30"
                title="Close Poster"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Poster Image with complete framing so entire poster is seen */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center border border-white/10 shadow-2xl">
                <img
                  src={selectedPoster.imageUrl}
                  alt={selectedPoster.imageAlt || selectedPoster.title}
                  className="w-full max-h-[76vh] object-contain rounded-xl"
                />

                <div className="w-full p-3.5 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent flex flex-col gap-1 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300">
                      "{selectedPoster.slogan}"
                    </span>
                    <button
                      onClick={() => handleCopySlogan(selectedPoster.id, selectedPoster.slogan)}
                      className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[10px] text-white flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === selectedPoster.id ? 'Copied!' : 'Copy Slogan'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {selectedPoster.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
