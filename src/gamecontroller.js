var GameController = function(game, primus)
{
    var _this = this;

    var player_id = game.get_player_id();

    var primus;

    var init = function()
    {
        primus.on('data', handle_data);
    };

    var handle_data = function(data)
    {
        if (typeof data !== 'object') {return;}

        if (data.q === 'turn')
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
        }

        var check = function(flag)
        {
            if (!flag)
            {
                console.error('Received invalid data: ' + JSON.stringify(data));
            }
            return flag;
        };
    };

    Util.add_callback(game, 'end_turn_callback', function(actions)
    {
        primus.write({
            'q': 'turn',
            'player_id': player_id,
            'actions': actions
        });
    });

    this.get_game = function() {return game;};

    init();
};
