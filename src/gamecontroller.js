var Util = require('./util.js');

module.exports = function(game, remote)
{
    var _this = this;


    var init = function()
    {
    };

    var check = function(flag)
    {
        if (!flag)
        {
            console.error('Received invalid data: ' + JSON.stringify(data));
        }
        return flag;
    };
    remote.register_handler('turn', function(data)
    {
        if (!check(typeof data.player_id === 'number')) {return;}
        if (!check(typeof data.actions === 'object')) {return;}

        if (data.player_id !== player_id) {return;}

        for (var i = 0; i < data.actions.length; i++)
        {
            var piece = check(_this.get_piece(action.piece_id));
            if (!piece) {return;}
            check(game.do_action(piece, data.actions[i]));
        }
        check(game.end_turn());
    });

    Util.add_callback(game, 'end_turn_callback', function(actions)
    {
        remote.write({
            'q': 'turn',
            'player_id': player_id,
            'actions': actions
        });
    });

    this.get_game = function() {return game;};

    init();
};
