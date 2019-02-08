(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{128:function(e,t,a){e.exports=a(336)},133:function(e,t,a){},160:function(e,t){},336:function(e,t,a){"use strict";a.r(t);var n=a(1),s=a.n(n),r=a(41),i=a.n(r),o=(a(133),a(42)),c=a(43),l=a(46),u=a(44),d=a(47),m=a(338),h=a(337),f=a(123),v=a.n(f),p=a(339),g=a(124),w=a(125),S=function(e){function t(){var e;return Object(o.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this))).mouseMoved=function(t){t.nativeEvent.preventDefault();var a=e.state,n=a.clicked,s=a.draw,r=a.id,i=a.color,o=t.nativeEvent.offsetX,c=t.nativeEvent.offsetY;t.pressure?s.lineWidth=1*t.pressure*e.state.width:s.lineWidth=e.state.width,e.state.socket.emit("mouse",{x:o,y:c,clicked:n,id:r,color:i,name:e.props.name}),n&&(s.lineTo(o,c),s.stroke()),e.setState({x:o,y:c})},e.resetStatus=function(){setTimeout(function(){e.setState({statusMessage:null})},3e3)},e.mouseDown=function(){e.setState({clicked:!0}),e.state.draw.beginPath()},e.mouseUp=function(){e.state.socket.emit("mouse",{clicked:!1}),e.setState({clicked:!1})},e.mouseLeave=function(){e.state.socket.emit("mouse",{clicked:!1}),e.setState({clicked:!1})},e.savePic=function(){var t=e.state,a=t.draw,n=t.draw2,s=t.final;s.drawImage(a.canvas,0,0),s.drawImage(n.canvas,0,0);var r=s.canvas.toDataURL("img/png"),i=document.createElement("a");i.setAttribute("href",r),i.setAttribute("download","drawing.png"),i.click()},e.setName=function(){var t=e.state,a=t.id,n=t.name;t.socket.emit("nameSelect",{id:a,name:n})},e.handleChangeComplete=function(t){e.state.draw.strokeStyle=t.hex,e.setState({color:t.hex})},e.sidebar=function(){var t=e.refs.main;e.refs.sidenav.style.width="250px",t.style.marginRight="250px",e.setState({sidebarToggle:!0})},e.closeSidebar=function(){var t=e.refs.main;e.refs.sidenav.style.width="0px",t.style.marginRight="0px",e.setState({sidebarToggle:!1})},e.state={users:{},statusMessage:null,pathStarted:!1,partner:null,sidebarToggle:!1},e}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=v()("https://draw-with-me-socket.herokuapp.com/");t.emit("name",{name:this.props.name}),t.on("userData",function(t){e.setState({id:t.id})}),t.on("mouse",function(t){if(t.id!==e.state.id){e.state.partner||e.setState({partner:t.name});var a=e.state.cursor;if(a.style.left=t.x+"px",a.style.top=t.y+"px",t.clicked){var n=e.state.draw2;n.strokeStyle=t.color,e.state.pathStarted?(n.lineTo(t.x,t.y),n.stroke()):(n.beginPath(),n.moveTo(t.x,t.y),e.setState({pathStarted:!0}))}else e.setState({pathStarted:!1})}}),t.on("userConnect",function(t){t.id!==e.state.id&&(e.setState({statusMessage:"".concat(t.name," joined the drawing."),partner:t.name}),e.resetStatus())}),t.on("userDisconnect",function(t){e.setState({partner:null,statusMessage:"".concat(t.name," left the drawing.")}),e.resetStatus()});var a=this.refs.canvas,n=a.getContext("2d"),s=this.refs.partner.getContext("2d"),r=this.refs.cursor,i=this.refs.final.getContext("2d");this.setState({canvas:a,draw:n,draw2:s,socket:t,cursor:r,final:i})}},{key:"render",value:function(){var e=this;return s.a.createElement("main",null,s.a.createElement("div",{id:"main",ref:"main"},s.a.createElement("div",{id:"sketch-area"},s.a.createElement("div",{ref:"cursor",className:this.state.partner?"":"hide",id:"cursor"},s.a.createElement("p",{id:"name"},this.state.partner)),s.a.createElement("canvas",{ref:"canvas",id:"layer2",width:900,height:425,onPointerDown:this.mouseDown,onPointerUp:this.mouseUp,onPointerMove:this.mouseMoved}),s.a.createElement("canvas",{ref:"partner",id:"layer1",width:900,height:425}),s.a.createElement("canvas",{style:{display:"none"},ref:"final",width:900,height:425})),s.a.createElement(h.a,{onClick:this.savePic},"Save Drawing!"),this.state.statusMessage&&s.a.createElement(p.a,null,this.state.statusMessage)),s.a.createElement(h.a,{onClick:function(){e.state.sidebarToggle?e.closeSidebar():e.sidebar()}},"Tools"),s.a.createElement("div",{className:"sidenav",ref:"sidenav"},s.a.createElement("h4",null,"Line width"),s.a.createElement(w.Slider,{defaultValue:20,step:5,min:5,max:60,onChange:function(t){return e.setState({width:t})}}),s.a.createElement(g.SketchPicker,{color:this.state.color,onChangeComplete:this.handleChangeComplete})))}}]),t}(n.Component),k=function(e){function t(){var e;return Object(o.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this))).state={name:""},e}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.state.name;return s.a.createElement("div",{className:"App"},t?s.a.createElement(S,{name:t}):s.a.createElement("form",{onSubmit:function(e){return e.preventDefault()}},s.a.createElement("h1",null,"Draw with Me"),s.a.createElement("h3",null,"Enter your name!"),s.a.createElement(m.a,{onChange:function(t){return e.setState({input:t.target.value})}}),s.a.createElement(h.a,{type:"submit",onClick:function(t){t.preventDefault(),e.setState({name:e.state.input})}},"Confirm")))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(334);i.a.render(s.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[128,2,1]]]);
//# sourceMappingURL=main.8c062ff0.chunk.js.map