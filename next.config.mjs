// next.config.js
import withFonts from "next-fonts";

export default withFonts({
  webpack(config, options) {
    return config;
  },
});
