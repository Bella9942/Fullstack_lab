import { useState } from "react";
    
function Login({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
        const response = await fetch("http://localhost:5000/api/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }),
            });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

  return (
    <div className="app">
      <h2>Login / Signup</h2>

      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default Login;