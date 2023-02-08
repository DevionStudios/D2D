"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const body_parser_1 = require("body-parser");
dotenv_1.default.config();
const signup_1 = require("./routes/auth/signup");
const signin_1 = require("./routes/auth/signin");
const signout_1 = require("./routes/auth/signout");
const current_user_1 = require("./routes/auth/current-user");
const update_profile_1 = require("./routes/auth/update-profile");
const follow_user_1 = require("./routes/follows/follow-user");
const update_post_1 = require("./routes/posts/update-post");
const create_post_1 = require("./routes/posts/create-post");
const get_user_posts_1 = require("./routes/posts/get-user-posts");
const delete_post_1 = require("./routes/posts/delete-post");
const get_user_feed_1 = require("./routes/posts/get-user-feed");
const fetch_user_1 = require("./routes/auth/fetch-user");
const update_password_1 = require("./routes/auth/update-password");
const get_all_posts_1 = require("./routes/posts/get-all-posts");
const get_post_by_id_1 = require("./routes/posts/get-post-by-id");
const get_trending_post_1 = require("./routes/posts/get-trending-post");
const like_post_1 = require("./routes/likes/like-post");
const create_comment_1 = require("./routes/comments/create-comment");
const update_comment_1 = require("./routes/comments/update-comment");
const delete_comment_1 = require("./routes/comments/delete-comment");
const import_user_tweets_1 = require("./routes/posts/import-user-tweets");
const generate_code_1 = require("./routes/verification/generate-code");
const verify_code_1 = require("./routes/verification/verify-code");
const get_twitter_trends_1 = require("./routes/posts/get-twitter-trends");
const search_post_1 = require("./routes/posts/search-post");
const get_search_user_1 = require("./routes/auth/get-search-user");
const active_user_1 = require("./routes/auth/active-user");
const claim_token_1 = require("./routes/reward/claim-token");
const check_claim_token_1 = require("./routes/reward/check-claim-token");
const update_profile_image_1 = require("./routes/auth/update-profile-image");
const request_airdrop_1 = require("./routes/airdrop/request-airdrop");
const reset_password_1 = require("./routes/auth/reset-password");
const signup_2 = require("./routes/admin/signup");
const signin_2 = require("./routes/admin/signin");
const delete_post_2 = require("./routes/admin/delete-post");
const current_admin_1 = require("./routes/admin/current-admin");
const reset_password_2 = require("./routes/admin/reset-password");
const report_post_1 = require("./routes/posts/report-post");
const report_user_1 = require("./routes/auth/report-user");
const ban_user_1 = require("./routes/admin/ban-user");
const get_all_users_1 = require("./routes/admin/get-all-users");
const get_all_comment_1 = require("./routes/comments/get-all-comment");
const delete_user_1 = require("./routes/admin/delete-user");
const add_notification_1 = require("./routes/notifications/add-notification");
const get_notification_1 = require("./routes/notifications/get-notification");
const delete_notification_1 = require("./routes/notifications/delete-notification");
const add_message_1 = require("./routes/message/add-message");
const repost_1 = require("./routes/reposts/repost");
const create_story_1 = require("./routes/story/create-story");
const get_stories_1 = require("./routes/story/get-stories");
const get_following_user_stories_1 = require("./routes/story/get-following-user-stories");
const get_all_message_1 = require("./routes/message/get-all-message");
const get_associated_users_1 = require("./routes/message/get-associated-users");
const notify_everyone_1 = require("./routes/admin/notify-everyone");
const get_preference_post_1 = require("./routes/posts/get-preference-post");
const add_preference_1 = require("./routes/preferences/add-preference");
const notify_user_1 = require("./routes/admin/notify-user");
const create_post_2 = require("./routes/admin/create-post");
const fetch_user_by_id_1 = require("./routes/auth/fetch-user-by-id");
const get_all_stories_1 = require("./routes/story/get-all-stories");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use((0, body_parser_1.json)());
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
}));
app.use((0, body_parser_1.urlencoded)({
    extended: true,
}));
app.use(active_user_1.activeUserRouter);
app.use(search_post_1.searchPostRouter);
app.use(get_search_user_1.searchUserRouter);
app.use(get_user_feed_1.getUserFeedRouter);
app.use(check_claim_token_1.checkClaimRouter);
app.use(claim_token_1.claimTokenRouter);
app.use(signup_1.signupRouter);
app.use(signin_1.signinRouter);
app.use(generate_code_1.generateCodeRouter);
app.use(verify_code_1.verifyCodeRouter);
app.use(update_profile_1.updateProfileRouter);
app.use(signout_1.signoutRouter);
app.use(add_preference_1.addPreferencesRouter);
app.use(get_preference_post_1.preferencePostRouter);
app.use(current_user_1.currentUserRouter);
app.use(fetch_user_1.fetchUserRouter);
app.use(follow_user_1.followUserRouter);
app.use(update_profile_image_1.updateProfileImageRouter);
app.use(reset_password_1.resetPasswordRouter);
app.use(update_password_1.updatePasswordRouter);
app.use(create_post_1.createPostRouter);
app.use(get_post_by_id_1.getPostRouter);
app.use(get_trending_post_1.getTrendingPostsRouter);
app.use(get_user_posts_1.getUserPostsRouter);
app.use(update_post_1.updatePostRouter);
app.use(delete_post_1.deletePostRouter);
app.use(like_post_1.LikePostRouter);
app.use(get_post_by_id_1.getPostRouter);
app.use(get_user_posts_1.getUserPostsRouter);
app.use(get_all_posts_1.getAllPostsRouter);
app.use(create_comment_1.createCommentRouter);
app.use(get_all_comment_1.getAllCommentRouter);
app.use(update_comment_1.updateCommentRouter);
app.use(delete_comment_1.deleteCommentRouter);
app.use(get_twitter_trends_1.getTrendingTweetsRouter);
app.use(import_user_tweets_1.importUserTweetsRouter);
app.use(request_airdrop_1.airdropRequestRouter);
app.use(signup_2.adminSignupRouter);
app.use(signin_2.adminSigninRouter);
app.use(current_admin_1.currentAdminRouter);
app.use(delete_post_2.deletePostAdminRouter);
app.use(reset_password_2.resetAdminPasswordRouter);
app.use(get_all_users_1.getAllUserRouter);
app.use(report_post_1.reportPostRouter);
app.use(report_user_1.reportUserRouter);
app.use(delete_user_1.deleteUserRouter);
app.use(ban_user_1.toggleBanRouter);
app.use(add_notification_1.createNotificationRouter);
app.use(add_message_1.addMessageRouter);
app.use(get_all_message_1.getMessageRouter);
app.use(get_associated_users_1.getAssociatedUsersRouter);
app.use(fetch_user_by_id_1.fetchUserByIdRouter);
app.use(get_notification_1.getNotificationRouter);
app.use(delete_notification_1.deleteNotificationRouter);
app.use(repost_1.repostRouter);
app.use(get_stories_1.getUserStoriesRouter);
app.use(get_all_stories_1.getAllStoriesRouter);
app.use(create_story_1.createStoryRouter);
app.use(get_following_user_stories_1.getFollowingUserStoriesRouter);
app.use(notify_everyone_1.createNotificationForEveryoneRouter);
app.use(notify_user_1.createNotificationforSingleUserRouter);
app.use(create_post_2.createOfficialPostRouter);
app.all("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error("Route not found!!");
}));
