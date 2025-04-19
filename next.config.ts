import type {NextConfig} from "next";
import path from "node:path";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://cdn.jsdelivr.net/**')],
    },
    webpack(config, options) {
        // Make all files in the articles directory available for import
        config.module.rules.push({
            test: /articles\/.*\.(ts|js|json|md)$/,
            use: options.defaultLoaders.babel,
            include: [path.resolve(__dirname, 'articles')],
        });

        return config;
    },
    // Tell Next.js to statically evaluate and include these imports during build
    outputFileTracingIncludes: {
        '/': ['./articles/**/*'],
    },
};

export default nextConfig;
