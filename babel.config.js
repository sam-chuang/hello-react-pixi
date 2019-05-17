const presets = [
    [
        "@babel/preset-env", 
        { 
        }
    ],
    [
        "@babel/preset-react", 
        { 
        }
    ]
];

const plugins = [
    [
        "@babel/proposal-object-rest-spread", 
        { 
            "loose": true, 
            "useBuiltIns": true 
        }
    ]
]

module.exports = { presets, plugins };