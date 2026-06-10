import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from "./pages/LandingPage";
import BikeExpand from "./components/layout/bikes/BikeExpand";
import Cart from "./pages/Cart";
import Practice from "./components/practice";
import Reserve from "./pages/Reserve";
import Checkout from "./pages/Checkout";
import EBankPayment from "./components/payment/EBankPayment";
import Transactions from "./pages/Transactions";
import PastTransactions from "./pages/PastTransactions";

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  const navigate = useNavigate();

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from("profiles_mod")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Role fetch error:", error);
      return "customer"; // fallback role
    }

    return data?.role || "customer";
  };

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Initial Session:", session);

        setSession(session);

        // IMPORTANT: do NOT block loading for role
        if (session?.user?.id) {
          fetchUserRole(session.user.id)
            .then((userRole) => {
              console.log("Fetched role:", userRole);
              setRole(userRole);
            })
            .catch((err) => {
              console.error(err);
              setRole("customer");
            });
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false); // ALWAYS STOP LOADING HERE
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      console.log("Session:", session);

      setSession(session);

      if (session?.user?.id) {
        fetchUserRole(session.user.id)
          .then(setRole)
          .catch(() => setRole("customer"));
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // ONLY block initial load
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Routes>
      <Route path="/prac" element={<Practice />} />

      {/* PASSWORD RECOVERY */}
      {isRecovery && (
        <>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/reset-password" />} />
        </>
      )}

      {/* GUEST */}
      {!session && !isRecovery && (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}

      {/* CUSTOMER */}
      {session && role === "customer" && (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/rent" element={<BikeExpand />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ebank" element={<EBankPayment />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/past-transactions" element={<PastTransactions />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}

      {/* CASHIER */}
      {session && role === "cashier" && (
        <>
          <Route path="/" element={<PastTransactions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}

      {/* ADMIN */}
      {session && role === "admin" && (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/past-transactions" element={<PastTransactions />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}

      {/* SAFETY NET */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;