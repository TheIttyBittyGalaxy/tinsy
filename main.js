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
			sprites: {
				player: {
					texture: "human",
					x: 5,
					y: 5,
				},
				cat: {
					texture: "cat",
					x: 8,
					y: 12,
					dialogue: ["I'm a cat"],
				},
			},
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
	model_div.textContent = JSON.stringify(
		{
			title: parser.game.title,
			textures: parser.game.textures,
			tiles: parser.game.tiles,
			rooms: parser.game.rooms,
			sprites: parser.game.sprites,
			palettes: parser.game.palettes,
		},
		null,
		2
	);
	output_div.textContent = parser.generate({
		block: "11111111\n10000001\n10000001\n10011001\n10011001\n10000001\n10000001\n11111111",
	});
} else {
	model_div.classList.add("error");
	model_div.textContent = success.content;
}
