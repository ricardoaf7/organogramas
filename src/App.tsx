import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Editor } from "@/pages/Editor";
import Login from "@/pages/Login";
import { supabaseEnabled, supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(!supabaseEnabled);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!supabaseEnabled || !supabase) {
        setReady(true);
        setIsAuthed(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      setIsAuthed(!!data.session?.user);
      setReady(true);
    };
    init();
  }, []);

  if (!ready) return null;
  if (supabaseEnabled && !isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequireAuth><Editor /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
