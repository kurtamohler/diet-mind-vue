module.exports = function(babel) {
  babel.cache(true);

  return {
    "presets": [
      ["@babel/env", { "modules": false }],
      '@vue/app'
    ],
    "env": {
      "test": {
        "presets": [["@babel/env", { "targets": { "node": "current" } }]]
      }
    }
  };
};
