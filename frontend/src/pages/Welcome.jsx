import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import WelcomeScreen from "../components/auth/WelcomeScreen";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { useAvatares } from "../hooks/useAvatares";
import { useUsuario } from "../hooks/useUsuario";


const pageAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};



export default function Welcome({ onLogin }) {
    const [view, setView] = useState("welcome");
    const { avatares: avataresObtenidos } = useAvatares();

    const { guardarUsuario } = useUsuario();

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07050a] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_50%)]" />

            <div className="relative z-10 flex w-full justify-center px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        variants={pageAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                            duration: 0.45,
                            ease: "easeInOut",
                        }}
                        className="flex w-full justify-center"
                    >
                        {view === "welcome" && (
                            <WelcomeScreen onStart={() => setView("login")} />
                        )}

                        {view === "login" && (
                            <LoginForm
                                onBack={() => setView("welcome")}
                                onLogin={onLogin}
                                onGoRegister={() => setView("register")}
                            />
                        )}

                        {view === "register" && (
                            <RegisterForm
                                onBack={() => setView("welcome")}
                                onRegister={onLogin}
                                avataresObtenidos={avataresObtenidos}
                                onGuardarUser={guardarUsuario}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <p className="absolute bottom-6 text-sm text-white/60">
                Desarrollador Brandon
            </p>
        </main>
    );
}