import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadBox from "./components/UploadBox";
import MyLearnings from "./components/MyLearnings";
import CodeLensLogo from "./components/CodeLensLogo";

export default function App() {

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("FILES");
  const [tree, setTree] = useState(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("codelens_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("codelens_user");
      }
    }
  }, []);

  const handleDemoLogin = () => {
    const demoUser = {
      id: "demo-user",
      name: "Guest User",
      email: "guest@codelens.dev"
    };

    localStorage.setItem("codelens_user", JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("codelens_user");
    setUser(null);
  };

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/*"
          element={

            <div className={darkMode ? "app dark" : "app"}>

              {/* SIDEBAR */}

              <aside className="sidebar">

                <h3>Workspace</h3>

                <button
                  onClick={() => setActiveTab("FILES")}
                  className={activeTab === "FILES" ? "activeBtn" : ""}
                >
                  Files
                </button>

                <button
                  onClick={() => setActiveTab("LEARNINGS")}
                  className={activeTab === "LEARNINGS" ? "activeBtn" : ""}
                >
                  My Learnings
                </button>

                <button
                  onClick={() => {
                    setDarkMode((prev) => {
                      localStorage.setItem("darkMode", !prev);
                      return !prev;
                    });
                  }}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>

                <div className="bottomUser">

                  {!user ? (

                    <button onClick={handleDemoLogin}>
                      Continue as Guest
                    </button>

                  ) : (

                    <div>
                      <p>{user.name}</p>
                      <button onClick={handleLogout}>Logout</button>
                    </div>

                  )}

                </div>

              </aside>

              {/* MAIN */}

              <main className="mainArea">

                <header className="header">

                  <CodeLensLogo size={28} />

                  <div>
                    <strong>CodeLens</strong>
                    <div className="subtitle">
                      Understand any codebase with AI
                    </div>
                  </div>

                </header>

                <section className="content">

                  {activeTab === "FILES" && (
                    <>
                      {!tree && <UploadBox onResult={setTree} />}

                      {tree && (
                        <div>
                          <h2>Project Loaded</h2>
                          <p>Your files were uploaded successfully.</p>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "LEARNINGS" && <MyLearnings />}

                </section>

              </main>

            </div>

          }
        />

      </Routes>

    </BrowserRouter>

  );
}