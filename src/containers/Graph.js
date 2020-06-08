import React, { Component } from 'react'
import { schemeDark2 } from 'd3';
var d3 = require("d3")

export default class Graph extends Component {

    // data = {
    //     nodes: [
    //         {
    //             name: "N1",
    //             type: 'movie'
    //         },
    //         {
    //             name: 'N2',
    //             type: 'actor'
    //         }
    //     ],
    //     links: [
    //         {
    //             source: 1,
    //             target: 0,
    //             value: 1
    //         }
    //     ]
    // }
    data = {
        nodes: [],
        links: []
    }
    constructor() {
        super();
        this.color = this.color.bind(this);
    }
    // data = {
    //     nodes: [],
    //     links: []
    // }

    color(node) {
        if (node.type === "movie") {
            this.svgDefs.append("svg:pattern")
                .attr("id", node.imdbID)
                .attr("width", 1)
                .attr("height", 1)
                .append("svg:image")
                .attr("xlink:href", node.poster)
                .attr("width", 200)
                // .attr("height", 466)
                .attr("x", 0)
                .attr("y", 0);
            return "url(#" + node.imdbID + ")";
        }
        return d3.color("blue")
    }

    calcNodeSize(node) {
        if (node.type === "movie") {
            return 100;
        }
        return 50;
    }

    drag(simulation) {
        function dragStarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fy = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragended)
    }

    chart(nodes, links) {
        const width = 1920;
        const height = 1080;

        const obj_links = links //.map(d => Object.create(d));
        const obj_nodes = nodes //.map(d => Object.create(d));

        const svg = d3.create('svg')
            .attr("viewBox", [0, 0, width, height]);
        // Setup defs as global so a function can decide the fill type for nodes
        this.svgDefs = svg.append('svg:defs');

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(obj_links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value))

        const simulation = d3.forceSimulation(obj_nodes)
            .force("link", d3.forceLink().links(links).id(d => { return d.index; }).distance(200))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(obj_nodes)
            .join("circle")
            .attr("r", this.calcNodeSize)
            .attr("fill", this.color)
            .call(this.drag(simulation))

        node.append("title")
        .text(d => d.name)


        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        })

        return svg.node();
    }

    async updateVisualization(snapshot) {
        snapshot.forEach((movieSnapshot) => {
            if (movieSnapshot.key !== 'count') {
                const snapshotMeta = movieSnapshot.val().meta;
                const currentMovie = {
                    name: snapshotMeta.Title,
                    type: snapshotMeta.Type,
                    poster: snapshotMeta.Poster,
                    imdbID: snapshotMeta.imdbID
                };
                this.data.nodes.push(currentMovie);
                let actors = snapshotMeta.Actors.split(", ");
                actors.map((actor) => {
                    let existingNode = this.data.nodes.filter((node) => node.name === actor)[0];
                    if (existingNode === undefined) {
                        existingNode = {
                            name: actor,
                            type: 'actor',
                            poster: null
                        };
                        this.data.nodes.push(existingNode);
                    }
                    this.data.links.push({
                        source: currentMovie,
                        target: existingNode
                    })
                });
            }
        });
        // console.log("nodes", this.data.nodes);
        // console.log("links", this.data.links);
    }

    async componentDidMount() {
        const elem = document.getElementById('main')
        var movieRef = this.props.firebase.database().ref('lists/GraphViz');
        movieRef.on('value', async snapshot => {
            await this.updateVisualization(snapshot);
            elem.appendChild(this.chart(this.data.nodes, this.data.links));
        });
    }

    render() {
        return (
            <div style={{ width: "1920px", height: "1080px" }} id='main'>
            </div>
        )
    }
}
