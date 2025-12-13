import { Router } from "express";
import passport from "./passport";

const router = Router();

// 현재 로그인 사용자 정보
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다" });
  }
});

// 로그아웃
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "로그아웃 실패" });
    }
    res.json({ message: "로그아웃 성공" });
  });
});

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=google_failed",
  }),
  (req, res) => {
    res.redirect("/mypage");
  }
);

// Kakao OAuth
router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/login?error=kakao_failed",
  }),
  (req, res) => {
    res.redirect("/mypage");
  }
);

// Naver OAuth
router.get(
  "/naver",
  passport.authenticate("naver", { authType: "reprompt" })
);

router.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/login?error=naver_failed",
  }),
  (req, res) => {
    res.redirect("/mypage");
  }
);

export default router;
