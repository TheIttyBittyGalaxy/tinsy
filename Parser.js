const rgb_regex = /rgb\((\d+), ?(\d+), ?(\d+)\)/;

class Parser {
	game = new Game();
	errors = [];

	next_palette = 0;
	next_room = 0;
	next_tile = 0;
	next_sprite = 0;

	parse(schema) {
		this.game = new Game();
		this.errors = [];
		this.next_palette = 0;
		this.next_room = 0;
		this.next_tile = parseInt("a", 36);
		this.next_sprite = parseInt("a", 36);

		this.parse_game(schema, "game");
		return this.errors.length == 0;
	}

	// PARSE SCHEMA

	parse_game(schema, path) {
		const game = this.game;

		if (!this.verify_is_object(schema, path)) return;
		this.verify_no_extra_fields(schema, path, ["title", "palettes", "rooms"]);

		if (this.verify_is_string(schema.title, `${path}.title`)) game.title = schema.title;

		const palettes_path = `${path}.palettes`;
		if (this.verify_is_array(schema.palettes, palettes_path)) {
			for (let i = 0; i < schema.palettes.length; i++) {
				const palette_schema = schema.palettes[i];
				const palette = this.parse_palette(palette_schema, `${palettes_path}[${i}]`);
				game.palettes.push(palette);
				this.declare(game.lookup.palettes, palette);
			}
		}

		const rooms_path = `${path}.rooms`;
		if (this.verify_is_array(schema.rooms, rooms_path)) {
			for (let i = 0; i < schema.rooms.length; i++) {
				const room_schema = schema.rooms[i];
				const room = this.parse_room(room_schema, `${rooms_path}[${i}]`);
				game.rooms.push(room);
				this.declare(game.lookup.rooms, room);
			}
		}
	}

	parse_palette(schema, path) {
		const palette = new Palette();

		if (!this.verify_is_object(schema, path)) return;
		this.verify_no_extra_fields(schema, path, ["name", "background", "tiles", "sprites"]);

		if (this.verify_is_string(schema.name, `${path}.name`)) palette.name = schema.name;

		palette.background = this.parse_rgb_string(schema.background, `${path}.background`);
		palette.tiles = this.parse_rgb_string(schema.tiles, `${path}.tiles`);
		palette.sprites = this.parse_rgb_string(schema.sprites, `${path}.sprites`);

		palette.id = this.get_next_palette();
		return palette;
	}

	parse_rgb_string(str, path) {
		const match = str.match(rgb_regex);

		if (!match || match.length != 4) {
			// TODO: Emit an error
			return;
		}

		// TODO: Emit an error if any of the values are outside the range 0-255

		return {
			r: parseInt(match[1]),
			g: parseInt(match[2]),
			b: parseInt(match[3]),
		};
	}

	parse_room(schema, path) {
		const room = new Room();

		if (!this.verify_is_object(schema, path)) return;
		this.verify_no_extra_fields(schema, path, [
			"name",
			"palette",
			"tiles",
			"layout",
			"sprites",
		]);

		if (this.verify_is_string(schema.name, `${path}.name`)) room.name = schema.name;
		if (this.verify_is_palette(schema.palette, `${path}.palette`))
			room.palette = schema.palette;

		const tile_lookup = this.parse_room_tiles(schema.tiles, `${path}.tiles`);
		room.tiles = this.parse_layout(schema.layout, `${path}.layout`, tile_lookup);

		// TODO: Parse sprites

		room.id = this.get_next_room();
		return room;
	}

