import {
  createContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";

// ─── Context shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /**
   * Call requireAuth(callback) anywhere in the app.
   * - If the user is already signed in, callback runs immediately.
   * - If not, the AuthModal opens and callback runs after successful sign-in.
   */
  requireAuth: (onSuccess: () => void) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  requireAuth: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Stores a callback to run after the user successfully signs in
  const pendingAction = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Restore existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // After a successful sign-in, run the queued action and close the modal
      if (session && pendingAction.current) {
        pendingAction.current();
        pendingAction.current = null;
        setModalOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const requireAuth = (onSuccess: () => void) => {
    if (user) {
      onSuccess();
    } else {
      pendingAction.current = onSuccess;
      setModalOpen(true);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, requireAuth }}>
      {children}
      <AuthModal open={modalOpen} onOpenChange={setModalOpen} />
    </AuthContext.Provider>
  );
}
