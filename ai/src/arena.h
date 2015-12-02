#ifndef ARENA_H
#define ARENA_H

#define BOARD_RAD 5
#define NUM_PLAYERS 2
#define MAX_PLAYER_PIECES 12

#include <assert.h>
#include <cstddef>
#include <climits>
#include <array>
#include <unordered_map>

class Arena
{
public:
    struct Piece
    {
        unsigned int player = static_cast<unsigned int>(-1);
        unsigned int id;
        bool is_king;

        bool is_empty() const
        {
            return player == static_cast<unsigned int>(-1);
        }
    };

    struct Move
    {
        unsigned char loc;
        unsigned char dir : 3;
        unsigned char shoot : 1;
        unsigned char dist : 4;
    };

    Arena();

    void setup();

    void compute_move(unsigned int depth);

private:
    static constexpr unsigned int grid_diam = BOARD_RAD * 2 + 1;
    static constexpr unsigned int grid_size = grid_diam * grid_diam * 2;
    static_assert(grid_size <= (1 << CHAR_BIT), "Piece locations must be able to be stored in a single char");

    typedef std::array<Piece, grid_size> Grid;
    typedef std::array<std::array<unsigned char, MAX_PLAYER_PIECES>, NUM_PLAYERS> Pieces;

    struct PiecesHasher
    {
        std::size_t operator()(const std::array<std::array<unsigned char, MAX_PLAYER_PIECES>, NUM_PLAYERS> &pieces)
        {
            constexpr unsigned int num_parts = sizeof(pieces) / sizeof(std::size_t);
            static_assert(num_parts > 0, "PiecesHasher::operator()::num_parts must be nonzero");

            std::size_t *data = reinterpret_cast<std::size_t*>(pieces.data()->data());
            std::size_t res = data[0];
            for (unsigned int i = 1; i < num_parts; i++)
            {
                res ^= data[i];
            }
            return res;
        }
    };

    Grid grid;

    Pieces pieces;
    char _padding[sizeof(std::size_t) - (sizeof(Pieces) % sizeof(std::size_t))];

    std::array<unsigned int, NUM_PLAYERS> num_pieces;

    std::unordered_map<Pieces, Move, PiecesHasher> move_cache;

    void setup_piece(unsigned int player, signed int x, signed int y, unsigned int level, bool is_king);

    unsigned int get_loc(signed int x, signed int y, unsigned int level)
    {
        assert(x >= -BOARD_RAD && x <= BOARD_RAD);
        assert(y >= -BOARD_RAD && y <= BOARD_RAD);

        unsigned int loc = (x + BOARD_RAD) * grid_diam + y + BOARD_RAD + level * grid_diam * grid_diam;
        assert(loc < grid_size);
        return loc;
    }
};

#endif // ARENA_H
