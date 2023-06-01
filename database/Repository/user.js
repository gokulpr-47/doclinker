import userModel from "../models/user.js";

class UserRepository {
  async CreateUser({ username, email, password }) {
    try {
      const user = new userModel({ username, email, password });
      await user.save();
      return { success: true, data: user };
    } catch (e) {
      console.log("Error at user repository", e);
      if (e.code)
        return { success: false, message: "email/username already in use" };
      return { success: false, message: "server-error" };
    }
  }
}

export { UserRepository };
