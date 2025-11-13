import { posts, post } from "~/server/graphql/queries/post";
import { author } from "~/server/graphql/queries/author";
import { categories } from "~/server/graphql/queries/category";
import { tags } from "~/server/graphql/queries/tag";
import { Resolvers } from '#graphql/resolver'

export const resolvers: Resolvers = {
  Query: {
    posts,
    post,
    author, 
    categories,
    tags
  },
}