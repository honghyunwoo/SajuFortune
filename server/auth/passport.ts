import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as NaverStrategy } from "passport-naver-v2";
import { db } from "../db";
import { users, socialAccounts } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

interface SocialProfile {
  provider: string;
  providerId: string;
  email: string;
  displayName: string;
  profileImage?: string;
}

// 공통: 소셜 로그인 사용자 찾기 또는 생성
async function findOrCreateUser(profile: SocialProfile) {
  // 1. 기존 소셜 계정 확인
  const existingSocialAccount = await db
    .select()
    .from(socialAccounts)
    .where(
      and(
        eq(socialAccounts.provider, profile.provider),
        eq(socialAccounts.providerId, profile.providerId)
      )
    )
    .limit(1);

  if (existingSocialAccount.length > 0) {
    // 기존 사용자 반환
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, existingSocialAccount[0].userId))
      .limit(1);
    return user[0];
  }

  // 2. 이메일로 기존 사용자 확인
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, profile.email))
    .limit(1);

  let userId: string;

  if (existingUser.length > 0) {
    // 기존 사용자에 소셜 계정 연결
    userId = existingUser[0].id;

    // 프로필 이미지 업데이트 (없는 경우에만)
    if (!existingUser[0].profileImage && profile.profileImage) {
      await db
        .update(users)
        .set({ profileImage: profile.profileImage })
        .where(eq(users.id, userId));
    }
  } else {
    // 3. 새 사용자 생성
    const newUser = await db
      .insert(users)
      .values({
        username: profile.displayName || profile.email.split("@")[0],
        email: profile.email,
        profileImage: profile.profileImage,
        authProvider: profile.provider,
      })
      .returning();
    userId = newUser[0].id;
  }

  // 4. 소셜 계정 연결
  await db.insert(socialAccounts).values({
    userId,
    provider: profile.provider,
    providerId: profile.providerId,
  });

  // 5. 사용자 반환
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user[0];
}

// Passport 직렬화/역직렬화
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    done(null, user[0] || null);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const socialProfile: SocialProfile = {
            provider: "google",
            providerId: profile.id,
            email: profile.emails?.[0]?.value || "",
            displayName: profile.displayName,
            profileImage: profile.photos?.[0]?.value,
          };
          const user = await findOrCreateUser(socialProfile);
          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );
  console.log("✅ Google OAuth strategy initialized");
} else {
  console.log("⚠️ Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
}

// Kakao OAuth Strategy
if (process.env.KAKAO_CLIENT_ID) {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
        callbackURL: "/api/auth/kakao/callback",
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const kakaoAccount = profile._json?.kakao_account;
          const socialProfile: SocialProfile = {
            provider: "kakao",
            providerId: profile.id.toString(),
            email: kakaoAccount?.email || `kakao_${profile.id}@sajufortune.com`,
            displayName: profile.displayName || kakaoAccount?.profile?.nickname || "카카오 사용자",
            profileImage: kakaoAccount?.profile?.profile_image_url,
          };
          const user = await findOrCreateUser(socialProfile);
          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );
  console.log("✅ Kakao OAuth strategy initialized");
} else {
  console.log("⚠️ Kakao OAuth not configured (missing KAKAO_CLIENT_ID)");
}

// Naver OAuth Strategy
if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: "/api/auth/naver/callback",
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const socialProfile: SocialProfile = {
            provider: "naver",
            providerId: profile.id,
            email: profile.email || `naver_${profile.id}@sajufortune.com`,
            displayName: profile.displayName || profile.name || "네이버 사용자",
            profileImage: profile.profileImage,
          };
          const user = await findOrCreateUser(socialProfile);
          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );
  console.log("✅ Naver OAuth strategy initialized");
} else {
  console.log("⚠️ Naver OAuth not configured (missing NAVER_CLIENT_ID or NAVER_CLIENT_SECRET)");
}

export default passport;
