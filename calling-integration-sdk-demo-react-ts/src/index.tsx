import { createRoot } from "react-dom/client";
import App from "./components/App";
import ReactQueryProvider from "./components/react-query-provider";
import "./index.css";

const rootNode = document.getElementById("app");
if (!rootNode) {
  throw new Error("The element #app wasn't found");
}
const root = createRoot(rootNode);
root.render(
  <ReactQueryProvider>
    <App />
  </ReactQueryProvider>
);
