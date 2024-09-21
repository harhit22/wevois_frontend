import URLs from "../constant/url";
export const handleChange = (e, setEmail, setPassword) => {
  const { name, value } = e.target;
  switch (name) {
    case "email":
      setEmail(value);
      break;
    case "password":
      setPassword(value);
      break;
    default:
      break;
  }
};

export const handleSubmit = async (
  e,
  email,
  password,
  navigate,
  setEmail,
  setPassword
) => {
  e.preventDefault();
  const formData = { email, password };
  try {
    const response = await fetch(`${URLs.ACCOUNT_URL}api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      // Save data to local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("email", data.email);
      navigate("/");
    } else {
      console.error("Login error:", data);
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred. Please try again later.");
  }
  setEmail("");
};
