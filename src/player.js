var Player = module.exports = function(spark)
{
    var _this = this;

    var spark;
    var name;

    var games = [];

    var error = function(msg)
    {
        spark.write({
            'q': 'error',
            'msg': msg
        });
        console.error(msg);
    };

    spark.on('data', function(data)
    {
        if (data.q === 'login' && typeof data.name === 'string' && typeof name === 'undefined')
        {
            name = data.name;
            spark.write({
                'q': 'logged_in'
            });
        }

        if (!name) {return;}

        if (data.q === 'join')
        {
            var game = games[data.game_id];
            if (typeof game === 'undefined')
            {
                error('Game with id ' + data.game_id + ' does not exist');
                return;
            }

            game.add_player(name, spark);
        }
        else if (data.q === 'action')
        {
            var game = games[data.game_id];
            if (typeof game === 'undefined')
            {
                error('Game with id ' + data.game_id + ' does not exist');
                return;
            }

            game.do_action(data);
        }
    });

    spark.on('end', function()
    {
        for (var i = 0; i < games.length; i++)
        {
            games[i].remove_player(_this);
        }
    });
};
