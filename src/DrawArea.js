import React, { Component } from 'react';
import io from 'socket.io-client';
import { Alert, InputGroup, Input, Button, Label } from 'reactstrap';

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
        socket.on('userData', (data) => {
            this.setState({
                id: data.id
            });
        });
        socket.on('mouse', (data) => {
            if (data.id !== this.state.id) {
                if (data.clicked) {
                    const draw2 = this.state.draw2;
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
                    })
                }
            }
        });
        socket.on('userConnect', data => {
            console.log(data);
            this.setState({
                statusMessage: `${data.id} joined the drawing.`
            });
            this.resetStatus();
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
        this.setState({
            draw: draw,
            draw2: draw2,
            socket: socket
        });
    }

    mouseMoved = (e) => {
        const { clicked, draw, id } = this.state;
        let x = e.nativeEvent.offsetX;
        let y = e.nativeEvent.offsetY;
        this.state.socket.emit("mouse", {
            x: x,
            y: y,
            clicked: clicked,
            id: id
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
    }

    mouseLeave = () => {
        this.state.socket.emit("mouse", {
            clicked: false
        });
        this.setState({
            clicked: false
        });
    }

    touch = (e) => {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.state.draw.dispatchEvent(mouseEvent);
    }

    setName = () => {
        const { id, name, socket } = this.state;
        socket.emit("nameSelect", { id: id, name });
    }

    render() {
        return (
            <div>
                <InputGroup id="name-set">
                    <Label>Name</Label>
                    <Input onChange={(e) => this.setState({ name: e.target.value })}></Input>
                    <Button onClick={this.setName}>Set</Button>
                </InputGroup>
                <canvas ref="canvas" id="layer2" width={800} height={425} onTouchMove={this.touch} onMouseDown={this.mouseDown} onMouseLeave={this.mouseLeave} onMouseUp={this.mouseUp} onMouseMove={this.mouseMoved}></canvas>
                <canvas ref="partner" id="layer1" width={800} height={425}></canvas>
                {this.state.statusMessage && <Alert>{this.state.statusMessage}</Alert>}
            </div>
        );
    }

}