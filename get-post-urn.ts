
import { prisma } from "./src/lib/db";
import * as dotenv from "dotenv";
dotenv.config();

async function getRecentPost() {
    const post = await prisma.linkedInPost.findFirst({
        orderBy: { publishedAt: "desc" }
    });
    console.log("Post URN:", post?.linkedinPostId);
}

getRecentPost();
