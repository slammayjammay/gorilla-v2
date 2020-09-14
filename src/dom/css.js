module.exports = `
body {
	margin: 0;
}

#gorilla {
	font-family: monospace;
	font-size: 12px;
	padding: 20px;
}

* {
	font-family: inherit;
}

button {
	background: white;
}

.middle {
	vertical-align: middle;
}

details {
	padding: 4px;
	margin: 0.5em 0;
}
details[open] {
	border: 1px solid gray;
	background: white;
}
details summary {
	display: inline-block;
	cursor: pointer;
	font-size: 1.2em;
}

.editor-container {
	resize: vertical;
	min-width: 400px;
	min-height: 200px;
	width: 100%;
}

.tab-hrefs {
	max-width: 300px;
}

.storage-container {
	position: relative;
}
.storage-container textarea {
	z-index: -1;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

button {
	border: 1px solid #8e8e8e;
	border-radius: 4px;
}

button:not([disabled]) {
	cursor: pointer;
}

.scripts pre {
	padding: 8px;
	background: black;
	color: white;
	white-space: pre-wrap;
}
.scripts .preview {
	white-space: pre;
	overflow: scroll;
}
pre .userscript {
	color: yellow;
}
pre .error {
	background: red;
}

.scripts:not(.editing) form {
	display: none;
}
.scripts.editing > *:not(form) {
	display: none;
}

.scripts-list, .item {
	list-style: none;
}

.scripts-list {
	display: grid;
	grid-template-columns: repeat(auto-fit, 150px);
	grid-auto-rows: 1fr;
	grid-gap: 16px;
	margin: 10px 0 0 0;
	padding: 0;
}

.scripts .script-item {
	position: relative;
}

.scripts .script-item .actions {
	transform: scale(0.8);
	opacity: 0;
	transition: transform 0.13s, opacity 0.1s;
	position: absolute;
	top: 4px;
	left: 4px;
	display: flex;
	flex-direction: column;
}

.scripts .script-item .actions button {
	transform: scale(1);
	transition: transform 0.1s;
	padding: 0 4px;
}

.scripts .script-item .actions button:hover {
	transform: scale(1.2);
}

.scripts .script-item .actions button:not(:first-child) {
	margin-top: 2px;
}

.scripts .script-item:hover .actions {
	transform: scale(1);
	opacity: 1;
}

.scripts .script-item .script-button {
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

.scripts .script-item .script-button::after {
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

.scripts .script-item:hover button::after {
	opacity: 1;
}

.scripts .script-item[data-script-status="success"] .script-button { border: 2px solid #00ca00; }
.scripts .script-item[data-script-status="error"] .script-button { border: 2px dashed red; }

.script-item.create {
	order: 1;
}
.script-item.create .script-button {
	background: #00a200;
}

.scripts form {
	backdrop-filter: blur(10px);
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.75);
}
.scripts form .scrollable {
	overflow: scroll;
	display: flex;
	flex-direction: column;
}

.scripts form button {
	padding: 5px 10px;
}

.script-info:not([data-script-status]) {
	display: none;
}

input {
	box-sizing: border-box;
	border-radius: 5px;
	border: 1px solid #333;
	padding: 5px 10px;
}
input[type="radio"] {
	margin-top: 0;
}
`;
