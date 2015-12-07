var HexGrid = {
    'str_to_grid': function(code_str, meta_callback, add_callback, warning_callback)
    {
        var code = code_str.split(',');
        var radius = parseInt(code[0]) || 5;
        var sectors = parseInt(code[1]) || 1;

        if (radius < 2)
        {
            warning_callback('Radius (' + radius + ') is invalid, must be at least 2');
            radius = 2;
        }

        if (sectors !== 1 && sectors !== 2 && sectors !== 3 && sectors !== 6)
        {
            warning_callback('The number of sectors (' + sectors + ') is invalid, must be a divisor of 6');
            sectors = 1;
        }

        meta_callback(radius, sectors);

        var i = 2;
        var x = 0;
        var y = 0;
        var s = 0;
        while (true)
        {
            var type = code[i];
            if (typeof type === 'string') {type = type.trim();}

            switch (sectors)
            {
            case 1:
                switch (s)
                {
                    case 0:
                        add_callback(x, y-x, type, 0);
                        add_callback(y, -x, type, 1);
                        add_callback(y-x, -y, type, 2);
                        add_callback(-x, x-y, type, 3);
                        add_callback(-y, x, type, 4);
                        add_callback(x-y, y, type, 5);
                        break;
                }
                break;

            case 2:
                switch (s)
                {
                    case 0:
                        add_callback(x, y-x, type, 0);
                        add_callback(y-x, -y, type, 1);
                        add_callback(-y, x, type, 2);
                        break;
                    case 1:
                        add_callback(y, -x, type, 0);
                        add_callback(-x, x-y, type, 1);
                        add_callback(x-y, y, type, 2);
                        break;
                }
                break;

            case 3:
                switch (s)
                {
                    case 0:
                        add_callback(x, y-x, type, 0);
                        add_callback(-x, x-y, type, 1);
                        break;
                    case 1:
                        add_callback(y, -x, type, 0);
                        add_callback(-y, x, type, 1);
                        break;
                    case 2:
                        add_callback(y-x, -y, type, 0);
                        add_callback(x-y, y, type, 1);
                        break;
                }
                break;

            case 6:
                switch (s)
                {
                    case 0: add_callback(x, y-x, type, 0); break;
                    case 1: add_callback(y, -x, type, 0); break;
                    case 2: add_callback(y-x, -y, type, 0); break;
                    case 3: add_callback(-x, x-y, type, 0); break;
                    case 4: add_callback(-y, x, type, 0); break;
                    case 5: add_callback(x-y, y, type, 0); break;
                }
                break;
            }

            i++;
            x++;
            if (x >= y)
            {
                x = 0;
                y++;
                if (y >= radius)
                {
                    y = 0;
                    s++;
                    if (s >= sectors)
                    {
                        break;
                    }
                }
            }
        }

        if (i < code.length)
        {
            warning_callback('There is more code (' + code.length + ' words) than can be handled by the specified radius and number of sectors');
        }
    }
};
