// node_modules
const moment = require("moment");

// utils
const { DATABASE } = require("../utils");

const createBlog = async (blogData) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector.returning("id").insert("blogs", blogData);
    } catch (error) {
        throw error;
    }
};

const readDuplicateArticle = async (title) => {
    // console.log(title);
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select("*")
            .where({ "blogs.title": title.title })
            .where("blogs.deletedAt is null")
            .get("blogs");
    } catch (error) {
        throw error;
    }
}

const readMainBlogsCount = async (title) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select(["COUNT (*) as count"])
            .join("comments", "blogs.id = comments.commentBlogId", "left")
            .where("comments.createdAt is NULL")
            .where("blogs.deletedAt is null")
            .like("blogs.title", `%${title}%`, "none")
            .get("blogs");
    } catch (error) {
        throw error;
    }
};

const readMainBlogs = async (pageIndex, itemCount, title, sortType, sortOrder) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select([
                "blogs.id",
                "blogs.userId AS `userId`",
                "users.username",
                "blogs.title",
                "blogs.text",
                "blogs.imageUrl",
                "COUNT(likes.blogId) AS `like`",
            ])
            .join("users", "blogs.userId = users.id")
            .join("likes", "blogs.id = likes.blogId", "left")
            .join("comments", "blogs.id = comments.commentBlogId", "left")
            .group_by("blogs.id")
            .where("comments.createdAt is NULL")
            .where("blogs.deletedAt is null")
            .like("blogs.title", `%${title}%`, "none")
            .offset((pageIndex - 1) * itemCount)
            .order_by(`${sortType} ${sortOrder}`)
            .limit(itemCount)
            .get("blogs");
    } catch (error) {
        throw error;
    }
};

const readCertainBlogs = async (id) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select([
                "blogs.id as id",
                "blogs.userId AS userId",
                "users.username as username",
                "blogs.title as title",
                "blogs.text as text",
                "blogs.imageUrl as imageUrl",
                "COUNT( likes.blogId ) AS `like`",
            ])
            .join("users", "blogs.userId = users.id")
            .join("likes", "blogs.id = likes.blogId", "left")
            .group_by("blogs.id")
            .where(`blogs.id = ${id}`)
            .where("blogs.deletedAt is null")
            .get("blogs");
    } catch (error) {
        throw error;
    }
};

const readCertainBlog = async (id) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select(["*"])
            .where(`blogs.id = ${id}`)
            .where("blogs.deletedAt is null")
            .get("blogs");
    } catch (error) {
        throw error;
    }
};

const readBlogs = async (id) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select("*")
            .where({ "blogs.id": id })
            .where("blogs.deletedAt is null")
            .get("blogs");
    } catch (error) {
        throw error;
    }
};

const updateBlog = async (id, blogData) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .where({ "blogs.id": id })
            .set(blogData)
            .update("blogs");
    } catch (error) {
        throw error;
    }
};

const deleteBlog = async (id) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .where({ "blogs.id": id })
            .set({
                deletedAt: new Date(),
            })
            .update("blogs");
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBlog,
    readMainBlogs,
    readMainBlogsCount,
    readCertainBlogs,
    readCertainBlog,
    readBlogs,
    updateBlog,
    deleteBlog,
    readDuplicateArticle
};
