const PODCASTS = [
  {
    id: 1,
    name: "Fast & Curious",
    duration: "55 min",
    image: "https://i.scdn.co/image/ab6765630000ba8a3b5c9f8c3e8e8e8e8e8e8e8e",
    url: "https://open.spotify.com/show/fast-curious",
  },
  {
    id: 2,
    name: "Große Töchter",
    duration: "75 min",
    image: "https://i.scdn.co/image/ab6765630000ba8a9f8c3e8e8e8e8e8e8e8e8e8e",
    url: "https://open.spotify.com/show/grosse-toechter",
  },
  {
    id: 3,
    name: "Feminismus für alle. Der Lila Podcast",
    duration: "72 min",
    image: "https://i.scdn.co/image/ab6765630000ba8a8e8e8e8e8e8e8e8e8e8e8e8e",
    url: "https://open.spotify.com/show/lila-podcast",
  },
  {
    id: 4,
    name: "Feministisch Erklären",
    duration: "45 min",
    image: "",
    url: "https://open.spotify.com/show/feministisch-erklaeren",
  },
  {
    id: 5,
    name: "Queer durchs Leben",
    duration: "60 min",
    image: "",
    url: "https://open.spotify.com/show/queer-durchs-leben",
  },
  {
    id: 6,
    name: "EMMA Podcast",
    duration: "38 min",
    image: "",
    url: "https://www.emma.de/podcast",
  },
];

const PodcastPlaceholder = ({ name }: { name: string }) => (
  <div className="w-16 h-16 flex-shrink-0 bg-secondary flex items-center justify-center rounded-sm">
    <span className="text-[0.5rem] font-bold text-muted-foreground text-center leading-tight px-1">
      {name.slice(0, 2).toUpperCase()}
    </span>
  </div>
);

const PodcastSidebar = () => (
  <aside>
    <h2 className="text-[0.6rem] font-bold font-sans tracking-[0.15em] uppercase text-foreground border-b border-border pb-2 mb-4">
      Podcasts
    </h2>
    <div className="space-y-4">
      {PODCASTS.map((podcast) => (
        <a
          key={podcast.id}
          href={podcast.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 group"
        >
          {podcast.image ? (
            <img
              src={podcast.image}
              alt={podcast.name}
              className="w-16 h-16 object-cover flex-shrink-0 rounded-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div className={podcast.image ? "hidden" : ""}>
            <PodcastPlaceholder name={podcast.name} />
          </div>
          <div className="min-w-0">
            <p className="text-[0.55rem] font-semibold text-primary tracking-widest uppercase flex items-center gap-1 mb-0.5">
              🎙 PODCAST
            </p>
            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {podcast.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{podcast.duration}</p>
          </div>
        </a>
      ))}
    </div>
  </aside>
);

export default PodcastSidebar;
