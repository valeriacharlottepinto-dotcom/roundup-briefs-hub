interface ImprintPageProps {
  onClose: () => void;
}

const ImprintPage = ({ onClose }: ImprintPageProps) => {
  return (
    <main className="max-w-[700px] mx-auto px-4 py-8 font-sans">

      <button
        onClick={onClose}
        className="text-xs text-primary hover:underline mb-6 inline-block"
      >
        ← back
      </button>

      <h1 className="text-lg font-semibold text-foreground mb-6">Impressum</h1>

      <p className="text-[0.85rem] text-muted-foreground mb-4">
        Angaben gemäß § 5 TMG
      </p>

      <p className="text-[0.9rem] text-foreground leading-relaxed mb-6">
        Valeria Pinto<br />
        F4<br />
        68159 Mannheim<br />
        Deutschland
      </p>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        Kontakt
      </p>
      <p className="text-[0.9rem] text-foreground mb-6">
        E-Mail:{" "}
        <a href="mailto:sharedgroundnews@gmail.com" className="underline underline-offset-2">
          sharedgroundnews@gmail.com
        </a>
      </p>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
      </p>
      <p className="text-[0.9rem] text-foreground leading-relaxed mb-6">
        Valeria Pinto<br />
        F4, 68159 Mannheim
      </p>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        Haftungsausschluss
      </p>
      <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
        shared ground aggregiert Artikel aus externen RSS-Feeds und ist nicht
        verantwortlich für den Inhalt verlinkter Seiten. Für die Inhalte
        externer Seiten sind ausschließlich deren Betreiber verantwortlich.
      </p>

    </main>
  );
};

export default ImprintPage;
