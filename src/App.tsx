import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";
import { FormDataProvider } from "./contexts/FormDataContext";

function App() {
  return (
    <AuthProvider>
      <FormDataProvider>
        <AppRouter />
      </FormDataProvider>
    </AuthProvider>
  );
}

export default App;
