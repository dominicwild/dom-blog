"use client";

import React from 'react';
import Link from 'next/link';
import {Calendar, Tag, Search, Clock, ArrowRight} from 'lucide-react';
import {motion} from 'motion/react';
import Image from "next/image"
import {getArticleCardData} from "@/articles/getArticles";

const blogs = [
    {
        id: 'article1',
        title: 'Larry the Pizza Heist Pigeon',
        description: 'Larry, a monocled pigeon, aspires to be the city\'s top pizza thief but ends up forming an unexpected alliance.',
        image: '/articles/pigeon/monocle-pigeon.png',
        date: new Date('2025-04-12'),
        tags: ['pigeon', 'pizza', 'comedy', 'urban', 'animals'],
        folder: 'article1'
    },
    {
        id: 'article2',
        title: 'Gerald\'s Spaghetti Cape Adventures',
        description: 'A cape-wearing llama decodes elevator music and organizes bizarre dance-offs with raccoons.',
        image: '/articles/llama/spaghetti.png',
        date: new Date('2025-04-10'),
        tags: ['llama', 'spaghetti', 'dance', 'absurd', 'animals'],
        folder: 'article2'
    },
    {
        id: 'article3',
        title: 'Detective Hamster and the Cereal Box Mystery',
        description: 'A hamster detective hunts for a missing marshmallow inside a cereal box with a twist ending.',
        image: '/articles/hamster/detective.png', // Mock image path
        date: new Date('2025-04-08'),
        tags: ['hamster', 'detective', 'mystery', 'cereal', 'humor'],
        folder: 'article3'
    },
    {
        id: 'article4',
        title: 'Stanley the Stand-up Goldfish',
        description: 'A goldfish trapped in a dentist\'s office goes viral with his bubble-based comedy routine.',
        date: new Date('2025-04-05'),
        tags: ['goldfish', 'comedy', 'aquarium', 'viral', 'animals'],
        folder: 'article4'
    },
    {
        id: 'article5',
        title: 'The Owl Who Couldn\'t Give a Hoot',
        description: 'An apathetic owl becomes an accidental life coach for forest creatures with existential crises.',
        date: new Date('2025-04-01'),
        tags: ['owl', 'philosophy', 'forest', 'coaching', 'humor'],
        folder: 'article5'
    },
    {
        id: 'article6',
        title: 'Submarine Squirrels: The Nutty Depths',
        description: 'A team of engineering squirrels builds a working acorn-powered submarine to explore a park pond.',
        image: '/articles/squirrel/submarine.png', // Mock image path
        date: new Date('2025-03-28'),
        tags: ['squirrel', 'engineering', 'adventure', 'pond', 'innovation'],
        folder: 'article6'
    }
];

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
                                        <Image
                                            src={blog.image || "/placeholder.png"}
                                            alt={blog.title}
                                            fill
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