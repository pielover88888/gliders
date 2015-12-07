var Game = function(opts, player_id)
{
    var _this = this;

    var players = [];

    var board;
    var pieces = [];

    var board_rad;
    var board_diam;
    var neighbor_offsets;

    this.CELL_EMPTY = 1;
    this.CELL_EDGE = 2;
    this.CELL_WALL = 3;

    this.ACTION_MOVE = 1;
    this.ACTION_SHOOT = 2;
    this.ACTION_SPAWN = 3;

    var turn = 0;
    var players_dead = new Array(opts.num_players);
    var player_spawns = new Array(opts.num_players).fill(opts.num_spawns);
    var can_shoot = true;
    var turn_actions = [];

    this.reset_cells_callback = function() {};
    this.add_cell_callback = function() {};
    this.finalize_cells_callback = function() {};

    this.add_piece_callback = function() {};
    this.code_warning_callback = function() {};
    this.do_action_callback = function() {};
    this.remove_piece_callback = function() {};
    this.eliminate_player_callback = function() {};
    this.end_turn_callback = function() {};

    this.update_board = function(code)
    {
        var type_map = {
            'n': _this.CELL_EMPTY,
            'v': _this.CELL_EDGE,
            'w': _this.CELL_WALL,
        };
        var meta_callback = function(radius, sectors)
        {
            board_rad = radius;
            board_diam = radius * 2 + 1;
            board = new Array(board_diam * board_diam).fill(_this.CELL_EDGE);

            neighbor_offsets = [-board_diam + 1, 1, board_diam, board_diam - 1, -1, -board_diam];
            neighbor_offsets = neighbor_offsets.concat(neighbor_offsets);
        };
        var add_cell = function(x, y, type)
        {
            if (type === 'n') {type = _this.CELL_EMPTY;}
            else if (type === 'w') {type = _this.CELL_WALL;}
            else if (type !== 'v' && type)
            {
                _this.code_warning_callback('Invalid type code "' + type + '"');
                return;
            }
            else {type = _this.CELL_EMPTY;}

            var loc = _this.get_loc(x, y);
            board[loc] = type;
            _this.add_cell_callback(loc, type);
        };

        _this.reset_cells_callback();
        HexGrid.str_to_grid(code, meta_callback, add_cell, _this.code_warning_callback);
        _this.finalize_cells_callback();
    };

    this.update_formation = function(code)
    {
        var add_piece = function(x, y, type, sector)
        {
            if (type === 'n' || type === 'k')
            {
                var loc = _this.get_loc(x, y);
                var piece = make_piece(sector, loc, type === 'k');
                _this.add_piece_callback(piece);
            }
            else if (type !== 'e' && type)
            {
                _this.code_warning_callback('Invalid type code "' + type_code + '"');
            }
        };
        HexGrid.str_to_grid(code, function() {}, add_piece, _this.code_warning_callback);
    };

    this.add_player = function(player)
    {
        if (players.length >= opts.num_players)
        {
            console.error('Cannot add another player to game, already at max of ' + opts.num_players + ' players');
            return;
        }
        players.push(player);
    };

    this.remove_player = function(player)
    {
        var i = players.indexOf(player);
        if (i === -1)
        {
            return false;
        }
        else
        {
            players.splice(i, 1);
        }
    };

    this.get_piece = function(piece_id)
    {
        var piece = pieces[piece_id];
        if (typeof piece === 'undefined')
        {
            console.error('Piece with id ' + piece_id + ' does not exist.');
        }
        return piece;
    };

    this.get_piece_actions = function(piece)
    {
        if (piece.player_id !== player_id) {return [];}
        if (piece.player_id !== turn % opts.num_players) {return [];}

        var actions = [];

        var loc = piece.loc;
        for (var j = 0; j < 6; j++)
        {
            var dir = neighbor_offsets[j];
            var front_loc = loc + dir;

            // Move single cell
            if (is_move_valid(piece, front_loc))
            {
                actions.push({
                    'type': _this.ACTION_MOVE,
                    'dir': j
                });
            }

            // Check if this piece can be shot from a glider
            if (is_shoot_valid(piece, front_loc, j))
            {
                actions.push({
                    'type': _this.ACTION_SHOOT,
                    'dir': j
                });
            }

            if (is_spawn_valid(piece, front_loc))
            {
                actions.push({
                    'type': _this.ACTION_SPAWN,
                    'dir': j
                });
            }
        }

        return actions;
    };

    this.is_action_valid = function(piece, action)
    {
        if (action.dir < 0 || action.dir >= 6)
        {
            console.error('Unexpected action.dir: ' + action.dir);
            return false;
        }

        if (piece.player_id !== turn % opts.num_players) {return false;}

        var front_loc = piece.loc + neighbor_offsets[action.dir];

        if (action.type === _this.ACTION_MOVE)
        {
            return is_move_valid(piece, front_loc);
        }
        else if (action.type === _this.ACTION_SHOOT)
        {
            return is_shoot_valid(piece, front_loc, action.dir);
        }
        else if (action.type === _this.ACTION_SPAWN)
        {
            return is_spawn_valid(piece, front_loc);
        }
        else
        {
            return false;
        }
    };

    this.is_end_turn_valid = function()
    {
        return !!turn_actions.length;
    };

    var is_move_valid = function(piece, front_loc)
    {
        if (turn_actions.length) {return false;}

        if (board[front_loc] === _this.CELL_EMPTY) {return true;}
        if (piece.is_king && typeof board[front_loc] === 'object' && board[front_loc].player_id !== player_id) {return true;}
        if (typeof board[front_loc] === 'object' && board[front_loc].is_king && board[front_loc].player_id !== player_id) {return true;}

        return false;
    };
    var is_shoot_valid = function(piece, front_loc, dir)
    {
        if (!can_shoot) {return false;}

        if (board[front_loc] !== _this.CELL_EMPTY) {return false;}

        var back_right = board[piece.loc + neighbor_offsets[dir + 2]];
        if (typeof back_right !== 'object' || back_right.player_id !== player_id) {return false;}

        var back_left = board[piece.loc + neighbor_offsets[dir + 4]];
        if (typeof back_left !== 'object' || back_left.player_id !== player_id) {return false;}

        var back_center = board[piece.loc + neighbor_offsets[dir + 3]];
        if (back_center !== _this.CELL_EMPTY) {return false;}

        return true;
    };
    var is_spawn_valid = function(piece, front_loc)
    {
        if (!piece.is_king) {return false;}
        if (turn_actions.length) {return false;}
        if (!player_spawns[turn % opts.num_players]) {return false;}

        if (board[front_loc] === _this.CELL_EMPTY) {return true;}

        return false;
    };

    this.get_action_location = function(piece, action)
    {
        if (action.type === _this.ACTION_MOVE || action.type === _this.ACTION_SPAWN)
        {
            return piece.loc + neighbor_offsets[action.dir];
        }
        else if (action.type === _this.ACTION_SHOOT)
        {
            var loc = piece.loc;
            var dir_offset = neighbor_offsets[action.dir];

            do {
                loc += dir_offset;
            } while (board[loc] === this.CELL_EMPTY);

            if (typeof board[loc] !== 'object' || board[loc].player_id === player_id)
            {
                // Hit the edge or our own piece
                loc -= dir_offset;
            }

            return loc;
        }
    };

    this.do_action = function(piece, action)
    {
        if (!_this.is_action_valid(piece, action)) {return false;}

        if (action.type !== _this.ACTION_SHOOT) {can_shoot = false;}

        var dst_loc = _this.get_action_location(piece, action);
        if (typeof dst_loc === 'undefined') {return false;}

        if (board[dst_loc] === _this.CELL_EDGE)
        {
            console.error('Action destination is an edge cell');
            return false;
        }

        if (board[dst_loc] !== _this.CELL_EMPTY)
        {
            remove_piece(board[dst_loc]);
        }

        if (action.type === _this.ACTION_SPAWN)
        {
            player_spawns[piece.player_id]--;
            make_piece(piece.player_id, dst_loc, false);
        }
        else
        {
            board[piece.loc] = _this.CELL_EMPTY;
            piece.loc = dst_loc;
            board[piece.loc] = piece;
        }

        turn_actions.push(action);
        _this.do_action_callback(piece, action);

        return true;
    };

    var make_piece = function(player_id, loc, is_king)
    {
        if (board[loc] === _this.CELL_EDGE)
        {
            console.error('Make piece location is an edge cell');
            return;
        }

        if (board[loc] !== _this.CELL_EMPTY)
        {
            console.error('Make piece location is already occupied');
            return;
        }

        var piece = {
            'player_id': player_id,
            'is_king': is_king,
            'loc': loc,
            'id': pieces.length,
            'upper_player': undefined,
            'upper_is_king': false,
        };

        board[piece.loc] = piece;
        pieces.push(piece);

        return piece;
    };
    var remove_piece = function(piece)
    {
        // Update the pieces array by replacing this piece with the last piece
        var last_piece = pieces.pop();
        last_piece.id = piece.id;
        pieces[last_piece.id] = last_piece;

        board[piece.loc] = _this.CELL_EMPTY;

        _this.remove_piece_callback(piece);

        if (piece.is_king)
        {
            _this.eliminate_player_callback();
        }
    };

    this.end_turn = function()
    {
        if (!_this.is_end_turn_valid()) {return false;}

        do
        {
            turn++;
        } while (players_dead[turn % opts.num_players]);
        can_shoot = true;

        var actions = turn_actions;
        turn_actions = [];

        _this.end_turn_callback(actions);
    };

    this.get_row = function(loc)
    {
        return Math.floor(loc / board_diam) - board_rad;
    };
    this.get_col = function(loc)
    {
        return (loc % board_diam) - board_rad;
    };
    this.get_loc = function(row, col)
    {
        return (row + board_rad) * board_diam + col + board_rad;
    };

    this.get_options = function() {return opts;};
    this.get_player_id = function() {return player_id;};
    this.get_board = function() {return board;};
    this.get_pieces = function() {return pieces;};
};
