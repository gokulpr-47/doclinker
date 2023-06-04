import { Router } from "express";
const router = Router();

import { UserService } from "../../services/user.js";

import UserRepository from "../../database/Repository/user.js";

import auth from "../MIddlewares/auth.js";

const userRepo = new UserRepository();
const userservice = new UserService(userRepo);

router.post("/signup", async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    const { username, email, password } = req.body;
    const data = await userservice.SignUp({ username, email, password });
    console.log("DATA: ", data);
    if (data.success) {
      res.cookie("rt", data.tokens.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json(data);
    }
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error while handling signup request:", e);
    return res.status(500).json({ success: false, message: "server-error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const data = await userservice.SignIn({ email, password });
    if (data.success) {
      res.cookie("rt", data.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      delete data.refreshToken;
      delete data.user.password;
      return res.status(200).json(data);
    }
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error while handlinng signin request", e);
    return res
      .status(500)
      .json({ success: false, message: "server-error", error: e });
  }
});

router.get("/refresh-token/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const data = await userservice.GetRefreshToken(uid);
    if (data.success) return res.status(200).json(data);
    return res.status(404).json(data);
  } catch (e) {
    console.log("Error while handling get refresh-token request", e);
    return res.status(500).json({ success: false, message: e });
  }
});

router.post("/logout/:uid", async (req, res) => {
  try {
    // const { refreshToken, accessToken } = req.body;
    const cookies = req.cookies;
    if (!cookies?.rt) return res.sendStatus(403);
    const refreshToken = cookies.rt;
    const { uid } = req.params;
    const data = await userservice.HandleUserLogout(uid, refreshToken);
    console.log("exit routes");
    res.clearCookie("rt");
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error while handling logout request", e);
    return res.status(500).json({ success: false, message: e });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    // const {refreshToken} = req.body;
    const cookies = req.cookies;
    if (!cookies?.rt) return res.sendStatus(403);
    const refreshToken = cookies.rt;
    const data = await userservice.RefreshAccessToken(refreshToken);
    // console.log("\n\n\n", data, "\n\n\n")
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error while handling refresh access token handler", e);
    return res.status(202).json({ message: "error", e });
  }
});

router.get("/clear-cookies", async (req, res) => {
  res.clearCookie("rt");
  res.status(200).json({ message: "good" });
});

router.get("/protected", auth, async (req, res) => {
  res.status(200).json({ message: "secret message" });
});

router.delete("/delete/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const data = await userservice.DeleteUser({ uid });
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error while handling deleteuser", e);
    return res.status(401).json({ success: false, error: e });
  }
});

export default router;
