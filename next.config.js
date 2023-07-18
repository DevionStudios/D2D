/**
 * @type {import('next').NextConfig }
 **/
module.exports = {
  async rewrites() {
    return [
      {
        source: "/bee.js",
        destination: "https://cdn.splitbee.io/sb.js",
      },
      {
        source: "/_hive/:slug",
        destination: "https://hive.splitbee.io/:slug",
      },
    ];
  },
  images: {
    domains: [
      "media.giphy.com",
      "res.cloudinary.com",
      "c.tenor.com",
      "giphy.com",
      "images.unsplash.com",
      "placekitten.com",
      "stampchain.io",
      "ordinals.com",
      "api.hiro.so",
      "www.enbri.org",
      "*",
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
};
