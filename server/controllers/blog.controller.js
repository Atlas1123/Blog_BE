// utils
const { Response } = require("../utils");

// services
const { blogsService, likesService } = require("../services");

// utils
const { errorHandler } = require("../utils");

// config
const { ERRORS, MESSAGES } = require("../consts");

const blogInsert = async (req, res, next) => {
    console.log(req.body);
    try {
        const { title, text, imageUrl, ...rest } = req.body;
        const [article] = await blogsService.readDuplicateArticle({
            title,
        });
        console.log([article]);
        if (!article) {
            await blogsService.createBlog({
                userId: req.user.id,
                title,
                text,
                imageUrl,
            });
    
            Response(res, 200, {}, MESSAGES.NEW_BLOG_CREATE_SUCCESS);
        } else {
            errorHandler(res, ERRORS.BLOG_TITLE_DUPLICATED.code);
        }
    } catch (error) {
        errorHandler(res, error);
    }
};

const blogUpdate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, text, imageUrl, ...rest } = req.body;

        await blogsService.updateBlog(id, {
            title,
            text,
            imageUrl,
        });

        Response(res, 200, {}, MESSAGES.UPDATE_BLOG_SUCCESS);

    } catch (error) {
        errorHandler(res, error);
    }
};

const blogThumbUp = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [blog] = await blogsService.readBlogs(id);
        if (blog) {
            if (blog.userId != req.user.id) {
                const likes = await likesService.readLikes({
                    userId: req.user.id,
                    blogId: id
                });

                if (!likes.length) {
                    await likesService.createLike({
                        userId: req.user.id,
                        blogId: id
                    });
                    Response(res, 200, {}, MESSAGES.THUMBUP_SUCCESS);
                } else {
                    errorHandler(res, ERRORS.THUMBUP_AGAIN_FORBIDDEN.code);
                }
            } else {
                errorHandler(res, ERRORS.THUMBUP_MYSELF.code);
            }
        } else {
            errorHandler(res, ERRORS.BLOG_NOT_EXIST.code);
        }
    } catch (error) {
        errorHandler(res, error);
    }
};

const blogList = async (req, res, next) => {
    console.log(req.query);
    try {
        const pageIndex = req.query.pageIndex ? Number(req.query.pageIndex) : 1;
        const itemCount = req.query.itemCount ? Number(req.query.itemCount) : 5;
        const title = req.query.title ? String(req.query.title) : "";
        const sortType = req.query.sortType ? String(req.query.sortType) : "createdAt";
        const sortOrder = req.query.sortOrder ? String(req.query.sortOrder) : "asc";

        const [blogsCount] = await blogsService.readMainBlogsCount(title);
        const blogs = await blogsService.readMainBlogs(
            pageIndex,
            itemCount,
            title,
            sortType,
            sortOrder,
        );

        Response(res, 200, {
            blogs,
            count: blogsCount.count
        });

    } catch (error) {
        errorHandler(res, error);
    }
};

const blogSingle = async (req, res, next) => {
    try {
        const { id } = req.params;

        const blogs = await blogsService.readCertainBlogs(id);

        Response(res, 200, {
            blogs,
        });
    } catch (error) {
        errorHandler(res, error);
    }
}

const blogDelete = async (req, res, next) => {
    try {
        const { id } = req.params;

        await blogsService.deleteBlog(id);

        Response(res, 200, {}, MESSAGES.DELETE_BLOG_SUCCESS);
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports = {
    blogInsert,
    blogUpdate,
    blogList,
    blogDelete,
    blogSingle,
    blogThumbUp
};
