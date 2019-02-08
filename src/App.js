import React, { Component } from 'react';
import { Input, Button } from 'reactstrap';
import DrawArea from './DrawArea';

class App extends Component {

	constructor() {
		super();
		this.state = {
			name: ''
		}
	}

	render() {
		const name = this.state.name;
		return (
			<div className="App">
				{name ?
					<DrawArea name={name}></DrawArea> :
					<div>
						<h3>Enter your name!</h3>
						<Input onChange={(e) => this.setState({ input: e.target.value })}></Input>
						<Button onClick={() => this.setState({ name: this.state.input })}>Confirm</Button>
					</div>
				}
			</div>
		);
	}
}

export default App;