	parse_room_tiles(room_schema, room_path) {
		const tile_lookup = {};
		for (let i = 0; i < room_schema.length; i++) {
			const schema = room_schema[i];
			const path = `${room_path}[${i}]`;

			if (!this.verify_is_object(schema, path)) continue;
			this.verify_no_extra_fields(schema, path, ["texture", "solid", "symbol"]);

			// FIXME: Verify that symbol is a single character
			const valid_symbol = this.verify_is_string(schema.symbol, `${path}.symbol`);
			const valid_texture = this.verify_is_string(schema.texture, `${path}.texture`);
			const valid_solid = this.verify_is_bool(schema.solid, `${path}.solid`);

			if (!valid_symbol || !valid_texture) continue;

			const symbol = schema.symbol;
			if (tile_lookup[symbol]) {
				// FIXME: Emit an error
				continue;
			}

			if (valid_texture) {
				const texture = schema.texture;
				const solid = schema.solid == true;

				const name = solid ? `${texture} (wall)` : texture;
				if (this.game.lookup.tiles[name]) {
					tile_lookup[symbol] = this.game.lookup.tiles[name];
					continue;
				}

				const tile = new Tile();
				tile.name = name;
				tile.id = name.charAt(0);
				tile.texture = texture;
				tile.wall = solid;

				tile.id = this.get_next_tile();

				this.game.tiles.push(tile);
				this.declare(this.game.lookup.tiles, tile);

				tile_lookup[symbol] = tile.id;
			}
		}
		return tile_lookup;
	}

	parse_layout(schema, path, tile_lookup) {
		// FIXME: Implement error checking on this input
		let tiles = "";
		for (let i = 0; i < 16; i++) {
			const row = schema[i];
			for (let j = 0; j < 16; j++) {
				const symbol = row[j];
				tiles += symbol == " " ? "0" : tile_lookup[symbol];
				if (!(i == 15 && j == 15)) tiles += j == 15 ? "\n" : ",";
			}
		}
		return tiles;
	}

	declare(lookup_table, obj) {
		const name = obj.name;
		if (!name) return; // Error will have already been given when the value was found not to have a valid name
		if (lookup_table[name]) {
			// TODO: Emit an error
			return;
		}
		lookup_table[name] = obj.id;
	}

	// VERIFY SCHEMA

	verify_is_object(value, path) {
		// TODO: Implement
		return true;
	}

	verify_is_array(value, path) {
		// TODO: Implement
		return true;
	}

	verify_is_string(value, path) {
		// TODO: Implement
		return true;
	}

	verify_is_bool(value, path) {
		// TODO: Implement
		return true;
	}

	verify_is_palette(value, path) {
		// TODO: Implement
		return true;
	}

	verify_no_extra_fields(value, path, fields) {
		// TODO: Implement
		return true;
	}

	// GET OBJECT ID

	get_next_palette() {
		const id = this.next_palette.toString(36);
		this.next_palette++;
		return id;
	}

	get_next_room() {
		const id = this.next_room.toString(36);
		this.next_room++;
		return id;
	}

	get_next_tile() {
		const id = this.next_tile.toString(36);
		this.next_tile++;
		return id;
	}

	get_next_sprite() {
		const id = this.next_sprite.toString(36);
		this.next_sprite++;
		if (id == "A") return this.get_next_sprite(); // "A" is reserved for the avatar
		return id;
	}

	// GENERATE GAME

	generate(textures) {
		const game = this.game;
		let data = "";

		function write(str) {
			data += str;
		}

		function print(str) {
			data += (str || "") + "\n";
		}

		// FRONT MATTER
		print(game.title);
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
		for (const palette of game.palettes) {
			print(`PAL ${palette.id}`);
			print(`${palette.background.r},${palette.background.g},${palette.background.b}`);
			print(`${palette.tiles.r},${palette.tiles.g},${palette.tiles.b}`);
			print(`${palette.sprites.r},${palette.sprites.g},${palette.sprites.b}`);
			print(`NAME ${palette.name}`);
			print();
		}

		// ROOMS
		for (const room of game.rooms) {
			print(`ROOM ${room.id}`);
			print(room.tiles);
			print(`NAME ${room.name}`);
			print(`PAL ${room.palette}`);
			print();
		}

		// TILES
		for (const tile of game.tiles) {
			print(`TIL ${tile.id}`);
			print(textures[tile.texture]);
			print(`NAME ${tile.name}`);
			if (tile.wall) print("WAL true");
			print();
		}

		return data;
	}
}
