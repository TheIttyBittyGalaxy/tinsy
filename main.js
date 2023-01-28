let data = {
	title: "Example game",
	palettes: [
		{
			name: "blueprint",
			background: "rgb(0, 82, 204)",
			tiles: "rgb(128, 159, 255)",
			sprites: "rgb(255, 255, 255)",
		},
	],
	rooms: [
		{
			name: "Example room",
			palette: "blueprint",
			tiles: [
				{
					texture: "block",
					solid: false,
					symbol: "b",
				},
			],
			layout: [
				"                ",
				" bbbbbbbbbbbbbb ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" b            b ",
				" bbbbbbbbbbbbbb ",
				"                ",
			],
			sprites: [
				{
					name: "player",
					texture: "human",
					x: 4,
					y: 4,
				},
				{
					name: "cat",
					texture: "cat",
					x: 8,
					y: 12,
					dialogue: ["I'm a cat"],
				},
			],
		},
	],
};

const parser = new Parser();
const success = parser.parse(data);

const input_div = document.getElementById("input");
const model_div = document.getElementById("model");
const output_div = document.getElementById("output");

input_div.textContent = JSON.stringify(data, null, 2);
if (success) {
	model_div.textContent = JSON.stringify(parser.game, null, 2);
	output_div.textContent = parser.generate({
		block: "11111111\n10000001\n10000001\n10011001\n10011001\n10000001\n10000001\n11111111",
		cat: "00000000\n00000000\n01010001\n01110001\n01110010\n01111100\n00111100\n00100100",
		human: "00011000\n00011000\n00011000\n00111100\n01111110\n10111101\n00100100\n00100100",
	});
} else {
	model_div.classList.add("error");
	model_div.textContent = success.content;
}
