class Parser {
	parse(game) {
		this.model = {
			title: "",
			textures: [],
			tiles: [],
			rooms: [],
			sprites: [],
			palettes: [],

			tile_lookup: {},
			room_lookup: {},
			sprite_lookup: {},
			palette_lookup: {},
		};
		this.errors = [];

		this.model.tiles.push({ null: true }); // The 'null tile'

		this.parse_game(game);

		if (this.errors.length > 0) {
			return {
				success: false,
				content: capitalise(
					(this.errors.length == 1 ? "there is an error " : "there are errors ") +
						"in the program. " +
						this.errors.join("\n\n")
				),
			};
		}

		this.model.textures = [...new Set(this.model.textures)];

		return {
			success: true,
			content: this.model,
		};
	}

	parse_game(game) {
		if (typeof game != "object") {
			this.errors.push("the provided input is not a JSON object.");
			return;
		} else if (Array.isArray(game)) {
			this.errors.push("the root object of the program must be a JSON object.");
			return;
		}

		const missing_fields = [];
		const invalid_fields = [];

		if (!game.title) {
			missing_fields.push('a string field "title" that specifies the name of the game');
		} else {
			this.model.title = game.title;
		}

		if (!game.palettes) {
			missing_fields.push(
				'an array field "palettes" that stores all of the game\'s colour palettes'
			);
		} else {
			this.parse_palettes(game.palettes);
		}

		if (!game.rooms) {
			missing_fields.push('an array field "rooms" that stores all of the game\'s rooms');
		} else {
			this.parse_rooms(game.rooms);
		}

		for (const key in game) {
			if (Object.hasOwnProperty.call(game, key)) {
				if (["title", "palettes", "rooms"].indexOf(key) == -1)
					invalid_fields.push(`"${key}"`);
			}
		}

		const missing_count = missing_fields.length;
		const invalid_count = invalid_fields.length;
		const error_count = missing_count + invalid_count;
		if (error_count > 0) {
			let error = "the root object ";

			if (missing_count > 0) {
				error += "should have " + join_with_and(missing_fields) + ". ";
			}

			if (invalid_count > 0) {
				error +=
					(missing_count > 0 ? "additionally, it " : "") +
					"should not have the " +
					join_with_and(invalid_fields) +
					(invalid_count == 1 ? " field. " : " fields. ");
			}

			this.errors.push(error);
		}
	}

	parse_palettes(palettes) {
		if (typeof palettes != "object" || !Array.isArray(palettes)) {
			this.errors.push("the palettes field should be an array of palette objects.");
			return;
		}

		for (let i = 0; i < palettes.length; i++) {
			const palette = palettes[i];
			this.parse_palette(palette, i);
		}
	}

	parse_palette(palette, i) {
		if (typeof palette != "object") {
			this.errors.push(
				"entry number " + (i + 1) + " of the palettes array is not a palette object."
			);
			return;
		}

		let palette_name = palette.name
			? `the "${palette.name}" palette`
			: `palette number ${i + 1}`;

		const fields_error = assert_fields(palette, ["name", "background", "tiles", "sprites"]);
		if (fields_error) this.errors.push(palette_name + fields_error);

		let palette_object = {};
		palette_object.name = palette_name;

		const invalid_colors = [];
		const rgb_regex = /rgb\((\d+), ?(\d+), ?(\d+)\)/;
		for (const color_name of ["background", "tiles", "sprites"]) {
			const color = palette[color_name];
			if (!color) continue;
			const match = color.match(rgb_regex);

			if (!match || match.length != 4) {
				invalid_colors.push(color_name);
				continue;
			}

			palette_object[color_name] = {
				r: parseInt(match[1]),
				g: parseInt(match[2]),
				b: parseInt(match[3]),
			};
		}

		// FIXME: throw a meaningful error if there are colours with an invalid syntax
		// FIXME: throw a meaningful error if any values of an RGB colour fall outside the range 0-255

		if (!palette.name) return;

		palette_object.name = palette.name;

		if (this.model.palette_lookup[palette.name]) {
			this.errors.push(
				`entry number ${i + 1} of the palettes array cannot be named "${
					palette.name
				}", as another palette is already using that name.`
			);
			return;
		}

		palette_object.index = Object.keys(this.model.palettes).length;
		this.model.palettes.push(palette_object);
		this.model.palette_lookup[palette.name] = palette_object;
	}

