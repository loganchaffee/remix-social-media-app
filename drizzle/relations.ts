import { relations } from "drizzle-orm/relations";
import { user, follow, post, session } from "./schema";

export const followRelations = relations(follow, ({one}) => ({
	user_follower: one(user, {
		fields: [follow.follower],
		references: [user.id],
		relationName: "follow_follower_user_id"
	}),
	user_followee: one(user, {
		fields: [follow.followee],
		references: [user.id],
		relationName: "follow_followee_user_id"
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	follows_follower: many(follow, {
		relationName: "follow_follower_user_id"
	}),
	follows_followee: many(follow, {
		relationName: "follow_followee_user_id"
	}),
	posts: many(post),
	sessions: many(session),
}));

export const postRelations = relations(post, ({one}) => ({
	user: one(user, {
		fields: [post.user_id],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.user_id],
		references: [user.id]
	}),
}));