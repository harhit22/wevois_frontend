const handleChange = (e, setUsername, setEmail, setPassword1, setPassword2) => {
  const { name, value } = e.target;
  switch (name) {
    case "username":
      setUsername(value);
      break;
    case "email":
      setEmail(value);
      break;
    case "password1":
      setPassword1(value);
      break;
    case "password2":
      setPassword2(value);
      break;
    default:
      break;
  }
};

export default handleChange;
