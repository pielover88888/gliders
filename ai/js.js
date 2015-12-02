
var compute_move = function(board, layers, alpha, beta, good_pieces, bad_pieces, can_move)
{
    if (layers <= 0)
    {
        // TODO: better position evaluator
        return [good_pieces.length - bad_pieces.length, []];
    }

    //var player = layers % 2;
    var player = good_pieces[0][PIECE_PLAYER];

    var layers_m1 = layers - 1;
    var layers_m8 = layers - 8;

    var result = [-Infinity, []];

    for (var i = 0; i < good_pieces.length; i++)
    {
        var piece = good_pieces[i];
        var loc = piece[PIECE_LOC];
        for (var j = 0; j < 6; j++)
        {
            var dir = neighbor_offsets[j];
            var front_loc = loc + dir;
            if (board[front_loc] === CELL_EMPTY)
            {
                board[loc] = CELL_EMPTY;

                if (can_move)
                {
                    // Try moving
                    piece[PIECE_LOC] = front_loc;
                    board[front_loc] = piece;

                    var res = compute_move(board, layers_m8, -beta, -alpha, bad_pieces, good_pieces, true);
                    res[0] = -res[0];
                    if (res[0] > alpha)
                    {
                        alpha = res[0];
                        if (alpha > beta)
                        {
                            return result;
                        }
                    }
                    if (res[0] > result[0])
                    {
                        result = res;
                        result[1].push(loc * 12 + j * 2);
                    }

                    board[front_loc] = CELL_EMPTY;
                }

                // Check if this piece can be shot from a glider
                var back_right = board[loc + neighbor_offsets[j + 2]];
                if (typeof back_right === 'object' && back_right[PIECE_PLAYER] === player)
                {
                    var back_left = board[loc + neighbor_offsets[j + 4]];
                    if (typeof back_left === 'object' && back_left[PIECE_PLAYER] === player)
                    {
                        var back_center = board[loc + neighbor_offsets[j + 3]];
                        if (back_center === CELL_EMPTY)
                        {
                            // Try shooting
                            do {
                                front_loc += dir;
                            } while (board[front_loc] === CELL_EMPTY);

                            var prev_cell = board[front_loc];
                            var last_bad;
                            if (typeof prev_cell === 'object' && prev_cell[PIECE_PLAYER] !== player)
                            {
                                // Hit a bad piece, so remove it (replace it with the last bad piece)
                                last_bad = bad_pieces[bad_pieces.length - 1];
                                bad_pieces[prev_cell[PIECE_ID]] = last_bad;
                                last_bad[PIECE_ID] = prev_cell[PIECE_ID];
                                bad_pieces.pop();
                            }
                            else
                            {
                                // Hit the edge or our own piece
                                front_loc -= dir;
                            }

                            piece[PIECE_LOC] = front_loc;
                            board[front_loc] = piece;

                            var res = compute_move(board, layers_m1, alpha, beta, good_pieces, bad_pieces, false);
                            if (res[0] > alpha)
                            {
                                alpha = res[0];
                                if (alpha > beta)
                                {
                                    return result;
                                }
                            }
                            if (res[0] > result[0])
                            {
                                result = res;
                                result[1].push(loc * 12 + j * 2 + 1);
                            }

                            board[front_loc] = prev_cell;
                            if (typeof prev_cell === 'object' && prev_cell[PIECE_PLAYER] !== player)
                            {
                                // Replace bad piece
                                last_bad[PIECE_ID] = bad_pieces.length;
                                bad_pieces.push(last_bad);
                                bad_pieces[prev_cell[PIECE_ID]] = prev_cell;
                            }
                        }
                    }
                }

                piece[PIECE_LOC] = loc;
                board[loc] = piece;
            }
            else if (board[front_loc][PIECE_KING] && board[front_loc][PIECE_PLAYER] !== player)
            {
                // Can jump the king
                return [Infinity];
            }
        }
    }

    var res = compute_move(board, layers_m8, -beta, -alpha, bad_pieces, good_pieces, true);
    if (res[0] > alpha)
    {
        alpha = res[0];
        if (alpha > beta)
        {
            return result;
        }
    }
    res[0] = -res[0];
    if (res[0] > result[0])
    {
        result = res;
        result[1].push(-1);
    }

    return result;
};
