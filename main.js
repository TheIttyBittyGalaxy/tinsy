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
					texture: "wall",
					solid: true,
					symbol: "w",
				},
				{
					texture: "floor",
					solid: false,
					symbol: "_",
				},
			],
			layout: [
				"________________",
				"_wwwwwwwwwwwwww_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_w____________w_",
				"_wwwwwwwwwwwwww_",
				"________________",
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
const result = parser.parse(data);

const input_div = document.getElementById("input");
const model_div = document.getElementById("model");
const output_div = document.getElementById("output");

input_div.textContent = JSON.stringify(data, null, 2);
if (result.success) {
	model_div.textContent = JSON.stringify(
		{
			title: result.content.title,
			textures: result.content.textures,
			tiles: result.content.tiles,
			rooms: result.content.rooms,
			sprites: result.content.sprites,
			palettes: result.content.palettes,
		},
		null,
		2
	);
	output_div.textContent = parser.generate({
		wall: "11111111\n10000001\n10000001\n10011001\n10011001\n10000001\n10000001\n11111111",
		floor: "00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000",
	});
} else {
	model_div.classList.add("error");
	model_div.textContent = result.content;
}
