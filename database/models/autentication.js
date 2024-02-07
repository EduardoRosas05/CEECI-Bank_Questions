import db from "./index";

export const checkUserEmailPassword = async (_email, password) => {
  const user = await db.User.findOne({ where: { email: _email } });

  if (!user) {
    return null;
  }

  if (!user.isValidPassword(password)) {
    return null;
  }

  const { id, name, email, rol, } = user;
  console.log(user);
  return {
    id,
    name,
    email,
    rol,
  };
};
