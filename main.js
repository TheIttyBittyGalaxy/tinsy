let data = {
	title: "Little House",
	palettes: [
		{
			name: "outside",
			background: "rgb(68, 203, 133)",
			tiles: "rgb(255, 227, 135)",
			sprites: "rgb(255, 255, 255)",
		},
		{
			name: "indoors",
			background: "rgb(181, 124, 74)",
			tiles: "rgb(242, 254, 180)",
			sprites: "rgb(255, 255, 255)",
		},
	],
	rooms: [
		{
			name: "outdoors",
			palette: "outside",
			tiles: [
				{
					texture: "brick",
					solid: true,
					symbol: "b",
				},
				{
					texture: "window",
					solid: true,
					symbol: "w",
				},
				{
					texture: "left roof slant",
					solid: true,
					symbol: "l",
				},
				{
					texture: "right roof slant",
					solid: true,
					symbol: "r",
				},
				{
					texture: "door top",
					solid: false,
					symbol: "e",
				},
				{
					texture: "door bottom",
					solid: false,
					symbol: "f",
				},
				{
					texture: "grass",
					solid: false,
					symbol: "g",
				},
			],
			layout: [
				"                ",
				"      g         ",
				"                ",
				"          lr    ",
				"         l  r   ",
				" g      l w  r  ",
				"       lbbbbbbr ",
				"        bbbbwb  ",
				"        bebbbb  ",
				"        bfbbbb  ",
				"     g        g ",
				"                ",
				"                ",
				" g        g     ",
				"      g         ",
				"                ",
			],
			sprites: [
				{
					name: "player",
					texture: "human",
					x: 4,
					y: 7,
				},
				{
					name: "cat",
					texture: "cat",
					x: 13,
					y: 13,
					dialogue: ["You pet the kitten...", "it likes you!"],
				},
				{
					name: "flowers",
					texture: "flowers",
					x: 2,
					y: 8,
				},
			],
			exits: [
				{
					"transition-effect": "tunnel",
					x: 9,
					y: 9,
					destination: {
						room: "house",
						x: 5,
						y: 11,
					},
				},
			],
		},
		{
			name: "house",
			palette: "indoors",
			tiles: [
				{
					texture: "brick",
					solid: true,
					symbol: "b",
				},
				{
					texture: "table",
					solid: true,
					symbol: "t",
				},
				{
					texture: "chair",
					solid: false,
					symbol: "c",
				},
				{
					texture: "rug",
					solid: false,
					symbol: "r",
				},
				{
					texture: "bed top",
					solid: true,
					symbol: "u",
				},
				{
					texture: "bed bottom",
					solid: true,
					symbol: "l",
				},
				{
					texture: "double bed top left",
					solid: true,
					symbol: "e",
				},
				{
					texture: "double bed top right",
					solid: true,
					symbol: "f",
				},
				{
					texture: "double bed bottom left",
					solid: true,
					symbol: "g",
				},
				{
					texture: "double bed bottom right",
					solid: true,
					symbol: "h",
				},
			],
			layout: [
				"                ",
				"                ",
				"                ",
				"        bbbbb   ",
				"   bbbbbb efb   ",
				"   bctc   ghb   ",
				"   b        b   ",
				"   b     rr b   ",
				"   b        b   ",
				"   b   b bbbb   ",
				"   b   b   ub   ",
				"   b   b   lb   ",
				"   bb bbbbbbb   ",
				"                ",
				"                ",
				"                ",
			],
			sprites: [
				{
					name: "kid",
					texture: "human child",
					x: 9,
					y: 6,
					dialogue: ["hey! get out my room!"],
				},
				{
					name: "person",
					texture: "human adult",
					x: 10,
					y: 10,
					dialogue: ["well hello there! how are you today?"],
				},
			],
			exits: [
				{
					"transition-effect": "tunnel",
					x: 5,
					y: 12,
					destination: {
						room: "outdoors",
						x: 9,
						y: 10,
					},
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
		// Example game
		// block: "11111111\n10000001\n10000001\n10011001\n10011001\n10000001\n10000001\n11111111",
		// cat: "00000000\n00000000\n01010001\n01110001\n01110010\n01111100\n00111100\n00100100",
		// human: "00011000\n00011000\n00011000\n00111100\n01111110\n10111101\n00100100\n00100100",

		// Little House
		brick: "11101110\n11101110\n11101110\n00000000\n10111011\n10111011\n10111011\n00000000",
		"left roof slant":
			"00000001\n00000011\n00000110\n00001100\n00011000\n00110000\n01100000\n11000000",
		"right roof slant":
			"10000000\n11000000\n01100000\n00110000\n00011000\n00001100\n00000110\n00000011",
		window: "01111110\n01000010\n01000010\n01111110\n01000010\n01000010\n01111110\n00000000",
		"door top":
			"00000000\n01111110\n01000010\n01000010\n01000010\n01000010\n01000010\n01000010",
		"door bottom":
			"01001010\n01001010\n01000010\n01000010\n01000010\n01000010\n01000010\n01111110",
		grass: "00000010\n00000100\n00100100\n00010001\n00010010\n10000010\n01000010\n01000000",
		chair: "00000000\n00100000\n00100000\n00100000\n00111100\n00100100\n00100100\n00000000",
		table: "01111100\n11111110\n11111110\n01111100\n00010000\n00010000\n00111000\n00010000",
		"bed top": "10000010\n11111110\n10101010\n10101010\n11111110\n10111010\n10000010\n11111110",
		"bed bottom":
			"10000010\n10000010\n10000010\n10000010\n10000010\n11001110\n10110010\n10000010",
		"double bed top left":
			"01000000\n11100000\n01000000\n01111111\n01010101\n01010101\n01111111\n01011100",
		"double bed top right":
			"00000100\n00001110\n00000100\n11111100\n01010100\n01010100\n11111100\n01110100",
		"double bed bottom left":
			"01000000\n01111111\n01000000\n01000000\n01000000\n01100000\n01011111\n01000000",
		"double bed bottom right":
			"00000100\n11111100\n00000100\n00000100\n00000100\n00001100\n11110100\n00000100",
		rug: "10101010\n11111111\n11111111\n11111111\n11111111\n11111111\n11111111\n01010101",
		human: "00011000\n00011000\n00011000\n00111100\n01111110\n10111101\n00100100\n00100100",
		cat: "00000000\n00000000\n01010001\n01110001\n01110010\n01111100\n00111100\n00100100",
		flowers: "01000000\n11100000\n01000000\n00100100\n00101110\n01000100\n01001000\n01001000",
		"human child":
			"00000000\n00000000\n00011000\n00011000\n00111100\n01011010\n00011000\n00100100",
		"human adult":
			"00011000\n00011000\n00111100\n01011010\n00011000\n00100100\n00100100\n00100100",
	});
} else {
	model_div.classList.add("error");
	model_div.textContent = success.content;
}
