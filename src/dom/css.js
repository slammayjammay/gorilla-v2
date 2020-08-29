module.exports = `
#gorilla {
	font-family: monospace;
	font-size: 12px;
}

.gorilla-window {
	position: fixed;
	z-index: 99999999999999999;
	top: 0;
	left: 0;
	border-radius: 4px;
	overflow: hidden;
	box-shadow: rgba(0, 0, 0, 0.6) 0px 0px 16px;
}

#gorilla * {
	font-family: inherit;
	font-size: inherit;
}

#gorilla small {
	font-size: smaller;
}

#gorilla p {
	margin: 1em 0;
}

#gorilla button {
	background: white;
}

#gorilla a {
	color: -webkit-link;
}

#gorilla details {
	padding: 4px;
	margin: 0.1em 0;
}
#gorilla details[open] {
	border: 1px solid gray;
	background: white;
}
#gorilla details summary {
	display: inline-block;
	cursor: pointer;
	font-size: 1.2em;
}

#gorilla .bar {
	background: #bbb;
	cursor: move;
	user-select: none;
	padding: 4px;
	display: block;
}

#gorilla button {
	border: 1px solid #8e8e8e;
	border-radius: 4px;
}

#gorilla button:not([disabled]) {
	cursor: pointer;
}

#gorilla .bar .control-button {
	font-size: 1.4em;
	display: inline-block;
	vertical-align: middle;
	padding: 0 6px;
}

#gorilla .bar .slider {
	width: 26px;
	height: 6px;
	transform: rotate(-90deg);
	cursor: ns-resize;
	padding: 0;
}

#gorilla .resizeable {
	position: relative;
	resize: both;
	overflow: scroll;
	background: white;
	min-width: 232px;
	min-height: 160px;
}

#gorilla .resizeable {
	width: 530px;
	height: 320px;
}

#gorilla .scripts pre {
	padding: 8px;
	background: black;
	color: white;
	white-space: pre-wrap;
}
#gorilla pre .userscript {
	color: yellow;
}
#gorilla pre .error {
	background: red;
}

#gorilla .scripts:not(.editing) form {
	display: none;
}

#gorilla .scripts .blur {
	padding: 16px;
}

#gorilla .scripts.editing .blur {
	filter: blur(12px);
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}

#gorilla .scripts-list, #gorilla .item {
	list-style: none;
}

#gorilla .scripts-list {
	display: grid;
	grid-template-columns: repeat(auto-fit, 150px);
	grid-auto-rows: 1fr;
	grid-gap: 16px;
	margin: 10px 0 0 0;
	padding: 0;
}

#gorilla .scripts .script-item {
	position: relative;
}

#gorilla .scripts .script-item .actions {
	transform: scale(0.8);
	opacity: 0;
	transition: transform 0.13s, opacity 0.1s;
	position: absolute;
	top: 4px;
	left: 4px;
	display: flex;
	flex-direction: column;
}

#gorilla .scripts .script-item .actions button {
	transform: scale(1);
	transition: transform 0.1s;
	padding: 0 4px;
}

#gorilla .scripts .script-item .actions button:hover {
	transform: scale(1.2);
}

#gorilla .scripts .script-item .actions button:not(:first-child) {
	margin-top: 2px;
}

#gorilla .scripts .script-item:hover .actions {
	transform: scale(1);
	opacity: 1;
}

#gorilla .scripts .script-item .script-button {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
	border: 2px solid transparent;
	border-radius: 8px;
	background: gray;
	color: white;
	padding: 8px 22px;
	box-sizing: border-box;
	outline: none;
}

#gorilla .scripts .script-item .script-button::after {
	opacity: 0;
	transition: opacity 0.2s;
	pointer-events: none;
	display: block;
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(transparent, rgba(0, 0, 0, 0.2));
}

#gorilla .scripts .script-item:hover button::after {
	opacity: 1;
}

#gorilla .scripts .script-item[data-script-status="success"] .script-button { border: 2px solid #00ca00; }
#gorilla .scripts .script-item[data-script-status="error"] .script-button { border: 2px dashed red; }

#gorilla .script-item.create {
	order: 1;
}
#gorilla .script-item.create .script-button {
	background: #00a200;
}

#gorilla .scripts form {
	position: relative;
	margin: auto;
	padding: 40px;
	background: rgba(255, 255, 255, 0.75);
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}

#gorilla .scripts form button {
	padding: 5px 10px;
}

#gorilla input {
	box-sizing: border-box;
	border-radius: 5px;
	border: 1px solid #333;
	padding: 5px 10px;
}

#gorilla .scripts .label-row {
	display: flex;
	justify-content: space-between;
	margin: 1em 0;
}

#gorilla .scripts form .monaco-container {
	flex-grow: 1;
	resize: none;
	min-height: 200px;
}
`;
