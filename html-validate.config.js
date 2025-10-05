module.exports = {
  extends: ["html-validate:recommended"],
  rules: {
    "void-style": "off",
    "no-inline-style": "off",
    "attribute-empty-style": "off", 
    "no-implicit-close": "off",
    "close-order": "off",
    "element-permitted-content": "off",
    "attr-quotes": "off",
    "valid-id": "off",
    "wcag/h63": "off",
    "no-redundant-role": "off",
    "unique-landmark": "off",
    "prefer-native-element": "off"
  },
  elements: ["html5"],
  transform: {
    "^.*$": "html-validate-transform-ignore"
  }
};