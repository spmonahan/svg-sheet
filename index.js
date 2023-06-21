const fs = require('fs');
const { parse, stringify } = require('svgson')

const files = fs.readdirSync('./src');

const WIDTH = 48;

const walk = (node, callback) => {
    callback(node);

    for (const child of node.children) {
        walk(child, callback);
    }
}

const build = async () => {
    const symbols = [];

    let index = 0;
    let svg;
    const allDefs = {
        name: "defs",
        type: "element",
        value: "",
        attributes: {},
        children: []
    };
    const paths = [];
    for (const file of files) {
        const idMap = {};
        const contents = fs.readFileSync(`./src/${file}`, 'utf8');

        const json = await parse(contents);

        if (!svg) {
            svg = { ...json }
            svg.children = [];
        }

        const defs = json.children.find(child => child.name === 'defs');
        const g = json.children.find(child => child.name === 'g');

        // There are ID collisions from collecting all the SVGs together
        // Remap IDs
        walk(defs, node => {
            if (node.attributes.id) {
                const newId = `${node.attributes.id}-${index}`;
                idMap[node.attributes.id] = newId;
                node.attributes.id = newId;
            }
        });

        // Update ID references to the mapped values
        walk(g, node => {
            const attrs = ['fill', 'clip-path'];
            for (const attr of attrs) {
                if (node.attributes[attr] && node.attributes[attr].startsWith('url')) {
                    const id = node.attributes[attr].replace('url(#', '').replace(')', '');
                    node.attributes[attr] = `url(#${idMap[id]})`;
                }
            }
        });

        // Make it a sheet
        g.attributes.transform = `translate(${index * WIDTH}, 0)`;

        allDefs.children = [...allDefs.children, defs.children];
        paths.push(g);
        
        index++;
    }

    svg.children = [
        allDefs,
        ...paths
    ];

    const svgString = stringify(svg);

    fs.writeFileSync('./dist/sheet1.svg', svgString);
};

build().then(() => console.log('done!')).catch(console.error);