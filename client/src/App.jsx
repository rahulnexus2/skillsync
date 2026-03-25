import { RouteConfig } from "./routes/RouteConfig";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "sonner";
import { useTheme } from "./context/ThemeContext";

function AppToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme === "dark" ? "dark" : "light"}
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans shadow-lg border border-border",
        },
      }}
    />
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RouteConfig />
        <AppToaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
