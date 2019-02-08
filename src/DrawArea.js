import React, { Component } from 'react';
import io from 'socket.io-client';
import { Alert, Button } from 'reactstrap';
import { SketchPicker } from 'react-color';
import { Slider } from 'reactrangeslider';

export default class DrawArea extends Component {

    constructor() {
        super();
        this.state = {
            users: {},
            statusMessage: null,
            pathStarted: false,
            partner: null,
            sidebarToggle: false
        }
    }

    componentDidMount() {
        const socket = io('https://draw-with-me-socket.herokuapp.com/');
        socket.emit("name", {
            name: this.props.name
        });
        socket.on('userData', (data) => {
            this.setState({
                id: data.id
            });
        });
        socket.on('mouse', (data) => {
            if (data.id !== this.state.id) {
                if (!this.state.partner) {
                    this.setState({
                        partner: data.name
                    });
                }
                let cursor = this.state.cursor;
                cursor.style.left = data.x + "px";
                cursor.style.top = data.y + "px";
                if (data.clicked) {
                    const draw2 = this.state.draw2;
                    draw2.strokeStyle = data.color;
                    if (!this.state.pathStarted) {
                        draw2.beginPath();
                        draw2.moveTo(data.x, data.y)
                        this.setState({
                            pathStarted: true
                        });
                    } else {
                        draw2.lineTo(data.x, data.y);
                        draw2.stroke();
                    }
                } else {
                    this.setState({
                        pathStarted: false
                    });
                }
            }
        });
        socket.on('userConnect', data => {
            if (data.id !== this.state.id) {
                this.setState({
                    statusMessage: `${data.name} joined the drawing.`,
                    partner: data.name
                });
                this.resetStatus();
            }
        });
        socket.on('userDisconnect', data => {
            this.setState({
                partner: null,
                statusMessage: `${data.name} left the drawing.`
            });
            this.resetStatus();
        });
        const canvas = this.refs.canvas;
        const draw = canvas.getContext('2d');
        const canvas2 = this.refs.partner;
        const draw2 = canvas2.getContext('2d');
        const cursor = this.refs.cursor;
        const combine = this.refs.final;
        const combineIt = combine.getContext('2d');
        this.setState({
            canvas: canvas,
            draw: draw,
            draw2: draw2,
            socket: socket,
            cursor: cursor,
            final: combineIt
        });
    }

    mouseMoved = (e) => {
        e.nativeEvent.preventDefault();
        const { clicked, draw, id, color } = this.state;
        let x = e.nativeEvent.offsetX;
        let y = e.nativeEvent.offsetY;
        if (e.pressure) {
            draw.lineWidth = 1 * e.pressure * this.state.width;
        } else {
            draw.lineWidth = this.state.width;
        }
        this.state.socket.emit("mouse", {
            x: x,
            y: y,
            clicked: clicked,
            id: id,
            color: color,
            name: this.props.name
        });
        if (clicked) {
            draw.lineTo(x, y);
            draw.stroke();
        }
        this.setState({ x: x, y: y });
    }

    resetStatus = () => {
        setTimeout(() => {
            this.setState({
                statusMessage: null
            });
        }, 3000);
    }

    mouseDown = () => {
        this.setState({ clicked: true });
        this.state.draw.beginPath();
    }

    mouseUp = () => {
        this.state.socket.emit("mouse", {
            clicked: false
        });
        this.setState({ clicked: false });
    }

    mouseLeave = () => {
        this.state.socket.emit("mouse", {
            clicked: false
        });
        this.setState({
            clicked: false
        });
    }

    savePic = () => {
        const { draw, draw2, final } = this.state;
        final.drawImage(draw.canvas, 0, 0);
        final.drawImage(draw2.canvas, 0, 0);
        let pictureLink = final.canvas.toDataURL('img/png');
        let link = document.createElement("a");
        link.setAttribute("href", pictureLink);
        link.setAttribute("download", "drawing.png");
        link.click();
    }

    setName = () => {
        const { id, name, socket } = this.state;
        socket.emit("nameSelect", { id: id, name });
    }

    handleChangeComplete = (color) => {
        const { draw } = this.state;
        draw.strokeStyle = color.hex;
        this.setState({ color: color.hex });
    }

    sidebar = () => {
        let main = this.refs.main;
        let sidebar = this.refs.sidenav;
        sidebar.style.width = "250px";
        main.style.marginRight = "250px";
        this.setState({
            sidebarToggle: true
        });
    }

    closeSidebar = () => {
        let main = this.refs.main;
        let sidebar = this.refs.sidenav;
        sidebar.style.width = "0px";
        main.style.marginRight = "0px";
        this.setState({
            sidebarToggle: false
        });
    }

    render() {
        return (
            <main>
                <div id="main" ref="main">
                    <div id="sketch-area">
                        <div ref="cursor" className={this.state.partner ? "" : "hide"} id="cursor">
                            <p id="name">{this.state.partner}</p>
                        </div>
                        <canvas ref="canvas" id="layer2" width={900} height={425} onPointerDown={this.mouseDown} onPointerUp={this.mouseUp} onPointerMove={this.mouseMoved}></canvas>
                        <canvas ref="partner" id="layer1" width={900} height={425}></canvas>
                        <canvas style={{ display: 'none' }} ref="final" width={900} height={425}></canvas>
                    </div>
                    <Button onClick={this.savePic}>Save Drawing!</Button>
                    {this.state.statusMessage && <Alert>{this.state.statusMessage}</Alert>}
                </div>
                <Button onClick={() => {
                    this.state.sidebarToggle ? this.closeSidebar() : this.sidebar();
                }}>Tools</Button>
                <div className="sidenav" ref="sidenav">
                    <h4>Line width</h4>
                    <Slider defaultValue={20} step={5} min={5} max={60} onChange={(width) => this.setState({ width: width })} />
                    <SketchPicker color={this.state.color} onChangeComplete={this.handleChangeComplete}></SketchPicker>
                </div>
            </main>
        );
    }

}