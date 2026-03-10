import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadBox from "./components/UploadBox";
import FolderTree from "./components/FolderTree";
import CodeViewer from "./components/CodeViewer";
import MyLearnings from "./components/MyLearnings";
import CodeLensLogo from "./components/CodeLensLogo";
import IntroOverlay from "./components/IntroOverlay";

import "./styles/theme.css";

export default function App() {

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("FILES");
  const [tree, setTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [showIntro, setShowIntro] = useState(
    !sessionStorage.getItem("introPlayed")
  );

  const [showIntroLogo, setShowIntroLogo] = useState(showIntro);

  const introLogoRef = useRef(null);
  const headerLogoRef = useRef(null);

  /* ---------------- DEMO AUTH ---------------- */

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

  /* ---------------- INTRO ANIMATION ---------------- */

  useLayoutEffect(() => {

    if (!showIntro) return;

    const logo = introLogoRef.current;
    const header = headerLogoRef.current;

    if (!logo || !header) return;

    const startX = window.innerWidth / 2 - 80;
    const startY = window.innerHeight / 2 - 80;

    const target = header.getBoundingClientRect();

    logo.style.left = `${startX}px`;
    logo.style.top = `${startY}px`;

    requestAnimationFrame(() => {

      logo.style.transform = `
        translate(${target.left - startX}px, ${target.top - startY}px)
        scale(0.35)
      `;

      logo.style.opacity = "1";

    });

    setTimeout(() => {

      setShowIntroLogo(false);
      setShowIntro(false);

      sessionStorage.setItem("introPlayed", "true");

    }, 1800);

  }, [showIntro]);

  /* ---------------- FILE CLICK ---------------- */

  const handleFileClick = (filePath) => {

    setSelectedFile(filePath);

    const demoCode = `function greet(name) {
  return "Hello " + name;
}

const message = greet("Developer");
console.log(message);`;

    setCode(demoCode);
    setExplanation("");
  };

  /* ---------------- AI EXPLAIN (MOCK) ---------------- */

  const handleExplain = () => {

    if (!code) return;

    setExplaining(true);
    setExplanation("");

    setTimeout(() => {

      const demoExplanation =
`This function demonstrates a basic JavaScript function.

1. The function "greet" receives a parameter called name.

2. It returns a string greeting the user.

3. The function is executed and printed using console.log.

This example demonstrates how functions accept parameters and return values in JavaScript.`;

      setExplanation(demoExplanation);
      setExplaining(false);

    }, 900);
  };

  /* ---------------- PROJECT NAME ---------------- */

  const getProjectName = () => {
    if (!tree || tree.length === 0) return "Untitled Project";
    return tree[0].name;
  };

  /* ---------------- UI ---------------- */

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/*"
          element={
            <>

              <IntroOverlay show={showIntro} />

              {showIntroLogo && (
                <div
                  ref={introLogoRef}
                  style={{
                    position: "fixed",
                    width: 160,
                    height: 160,
                    zIndex: 9999,
                    transition:
                      "transform 1.8s cubic-bezier(.22,1,.36,1), opacity 0.3s ease",
                    pointerEvents: "none",
                    opacity: 1
                  }}
                >
                  <CodeLensLogo size={160} />
                </div>
              )}

              <div
                className={darkMode ? "app dark" : "app"}
                style={{ display: "flex", height: "100vh" }}
              >

                {/* SIDEBAR */}

                <aside
                  style={{
                    width: 240,
                    padding: 16,
                    borderRight: "1px solid #e5e7eb",
                    background:"#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    gap: 15
                  }}
                >

                  <h3>Workspace</h3>

                  <button
                    onClick={() => setActiveTab("FILES")}
                    style={sidebarBtn(activeTab === "FILES")}
                  >
                    Files
                  </button>

                  <button
                    onClick={() => setActiveTab("LEARNINGS")}
                    style={sidebarBtn(activeTab === "LEARNINGS")}
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
                    Toggle Theme
                  </button>

                  <div style={{ marginTop: "auto" }}>

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

                <main style={{ flex: 1 }}>

                  <header
                    style={{
                      height: 64,
                      padding: "0 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderBottom: "1px solid #e5e7eb",
                      background: "#fff"
                    }}
                  >

                    <div ref={headerLogoRef}>
                      <CodeLensLogo size={28} />
                    </div>

                    <div>
                      <strong>CodeLens</strong>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        Understand any codebase with AI
                      </div>
                    </div>

                  </header>

                  <section
                    style={{
                      height: "calc(100vh - 64px)",
                      display: "flex",
                      gap: 24,
                      padding: 24
                    }}
                  >

                    <div style={{ flex: tree ? 2 : 1 }}>

                      {activeTab === "FILES" && (
                        <>
                          {!tree && <UploadBox onResult={setTree} />}

                          {tree && (
                            <div className="upload-card">

                              <h2>{getProjectName()}</h2>

                              <FolderTree
                                tree={tree}
                                onFileClick={handleFileClick}
                              />

                            </div>
                          )}
                        </>
                      )}

                      {activeTab === "LEARNINGS" && <MyLearnings />}

                    </div>

                    {activeTab === "FILES" && selectedFile && (
                      <div style={{ width: 500 }}>

                        <CodeViewer
                          file={selectedFile}
                          code={code}
                          explanation={explanation}
                          explaining={explaining}
                          onExplain={handleExplain}
                        />

                      </div>
                    )}

                  </section>

                </main>

              </div>

            </>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

const sidebarBtn = (active) => ({
  padding: "12px 14px",
  borderRadius: 10,
  border: active ? "1px solid #2563eb" : "1px solid #e5e7eb",
  background: active ? "#2563eb" : "#ffffff",
  color: active ? "#ffffff" : "#0f172a",
  cursor: "pointer"
});