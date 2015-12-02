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

            switch (sectors)
            {
            case 1:
                // TODO: implement this case
                debugger;
                break;

            case 2:
                // TODO: rotate by s
                add_callback(x, y, type);
                add_callback(y, y - x, type);
                add_callback(-x - y, x, type);
                break;

            case 3:
                add_callback(x, y, type);
                add_callback(-x, -y, type);
                break;

            case 6:
                add_callback(x, y, type);
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
