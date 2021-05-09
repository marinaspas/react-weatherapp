import "./App.css";

const api = {
  key: "7730fd97a052c6c91d93f7d161a8c07e",
  base: "https://api.openweathermap.org/data/2.5",
};
function App() {
  return (
    <div className="app">
      <main>
        <div className="search-box">
          <input type="text" className="search-bar" placeholder="Search ..." />
        </div>
      </main>
    </div>
  );
}

export default App;
