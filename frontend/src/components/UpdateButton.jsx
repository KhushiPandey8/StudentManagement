// src/components/UpdateButton.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function UpdateButton() {
  const location = useLocation(); // <-- now inside Router context

  useEffect(() => {
    if (location.pathname !== "/login") return; // show only on login page

    let deferredPrompt;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;

      const installButton = document.getElementById("installBtn");
      if (installButton) {
        installButton.style.display = "block";

        installButton.addEventListener("click", () => {
          installButton.style.display = "none";
          deferredPrompt.prompt();

          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the install prompt");
            } else {
              console.log("User dismissed the install prompt");
            }
            deferredPrompt = null;
          });
        });
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then((registration) => {
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateButton(newWorker);
            }
          });
        };
      });
    }

    const showUpdateButton = (worker) => {
      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update Available – Tap to Refresh";
      updateBtn.style.position = "fixed";
      updateBtn.style.bottom = "80px";
      updateBtn.style.right = "20px";
      updateBtn.style.padding = "10px 20px";
      updateBtn.style.borderRadius = "8px";
      updateBtn.style.backgroundColor = "#28a745";
      updateBtn.style.color = "white";
      updateBtn.style.border = "none";
      updateBtn.style.cursor = "pointer";
      updateBtn.style.zIndex = 1000;

      updateBtn.onclick = () => {
        worker.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      };

      document.body.appendChild(updateBtn);
    };

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [location.pathname]); // rerun when path changes

  return (
    <button
      id="installBtn"
      style={{
        display: "none",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 20px",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      Install App
    </button>
  );
}

export default UpdateButton;
