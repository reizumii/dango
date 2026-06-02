export default {
  multipass: true,
  js2svg: {
    finalNewline: true,
  },
  plugins: [
    "preset-default",
    {
      name: "inject-context-fill",
      fn: () => ({
        element: {
          enter: (node, parentNode) => {
            // Target the root <svg> tag
            if (node.name === "svg" && parentNode.type === "root") {
              node.attributes.fill = "context-fill";
              node.attributes["fill-opacity"] = "context-fill-opacity";
            }
            // Target all shapes inside the SVG and strip their hardcoded colors
            else {
              delete node.attributes.fill;
              delete node.attributes.stroke;
            }
          },
        },
      }),
    },
  ],
};