	parse_rooms(rooms) {
		if (typeof rooms != "object" || !Array.isArray(rooms)) {
			this.errors.push("the rooms field should be an array of room objects.");
			return;
		}

		for (let i = 0; i < rooms.length; i++) {
			const room = rooms[i];
			this.parse_room(room, i);
		}
	}

	parse_room(room) {
		if (typeof room != "object") {
			this.errors.push(
				"entry number " + (i + 1) + " of the rooms array is not a room object."
			);
			return;
		}

		let room_name = room.name ? `the "${room.name}" room` : `room number ${i + 1}`;

		let room_obj = {};

		// FRONT MATTER
		room_obj.name = room.name;
		room_obj.palette = room.palette;

		// FIXME: Throw an error if the palette doesn't exist!

		// TILES
		let tile_lookup = {};
		for (let i = 0; i < room.tiles.length; i++) {
			const tile = room.tiles[i];
			const tile_obj = this.create_tile(tile);
			tile_lookup[tile.symbol] = tile_obj;

			// FIXME: Throw error if symbols clash
			// FIXME: Throw error if symbol is invalid
		}

		// LAYOUT
		room_obj.tiles = [];
		for (let i = 0; i < 16; i++) {
			const row = room.layout[i];
			for (let j = 0; j < 16; j++) {
				const symbol = row[j];
				const tile = tile_lookup[symbol].index;
				room_obj.tiles.push(tile);
			}
		}

		room_obj.index = Object.keys(this.model.rooms).length;
		this.model.room_lookup[room_name] = room_obj;
		this.model.rooms.push(room_obj);
	}

	create_tile(tile) {
		let tile_name = tile.texture + (tile.solid ? " (wall)" : "");
		if (this.model.tile_lookup[tile_name]) return this.model.tile_lookup[tile_name];

		const tile_obj = {
			name: tile_name,
			texture: tile.texture,
			wall: tile.solid,
			index: Object.keys(this.model.tiles).length,
		};

		this.model.tile_lookup[tile_name] = tile_obj;
		this.model.tiles.push(tile_obj);

		this.model.textures.push(tile.texture);

		return tile_obj;
	}

	generate(textures) {
		let data = "";
		function print(line) {
			data += (line || "") + "\n";
		}

		// FRONT MATTER
		print(this.model.title);
		print();

		print("# BITSY VERSION 8.4");
		print();

		print("! VER_MAJ 8");
		print("! VER_MIN 4");
		print("! ROOM_FORMAT 1");
		print("! DLG_COMPAT 0");
		print("! TXT_MODE 0");
		print();

		// PALETTES
		function print_color(c) {
			print(c.r + "," + c.g + "," + c.b);
		}

		for (let i = 0; i < this.model.palettes.length; i++) {
			const palette = this.model.palettes[i];
			print("PAL " + i);
			print_color(palette.background);
			print_color(palette.tiles);
			print_color(palette.sprites);
			print("NAME " + palette.name);
			print();
		}

		// ROOMS
		for (let i = 0; i < this.model.rooms.length; i++) {
			const room = this.model.rooms[i];
			print("ROOM " + i);
			for (let i = 0; i < 256; i++) {
				data += room.tiles[i].toString(36);
				if (i % 16 == 15) print();
				else data += ",";
			}
			print("NAME " + room.name);
			print("PAL " + this.model.palette_lookup[room.palette].index);
			print();
		}

		// TILES
		for (let i = 1; i < this.model.tiles.length; i++) {
			const tile = this.model.tiles[i];
			console.log(i, tile);
			print("TIL " + tile.index.toString(36));
			print(textures[tile.texture]);
			print("NAME " + tile.name);
			if (tile.wall) print("WAL true");
			print();
		}

		return data;
	}
}
