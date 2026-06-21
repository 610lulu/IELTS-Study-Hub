/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? "/IELTS-Study-Hub" : undefined,
  assetPrefix: isGithubPages ? "/IELTS-Study-Hub/" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
