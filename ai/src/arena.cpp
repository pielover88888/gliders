#include "arena.h"

Arena::Arena()
    : pieces{}
    , _padding{}
    , num_pieces{}
{}

void Arena::setup()
{
    setup_piece(0, -2, 3, 0, false);
    setup_piece(0, -2, 2, 0, false);
    setup_piece(0, -2, 1, 0, false);
    setup_piece(0, -2, 0, 0, false);
    setup_piece(0, -2, -1, 0, false);
    setup_piece(0, -3, 4, 0, false);
    setup_piece(0, -3, 3, 0, false);
    setup_piece(0, -3, 0, 0, false);
    setup_piece(0, -3, -1, 0, false);
    setup_piece(0, -4, 4, 0, false);
    setup_piece(0, -4, 2, 0, true);
    setup_piece(0, -4, 0, 0, false);

    setup_piece(1, 2, -3, 0, false);
    setup_piece(1, 2, -2, 0, false);
    setup_piece(1, 2, -1, 0, false);
    setup_piece(1, 2, 0, 0, false);
    setup_piece(1, 2, 1, 0, false);
    setup_piece(1, 3, -4, 0, false);
    setup_piece(1, 3, -3, 0, false);
    setup_piece(1, 3, 0, 0, false);
    setup_piece(1, 3, 1, 0, false);
    setup_piece(1, 4, -4, 0, false);
    setup_piece(1, 4, -2, 0, true);
    setup_piece(1, 4, 0, 0, false);
}

void Arena::setup_piece(unsigned int player, signed int x, signed int y, unsigned int level, bool is_king)
{
    unsigned int loc = get_loc(x, y, level);
    unsigned int piece_id = num_pieces[player]++;
    assert(piece_id < MAX_PLAYER_PIECES);

    Piece &piece = grid[loc];
    assert(piece.is_empty());
    piece.player = player;
    piece.id = piece_id;
    piece.is_king = is_king;

    pieces[player][piece_id] = loc;
}

void Arena::compute_move(unsigned int depth)
{
    std::unordered_map<Pieces, Move, PiecesHasher>::const_iterator cache = move_cache.find(pieces);
    if (cache != move_cache.cend())
    {

    }
}
