import React, { Component } from 'react'
import { schemeDark2 } from 'd3';
var d3 = require("d3")

export default class Graph extends Component {

    data = {
        nodes: [
            {
                name: "N1",
                type: 'movie'
            },
            {
                name: 'N2',
                type: 'actor'
            }
        ],
        links: [
            {
                source: 1,
                target: 0,
                value: 1
            }
        ]
    }
    // data = {
    //     nodes: {},
    //     links: {}
    // }
    // data = {
    //     nodes: [],
    //     links: []
    // }

    color(node) {
        console.log("node:", node);
        if (node.type === "movie") {
            return d3.color("red");
        }
        return d3.color("blue")
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
        console.log("object nodes", obj_nodes);
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(obj_nodes)
            .join("circle")
            .attr("r", 20)
            .attr("fill", this.color)
            .call(this.drag(simulation));


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
        let index = 0;
        snapshot.forEach((movieSnapshot) => {
            if (movieSnapshot.key !== 'count') {
                console.log("Moviekey", movieSnapshot.key, "MovieVal", movieSnapshot.val());
                const snapshotMeta = movieSnapshot.val().meta;
                console.log("meta", snapshotMeta);
                const curMovieIndex = index;
                const currentMovie = {
                    name: snapshotMeta.Title,
                    type: snapshotMeta.Type,
                    poster: snapshotMeta.Poster
                };
                this.data.nodes[index] = currentMovie;
                index++;
                let actors = snapshotMeta.Actors.split(", ");
                actors.map((actor) => {
                    let existingNode = this.data.nodes.filter((node) => node.name === actor)[0];
                    console.log("actor", existingNode);
                    if (existingNode === undefined) {
                        existingNode = {
                            name: actor,
                            type: 'actor',
                            poster: null
                        };
                        this.data.nodes[index] = existingNode;
                        index++;
                    }
                    this.data.links.push({
                        source: currentMovie,
                        target: existingNode,
                        value: 1
                    })
                });
            }
        });
        console.log("nodes", this.data.nodes);
        console.log("links", this.data.links);
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
