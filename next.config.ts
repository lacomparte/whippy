/** @type {import('next').NextConfig} */
const repoName = "whippy";
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  assetPrefix: isProd ? `/${repoName}/` : undefined,
  basePath: isProd ? `/${repoName}` : undefined,
};

export default nextConfig;
