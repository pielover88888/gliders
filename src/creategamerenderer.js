var CreateGameRenderer = function(remote, game)
{
    var editable = !game;
    if (editable)
    {
        game = {
            'board': '5',
            'formation': '5 3 e e e e e e n e e e n e e n n n e e n e k e e e n e n n e n n e e',
            'options': 'spawns=2',
            'player_names': [],
        };
    }

    // Formations:
    // 5/5 3 e e e e e e n e e e n e e n n n e e n e k e e e n e n n e n n e e
    // 5/3 3 e e e e e e e k/spawns=10

    var html = '';
    html += '<div class="open_game_summary">'
        html += '<span class="open_game_players_list">';
            for (var i = 0; i < game.player_names.length; i++)
            {
                html += '<span class="open_game_player">' + Util.escape_text(game.player_names[i]) + '</span>';
            }
            /*
            html += '<span class="open_game_players_have"></span>';
            html += ' / ';
            html += '<span class="open_game_players_need"></span>';
            */
        html += '</span>';
        html += '<span class="open_game_timer"></span>'
    html += '</div>';
    html += '<div class="open_game_details">';
        html += '<span class="text_input_label">Board code: </span>';
        html += '<span class="open_game_board text_input"' + (editable ? ' contenteditable="true"' : '') + '>' + Util.escape_text(game.board) + '</span>';
        html += '<br />';
        html += '<span class="text_input_label">Formation code: </span>';
        html += '<span class="open_game_formation text_input"' + (editable ? ' contenteditable="true"' : '') + '>' + Util.escape_text(game.formation) + '</span>';
        html += '<br />';
        html += '<span class="text_input_label">Options code: </span>';
        html += '<span class="open_game_options text_input"' + (editable ? ' contenteditable="true"' : '') + '>' + Util.escape_text(game.options) + '</span>';
        html += '<br />';
        html += '<span class="open_game_button button">' + (editable ? 'Publish game' : 'Join game') + '</span>';
    html += '</div>';

    var el = document.createElement('div');
    Util.add_class(el, 'open_game' + (editable ? ' editable' : ''));
    el.innerHTML = html;

    var els = {
        'players': el.getElementsByClassName('open_game_players')[0],
        'timer': el.getElementsByClassName('open_game_timer')[0],
        'board': el.getElementsByClassName('open_game_board')[0],
        'formation': el.getElementsByClassName('open_game_formation')[0],
        'options': el.getElementsByClassName('open_game_options')[0],
        'button': el.getElementsByClassName('open_game_button')[0],
    };

    this.get_el = function() {return el;};

    this.update_game = function(new_game)
    {
        var update_prop = function(key)
        {
            if (game[key] !== new_game[key])
            {
                var el = els[key];
                el.innerText = game[key] = new_game[key];
                Util.add_class(el, 'open_game_changed');
                setTimeout(function()
                {
                    Util.remove_class(el, 'open_game_changed');
                }, 1000);
            }
        };
        update_prop('players_have');
        update_prop('players_need');
    };

    el.onclick = function()
    {
        Util.toggle_class(el, 'expanded');
    };

    els.button.onclick = function()
    {
        if (editable)
        {
            remote.write({
                'q': 'create_game',
                'game': {
                    'board': els.board.innerText,
                    'formation': els.formation.innerText,
                    'options': els.options.innerText,
                },
            });
            editable = false;
        }
    };

    /*
                <fieldset class="create_game_options">
                    <legend>Create game</legend>
                    <select id="create_game_preset">
                        <option value="">-- Load preset --</option>
                        <option value="5/5,3,e,e,e,e,e,e,n,e,e,e,n,e,e,n,n,n,e,e,n,e,k,e,e,e,n,e,n,n,e,n,n,e,e">Shield</option>
                        <option value="5/3,3,e,e,e,e,e,e,e,k/spawns=10">Spawn from king</option>
                    </select>
                    <br />
                    <label for="create_game_board">Board code: </label>
                    <input id="create_game_board" type="text" value="5" />
                    <br />
                    <label for="create_game_formation">Formation code: </label>
                    <input id="create_game_formation" type="text" value="5,3,e,e,e,e,e,e,n,e,e,e,n,e,e,n,n,n,e,e,n,e,k,e,e,e,n,e,n,n,e,n,n,e,e" />
                    <br />
                    <label for="create_game_options">Options code: </label>
                    <input id="create_game_options" type="text" value="" />
                    <br />
                    <button id="create_game_button">Create game</button>
                </fieldset>
                */
            };
