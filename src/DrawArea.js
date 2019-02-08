import React, { Component } from 'react';
import io from 'socket.io-client';
import { Alert } from 'reactstrap';
import { SketchPicker } from 'react-color';

export default class DrawArea extends Component {

    constructor() {
        super();
        this.state = {
            users: {},
            statusMessage: null,
            pathStarted: false
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
                    statusMessage: `${data.name} joined the drawing.`
                });
                this.resetStatus();
            }
        });
        socket.on('userDisconnect', data => {
            this.setState({
                statusMessage: `${data.name} left the drawing.`
            });
            this.resetStatus();
        });
        const canvas = this.refs.canvas;
        const draw = canvas.getContext('2d');
        const canvas2 = this.refs.partner;
        const draw2 = canvas2.getContext('2d');
        const cursor = this.refs.cursor;
        this.setState({
            canvas: canvas,
            draw: draw,
            draw2: draw2,
            socket: socket,
            cursor: cursor
        });
    }

    mouseMoved = (e) => {
        e.nativeEvent.preventDefault();
        const { clicked, draw, id, color } = this.state;
        let x = e.nativeEvent.offsetX;
        let y = e.nativeEvent.offsetY;
        if (e.pressure) {
            draw.lineWidth = 1 * e.pressure;
        } else {
            draw.lineWidth = 10;
        }
        this.state.socket.emit("mouse", {
            x: x,
            y: y,
            clicked: clicked,
            id: id,
            color: color
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
        this.setState({ clicked: false });
        this.state.draw.save();
    }

    mouseLeave = () => {
        this.state.socket.emit("mouse", {
            clicked: false
        });
        this.setState({
            clicked: false
        });
        this.state.draw.save();
    }

    setName = () => {
        const { id, name, socket } = this.state;
        socket.emit("nameSelect", { id: id, name });
    }

    handleChangeComplete = (color) => {
        const { draw } = this.state;
        draw.strokeStyle = color.hex;
        this.setState({ color: color.hex });
    };

    render() {
        return (
            <div>
                <div id="sketch-area">
                    <div ref="cursor" id="cursor"></div>
                    <canvas ref="canvas" id="layer2" width={900} height={425} onPointerDown={this.mouseDown} onPointerUp={this.mouseUp} onPointerMove={this.mouseMoved}></canvas>
                    <canvas ref="partner" id="layer1" width={900} height={425}></canvas>
                    <SketchPicker color={this.state.color} onChangeComplete={this.handleChangeComplete}></SketchPicker>
                </div>
                {this.state.statusMessage && <Alert>{this.state.statusMessage}</Alert>}
            </div>
        );
    }

}