module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "airbnb-base"
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "no-console": "off",
        "no-param-reassign": [2, { "props": false }],
        "no-underscore-dangle": "off",
        "prefer-destructuring": "off",
        "consistent-return": "off"
    }
    
};
