import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    businesses: defineTable({
        userId: v.string(),
        name: v.union(v.string(), v.null()),
        address: v.union(v.string(), v.null()),
        phoneNumber: v.union(v.string(), v.null()),
        email: v.union(v.string(), v.null()),
        wifiPassword: v.union(v.string(), v.null()),
        instagramProfileUrl: v.union(v.string(), v.null()),
        slug: v.string(),
        backgroundColor: v.optional(v.union(v.string(), v.null())),
        foregroundColor: v.optional(v.union(v.string(), v.null())),
        filterByTags: v.optional(v.union(v.array(v.string()), v.null())),
        allowGridView: v.optional(v.union(v.boolean(), v.null())),
        defaultView: v.optional(v.string()),
        categoryOrder: v.optional(v.union(v.array(v.string()), v.null())),
    }).index("by_userId", ["userId"]),

    products: defineTable({
        businessId: v.string(),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        category: v.string(),
        contentUrl: v.string(),
        contentType: v.string(),
        show: v.boolean(),
        tags: v.optional(v.union(v.array(v.string()), v.null())),
        thumbnail: v.optional(v.union(v.string(), v.null()))
    }),


});


