var game_opts = {
    'board_rad': 5,
    'cell_rad': 45,
    'cell_spacing': 50,
    'piece_rad': 30,
    'action_rad': 20,
    'stroke_width': 1,
    'piece_colors': ['#FFFFFF', '#888888'],
    'piece_king_colors': ['#FF0000', '#0000FF'],
    'piece_actions_colors': ['#FFCCCC', '#CCCCFF'],
    'num_players': 2,
    'num_spawns': 3,
};

// 3 actions:
// 1. Move piece - click on piece, then neighboring cells highlight. Click on highlighted cell to move
// 2. Shoot one or more gliders in sequence - click on glider center piece, then possible destinations highlight. Click on highlighted cell to shoot. Can shoot another afterwards.
// 3. Swap pieces
// In all cases, before clicking "end turn", you can undo your actions

var els;

var primus = Primus.connect();

var game;
var controller;
var renderer;

window.onload = function()
{
    els = {
        'login_container': document.getElementById('login_container'),
        'connect_container': document.getElementById('connect_container'),
        'controls_container': document.getElementById('controls_container'),
        'board_container': document.getElementById('board_container'),

        // Login container
        'login_name': document.getElementById('login_name'),
        'login_submit': document.getElementById('login_submit'),

        // Connect container
        'games_list': document.getElementById('games_list'),
        'create_game_button': document.getElementById('create_game_button'),

        // Controls container
        'end_turn': document.getElementById('control_end_turn'),

        // Board container
        'board': document.getElementById('board'),
    };

    els.login_submit.onclick = function()
    {
        this.setAttribute('disabled', 'disabled');

        primus.write({
            'q': 'login',
            'name': els.login_name.value
        });
    };

    els.create_game_button.onclick = function()
    {

    };

    primus.on('data', function(data)
    {
        if (data.q === 'logged_in')
        {
            els.login_container.style.display = 'none';
        }
        else if (data.q === 'start_game')
        {
            if (renderer) {renderer.destruct();}
            if (controller) {controller.destruct();}
            if (game) {game.destruct();}

            game = new Game(game_opts, 0);
            controller = new GameController(game);
            renderer = new GameRenderer(controller, els);
        }
    });
};
