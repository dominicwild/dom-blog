"use client";

import React from 'react';
import Link from 'next/link';
import {ArrowRight, Calendar, Clock} from 'lucide-react';
import {motion} from 'motion/react';
import {getArticleCardData} from "@/articles/getArticles";

const PageContent = ({blogs}: { blogs: Awaited<ReturnType<typeof getArticleCardData>> }) => {
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const blogsToShow = blogs.filter(blog => blog.show)

    return (
        <main className="flex-grow container mx-auto px-4 py-12 text-white">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="max-w-5xl mx-auto"
            >
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Articles</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Thoughts, tutorials, and insights on web development, design, and technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {blogsToShow.map((blog, index) => (
                        <motion.article
                            key={blog.title}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: index * 0.1}}
                            className="group h-full"
                        >
                            <Link href={`/blogs/${blog.folder}`} className="block h-full">
                                <div
                                    className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={blog.image || "/placeholder.png"}
                                            alt={blog.title}
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                                        <div
                                            className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                                            {blog.tags[0]}
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-grow p-6">
                                        <div className="flex items-center text-sm text-gray-400 mb-3">
                                            <Calendar className="h-4 w-4 mr-2"/>
                                            <span>{dateFormatter.format(blog.date)}</span>
                                            <span className="mx-2">•</span>
                                            <Clock className="h-4 w-4 mr-1"/>
                                            <span>{blog.timeToReadMinutes}m</span>
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                            {blog.title}
                                        </h2>
                                        <p className="text-gray-400 mb-4 flex-grow">{blog.description}</p>
                                        <div className="flex items-center text-blue-400 font-medium mt-auto">
                                            Read more
                                            <ArrowRight
                                                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </motion.div>
        </main>
    );
};

export default PageContent;