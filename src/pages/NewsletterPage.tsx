import { useState } from "react";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "loading" | "success" | "error" | "duplicate";

const NewsletterPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim(), locale: "de" });

      if (!error) {
        setStatus("success");
      } else if (error.code === "23505") {
        // unique_violation — already subscribed
        setStatus("duplicate");
      } else {
        setErrorMsg(error.message || "Unbekannter Fehler.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Keine Verbindung. Bitte versuch es später.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Masthead />

      <main className="max-w-[600px] mx-auto px-4 py-16 font-sans">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-8">
          Newsletter
        </h2>

        {status === "success" ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">{"✉️"}</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Danke!
            </h3>
            <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
              dabei. der wöchentliche überblick kommt.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[1.05rem] text-foreground leading-relaxed mb-2">
              das Wichtigste der Woche. nach Thema kuratiert, einmal geliefert.
            </p>
            <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-10">
              raus aus dem Rauschen — die wesentlichen Geschichten der Woche,
              kuratiert nach Themen, einmal pro Woche. kein Spam. kein Clickbait.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[420px]">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">
                Deine E-Mail-Adresse
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                disabled={status === "loading"}
                className="w-full border border-border rounded-sm px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors font-sans disabled:opacity-50"
              />

              {status === "duplicate" && (
                <p className="text-xs text-amber-600">
                  Diese E-Mail ist bereits angemeldet.
                </p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-foreground text-background px-4 py-3 text-sm font-semibold rounded-sm hover:opacity-80 transition-opacity font-sans disabled:opacity-50"
              >
                {status === "loading" ? "Wird angemeldet..." : "Anmelden"}
              </button>
            </form>

            <p className="mt-8 text-xs text-muted-foreground">
              Du kannst dich jederzeit wieder abmelden. Deine Daten werden
              nicht an Dritte weitergegeben.
            </p>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default NewsletterPage;
