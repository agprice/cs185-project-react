import React, { Component } from 'react'
import { schemeDark2 } from 'd3';
var d3 = require("d3")

export default class Graph extends Component {

    // This config sets the offset of the actor name tooltip
    tipConfig = {
        offset: 10
    }
    // This contains the graph data
    data = {
        nodes: [],
        links: []
    }
    constructor() {
        super();
        this.color = this.color.bind(this);
    }
    // Set the background color of the nodes
    color(node) {
        if (node.type === "movie") {
            // Create a pattern for this movie
            this.svgDefs.append("svg:pattern")
                .attr("id", node.imdbID)
                .attr("width", 1)
                .attr("height", 1)
                .append("svg:image")
                .attr("xlink:href", node.poster)
                .attr("width", 200)
                .attr("x", 0)
                .attr("y", 0);
            return "url(#" + node.imdbID + ")";
        }
        return d3.color("blue")
    }

    // Set the size of the nodes
    calcNodeSize(node) {
        if (node.type === "movie") {
            return 100;
        }
        return 40;
    }

    // Handle dragging the nodes
    drag(simulation, movieTip, tipConfig) {
        function dragStarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
            movieTip.style("top", (d3.event.sourceEvent.pageY + tipConfig.offset) + "px").style("left", (d3.event.sourceEvent.pageX + tipConfig.offset) + "px")
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fy = null;
            d.fx = null;
        }

        return d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragended)
    }

    // Create the SVG chart
    chart(nodes, links) {
        // Set the size to the current window size
        const width = window.innerWidth;
        const height = window.innerHeight;
        console.log("width", width, "height:", height);
        // Don't map these objects, or it will break the object mappings in the data
        const obj_links = links; 
        const obj_nodes = nodes;

        const svg = d3.create('svg')
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height]);
        // Setup defs as global so a function can decide the fill type for nodes
        this.svgDefs = svg.append('svg:defs');

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(obj_links)
            .join("line")
            .attr("stroke-width", (d) => d.thickness);

        const simulation = d3.forceSimulation(obj_nodes)
            .force("link", d3.forceLink(links).distance(200))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // This floating DIV provides the tooltip popup
        let movieTip = d3.select("#main")
        .append("div")
            .style("visibility", "hidden")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("class", "w3-round-large w3-black w3-padding")
            .text("I'm a circle!");
        
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(obj_nodes)
            .join("circle")
            .attr("r", this.calcNodeSize)
            .attr("fill", this.color)
            .call(this.drag(simulation, movieTip, this.tipConfig))
            // Tooltip nicely pops up and follows the mouse relative to the node
            .on("mouseover", (d) => { if (d.type === 'actor') movieTip.style("visibility", "visible").text(d.name); })
            .on("mousemove", () => movieTip.style("top", (d3.event.y + this.tipConfig.offset) + "px").style("left", (d3.event.x + this.tipConfig.offset) + "px"))
            .on("mouseout", () => movieTip.style("visibility", "hidden"))

        // On tick update the link positions, and node positions
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
    // Build the data for the graph
    updateVisualization(snapshot) {
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
                actors.forEach((actor) => {
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
                        source: existingNode,
                        target: currentMovie,
                        thickness: 5
                    })
                });
            }
        });
    }

    async componentDidMount() {
        const elem = document.getElementById('main')
        // Connect to the firebase database
        var movieRef = this.props.firebase.database().ref('lists/GraphViz');
        movieRef.on('value', snapshot => {
            // Build the data objects
            this.updateVisualization(snapshot);
            // Use the data objects to generate the graph
            elem.appendChild(this.chart(this.data.nodes, this.data.links));
        });
        // Handle window resize by resizing the graph. Prevent spamming with the timeout
        let resizeHandler;
        window.addEventListener("resize", () => {
            clearTimeout(resizeHandler);
            resizeHandler = setTimeout(() => {
                // On window resize, rebuild the graph
                while (elem.childElementCount > 0)
                    elem.removeChild(elem.firstChild)
                console.log('Resizing SVG');
                elem.appendChild(this.chart(this.data.nodes, this.data.links));
            }, 200)
        });
    }

    render() {
        return (
            <div id='main'>
            </div>
        )
    }
}
