const User = require("../models/User");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/token");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // set true in HTTPS production
};

exports.register = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: "name, username, password required" });
    }

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Username already exists" });

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      password,
      role: role || "cashier",
    });

    return res.status(201).json({
      message: "User created",
      user: { id: user._id, name: user.name, username: user.username, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "username and password required" });

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !user.isActive)
      return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    // also set cookie (optional)
    res.cookie("sellio_refresh", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login success",
      accessToken,
      refreshToken, // we also return it (simpler for now)
      user: { id: user._id, name: user.name, username: user.username, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    // take refresh from body or cookie
    const fromBody = req.body?.refreshToken;
    const fromCookie = req.cookies?.sellio_refresh;
    const token = fromBody || fromCookie;

    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ message: "Unauthorized" });

    // check stored refresh (basic safety)
    if (user.refreshToken !== token)
      return res.status(401).json({ message: "Refresh token mismatch" });

    const newAccessToken = signAccessToken({ id: user._id, role: user.role });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("sellio_refresh", cookieOptions);
    return res.json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
