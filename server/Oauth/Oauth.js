import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import OAuthUser from "../models/OAuthUser.js";
import config from "../config/config.js";

export const Oauth = () => {
  passport.use(new GoogleStrategy({
    clientID: config.Google_Client_Id,
    clientSecret: config.Google_Client_Secret,
    callbackURL: "http://localhost:8000/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await OAuthUser.findOne({ googleId: profile.id });

      if (!user) {
        user = await OAuthUser.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await OAuthUser.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
