import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import Welcome from "./pages/Welcome";

function App() {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050507] text-white">
      <AnimatePresence mode="wait">
        {!isLogged ? (
          <motion.div
            key="welcome"
            className="h-full w-full"
            initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <Welcome onLogin={() => setIsLogged(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            className="h-full w-full"
            initial={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            <Home />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;